import React, { useState } from 'react'
import { ClipboardCheck, CheckCircle2 } from 'lucide-react'
import {
  loadCheckIns,
  saveCheckIn,
  getTodayStr,
  getCheckInStreak,
} from '../data/mockData'

const FACE_SCALES = {
  sleep:  ['😴', '😕', '😐', '🙂', '😃'],
  energy: ['🪫', '😮‍💨', '😐', '💪', '⚡'],
  stress: ['😌', '🙂', '😐', '😣', '😫'],
}

const SCALE_LABELS = {
  sleep:  ['Poor', 'Meh', 'OK', 'Good', 'Great'],
  energy: ['Drained', 'Low', 'OK', 'Strong', 'Peak'],
  stress: ['Calm', 'Light', 'OK', 'Tense', 'Maxed'],
}

const FaceScale = ({ label, field, value, onChange }) => {
  const faces = FACE_SCALES[field]
  const labels = SCALE_LABELS[field]
  return (
    <div style={{ marginBottom: '22px' }}>
      <label style={{ fontWeight: '600', fontSize: '15px', display: 'block', marginBottom: '10px', color: '#1f2937' }}>
        {label}
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
        {faces.map((face, i) => {
          const v = i + 1
          const active = value === v
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              aria-label={`${label}: ${labels[i]}`}
              style={{
                padding: '12px 4px',
                borderRadius: '14px',
                border: active ? '2px solid #2563eb' : '2px solid #e5e7eb',
                background: active ? '#eff6ff' : 'white',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                minHeight: '68px',
                transition: 'background 0.15s, border-color 0.15s',
              }}
            >
              <span style={{ fontSize: '26px', lineHeight: 1 }}>{face}</span>
              <span style={{ fontSize: '11px', fontWeight: '600', color: active ? '#2563eb' : '#4b5563' }}>
                {labels[i]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const WATER_OPTIONS = [
  { oz: 16,  label: '16 oz',  sub: '2 cups'   },
  { oz: 32,  label: '32 oz',  sub: '4 cups'   },
  { oz: 64,  label: '64 oz',  sub: '8 cups'   },
  { oz: 96,  label: '96+ oz', sub: '12+ cups' },
]

const WaterChips = ({ value, onChange }) => (
  <div style={{ marginBottom: '22px' }}>
    <label style={{ fontWeight: '600', fontSize: '15px', display: 'block', marginBottom: '10px', color: '#1f2937' }}>
      Water Intake
    </label>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
      {WATER_OPTIONS.map(({ oz, label, sub }) => {
        const active = value === oz
        return (
          <button
            key={oz}
            type="button"
            onClick={() => onChange(oz)}
            aria-label={`Water intake: ${label}`}
            style={{
              padding: '12px 4px',
              borderRadius: '14px',
              border: active ? '2px solid #2563eb' : '2px solid #e5e7eb',
              background: active ? '#eff6ff' : 'white',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              minHeight: '68px',
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            <span style={{ fontSize: '18px' }}>💧</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: active ? '#2563eb' : '#1f2937' }}>{label}</span>
            <span style={{ fontSize: '10px', color: active ? '#2563eb' : '#6b7280' }}>{sub}</span>
          </button>
        )
      })}
    </div>
  </div>
)

const CheckIn = () => {
  const today = getTodayStr()
  const checkIns = loadCheckIns()
  const alreadyDone = !!checkIns[today]
  const streak = getCheckInStreak()

  const [form, setForm] = useState({ sleep: 3, energy: 3, stress: 3, water: 64 })
  const [submitted, setSubmitted] = useState(alreadyDone)

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = () => {
    saveCheckIn(today, form)
    setSubmitted(true)
  }

  const calDots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().split('T')[0]
    const done = !!checkIns[key] || (key === today && submitted)
    return { key, done, label: d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 1) }
  })

  const currentStreak = submitted ? streak + (alreadyDone ? 0 : 1) : streak

  return (
    <div className="screen">
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Daily Check-In</h1>
        <p style={{ color: '#4b5563', fontSize: '14px' }}>Takes about 15 seconds</p>
      </header>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontWeight: '600', fontSize: '16px' }}>Check-In Streak</p>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>Keep it going!</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{currentStreak}</p>
          <p style={{ fontSize: '12px', color: '#4b5563' }}>days</p>
        </div>
      </div>

      <div className="card">
        <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '12px' }}>Last 7 Days</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {calDots.map(({ key, done, label }) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: done ? '#22c55e' : '#e5e7eb',
                margin: '0 auto 4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {done && <CheckCircle2 size={16} color="white" />}
              </div>
              <span style={{ fontSize: '12px', color: '#4b5563' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {submitted ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircle2 size={48} color="#22c55e" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Check-In Complete!</h3>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>Great job tracking your wellness today. See you tomorrow!</p>
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <ClipboardCheck size={20} style={{ color: '#2563eb', marginRight: '8px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>How are you feeling?</h3>
          </div>

          <FaceScale label="Sleep Quality" field="sleep"  value={form.sleep}  onChange={v => set('sleep', v)} />
          <FaceScale label="Energy Level"  field="energy" value={form.energy} onChange={v => set('energy', v)} />
          <FaceScale label="Stress Level"  field="stress" value={form.stress} onChange={v => set('stress', v)} />
          <WaterChips value={form.water} onChange={v => set('water', v)} />

          <button
            className="btn-primary"
            style={{ width: '100%', minHeight: '52px' }}
            onClick={handleSubmit}
          >
            Submit Check-In
          </button>
        </div>
      )}
    </div>
  )
}

export default CheckIn
