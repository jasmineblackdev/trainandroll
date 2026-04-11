import React, { useState } from 'react'
import { CheckCircle2, Zap, Shield, Star } from 'lucide-react'

const FREE_FEATURES = [
  'DOT Readiness Score',
  'Daily Check-In (sleep, energy, stress)',
  '5 Workout routines',
  'DOT physical countdown',
  'Find nearby DOT providers',
  'Basic progress tracking',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Full workout library (50+ routines)',
  'Workout video library',
  'Nutrition & meal tracking',
  'Sleep apnea risk screening',
  'Wearable sync (Apple Health, Garmin)',
  'Telehealth & DOT provider booking',
  'Mental wellness & breathing tools',
  'Personal trainer marketplace',
  'Achievements & streak rewards',
  'Personalized workout recommendations',
  'Downloadable DOT readiness reports',
]

const FLEET_FEATURES = [
  'Everything in Pro — for every driver',
  'Fleet manager dashboard',
  'DOT renewal tracking & alerts',
  'Engagement & wellness analytics',
  'Fleet insurance compliance report',
  'ELD integrations (Samsara, Motive)',
  'Activity feed & driver detail views',
  'CSV / PDF report exports',
  'Priority support',
]

const FeatureRow = ({ text, included = true }) => (
  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
    <CheckCircle2 size={16} color={included ? '#22c55e' : '#d1d5db'} style={{ flexShrink: 0, marginTop: '1px' }} />
    <span style={{ fontSize: '14px', color: included ? '#374151' : '#9ca3af' }}>{text}</span>
  </div>
)

const Pricing = () => {
  const [billing, setBilling] = useState('monthly') // 'monthly' | 'annual'

  const proMonthly = 14.99
  const proAnnual  = 9.99   // $119.99/yr ÷ 12
  const proPrice   = billing === 'annual' ? proAnnual : proMonthly

  return (
    <div className="screen">
      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Upgrade Your Plan</h1>
        <p style={{ color: '#6b7280', fontSize: '15px' }}>Stay DOT-ready. Keep your CDL.</p>
      </header>

      {/* Billing toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '10px', padding: '4px', gap: '4px' }}>
          {['monthly', 'annual'].map(b => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              style={{
                padding: '8px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                background: billing === b ? 'white' : 'transparent',
                color: billing === b ? '#111827' : '#6b7280',
                fontWeight: billing === b ? '600' : '400',
                fontSize: '14px',
                boxShadow: billing === b ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {b === 'annual' ? 'Annual (save 34%)' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      {/* Free tier */}
      <div className="card" style={{ marginBottom: '16px', border: '1.5px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Free</h2>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>Get started at no cost</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '28px', fontWeight: '700' }}>$0</p>
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>forever</p>
          </div>
        </div>
        {FREE_FEATURES.map(f => <FeatureRow key={f} text={f} />)}
        <button className="btn-secondary" style={{ width: '100%', marginTop: '16px' }} disabled>
          Current Plan
        </button>
      </div>

      {/* Pro tier */}
      <div className="card" style={{ marginBottom: '16px', border: '2px solid #2563eb', position: 'relative', overflow: 'visible' }}>
        <div style={{
          position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
          background: '#2563eb', color: 'white', padding: '4px 16px', borderRadius: '999px',
          fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap',
        }}>
          ⭐ MOST POPULAR
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', marginTop: '8px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} color="#2563eb" /> Pro
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>For owner-operators & independent drivers</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#2563eb' }}>${proPrice.toFixed(2)}</p>
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>/ month</p>
            {billing === 'annual' && (
              <p style={{ fontSize: '11px', color: '#22c55e', fontWeight: '600' }}>$119.99/year — save 33%</p>
            )}
          </div>
        </div>
        {PRO_FEATURES.map(f => <FeatureRow key={f} text={f} />)}
        <button className="btn-primary" style={{ width: '100%', marginTop: '16px', fontSize: '16px', padding: '14px' }}>
          Upgrade to Pro
        </button>
      </div>

      {/* Fleet tier CTA */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Shield size={22} color="white" />
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Fleet Plan</h2>
        </div>
        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '14px' }}>
          For fleet companies. Includes Pro access for every enrolled driver + the full fleet management dashboard.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>Starting at $25/driver/month</p>
          {FLEET_FEATURES.slice(0, 5).map(f => (
            <div key={f} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <CheckCircle2 size={14} color="#86efac" style={{ flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '13px', opacity: 0.9 }}>{f}</span>
            </div>
          ))}
          <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '6px' }}>+ {FLEET_FEATURES.length - 5} more features</p>
        </div>
        <button style={{
          width: '100%', padding: '13px', borderRadius: '8px',
          background: 'white', color: '#1e3a8a', border: 'none',
          fontWeight: '700', fontSize: '15px', cursor: 'pointer',
        }}>
          Contact Sales for Fleet Pricing
        </button>
      </div>

      {/* Social proof */}
      <div style={{ textAlign: 'center', padding: '20px 0', color: '#9ca3af', fontSize: '13px' }}>
        <Star size={14} style={{ display: 'inline', marginRight: '4px', color: '#eab308' }} />
        Trusted by 12,000+ CDL drivers · Cancel anytime · No contracts
      </div>
    </div>
  )
}

export default Pricing
