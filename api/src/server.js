require('dotenv').config()

const express     = require('express')
const cors        = require('cors')
const helmet      = require('helmet')
const morgan      = require('morgan')
const rateLimit   = require('express-rate-limit')

const authRoutes        = require('./routes/auth')
const userRoutes        = require('./routes/users')
const healthRoutes      = require('./routes/health')
const checkinRoutes     = require('./routes/checkins')
const workoutRoutes     = require('./routes/workouts')
const fleetRoutes       = require('./routes/fleet')
const invitationRoutes  = require('./routes/invitations')
const nutritionRoutes   = require('./routes/nutrition')

const app  = express()
const PORT = process.env.PORT || 3000

// ── Security / middleware ──────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'],
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ── Global rate limits ─────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts, please slow down.' },
})

app.use(globalLimiter)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/auth',    authLimiter, authRoutes)
app.use('/users',   userRoutes)
app.use('/health',  healthRoutes)
app.use('/checkin', checkinRoutes)
app.use('/workouts', workoutRoutes)
app.use('/fleet',   fleetRoutes)
app.use('/invite',    invitationRoutes)
app.use('/nutrition', nutritionRoutes)

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Unhandled error]', err)
  res.status(500).json({ error: 'Internal server error' })
})

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`DriveWell API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
})

module.exports = app
