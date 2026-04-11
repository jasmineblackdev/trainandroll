import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Check } from 'lucide-react'

const rules = [
  { label: 'At least 8 characters', test: p => p.length >= 8 },
  { label: 'Contains a number',      test: p => /\d/.test(p) },
]

const Register = ({ onSwitch }) => {
  const { register, loading, error, clearError } = useAuth()
  const [form, setForm]         = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [localErr, setLocalErr] = useState('')

  const set = (k, v) => { clearError(); setLocalErr(''); setForm(f => ({ ...f, [k]: v })) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setLocalErr('Passwords do not match'); return }
    if (form.password.length < 8) { setLocalErr('Password must be at least 8 characters'); return }

    await register({
      email:     form.email.trim(),
      password:  form.password,
      firstName: form.firstName.trim(),
      lastName:  form.lastName.trim(),
    })
  }

  const displayError = localErr || error

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <img src="/logo.png" alt="Train&Roll" style={{ height: '60px', width: 'auto', marginBottom: '8px' }} />
          <p style={styles.tagline}>CDL Driver Wellness</p>
        </div>

        <h2 style={styles.heading}>Create your account</h2>
        <p style={styles.sub}>Free plan • No credit card required</p>

        {displayError && <div style={styles.errorBox}>{displayError}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>First Name</label>
              <input
                value={form.firstName}
                onChange={e => set('firstName', e.target.value)}
                placeholder="John"
                required
                style={styles.input}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Last Name</label>
              <input
                value={form.lastName}
                onChange={e => set('lastName', e.target.value)}
                placeholder="Smith"
                required
                style={styles.input}
              />
            </div>
          </div>

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
              autoComplete="new-password"
              required
              style={{ ...styles.input, paddingRight: '44px', marginBottom: 0 }}
            />
            <button type="button" style={styles.eyeBtn} onClick={() => setShowPass(p => !p)}>
              {showPass ? <EyeOff size={18} color="#6b7280" /> : <Eye size={18} color="#6b7280" />}
            </button>
          </div>

          {/* Password strength indicators */}
          {form.password.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              {rules.map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: r.test(form.password) ? '#059669' : '#9ca3af', marginTop: '4px' }}>
                  <Check size={12} />
                  {r.label}
                </div>
              ))}
            </div>
          )}

          <label style={styles.label}>Confirm Password</label>
          <input
            type={showPass ? 'text' : 'password'}
            value={form.confirm}
            onChange={e => set('confirm', e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={styles.terms}>
          By signing up you agree to our Terms of Service and Privacy Policy
        </p>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <button onClick={onSwitch} style={styles.linkBtn}>Sign In</button>
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
    maxWidth: '440px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  },
  logo: {
    textAlign: 'center',
    marginBottom: '28px',
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
    marginBottom: '4px',
  },
  sub: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '20px',
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
  row: {
    display: 'flex',
    gap: '12px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px',
    marginTop: '10px',
    display: 'block',
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
    marginTop: '20px',
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
  terms: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '12px',
  },
  switchText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '16px',
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

export default Register
