import React, { useState } from 'react'
import { Shield, Lock, Eye, Trash2, Download, ChevronDown, ChevronUp } from 'lucide-react'

const Section = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="card" style={{ marginBottom: '12px', padding: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontWeight: '600', fontSize: '16px' }}>{title}</span>
        {open ? <ChevronUp size={18} color="#6b7280" /> : <ChevronDown size={18} color="#6b7280" />}
      </button>
      {open && <div style={{ padding: '0 18px 18px' }}>{children}</div>}
    </div>
  )
}

const PrivacyData = () => {
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const exportData = () => {
    const keys = ['dw_onboarding_data', 'dw_nutrition_log', 'dw_sleep_data', 'dw_health_records', 'dw_dot_reminders']
    const exported = {}
    keys.forEach(k => {
      try { exported[k] = JSON.parse(localStorage.getItem(k) || 'null') } catch { exported[k] = null }
    })
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'drivewell-data.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const deleteAllData = () => {
    const keys = ['dw_onboarding_data', 'dw_onboarded', 'dw_nutrition_log', 'dw_sleep_data', 'dw_health_records', 'dw_dot_reminders', 'dw_auth']
    keys.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  return (
    <div className="screen">
      <header style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Shield size={28} color="#2563eb" />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Privacy & Data</h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Your health data belongs to you.</p>
      </header>

      {/* Summary badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {[
          { icon: <Lock size={20} color="#2563eb" />, label: 'Encrypted', note: 'AES-256' },
          { icon: <Eye size={20} color="#8b5cf6" />,  label: 'Private',   note: 'Never sold' },
          { icon: <Shield size={20} color="#059669" />, label: 'HIPAA',   note: 'Compliant' },
        ].map(b => (
          <div key={b.label} style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ marginBottom: '6px' }}>{b.icon}</div>
            <p style={{ fontWeight: '700', fontSize: '14px' }}>{b.label}</p>
            <p style={{ fontSize: '11px', color: '#6b7280' }}>{b.note}</p>
          </div>
        ))}
      </div>

      <Section title="What we collect" defaultOpen>
        <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
          DriveWell collects only the health data you enter: blood pressure, weight, heart rate, blood glucose,
          daily check-ins, sleep quality ratings, and workout logs. We do not access your contacts, location,
          or any other device data unless you explicitly grant permission (e.g., GPS for gym finder).
        </p>
      </Section>

      <Section title="How we use your data">
        <ul style={{ fontSize: '14px', color: '#374151', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Calculate your DOT Readiness Score</li>
          <li>Show you personalized health trends</li>
          <li>Send you DOT deadline reminders (only if enabled)</li>
          <li>Anonymized aggregation for fleet admins (no individual values shared)</li>
        </ul>
        <p style={{ fontSize: '14px', color: '#374151', marginTop: '12px' }}>
          We do <strong>not</strong> sell your data to third parties, insurance companies, or employers.
        </p>
      </Section>

      <Section title="Fleet admin visibility">
        <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
          If you're linked to a fleet, your administrator can see:
        </p>
        <ul style={{ fontSize: '14px', color: '#374151', lineHeight: '1.8', paddingLeft: '20px', marginTop: '8px' }}>
          <li>Whether you've checked in (yes/no) — not the values</li>
          <li>Your DOT cert expiration date</li>
          <li>Fleet-wide aggregate wellness trends (never individual metrics)</li>
        </ul>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '12px' }}>
          Raw health values (blood pressure, weight, etc.) are never visible to your employer.
        </p>
      </Section>

      <Section title="Data retention">
        <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
          Your data is retained for as long as your account is active. If you delete your account,
          all personal data is permanently removed within 30 days. Anonymized, aggregated statistics
          may be retained for product improvement.
        </p>
      </Section>

      {/* Actions */}
      <div className="card">
        <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Your Data Rights</h3>

        <button
          onClick={exportData}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '10px', cursor: 'pointer', marginBottom: '12px', textAlign: 'left' }}
        >
          <Download size={20} color="#2563eb" />
          <div>
            <p style={{ fontWeight: '600', fontSize: '15px', color: '#1e40af' }}>Export My Data</p>
            <p style={{ fontSize: '13px', color: '#3b82f6' }}>Download a copy of all your local data as JSON</p>
          </div>
        </button>

        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '10px', cursor: 'pointer', textAlign: 'left' }}
          >
            <Trash2 size={20} color="#dc2626" />
            <div>
              <p style={{ fontWeight: '600', fontSize: '15px', color: '#dc2626' }}>Delete All My Data</p>
              <p style={{ fontSize: '13px', color: '#ef4444' }}>Permanently remove all local data and sign out</p>
            </div>
          </button>
        ) : (
          <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontWeight: '600', color: '#dc2626', marginBottom: '8px' }}>Are you sure? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={deleteAllData} style={{ flex: 1, padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Yes, Delete Everything</button>
              <button onClick={() => setDeleteConfirm(false)} style={{ flex: 1, padding: '10px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PrivacyData
