import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock,
  MapPin,
  Target,
  Filter,
  Play,
  Star,
  X
} from 'lucide-react'
import { mockWorkouts, getWorkoutFilters } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

const FilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '6px 12px',
      border: '1px solid #e5e7eb',
      borderRadius: '999px',
      background: active ? '#2563eb' : 'white',
      color: active ? 'white' : '#374151',
      fontSize: '13px',
      fontWeight: active ? '600' : '400',
      cursor: 'pointer',
    }}
  >
    {label}
  </button>
)

const Workouts = () => {
  const { user } = useAuth()
  const isPro = user?.subscriptionTier === 'driver_pro'

  const [selectedFilters, setSelectedFilters] = useState({
    duration: null,
    space: null,
    dotGoal: null,
    bodyArea: null,
    difficulty: null,
  })
  const [showFilters, setShowFilters] = useState(false)

  const filters = getWorkoutFilters()

  const toggle = (key, value) =>
    setSelectedFilters(prev => ({ ...prev, [key]: prev[key] === value ? null : value }))

  const filteredWorkouts = mockWorkouts.filter(workout => {
    if (selectedFilters.duration  && workout.duration   !== selectedFilters.duration)  return false
    if (selectedFilters.space     && workout.space      !== selectedFilters.space)     return false
    if (selectedFilters.dotGoal   && workout.dotGoal    !== selectedFilters.dotGoal)   return false
    if (selectedFilters.bodyArea  && workout.bodyArea   !== selectedFilters.bodyArea)  return false
    if (selectedFilters.difficulty && workout.difficulty !== selectedFilters.difficulty) return false
    return true
  })

  const availableWorkouts = isPro ? filteredWorkouts : filteredWorkouts.slice(0, 2)
  const lockedWorkouts    = isPro ? [] : filteredWorkouts.slice(2)

  const activeFilterCount = Object.values(selectedFilters).filter(Boolean).length

  const clearFilters = () =>
    setSelectedFilters({ duration: null, space: null, dotGoal: null, bodyArea: null, difficulty: null })

  return (
    <div className="screen">
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Workouts</h1>
        <p style={{ color: '#6b7280' }}>Designed for truck drivers on the road</p>
      </header>

      {/* Filter Bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Filter size={16} style={{ marginRight: '8px' }} />
            Filters
            {activeFilterCount > 0 && (
              <span style={{
                marginLeft: '8px',
                background: '#2563eb',
                color: 'white',
                borderRadius: '999px',
                fontSize: '11px',
                padding: '1px 6px',
                fontWeight: '700'
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              style={{ display: 'flex', alignItems: 'center', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
            >
              <X size={14} style={{ marginRight: '4px' }} /> Clear all
            </button>
          )}
        </div>

        {showFilters && (
          <div className="card" style={{ marginBottom: '16px' }}>
            {/* Body Area */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>Body Area</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {filters.bodyArea.map(f => (
                  <FilterChip
                    key={f.value}
                    label={f.label}
                    active={selectedFilters.bodyArea === f.value}
                    onClick={() => toggle('bodyArea', f.value)}
                  />
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>Intensity</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {filters.difficulty.map(f => (
                  <FilterChip
                    key={f.value}
                    label={f.label}
                    active={selectedFilters.difficulty === f.value}
                    onClick={() => toggle('difficulty', f.value)}
                  />
                ))}
              </div>
            </div>

            {/* Duration */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>Duration</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {filters.duration.map(d => (
                  <FilterChip
                    key={d}
                    label={`${d} min`}
                    active={selectedFilters.duration === d}
                    onClick={() => toggle('duration', d)}
                  />
                ))}
              </div>
            </div>

            {/* Space */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>Space Available</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {filters.space.map(f => (
                  <FilterChip
                    key={f.value}
                    label={f.label}
                    active={selectedFilters.space === f.value}
                    onClick={() => toggle('space', f.value)}
                  />
                ))}
              </div>
            </div>

            {/* DOT Goal */}
            <div>
              <p style={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>DOT Goal</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {filters.dotGoal.map(f => (
                  <FilterChip
                    key={f.value}
                    label={f.label}
                    active={selectedFilters.dotGoal === f.value}
                    onClick={() => toggle('dotGoal', f.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
        {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''} found
      </p>

      {/* Available Workouts */}
      <div>
        {availableWorkouts.length === 0 && lockedWorkouts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: '#6b7280' }}>No workouts match your filters. Try clearing some filters.</p>
          </div>
        ) : (
          availableWorkouts.map(workout => (
            <WorkoutCard key={workout.id} workout={workout} isLocked={false} />
          ))
        )}
      </div>

      {/* Locked Workouts */}
      {lockedWorkouts.length > 0 && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '32px 0 16px 0',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px'
          }}>
            <Star size={20} style={{ color: '#eab308', marginRight: '8px' }} />
            <span style={{ fontSize: '16px', fontWeight: '500' }}>
              Upgrade to Premium for {lockedWorkouts.length} more workout{lockedWorkouts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {lockedWorkouts.map(workout => (
            <WorkoutCard key={workout.id} workout={workout} isLocked={true} />
          ))}
        </div>
      )}
    </div>
  )
}

const difficultyColors = {
  easy:     { bg: '#dcfce7', text: '#15803d' },
  moderate: { bg: '#fef9c3', text: '#a16207' },
  hard:     { bg: '#fee2e2', text: '#dc2626' },
}

const WorkoutCard = ({ workout, isLocked }) => {
  const navigate = useNavigate()
  const dc = difficultyColors[workout.difficulty] || { bg: '#f3f4f6', text: '#374151' }

  return (
    <div className="card" style={{ opacity: isLocked ? 0.6 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', flex: 1, marginRight: '8px' }}>
          {workout.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <span style={{
            padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: '600',
            background: dc.bg, color: dc.text,
          }}>
            {workout.difficulty}
          </span>
          {isLocked && <Star size={16} style={{ color: '#eab308' }} />}
        </div>
      </div>

      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
        {workout.description}
      </p>

      <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', fontSize: '13px', color: '#6b7280', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Clock size={14} style={{ marginRight: '4px' }} />
          {workout.duration} min
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MapPin size={14} style={{ marginRight: '4px' }} />
          {workout.space.replace(/-/g, ' ')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Target size={14} style={{ marginRight: '4px' }} />
          {workout.bodyArea.replace(/-/g, ' ')}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Exercises:</p>
        <ul style={{ fontSize: '14px', color: '#374151', paddingLeft: '16px' }}>
          {workout.exercises.slice(0, 3).map((exercise, index) => (
            <li key={index} style={{ marginBottom: '4px' }}>{exercise}</li>
          ))}
          {workout.exercises.length > 3 && (
            <li style={{ color: '#6b7280' }}>+{workout.exercises.length - 3} more</li>
          )}
        </ul>
      </div>

      <button
        className={isLocked ? 'btn-secondary' : 'btn-primary'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          ...(isLocked && { cursor: 'not-allowed' })
        }}
        disabled={isLocked}
        onClick={() => !isLocked && navigate(`/workouts/${workout.id}`)}
      >
        <Play size={16} style={{ marginRight: '8px' }} />
        {isLocked ? 'Upgrade to Unlock' : 'Start Workout'}
      </button>
    </div>
  )
}

export default Workouts
