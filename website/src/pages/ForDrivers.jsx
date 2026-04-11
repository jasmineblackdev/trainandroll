import React from 'react'
import { Link } from 'react-router-dom'
import { Activity, Dumbbell, Utensils, Moon, TrendingUp, HeartPulse, Trophy, CheckCircle2, ArrowRight } from 'lucide-react'

const ForDrivers = () => (
  <main>
    <section style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb)', color: 'white', padding: '80px 0' }}>
      <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '600', marginBottom: '24px' }}>
          🚛 For CDL Drivers
        </div>
        <h1 style={{ color: 'white', marginBottom: '20px' }}>Your Health Is Your License</h1>
        <p style={{ fontSize: '19px', opacity: 0.88, marginBottom: '36px', lineHeight: '1.6' }}>
          DriveWell is the only health app built around what CDL examiners actually check — blood pressure, BMI, glucose, and sleep apnea risk.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#" className="btn-white" style={{ fontSize: '15px' }}>📱 Download for iOS</a>
          <a href="#" className="btn-white" style={{ fontSize: '15px' }}>🤖 Download for Android</a>
        </div>
        <p style={{ marginTop: '16px', opacity: 0.7, fontSize: '13px' }}>Free to download · No credit card required</p>
      </div>
    </section>

    {/* DOT Score explainer */}
    <section style={{ background: '#f9fafb', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '12px' }}>Your DOT Score — Explained</h2>
        <p className="text-muted" style={{ textAlign: 'center', fontSize: '16px', marginBottom: '40px' }}>
          DriveWell calculates your readiness score based on the exact metrics FMCSA medical examiners evaluate.
        </p>
        <div className="grid-2">
          {[
            { label: 'Blood Pressure', pts: 30, desc: 'Systolic < 140 / Diastolic < 90 = full points. Stage 2+ hypertension = disqualifying.' },
            { label: 'BMI',            pts: 20, desc: 'BMI under 30 = full points. Over 35 triggers sleep apnea evaluation.' },
            { label: 'Blood Glucose',  pts: 20, desc: 'Fasting glucose under 100 = full points. Over 126 indicates diabetes.' },
            { label: 'Resting HR',     pts: 15, desc: '60–100 bpm = full points. High resting HR indicates cardiovascular stress.' },
            { label: 'Check-In Streak',pts: 15, desc: '7+ day streak = full points. Rewards consistent self-monitoring.' },
          ].map(({ label, pts, desc }) => (
            <div key={label} className="card" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '10px 14px', textAlign: 'center', flexShrink: 0, minWidth: '60px' }}>
                <p style={{ fontSize: '20px', fontWeight: '800', color: '#2563eb' }}>{pts}</p>
                <p style={{ fontSize: '11px', color: '#6b7280' }}>pts</p>
              </div>
              <div>
                <h3 style={{ fontSize: '15px', marginBottom: '4px' }}>{label}</h3>
                <p className="text-muted" style={{ fontSize: '13px', lineHeight: '1.5' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* All features */}
    <section className="section">
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '48px' }}>Everything in the App</h2>
        <div className="grid-3">
          {[
            { icon: Activity,   color: '#2563eb', title: 'DOT Readiness Score',   desc: 'Live score based on your actual metrics. Know exactly where you stand before your exam.' },
            { icon: Dumbbell,   color: '#7c3aed', title: 'Workout Library',       desc: '50+ routines built for in-cab, beside-the-truck, and gym environments. Videos included.' },
            { icon: Utensils,   color: '#ea580c', title: 'Nutrition Tracking',    desc: 'Log meals, track sodium (BP killer), find healthy options at truck stops near you.' },
            { icon: Moon,       color: '#0891b2', title: 'Sleep Apnea Screening', desc: 'STOP-BANG questionnaire — the same tool your DOT examiner uses. Know your risk first.' },
            { icon: TrendingUp, color: '#059669', title: 'Progress Charts',       desc: '90-day trends for all your key metrics. Watch your BP and glucose improve over time.' },
            { icon: HeartPulse, color: '#dc2626', title: 'Telehealth Booking',    desc: 'Book a DOT-certified medical examiner directly from the app. Same-day appointments.' },
            { icon: Trophy,     color: '#d97706', title: 'Achievements',          desc: 'Earn badges for streaks, fitness milestones, and DOT readiness goals.' },
            { icon: CheckCircle2,color:'#22c55e', title: 'Daily Check-In',        desc: 'Log sleep quality, energy, stress, and water intake. Builds your streak and raises your score.' },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="card">
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>{title}</h3>
              <p className="text-muted" style={{ fontSize: '13px', lineHeight: '1.5' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '80px 0', color: 'white' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{ color: 'white', marginBottom: '14px' }}>Download Free Today</h2>
        <p style={{ opacity: 0.85, fontSize: '17px', marginBottom: '32px' }}>No credit card. No commitment. Just a healthier you before your next DOT physical.</p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#" className="btn-white" style={{ fontSize: '16px' }}>📱 App Store</a>
          <a href="#" className="btn-white" style={{ fontSize: '16px' }}>🤖 Google Play</a>
        </div>
      </div>
    </section>
  </main>
)

export default ForDrivers
