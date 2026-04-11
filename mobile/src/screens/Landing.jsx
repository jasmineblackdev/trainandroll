import React from 'react'
import {
  Dumbbell, MapPin, ClipboardCheck, BarChart2,
  Truck, Users, Award, CheckCircle2, ChevronRight,
  AlertTriangle, Clock, Activity,
} from 'lucide-react'

const BLUE  = '#1d4ed8'
const DARK  = '#0f172a'
const MID   = '#374151'
const MUTED = '#6b7280'

/* ── small reusable ── */
const Badge = ({ children }) => (
  <span style={{
    display: 'inline-block', background: 'rgba(255,255,255,.15)',
    color: 'white', fontSize: '12px', fontWeight: '600',
    padding: '4px 12px', borderRadius: '999px',
    border: '1px solid rgba(255,255,255,.25)', marginBottom: '20px',
    letterSpacing: '.4px',
  }}>{children}</span>
)

/* ══════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════ */
const Hero = ({ onGetStarted, onSignIn }) => (
  <section style={{
    background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)',
    padding: '60px 24px 48px',
    textAlign: 'center',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* dot grid texture */}
    <div style={{
      position: 'absolute', inset: 0, opacity: .06,
      backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
      backgroundSize: '28px 28px',
    }} />

    <div style={{ position: 'relative' }}>
      <img src="/logo.png" alt="Train&Roll" style={{ height: '52px', width: 'auto', marginBottom: '24px' }} />

      <Badge>Driver Fitness & DOT Readiness</Badge>

      <h1 style={{
        fontSize: '34px', fontWeight: '800', lineHeight: 1.15,
        margin: '0 0 16px', letterSpacing: '-0.5px',
      }}>
        Stay Fit.<br />Stay Certified.<br />Stay Driving.
      </h1>

      <p style={{ fontSize: '16px', color: '#93c5fd', lineHeight: 1.6, margin: '0 0 8px' }}>
        Prevent DOT physical failures with training built for truck drivers.
      </p>

      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '36px' }}>
        Workouts in-truck &nbsp;·&nbsp; Gym locator &nbsp;·&nbsp; DOT prep
      </p>

      {/* Primary CTA */}
      <button
        onClick={onGetStarted}
        style={{
          width: '100%', padding: '16px', background: 'white',
          color: BLUE, border: 'none', borderRadius: '12px',
          fontSize: '17px', fontWeight: '700', cursor: 'pointer',
          marginBottom: '12px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,.2)',
        }}
      >
        Get Started Free <ChevronRight size={18} />
      </button>

      {/* Secondary CTA */}
      <button
        onClick={onSignIn}
        style={{
          width: '100%', padding: '15px',
          background: 'rgba(255,255,255,.1)', color: 'white',
          border: '1px solid rgba(255,255,255,.2)', borderRadius: '12px',
          fontSize: '16px', fontWeight: '600', cursor: 'pointer',
        }}
      >
        Sign In
      </button>

      {/* stats */}
      <div style={{
        display: 'flex', justifyContent: 'space-around',
        marginTop: '40px', paddingTop: '32px',
        borderTop: '1px solid rgba(255,255,255,.1)',
      }}>
        {[
          { num: '1 in 4', label: 'drivers fail DOT' },
          { num: '73%',    label: 'failures preventable' },
          { num: '30 days', label: 'free pilot' },
        ].map(({ num, label }) => (
          <div key={num} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>{num}</p>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ══════════════════════════════════════════════════════
   PROBLEM
══════════════════════════════════════════════════════ */
const problems = [
  { icon: Clock,         title: 'Limited time between loads',  color: '#dc2626', bg: '#fef2f2' },
  { icon: MapPin,        title: 'No gym access at truck stops', color: '#d97706', bg: '#fffbeb' },
  { icon: Truck,         title: '8–14 hrs seated every shift',  color: '#7c3aed', bg: '#f5f3ff' },
  { icon: AlertTriangle, title: 'DOT failure = lost income',    color: '#dc2626', bg: '#fef2f2' },
]

const Problem = () => (
  <section style={{ padding: '48px 24px', background: '#f8fafc' }}>
    <p style={{ fontSize: '12px', fontWeight: '700', color: BLUE, letterSpacing: '1px',
      textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>The Problem</p>
    <h2 style={{ fontSize: '24px', fontWeight: '800', color: DARK, margin: '0 0 8px',
      textAlign: 'center', letterSpacing: '-.3px' }}>
      Truck drivers face health challenges no one else does
    </h2>
    <p style={{ fontSize: '15px', color: MUTED, textAlign: 'center', marginBottom: '32px', lineHeight: 1.6 }}>
      The road doesn't stop — and neither do the health risks.
    </p>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {problems.map(({ icon: Icon, title, color, bg }) => (
        <div key={title} style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          background: 'white', borderRadius: '12px', padding: '16px 20px',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px', background: bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={20} color={color} />
          </div>
          <p style={{ fontSize: '15px', fontWeight: '600', color: DARK, margin: 0 }}>{title}</p>
        </div>
      ))}
    </div>
  </section>
)

/* ══════════════════════════════════════════════════════
   FEATURES
══════════════════════════════════════════════════════ */
const features = [
  { icon: Dumbbell,       title: 'Workout Anywhere',       body: '5–20 min routines for in-cab, rest-stop, or motel room. No gym needed.',   color: '#7c3aed', bg: '#f5f3ff' },
  { icon: MapPin,         title: 'Gym Locator',            body: 'Find truck-friendly gyms near your stops with parking filters.',            color: '#059669', bg: '#ecfdf5' },
  { icon: ClipboardCheck, title: 'DOT Readiness Score',    body: 'Track your BP, BMI, and glucose against FMCSA standards before exam day.', color: BLUE,      bg: '#eff6ff' },
  { icon: BarChart2,      title: 'Fleet Dashboard',        body: 'Fleets see anonymized driver readiness trends and renewal dates.',          color: '#d97706', bg: '#fffbeb' },
]

const Features = () => (
  <section style={{ padding: '48px 24px', background: 'white' }}>
    <p style={{ fontSize: '12px', fontWeight: '700', color: BLUE, letterSpacing: '1px',
      textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>Key Features</p>
    <h2 style={{ fontSize: '24px', fontWeight: '800', color: DARK, margin: '0 0 32px',
      textAlign: 'center', letterSpacing: '-.3px' }}>
      Everything a driver needs
    </h2>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {features.map(({ icon: Icon, title, body, color, bg }) => (
        <div key={title} style={{
          display: 'flex', gap: '16px', alignItems: 'flex-start',
          background: '#f8fafc', borderRadius: '14px', padding: '20px',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px', background: bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={22} color={color} />
          </div>
          <div>
            <p style={{ fontWeight: '700', fontSize: '15px', color: DARK, marginBottom: '4px' }}>{title}</p>
            <p style={{ fontSize: '13px', color: MUTED, lineHeight: 1.6, margin: 0 }}>{body}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
)

/* ══════════════════════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════════════════════ */
const steps = [
  { num: '1', title: 'Download the app',           body: 'Set up takes under 3 minutes.' },
  { num: '2', title: 'Complete readiness profile', body: 'Enter your health baselines and DOT exam date.' },
  { num: '3', title: 'Follow training guidance',   body: 'Daily workouts and tips tailored to your schedule.' },
  { num: '4', title: 'Improve your DOT pass rate', body: 'Walk into your exam confident, not guessing.' },
]

const HowItWorks = () => (
  <section style={{ padding: '48px 24px', background: '#f8fafc' }}>
    <p style={{ fontSize: '12px', fontWeight: '700', color: BLUE, letterSpacing: '1px',
      textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>How It Works</p>
    <h2 style={{ fontSize: '24px', fontWeight: '800', color: DARK, margin: '0 0 32px',
      textAlign: 'center', letterSpacing: '-.3px' }}>
      Up and running in minutes
    </h2>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {steps.map(({ num, title, body }, i) => (
        <div key={num} style={{ display: 'flex', gap: '16px', paddingBottom: i < steps.length - 1 ? '24px' : 0, position: 'relative' }}>
          {i < steps.length - 1 && (
            <div style={{ position: 'absolute', left: '19px', top: '44px', width: '2px', height: 'calc(100% - 20px)', background: '#dbeafe' }} />
          )}
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%', background: BLUE,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1,
          }}>
            <span style={{ color: 'white', fontWeight: '800', fontSize: '15px' }}>{num}</span>
          </div>
          <div style={{ paddingTop: '8px' }}>
            <p style={{ fontWeight: '700', fontSize: '15px', color: DARK, marginBottom: '4px' }}>{title}</p>
            <p style={{ fontSize: '13px', color: MUTED, lineHeight: 1.6, margin: 0 }}>{body}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
)

/* ══════════════════════════════════════════════════════
   WHO IT'S FOR
══════════════════════════════════════════════════════ */
const audiences = [
  { icon: Truck, label: 'Long-Haul Drivers',  desc: 'OTR drivers spending weeks away from traditional fitness.' },
  { icon: Award, label: 'Owner Operators',    desc: 'Your livelihood depends on passing your physical.' },
  { icon: Users, label: 'Fleet Managers',     desc: 'Reduce DOT downtime and driver turnover across your fleet.' },
]

const trust = [
  'Designed with certified trainers',
  'Built for CDL drivers',
  'Supports DOT health metrics',
]

const WhoItsFor = () => (
  <section style={{ padding: '48px 24px', background: 'white' }}>
    <p style={{ fontSize: '12px', fontWeight: '700', color: BLUE, letterSpacing: '1px',
      textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>Who It's For</p>
    <h2 style={{ fontSize: '24px', fontWeight: '800', color: DARK, margin: '0 0 8px',
      textAlign: 'center', letterSpacing: '-.3px' }}>
      Built for trucking
    </h2>
    <p style={{ fontSize: '15px', color: MUTED, textAlign: 'center', marginBottom: '32px', lineHeight: 1.6 }}>
      Not adapted from a generic fitness app. Built from scratch for life on the road.
    </p>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
      {audiences.map(({ icon: Icon, label, desc }) => (
        <div key={label} style={{
          display: 'flex', gap: '16px', alignItems: 'center',
          background: '#f8fafc', borderRadius: '14px', padding: '20px',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={22} color={BLUE} />
          </div>
          <div>
            <p style={{ fontWeight: '700', fontSize: '15px', color: DARK, marginBottom: '2px' }}>{label}</p>
            <p style={{ fontSize: '13px', color: MUTED, margin: 0, lineHeight: 1.5 }}>{desc}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Trust badges */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {trust.map(t => (
        <div key={t} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          fontSize: '14px', fontWeight: '500', color: MID,
        }}>
          <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
          {t}
        </div>
      ))}
    </div>
  </section>
)

/* ══════════════════════════════════════════════════════
   BOTTOM CTA
══════════════════════════════════════════════════════ */
const BottomCTA = ({ onGetStarted, onSignIn }) => (
  <section style={{
    padding: '48px 24px 64px',
    background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 100%)',
    textAlign: 'center',
    color: 'white',
  }}>
    <Activity size={40} color="#93c5fd" style={{ marginBottom: '16px' }} />
    <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 12px', letterSpacing: '-.3px' }}>
      Ready to reduce DOT failures?
    </h2>
    <p style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '32px', lineHeight: 1.6 }}>
      Start free. No credit card required.
    </p>

    <button
      onClick={onGetStarted}
      style={{
        width: '100%', padding: '16px', background: 'white',
        color: BLUE, border: 'none', borderRadius: '12px',
        fontSize: '17px', fontWeight: '700', cursor: 'pointer',
        marginBottom: '12px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '8px',
      }}
    >
      Get Started Free <ChevronRight size={18} />
    </button>

    <button
      onClick={onSignIn}
      style={{
        width: '100%', padding: '15px',
        background: 'rgba(255,255,255,.1)', color: 'white',
        border: '1px solid rgba(255,255,255,.2)', borderRadius: '12px',
        fontSize: '16px', fontWeight: '600', cursor: 'pointer',
      }}
    >
      Already have an account? Sign In
    </button>
  </section>
)

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
export default function Landing({ onGetStarted, onSignIn }) {
  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', overflowX: 'hidden' }}>
      <Hero        onGetStarted={onGetStarted} onSignIn={onSignIn} />
      <Problem />
      <Features />
      <HowItWorks />
      <WhoItsFor />
      <BottomCTA   onGetStarted={onGetStarted} onSignIn={onSignIn} />
    </div>
  )
}
