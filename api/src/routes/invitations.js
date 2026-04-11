const router = require('express').Router()
const db     = require('../db')

// ── POST /invite/accept ── public: driver accepts fleet invitation ─────────────
// Called when driver registers via invite link
router.post('/accept', async (req, res) => {
  try {
    const { token, userId } = req.body
    if (!token || !userId) {
      return res.status(400).json({ error: 'token and userId are required' })
    }

    const { rows } = await db.query(
      `SELECT * FROM driver_invitations
       WHERE token = $1 AND expires_at > NOW() AND accepted = false`,
      [token]
    )
    if (!rows.length) return res.status(400).json({ error: 'Invitation not found or expired' })

    const invite = rows[0]

    // Verify user email matches invitation
    const { rows: users } = await db.query('SELECT * FROM users WHERE id = $1', [userId])
    if (!users.length) return res.status(404).json({ error: 'User not found' })
    if (users[0].email !== invite.invited_email) {
      return res.status(400).json({ error: 'Email does not match invitation' })
    }

    // Assign driver to fleet
    await db.query(
      'UPDATE users SET fleet_id = $1, updated_at = NOW() WHERE id = $2',
      [invite.fleet_id, userId]
    )
    await db.query(
      'UPDATE driver_invitations SET accepted = true WHERE token = $1',
      [token]
    )

    res.json({ message: 'You have joined the fleet successfully' })
  } catch (err) {
    console.error('POST /invite/accept:', err)
    res.status(500).json({ error: 'Failed to accept invitation' })
  }
})

module.exports = router
