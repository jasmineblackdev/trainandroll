import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2, Users, Clock, BarChart2, TrendingUp,
  Shield, ArrowRight, Star, Zap, ChevronRight, Activity,
} from 'lucide-react'

const TIMELINE = [
  {
    week: 'Week 1–2',
    title: 'Setup & Driver Enrollment',
    body: 'Your dedicated onboarding specialist handles roster import, driver invitations, and app walkthroughs. Zero burden on your team.',
    color: '#2563eb',
  },
  {
    week: 'Week 3–6',
    title: 'Baseline Establishment',
    body: 'Drivers complete onboarding health assessments. Initial readiness scores established across your pilot cohort.',
    color: '#7c3aed',
  },
  {
    week: 'Week 7–10',
    title: 'Active Monitoring & Coaching',
    body: 'Weekly fleet readiness reports land in your inbox. At-risk drivers receive in-app coaching and personalized action plans.',
    color: '#059669',
  },
  {
    week: 'Week 11–13',
    title: 'ROI Evaluation & Reporting',
    body: 'We compile a full pilot summary: score improvements, engagement rates, predicted failures averted, and estimated cost savings.',
    color: '#ea580c',
  },
]

const PilotForm = () => {
  const [form, setForm] = useState({ name: '', company: '', email: '', fleet: '', message: '' })
  const [sent, setSent] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  if (sent) return (
    <div style={{ textAlign: 'center', padding: '48px 32px' }}>
      <CheckCircle2 size={48} color="#22c55e" style={{ margin: '0 auto 16px' }} />
      <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Request Received</h3>
      <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '24px' }}>
        Our team will reach out within 1 business day to schedule your pilot consultation.
      </p>
      <Link to="/" style={{ color: '#2563eb', fontWeight: '600', fontSize: '15px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        Back to home <ChevronRight size={15} />
      </Link>
    </div>
  )

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row-2" style={{ marginBottom: '16px' }}>
        {[
          { key: 'name',    label: 'Full Name',       placeholder: 'John Smith',           type: 'text'  },
          { key: 'company', label: 'Company Name',    placeholder: 'Smith Logistics Inc.',  type: 'text'  },
          { key: 'email',   label: 'Work Email',      placeholder: 'john@company.com',      type: 'email' },
          { key: 'fleet',   label: 'Fleet Size',      placeholder: 'e.g. 85 drivers',       type: 'text'  },
        ].map(f => (
          <div key={f.key}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>{f.label}</label>
            <input
              type={f.type}
              required
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => set(f.key, e.target.value)}
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        ))}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Anything specific you'd like to address? (optional)</label>
        <textarea
          placeholder="e.g. We have a lot of drivers with BP issues coming up on physicals in Q2..."
          value={form.message}
          onChange={e => set('message', e.target.value)}
          rows={3}
          style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
        />
      </div>
      <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '16px', padding: '14px' }}>
        Schedule Pilot Consultation <ArrowRight size={16} />
      </button>
      <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginTop: '12px' }}>
        No commitment required. We'll reach out within 1 business day.
      </p>
    </form>
  )
}

const PilotProgram = () => (
  <main>

    {/* Hero */}
    <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)', color: 'white', padding: '80px 0' }}>
      <div className="container" style={{ maxWidth: '760px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '600', marginBottom: '24px' }}>
          <Zap size={13} /> 90-Day Pilot Program
        </div>
        <h1 style={{ color: 'white', marginBottom: '20px' }}>Prove the ROI Before You Commit</h1>
        <p style={{ fontSize: '19px', opacity: 0.88, marginBottom: '36px', lineHeight: '1.6' }}>
          Start with 50 drivers. 90 days. Full platform access. We provide the reporting to measure exactly what it's worth to your fleet.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#apply" className="btn-white" style={{ fontWeight: '700' }}>Apply for Pilot</a>
          <Link to="/pricing" style={{ padding: '12px 24px', borderRadius: '8px', fontWeight: '600', fontSize: '15px', background: 'transparent', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)', textDecoration: 'none' }}>
            View Full Pricing
          </Link>
        </div>
      </div>
    </section>

    {/* Pilot stats */}
    <section style={{ background: '#eff6ff', padding: '40px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px', textAlign: 'center' }}>
          {[
            ['50',   'Drivers included'],
            ['90',   'Day program'],
            ['4',    'Weekly fleet reports'],
            ['$0',   'Long-term commitment'],
          ].map(([v, l]) => (
            <div key={l}>
              <p style={{ fontSize: '36px', fontWeight: '800', color: '#2563eb' }}>{v}</p>
              <p style={{ fontSize: '14px', color: '#6b7280', maxWidth: '140px', margin: '4px auto 0' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* What's included */}
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ marginBottom: '12px' }}>Everything Included in the Pilot</h2>
          <p className="text-muted" style={{ fontSize: '17px', maxWidth: '520px', margin: '0 auto' }}>
            Full platform access — not a limited demo. Your drivers use the same product paying customers use.
          </p>
        </div>
        <div className="grid-3">
          {[
            {
              icon: Users,      color: '#2563eb', bg: '#eff6ff',
              title: 'Full Driver App Access',
              body: 'All 50 pilot drivers get full DriveWell mobile access: DOT readiness score, workouts, check-ins, exam prep checklist, and progress tracking.',
            },
            {
              icon: Activity,   color: '#7c3aed', bg: '#f5f3ff',
              title: 'Fleet Dashboard',
              body: 'Real-time readiness scores, DOT renewal countdowns, and risk stratification for your entire pilot cohort. Updated daily.',
            },
            {
              icon: BarChart2,  color: '#059669', bg: '#f0fdf4',
              title: 'Weekly Readiness Reports',
              body: 'Aggregate fleet health reports delivered every week. Includes score distributions, trend direction, and top-priority drivers to watch.',
            },
            {
              icon: TrendingUp, color: '#ea580c', bg: '#fff7ed',
              title: 'Engagement Analytics',
              body: 'App usage rates, check-in consistency, workout completion — data to understand what\'s working and where adoption needs a push.',
            },
            {
              icon: Shield,     color: '#d97706', bg: '#fffbeb',
              title: 'ROI Evaluation at Day 90',
              body: 'We build a full ROI summary: readiness improvements, predicted failures averted, hours saved on compliance, and estimated cost savings.',
            },
            {
              icon: CheckCircle2, color: '#0891b2', bg: '#f0f9ff',
              title: 'Dedicated Onboarding',
              body: 'Your fleet gets a dedicated specialist who handles roster import, driver invitations, and app walkthroughs. White-glove from day one.',
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

    {/* Timeline */}
    <section className="section" style={{ background: '#f9fafb' }}>
      <div className="container" style={{ maxWidth: '760px' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ marginBottom: '12px' }}>90-Day Pilot Timeline</h2>
          <p className="text-muted" style={{ fontSize: '17px' }}>Structured to produce measurable results, not just engagement metrics.</p>
        </div>
        {TIMELINE.map((t, idx) => (
          <div key={t.week} style={{ display: 'flex', gap: '20px', marginBottom: idx < TIMELINE.length - 1 ? '0' : '0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, width: '56px', flexShrink: 0 }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: 'white', fontWeight: '800', fontSize: '14px' }}>{idx + 1}</span>
              </div>
              {idx < TIMELINE.length - 1 && (
                <div style={{ width: '2px', flex: 1, background: '#e5e7eb', minHeight: '40px', margin: '4px 0' }} />
              )}
            </div>
            <div style={{ paddingBottom: idx < TIMELINE.length - 1 ? '28px' : '0' }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: t.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{t.week}</p>
              <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>{t.title}</h3>
              <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.65' }}>{t.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Who it's for */}
    <section className="section" style={{ background: 'white' }}>
      <div className="container" style={{ maxWidth: '760px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '12px' }}>Who the Pilot is For</h2>
        <p className="text-muted" style={{ textAlign: 'center', fontSize: '17px', marginBottom: '40px' }}>The pilot is designed for fleets that want proof before a full rollout.</p>
        <div className="grid-2">
          <div className="card" style={{ borderLeft: '3px solid #22c55e' }}>
            <p style={{ fontWeight: '700', fontSize: '15px', color: '#15803d', marginBottom: '12px' }}>Good fit if you have:</p>
            {[
              '50–500 CDL drivers',
              'Upcoming DOT physical renewals in Q2–Q3',
              'A safety director who needs a business case',
              'History of DOT failures or unexpected disqualifications',
              'Insurance renewal coming up in 6–12 months',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                <CheckCircle2 size={15} color="#22c55e" style={{ flexShrink: 0, marginTop: '1px' }} />
                {item}
              </div>
            ))}
          </div>
          <div className="card" style={{ background: '#f9fafb' }}>
            <p style={{ fontWeight: '700', fontSize: '15px', color: '#374151', marginBottom: '12px' }}>After 90 days, you'll know:</p>
            {[
              'What % of your fleet is at DOT physical risk',
              'Which drivers need immediate attention',
              'Whether app engagement is sustainable at scale',
              'Estimated failures averted and cost savings',
              'Projected insurance impact with full rollout',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb', flexShrink: 0, marginTop: '6px' }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Apply form */}
    <section id="apply" className="section" style={{ background: '#f9fafb' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ marginBottom: '12px' }}>Apply for the Pilot Program</h2>
          <p className="text-muted" style={{ fontSize: '17px' }}>
            We accept a limited number of pilot fleets each quarter. Tell us about your situation and we'll reach out within 1 business day.
          </p>
        </div>
        <div className="card">
          <PilotForm />
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="section" style={{ background: 'white' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Common Questions</h2>
        {[
          {
            q: 'Is there a cost for the pilot?',
            a: 'The pilot is billed at our Starter plan rate ($8/driver/month) for up to 50 drivers. If you proceed to a full rollout within 30 days of pilot end, we credit 100% of pilot costs.',
          },
          {
            q: 'What happens to driver data after the pilot?',
            a: 'Drivers own their health data. If you don\'t proceed to a full deployment, drivers can export their data and continue using the app independently. Fleet-level data is purged from your dashboard on request.',
          },
          {
            q: 'Do drivers have to participate?',
            a: 'Participation is voluntary for drivers. In practice, fleets see 60–80% active adoption when the pilot is positioned correctly — we help you with the driver communication playbook.',
          },
          {
            q: 'How long does setup take?',
            a: 'Most fleets complete setup in under 2 hours. We handle roster import, and driver invitations go out via email or SMS from your dedicated specialist.',
          },
          {
            q: 'Can we expand beyond 50 drivers during the pilot?',
            a: 'Yes. If you want to expand mid-pilot, we can scale up at the same per-driver rate with no setup fee.',
          },
        ].map(({ q, a }) => (
          <div key={q} style={{ borderBottom: '1px solid #f3f4f6', padding: '20px 0' }}>
            <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}>{q}</p>
            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.65' }}>{a}</p>
          </div>
        ))}
      </div>
    </section>

  </main>
)

export default PilotProgram
