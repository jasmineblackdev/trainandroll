import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'dw_auth'
const API_URL = import.meta.env.VITE_API_URL

const loadAuth = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(loadAuth)   // { user, accessToken, refreshToken }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const persist = (data) => {
    if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    else localStorage.removeItem(STORAGE_KEY)
    setAuth(data)
  }

  const clearError = () => setError(null)

  const register = async ({ email, password, firstName, lastName }) => {
    setLoading(true)
    setError(null)
    try {
      if (API_URL) {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, firstName, lastName }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Registration failed')
        persist({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken })
        return { ok: true }
      } else {
        // Mock mode
        const mockUser = { id: 'mock-1', email, firstName, lastName, role: 'driver', subscriptionTier: 'free' }
        persist({ user: mockUser, accessToken: 'mock-token', refreshToken: 'mock-refresh' })
        return { ok: true }
      }
    } catch (err) {
      setError(err.message)
      return { ok: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const login = async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      if (API_URL) {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Login failed')
        persist({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken })
        return { ok: true, onboardingComplete: data.user.onboardingComplete }
      } else {
        // Mock mode — accept any credentials
        const mockUser = { id: 'mock-1', email, firstName: 'Demo', lastName: 'Driver', role: 'driver', subscriptionTier: 'free', onboardingComplete: true }
        persist({ user: mockUser, accessToken: 'mock-token', refreshToken: 'mock-refresh' })
        return { ok: true, onboardingComplete: true }
      }
    } catch (err) {
      setError(err.message)
      return { ok: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    if (API_URL && auth?.refreshToken) {
      fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: auth.refreshToken }),
      }).catch(() => {})
    }
    persist(null)
  }

  const updateUser = (fields) => {
    if (!auth) return
    persist({ ...auth, user: { ...auth.user, ...fields } })
  }

  return (
    <AuthContext.Provider value={{
      user:  auth?.user || null,
      token: auth?.accessToken || null,
      isAuthenticated: !!auth?.user,
      loading,
      error,
      clearError,
      register,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
