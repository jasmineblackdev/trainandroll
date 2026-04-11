import React, { useState } from 'react'
import { Mail, Phone, MessageSquare, Building2, CheckCircle2 } from 'lucide-react'

const Contact = () => {
  const [form, setForm] = useState({
    name: '', email: '', company: '', fleetSize: '', message: '', type: 'demo',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate submission
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb)', color: 'white', padding: '64px 0 48px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '14px' }}>Get in Touch</h1>
          <p style={{ fontSize: '18px', opacity: 0.85, maxWidth: '500px', margin: '0 auto' }}>
            Request a fleet demo, ask a question, or just say hello. We typically respond within one business day.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '64px 24px' }}>
        <div className="contact-layout">
          {/* Contact options */}
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>Other Ways to Reach Us</h2>

            {[
              { icon: Mail,         label: 'Email',         value: 'hello@drivewell.app',    sub: 'General inquiries'   },
              { icon: Mail,         label: 'Sales',         value: 'sales@drivewell.app',    sub: 'Fleet & enterprise'  },
              { icon: Phone,        label: 'Phone',         value: '(512) 555-0198',         sub: 'Mon–Fri 8am–6pm CT'  },
              { icon: MessageSquare,label: 'Live Chat',      value: 'Available in-app',       sub: 'Fastest response'    },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} style={{ display: 'flex', gap: '14px', marginBottom: '20px', padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="#2563eb" />
                </div>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{label}</p>
                  <p style={{ fontSize: '14px', color: '#374151' }}>{value}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>{sub}</p>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '28px', padding: '20px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Building2 size={18} color="#2563eb" />
                <p style={{ fontWeight: '700', fontSize: '14px', color: '#1e40af' }}>Fleet Demo</p>
              </div>
              <p style={{ fontSize: '13px', color: '#3b82f6', lineHeight: '1.5' }}>
                See the full Risk Intelligence dashboard with your fleet's data. 30-minute live demo,
                no obligation. Average setup takes under 10 minutes.
              </p>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <CheckCircle2 size={56} color="#16a34a" style={{ margin: '0 auto 16px' }} />
                <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '10px' }}>Message Sent!</h2>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  Thanks, <strong>{form.name.split(' ')[0]}</strong>! We'll be in touch at <strong>{form.email}</strong> within one business day.
                  {form.type === 'demo' && " We'll send you a calendar link to schedule your fleet demo."}
                </p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>Send Us a Message</h2>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>All fields required</p>

                {/* Type toggle */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  {[
                    { v: 'demo',    l: 'Request a Demo'  },
                    { v: 'sales',   l: 'Talk to Sales'    },
                    { v: 'support', l: 'Get Support'      },
                  ].map(t => (
                    <button
                      key={t.v}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, type: t.v }))}
                      style={{
                        flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: '1.5px solid',
                        background:  form.type === t.v ? '#2563eb' : 'white',
                        color:       form.type === t.v ? 'white' : '#374151',
                        borderColor: form.type === t.v ? '#2563eb' : '#e5e7eb',
                      }}
                    >
                      {t.l}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-row-2">
                    <div>
                      <label style={lbl}>Full Name</label>
                      <input type="text" value={form.name} onChange={set('name')} placeholder="Jane Smith" required style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Work Email</label>
                      <input type="email" value={form.email} onChange={set('email')} placeholder="jane@fleetco.com" required style={inp} />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div>
                      <label style={lbl}>Company</label>
                      <input type="text" value={form.company} onChange={set('company')} placeholder="FleetCo Logistics" required style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Fleet Size</label>
                      <select value={form.fleetSize} onChange={set('fleetSize')} required style={inp}>
                        <option value="">Select...</option>
                        <option value="1-10">1–10 drivers</option>
                        <option value="11-25">11–25 drivers</option>
                        <option value="26-100">26–100 drivers</option>
                        <option value="101-250">101–250 drivers</option>
                        <option value="250+">250+ drivers</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={lbl}>Message</label>
                    <textarea
                      value={form.message}
                      onChange={set('message')}
                      placeholder={form.type === 'demo'
                        ? "Tell us about your fleet and what you're hoping to achieve with DriveWell..."
                        : "How can we help?"}
                      required
                      rows={4}
                      style={{ ...inp, resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', padding: '13px', background: '#2563eb', color: 'white',
                      border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? 'Sending…' : form.type === 'demo' ? 'Request Demo' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#374151' }
const inp = { width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: 'white' }

export default Contact
