import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, Calendar, ChevronRight, AlertCircle, Info } from 'lucide-react'
import { useOnboarding } from '../context/OnboardingContext'
import { mockUser } from '../data/mockData'

const STORAGE_KEY = 'dw_dot_exam_prep'

const CHECKLIST = [
  {
    category: 'Medical Preparation',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    items: [
      { id: 'schedule',   text: 'Schedule DOT physical exam appointment' },
      { id: 'fast',       text: 'Plan to fast 8 hours before blood glucose test' },
      { id: 'bp_week',    text: 'Monitor blood pressure daily for 1 week before exam' },
      { id: 'meds_list',  text: 'Prepare a complete list of current medications' },
      { id: 'vision',     text: 'Verify vision meets 20/40 standard (each eye)' },
      { id: 'hearing',    text: 'Confirm you can hear a forced whisper at 5 ft' },
    ],
  },
  {
    category: 'Daily Health Habits',
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#86efac',
    items: [
      { id: 'weight_log', text: 'Log your weight at least once per week' },
      { id: 'bp_log',     text: 'Log blood pressure readings twice per week' },
      { id: 'checkins',   text: 'Complete daily check-ins consistently (7+ day streak)' },
      { id: 'sleep',      text: 'Aim for 7–8 hours of sleep per night' },
      { id: 'sodium',     text: 'Reduce sodium intake (target < 2,300 mg/day)' },
      { id: 'hydration',  text: 'Drink 64–80 oz of water daily' },
      { id: 'alcohol',    text: 'Limit alcohol to 0–1 drinks per day in the 2 weeks prior' },
    ],
  },
  {
    category: 'Documentation',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#d8b4fe',
    items: [
      { id: 'cdl_expiry',  text: 'Confirm CDL license is current and not expiring soon' },
      { id: 'prev_cert',   text: 'Locate previous medical examiner certificate' },
      { id: 'sleep_apnea', text: 'Know your sleep apnea status (if applicable)' },
      { id: 'insulin',     text: 'If diabetic: confirm insulin protocol is documented' },
      { id: 'employer',    text: 'Notify employer of upcoming exam date' },
    ],
  },
]

const loadState = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} }
  catch { return {} }
}

const saveState = (state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state))

const DOTExamPrep = () => {
  const { data: ob } = useOnboarding()
  const dotPhysicalDate = ob.dotPhysicalDate || mockUser.dotPhysicalDate

  const [checked, setChecked] = useState(loadState)

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    saveState(next)
  }

  const allItems    = CHECKLIST.flatMap(c => c.items)
  const doneCount   = allItems.filter(item => checked[item.id]).length
  const totalCount  = allItems.length
  const pct         = Math.round((doneCount / totalCount) * 100)

  const daysUntilDot = Math.ceil((new Date(dotPhysicalDate) - new Date()) / (1000 * 60 * 60 * 24))

  const readinessLevel =
    pct >= 80 ? { label: 'Exam Ready',  color: '#15803d', bg: '#dcfce7', border: '#86efac' } :
    pct >= 50 ? { label: 'In Progress', color: '#a16207', bg: '#fef9c3', border: '#fde047' } :
                { label: 'Just Getting Started', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' }

  return (
    <div className="screen">
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '4px' }}>DOT Exam Prep</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Everything you need to pass your physical</p>
      </header>

      {/* Countdown + readiness card */}
      <div className="card" style={{ background: readinessLevel.bg, border: `1.5px solid ${readinessLevel.border}`, marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Calendar size={16} color={readinessLevel.color} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: readinessLevel.color }}>
                {daysUntilDot > 0 ? `Exam in ${daysUntilDot} days` : 'Exam is overdue — schedule now'}
              </span>
            </div>
            <p style={{ fontSize: '22px', fontWeight: '800', color: readinessLevel.color }}>
              {readinessLevel.label}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '32px', fontWeight: '800', color: readinessLevel.color }}>{pct}%</p>
            <p style={{ fontSize: '11px', color: readinessLevel.color, opacity: 0.8 }}>{doneCount}/{totalCount} done</p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: readinessLevel.color,
            borderRadius: '4px',
            transition: 'width 0.3s',
          }} />
        </div>
      </div>

      {/* DOT Threshold reminder */}
      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <Info size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '1px' }} />
        <div>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#0369a1', marginBottom: '3px' }}>DOT Medical Standards</p>
          <p style={{ fontSize: '12px', color: '#0369a1', lineHeight: 1.5 }}>
            Blood pressure must be below 140/90 · Fasting glucose below 126 mg/dL · Vision 20/40 each eye · Normal hearing at 5 ft
          </p>
        </div>
      </div>

      {/* Checklist sections */}
      {CHECKLIST.map(section => {
        const sectionDone  = section.items.filter(i => checked[i.id]).length
        const sectionTotal = section.items.length
        return (
          <div className="card" key={section.category} style={{ marginBottom: '16px', borderTop: `3px solid ${section.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: section.color }}>{section.category}</h3>
              <span style={{
                fontSize: '12px', fontWeight: '700', color: section.color,
                background: section.bg, border: `1px solid ${section.border}`,
                padding: '2px 10px', borderRadius: '999px',
              }}>
                {sectionDone}/{sectionTotal}
              </span>
            </div>

            {section.items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px', width: '100%',
                  padding: '11px 0', background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: idx < section.items.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                {checked[item.id]
                  ? <CheckCircle2 size={20} color={section.color} style={{ flexShrink: 0, marginTop: '1px' }} />
                  : <Circle size={20} color="#d1d5db" style={{ flexShrink: 0, marginTop: '1px' }} />
                }
                <span style={{
                  fontSize: '14px',
                  color: checked[item.id] ? '#9ca3af' : '#374151',
                  textDecoration: checked[item.id] ? 'line-through' : 'none',
                  lineHeight: 1.4,
                }}>
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        )
      })}

      {/* Quick links */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px', color: '#374151' }}>Quick Links</h3>
        {[
          { label: 'Log blood pressure reading',  path: '/health-history' },
          { label: 'Complete today\'s check-in',  path: '/checkin' },
          { label: 'Blood pressure routine',       path: '/workouts/3' },
          { label: 'Find a DOT exam center',       path: '/locations' },
        ].map(link => (
          <Link key={link.path} to={link.path} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #f3f4f6', textDecoration: 'none', color: '#374151', fontSize: '14px' }}>
            {link.label}
            <ChevronRight size={16} color="#9ca3af" />
          </Link>
        ))}
      </div>

      {pct === 100 && (
        <div className="card" style={{ textAlign: 'center', background: '#dcfce7', border: '1.5px solid #86efac', marginBottom: '24px' }}>
          <CheckCircle2 size={40} color="#15803d" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontWeight: '700', fontSize: '18px', color: '#14532d' }}>You're exam ready!</p>
          <p style={{ fontSize: '14px', color: '#15803d', marginTop: '4px' }}>All prep items completed. Good luck at your physical.</p>
        </div>
      )}
    </div>
  )
}

export default DOTExamPrep
