const router  = require('express').Router()
const crypto  = require('crypto')
const db      = require('../db')
const { authenticate, requireRole } = require('../middleware/auth')

router.use(authenticate)
router.use(requireRole('fleet_admin', 'admin'))

// ── GET /fleet/me ── current admin's fleet info ───────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM fleets WHERE id = $1', [req.user.fleetId])
    if (!rows.length) return res.status(404).json({ error: 'Fleet not found' })
    res.json(rows[0])
  } catch (err) {
    console.error('GET /fleet/me:', err)
    res.status(500).json({ error: 'Failed to load fleet' })
  }
})

// ── GET /fleet/drivers ── all drivers in fleet (anonymized per HIPAA) ─────────
router.get('/drivers', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        u.id,
        u.first_name || ' ' || LEFT(u.last_name, 1) || '.' AS display_name,
        u.dot_cert_expiry,
        u.created_at AS joined_at,
        (SELECT checked_in_date FROM daily_checkins
         WHERE user_id = u.id ORDER BY checked_in_date DESC LIMIT 1) AS last_checkin,
        (SELECT COUNT(*) FROM health_records
         WHERE user_id = u.id AND recorded_at > NOW() - INTERVAL '30 days') AS records_30d,
        (SELECT COUNT(*) FROM (
          SELECT checked_in_date,
                 checked_in_date - (ROW_NUMBER() OVER (ORDER BY checked_in_date))::int AS grp
          FROM daily_checkins WHERE user_id = u.id
        ) g GROUP BY grp ORDER BY MAX(checked_in_date) DESC LIMIT 1
        ) AS current_streak
      FROM users u
      WHERE u.fleet_id = $1 AND u.role = 'driver'
      ORDER BY u.last_name, u.first_name
    `, [req.user.fleetId])
    res.json(rows)
  } catch (err) {
    console.error('GET /fleet/drivers:', err)
    res.status(500).json({ error: 'Failed to load drivers' })
  }
})

// ── GET /fleet/stats ── aggregate fleet-level wellness stats ──────────────────
router.get('/stats', async (req, res) => {
  try {
    const fleetId = req.user.fleetId

    const { rows: driverRows } = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE fleet_id = $1 AND role = 'driver'",
      [fleetId]
    )
    const totalDrivers = Number(driverRows[0].total)

    const { rows: activeRows } = await db.query(`
      SELECT COUNT(DISTINCT u.id) AS active
      FROM users u
      JOIN daily_checkins dc ON dc.user_id = u.id
      WHERE u.fleet_id = $1 AND dc.checked_in_date >= CURRENT_DATE - 6
    `, [fleetId])
    const activeThisWeek = Number(activeRows[0].active)

    const { rows: expiryRows } = await db.query(`
      SELECT COUNT(*) AS expiring
      FROM users
      WHERE fleet_id = $1 AND dot_cert_expiry IS NOT NULL
        AND dot_cert_expiry BETWEEN CURRENT_DATE AND CURRENT_DATE + 60
    `, [fleetId])
    const certExpiringSoon = Number(expiryRows[0].expiring)

    const { rows: rateRows } = await db.query(`
      SELECT ROUND(
        COUNT(DISTINCT dc.user_id)::numeric / NULLIF($2, 0) * 100, 1
      ) AS checkin_rate
      FROM daily_checkins dc
      JOIN users u ON u.id = dc.user_id
      WHERE u.fleet_id = $1 AND dc.checked_in_date >= CURRENT_DATE - 29
    `, [fleetId, totalDrivers])
    const checkInRate = Number(rateRows[0].checkin_rate) || 0

    res.json({ totalDrivers, activeThisWeek, certExpiringSoon, checkInRate })
  } catch (err) {
    console.error('GET /fleet/stats:', err)
    res.status(500).json({ error: 'Failed to load fleet stats' })
  }
})

// ── GET /fleet/alerts ── drivers needing attention ────────────────────────────
router.get('/alerts', async (req, res) => {
  try {
    const fleetId = req.user.fleetId

    const { rows: inactiveRows } = await db.query(`
      SELECT
        u.id,
        u.first_name || ' ' || LEFT(u.last_name, 1) || '.' AS display_name,
        MAX(dc.checked_in_date) AS last_checkin
      FROM users u
      LEFT JOIN daily_checkins dc ON dc.user_id = u.id
      WHERE u.fleet_id = $1 AND u.role = 'driver'
      GROUP BY u.id, u.first_name, u.last_name
      HAVING MAX(dc.checked_in_date) < CURRENT_DATE - 3 OR MAX(dc.checked_in_date) IS NULL
      ORDER BY last_checkin ASC NULLS FIRST
      LIMIT 20
    `, [fleetId])

    const { rows: certRows } = await db.query(`
      SELECT id,
             first_name || ' ' || LEFT(last_name, 1) || '.' AS display_name,
             dot_cert_expiry
      FROM users
      WHERE fleet_id = $1 AND dot_cert_expiry IS NOT NULL
        AND dot_cert_expiry BETWEEN CURRENT_DATE AND CURRENT_DATE + 30
      ORDER BY dot_cert_expiry ASC
    `, [fleetId])

    res.json({
      inactiveDrivers: inactiveRows.map(r => ({ ...r, alertType: 'missed_checkin' })),
      expiringCerts:   certRows.map(r => ({ ...r, alertType: 'cert_expiry' })),
    })
  } catch (err) {
    console.error('GET /fleet/alerts:', err)
    res.status(500).json({ error: 'Failed to load alerts' })
  }
})

// ── GET /fleet/trends ── fleet-wide wellness trends (anonymized) ───────────────
router.get('/trends', async (req, res) => {
  try {
    const days = Math.min(Number(req.query.days) || 30, 90)
    const { rows } = await db.query(`
      SELECT
        DATE(dc.checked_in_date) AS date,
        COUNT(*) AS checkins,
        ROUND(AVG(dc.sleep_quality)::numeric, 2) AS avg_sleep,
        ROUND(AVG(dc.energy_level)::numeric, 2) AS avg_energy,
        ROUND(AVG(dc.stress_level)::numeric, 2) AS avg_stress
      FROM daily_checkins dc
      JOIN users u ON u.id = dc.user_id
      WHERE u.fleet_id = $1 AND dc.checked_in_date >= CURRENT_DATE - $2
      GROUP BY DATE(dc.checked_in_date)
      ORDER BY date ASC
    `, [req.user.fleetId, days])
    res.json(rows)
  } catch (err) {
    console.error('GET /fleet/trends:', err)
    res.status(500).json({ error: 'Failed to load trends' })
  }
})

// ── POST /fleet/invite ── invite a driver by email ────────────────────────────
router.post('/invite', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'email is required' })

    const token     = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await db.query(
      `INSERT INTO driver_invitations (fleet_id, invited_email, token, expires_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (fleet_id, invited_email) DO UPDATE
         SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at, accepted = false`,
      [req.user.fleetId, email.toLowerCase(), token, expiresAt]
    )

    // TODO: send invitation email via SendGrid/Resend with token link
    console.log(`[invite] Token for ${email}: ${token}`)

    res.status(201).json({ message: `Invitation created for ${email}`, inviteToken: token, expiresAt })
  } catch (err) {
    console.error('POST /fleet/invite:', err)
    res.status(500).json({ error: 'Failed to create invitation' })
  }
})

// ── GET /fleet/invitations ── list pending invitations ────────────────────────
router.get('/invitations', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT invited_email, created_at, expires_at, accepted
      FROM driver_invitations WHERE fleet_id = $1 ORDER BY created_at DESC
    `, [req.user.fleetId])
    res.json(rows)
  } catch (err) {
    console.error('GET /fleet/invitations:', err)
    res.status(500).json({ error: 'Failed to load invitations' })
  }
})

// ── DELETE /fleet/drivers/:userId ── remove a driver from fleet ───────────────
router.delete('/drivers/:userId', async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT id FROM users WHERE id = $1 AND fleet_id = $2 AND role = 'driver'",
      [req.params.userId, req.user.fleetId]
    )
    if (!rows.length) return res.status(404).json({ error: 'Driver not found in your fleet' })

    await db.query(
      'UPDATE users SET fleet_id = NULL, updated_at = NOW() WHERE id = $1',
      [req.params.userId]
    )
    res.json({ message: 'Driver removed from fleet' })
  } catch (err) {
    console.error('DELETE /fleet/drivers/:userId:', err)
    res.status(500).json({ error: 'Failed to remove driver' })
  }
})

module.exports = router
