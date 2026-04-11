import React from 'react'
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
        <span style={{ fontSize: '12px', color: '#6b7280' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: '600', color }}>{pts}/{max}</span>
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

  // 30-day readiness trend
  const trend30 = getReadinessTrend(30, height)
  const trendColor = dotStatus.status === 'green' ? '#15803d' : dotStatus.status === 'yellow' ? '#a16207' : '#dc2626'

  // Getting started checklist
  const hasHealthRecord   = !!localStorage.getItem('dw_health_records')
  const hasDotReminder    = !!localStorage.getItem('dw_dot_reminders')
  const gsSteps = [
    { done: todayDone,       label: 'Complete your first daily check-in', path: '/checkin'        },
    { done: hasHealthRecord, label: 'Log a health reading (BP, glucose)',  path: '/health-history' },
    { done: hasDotReminder,  label: 'Set a DOT physical reminder',        path: '/dot-reminders'  },
  ]
  const gsAllDone = gsSteps.every(s => s.done)
  const showGS    = checkInStreak === 0 && !gsAllDone

  // Milestone badges
  const activeMilestones = DOT_MILESTONES.filter(d => daysUntilDot <= d && daysUntilDot > 0)

  // Score ring color mapping
  const scoreColors = {
    green:  { bg: '#dcfce7', text: '#15803d', border: '#86efac', ring: '#22c55e' },
    yellow: { bg: '#fef9c3', text: '#a16207', border: '#fde047', ring: '#eab308' },
    red:    { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5', ring: '#ef4444' },
  }
  const sc = scoreColors[dotStatus.status]

  const bmiColor     = bmi ? (bmi < 25 ? '#15803d' : bmi < 30 ? '#a16207' : '#dc2626') : '#2563eb'
  const glucoseColor = bloodGlucose < 100 ? '#15803d' : bloodGlucose < 126 ? '#a16207' : '#dc2626'

  const firstName = name.split(' ')[0]

  return (
    <div className="screen">

      {/* ── Compact header ─────────────────────────────────── */}
      <header style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '2px' }}>
            Hey {firstName}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '13px' }}>CDL: {cdlNumber}</p>
        </div>
        <Link to="/checkin" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: todayDone ? '#dcfce7' : '#eff6ff',
            border: `2px solid ${todayDone ? '#86efac' : '#bfdbfe'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {todayDone
              ? <CheckCircle2 size={22} color="#15803d" />
              : <ClipboardCheck size={20} color="#2563eb" />
            }
          </div>
        </Link>
      </header>

      {/* ── HERO: DOT Readiness Score ───────────────────────── */}
      <div className="card" style={{ background: sc.bg, border: `1.5px solid ${sc.border}`, marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Activity size={18} color={sc.text} />
          <span style={{ fontWeight: '700', fontSize: '13px', color: sc.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            DOT Readiness Score
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
          {/* Score circle */}
          <div style={{
            width: '88px', height: '88px', borderRadius: '50%', flexShrink: 0,
            background: 'white', border: `4px solid ${sc.ring}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 0 4px ${sc.border}`,
          }}>
            <span style={{ fontSize: '30px', fontWeight: '800', color: sc.text, lineHeight: 1 }}>{dotStatus.score}</span>
            <span style={{ fontSize: '10px', color: sc.text, opacity: 0.7, fontWeight: '600' }}>/ 100</span>
          </div>

          {/* Status + trend */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              {dotStatus.status === 'green'
                ? <CheckCircle2 size={18} color={sc.text} />
                : <AlertCircle size={18} color={sc.text} />
              }
              <span style={{ fontWeight: '700', fontSize: '18px', color: sc.text }}>{dotStatus.message}</span>
            </div>
            <p style={{ fontSize: '13px', color: sc.text, opacity: 0.8, marginBottom: '8px' }}>
              {daysUntilDot > 0
                ? `Next exam in ${daysUntilDot} days`
                : 'DOT physical is overdue!'}
            </p>
            {/* 30-day sparkline */}
            <div style={{ opacity: 0.8 }}>
              <Sparkline data={trend30} color={sc.ring} height={32} />
              <p style={{ fontSize: '10px', color: sc.text, opacity: 0.6, marginTop: '2px' }}>30-day trend</p>
            </div>
          </div>
        </div>

        {/* Score breakdown bars */}
        {dotStatus.breakdown && (
          <div style={{ borderTop: `1px solid ${sc.border}`, paddingTop: '12px' }}>
            {Object.values(dotStatus.breakdown).map(item => (
              <BreakdownBar key={item.label} label={item.label} pts={item.pts} max={item.max} />
            ))}
          </div>
        )}

        {/* Milestone badges */}
        {activeMilestones.length > 0 && (
          <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {activeMilestones.map(m => (
              <span key={m} style={{
                padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: '600',
                background: 'rgba(0,0,0,0.08)', color: sc.text,
              }}>{m}-day milestone</span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <p style={{ fontSize: '10px', color: sc.text, opacity: 0.6 }}>
            Per FMCSA 49 CFR §391.41
          </p>
          <Link to="/progress" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: sc.text, textDecoration: 'none', fontWeight: '600' }}>
            View full trend <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Insurance Risk Tier ─────────────────────────────── */}
      {(() => {
        const score = dotStatus.score || 0
        const tier = score >= 70
          ? { label: 'Preferred Risk',  color: '#15803d', bg: '#f0fdf4', border: '#86efac', desc: 'You qualify for wellness premium discounts with most commercial carriers.', badge: '✓' }
          : score >= 50
          ? { label: 'Standard Risk',   color: '#a16207', bg: '#fffbeb', border: '#fde68a', desc: 'Improving your DOT score to 70+ could unlock lower insurance premiums.', badge: '↑' }
          : { label: 'Elevated Risk',   color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', desc: 'Drivers in this tier see higher premiums. Focus on BP and glucose first.', badge: '!' }
        return (
          <div className="card" style={{ border: `1.5px solid ${tier.border}`, background: tier.bg, marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '11px', fontWeight: '700', color: tier.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  Insurance Risk Profile
                </p>
                <p style={{ fontSize: '18px', fontWeight: '800', color: tier.color, marginBottom: '4px' }}>{tier.label}</p>
                <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5' }}>{tier.desc}</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: tier.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '12px' }}>
                <span style={{ fontSize: '18px', color: 'white', fontWeight: '800' }}>{tier.badge}</span>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Today's Recommended Action ──────────────────────── */}
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
              <p style={{ fontSize: '13px', color: '#3b82f6' }}>{todayAction.reason}</p>
            </div>
            <ChevronRight size={18} color="#3b82f6" />
          </div>
        </div>
      </Link>

      {/* ── Getting Started Checklist ────────────────────────── */}
      {showGS && (
        <div className="card" style={{ border: '1.5px solid #e5e7eb', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <CheckCircle2 size={18} color="#2563eb" />
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e40af' }}>Getting Started</h3>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#3b82f6', fontWeight: '600' }}>
              {gsSteps.filter(s => s.done).length}/{gsSteps.length} done
            </span>
          </div>
          {gsSteps.map((s) => (
            <Link key={s.label} to={s.path} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', color: 'inherit' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${s.done ? '#16a34a' : '#93c5fd'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: s.done ? '#dcfce7' : 'white' }}>
                {s.done && <CheckCircle2 size={10} color="#16a34a" />}
              </div>
              <span style={{ fontSize: '14px', color: s.done ? '#6b7280' : '#1e40af', textDecoration: s.done ? 'line-through' : 'none', flex: 1 }}>{s.label}</span>
              {!s.done && <ChevronRight size={14} color="#2563eb" />}
            </Link>
          ))}
        </div>
      )}

      {/* ── Current Metrics ──────────────────────────────────── */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Current Metrics</h3>
          <Link to="/health-history" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>Log reading →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#2563eb' }}>{weight}</p>
            <p style={{ color: '#6b7280', fontSize: '12px' }}>Weight (lbs)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: systolic >= 140 ? '#dc2626' : '#2563eb' }}>
              {systolic}/{diastolic}
            </p>
            <p style={{ color: '#6b7280', fontSize: '12px' }}>Blood Pressure</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: bmiColor }}>{bmi ?? '—'}</p>
            <p style={{ color: '#6b7280', fontSize: '12px' }}>BMI</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: glucoseColor }}>{bloodGlucose}</p>
            <p style={{ color: '#6b7280', fontSize: '12px' }}>Glucose (mg/dL)</p>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <Link to="/checkin" className="card" style={{ textDecoration: 'none', color: 'inherit', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <ClipboardCheck size={18} style={{ color: '#2563eb' }} />
            <span style={{ marginLeft: '8px', fontWeight: '600', fontSize: '14px' }}>Daily Check-In</span>
          </div>
          <p style={{ fontSize: '12px', color: todayDone ? '#15803d' : '#6b7280' }}>
            {todayDone ? '✓ Done today' : `${checkInStreak} day streak`}
          </p>
        </Link>

        <Link to="/workouts" className="card" style={{ textDecoration: 'none', color: 'inherit', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <Clock size={18} style={{ color: '#2563eb' }} />
            <span style={{ marginLeft: '8px', fontWeight: '600', fontSize: '14px' }}>Workouts</span>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>
            {mockWorkouts.filter(w => w.space === 'in-truck').length} in-cab routines
          </p>
        </Link>

        <Link to="/dot-prep" className="card" style={{ textDecoration: 'none', color: 'inherit', marginBottom: 0, border: '1.5px solid #bfdbfe', background: '#f0f7ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <CheckCircle2 size={18} style={{ color: '#2563eb' }} />
            <span style={{ marginLeft: '8px', fontWeight: '600', fontSize: '14px' }}>Exam Prep</span>
          </div>
          <p style={{ fontSize: '12px', color: '#3b82f6' }}>DOT prep checklist</p>
        </Link>

        <Link to="/locations" className="card" style={{ textDecoration: 'none', color: 'inherit', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <MapPin size={18} style={{ color: '#2563eb' }} />
            <span style={{ marginLeft: '8px', fontWeight: '600', fontSize: '14px' }}>Find Gyms</span>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>Nearby locations</p>
        </Link>

        <Link to="/progress" className="card" style={{ textDecoration: 'none', color: 'inherit', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <TrendingUp size={18} style={{ color: '#2563eb' }} />
            <span style={{ marginLeft: '8px', fontWeight: '600', fontSize: '14px' }}>Progress</span>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>View health trends</p>
        </Link>

        <Link to="/mental-wellness" className="card" style={{ textDecoration: 'none', color: 'inherit', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <Brain size={18} style={{ color: '#2563eb' }} />
            <span style={{ marginLeft: '8px', fontWeight: '600', fontSize: '14px' }}>Wellness</span>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>Breathing & stress</p>
        </Link>
      </div>

      {/* ── Upgrade Prompt (Free Users) ──────────────────────── */}
      {!isPro && (
        <div className="card" style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px' }}>Upgrade to Premium</h3>
          <p style={{ fontSize: '13px', marginBottom: '14px', opacity: 0.9 }}>
            Unlock full workout library, DOT reminders, and personalized plans
          </p>
          <Link to="/pricing" className="btn-secondary" style={{ background: 'white', color: '#2563eb', fontSize: '13px', display: 'inline-block', textDecoration: 'none' }}>
            Learn More
          </Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard
