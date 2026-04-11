import React, { useState } from 'react'
import { ClipboardCheck, CheckCircle2 } from 'lucide-react'
import {
  loadCheckIns,
  saveCheckIn,
  getTodayStr,
  getCheckInStreak,
} from '../data/mockData'

const SliderInput = ({ label, min, max, step = 1, value, onChange, minLabel, maxLabel }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
      <label style={{ fontWeight: '500', fontSize: '15px' }}>{label}</label>
      <span style={{ fontWeight: '700', color: '#2563eb', fontSize: '16px' }}>{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
    />
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
      <span>{minLabel}</span>
      <span>{maxLabel}</span>
    </div>
  </div>
)

const CheckIn = () => {
  const today = getTodayStr()
  const checkIns = loadCheckIns()
  const alreadyDone = !!checkIns[today]
  const streak = getCheckInStreak()

  const [form, setForm] = useState({ sleep: 3, energy: 3, stress: 3, water: 60 })
  const [submitted, setSubmitted] = useState(alreadyDone)

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = () => {
    saveCheckIn(today, form)
    setSubmitted(true)
  }

  // 7-day calendar dots
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
        <p style={{ color: '#6b7280' }}>Track how you feel today</p>
      </header>

      {/* Streak card */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontWeight: '600', fontSize: '16px' }}>Check-In Streak</p>
          <p style={{ color: '#6b7280', fontSize: '13px' }}>Keep it going!</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{currentStreak}</p>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>days</p>
        </div>
      </div>

      {/* 7-day calendar */}
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
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {submitted ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircle2 size={48} color="#22c55e" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Check-In Complete!</h3>
          <p style={{ color: '#6b7280' }}>Great job tracking your wellness today. See you tomorrow!</p>
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <ClipboardCheck size={20} style={{ color: '#2563eb', marginRight: '8px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Today's Wellness</h3>
          </div>

          <SliderInput
            label="Sleep Quality"
            min={1} max={5}
            value={form.sleep}
            onChange={v => set('sleep', v)}
            minLabel="Poor"
            maxLabel="Excellent"
          />
          <SliderInput
            label="Energy Level"
            min={1} max={5}
            value={form.energy}
            onChange={v => set('energy', v)}
            minLabel="Exhausted"
            maxLabel="Energized"
          />
          <SliderInput
            label="Stress Level"
            min={1} max={5}
            value={form.stress}
            onChange={v => set('stress', v)}
            minLabel="Relaxed"
            maxLabel="Very Stressed"
          />
          <SliderInput
            label="Water Intake (oz)"
            min={0} max={120} step={8}
            value={form.water}
            onChange={v => set('water', v)}
            minLabel="0 oz"
            maxLabel="120 oz"
          />

          <button className="btn-primary" style={{ width: '100%' }} onClick={handleSubmit}>
            Submit Check-In
          </button>
        </div>
      )}
    </div>
  )
}

export default CheckIn
