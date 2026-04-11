/**
 * DriveWell Driver API Service
 *
 * All methods attempt a real API call when VITE_API_URL is set.
 * When the env var is absent (or the request fails), they fall back
 * to the existing localStorage / mock-data layer so the app keeps
 * working during development.
 *
 * Intended API contract (subject to change):
 *
 *   POST   /api/drivers/me/checkins          – submit daily check-in
 *   GET    /api/drivers/me/checkins          – fetch all check-ins
 *   PUT    /api/drivers/me/metrics           – update health metrics
 *   GET    /api/drivers/me/profile           – fetch driver profile
 *   PUT    /api/drivers/me/profile           – update driver profile
 *   POST   /api/drivers/me/workouts          – log a completed workout
 *   GET    /api/drivers/me/workouts          – fetch workout history
 */

import {
  loadCheckIns,
  saveCheckIn,
  getCheckInStreak,
  loadWorkoutLogs,
  saveWorkoutLog,
  getTodayStr,
} from '../data/mockData'

const BASE_URL = import.meta.env.VITE_API_URL // e.g. http://localhost:4000

// ── helpers ──────────────────────────────────────────────────────────────────

const isConfigured = () => Boolean(BASE_URL)

const request = async (method, path, body) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`API ${method} ${path} → ${res.status}`)
  return res.json()
}

// ── Check-ins ─────────────────────────────────────────────────────────────────

/**
 * Submit a daily check-in.
 * @param {string} date  – ISO date string, e.g. "2026-03-27"
 * @param {{ sleep: number, energy: number, stress: number, water: number }} data
 */
export const submitCheckIn = async (date, data) => {
  if (isConfigured()) {
    try {
      return await request('POST', '/api/drivers/me/checkins', { date, ...data })
    } catch (err) {
      console.warn('API unavailable, falling back to localStorage:', err.message)
    }
  }
  saveCheckIn(date, data)
  return { date, ...data }
}

/**
 * Fetch all check-ins keyed by ISO date string.
 * @returns {Promise<Record<string, object>>}
 */
export const getCheckIns = async () => {
  if (isConfigured()) {
    try {
      const result = await request('GET', '/api/drivers/me/checkins')
      // Normalize array response → { [date]: data } map for backwards compat
      if (Array.isArray(result)) {
        return Object.fromEntries(result.map((c) => [c.date, c]))
      }
      return result
    } catch (err) {
      console.warn('API unavailable, falling back to localStorage:', err.message)
    }
  }
  return loadCheckIns()
}

/** Returns the current check-in streak (always derived locally for speed). */
export const getStreak = () => getCheckInStreak()

// ── Health Metrics ────────────────────────────────────────────────────────────

/**
 * Persist updated health metrics for the current driver.
 * @param {{ weight?: number, systolic?: number, diastolic?: number, bloodGlucose?: number }} metrics
 */
export const updateMetrics = async (metrics) => {
  if (isConfigured()) {
    try {
      return await request('PUT', '/api/drivers/me/metrics', metrics)
    } catch (err) {
      console.warn('API unavailable, metrics not persisted remotely:', err.message)
    }
  }
  // No local fallback needed — OnboardingContext already stores metrics in localStorage
  return metrics
}

// ── Driver Profile ────────────────────────────────────────────────────────────

/**
 * Fetch driver profile from the API.
 * Falls back to the onboarding data stored in localStorage.
 * @returns {Promise<object>}
 */
export const getProfile = async () => {
  if (isConfigured()) {
    try {
      return await request('GET', '/api/drivers/me/profile')
    } catch (err) {
      console.warn('API unavailable, falling back to localStorage profile:', err.message)
    }
  }
  try {
    const raw = localStorage.getItem('dw_onboarding_data')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/**
 * Persist driver profile changes.
 * @param {object} profileData
 */
export const updateProfile = async (profileData) => {
  if (isConfigured()) {
    try {
      return await request('PUT', '/api/drivers/me/profile', profileData)
    } catch (err) {
      console.warn('API unavailable, profile not persisted remotely:', err.message)
    }
  }
  // OnboardingContext handles localStorage writes — nothing extra needed here
  return profileData
}

// ── Workouts ──────────────────────────────────────────────────────────────────

/**
 * Log a completed workout session.
 * @param {{ workoutId: number, title: string, duration: number, completedAt: string }} log
 */
export const logWorkout = async (log) => {
  if (isConfigured()) {
    try {
      return await request('POST', '/api/drivers/me/workouts', log)
    } catch (err) {
      console.warn('API unavailable, falling back to localStorage:', err.message)
    }
  }
  saveWorkoutLog(log)
  return log
}

/**
 * Fetch workout history for the current driver.
 * @returns {Promise<Array>}
 */
export const getWorkoutLogs = async () => {
  if (isConfigured()) {
    try {
      return await request('GET', '/api/drivers/me/workouts')
    } catch (err) {
      console.warn('API unavailable, falling back to localStorage:', err.message)
    }
  }
  return loadWorkoutLogs()
}

// ── Convenience re-exports ────────────────────────────────────────────────────

export { getTodayStr }
