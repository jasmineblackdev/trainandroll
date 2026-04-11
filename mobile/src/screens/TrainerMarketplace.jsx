import React, { useState } from 'react'
import { Star, MapPin, Video, CheckCircle2, X, Users } from 'lucide-react'

const TRAINERS = [
  {
    id: 1,
    name: 'Marcus Webb',
    title: 'CDL Wellness Specialist',
    location: 'Dallas, TX',
    remote: true,
    inPerson: true,
    rating: 4.9,
    reviews: 84,
    rate: 65,
    specialty: ['DOT Prep', 'Weight Loss', 'In-Cab Workouts'],
    bio: 'Former long-haul driver turned certified personal trainer. I know what it\'s like on the road — I design programs that actually work in a truck cab or parking lot.',
    clients: 38,
    certifications: ['NASM-CPT', 'DOT Physical Prep Certified'],
    availability: 'Next available: Today',
    image: 'MW',
    color: '#2563eb',
  },
  {
    id: 2,
    name: 'Tanya Ross',
    title: 'Occupational Fitness Coach',
    location: 'Atlanta, GA',
    remote: true,
    inPerson: false,
    rating: 4.8,
    reviews: 61,
    rate: 55,
    specialty: ['Blood Pressure', 'Stress & Recovery', 'Diabetes Prevention'],
    bio: 'I specialize in helping drivers with high BP and pre-diabetes reverse their numbers before their DOT physical. Online coaching with weekly check-ins.',
    clients: 52,
    certifications: ['ACE-CPT', 'Precision Nutrition Level 1'],
    availability: 'Next available: Tomorrow',
    image: 'TR',
    color: '#7c3aed',
  },
  {
    id: 3,
    name: 'Derek "Big D" Johnson',
    title: 'Strength & Mobility Trainer',
    location: 'Nashville, TN',
    remote: true,
    inPerson: true,
    rating: 4.7,
    reviews: 47,
    rate: 50,
    specialty: ['Back Pain', 'Mobility', 'Strength Training'],
    bio: 'Back pain is the #1 complaint I hear from drivers. My programs focus on core strength and hip mobility to eliminate the pain caused by long hours behind the wheel.',
    clients: 29,
    certifications: ['ISSA-CPT', 'Corrective Exercise Specialist'],
    availability: 'Next available: Thu',
    image: 'DJ',
    color: '#059669',
  },
  {
    id: 4,
    name: 'Carmen Reyes',
    title: 'Nutrition & Weight Loss Coach',
    location: 'Houston, TX',
    remote: true,
    inPerson: true,
    rating: 4.9,
    reviews: 112,
    rate: 70,
    specialty: ['Nutrition Planning', 'Weight Loss', 'DOT BMI Goals'],
    bio: 'I help drivers lose weight for their DOT physical and keep it off. Custom meal plans built around real truck stop food. No meal prep required.',
    clients: 71,
    certifications: ['Registered Dietitian', 'NASM Weight Loss Specialist'],
    availability: 'Next available: Wed',
    image: 'CR',
    color: '#dc2626',
  },
]

const Avatar = ({ initials, color, size = 48 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: color, display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: 'white',
    fontWeight: '700', fontSize: size / 2.8, flexShrink: 0,
  }}>
    {initials}
  </div>
)

const TrainerMarketplace = () => {
  const [filter, setFilter]       = useState('all')   // 'all' | 'remote' | 'local'
  const [selected, setSelected]   = useState(null)
  const [booked, setBooked]       = useState(null)

  const filtered = TRAINERS.filter(t => {
    if (filter === 'remote') return t.remote
    if (filter === 'local')  return t.inPerson
    return true
  })

  const handleBook = (trainer) => {
    setBooked(trainer.id)
    setTimeout(() => {
      setSelected(null)
      setBooked(null)
    }, 2000)
  }

  const FilterBtn = ({ id, label }) => (
    <button
      onClick={() => setFilter(id)}
      style={{
        flex: 1, padding: '9px', border: 'none', cursor: 'pointer', borderRadius: '8px',
        background: filter === id ? '#2563eb' : '#f3f4f6',
        color: filter === id ? 'white' : '#374151',
        fontWeight: filter === id ? '700' : '400',
        fontSize: '13px',
      }}
    >
      {label}
    </button>
  )

  return (
    <div className="screen">
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>Find a Trainer</h1>
        <p style={{ color: '#6b7280' }}>CDL-specialized coaches — online or near your route</p>
      </header>

      {/* Stats banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)', color: 'white', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: '24px', fontWeight: '700' }}>200+</p>
            <p style={{ fontSize: '12px', opacity: 0.85 }}>Certified Trainers</p>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.3)', borderRight: '1px solid rgba(255,255,255,0.3)', padding: '0 24px' }}>
            <p style={{ fontSize: '24px', fontWeight: '700' }}>48</p>
            <p style={{ fontSize: '12px', opacity: 0.85 }}>States Covered</p>
          </div>
          <div>
            <p style={{ fontSize: '24px', fontWeight: '700' }}>4.8★</p>
            <p style={{ fontSize: '12px', opacity: 0.85 }}>Avg Rating</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <FilterBtn id="all"    label="All Trainers" />
        <FilterBtn id="remote" label="Online Only"  />
        <FilterBtn id="local"  label="In-Person"    />
      </div>

      {/* Trainer cards */}
      {filtered.map(trainer => (
        <div key={trainer.id} className="card">
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '12px' }}>
            <Avatar initials={trainer.image} color={trainer.color} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1px' }}>{trainer.name}</h3>
                  <p style={{ fontSize: '12px', color: '#2563eb', fontWeight: '500' }}>{trainer.title}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#374151' }}>${trainer.rate}<span style={{ fontSize: '11px', fontWeight: '400', color: '#9ca3af' }}>/hr</span></p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <span style={{ fontSize: '13px', color: '#eab308', fontWeight: '700' }}>★ {trainer.rating}</span>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>({trainer.reviews} reviews)</span>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>·</span>
                <Users size={12} color="#9ca3af" />
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{trainer.clients} clients</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {trainer.inPerson && (
              <span style={{ padding: '3px 10px', background: '#dcfce7', color: '#15803d', borderRadius: '999px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={11} /> {trainer.location}
              </span>
            )}
            {trainer.remote && (
              <span style={{ padding: '3px 10px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '999px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Video size={11} /> Online
              </span>
            )}
            {trainer.specialty.map(s => (
              <span key={s} style={{ padding: '3px 10px', background: '#f3f4f6', color: '#6b7280', borderRadius: '999px', fontSize: '11px' }}>{s}</span>
            ))}
          </div>

          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.5' }}>{trainer.bio}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600' }}>{trainer.availability}</p>
            <button
              className="btn-primary"
              style={{ fontSize: '13px', padding: '9px 20px' }}
              onClick={() => setSelected(trainer)}
            >
              View & Book
            </button>
          </div>
        </div>
      ))}

      {/* Trainer detail modal */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          zIndex: 1000, padding: '0',
        }}>
          <div style={{
            background: 'white', borderRadius: '20px 20px 0 0',
            width: '100%', maxWidth: '500px', maxHeight: '85vh',
            overflowY: 'auto', padding: '28px 24px',
          }}>
            {booked === selected.id ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <CheckCircle2 size={52} color="#22c55e" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Request Sent!</h3>
                <p style={{ color: '#6b7280' }}>{selected.name} will reach out within 24 hours to schedule your first session.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <Avatar initials={selected.image} color={selected.color} size={56} />
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{selected.name}</h3>
                      <p style={{ fontSize: '13px', color: '#2563eb' }}>{selected.title}</p>
                      <p style={{ fontSize: '13px', color: '#eab308', fontWeight: '700' }}>★ {selected.rating} <span style={{ color: '#9ca3af', fontWeight: '400' }}>({selected.reviews})</span></p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                    <X size={22} />
                  </button>
                </div>

                <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', marginBottom: '16px' }}>{selected.bio}</p>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Certifications</p>
                  {selected.certifications.map(c => (
                    <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <CheckCircle2 size={14} color="#22c55e" />
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>{c}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: '#f9fafb', borderRadius: '10px', marginBottom: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: '#374151' }}>${selected.rate}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>Per session</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: '#374151' }}>{selected.clients}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>Active clients</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>✓</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>{selected.inPerson ? 'In-Person' : 'Online'}</p>
                  </div>
                </div>

                <button className="btn-primary" style={{ width: '100%', fontSize: '16px', padding: '14px' }} onClick={() => handleBook(selected)}>
                  Request a Session — ${selected.rate}/hr
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TrainerMarketplace
