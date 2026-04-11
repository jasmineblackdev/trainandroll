const router = require('express').Router()
const db     = require('../db')
const { authenticate } = require('../middleware/auth')

router.use(authenticate)

// ── GET /workouts/logs/me ── current user's workout history ───────────────────
// Must be declared before /:id to avoid "logs" matching as an :id param
router.get('/logs/me', async (req, res) => {
  try {
    const days = Math.min(Number(req.query.days) || 30, 365)
    const { rows } = await db.query(`
      SELECT wl.*, w.title, w.location_type, w.difficulty
      FROM workout_logs wl
      LEFT JOIN workouts w ON w.id = wl.workout_id
      WHERE wl.user_id = $1
        AND wl.completed_at > NOW() - INTERVAL '1 day' * $2
      ORDER BY wl.completed_at DESC
    `, [req.user.userId, days])

    const totalMinutes  = rows.reduce((s, r) => s + (r.duration_minutes  || 0), 0)
    const totalCalories = rows.reduce((s, r) => s + (r.calories_burned || 0), 0)

    res.json({ logs: rows, summary: { totalSessions: rows.length, totalMinutes, totalCalories } })
  } catch (err) {
    console.error('GET /workouts/logs/me:', err)
    res.status(500).json({ error: 'Failed to load workout history' })
  }
})

// ── GET /workouts ── list available workouts (catalog) ────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, limit = 50 } = req.query
    let sql    = 'SELECT * FROM workouts WHERE is_published = true'
    const vals = []

    if (category) {
      vals.push(category)
      sql += ` AND location_type = $${vals.length}`
    }
    if (difficulty) {
      vals.push(difficulty)
      sql += ` AND difficulty = $${vals.length}`
    }
    vals.push(Math.min(Number(limit), 200))
    sql += ` ORDER BY title ASC LIMIT $${vals.length}`

    const { rows } = await db.query(sql, vals)
    res.json(rows)
  } catch (err) {
    console.error('GET /workouts:', err)
    res.status(500).json({ error: 'Failed to load workouts' })
  }
})

// ── GET /workouts/:id ── single workout detail ────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM workouts WHERE id = $1 AND is_published = true',
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Workout not found' })
    res.json(rows[0])
  } catch (err) {
    console.error('GET /workouts/:id:', err)
    res.status(500).json({ error: 'Failed to load workout' })
  }
})

// ── POST /workouts/:id/log ── log a completed workout session ─────────────────
router.post('/:id/log', async (req, res) => {
  try {
    const { durationMinutes, caloriesBurned, notes, completedAt } = req.body
    const workoutId = req.params.id

    const { rows: wrows } = await db.query(
      'SELECT id, title FROM workouts WHERE id = $1 AND is_published = true',
      [workoutId]
    )
    if (!wrows.length) return res.status(404).json({ error: 'Workout not found' })

    if (!durationMinutes || durationMinutes < 1) {
      return res.status(400).json({ error: 'durationMinutes is required (min 1)' })
    }

    const { rows } = await db.query(
      `INSERT INTO workout_logs (user_id, workout_id, workout_title, duration_minutes, calories_burned, notes, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        req.user.userId,
        workoutId,
        wrows[0].title,
        durationMinutes,
        caloriesBurned ?? null,
        notes ?? null,
        completedAt || new Date(),
      ]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error('POST /workouts/:id/log:', err)
    res.status(500).json({ error: 'Failed to log workout' })
  }
})

module.exports = router
