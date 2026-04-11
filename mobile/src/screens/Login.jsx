import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

const Login = ({ onSwitch }) => {
  const { login, loading, error, clearError } = useAuth()
  const [form, setForm]           = useState({ email: '', password: '' })
  const [showPass, setShowPass]   = useState(false)

  const set = (k, v) => { clearError(); setForm(f => ({ ...f, [k]: v })) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return
    await login({ email: form.email.trim(), password: form.password })
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <img src="/logo.png" alt="Train&Roll" style={{ height: '60px', width: 'auto', marginBottom: '8px' }} />
          <p style={styles.tagline}>CDL Driver Wellness</p>
        </div>

        <h2 style={styles.heading}>Welcome back</h2>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <div style={styles.passWrap}>
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={e => set('password', e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              style={{ ...styles.input, paddingRight: '44px', marginBottom: 0 }}
            />
            <button type="button" style={styles.eyeBtn} onClick={() => setShowPass(p => !p)}>
              {showPass ? <EyeOff size={18} color="#6b7280" /> : <Eye size={18} color="#6b7280" />}
            </button>
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <button onClick={onSwitch} style={styles.linkBtn}>Sign Up</button>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    padding: '24px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px 32px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  },
  logo: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  brand: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#111827',
    margin: '8px 0 4px',
  },
  tagline: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  heading: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '24px',
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    color: '#dc2626',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px',
    marginTop: '12px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '4px',
  },
  passWrap: {
    position: 'relative',
    marginBottom: '4px',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
  },
  btn: {
    marginTop: '24px',
    padding: '14px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
  switchText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '20px',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    padding: 0,
  },
}

export default Login
