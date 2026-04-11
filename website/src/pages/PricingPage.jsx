import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Zap, Shield, Users, PhoneCall } from 'lucide-react'

const DRIVER_TIERS = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    desc: 'Get started at no cost',
    color: '#6b7280',
    features: ['DOT Readiness Score', 'Daily Check-In', '5 Workout routines', 'DOT physical countdown', 'Find nearby DOT providers'],
    cta: 'Download Free',
    ctaLink: '/drivers',
    highlight: false,
  },
  {
    name: 'Driver Pro',
    price: { monthly: 14.99, annual: 9.99 },
    annualTotal: 119.99,
    desc: 'For owner-operators & independent drivers',
    color: '#2563eb',
    badge: 'Most Popular',
    features: ['Everything in Free', '50+ workout routines + videos', 'Nutrition & meal tracking', 'Sleep apnea screening', 'Wearable sync', 'Telehealth booking', 'Personal trainer marketplace', 'Achievements & streaks', 'Downloadable DOT reports'],
    cta: 'Start Free 14-Day Trial',
    ctaLink: '/drivers',
    highlight: true,
  },
]

const FLEET_TIERS = [
  { name: 'Starter',      price: { monthly: 25, annual: 20 }, range: 'Up to 25 drivers',   color: '#6b7280', features: ['Fleet dashboard', 'DOT roster & renewal alerts', 'Driver wellness metrics', 'Pro app for all drivers', 'Email support'] },
  { name: 'Growth',       price: { monthly: 20, annual: 16 }, range: '26–100 drivers',      color: '#2563eb', features: ['Everything in Starter', 'Wellness trends & analytics', 'Activity feed', 'Insurance compliance report', 'CSV & PDF exports', 'Chat support'], badge: 'Most Popular' },
  { name: 'Professional', price: { monthly: 17, annual: 14 }, range: '101–250 drivers',     color: '#7c3aed', features: ['Everything in Growth', 'ELD integrations (Samsara, Motive)', 'API access', 'Custom alert thresholds', 'Dedicated account manager'] },
]

const FeatureRow = ({ text }) => (
  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
    <CheckCircle2 size={15} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
    <span style={{ fontSize: '14px', color: '#374151' }}>{text}</span>
  </div>
)

const PricingPage = () => {
  const [billing, setBilling]   = useState('annual')
  const [audience, setAudience] = useState('drivers')

  return (
    <main>
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: 'white', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'white', marginBottom: '14px' }}>Simple, Transparent Pricing</h1>
          <p style={{ fontSize: '18px', opacity: 0.85, marginBottom: '32px' }}>Start free. Upgrade when you're ready.</p>

          {/* Audience toggle */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '4px', gap: '4px', marginBottom: '32px' }}>
            {[['drivers', 'Driver Plans'], ['fleets', 'Fleet Plans']].map(([id, label]) => (
              <button key={id} onClick={() => setAudience(id)} style={{
                padding: '10px 28px', border: 'none', borderRadius: '9px', cursor: 'pointer', fontSize: '15px', fontWeight: '600',
                background: audience === id ? 'white' : 'transparent',
                color: audience === id ? '#1e3a8a' : 'rgba(255,255,255,0.8)',
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Billing toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
            {['monthly', 'annual'].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: '8px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                background: billing === b ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
              }}>
                {b === 'annual' ? 'Annual — Save up to 34%' : 'Monthly'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {audience === 'drivers' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '700px', margin: '0 auto' }}>
                {DRIVER_TIERS.map(tier => (
                  <div key={tier.name} className="card" style={{ border: tier.highlight ? '2px solid #2563eb' : '1.5px solid #e5e7eb', position: 'relative', overflow: 'visible' }}>
                    {tier.badge && (
                      <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: 'white', padding: '4px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                        {tier.badge}
                      </div>
                    )}
                    <div style={{ marginTop: tier.badge ? '8px' : 0, marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        {tier.highlight && <Zap size={18} color={tier.color} />}
                        <h2 style={{ fontSize: '22px', color: tier.color }}>{tier.name}</h2>
                      </div>
                      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>{tier.desc}</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '36px', fontWeight: '800' }}>${tier.price[billing] === 0 ? '0' : tier.price[billing].toFixed(2)}</span>
                        <span style={{ color: '#9ca3af', fontSize: '14px' }}>{tier.price[billing] === 0 ? '' : '/month'}</span>
                      </div>
                      {billing === 'annual' && tier.price.annual > 0 && (
                        <p style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600' }}>${tier.annualTotal || (tier.price.annual * 12).toFixed(2)}/year — save {Math.round((1 - tier.price.annual / tier.price.monthly) * 100)}%</p>
                      )}
                    </div>
                    <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', marginBottom: '20px' }}>
                      {tier.features.map(f => <FeatureRow key={f} text={f} />)}
                    </div>
                    <Link to={tier.ctaLink} className={tier.highlight ? 'btn-primary' : 'btn-secondary'} style={{ display: 'block', textAlign: 'center', width: '100%' }}>
                      {tier.cta}
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {FLEET_TIERS.map(tier => (
                  <div key={tier.name} className="card" style={{ border: tier.badge ? `2px solid ${tier.color}` : '1.5px solid #e5e7eb', position: 'relative', overflow: 'visible' }}>
                    {tier.badge && (
                      <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: tier.color, color: 'white', padding: '4px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: '700' }}>
                        {tier.badge}
                      </div>
                    )}
                    <div style={{ marginTop: tier.badge ? '8px' : 0, marginBottom: '16px' }}>
                      <h2 style={{ fontSize: '20px', color: tier.color, marginBottom: '2px' }}>{tier.name}</h2>
                      <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '10px' }}>{tier.range}</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '30px', fontWeight: '800' }}>${tier.price[billing]}</span>
                        <span style={{ color: '#9ca3af', fontSize: '13px' }}>/driver/mo</span>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '14px', marginBottom: '16px' }}>
                      {tier.features.map(f => <FeatureRow key={f} text={f} />)}
                    </div>
                    <Link to="/fleets" className={tier.badge ? 'btn-primary' : 'btn-secondary'} style={{ display: 'block', textAlign: 'center' }}>
                      Get Started
                    </Link>
                  </div>
                ))}
              </div>

              {/* Enterprise */}
              <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <Shield size={32} color="#93c5fd" />
                    <div>
                      <h3 style={{ color: 'white', marginBottom: '4px' }}>Enterprise — 200+ Drivers</h3>
                      <p style={{ color: '#94a3b8', fontSize: '14px' }}>Custom pricing · White-label · SSO · Dedicated support</p>
                    </div>
                  </div>
                  <Link to="/fleets" className="btn-primary">
                    <PhoneCall size={16} /> Contact Sales
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: '#f9fafb' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Common Questions</h2>
          {[
            { q: 'Do enrolled drivers get the Pro app included?', a: 'Yes. Every driver enrolled under a fleet plan gets full Pro access at no extra charge. No double-billing.' },
            { q: 'Can I cancel anytime?', a: 'Monthly plans cancel at the end of the billing period. Annual plans are non-refundable after 14 days but can be cancelled to prevent renewal.' },
            { q: 'Is driver health data private?', a: 'Drivers own their own health data. Fleet managers see aggregated, non-identifiable wellness metrics and DOT compliance status only — not individual vitals unless a driver explicitly shares them.' },
            { q: 'What ELD platforms do you integrate with?', a: 'Currently Samsara and Motive (KeepTruckin). McLeod, Trimble, and Omnitracs are on the roadmap.' },
            { q: 'Do you offer a free trial for fleets?', a: 'Yes — 14-day free trial for all fleet plans. No credit card required.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{item.q}</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default PricingPage
