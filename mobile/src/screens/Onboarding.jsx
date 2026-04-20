import React, { useState } from 'react'
import {
  Target,
  HeartPulse,
  Dumbbell,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { useOnboarding } from '../context/OnboardingContext'
import './Onboarding.css'

const TOTAL_STEPS = 3

/* ── individual steps ─────────────────────────────────────── */

const StepWelcome = ({ onNext }) => (
  <div className="ob-step" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
    <div className="ob-hero">
      <img src="/logo.png" alt="Train&Roll" style={{ height: '56px', width: 'auto', marginBottom: '20px' }} />
      <h1 className="ob-title">Stay Fit. Stay Certified.<br />Stay Driving.</h1>
      <p className="ob-subtitle">
        Prevent DOT physical failures with training built specifically for truck drivers.
      </p>
    </div>

    <div className="ob-feature-list">
      {[
        { icon: Dumbbell,   text: 'Workouts in-truck, at rest stops, or any motel' },
        { icon: HeartPulse, text: 'Track DOT health metrics in real time'           },
        { icon: Target,     text: 'Know your readiness score before exam day'       },
      ].map(({ icon: Icon, text }) => (
        <div className="ob-feature-row" key={text}>
          <div className="ob-feature-icon-wrap">
            <Icon size={20} color="var(--brand)" />
          </div>
          <span>{text}</span>
        </div>
      ))}
    </div>

    <div className="ob-welcome-cta" style={{ marginTop: 'auto' }}>
      <button className="ob-btn-next ob-btn-next--full" onClick={onNext}>
        Get Started <ChevronRight size={20} />
      </button>
    </div>
  </div>
)

const StepEssentials = ({ data, update }) => (
  <div className="ob-step">
    <h2 className="ob-step-title">The basics</h2>
    <p className="ob-step-sub">Just two things so we can build your DOT readiness plan. You can finish the rest later.</p>

    <div className="ob-form">
      <label className="ob-label">
        Your Name
        <input
          className="ob-input"
          type="text"
          placeholder="Jake Miller"
          autoComplete="name"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
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
        <span className="ob-hint">Find it on your current medical certificate.</span>
      </label>
    </div>
  </div>
)

const StepReady = () => (
  <div className="ob-step ob-step--center">
    <div className="ob-ready-icon">
      <CheckCircle2 size={64} color="var(--status-green)" />
    </div>
    <h2 className="ob-title">You're all set!</h2>
    <p className="ob-subtitle">
      Your DOT readiness plan is ready. Take 15 seconds for your first
      daily check-in, or log your baseline health metrics from the dashboard.
    </p>

    <div className="ob-ready-tips">
      {[
        'Log BP, weight, glucose anytime from Health',
        'Browse workouts built for truck stops',
        'Find gyms & DOT centres on the map',
      ].map((tip) => (
        <div className="ob-ready-tip" key={tip}>{tip}</div>
      ))}
    </div>
  </div>
)

/* ── main component ───────────────────────────────────────── */

const STEPS = [StepWelcome, StepEssentials, StepReady]

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
    if (isLast) return 'Go to Dashboard'
    return 'Continue'
  }

  // Only the essentials step is skippable (everything is optional)
  const canSkip = step === 1

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
