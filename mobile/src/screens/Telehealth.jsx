import React, { useState } from 'react'
import { HeartPulse, X, CheckCircle2, Calendar } from 'lucide-react'

const PROVIDERS = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    specialty: 'DOT-Certified Medical Examiner',
    availability: 'Next available: Today',
    rating: 4.9,
    bio: 'Specializes in commercial driver physicals with 15+ years experience.',
  },
  {
    id: 2,
    name: 'Dr. James Okafor',
    specialty: 'Occupational Medicine, DOT Certified',
    availability: 'Next available: Tomorrow',
    rating: 4.8,
    bio: 'Board-certified occupational physician, DOT medical examiner since 2008.',
  },
  {
    id: 3,
    name: 'Dr. Lisa Hernandez',
    specialty: 'Family Medicine, DOT Physical Exams',
    availability: 'Next available: Thu',
    rating: 4.7,
    bio: 'Friendly family physician offering same-day DOT results for CDL drivers.',
  },
]

const TIME_SLOTS = ['9:00 AM', '11:30 AM', '2:00 PM']

const Telehealth = () => {
  const [bookingProvider, setBookingProvider] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = () => {
    setConfirmed(true)
    setTimeout(() => {
      setBookingProvider(null)
      setSelectedSlot(null)
      setConfirmed(false)
    }, 2000)
  }

  return (
    <div className="screen">
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Find a DOT Provider</h1>
        <p style={{ color: '#6b7280' }}>Book with a DOT-certified medical examiner</p>
      </header>

      {PROVIDERS.map(provider => (
        <div key={provider.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '2px' }}>{provider.name}</h3>
              <p style={{ fontSize: '13px', color: '#2563eb', fontWeight: '500', marginBottom: '4px' }}>{provider.specialty}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
              <span style={{ fontSize: '13px', color: '#eab308', fontWeight: '700' }}>★ {provider.rating}</span>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px' }}>{provider.bio}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <Calendar size={14} style={{ color: '#22c55e' }} />
            <span style={{ fontSize: '13px', color: '#15803d', fontWeight: '500' }}>{provider.availability}</span>
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', fontSize: '14px', padding: '10px' }}
            onClick={() => { setBookingProvider(provider); setSelectedSlot(null) }}
          >
            Book Appointment
          </button>
        </div>
      ))}

      {/* Modal */}
      {bookingProvider && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '24px',
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '28px',
            width: '100%', maxWidth: '400px',
          }}>
            {confirmed ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={48} color="#22c55e" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Confirmed!</h3>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Your appointment with {bookingProvider.name} at {selectedSlot} is confirmed.
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Book Appointment</h3>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>{bookingProvider.name}</p>
                  </div>
                  <button
                    onClick={() => setBookingProvider(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '12px' }}>Select a time slot</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: `1.5px solid ${selectedSlot === slot ? '#2563eb' : '#e5e7eb'}`,
                        background: selectedSlot === slot ? '#eff6ff' : 'white',
                        color: selectedSlot === slot ? '#2563eb' : '#374151',
                        fontWeight: selectedSlot === slot ? '600' : '400',
                        fontSize: '15px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <button
                  className="btn-primary"
                  style={{ width: '100%' }}
                  disabled={!selectedSlot}
                  onClick={handleConfirm}
                >
                  Confirm Appointment
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Telehealth
