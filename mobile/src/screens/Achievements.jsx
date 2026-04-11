import React from 'react'
import { Trophy, Flame, ClipboardCheck, Activity } from 'lucide-react'
import { loadWorkoutLogs, getCheckInStreak, mockHistory } from '../data/mockData'

const BADGE_DEFS = [
  {
    id: 'first_workout',
    icon: '🏋️',
    title: 'First Workout',
    description: 'Complete your first workout',
    check: (logs) => logs.length >= 1,
  },
  {
    id: 'streak_7',
    icon: '🔥',
    title: '7-Day Workout Streak',
    description: 'Work out 7 days in a row',
    check: (logs) => {
      if (logs.length < 7) return false
      const dates = new Set(logs.map(l => l.date))
      const today = new Date()
      let streak = 0
      for (let i = 0; i < 30; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        if (dates.has(d.toISOString().split('T')[0])) streak++
        else if (i > 0) break
      }
      return streak >= 7
    },
  },
  {
    id: 'streak_30',
    icon: '⚡',
    title: '30-Day Workout Streak',
    description: 'Work out 30 days in a row',
    check: (logs) => logs.length >= 30,
  },
  {
    id: 'checkin_7',
    icon: '📋',
    title: '7-Day Check-in Streak',
    description: 'Check in 7 days in a row',
    check: (_logs, streak) => streak >= 7,
  },
  {
    id: 'dot_ready_30',
    icon: '🟢',
    title: '30 Days DOT Ready',
    description: '30 consecutive DOT-ready health days',
    check: () => {
      let count = 0, max = 0
      for (const d of mockHistory) {
        if (d.systolic < 140 && d.bloodGlucose < 126) { count++; max = Math.max(max, count) }
        else count = 0
      }
      return max >= 30
    },
  },
  {
    id: 'dot_ready_60',
    icon: '🏆',
    title: '60 Days DOT Ready',
    description: '60 consecutive DOT-ready health days',
    check: () => {
      let count = 0, max = 0
      for (const d of mockHistory) {
        if (d.systolic < 140 && d.bloodGlucose < 126) { count++; max = Math.max(max, count) }
        else count = 0
      }
      return max >= 60
    },
  },
]

const Achievements = () => {
  const logs = loadWorkoutLogs()
  const checkInStreak = getCheckInStreak()

  // Simple workout streak from logs
  let workoutStreak = 0
  if (logs.length > 0) {
    const dates = new Set(logs.map(l => l.date))
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      if (dates.has(d.toISOString().split('T')[0])) workoutStreak++
      else if (i > 0) break
    }
  }

  return (
    <div className="screen">
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Achievements</h1>
        <p style={{ color: '#6b7280' }}>Your health milestones</p>
      </header>

      {/* Streak stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div className="card" style={{ textAlign: 'center', marginBottom: 0 }}>
          <Flame size={24} style={{ color: '#f97316', margin: '0 auto 8px' }} />
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f97316' }}>{workoutStreak}</p>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Workout Streak</p>
        </div>
        <div className="card" style={{ textAlign: 'center', marginBottom: 0 }}>
          <ClipboardCheck size={24} style={{ color: '#22c55e', margin: '0 auto 8px' }} />
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>{checkInStreak}</p>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Check-in Streak</p>
        </div>
      </div>

      {/* Badges */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Trophy size={20} style={{ color: '#2563eb', marginRight: '8px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Badges</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {BADGE_DEFS.map(badge => {
            const earned = badge.check(logs, checkInStreak)
            return (
              <div
                key={badge.id}
                style={{
                  textAlign: 'center',
                  padding: '16px 8px',
                  borderRadius: '10px',
                  background: earned ? '#eff6ff' : '#f9fafb',
                  border: `1px solid ${earned ? '#bfdbfe' : '#e5e7eb'}`,
                  filter: earned ? 'none' : 'grayscale(1) opacity(0.4)',
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>{badge.icon}</div>
                <p style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>{badge.title}</p>
                <p style={{ fontSize: '11px', color: '#6b7280' }}>{badge.description}</p>
              </div>
            )
          })}
        </div>

        <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginTop: '16px' }}>
          {BADGE_DEFS.filter(b => b.check(logs, checkInStreak)).length} / {BADGE_DEFS.length} earned
        </p>
      </div>

      {/* Total workouts */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Activity size={20} style={{ color: '#2563eb', marginRight: '8px' }} />
            <span style={{ fontWeight: '500' }}>Total Workouts Logged</span>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#2563eb' }}>{logs.length}</span>
        </div>
      </div>
    </div>
  )
}

export default Achievements
