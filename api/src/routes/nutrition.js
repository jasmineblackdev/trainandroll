const router = require('express').Router()
const db     = require('../db')
const { authenticate } = require('../middleware/auth')

router.use(authenticate)

// ── POST /nutrition/log ── add a food entry for a date ────────────────────────
router.post('/log', async (req, res) => {
  try {
    const { foodName, calories, proteinG, carbsG, fatG, sodiumMg, date } = req.body

    if (!foodName) return res.status(400).json({ error: 'foodName is required' })
    if (calories == null || calories < 0) return res.status(400).json({ error: 'calories must be a non-negative number' })

    const loggedDate = date || new Date().toISOString().split('T')[0]

    const { rows } = await db.query(
      `INSERT INTO nutrition_logs (user_id, logged_date, food_name, calories, protein_g, carbs_g, fat_g, sodium_mg)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        req.user.userId,
        loggedDate,
        foodName,
        calories,
        proteinG  ?? 0,
        carbsG    ?? 0,
        fatG      ?? 0,
        sodiumMg  ?? 0,
      ]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error('POST /nutrition/log:', err)
    res.status(500).json({ error: 'Failed to save nutrition entry' })
  }
})

// ── GET /nutrition/log ── get food log for a specific date ────────────────────
router.get('/log', async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0]

    const { rows } = await db.query(
      `SELECT * FROM nutrition_logs
       WHERE user_id = $1 AND logged_date = $2
       ORDER BY created_at ASC`,
      [req.user.userId, date]
    )

    const totals = rows.reduce(
      (acc, r) => ({
        calories:  acc.calories  + (r.calories || 0),
        proteinG:  acc.proteinG  + Number(r.protein_g || 0),
        carbsG:    acc.carbsG    + Number(r.carbs_g   || 0),
        fatG:      acc.fatG      + Number(r.fat_g     || 0),
        sodiumMg:  acc.sodiumMg  + (r.sodium_mg || 0),
      }),
      { calories: 0, proteinG: 0, carbsG: 0, fatG: 0, sodiumMg: 0 }
    )

    res.json({ date, entries: rows, totals })
  } catch (err) {
    console.error('GET /nutrition/log:', err)
    res.status(500).json({ error: 'Failed to load nutrition log' })
  }
})

// ── DELETE /nutrition/log/:id ── remove a food entry ─────────────────────────
router.delete('/log/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM nutrition_logs WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.userId]
    )
    if (!rows.length) return res.status(404).json({ error: 'Entry not found' })
    res.json({ message: 'Entry deleted' })
  } catch (err) {
    console.error('DELETE /nutrition/log/:id:', err)
    res.status(500).json({ error: 'Failed to delete entry' })
  }
})

// ── GET /nutrition/summary ── daily calorie/macro totals for N days ───────────
router.get('/summary', async (req, res) => {
  try {
    const days = Math.min(Number(req.query.days) || 7, 90)

    const { rows } = await db.query(
      `SELECT
         logged_date AS date,
         SUM(calories)          AS calories,
         ROUND(SUM(protein_g)::numeric, 1) AS protein_g,
         ROUND(SUM(carbs_g)::numeric, 1)   AS carbs_g,
         ROUND(SUM(fat_g)::numeric, 1)     AS fat_g,
         SUM(sodium_mg)         AS sodium_mg,
         COUNT(*)               AS entry_count
       FROM nutrition_logs
       WHERE user_id = $1 AND logged_date >= CURRENT_DATE - $2
       GROUP BY logged_date
       ORDER BY logged_date DESC`,
      [req.user.userId, days]
    )

    res.json(rows)
  } catch (err) {
    console.error('GET /nutrition/summary:', err)
    res.status(500).json({ error: 'Failed to load nutrition summary' })
  }
})

module.exports = router
