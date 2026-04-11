import React, { useState } from 'react'
import {
  Target,
  HeartPulse,
  Dumbbell,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Activity,
  Weight,
  Wind,
} from 'lucide-react'
import { useOnboarding } from '../context/OnboardingContext'
import './Onboarding.css'

const TOTAL_STEPS = 5

const GOALS = [
  { id: 'blood-pressure', label: 'Lower Blood Pressure', icon: Activity },
  { id: 'weight',         label: 'Lose Weight',          icon: Weight   },
  { id: 'mobility',       label: 'Improve Mobility',     icon: Wind     },
  { id: 'dot-ready',      label: 'Pass DOT Physical',    icon: Target   },
]

/* ── individual steps ─────────────────────────────────────── */

const StepWelcome = ({ onNext }) => (
  <div className="ob-step" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
    <div className="ob-hero">
      <img src="/logo.png" alt="Train&Roll" style={{ height: '80px', width: 'auto', marginBottom: '16px' }} />
      <h1 className="ob-title">Welcome to Train&Roll</h1>
      <p className="ob-subtitle">
        Your health co-pilot built for life on the road. Stay DOT-ready,
        workout anywhere, and take control of your health — one mile at a time.
      </p>
    </div>

    <div className="ob-feature-list">
      {[
        { icon: HeartPulse, text: 'Track DOT health metrics'       },
        { icon: Dumbbell,   text: 'Workouts for any truck stop'    },
        { icon: Target,     text: 'Personalized DOT readiness plan'},
      ].map(({ icon: Icon, text }) => (
        <div className="ob-feature-row" key={text}>
          <div className="ob-feature-icon-wrap">
            <Icon size={20} color="#2563eb" />
          </div>
          <span>{text}</span>
        </div>
      ))}
    </div>

    {/* CTA anchored at the bottom of the content area */}
    <div className="ob-welcome-cta" style={{ marginTop: 'auto' }}>
      <button className="ob-btn-next ob-btn-next--full" onClick={onNext}>
        Get Started <ChevronRight size={20} />
      </button>
    </div>
  </div>
)

const StepProfile = ({ data, update }) => (
  <div className="ob-step">
    <h2 className="ob-step-title">Let's set up your profile</h2>
    <p className="ob-step-sub">We'll personalise your DOT readiness plan.</p>

    <div className="ob-form">
      <label className="ob-label">
        Full Name
        <input
          className="ob-input"
          type="text"
          placeholder="Jake Miller"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
        />
      </label>

      <label className="ob-label">
        CDL Number
        <input
          className="ob-input"
          type="text"
          placeholder="CDL-TX-123456"
          value={data.cdlNumber}
          onChange={(e) => update({ cdlNumber: e.target.value })}
        />
      </label>

      <label className="ob-label">
        Next DOT Physical Date
        <input
          className="ob-input"
          type="date"
          value={data.dotPhysicalDate}
          onChange={(e) => update({ dotPhysicalDate: e.target.value })}
        />
      </label>
    </div>
  </div>
)

const StepGoals = ({ data, update }) => {
  const toggle = (id) => {
    const next = data.goals.includes(id)
      ? data.goals.filter((g) => g !== id)
      : [...data.goals, id]
    update({ goals: next })
  }

  return (
    <div className="ob-step">
      <h2 className="ob-step-title">What are your health goals?</h2>
      <p className="ob-step-sub">Select all that apply — we'll customise your plan.</p>

      <div className="ob-goals-grid">
        {GOALS.map(({ id, label, icon: Icon }) => {
          const active = data.goals.includes(id)
          return (
            <button
              key={id}
              className={`ob-goal-card ${active ? 'ob-goal-card--active' : ''}`}
              onClick={() => toggle(id)}
            >
              <div className={`ob-goal-icon ${active ? 'ob-goal-icon--active' : ''}`}>
                <Icon size={24} color={active ? 'white' : '#2563eb'} />
              </div>
              <span className="ob-goal-label">{label}</span>
              {active && (
                <CheckCircle2 size={18} className="ob-goal-check" color="#2563eb" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const StepMetrics = ({ data, update }) => (
  <div className="ob-step">
    <h2 className="ob-step-title">Baseline health metrics</h2>
    <p className="ob-step-sub">Used to calculate your DOT readiness score. You can update these anytime.</p>

    <div className="ob-form">
      <label className="ob-label">
        Weight (lbs)
        <input
          className="ob-input"
          type="number"
          placeholder="245"
          value={data.weight}
          onChange={(e) => update({ weight: e.target.value })}
        />
      </label>

      <label className="ob-label">
        Height (inches)
        <input
          className="ob-input"
          type="number"
          placeholder="70 (5'10&quot;)"
          value={data.height}
          onChange={(e) => update({ height: e.target.value })}
        />
      </label>

      <label className="ob-label">Blood Pressure</label>
      <div className="ob-bp-row">
        <input
          className="ob-input"
          type="number"
          placeholder="Systolic (138)"
          value={data.systolic}
          onChange={(e) => update({ systolic: e.target.value })}
        />
        <span className="ob-bp-sep">/</span>
        <input
          className="ob-input"
          type="number"
          placeholder="Diastolic (88)"
          value={data.diastolic}
          onChange={(e) => update({ diastolic: e.target.value })}
        />
      </div>

      <label className="ob-label">
        Fasting Blood Glucose (mg/dL)
        <input
          className="ob-input"
          type="number"
          placeholder="105"
          value={data.bloodGlucose}
          onChange={(e) => update({ bloodGlucose: e.target.value })}
        />
      </label>

      <div className="ob-info-box">
        <Activity size={16} color="#2563eb" />
        <p>DOT standards: BP must be below 140/90 to pass without restrictions.</p>
      </div>
    </div>
  </div>
)

const StepReady = () => (
  <div className="ob-step ob-step--center">
    <div className="ob-ready-icon">
      <CheckCircle2 size={64} color="#22c55e" />
    </div>
    <h2 className="ob-title">You're all set!</h2>
    <p className="ob-subtitle">
      Your personalised DOT readiness plan is ready. Start with a quick
      5-minute in-cab stretch or find a nearby gym to kick things off.
    </p>

    <div className="ob-ready-tips">
      {[
        '🏋️  Browse workouts built for truck stops',
        '📍  Find gyms & DOT centres near you',
        '📊  Track your health metrics over time',
      ].map((tip) => (
        <div className="ob-ready-tip" key={tip}>{tip}</div>
      ))}
    </div>
  </div>
)

/* ── main component ───────────────────────────────────────── */

const STEPS = [StepWelcome, StepProfile, StepGoals, StepMetrics, StepReady]

const Onboarding = () => {
  const [step, setStep] = useState(0)
  const { data, updateData, complete } = useOnboarding()

  const isFirst = step === 0
  const isLast  = step === TOTAL_STEPS - 1

  const next = () => {
    if (isLast) { complete(); return }
    setStep((s) => s + 1)
  }

  const back = () => setStep((s) => s - 1)

  const StepComponent = STEPS[step]

  const nextLabel = () => {
    if (step === 0)           return 'Get Started'
    if (isLast)               return 'Go to Dashboard'
    if (step === 1 || step === 3) return 'Continue'
    return 'Continue'
  }

  // Allow skipping profile / metrics steps
  const canSkip = step === 1 || step === 3

  return (
    <div className="ob-container">
      {/* Progress dots */}
      {!isFirst && (
        <div className="ob-progress">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`ob-dot ${i <= step ? 'ob-dot--active' : ''}`}
            />
          ))}
        </div>
      )}

      {/* Step content */}
      <div className={`ob-content${isFirst ? ' ob-content--welcome' : ''}`}>
        <StepComponent data={data} update={updateData} onNext={next} />
      </div>

      {/* Navigation — hidden on welcome step (CTA lives inside content) */}
      {!isFirst && (
        <div className="ob-nav">
          <button className="ob-btn-back" onClick={back}>
            <ChevronLeft size={18} /> Back
          </button>

          <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
            {canSkip && (
              <button className="ob-btn-skip" onClick={next}>
                Skip
              </button>
            )}
            <button className="ob-btn-next" onClick={next}>
              {nextLabel()} {!isLast && <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Onboarding
