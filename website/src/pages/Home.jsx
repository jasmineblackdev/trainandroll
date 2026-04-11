import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity, Shield, TrendingUp, Users, CheckCircle2,
  Star, ArrowRight, Truck, Dumbbell, AlertTriangle,
  Clock, BarChart2, Lock, ChevronRight, Zap,
} from 'lucide-react'

// ── DOT Risk Calculator ──────────────────────────────────────────
const DotCalculator = () => {
  const [form, setForm] = useState({ systolic: '', diastolic: '', weight: '', height: '', glucose: '' })
  const [result, setResult] = useState(null)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const calculate = () => {
    const sys = Number(form.systolic), dia = Number(form.diastolic)
    const wt = Number(form.weight),    ht  = Number(form.height)
    const glc = Number(form.glucose)
    let score = 0, flags = []

    if (dia >= 100) { flags.push({ label: 'Blood Pressure', msg: 'Diastolic ≥ 100 is disqualifying', color: '#dc2626' }) }
    else if (sys < 140) { score += 30 }
    else if (sys <= 159) { score += 15; flags.push({ label: 'Blood Pressure', msg: 'Stage 1 hypertension — improve before your physical', color: '#d97706' }) }
    else { flags.push({ label: 'Blood Pressure', msg: 'Stage 2+ hypertension — high risk of disqualification', color: '#dc2626' }) }

    if (ht > 0 && wt > 0) {
      const bmi = (wt / (ht * ht)) * 703
      if (bmi < 30) { score += 20 }
      else if (bmi < 35) { score += 10; flags.push({ label: 'BMI', msg: `BMI ${bmi.toFixed(1)} — obese range, weight loss recommended`, color: '#d97706' }) }
      else { flags.push({ label: 'BMI', msg: `BMI ${bmi.toFixed(1)} — may trigger sleep apnea evaluation`, color: '#dc2626' }) }
    }

    if (glc > 0) {
      if (glc < 100) { score += 20 }
      else if (glc < 126) { score += 10; flags.push({ label: 'Blood Glucose', msg: 'Pre-diabetic range — monitor closely', color: '#d97706' }) }
      else { flags.push({ label: 'Blood Glucose', msg: 'Diabetic range — possible FMCSA exemption required', color: '#dc2626' }) }
    }
    score += 15
    const status = score >= 75 ? 'green' : score >= 55 ? 'yellow' : 'red'
    setResult({ score, status, flags })
  }

  const allFilled = form.systolic && form.diastolic && form.weight && form.height && form.glucose

  return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>Free DOT Risk Assessment</h3>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>See your driver readiness score instantly. No signup required.</p>

      {!result ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            {[
              { key: 'systolic',  label: 'Systolic BP',  placeholder: '135', unit: 'mmHg' },
              { key: 'diastolic', label: 'Diastolic BP', placeholder: '88',  unit: 'mmHg' },
              { key: 'weight',    label: 'Weight',        placeholder: '245', unit: 'lbs'  },
              { key: 'height',    label: 'Height',        placeholder: '70',  unit: 'in'   },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '5px' }}>{f.label}</label>
                <div style={{ display: 'flex', border: '1.5px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                  <input type="number" placeholder={f.placeholder} value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                    style={{ flex: 1, padding: '9px 10px', border: 'none', fontSize: '15px', outline: 'none', width: 0 }} />
                  <span style={{ padding: '9px 10px', background: '#f9fafb', color: '#9ca3af', fontSize: '12px', borderLeft: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{f.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '5px' }}>Fasting Blood Glucose</label>
            <div style={{ display: 'flex', border: '1.5px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              <input type="number" placeholder="105" value={form.glucose} onChange={e => set('glucose', e.target.value)}
                style={{ flex: 1, padding: '9px 12px', border: 'none', fontSize: '15px', outline: 'none' }} />
              <span style={{ padding: '9px 12px', background: '#f9fafb', color: '#9ca3af', fontSize: '12px', borderLeft: '1px solid #e5e7eb' }}>mg/dL</span>
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '13px', opacity: allFilled ? 1 : 0.5 }}
            disabled={!allFilled} onClick={calculate}>
            Calculate My Readiness Score
          </button>
        </>
      ) : (
        <div>
          <div style={{
            textAlign: 'center', padding: '22px', borderRadius: '12px', marginBottom: '18px',
            background: result.status === 'green' ? '#f0fdf4' : result.status === 'yellow' ? '#fefce8' : '#fef2f2',
            border: `2px solid ${result.status === 'green' ? '#86efac' : result.status === 'yellow' ? '#fde047' : '#fca5a5'}`,
          }}>
            <p style={{ fontSize: '48px', fontWeight: '800', color: result.status === 'green' ? '#15803d' : result.status === 'yellow' ? '#a16207' : '#dc2626', lineHeight: 1 }}>
              {result.score}<span style={{ fontSize: '20px', fontWeight: '400', color: '#9ca3af' }}>/100</span>
            </p>
            <p style={{ fontSize: '17px', fontWeight: '700', marginTop: '6px', color: result.status === 'green' ? '#15803d' : result.status === 'yellow' ? '#a16207' : '#dc2626' }}>
              {result.status === 'green' ? '✓ DOT Ready' : result.status === 'yellow' ? '⚠ Moderate Risk' : '✗ High Risk'}
            </p>
          </div>
          {result.flags.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              {result.flags.map((f, i) => (
                <div key={i} style={{ padding: '10px 12px', background: '#fef9f9', borderRadius: '8px', marginBottom: '8px', borderLeft: `3px solid ${f.color}` }}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: f.color }}>{f.label}</p>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{f.msg}</p>
                </div>
              ))}
            </div>
          )}
          <Link to="/drivers" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}>
            Get the DriveWell App to Improve <ArrowRight size={15} />
          </Link>
          <button onClick={() => setResult(null)} style={{ width: '100%', background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px', cursor: 'pointer', color: '#6b7280', fontSize: '13px' }}>
            Recalculate
          </button>
        </div>
      )}
    </div>
  )
}

// ── Readiness Score Visual ───────────────────────────────────────
const ScoreVisual = () => {
  const drivers = [
    { name: 'Driver A', score: 92, status: 'DOT Ready',       color: '#15803d', bg: '#dcfce7', bar: '#22c55e' },
    { name: 'Driver B', score: 74, status: 'Moderate Risk',   color: '#a16207', bg: '#fef9c3', bar: '#eab308' },
    { name: 'Driver C', score: 51, status: 'Needs Attention', color: '#dc2626', bg: '#fee2e2', bar: '#ef4444' },
  ]
  return (
    <div style={{ background: '#0f172a', borderRadius: '16px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>Fleet Readiness Dashboard — Live</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {drivers.map(d => (
          <div key={d.name} style={{ background: '#1e293b', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>{d.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px', fontWeight: '800', color: d.color }}>{d.score}</span>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: d.bg, color: d.color, fontWeight: '600' }}>{d.status}</span>
              </div>
            </div>
            <div style={{ height: '5px', background: '#334155', borderRadius: '3px' }}>
              <div style={{ height: '100%', width: `${d.score}%`, background: d.bar, borderRadius: '3px', transition: 'width 0.6s ease' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
        <p style={{ fontSize: '13px', color: '#fca5a5', fontWeight: '600' }}>⚠ 1 driver flagged — physical in 18 days, BP at 152/96</p>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────
const Home = () => (
  <main>

    {/* ── HERO ── */}
    <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)', color: 'white', padding: '80px 0 100px' }}>
      <div className="container">
        <div className="hero-grid">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '600', marginBottom: '24px' }}>
              <Shield size={13} /> Driver Readiness Intelligence Platform
            </div>
            <h1 style={{ color: 'white', marginBottom: '20px', lineHeight: '1.15' }}>
              Reduce DOT Failures.<br />Protect Your Fleet.
            </h1>
            <p style={{ fontSize: '19px', opacity: 0.88, marginBottom: '32px', lineHeight: '1.6', maxWidth: '520px' }}>
              AI-powered driver health readiness platform. Identify risk 90 days before your next physical — not after a driver fails.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <a href="https://fleet.drivewell.app" target="_blank" rel="noopener noreferrer" className="btn-white" style={{ fontWeight: '700' }}>Request Demo</a>
              <Link to="/pilot" style={{
                padding: '12px 24px', borderRadius: '8px', fontWeight: '600', fontSize: '15px',
                background: 'rgba(255,255,255,0.15)', color: 'white',
                border: '1.5px solid rgba(255,255,255,0.4)', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                Start Pilot Program <ArrowRight size={15} />
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              {[['40%', 'Fewer DOT failures'], ['90 days', 'Early risk detection'], ['$2,500+', 'Saved per averted failure']].map(([v, l]) => (
                <div key={l}>
                  <p style={{ fontSize: '26px', fontWeight: '800' }}>{v}</p>
                  <p style={{ fontSize: '13px', opacity: 0.75 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <DotCalculator />
          </div>
        </div>
      </div>
    </section>

    {/* ── SOCIAL PROOF STRIP ── */}
    <section style={{ background: '#f9fafb', padding: '28px 0', borderBottom: '1px solid #e5e7eb' }}>
      <div className="container">
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginBottom: '18px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trusted by drivers at</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', opacity: 0.45 }}>
          {['J.B. Hunt', 'Werner', 'Schneider', 'Swift', 'Knight-Swift', 'CRST'].map(c => (
            <p key={c} style={{ fontSize: '16px', fontWeight: '700', color: '#374151' }}>{c}</p>
          ))}
        </div>
      </div>
    </section>

    {/* ── PROBLEM SECTION ── */}
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fef2f2', color: '#dc2626', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', marginBottom: '20px' }}>
            <AlertTriangle size={13} /> The Hidden Cost Fleet Managers Miss
          </div>
          <h2 style={{ marginBottom: '14px' }}>The Hidden Cost of Driver Health Risk</h2>
          <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Most fleets find out about driver health problems at the physical exam — when it's too late to act.
          </p>
        </div>

        <div className="grid-2" style={{ marginBottom: '48px' }}>
          {[
            {
              icon: AlertTriangle, color: '#dc2626', bg: '#fef2f2',
              title: 'DOT Failures Disrupt Operations',
              body: 'When a driver fails their physical, you lose them immediately — often during your busiest season. Finding a replacement costs $8,000–$12,000 and takes weeks.',
            },
            {
              icon: TrendingUp, color: '#d97706', bg: '#fffbeb',
              title: 'Turnover Compounds the Problem',
              body: 'Drivers with unmanaged health conditions are 3× more likely to quit or be disqualified within 12 months. Each departure accelerates the recruiting treadmill.',
            },
            {
              icon: BarChart2, color: '#7c3aed', bg: '#f5f3ff',
              title: 'Fleets Have No Early Warning System',
              body: 'Traditional fleet management tracks miles and HOS — not whether a driver\'s blood pressure is trending toward disqualification 60 days from now.',
            },
            {
              icon: Shield, color: '#2563eb', bg: '#eff6ff',
              title: 'Compliance Risk Grows Silently',
              body: 'A driver operating with an expired or at-risk medical certificate exposes your fleet to FMCSA violations, liability, and insurance rate increases.',
            },
          ].map(({ icon: Icon, color, bg, title, body }) => (
            <div key={title} className="card" style={{ borderLeft: `3px solid ${color}` }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>{title}</h3>
                  <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.65' }}>{body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '28px', background: '#eff6ff', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1e3a8a', marginBottom: '8px' }}>
            DriveWell identifies risk 90 days before your next physical.
          </p>
          <p style={{ color: '#3b82f6', fontSize: '16px' }}>
            Not reactive. Not compliance-only. Genuinely proactive.
          </p>
        </div>
      </div>
    </section>

    {/* ── HOW IT WORKS ── */}
    <section className="section" style={{ background: '#f9fafb' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ marginBottom: '12px' }}>How DriveWell Works</h2>
          <p className="text-muted" style={{ fontSize: '17px', maxWidth: '520px', margin: '0 auto' }}>Four steps from health risk to proactive action.</p>
        </div>
        <div className="grid-4">
          {[
            {
              step: '01', color: '#2563eb', bg: '#eff6ff',
              title: 'Drivers Track Daily',
              body: 'Drivers use the mobile app to log BP, weight, sleep quality, and complete quick check-ins. Takes 2 minutes a day.',
            },
            {
              step: '02', color: '#7c3aed', bg: '#f5f3ff',
              title: 'AI Scores Readiness',
              body: 'Our FMCSA-weighted algorithm evaluates 5 health factors and generates a 0–100 Driver Readiness Score updated daily.',
            },
            {
              step: '03', color: '#059669', bg: '#f0fdf4',
              title: 'Dashboard Flags Risk',
              body: 'Fleet managers see color-coded readiness across every driver. At-risk drivers are surfaced automatically — 90 days out.',
            },
            {
              step: '04', color: '#ea580c', bg: '#fff7ed',
              title: 'Act Before It\'s a Problem',
              body: 'Recommend targeted workouts, schedule earlier physicals, and document your proactive wellness program for insurers.',
            },
          ].map(({ step, color, bg, title, body }, idx) => (
            <div key={step} style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: bg, border: `2px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', color }}>{step}</span>
              </div>
              {idx < 3 && (
                <div style={{ display: 'none' }} className="step-arrow" />
              )}
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{title}</h3>
              <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6' }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── READINESS SCORE CONCEPT ── */}
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <div className="hero-grid" style={{ alignItems: 'center', gap: '60px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eff6ff', color: '#2563eb', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', marginBottom: '20px' }}>
              <Activity size={13} /> The Readiness Score
            </div>
            <h2 style={{ marginBottom: '16px' }}>Know Who's at Risk Before the Exam</h2>
            <p className="text-muted" style={{ fontSize: '17px', marginBottom: '28px', lineHeight: '1.7' }}>
              The Driver Readiness Score is a 0–100 composite built on the same five health factors FMCSA examiners evaluate: blood pressure, BMI, heart rate, blood glucose, and habit consistency.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {[
                { score: '85–100', label: 'DOT Ready',       color: '#15803d', bg: '#dcfce7', desc: 'Likely to pass — maintain current habits' },
                { score: '65–84',  label: 'Moderate Risk',   color: '#a16207', bg: '#fef9c3', desc: 'Address flagged metrics in next 60 days' },
                { score: '0–64',   label: 'Needs Attention', color: '#dc2626', bg: '#fee2e2', desc: 'High risk of failure — proactive plan recommended' },
              ].map(r => (
                <div key={r.score} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: r.bg, borderRadius: '10px', border: `1px solid ${r.color}30` }}>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: r.color, minWidth: '52px' }}>{r.score}</span>
                  <div>
                    <p style={{ fontWeight: '700', color: r.color, fontSize: '14px' }}>{r.label}</p>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/fleets" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontWeight: '600', fontSize: '15px', textDecoration: 'none' }}>
              See fleet dashboard <ChevronRight size={16} />
            </Link>
          </div>
          <div>
            <ScoreVisual />
          </div>
        </div>
      </div>
    </section>

    {/* ── TWO-SIDED PLATFORM ── */}
    <section className="section" style={{ background: '#f9fafb' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ marginBottom: '12px' }}>One Platform. Two Powerful Experiences.</h2>
          <p className="text-muted" style={{ fontSize: '17px', maxWidth: '520px', margin: '0 auto' }}>
            Designed for drivers who need to stay certified and fleets that need to stay operational.
          </p>
        </div>

        <div className="grid-2">
          {/* For Drivers */}
          <div className="card" style={{ borderTop: '3px solid #2563eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={20} color="#2563eb" />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>For Drivers</p>
                <h3 style={{ fontSize: '18px', margin: 0 }}>Your CDL Readiness Coach</h3>
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: '14px', marginBottom: '20px', lineHeight: '1.65' }}>
              Drivers get a daily readiness score, personalized action plan, and workouts built for truck cabs and parking lots — all in under 5 minutes a day.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Daily DOT Readiness Score (0–100)',
                'Micro-workouts designed for truck stops',
                'DOT exam prep checklist',
                'BP, glucose & weight tracking',
                'Sleep quality monitoring',
                'Check-in streaks & achievement badges',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                  <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '1px' }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/drivers" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              Driver Features <ArrowRight size={15} />
            </Link>
          </div>

          {/* For Fleets */}
          <div className="card" style={{ borderTop: '3px solid #7c3aed' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} color="#7c3aed" />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em' }}>For Fleets</p>
                <h3 style={{ fontSize: '18px', margin: 0 }}>Your Workforce Readiness Hub</h3>
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: '14px', marginBottom: '20px', lineHeight: '1.65' }}>
              Fleet managers get a real-time view of every driver's readiness score, renewal timeline, and risk status — with zero manual data collection.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Fleet-wide readiness dashboard',
                '90-day DOT renewal countdown alerts',
                'Risk stratification by driver score',
                'Fleet health trend analytics',
                'Insurance compliance PDF reports',
                'ELD roster import (Samsara, Motive)',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                  <CheckCircle2 size={16} color="#7c3aed" style={{ flexShrink: 0, marginTop: '1px' }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/fleets" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', padding: '12px 20px', background: '#7c3aed', color: 'white', borderRadius: '8px', fontWeight: '600', textDecoration: 'none', fontSize: '15px' }}>
              Fleet Features <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Trainer callout */}
        <div style={{ marginTop: '24px', padding: '20px 24px', background: '#fff7ed', borderRadius: '12px', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Dumbbell size={20} color="#ea580c" />
            </div>
            <div>
              <p style={{ fontWeight: '700', fontSize: '15px', color: '#9a3412' }}>Are you a personal trainer?</p>
              <p style={{ fontSize: '13px', color: '#c2410c' }}>Reach 50,000+ CDL drivers actively looking for coaching. List your services on DriveWell.</p>
            </div>
          </div>
          <Link to="/trainers" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#ea580c', color: 'white', borderRadius: '8px', fontWeight: '600', fontSize: '14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Learn More <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>

    {/* ── PILOT PROGRAM ── */}
    <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '80px 0' }}>
      <div className="container">
        <div className="hero-grid" style={{ alignItems: 'center', gap: '60px' }}>
          <div style={{ color: 'white' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', marginBottom: '20px' }}>
              <Zap size={13} /> 90-Day Pilot Program
            </div>
            <h2 style={{ color: 'white', marginBottom: '16px' }}>Start Small. Prove the ROI.</h2>
            <p style={{ color: '#94a3b8', fontSize: '17px', marginBottom: '32px', lineHeight: '1.7' }}>
              We designed our pilot program specifically for fleet managers who need to demonstrate value before committing to a full rollout.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/pilot" className="btn-primary" style={{ fontSize: '15px' }}>
                Schedule Pilot Consultation
              </Link>
              <Link to="/pricing" style={{ padding: '12px 24px', borderRadius: '8px', fontWeight: '600', fontSize: '15px', background: 'transparent', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', textDecoration: 'none' }}>
                View Pricing
              </Link>
            </div>
          </div>
          <div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ color: '#a5b4fc', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>What's Included</p>
              {[
                { icon: Users,      label: 'Up to 50 drivers',          sub: 'Full mobile app access for your pilot cohort' },
                { icon: Clock,      label: '90-day program',             sub: 'Enough time to see real readiness trends emerge' },
                { icon: BarChart2,  label: 'Readiness trend reporting',  sub: 'Weekly aggregate reports on fleet health trajectory' },
                { icon: TrendingUp, label: 'Engagement analytics',       sub: 'App usage, check-in rates, and habit adoption data' },
                { icon: Shield,     label: 'ROI evaluation support',     sub: 'We help you calculate the value at pilot end' },
                { icon: CheckCircle2, label: 'Dedicated onboarding',     sub: 'White-glove setup and driver enrollment support' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={17} color="#a5b4fc" />
                  </div>
                  <div>
                    <p style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{label}</p>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── OUTCOMES (reframed from features) ── */}
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ marginBottom: '12px' }}>What DriveWell Delivers</h2>
          <p className="text-muted" style={{ fontSize: '17px', maxWidth: '520px', margin: '0 auto' }}>
            Built on the health metrics FMCSA examiners actually use to evaluate CDL fitness.
          </p>
        </div>
        <div className="grid-3">
          {[
            {
              icon: Activity,   color: '#2563eb', bg: '#eff6ff',
              title: 'Improve DOT Exam Readiness',
              body: 'The FMCSA-weighted readiness score tells drivers exactly what to fix — and shows fleet managers who needs attention months ahead of their physical.',
            },
            {
              icon: TrendingUp, color: '#059669', bg: '#f0fdf4',
              title: 'Reduce Preventable Turnover',
              body: 'Drivers who stay healthy and DOT-compliant stay on your payroll. Every prevented failure saves $8,000–$12,000 in replacement costs.',
            },
            {
              icon: Shield,     color: '#7c3aed', bg: '#f5f3ff',
              title: 'Identify Risk 90 Days Earlier',
              body: 'Stop finding out at the physical. Trend data surfaces drivers whose BP or BMI is moving in the wrong direction — giving you time to act.',
            },
            {
              icon: BarChart2,  color: '#ea580c', bg: '#fff7ed',
              title: 'Support Driver Wellness Habits',
              body: 'Daily check-ins, micro-workouts, and DOT prep checklists make it easy for drivers to build the habits that move their score in the right direction.',
            },
            {
              icon: Dumbbell,   color: '#d97706', bg: '#fffbeb',
              title: 'Lower Insurance Premiums',
              body: 'One-click compliance reports document your proactive wellness program. Fleets using DriveWell have reported 5–15% reductions in commercial auto premiums.',
            },
            {
              icon: Users,      color: '#0891b2', bg: '#f0f9ff',
              title: 'Improve Workforce Stability',
              body: 'Healthier drivers miss fewer days, file fewer workers\' comp claims, and have fewer at-fault accidents — reducing the total cost of your driver workforce.',
            },
          ].map(({ icon: Icon, color, bg, title, body }) => (
            <div key={title} className="card">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{title}</h3>
              <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6' }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── TESTIMONIALS ── */}
    <section className="section" style={{ background: '#f9fafb' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Drivers Who Kept Their CDL</h2>
        <div className="grid-3">
          {[
            { name: 'Marcus T.', cdl: 'CDL-TX', text: 'My blood pressure was 148/94 — I was terrified of failing my physical. After 3 months on DriveWell, I passed with 128/82. This app literally saved my career.' },
            { name: 'Sharon W.', cdl: 'CDL-FL', text: 'The in-cab workouts are the only thing that works for me. 5 minutes between pickups, 3x a day. Down 18 pounds in 4 months without a gym.' },
            { name: 'Dale H.',   cdl: 'CDL-TN', text: 'The sleep apnea screening found I was high risk. Got tested, got my CPAP, and I haven\'t felt this alert driving in years. My fleet manager loves the reports.' },
          ].map((t) => (
            <div key={t.name} className="card">
              <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={15} color="#eab308" fill="#eab308" />)}
              </div>
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.65', marginBottom: '16px', fontStyle: 'italic' }}>"{t.text}"</p>
              <div>
                <p style={{ fontWeight: '600', fontSize: '14px' }}>{t.name}</p>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>{t.cdl}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── TRUST SIGNALS ── */}
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ marginBottom: '10px' }}>Built for Regulated Industries</h2>
          <p className="text-muted" style={{ fontSize: '16px' }}>Security, privacy, and compliance are foundational — not an afterthought.</p>
        </div>
        <div className="grid-4">
          {[
            { icon: Lock,        color: '#2563eb', bg: '#eff6ff', title: 'Data Encrypted',         body: 'All health data encrypted at rest and in transit (AES-256 + TLS 1.3). HIPAA-aligned data handling.' },
            { icon: Shield,      color: '#059669', bg: '#f0fdf4', title: 'Privacy First',          body: 'Drivers own their health data. Fleet admins see aggregate scores — not individual medical records without consent.' },
            { icon: CheckCircle2,color: '#7c3aed', bg: '#f5f3ff', title: 'Pilot Available',        body: 'Start with 50 drivers, 90 days, no long-term contract. We earn the full rollout by proving value first.' },
            { icon: Users,       color: '#ea580c', bg: '#fff7ed', title: 'Dedicated Support',      body: 'Every fleet account includes an onboarding specialist, driver enrollment support, and direct Slack access.' },
          ].map(({ icon: Icon, color, bg, title, body }) => (
            <div key={title} style={{ textAlign: 'center', padding: '28px 20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontSize: '15px', marginBottom: '8px' }}>{title}</h3>
              <p className="text-muted" style={{ fontSize: '13px', lineHeight: '1.6' }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── FINAL CTA ── */}
    <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', padding: '80px 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{ color: 'white', marginBottom: '14px', fontSize: '34px' }}>
          Ready to stop reactive compliance?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', marginBottom: '36px', maxWidth: '520px', margin: '0 auto 36px' }}>
          Join fleets that catch driver health risk 90 days before it becomes an operational problem.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
          <a href="https://fleet.drivewell.app" target="_blank" rel="noopener noreferrer" className="btn-white" style={{ fontWeight: '700', fontSize: '16px', padding: '15px 32px' }}>
            Request Fleet Demo
          </a>
          <Link to="/pilot" style={{ padding: '15px 32px', borderRadius: '8px', fontWeight: '600', fontSize: '16px', background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.4)', textDecoration: 'none' }}>
            Start Pilot Program
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['No long-term contract', '50-driver pilot available', 'Setup in under 10 minutes', 'Dedicated onboarding'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>
              <CheckCircle2 size={14} color="#86efac" /> {t}
            </div>
          ))}
        </div>
      </div>
    </section>

  </main>
)

export default Home
