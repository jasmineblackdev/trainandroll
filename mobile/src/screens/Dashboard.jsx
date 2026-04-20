import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  MapPin,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Brain,
  ChevronRight,
  Zap,
  X,
} from 'lucide-react'
import {
  mockUser,
  getDotReadinessStatus,
  mockWorkouts,
  calculateBMI,
  loadCheckIns,
  getCheckInStreak,
  getTodayStr,
  getTodayAction,
  getReadinessTrend,
} from '../data/mockData'
import { useOnboarding } from '../context/OnboardingContext'
import { useAuth } from '../context/AuthContext'

const GS_DISMISSED_KEY = 'dw_gs_dismissed'

// ── Mini SVG sparkline for the readiness trend ──────────────────
const Sparkline = ({ data, color = '#2563eb', height = 36 }) => {
  if (!data || data.length < 2) return null
  const w = 200
  const min = Math.min(...data.map(d => d.score))
  const max = Math.max(...data.map(d => d.score))
  const range = max - min || 1
  const xStep = w / (data.length - 1)
  const yPos  = (v) => height - ((v - min) / range) * (height - 4) - 2
  const points = data.map((d, i) => `${i * xStep},${yPos(d.score)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', height: `${height}px` }} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

// ── Score breakdown bar ──────────────────────────────────────────
const BreakdownBar = ({ label, pts, max }) => {
  const pct = Math.round((pts / max) * 100)
  const color = pct >= 80 ? '#15803d' : pct >= 50 ? '#a16207' : '#dc2626'
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ fontSize: '13px', color: '#4b5563' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: '600', color }}>{pts}/{max}</span>
      </div>
      <div style={{ height: '5px', background: '#f3f4f6', borderRadius: '3px' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.3s' }} />
      </div>
    </div>
  )
}

const DOT_MILESTONES = [90, 60, 30, 14, 7]

const Dashboard = () => {
  const { data: ob } = useOnboarding()
  const { user: authUser } = useAuth()
  const isPro = authUser?.subscriptionTier === 'driver_pro'

  const [gsDismissed, setGsDismissed] = useState(() => {
    try { return localStorage.getItem(GS_DISMISSED_KEY) === '1' } catch { return false }
  })

  const dismissGS = () => {
    try { localStorage.setItem(GS_DISMISSED_KEY, '1') } catch {}
    setGsDismissed(true)
  }

  const name            = ob.name            || mockUser.name
  const cdlNumber       = ob.cdlNumber       || mockUser.cdlNumber
  const dotPhysicalDate = ob.dotPhysicalDate || mockUser.dotPhysicalDate
  const weight          = Number(ob.weight)  || mockUser.metrics.weight
  const height          = Number(ob.height)  || mockUser.metrics.height
  const systolic        = Number(ob.systolic)  || mockUser.metrics.bloodPressure.systolic
  const diastolic       = Number(ob.diastolic) || mockUser.metrics.bloodPressure.diastolic
  const bloodGlucose    = Number(ob.bloodGlucose) || mockUser.metrics.bloodGlucose

  const metrics = {
    ...mockUser.metrics,
    weight,
    height,
    bloodPressure: { systolic, diastolic },
    bloodGlucose,
  }

  const checkIns       = loadCheckIns()
  const checkInStreak  = getCheckInStreak()
  const todayDone      = !!checkIns[getTodayStr()]

  const dotStatus   = getDotReadinessStatus(metrics, checkInStreak)
  const todayAction = getTodayAction(dotStatus.breakdown)
  const bmi         = calculateBMI(weight, height)

  const daysUntilDot = Math.ceil(
    (new Date(dotPhysicalDate) - new Date()) / (1000 * 60 * 60 * 24)
  )

  const trend30 = getReadinessTrend(30, height)

  const hasHealthRecord   = !!localStorage.getItem('dw_health_records')
  const hasDotReminder    = !!localStorage.getItem('dw_dot_reminders')
  const gsSteps = [
    { done: todayDone,       label: 'Complete your first daily check-in', path: '/checkin'        },
    { done: hasHealthRecord, label: 'Log a health reading (BP, glucose)',  path: '/health-history' },
    { done: hasDotReminder,  label: 'Set a DOT physical reminder',        path: '/dot-reminders'  },
  ]
  const gsAllDone = gsSteps.every(s => s.done)
  const showGS    = checkInStreak === 0 && !gsAllDone && !gsDismissed

  const activeMilestones = DOT_MILESTONES.filter(d => daysUntilDot <= d && daysUntilDot > 0)

  const scoreColors = {
    green:  { bg: '#dcfce7', text: '#15803d', border: '#86efac', ring: '#22c55e' },
    yellow: { bg: '#fef9c3', text: '#a16207', border: '#fde047', ring: '#eab308' },
    red:    { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5', ring: '#ef4444' },
  }
  const sc = scoreColors[dotStatus.status]

  // Inline insurance tier (was a separate card)
  const score = dotStatus.score || 0
  const tier = score >= 70
    ? { label: 'Preferred Risk', color: '#15803d', badge: '✓' }
    : score >= 50
    ? { label: 'Standard Risk',  color: '#a16207', badge: '↑' }
    : { label: 'Elevated Risk',  color: '#dc2626', badge: '!' }

  const bmiColor     = bmi ? (bmi < 25 ? '#15803d' : bmi < 30 ? '#a16207' : '#dc2626') : '#2563eb'
  const glucoseColor = bloodGlucose < 100 ? '#15803d' : bloodGlucose < 126 ? '#a16207' : '#dc2626'

  const firstName = name.split(' ')[0]

  const quickActions = [
    { to: '/workouts',        icon: Clock,          label: 'Workouts', sub: `${mockWorkouts.filter(w => w.space === 'in-truck').length} in-cab`, primary: false },
    { to: '/dot-prep',        icon: CheckCircle2,   label: 'Exam Prep', sub: 'Checklist', primary: true  },
    { to: '/locations',       icon: MapPin,         label: 'Gyms',      sub: 'Nearby',    primary: false },
    { to: '/progress',        icon: TrendingUp,     label: 'Progress',  sub: 'Trends',    primary: false },
    { to: '/mental-wellness', icon: Brain,          label: 'Wellness',  sub: 'Breathing', primary: false },
  ]

  return (
    <div className="screen">

      {/* ── Compact header ─────────────────────────────────── */}
      <header style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '2px' }}>
            Hey {firstName}
          </h1>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>CDL: {cdlNumber}</p>
        </div>
        <Link to="/checkin" aria-label="Daily check-in" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: todayDone ? '#dcfce7' : '#eff6ff',
            border: `2px solid ${todayDone ? '#86efac' : '#bfdbfe'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {todayDone
              ? <CheckCircle2 size={24} color="#15803d" />
              : <ClipboardCheck size={22} color="#2563eb" />
            }
          </div>
        </Link>
      </header>

      {/* ── CARD 1: DOT Readiness Score (with inline insurance tier) ── */}
      <div className="card" style={{ background: sc.bg, border: `1.5px solid ${sc.border}`, marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color={sc.text} />
            <span style={{ fontWeight: '700', fontSize: '13px', color: sc.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              DOT Readiness Score
            </span>
          </div>
          {/* Inline insurance tier pill */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '3px 9px', borderRadius: '999px', fontSize: '11px', fontWeight: '700',
            background: 'white', color: tier.color, border: `1px solid ${tier.color}33`,
          }}>
            {tier.badge} {tier.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
          <div style={{
            width: '88px', height: '88px', borderRadius: '50%', flexShrink: 0,
            background: 'white', border: `4px solid ${sc.ring}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 0 4px ${sc.border}`,
          }}>
            <span style={{ fontSize: '30px', fontWeight: '800', color: sc.text, lineHeight: 1 }}>{dotStatus.score}</span>
            <span style={{ fontSize: '10px', color: sc.text, opacity: 0.7, fontWeight: '600' }}>/ 100</span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              {dotStatus.status === 'green'
                ? <CheckCircle2 size={18} color={sc.text} />
                : <AlertCircle size={18} color={sc.text} />
              }
              <span style={{ fontWeight: '700', fontSize: '18px', color: sc.text }}>{dotStatus.message}</span>
            </div>
            <p style={{ fontSize: '14px', color: sc.text, opacity: 0.85, marginBottom: '8px' }}>
              {daysUntilDot > 0
                ? `Next exam in ${daysUntilDot} days`
                : 'DOT physical is overdue!'}
            </p>
            <div style={{ opacity: 0.85 }}>
              <Sparkline data={trend30} color={sc.ring} height={32} />
              <p style={{ fontSize: '11px', color: sc.text, opacity: 0.7, marginTop: '2px' }}>30-day trend</p>
            </div>
          </div>
        </div>

        {dotStatus.breakdown && (
          <div style={{ borderTop: `1px solid ${sc.border}`, paddingTop: '12px' }}>
            {Object.values(dotStatus.breakdown).map(item => (
              <BreakdownBar key={item.label} label={item.label} pts={item.pts} max={item.max} />
            ))}
          </div>
        )}

        {activeMilestones.length > 0 && (
          <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {activeMilestones.map(m => (
              <span key={m} style={{
                padding: '3px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                background: 'rgba(0,0,0,0.08)', color: sc.text,
              }}>{m}-day milestone</span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <p style={{ fontSize: '11px', color: sc.text, opacity: 0.7 }}>
            Per FMCSA 49 CFR §391.41
          </p>
          <Link to="/progress" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: sc.text, textDecoration: 'none', fontWeight: '600' }}>
            View full trend <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── CARD 2: Today's Recommended Action ──────────────── */}
      <Link
        to={todayAction.path}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="card" style={{ border: '1.5px solid #bfdbfe', background: '#eff6ff', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Zap size={16} color="#2563eb" />
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Today's Action
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '32px', flexShrink: 0 }}>{todayAction.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '700', fontSize: '16px', color: '#1e3a8a', marginBottom: '3px' }}>{todayAction.label}</p>
              <p style={{ fontSize: '14px', color: '#3b82f6' }}>{todayAction.reason}</p>
            </div>
            <ChevronRight size={18} color="#3b82f6" />
          </div>
        </div>
      </Link>

      {/* ── CARD 3: Getting Started (dismissible, new users only) ── */}
      {showGS && (
        <div className="card" style={{ border: '1.5px solid #e5e7eb', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <CheckCircle2 size={18} color="#2563eb" />
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e40af' }}>Getting Started</h3>
            <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#3b82f6', fontWeight: '600' }}>
              {gsSteps.filter(s => s.done).length}/{gsSteps.length} done
            </span>
            <button
              onClick={dismissGS}
              aria-label="Dismiss getting started"
              style={{
                background: '#f3f4f6', border: 'none', borderRadius: '50%',
                width: '26px', height: '26px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', marginLeft: '6px',
              }}
            >
              <X size={14} color="#4b5563" />
            </button>
          </div>
          {gsSteps.map((s) => (
            <Link key={s.label} to={s.path} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 0', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', color: 'inherit' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${s.done ? '#16a34a' : '#93c5fd'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: s.done ? '#dcfce7' : 'white' }}>
                {s.done && <CheckCircle2 size={12} color="#16a34a" />}
              </div>
              <span style={{ fontSize: '15px', color: s.done ? '#4b5563' : '#1e40af', textDecoration: s.done ? 'line-through' : 'none', flex: 1 }}>{s.label}</span>
              {!s.done && <ChevronRight size={14} color="#2563eb" />}
            </Link>
          ))}
        </div>
      )}

      {/* ── Current Metrics ──────────────────────────────────── */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Current Metrics</h3>
          <Link to="/health-history" style={{ fontSize: '14px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>Log reading →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#2563eb' }}>{weight}</p>
            <p style={{ color: '#4b5563', fontSize: '14px' }}>Weight (lbs)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: systolic >= 140 ? '#dc2626' : '#2563eb' }}>
              {systolic}/{diastolic}
            </p>
            <p style={{ color: '#4b5563', fontSize: '14px' }}>Blood Pressure</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: bmiColor }}>{bmi ?? '—'}</p>
            <p style={{ color: '#4b5563', fontSize: '14px' }}>BMI</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: glucoseColor }}>{bloodGlucose}</p>
            <p style={{ color: '#4b5563', fontSize: '14px' }}>Glucose (mg/dL)</p>
          </div>
        </div>
      </div>

      {/* ── Quick Actions (horizontal scroll) ────────────────── */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '0 2px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Quick Actions</h3>
          <Link to="/checkin" style={{ fontSize: '14px', color: todayDone ? '#15803d' : '#2563eb', textDecoration: 'none', fontWeight: '600' }}>
            {todayDone ? '✓ Checked in' : `${checkInStreak}-day streak →`}
          </Link>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {quickActions.map(({ to, icon: Icon, label, sub, primary }) => (
            <Link
              key={to}
              to={to}
              style={{
                textDecoration: 'none', color: 'inherit',
                flexShrink: 0, width: '128px',
                scrollSnapAlign: 'start',
                padding: '14px',
                borderRadius: '12px',
                background: primary ? '#eff6ff' : 'white',
                border: primary ? '1.5px solid #bfdbfe' : '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                display: 'flex', flexDirection: 'column', gap: '8px',
              }}
            >
              <Icon size={22} color="#2563eb" />
              <div>
                <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '2px' }}>{label}</p>
                <p style={{ fontSize: '12px', color: primary ? '#3b82f6' : '#4b5563' }}>{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Upgrade Prompt (Free Users) ──────────────────────── */}
      {!isPro && (
        <div className="card" style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px' }}>Upgrade to Premium</h3>
          <p style={{ fontSize: '14px', marginBottom: '14px', opacity: 0.9 }}>
            Unlock full workout library, DOT reminders, and personalized plans
          </p>
          <Link to="/pricing" className="btn-secondary" style={{ background: 'white', color: '#2563eb', fontSize: '14px', display: 'inline-block', textDecoration: 'none' }}>
            Learn More
          </Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard
