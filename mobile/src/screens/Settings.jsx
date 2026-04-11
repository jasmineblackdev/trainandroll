import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Star,
  Bell,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Crown,
  Smartphone
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Settings = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isPro = user?.subscriptionTier === 'driver_pro'
  const [dotReminders, setDotReminders] = useState(() => {
    return localStorage.getItem('dw_notif_dot') !== 'false'
  })
  const [workoutReminders, setWorkoutReminders] = useState(() => {
    return localStorage.getItem('dw_notif_workout') === 'true'
  })

  const handleUpgrade = () => {
    // TODO: Implement upgrade flow
    console.log('Upgrade to premium')
  }

  const toggleDotReminders = () => {
    const next = !dotReminders
    setDotReminders(next)
    localStorage.setItem('dw_notif_dot', String(next))
  }

  const toggleWorkoutReminders = () => {
    const next = !workoutReminders
    setWorkoutReminders(next)
    localStorage.setItem('dw_notif_workout', String(next))
  }

  return (
    <div className="screen">
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          Settings
        </h1>
        <p style={{ color: '#6b7280' }}>
          Customize your DriveWell experience
        </p>
      </header>

      {/* Premium Upgrade (Free Users Only) */}
      {!isPro && (
        <div className="card" style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <Crown size={24} style={{ marginRight: '12px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Upgrade to Premium</h3>
          </div>
          <p style={{ fontSize: '14px', marginBottom: '16px', opacity: 0.9 }}>
            Unlock the full workout library, personalized DOT reminders, and advanced health tracking
          </p>
          <ul style={{ fontSize: '14px', marginBottom: '20px', paddingLeft: '16px', opacity: 0.9 }}>
            <li>Access to all 20+ workouts</li>
            <li>DOT physical reminders</li>
            <li>Personalized workout plans</li>
            <li>Priority customer support</li>
          </ul>
          <button 
            onClick={handleUpgrade}
            style={{
              background: 'white',
              color: '#2563eb',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Upgrade Now — $14.99/month
          </button>
        </div>
      )}

      {/* Premium Status (Pro Users) */}
      {isPro && (
        <div className="card" style={{ border: '2px solid #059669' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Star size={20} style={{ color: '#059669', marginRight: '8px' }} />
            <span style={{ color: '#059669', fontWeight: '600' }}>Premium Member</span>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            You have full access to all DriveWell features
          </p>
        </div>
      )}

      {/* Settings Sections */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Notifications
        </h3>
        
        <SettingsItem
          icon={<Bell size={20} style={{ color: '#6b7280' }} />}
          title="DOT Physical Reminders"
          description="Get notified before your DOT physical expires"
          action={
            <Toggle checked={dotReminders} onChange={toggleDotReminders} />
          }
        />

        <SettingsItem
          icon={<Smartphone size={20} style={{ color: '#6b7280' }} />}
          title="Workout Reminders"
          description="Daily fitness reminders"
          action={
            <Toggle checked={workoutReminders} onChange={toggleWorkoutReminders} />
          }
        />
      </div>

      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Account & Privacy
        </h3>
        
        <SettingsItem
          icon={<Shield size={20} style={{ color: '#6b7280' }} />}
          title="Privacy & Data"
          description="How we handle your data, export or delete"
          action={<ChevronRight size={16} style={{ color: '#6b7280' }} />}
          onClick={() => navigate('/privacy')}
        />

        <SettingsItem
          icon={<ExternalLink size={20} style={{ color: '#6b7280' }} />}
          title="Terms of Service"
          description="Our terms and conditions"
          action={<ChevronRight size={16} style={{ color: '#6b7280' }} />}
          onClick={() => window.open('https://drivewell.app/terms', '_blank')}
        />
      </div>

      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Support
        </h3>
        
        <SettingsItem
          icon={<HelpCircle size={20} style={{ color: '#6b7280' }} />}
          title="Help Center"
          description="FAQs and contact support"
          action={<ChevronRight size={16} style={{ color: '#6b7280' }} />}
          onClick={() => navigate('/help')}
        />

        <SettingsItem
          icon={<ExternalLink size={20} style={{ color: '#6b7280' }} />}
          title="Contact Support"
          description="Get help from our team"
          action={<ChevronRight size={16} style={{ color: '#6b7280' }} />}
          onClick={() => navigate('/help')}
        />
      </div>

      {/* App Info */}
      <div style={{ 
        textAlign: 'center', 
        padding: '32px 0',
        borderTop: '1px solid #f3f4f6',
        marginTop: '32px'
      }}>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
          DriveWell v1.0.0 MVP
        </p>
        <p style={{ color: '#6b7280', fontSize: '12px' }}>
          Built for truck drivers, by drivers
        </p>
      </div>
    </div>
  )
}

const Toggle = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    style={{
      width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
      background: checked ? '#2563eb' : '#d1d5db', position: 'relative',
      transition: 'background 0.2s', flexShrink: 0,
    }}
  >
    <div style={{
      position: 'absolute', top: '3px',
      left: checked ? '23px' : '3px',
      width: '18px', height: '18px', borderRadius: '50%',
      background: 'white', transition: 'left 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    }} />
  </div>
)

const SettingsItem = ({ icon, title, description, action, onClick }) => {
  return (
    <div 
      className="metric-item"
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        padding: '16px 0'
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <div style={{ marginLeft: '12px' }}>
          <p style={{ fontWeight: '500', marginBottom: '2px' }}>{title}</p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>{description}</p>
        </div>
      </div>
      {action}
    </div>
  )
}

export default Settings