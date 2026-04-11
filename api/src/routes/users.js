const router  = require('express').Router()
const bcrypt  = require('bcryptjs')
const db      = require('../db')
const { authenticate } = require('../middleware/auth')

router.use(authenticate)

// ── GET /users/me ── current user profile ─────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, email, first_name, last_name, role, fleet_id,
              subscription_tier, onboarding_complete,
              height_in, date_of_birth, phone, dot_cert_expiry,
              created_at
       FROM users WHERE id = $1`,
      [req.user.userId]
    )
    if (!rows.length) return res.status(404).json({ error: 'User not found' })
    const u = rows[0]
    res.json({
      id:                  u.id,
      email:               u.email,
      firstName:           u.first_name,
      lastName:            u.last_name,
      role:                u.role,
      fleetId:             u.fleet_id,
      subscriptionTier:    u.subscription_tier,
      onboardingComplete:  u.onboarding_complete,
      heightIn:            u.height_in,
      dateOfBirth:         u.date_of_birth,
      phone:               u.phone,
      dotCertExpiry:       u.dot_cert_expiry,
      createdAt:           u.created_at,
    })
  } catch (err) {
    console.error('GET /users/me:', err)
    res.status(500).json({ error: 'Failed to load profile' })
  }
})

// ── PUT /users/me ── update profile ───────────────────────────────────────────
router.put('/me', async (req, res) => {
  try {
    const { firstName, lastName, phone, heightIn, dateOfBirth, dotCertExpiry, onboardingComplete, cdlNumber } = req.body

    const updates = []
    const vals    = []

    const setCol = (col, val) => { vals.push(val); updates.push(`${col} = $${vals.length}`) }

    if (firstName          != null) setCol('first_name',          firstName)
    if (lastName           != null) setCol('last_name',           lastName)
    if (phone              != null) setCol('phone',               phone)
    if (heightIn           != null) setCol('height_in',           heightIn)
    if (dateOfBirth        != null) setCol('date_of_birth',       dateOfBirth)
    if (dotCertExpiry      != null) setCol('dot_cert_expiry',     dotCertExpiry)
    if (onboardingComplete != null) setCol('onboarding_complete', onboardingComplete)
    if (cdlNumber          != null) setCol('cdl_number',          cdlNumber)

    if (!updates.length) return res.status(400).json({ error: 'No fields to update' })

    vals.push(req.user.userId)
    const { rows } = await db.query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${vals.length} RETURNING *`,
      vals
    )

    const u = rows[0]
    res.json({
      id:                  u.id,
      email:               u.email,
      firstName:           u.first_name,
      lastName:            u.last_name,
      role:                u.role,
      fleetId:             u.fleet_id,
      subscriptionTier:    u.subscription_tier,
      onboardingComplete:  u.onboarding_complete,
      heightIn:            u.height_in,
      dateOfBirth:         u.date_of_birth,
      phone:               u.phone,
      dotCertExpiry:       u.dot_cert_expiry,
    })
  } catch (err) {
    console.error('PUT /users/me:', err)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// ── PUT /users/me/password ── change password ─────────────────────────────────
router.put('/me/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'currentPassword and newPassword are required' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }

    const { rows } = await db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.userId])
    if (!rows.length) return res.status(404).json({ error: 'User not found' })

    const match = await bcrypt.compare(currentPassword, rows[0].password_hash)
    if (!match) return res.status(401).json({ error: 'Current password is incorrect' })

    const hash = await bcrypt.hash(newPassword, 12)
    await db.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, req.user.userId])

    // Revoke all refresh tokens so all other sessions are logged out
    await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [req.user.userId])

    res.json({ message: 'Password updated. All other sessions have been logged out.' })
  } catch (err) {
    console.error('PUT /users/me/password:', err)
    res.status(500).json({ error: 'Failed to update password' })
  }
})

// ── PUT /users/me/notifications ── update notification preferences ────────────
router.put('/me/notifications', async (req, res) => {
  try {
    const { dotReminders, streaks, checkinPrompts, weeklySummary } = req.body

    const prefs = {}
    if (dotReminders    != null) prefs.dot_reminders   = Boolean(dotReminders)
    if (streaks         != null) prefs.streaks          = Boolean(streaks)
    if (checkinPrompts  != null) prefs.checkin_prompts  = Boolean(checkinPrompts)
    if (weeklySummary   != null) prefs.weekly_summary   = Boolean(weeklySummary)

    if (!Object.keys(prefs).length) return res.status(400).json({ error: 'No notification preferences provided' })

    // Merge with existing prefs using jsonb ||
    const { rows } = await db.query(
      `UPDATE users SET notification_prefs = notification_prefs || $1::jsonb, updated_at = NOW()
       WHERE id = $2 RETURNING notification_prefs`,
      [JSON.stringify(prefs), req.user.userId]
    )
    res.json({ notificationPrefs: rows[0].notification_prefs })
  } catch (err) {
    console.error('PUT /users/me/notifications:', err)
    res.status(500).json({ error: 'Failed to update notification preferences' })
  }
})

module.exports = router
