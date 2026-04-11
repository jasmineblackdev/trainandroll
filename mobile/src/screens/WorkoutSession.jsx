import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, CheckCircle2, Clock, Play, Video } from 'lucide-react'
import { mockWorkouts, saveWorkoutLog, getTodayStr } from '../data/mockData'

// Video player — thumbnail with play button, embeds YouTube on tap.
// Workouts with a videoId get a video demo shown at the start of their session.
const WorkoutVideo = ({ workout }) => {
  const [playing, setPlaying] = useState(false)
  if (!workout.videoId) return null
  return (
    <div className="card" style={{ marginBottom: '16px', padding: 0, overflow: 'hidden', borderRadius: '16px' }}>
      {playing ? (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' }}>
          <iframe
            src={`https://www.youtube.com/embed/${workout.videoId}?autoplay=1`}
            allow="autoplay; fullscreen"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            title={workout.title}
          />
        </div>
      ) : (
        <div
          onClick={() => setPlaying(true)}
          style={{ position: 'relative', paddingBottom: '56.25%', background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', cursor: 'pointer' }}
        >
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={30} color="white" fill="white" style={{ marginLeft: '3px' }} />
            </div>
            <p style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>Watch Video Demo</p>
          </div>
          <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: '999px' }}>
            <Video size={12} color="white" />
            <span style={{ color: 'white', fontSize: '11px', fontWeight: '600' }}>VIDEO</span>
          </div>
        </div>
      )}
    </div>
  )
}

const StarRating = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
    {[1, 2, 3, 4, 5].map(n => (
      <button key={n} onClick={() => onChange(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '32px', color: n <= value ? '#eab308' : '#d1d5db' }}>★</button>
    ))}
  </div>
)

const WorkoutSession = () => {
  const { id } = useParams()
  const workout = mockWorkouts.find(w => w.id === Number(id))

  const [exerciseIdx, setExerciseIdx]         = useState(0)
  const [elapsed, setElapsed]                 = useState(0)
  const [done, setDone]                       = useState(false)
  const [rating, setRating]                   = useState(0)
  const [logged, setLogged]                   = useState(false)
  const [totalDuration, setTotalDuration]     = useState(0)

  const intervalRef = useRef(null)
  const startRef    = useRef(Date.now())

  useEffect(() => {
    setElapsed(0)
    startRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [exerciseIdx])

  if (!workout) {
    return (
      <div className="screen">
        <p style={{ color: '#6b7280' }}>Workout not found.</p>
        <Link to="/workouts" className="btn-secondary" style={{ display: 'inline-block', marginTop: '16px' }}>Back to Workouts</Link>
      </div>
    )
  }

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleNext = () => {
    if (exerciseIdx < workout.exercises.length - 1) {
      setExerciseIdx(prev => prev + 1)
    } else {
      clearInterval(intervalRef.current)
      setTotalDuration(Math.floor((Date.now() - startRef.current) / 1000 + elapsed))
      setDone(true)
    }
  }

  const handleLog = () => {
    saveWorkoutLog({ workoutId: workout.id, workoutTitle: workout.title, date: getTodayStr(), rating, duration: Math.max(1, Math.round(totalDuration / 60)) })
    setLogged(true)
  }

  if (done) {
    return (
      <div className="screen">
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircle2 size={56} color="#22c55e" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Workout Complete!</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>{workout.title}</p>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontWeight: '600', marginBottom: '12px' }}>Rate this workout</p>
            <StarRating value={rating} onChange={setRating} />
          </div>
          {logged ? (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: '#15803d', fontWeight: '600', marginBottom: '16px' }}>Workout logged!</p>
              <Link to="/workouts" className="btn-primary" style={{ display: 'inline-block' }}>Back to Workouts</Link>
            </div>
          ) : (
            <button className="btn-primary" style={{ width: '100%', marginBottom: '12px' }} onClick={handleLog} disabled={rating === 0}>
              {rating === 0 ? 'Select a rating to log' : 'Log Workout'}
            </button>
          )}
          {!logged && <Link to="/workouts" className="btn-secondary" style={{ display: 'block', textAlign: 'center' }}>Skip & Return</Link>}
        </div>
      </div>
    )
  }

  const exercise = workout.exercises[exerciseIdx]
  const progress = ((exerciseIdx + 1) / workout.exercises.length) * 100

  return (
    <div className="screen">
      <header style={{ marginBottom: '16px' }}>
        <Link to="/workouts" style={{ color: '#6b7280', fontSize: '14px', textDecoration: 'none' }}>← Back</Link>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '8px', marginBottom: '4px' }}>{workout.title}</h1>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>Exercise {exerciseIdx + 1} of {workout.exercises.length}</p>
      </header>

      <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', marginBottom: '20px' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#2563eb', borderRadius: '3px', transition: 'width 0.3s' }} />
      </div>

      {/* Show video demo on first exercise */}
      {exerciseIdx === 0 && <WorkoutVideo workout={workout} />}

      <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
        <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Current Exercise</p>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>{exercise}</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          <Clock size={20} style={{ color: '#2563eb' }} />
          <span style={{ fontSize: '28px', fontWeight: 'bold', fontVariantNumeric: 'tabular-nums', color: '#2563eb' }}>{formatTime(elapsed)}</span>
        </div>
        <button
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', fontSize: '18px', padding: '16px' }}
          onClick={handleNext}
        >
          {exerciseIdx < workout.exercises.length - 1
            ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Next Exercise <ChevronRight size={20} /></span>
            : <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Finish Workout <CheckCircle2 size={20} /></span>
          }
        </button>
      </div>

      {exerciseIdx < workout.exercises.length - 1 && (
        <div className="card">
          <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '10px', color: '#6b7280' }}>Up Next</p>
          {workout.exercises.slice(exerciseIdx + 1).map((ex, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < workout.exercises.length - exerciseIdx - 2 ? '1px solid #f3f4f6' : 'none' }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600', color: '#6b7280', flexShrink: 0 }}>
                {exerciseIdx + i + 2}
              </span>
              <span style={{ fontSize: '14px', color: '#374151' }}>{ex}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkoutSession
