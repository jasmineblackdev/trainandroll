import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, TrendingUp, Bell, FileText, BarChart2, Plug, CheckCircle2, ArrowRight } from 'lucide-react'

const ForFleets = () => (
  <main>
    <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', padding: '80px 0' }}>
      <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '600', marginBottom: '24px' }}>
          <Shield size={14} /> Fleet Management Platform
        </div>
        <h1 style={{ color: 'white', marginBottom: '20px' }}>Stop Losing Drivers to DOT Failures</h1>
        <p style={{ fontSize: '19px', opacity: 0.85, marginBottom: '36px', lineHeight: '1.6' }}>
          DriveWell Fleet gives you real-time visibility into every driver's DOT readiness — 90 days before it becomes a problem.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/pricing" className="btn-primary">Start 14-Day Free Trial</Link>
          <a href="https://fleet.drivewell.app" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
            See the Dashboard →
          </a>
        </div>
      </div>
    </section>

    {/* ROI Strip */}
    <section style={{ background: '#eff6ff', padding: '40px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px', textAlign: 'center' }}>
          {[
            ['$2,500+', 'Average cost of a DOT failure'],
            ['40%',     'Reduction in DOT failures with DriveWell'],
            ['5–15%',   'Potential insurance premium reduction'],
            ['$10',     'Per driver per month on Growth plan'],
          ].map(([v, l]) => (
            <div key={l}>
              <p style={{ fontSize: '32px', fontWeight: '800', color: '#2563eb' }}>{v}</p>
              <p style={{ fontSize: '14px', color: '#6b7280', maxWidth: '160px', margin: '4px auto 0' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="section">
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '48px' }}>Everything Your Safety Manager Needs</h2>
        <div className="grid-3">
          {[
            { icon: Shield,    color: '#2563eb', title: 'DOT Readiness Dashboard', desc: 'Color-coded fleet health at a glance. Green, yellow, red — know who needs attention before your examiner does.' },
            { icon: Bell,      color: '#f59e0b', title: '90-Day Renewal Alerts',   desc: 'Automated countdown alerts at 90, 60, 30, 14, and 7 days before each driver\'s DOT physical expires.' },
            { icon: TrendingUp,color: '#22c55e', title: 'Wellness Trend Analytics',desc: 'Fleet-wide BP, glucose, and BMI trends over time. See if your fleet is getting healthier or heading for trouble.' },
            { icon: FileText,  color: '#7c3aed', title: 'Insurance Compliance Report', desc: 'One-click PDF your insurance broker can use to document your fleet\'s active wellness program. May reduce premiums 5–15%.' },
            { icon: BarChart2, color: '#ea580c', title: 'Engagement Analytics',    desc: 'See who\'s using the app, who isn\'t, and which drivers need a wellness nudge before their next physical.' },
            { icon: Plug,      color: '#0891b2', title: 'ELD Integrations',        desc: 'Import your driver roster from Samsara or Motive in minutes. No manual data entry.' },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Icon size={24} color={color} />
              </div>
              <h3 style={{ marginBottom: '8px' }}>{title}</h3>
              <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Insurance section */}
    <section className="section" style={{ background: '#f9fafb' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '12px' }}>The Insurance Angle</h2>
        <p className="text-muted" style={{ textAlign: 'center', fontSize: '17px', marginBottom: '40px' }}>
          Commercial auto insurance for trucking fleets is expensive. DriveWell gives you documented evidence of a proactive wellness program.
        </p>
        <div className="grid-2">
          {[
            { title: 'Generate a Compliance Report', body: 'One-click PDF showing your fleet\'s DOT readiness rate, health metrics, workout engagement, and renewal compliance. Hand it to your broker at renewal time.' },
            { title: 'Quantify Your Wellness Investment', body: 'Show insurers the dollars invested in driver health. Progressive, Sentry, and Canal Insurance all have fleet wellness discount programs.' },
            { title: 'Reduce Claims, Not Just Premiums', body: 'Fatigued, hypertensive, and obese drivers are statistically more likely to have at-fault crashes. Healthier drivers = fewer claims = lower loss ratio = lower rates.' },
            { title: 'Document Active Monitoring', body: 'The report includes check-in streaks, workout completion rates, and BP trend data — evidence that your fleet is being proactively monitored, not just passively tracked.' },
          ].map(({ title, body }) => (
            <div key={title} className="card">
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>{title}</h3>
                  <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6' }}>{body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section">
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '14px' }}>Ready to see your fleet's DOT health?</h2>
        <p className="text-muted" style={{ fontSize: '17px', marginBottom: '32px' }}>14-day free trial. No credit card. Setup takes 10 minutes.</p>
        <a href="https://fleet.drivewell.app" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '17px', padding: '16px 36px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          Launch Fleet Dashboard <ArrowRight size={16} />
        </a>
      </div>
    </section>
  </main>
)

export default ForFleets
