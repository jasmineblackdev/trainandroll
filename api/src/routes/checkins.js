const router = require('express').Router()
const db     = require('../db')
const { authenticate } = require('../middleware/auth')

router.use(authenticate)

// ── POST /checkin ─────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { sleepQuality, energyLevel, stressLevel, waterIntakeOz, date } = req.body
    const checkinDate = date || new Date().toISOString().split('T')[0]

    if ([sleepQuality, energyLevel, stressLevel].some(v => v == null || v < 1 || v > 5)) {
      return res.status(400).json({ error: 'sleepQuality, energyLevel, stressLevel must be 1–5' })
    }

    const { rows } = await db.query(`
      INSERT INTO daily_checkins (user_id, checked_in_date, sleep_quality, energy_level, stress_level, water_intake_oz)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, checked_in_date) DO UPDATE
        SET sleep_quality   = EXCLUDED.sleep_quality,
            energy_level    = EXCLUDED.energy_level,
            stress_level    = EXCLUDED.stress_level,
            water_intake_oz = EXCLUDED.water_intake_oz
      RETURNING *
    `, [req.user.userId, checkinDate, sleepQuality, energyLevel, stressLevel, waterIntakeOz ?? 0])

    res.status(201).json(rows[0])
  } catch (err) {
    console.error('POST /checkin:', err)
    res.status(500).json({ error: 'Failed to save check-in' })
  }
})

// ── GET /checkin/today ────────────────────────────────────────────────────────
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { rows } = await db.query(
      'SELECT * FROM daily_checkins WHERE user_id=$1 AND checked_in_date=$2',
      [req.user.userId, today]
    )
    res.json(rows[0] || null)
  } catch (err) {
    console.error('GET /checkin/today:', err)
    res.status(500).json({ error: 'Failed to load today\'s check-in' })
  }
})

// ── GET /checkin/history ──────────────────────────────────────────────────────
router.get('/history', async (req, res) => {
  try {
    const days = Math.min(Number(req.query.days) || 90, 365)
    const { rows } = await db.query(`
      SELECT * FROM daily_checkins
      WHERE user_id = $1 AND checked_in_date > CURRENT_DATE - INTERVAL '1 day' * $2
      ORDER BY checked_in_date DESC
    `, [req.user.userId, days])

    let streak = 0
    const sorted = rows.slice().sort((a, b) => new Date(b.checked_in_date) - new Date(a.checked_in_date))
    for (let i = 0; i < sorted.length; i++) {
      const expected = new Date()
      expected.setDate(expected.getDate() - i)
      const d = expected.toISOString().split('T')[0]
      if (new Date(sorted[i].checked_in_date).toISOString().split('T')[0] === d) streak++
      else break
    }

    res.json({ checkins: rows, streak })
  } catch (err) {
    console.error('GET /checkin/history:', err)
    res.status(500).json({ error: 'Failed to load check-in history' })
  }
})

module.exports = router
