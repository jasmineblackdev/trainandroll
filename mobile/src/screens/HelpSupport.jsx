import React, { useState } from 'react'
import { HelpCircle, MessageSquare, ChevronDown, ChevronUp, Mail, Phone, FileText } from 'lucide-react'

const FAQ = [
  {
    q: 'What is the DOT Readiness Score?',
    a: 'Your DOT Readiness Score (0–100) reflects how your current health metrics compare to FMCSA medical certification thresholds. It\'s based on blood pressure (30 pts), BMI (20 pts), heart rate (15 pts), blood glucose (20 pts), and your daily check-in streak (15 pts).',
  },
  {
    q: 'Is my health data shared with my employer?',
    a: 'No. Individual health values are never shared with fleet administrators. Admins can only see whether you\'ve checked in (yes/no) and your DOT cert expiration date. Your blood pressure, weight, and other readings are private.',
  },
  {
    q: 'How do I log my blood pressure?',
    a: 'Go to Health History from the sidebar menu. Select "Blood Pressure," then tap "+ Log Blood Pressure." Enter your systolic (top number) and diastolic (bottom number). Your readings are stored locally and used to update your DOT score.',
  },
  {
    q: 'What is a DOT Physical and how often do I need one?',
    a: 'The DOT Physical (FMCSA Medical Examination) is required for CDL drivers. It\'s typically valid for 2 years, but can be shorter if you have certain health conditions. Use DOT Reminders to track your expiration date.',
  },
  {
    q: 'What is a check-in streak?',
    a: 'Your streak counts consecutive days you\'ve completed a daily check-in. A 7+ day streak earns you 15 points on your DOT Readiness Score. Missing a day resets the streak.',
  },
  {
    q: 'Can I use DriveWell without a fleet account?',
    a: 'Yes! DriveWell works as a standalone driver wellness app. Fleet features are optional — you can track your own health, workouts, and DOT deadlines independently.',
  },
  {
    q: 'How do I upgrade to Driver Pro?',
    a: 'Go to Settings > Upgrade to Pro, or tap the Pricing option in the sidebar. Driver Pro is $14.99/month or $119.99/year (save 33%). Pro unlocks unlimited workout videos, advanced trends, and priority support.',
  },
  {
    q: 'What workouts are available for truck drivers?',
    a: 'DriveWell includes workouts designed specifically for drivers — exercises you can do in your cab, at a truck stop, or in a gym. Filter by location type and duration to find what fits your schedule.',
  },
]

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #f3f4f6' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontWeight: '500', fontSize: '15px', color: '#111827', paddingRight: '16px' }}>{q}</span>
        {open ? <ChevronUp size={18} color="#6b7280" style={{ flexShrink: 0 }} /> : <ChevronDown size={18} color="#6b7280" style={{ flexShrink: 0 }} />}
      </button>
      {open && <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.7', paddingBottom: '16px' }}>{a}</p>}
    </div>
  )
}

const HelpSupport = () => {
  const [search, setSearch] = useState('')
  const [contactForm, setContactForm] = useState({ subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const filtered = FAQ.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  )

  const submitContact = (e) => {
    e.preventDefault()
    setSent(true)
    setContactForm({ subject: '', message: '' })
  }

  return (
    <div className="screen">
      <header style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <HelpCircle size={28} color="#2563eb" />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Help & Support</h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Get answers fast</p>
      </header>

      {/* Quick contact links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '28px' }}>
        {[
          { icon: <Mail size={20} color="#2563eb" />,    label: 'Email',  note: 'support@drivewell.app' },
          { icon: <Phone size={20} color="#059669" />,   label: 'Phone',  note: 'M–F 8am–6pm CT' },
          { icon: <FileText size={20} color="#8b5cf6" />,label: 'Docs',   note: 'Knowledge base' },
        ].map(c => (
          <div key={c.label} style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px 10px', textAlign: 'center' }}>
            <div style={{ marginBottom: '6px' }}>{c.icon}</div>
            <p style={{ fontWeight: '700', fontSize: '13px' }}>{c.label}</p>
            <p style={{ fontSize: '11px', color: '#6b7280' }}>{c.note}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <HelpCircle size={20} color="#2563eb" />
          <h2 style={{ fontWeight: '700', fontSize: '18px' }}>Frequently Asked Questions</h2>
        </div>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search FAQ…"
          style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', marginBottom: '16px' }}
        />

        {filtered.length === 0 && (
          <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', padding: '24px' }}>No matching questions found.</p>
        )}
        {filtered.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
      </div>

      {/* Contact form */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <MessageSquare size={20} color="#2563eb" />
          <h2 style={{ fontWeight: '700', fontSize: '18px' }}>Contact Support</h2>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#059669' }}>
            <p style={{ fontSize: '24px', marginBottom: '8px' }}>✓</p>
            <p style={{ fontWeight: '600' }}>Message sent!</p>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>We'll respond within 1 business day.</p>
            <button onClick={() => setSent(false)} style={{ marginTop: '16px', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Send another</button>
          </div>
        ) : (
          <form onSubmit={submitContact}>
            <label style={lbl}>Subject</label>
            <select style={inp} value={contactForm.subject} onChange={e => setContactForm(f => ({ ...f, subject: e.target.value }))} required>
              <option value="">Select a topic…</option>
              <option>DOT Score question</option>
              <option>Account issue</option>
              <option>Billing / subscription</option>
              <option>Feature request</option>
              <option>Bug report</option>
              <option>Other</option>
            </select>
            <label style={lbl}>Message</label>
            <textarea
              style={{ ...inp, minHeight: '120px', resize: 'vertical' }}
              value={contactForm.message}
              onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Describe your issue or question…"
              required
            />
            <button type="submit" style={{ marginTop: '16px', width: '100%', padding: '13px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginTop: '12px', marginBottom: '4px' }
const inp = { width: '100%', padding: '10px 12px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }

export default HelpSupport
