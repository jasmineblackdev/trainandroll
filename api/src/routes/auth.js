const router  = require('express').Router()
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const crypto  = require('crypto')
const db      = require('../db')

const FAILED_ATTEMPTS = {}  // In production use Redis

const signAccess  = (payload) => jwt.sign(payload, process.env.JWT_SECRET,         { expiresIn: process.env.JWT_ACCESS_EXPIRES  || '15m' })
const signRefresh = (payload) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d' })

const tokenPayload = (user) => ({
  userId:  user.id,
  email:   user.email,
  role:    user.role,
  fleetId: user.fleet_id || null,
})

// ── POST /auth/register ───────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, role = 'driver', fleetId } = req.body
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'email, password, firstName, and lastName are required' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }

  try {
    const exists = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'An account with that email already exists' })
    }

    const hash = await bcrypt.hash(password, 12)
    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, fleet_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [email.toLowerCase(), hash, firstName, lastName, role, fleetId || null]
    )
    const user = rows[0]
    const payload = tokenPayload(user)

    const accessToken  = signAccess(payload)
    const refreshToken = signRefresh(payload)
    const tokenHash    = crypto.createHash('sha256').update(refreshToken).digest('hex')
    const expiresAt    = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, tokenHash, expiresAt]
    )

    res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, role: user.role, subscriptionTier: user.subscription_tier },
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// ── POST /auth/login ──────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const key = email.toLowerCase()

  // Brute-force protection
  const attempts = FAILED_ATTEMPTS[key] || { count: 0, lockedUntil: null }
  if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
    return res.status(429).json({ error: 'Account temporarily locked. Try again in 30 minutes.' })
  }

  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [key])
    const user = rows[0]

    const match = user && await bcrypt.compare(password, user.password_hash)
    if (!match) {
      attempts.count++
      if (attempts.count >= 5) {
        attempts.lockedUntil = Date.now() + 30 * 60 * 1000
        attempts.count = 0
      }
      FAILED_ATTEMPTS[key] = attempts
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    delete FAILED_ATTEMPTS[key]

    const payload      = tokenPayload(user)
    const accessToken  = signAccess(payload)
    const refreshToken = signRefresh(payload)
    const tokenHash    = crypto.createHash('sha256').update(refreshToken).digest('hex')
    const expiresAt    = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, tokenHash, expiresAt]
    )

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, role: user.role, subscriptionTier: user.subscription_tier, onboardingComplete: user.onboarding_complete },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

// ── POST /auth/refresh ────────────────────────────────────────────────────────
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' })

  try {
    const payload   = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')

    const { rows } = await db.query(
      'SELECT * FROM refresh_tokens WHERE token_hash = $1 AND user_id = $2 AND expires_at > NOW()',
      [tokenHash, payload.userId]
    )
    if (!rows.length) return res.status(401).json({ error: 'Invalid or expired refresh token' })

    const { rows: users } = await db.query('SELECT * FROM users WHERE id = $1', [payload.userId])
    if (!users.length) return res.status(401).json({ error: 'User not found' })

    const newPayload      = tokenPayload(users[0])
    const newAccessToken  = signAccess(newPayload)
    const newRefreshToken = signRefresh(newPayload)
    const newHash         = crypto.createHash('sha256').update(newRefreshToken).digest('hex')
    const expiresAt       = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await db.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [tokenHash])
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [users[0].id, newHash, expiresAt]
    )

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' })
  }
})

// ── POST /auth/logout ─────────────────────────────────────────────────────────
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body
  if (refreshToken) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    await db.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [tokenHash]).catch(() => {})
  }
  res.json({ message: 'Logged out' })
})

// ── POST /auth/forgot-password ────────────────────────────────────────────────
// Always returns 200 to prevent email enumeration
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'email is required' })

  try {
    const { rows } = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (rows.length) {
      const token     = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await db.query(
        `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id) DO UPDATE SET token_hash = EXCLUDED.token_hash, expires_at = EXCLUDED.expires_at`,
        [rows[0].id, crypto.createHash('sha256').update(token).digest('hex'), expiresAt]
      )
      // TODO: send reset email via SendGrid/Resend
      console.log(`[forgot-password] Reset token for ${email}: ${token}`)
    }
    // Always 200 regardless of whether email exists
    res.json({ message: 'If that email is registered, a reset link has been sent.' })
  } catch (err) {
    console.error('POST /auth/forgot-password:', err)
    res.status(500).json({ error: 'Failed to process request' })
  }
})

// ── POST /auth/reset-password ─────────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body
  if (!token || !password) return res.status(400).json({ error: 'token and password are required' })
  if (password.length < 8)  return res.status(400).json({ error: 'Password must be at least 8 characters' })

  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const { rows } = await db.query(
      'SELECT * FROM password_reset_tokens WHERE token_hash = $1 AND expires_at > NOW()',
      [tokenHash]
    )
    if (!rows.length) return res.status(400).json({ error: 'Reset token is invalid or has expired' })

    const hash = await bcrypt.hash(password, 12)
    await db.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, rows[0].user_id])
    await db.query('DELETE FROM password_reset_tokens WHERE token_hash = $1', [tokenHash])
    // Revoke all refresh tokens on password reset
    await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [rows[0].user_id])

    res.json({ message: 'Password updated successfully. Please log in with your new password.' })
  } catch (err) {
    console.error('POST /auth/reset-password:', err)
    res.status(500).json({ error: 'Failed to reset password' })
  }
})

module.exports = router
