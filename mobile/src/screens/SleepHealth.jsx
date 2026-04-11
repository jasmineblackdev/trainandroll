import React, { useState } from 'react'
import { Moon, AlertCircle, CheckCircle2, Info, TrendingUp } from 'lucide-react'

// STOP-BANG questionnaire — standard clinical sleep apnea screening tool
const STOP_BANG = [
  { id: 'snore',    label: 'Do you snore loudly (loud enough to be heard through closed doors)?' },
  { id: 'tired',    label: 'Do you often feel tired, fatigued, or sleepy during the daytime?' },
  { id: 'observed', label: 'Has anyone observed you stop breathing during your sleep?' },
  { id: 'pressure', label: 'Do you have (or are you being treated for) high blood pressure?' },
  { id: 'bmi',      label: 'Is your BMI greater than 35?' },
  { id: 'age',      label: 'Are you older than 50?' },
  { id: 'neck',     label: 'Is your neck circumference greater than 40 cm (15.7 inches)?' },
  { id: 'gender',   label: 'Are you male?' },
]

const STORAGE_KEY = 'dw_sleep_data'

const loadSleepData = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  catch { return {} }
}

const saveSleepData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Generate 14-day mock sleep trend
const generateSleepTrend = () => {
  const days = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      date: d.toLocaleDateString('en', { weekday: 'short', month: 'numeric', day: 'numeric' }),
      hours: +(5.5 + Math.random() * 2.5).toFixed(1),
    })
  }
  return days
}

const sleepTrend = generateSleepTrend()

const SleepHealth = () => {
  const saved = loadSleepData()
  const [answers, setAnswers]     = useState(saved.answers || {})
  const [submitted, setSubmitted] = useState(!!saved.submitted)
  const [activeTab, setActiveTab] = useState('screen')

  const toggle = (id) => setAnswers(prev => ({ ...prev, [id]: !prev[id] }))

  const score = Object.values(answers).filter(Boolean).length

  const getRisk = (s) => {
    if (s <= 2) return { level: 'Low',      color: '#22c55e', bg: '#dcfce7', message: 'Low risk of sleep apnea. Keep monitoring your sleep quality.' }
    if (s <= 4) return { level: 'Moderate', color: '#eab308', bg: '#fef9c3', message: 'Moderate risk. Consider discussing sleep apnea with your DOT medical examiner.' }
    return       { level: 'High',     color: '#ef4444', bg: '#fee2e2', message: 'High risk. FMCSA may require a sleep study before issuing a 2-year medical certificate. Talk to a DOT-certified provider.' }
  }

  const risk = getRisk(score)

  const handleSubmit = () => {
    saveSleepData({ answers, submitted: true })
    setSubmitted(true)
  }

  const handleReset = () => {
    saveSleepData({})
    setAnswers({})
    setSubmitted(false)
  }

  const allAnswered = STOP_BANG.every(q => answers[q.id] !== undefined)

  const Tab = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
        background: activeTab === id ? '#2563eb' : '#f3f4f6',
        color: activeTab === id ? 'white' : '#374151',
        fontWeight: activeTab === id ? '700' : '400',
        fontSize: '13px', borderRadius: '8px',
      }}
    >
      {label}
    </button>
  )

  return (
    <div className="screen">
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>Sleep Health</h1>
        <p style={{ color: '#6b7280' }}>Sleep apnea is the #1 CDL disqualifier. Know your risk.</p>
      </header>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <Tab id="screen" label="Risk Screen" />
        <Tab id="trends" label="Sleep Trends" />
        <Tab id="fmcsa"  label="FMCSA Rules" />
      </div>

      {/* ── STOP-BANG SCREENING ─────────────────────────────────────── */}
      {activeTab === 'screen' && (
        <>
          <div className="card" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Info size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '13px', color: '#1d4ed8', lineHeight: '1.5' }}>
                The <strong>STOP-BANG</strong> questionnaire is the clinical standard for sleep apnea screening. Your DOT examiner may use this same tool. Answer honestly — this is for your health.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="card" style={{ background: risk.bg, border: `1.5px solid ${risk.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                {risk.level === 'Low'
                  ? <CheckCircle2 size={28} color={risk.color} />
                  : <AlertCircle size={28} color={risk.color} />
                }
                <div>
                  <p style={{ fontWeight: '700', fontSize: '18px', color: risk.color }}>{risk.level} Risk</p>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>STOP-BANG score: {score} / 8</p>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#374151', marginBottom: '16px', lineHeight: '1.5' }}>{risk.message}</p>
              {risk.level !== 'Low' && (
                <div style={{ padding: '12px', background: 'white', borderRadius: '8px', marginBottom: '12px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Recommended next steps:</p>
                  <ul style={{ fontSize: '13px', color: '#374151', paddingLeft: '18px', lineHeight: '1.7', margin: 0 }}>
                    <li>Book a telehealth visit with a DOT-certified examiner</li>
                    <li>Ask about a home sleep test (covered by most insurance)</li>
                    <li>If diagnosed, CPAP therapy may restore your 2-year certificate</li>
                  </ul>
                </div>
              )}
              <button className="btn-secondary" onClick={handleReset} style={{ width: '100%' }}>
                Retake Screening
              </button>
            </div>
          ) : (
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                STOP-BANG Questionnaire
              </h3>
              {STOP_BANG.map((q, i) => (
                <div
                  key={q.id}
                  onClick={() => toggle(q.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '12px', borderRadius: '8px', marginBottom: '8px',
                    background: answers[q.id] === true ? '#fef2f2' : answers[q.id] === false ? '#f0fdf4' : '#f9fafb',
                    border: `1.5px solid ${answers[q.id] === true ? '#fca5a5' : answers[q.id] === false ? '#86efac' : '#e5e7eb'}`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${answers[q.id] !== undefined ? (answers[q.id] ? '#ef4444' : '#22c55e') : '#d1d5db'}`,
                    background: answers[q.id] !== undefined ? (answers[q.id] ? '#ef4444' : '#22c55e') : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {answers[q.id] !== undefined && (
                      <span style={{ color: 'white', fontSize: '13px', fontWeight: '700' }}>
                        {answers[q.id] ? 'Y' : 'N'}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.4', flex: 1 }}>
                    {i + 1}. {q.label}
                  </p>
                </div>
              ))}
              <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginBottom: '12px' }}>
                Tap each question to toggle Yes / No
              </p>
              <button
                className="btn-primary"
                style={{ width: '100%' }}
                disabled={!allAnswered}
                onClick={handleSubmit}
              >
                See My Risk Score
              </button>
            </div>
          )}
        </>
      )}

      {/* ── SLEEP TRENDS ────────────────────────────────────────────── */}
      {activeTab === 'trends' && (
        <>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <TrendingUp size={20} color="#2563eb" />
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>14-Day Sleep History</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100px', marginBottom: '8px' }}>
              {sleepTrend.map((day, i) => {
                const pct = (day.hours / 9) * 100
                const color = day.hours >= 7 ? '#22c55e' : day.hours >= 6 ? '#eab308' : '#ef4444'
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: `${pct}px`, background: color, borderRadius: '3px 3px 0 0', minHeight: '4px' }} />
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9ca3af' }}>
              <span>14 days ago</span><span>Today</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'center' }}>
              {[['#22c55e', '7+ hrs'], ['#eab308', '6–7 hrs'], ['#ef4444', '<6 hrs']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: c }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Sleep & DOT Connection</h3>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
              FMCSA requires drivers to have adequate sleep before operating a CMV. Chronic sleep deprivation is linked to reaction times equivalent to a 0.08 BAC — the legal DUI limit. Drivers with untreated sleep apnea are <strong>2.5× more likely</strong> to have a crash.
            </p>
          </div>
        </>
      )}

      {/* ── FMCSA RULES ─────────────────────────────────────────────── */}
      {activeTab === 'fmcsa' && (
        <>
          {[
            {
              title: 'Sleep Apnea & Medical Certification',
              body: 'FMCSA does not have a specific regulation mandating sleep apnea testing, but medical examiners are required to evaluate for it. A diagnosis doesn\'t automatically disqualify you — treated sleep apnea with documented CPAP compliance can still earn a 1 or 2-year certificate.',
            },
            {
              title: 'BMI ≥ 35 Triggers Evaluation',
              body: 'Examiners are advised to screen drivers with BMI ≥ 35 for obstructive sleep apnea. If you fall in this range, expect a referral for a sleep study. A home sleep test (HST) costs $150–$300 and provides results in 1–2 days.',
            },
            {
              title: 'CPAP Compliance = Continued Certification',
              body: 'If diagnosed with sleep apnea, you must use your CPAP device. Modern CPAP devices record usage data — your examiner may request a compliance report showing 4+ hours/night on 70% of nights over 30 days.',
            },
            {
              title: 'Hours of Service (HOS) Rules',
              body: '11-hour driving limit within a 14-hour window. Required 10-hour off-duty period. 30-minute break after 8 hours of driving. These rules exist specifically because fatigue causes crashes.',
            },
          ].map((item, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Moon size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default SleepHealth
