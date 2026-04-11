const router = require('express').Router()
const db     = require('../db')
const { authenticate } = require('../middleware/auth')
const { calcDotScore }  = require('../utils/dotScore')

router.use(authenticate)

// ── POST /health/records ── log a new health reading ─────────────────────────
router.post('/records', async (req, res) => {
  try {
    const { metricType, valuePrimary, valueSecondary, unit, notes, recordedAt } = req.body
    const VALID = ['blood_pressure','weight','heart_rate','blood_glucose','bmi','waist']
    if (!VALID.includes(metricType)) return res.status(400).json({ error: `metricType must be one of: ${VALID.join(', ')}` })
    if (valuePrimary == null)        return res.status(400).json({ error: 'valuePrimary is required' })

    const { rows } = await db.query(
      `INSERT INTO health_records (user_id, metric_type, value_primary, value_secondary, unit, notes, recorded_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [req.user.userId, metricType, valuePrimary, valueSecondary ?? null, unit ?? '', notes ?? null, recordedAt || new Date()]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error('POST /health/records:', err)
    res.status(500).json({ error: 'Failed to save health record' })
  }
})

// ── GET /health/records ── list records, optionally filtered ──────────────────
router.get('/records', async (req, res) => {
  try {
    const { type, days = 90, limit = 200 } = req.query
    let sql    = 'SELECT * FROM health_records WHERE user_id = $1'
    const vals = [req.user.userId]

    if (type) { vals.push(type);          sql += ` AND metric_type = $${vals.length}` }
    vals.push(Number(days));              sql += ` AND recorded_at > NOW() - INTERVAL '1 day' * $${vals.length}`
    vals.push(Math.min(Number(limit), 500)); sql += ` ORDER BY recorded_at DESC LIMIT $${vals.length}`

    const { rows } = await db.query(sql, vals)
    res.json(rows)
  } catch (err) {
    console.error('GET /health/records:', err)
    res.status(500).json({ error: 'Failed to load health records' })
  }
})

// ── GET /health/dot-score ─────────────────────────────────────────────────────
router.get('/dot-score', async (req, res) => {
  try {
  const userId = req.user.userId

  // Fetch most recent value for each metric type
  const { rows: recs } = await db.query(`
    SELECT DISTINCT ON (metric_type)
      metric_type, value_primary, value_secondary, recorded_at
    FROM health_records
    WHERE user_id = $1 AND recorded_at > NOW() - INTERVAL '30 days'
    ORDER BY metric_type, recorded_at DESC
  `, [userId])

  const get = (type) => recs.find(r => r.metric_type === type)
  const bp  = get('blood_pressure')
  const wt  = get('weight')
  const hr  = get('heart_rate')
  const glc = get('blood_glucose')

  // Fetch user for height
  const { rows: users } = await db.query('SELECT * FROM users WHERE id = $1', [userId])
  const user = users[0]

  // Compute streak
  const { rows: streakRows } = await db.query(`
    SELECT checked_in_date FROM daily_checkins
    WHERE user_id = $1 ORDER BY checked_in_date DESC LIMIT 90
  `, [userId])

  let streak = 0
  const today = new Date().toISOString().split('T')[0]
  for (let i = 0; i < streakRows.length; i++) {
    const expected = new Date()
    expected.setDate(expected.getDate() - i)
    const d = expected.toISOString().split('T')[0]
    if (streakRows[i].checked_in_date.toISOString().split('T')[0] === d) streak++
    else break
  }

  const result = calcDotScore({
    systolic:           bp  ? Number(bp.value_primary)   : null,
    diastolic:          bp  ? Number(bp.value_secondary) : null,
    weightLbs:          wt  ? Number(wt.value_primary)   : null,
    heightIn:           user?.height_in ? Number(user.height_in) : null,
    heartRate:          hr  ? Number(hr.value_primary)   : null,
    bloodGlucose:       glc ? Number(glc.value_primary)  : null,
    checkInStreakDays:   streak,
  })

  res.json({ ...result, streak, dotCertExpiry: user?.dot_cert_expiry })
  } catch (err) {
    console.error('GET /health/dot-score:', err)
    res.status(500).json({ error: 'Failed to compute DOT score' })
  }
})

// ── GET /health/trends ────────────────────────────────────────────────────────
router.get('/trends', async (req, res) => {
  try {
    const days = Math.min(Number(req.query.days) || 90, 365)
    const { rows } = await db.query(`
      SELECT metric_type,
             DATE(recorded_at) AS date,
             ROUND(AVG(value_primary)::numeric, 1) AS avg_primary,
             ROUND(AVG(value_secondary)::numeric, 1) AS avg_secondary
      FROM health_records
      WHERE user_id = $1 AND recorded_at > NOW() - INTERVAL '1 day' * $2
      GROUP BY metric_type, DATE(recorded_at)
      ORDER BY metric_type, date ASC
    `, [req.user.userId, days])

    const grouped = rows.reduce((acc, r) => {
      if (!acc[r.metric_type]) acc[r.metric_type] = []
      acc[r.metric_type].push({ date: r.date, value: r.avg_primary, valueSecondary: r.avg_secondary })
      return acc
    }, {})

    res.json(grouped)
  } catch (err) {
    console.error('GET /health/trends:', err)
    res.status(500).json({ error: 'Failed to load health trends' })
  }
})

module.exports = router
