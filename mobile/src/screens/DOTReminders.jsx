import React, { useState, useEffect } from 'react'
import { Bell, Calendar, Plus, Trash2, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

const STORAGE_KEY = 'dw_dot_reminders'

const defaultReminders = [
  { id: 1, title: 'DOT Physical Exam', date: '', daysNotice: 30, recurring: false, notes: '' },
]

const diffDays = (dateStr) => {
  if (!dateStr) return null
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
  return diff
}

const urgency = (days) => {
  if (days == null) return 'neutral'
  if (days < 0) return 'overdue'
  if (days <= 14) return 'urgent'
  if (days <= 30) return 'soon'
  return 'ok'
}

const DOTReminders = () => {
  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultReminders } catch { return defaultReminders }
  })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ title: '', date: '', daysNotice: 14, notes: '' })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
  }, [reminders])

  const add = () => {
    if (!form.title || !form.date) return
    setReminders(prev => [...prev, { ...form, id: Date.now() }])
    setForm({ title: '', date: '', daysNotice: 14, notes: '' })
    setShowForm(false)
  }

  const remove = (id) => setReminders(prev => prev.filter(r => r.id !== id))

  const colors = {
    overdue: { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626', icon: <AlertTriangle size={18} color="#dc2626" /> },
    urgent:  { bg: '#fff7ed', border: '#fdba74', text: '#ea580c', icon: <AlertTriangle size={18} color="#ea580c" /> },
    soon:    { bg: '#fefce8', border: '#fde68a', text: '#ca8a04', icon: <Clock size={18} color="#ca8a04" /> },
    ok:      { bg: '#f0fdf4', border: '#86efac', text: '#16a34a', icon: <CheckCircle size={18} color="#16a34a" /> },
    neutral: { bg: '#f9fafb', border: '#e5e7eb', text: '#6b7280', icon: <Calendar size={18} color="#6b7280" /> },
  }

  return (
    <div className="screen">
      <header style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>DOT Reminders</h1>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Never miss a certification deadline</p>
          </div>
          <button
            onClick={() => setShowForm(s => !s)}
            style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600' }}
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </header>

      {/* Add Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '20px', border: '2px solid #2563eb' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>New Reminder</h3>
          <label style={lbl}>Title</label>
          <input style={inp} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. DOT Physical, CDL Renewal" />
          <label style={lbl}>Due Date</label>
          <input type="date" style={inp} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <label style={lbl}>Notify me (days before)</label>
          <select style={inp} value={form.daysNotice} onChange={e => setForm(f => ({ ...f, daysNotice: Number(e.target.value) }))}>
            {[7, 14, 30, 60, 90].map(d => <option key={d} value={d}>{d} days</option>)}
          </select>
          <label style={lbl}>Notes (optional)</label>
          <input style={inp} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Clinic name, contact, etc." />
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button onClick={add} style={{ flex: 1, padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Save</button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Reminders List */}
      {reminders.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', color: '#6b7280' }}>
          <Bell size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p>No reminders yet. Add your DOT physical date to get started.</p>
        </div>
      )}

      {reminders
        .slice()
        .sort((a, b) => (diffDays(a.date) ?? 999) - (diffDays(b.date) ?? 999))
        .map(r => {
          const days = diffDays(r.date)
          const u = urgency(days)
          const c = colors[u]
          return (
            <div key={r.id} className="card" style={{ borderLeft: `4px solid ${c.border}`, background: c.bg, marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1 }}>
                  {c.icon}
                  <div>
                    <p style={{ fontWeight: '600', marginBottom: '2px' }}>{r.title}</p>
                    {r.date && (
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>
                        {new Date(r.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                    {days != null && (
                      <p style={{ fontSize: '13px', fontWeight: '600', color: c.text, marginTop: '4px' }}>
                        {days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? 'Due today' : `${days} days remaining`}
                      </p>
                    )}
                    {r.notes && <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{r.notes}</p>}
                  </div>
                </div>
                <button onClick={() => remove(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <Trash2 size={16} color="#9ca3af" />
                </button>
              </div>
            </div>
          )
        })}

      {/* Info card */}
      <div className="card" style={{ background: '#eff6ff', marginTop: '20px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '12px', color: '#1e40af' }}>FMCSA Key Deadlines</h3>
        {[
          { label: 'DOT Physical Exam', note: 'Valid 2 years (or less if condition requires)' },
          { label: 'CDL Medical Card', note: 'Must be on file with your state DMV' },
          { label: 'Drug & Alcohol Clearinghouse', note: 'Annual query required by employers' },
          { label: 'HOS Compliance Review', note: 'Varies by carrier — check your carrier policy' },
        ].map(i => (
          <div key={i.label} style={{ borderBottom: '1px solid #bfdbfe', paddingBottom: '8px', marginBottom: '8px' }}>
            <p style={{ fontWeight: '500', fontSize: '14px' }}>{i.label}</p>
            <p style={{ fontSize: '13px', color: '#3b82f6' }}>{i.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginTop: '12px', marginBottom: '4px' }
const inp = { width: '100%', padding: '10px 12px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }

export default DOTReminders
