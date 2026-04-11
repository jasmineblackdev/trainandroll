import React from 'react'
import { Link } from 'react-router-dom'
import { Users, DollarSign, Video, MapPin, Star, CheckCircle2, ArrowRight } from 'lucide-react'

const ForTrainers = () => (
  <main>
    <section style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', color: 'white', padding: '80px 0' }}>
      <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '600', marginBottom: '24px' }}>
          💪 For Personal Trainers
        </div>
        <h1 style={{ color: 'white', marginBottom: '20px' }}>50,000+ Drivers Need a Coach. Reach Them Here.</h1>
        <p style={{ fontSize: '19px', opacity: 0.9, marginBottom: '36px', lineHeight: '1.6' }}>
          DriveWell is the only fitness platform purpose-built for CDL drivers. List your services, get matched with motivated clients, and grow your online coaching business.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#apply" className="btn-white" style={{ fontSize: '16px' }}>Apply as a Trainer</a>
          <a href="#how" className="btn-secondary" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>
            How It Works →
          </a>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section style={{ background: '#fff7ed', padding: '40px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px', textAlign: 'center' }}>
          {[
            ['50,000+', 'Active CDL drivers on DriveWell'],
            ['$55–$75', 'Average trainer hourly rate on platform'],
            ['200+',    'Certified trainers already listed'],
            ['4.8★',    'Average trainer rating'],
          ].map(([v, l]) => (
            <div key={l}>
              <p style={{ fontSize: '30px', fontWeight: '800', color: '#ea580c' }}>{v}</p>
              <p style={{ fontSize: '14px', color: '#9a3412', maxWidth: '160px', margin: '4px auto 0' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="section" id="how">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '48px' }}>How It Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { step: '1', title: 'Apply & Get Verified', desc: 'Submit your certifications (NASM, ACE, ISSA, or equivalent). We verify credentials and approve your listing within 48 hours.' },
            { step: '2', title: 'Build Your Profile',   desc: 'Set your specialties (DOT prep, weight loss, back pain, etc.), rate, availability, and whether you offer in-person or online coaching.' },
            { step: '3', title: 'Get Matched',          desc: 'Drivers searching for coaches in your specialty or geographic area find your profile. You receive a session request and confirm availability.' },
            { step: '4', title: 'Coach & Earn',         desc: 'Deliver sessions via video call or in-person. DriveWell handles scheduling, payment processing, and reviews. You keep 80% of each session fee.' },
          ].map(({ step, title, desc }, i, arr) => (
            <div key={step} style={{ display: 'flex', gap: '20px', paddingBottom: i < arr.length - 1 ? '32px' : 0, position: 'relative' }}>
              {i < arr.length - 1 && (
                <div style={{ position: 'absolute', left: '19px', top: '44px', width: '2px', height: 'calc(100% - 20px)', background: '#fed7aa' }} />
              )}
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ea580c', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', flexShrink: 0, zIndex: 1 }}>
                {step}
              </div>
              <div style={{ paddingTop: '6px' }}>
                <h3 style={{ marginBottom: '6px' }}>{title}</h3>
                <p className="text-muted" style={{ fontSize: '15px', lineHeight: '1.6' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="section" style={{ background: '#f9fafb' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '48px' }}>Why Train Truckers?</h2>
        <div className="grid-2">
          {[
            { icon: Users,       color: '#2563eb', title: 'Underserved, Motivated Clients', desc: 'Most fitness apps ignore truck drivers. These clients are highly motivated — their CDL license (and income) depends on their health. Retention is excellent.' },
            { icon: DollarSign,  color: '#22c55e', title: 'Steady, Recurring Revenue',      desc: 'DOT physicals happen every 1–2 years. Drivers who work with a trainer routinely renew their coaching to maintain readiness. Low churn.' },
            { icon: Video,       color: '#7c3aed', title: 'Fully Remote-Friendly',           desc: 'Drivers travel constantly. Online coaching fits their lifestyle perfectly. No gym dependency — you can coach from anywhere, clients from anywhere.' },
            { icon: MapPin,      color: '#ea580c', title: 'Local Truck Stop Sessions',       desc: 'If you\'re near a major truck stop or travel plaza, you can offer in-person sessions. Many truckers stop at the same locations regularly on their routes.' },
            { icon: Star,        color: '#d97706', title: 'Niche = Premium Rates',          desc: 'CDL-specialized trainers charge $55–$75/hour vs. $40–$50 for general trainers. Your expertise in DOT requirements commands a premium.' },
            { icon: CheckCircle2,color: '#059669', title: 'Built-In Marketing',             desc: 'Your DriveWell profile is seen by every driver who opens the trainer marketplace. No need to spend on Facebook ads or cold outreach.' },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="card" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>{title}</h3>
                <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Pricing */}
    <section className="section" id="apply">
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '14px' }}>Trainer Listing — $49/month</h2>
        <p className="text-muted" style={{ fontSize: '17px', marginBottom: '32px' }}>
          One flat rate to be listed, manage clients, and deliver programs through the app. No commission on sessions — you keep 80%.
        </p>
        <div className="card" style={{ textAlign: 'left', marginBottom: '24px' }}>
          {[
            'Public trainer profile visible to all DriveWell drivers',
            'Client management dashboard',
            'In-app session scheduling & video calls',
            'Secure payment processing (Stripe)',
            'Verified certification badge on profile',
            'Client progress tracking access',
            'DriveWell marketing & promotion',
          ].map(f => (
            <div key={f} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '15px', color: '#374151' }}>{f}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '17px', padding: '16px' }}>
          Apply as a Trainer — $49/mo <ArrowRight size={16} />
        </button>
        <p className="text-muted" style={{ marginTop: '12px', fontSize: '13px' }}>First 30 days free while we review your application.</p>
      </div>
    </section>
  </main>
)

export default ForTrainers
