import React, { useState, useRef, useEffect } from 'react'
import { Brain, ChevronDown, ChevronUp, Wind, Sun, Moon } from 'lucide-react'

const FEELINGS = ['😊 Great', '🙂 Good', '😐 Okay', '😟 Stressed', '😓 Exhausted']

const CBT_TIPS = [
  { title: 'Name It to Tame It', text: 'When stress hits, pause and name the emotion. Just identifying what you\'re feeling reduces its intensity.' },
  { title: 'The 5-4-3-2-1 Ground', text: '5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Instantly grounds you in the present.' },
  { title: 'Challenge the Thought', text: 'Ask yourself: "Is this thought a fact or just a feeling?" Most stress comes from catastrophizing, not reality.' },
]

const SLEEP_TIPS = [
  { icon: '🌡️', title: 'Keep the Cab Cool', text: 'Lower temperatures (65–68°F) signal your body it\'s time to sleep.' },
  { icon: '📱', title: 'Screen-Free Zone', text: 'Put devices away 30 min before sleep. Blue light disrupts melatonin production.' },
  { icon: '🎧', title: 'White Noise Works', text: 'Truck stop noise? A white noise app can mask it and improve sleep quality significantly.' },
  { icon: '⏰', title: 'Consistent Schedule', text: 'Even on irregular routes, try to sleep and wake at the same times when possible.' },
]

const PHASES = ['Inhale', 'Hold', 'Exhale']

const Expandable = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="card">
      <button
        onClick={() => setOpen(v => !v)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Icon size={20} style={{ color: '#2563eb' }} />
          <span style={{ fontSize: '17px', fontWeight: '600' }}>{title}</span>
        </div>
        {open ? <ChevronUp size={18} style={{ color: '#6b7280' }} /> : <ChevronDown size={18} style={{ color: '#6b7280' }} />}
      </button>
      {open && <div style={{ marginTop: '16px' }}>{children}</div>}
    </div>
  )
}

const MentalWellness = () => {
  const [breathing, setBreathing] = useState(false)
  const [phase, setPhase] = useState(0)
  const [feeling, setFeeling] = useState(null)
  const phaseRef = useRef(null)

  useEffect(() => {
    if (breathing) {
      setPhase(0)
      let current = 0
      phaseRef.current = setInterval(() => {
        current = (current + 1) % 3
        setPhase(current)
      }, 4000)
    } else {
      clearInterval(phaseRef.current)
      setPhase(0)
    }
    return () => clearInterval(phaseRef.current)
  }, [breathing])

  return (
    <div className="screen">
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Mental Wellness</h1>
        <p style={{ color: '#6b7280' }}>Stress management tools for life on the road</p>
      </header>

      {/* Breathing Exercise */}
      <Expandable title="Breathing Exercises" icon={Wind} defaultOpen>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
            4-4-4 box breathing: 4s inhale · 4s hold · 4s exhale
          </p>

          {/* Animated circle */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <div
              className={breathing ? 'breathe-circle' : ''}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: breathing
                  ? phase === 0 ? '#bfdbfe' : phase === 1 ? '#93c5fd' : '#dbeafe'
                  : '#e5e7eb',
                transition: 'background 0.5s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p style={{ fontWeight: '700', fontSize: '16px', color: breathing ? '#1d4ed8' : '#9ca3af' }}>
                {breathing ? PHASES[phase] : 'Ready'}
              </p>
            </div>
          </div>

          <button
            className={breathing ? 'btn-secondary' : 'btn-primary'}
            onClick={() => setBreathing(v => !v)}
            style={{ minWidth: '140px' }}
          >
            {breathing ? 'Stop' : 'Start Breathing'}
          </button>
        </div>
      </Expandable>

      {/* Stress Management */}
      <Expandable title="Stress Management" icon={Brain}>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '10px' }}>How are you feeling?</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {FEELINGS.map(f => (
              <button
                key={f}
                onClick={() => setFeeling(feeling === f ? null : f)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '999px',
                  border: '1px solid #e5e7eb',
                  background: feeling === f ? '#eff6ff' : 'white',
                  color: feeling === f ? '#2563eb' : '#374151',
                  fontWeight: feeling === f ? '600' : '400',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {f}
              </button>
            ))}
          </div>
          {feeling && (
            <p style={{ marginTop: '12px', fontSize: '13px', color: '#2563eb', background: '#eff6ff', padding: '10px 12px', borderRadius: '8px' }}>
              Feeling <strong>{feeling}</strong>? Try one of the CBT techniques below.
            </p>
          )}
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {CBT_TIPS.map((tip, i) => (
            <div key={i} style={{ padding: '14px', background: '#f9fafb', borderRadius: '8px' }}>
              <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{tip.title}</p>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>{tip.text}</p>
            </div>
          ))}
        </div>
      </Expandable>

      {/* Sleep Tips */}
      <Expandable title="Sleep Tips" icon={Moon}>
        <div style={{ display: 'grid', gap: '12px' }}>
          {SLEEP_TIPS.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
              <span style={{ fontSize: '24px', flexShrink: 0 }}>{tip.icon}</span>
              <div>
                <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '3px' }}>{tip.title}</p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>{tip.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Expandable>
    </div>
  )
}

export default MentalWellness
