import React, { useState } from 'react'
import { Heart, Activity, Droplets, Scale, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const STORAGE_KEY = 'dw_health_records'

const METRICS = [
  { key: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg', icon: <Heart size={18} color="#ef4444" />, color: '#ef4444' },
  { key: 'heart_rate',     label: 'Heart Rate',     unit: 'bpm',  icon: <Activity size={18} color="#f97316" />, color: '#f97316' },
  { key: 'blood_glucose',  label: 'Blood Glucose',  unit: 'mg/dL',icon: <Droplets size={18} color="#8b5cf6" />, color: '#8b5cf6' },
  { key: 'weight',         label: 'Weight',         unit: 'lbs',  icon: <Scale size={18} color="#06b6d4" />,    color: '#06b6d4' },
]

const loadRecords = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

const saveRecords = (recs) => localStorage.setItem(STORAGE_KEY, JSON.stringify(recs))

const HealthHistory = () => {
  const [records, setRecords]   = useState(loadRecords)
  const [activeTab, setActive]  = useState('blood_pressure')
  const [showAdd, setShowAdd]   = useState(false)
  const [form, setForm]         = useState({ valuePrimary: '', valueSecondary: '', notes: '' })

  const metric = METRICS.find(m => m.key === activeTab)

  const add = () => {
    if (!form.valuePrimary) return
    const rec = {
      id:             Date.now(),
      metric_type:    activeTab,
      value_primary:  Number(form.valuePrimary),
      value_secondary:form.valueSecondary ? Number(form.valueSecondary) : null,
      notes:          form.notes,
      recorded_at:    new Date().toISOString(),
    }
    const next = [rec, ...records]
    setRecords(next)
    saveRecords(next)
    setForm({ valuePrimary: '', valueSecondary: '', notes: '' })
    setShowAdd(false)
  }

  const forMetric = records
    .filter(r => r.metric_type === activeTab)
    .slice(0, 30)

  const last  = forMetric[0]
  const prev  = forMetric[1]
  const trend = last && prev
    ? last.value_primary > prev.value_primary ? 'up'
    : last.value_primary < prev.value_primary ? 'down' : 'flat'
    : null

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <div className="screen">
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>Health History</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Track your vitals over time</p>
      </header>

      {/* Metric tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '20px' }}>
        {METRICS.map(m => (
          <button
            key={m.key}
            onClick={() => setActive(m.key)}
            style={{
              padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              fontSize: '13px', fontWeight: '600',
              background: activeTab === m.key ? m.color : '#f3f4f6',
              color: activeTab === m.key ? 'white' : '#6b7280',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Latest value */}
      {last && (
        <div className="card" style={{ marginBottom: '16px', background: `linear-gradient(135deg, ${metric.color}15, ${metric.color}05)`, border: `1.5px solid ${metric.color}30` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Latest Reading</p>
              <p style={{ fontSize: '36px', fontWeight: '800', color: metric.color }}>
                {last.value_primary}
                {last.value_secondary ? `/${last.value_secondary}` : ''}
                <span style={{ fontSize: '18px', fontWeight: '400', color: '#9ca3af', marginLeft: '6px' }}>{metric.unit}</span>
              </p>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                {new Date(last.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {trend && (
              <div style={{ textAlign: 'center' }}>
                <TrendIcon size={28} color={trend === 'up' ? '#ef4444' : trend === 'down' ? '#10b981' : '#6b7280'} />
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>vs prev</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add reading button */}
      <button
        onClick={() => setShowAdd(s => !s)}
        style={{ width: '100%', padding: '12px', border: `2px dashed ${metric.color}`, borderRadius: '10px', background: 'transparent', color: metric.color, fontWeight: '600', cursor: 'pointer', marginBottom: '16px', fontSize: '15px' }}
      >
        + Log {metric.label}
      </button>

      {/* Add form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <label style={lbl}>
            {activeTab === 'blood_pressure' ? 'Systolic (top number)' : metric.label}
          </label>
          <input type="number" style={inp} value={form.valuePrimary} onChange={e => setForm(f => ({ ...f, valuePrimary: e.target.value }))} placeholder={activeTab === 'blood_pressure' ? '120' : activeTab === 'heart_rate' ? '72' : activeTab === 'blood_glucose' ? '95' : '185'} />
          {activeTab === 'blood_pressure' && (
            <>
              <label style={lbl}>Diastolic (bottom number)</label>
              <input type="number" style={inp} value={form.valueSecondary} onChange={e => setForm(f => ({ ...f, valueSecondary: e.target.value }))} placeholder="80" />
            </>
          )}
          <label style={lbl}>Notes (optional)</label>
          <input style={inp} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="After walking, fasted, etc." />
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button onClick={add} style={{ flex: 1, padding: '12px', background: metric.color, color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Save</button>
            <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* History list */}
      {forMetric.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', color: '#6b7280' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.3 }}>{metric.icon}</div>
          <p>No {metric.label} records yet. Log your first reading above.</p>
        </div>
      ) : (
        <div className="card">
          <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Recent Readings</h3>
          {forMetric.map((r, i) => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < forMetric.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <div>
                <p style={{ fontWeight: '600', fontSize: '18px', color: metric.color }}>
                  {r.value_primary}{r.value_secondary ? `/${r.value_secondary}` : ''} <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '400' }}>{metric.unit}</span>
                </p>
                {r.notes && <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{r.notes}</p>}
              </div>
              <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'right' }}>
                {new Date(r.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const lbl = { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginTop: '12px', marginBottom: '4px' }
const inp = { width: '100%', padding: '10px 12px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }

export default HealthHistory
