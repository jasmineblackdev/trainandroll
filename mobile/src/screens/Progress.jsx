import React, { useState, useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react'
import { mockHistory, getReadinessTrend, mockUser } from '../data/mockData'
import { useOnboarding } from '../context/OnboardingContext'

const TABS = [
  { label: '30 Days', days: 30 },
  { label: '60 Days', days: 60 },
  { label: '90 Days', days: 90 },
]

/* ── SVG Line Chart ─────────────────────────────────────── */
const LineChart = ({ data, lines, height = 120, yMin, yMax }) => {
  const width = 320
  const padL = 36, padR = 8, padT = 8, padB = 20
  const chartW = width - padL - padR
  const chartH = height - padT - padB

  const minVal = yMin ?? Math.min(...lines.flatMap(l => data.map(d => d[l.key])))
  const maxVal = yMax ?? Math.max(...lines.flatMap(l => data.map(d => d[l.key])))
  const range  = maxVal - minVal || 1

  const xPos = (i) => padL + (i / (data.length - 1)) * chartW
  const yPos = (v) => padT + chartH - ((v - minVal) / range) * chartH

  const makePolyline = (key) =>
    data.map((d, i) => `${xPos(i)},${yPos(d[key])}`).join(' ')

  // Y-axis labels (3 ticks)
  const ticks = [minVal, minVal + range / 2, maxVal].map(Math.round)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: `${height}px` }}>
      {/* Grid lines */}
      {ticks.map((t, i) => {
        const y = yPos(t)
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={width - padR} y2={y}
              stroke="#f3f4f6" strokeWidth="1" />
            <text x={padL - 4} y={y + 4} textAnchor="end"
              fontSize="9" fill="#9ca3af">{t}</text>
          </g>
        )
      })}

      {/* Data lines */}
      {lines.map(line => (
        <polyline
          key={line.key}
          points={makePolyline(line.key)}
          fill="none"
          stroke={line.color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}

      {/* X-axis labels: first, middle, last */}
      {[0, Math.floor((data.length - 1) / 2), data.length - 1].map(i => (
        <text key={i} x={xPos(i)} y={height - 4} textAnchor="middle"
          fontSize="9" fill="#9ca3af">
          {data[i]?.date.slice(5)}
        </text>
      ))}
    </svg>
  )
}

/* ── Bar Chart (workout frequency) ─────────────────────── */
const BarChart = ({ weeklyData, height = 100 }) => {
  const max = Math.max(...weeklyData.map(w => w.count), 1)
  const barW = Math.floor(280 / weeklyData.length) - 4

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: `${height}px`, padding: '0 8px' }}>
      {weeklyData.map((w, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <span style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>{w.count}</span>
          <div
            style={{
              width: '100%',
              height: `${Math.max((w.count / max) * (height - 24), 4)}px`,
              background: '#2563eb',
              borderRadius: '3px 3px 0 0',
              minHeight: '4px',
            }}
          />
          <span style={{ fontSize: '9px', color: '#9ca3af', marginTop: '2px' }}>W{i + 1}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Stat Summary Row ────────────────────────────────────── */
const StatRow = ({ label, start, end, unit, lowerIsBetter = false }) => {
  const diff = end - start
  const improved = lowerIsBetter ? diff < 0 : diff > 0
  const neutral = Math.abs(diff) < 0.5

  const color = neutral ? '#6b7280' : improved ? '#15803d' : '#dc2626'
  const Icon  = neutral ? Minus : improved ? TrendingDown : TrendingUp

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <span style={{ fontSize: '14px', color: '#6b7280' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Icon size={14} color={color} />
        <span style={{ fontSize: '14px', fontWeight: '600', color }}>
          {diff > 0 ? '+' : ''}{diff.toFixed(1)} {unit}
        </span>
        <span style={{ fontSize: '13px', color: '#374151' }}>{end} {unit}</span>
      </div>
    </div>
  )
}

/* ── Main Component ─────────────────────────────────────── */
const Progress = () => {
  const [activeTab, setActiveTab] = useState(0)
  const { data: ob } = useOnboarding()
  const height = Number(ob.height) || mockUser.metrics.height

  const windowDays = TABS[activeTab].days

  const slicedHistory = useMemo(() => {
    return mockHistory.slice(-windowDays)
  }, [windowDays])

  const readinessTrend = useMemo(() => getReadinessTrend(windowDays, height), [windowDays, height])

  const firstScore = readinessTrend[0]?.score ?? 0
  const lastScore  = readinessTrend[readinessTrend.length - 1]?.score ?? 0
  const scoreDelta = lastScore - firstScore

  const weeklyWorkouts = useMemo(() => {
    const weeks = Math.ceil(slicedHistory.length / 7)
    return Array.from({ length: weeks }, (_, i) => {
      const chunk = slicedHistory.slice(i * 7, (i + 1) * 7)
      return { count: chunk.filter(d => d.workoutDone).length }
    })
  }, [slicedHistory])

  const first = slicedHistory[0]
  const last  = slicedHistory[slicedHistory.length - 1]

  const totalWorkouts = slicedHistory.filter(d => d.workoutDone).length

  return (
    <div className="screen">
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Progress</h1>
        <p style={{ color: '#6b7280' }}>Track your health trends over time</p>
      </header>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: activeTab === i ? '#2563eb' : 'white',
              color: activeTab === i ? 'white' : '#374151',
              fontWeight: activeTab === i ? '600' : '400',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Readiness Score Trend */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#2563eb" />
            <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Readiness Score Trend</h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '22px', fontWeight: '800', color: lastScore >= 90 ? '#15803d' : lastScore >= 70 ? '#a16207' : '#dc2626' }}>{lastScore}</span>
            <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '4px' }}>/ 100</span>
          </div>
        </div>
        <LineChart
          data={readinessTrend}
          lines={[{ key: 'score', color: lastScore >= 90 ? '#22c55e' : lastScore >= 70 ? '#eab308' : '#ef4444' }]}
          height={120}
          yMin={0}
          yMax={100}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>Based on health metrics + daily habits</p>
          <span style={{
            fontSize: '13px', fontWeight: '600',
            color: scoreDelta >= 0 ? '#15803d' : '#dc2626',
          }}>
            {scoreDelta >= 0 ? '+' : ''}{scoreDelta} pts
          </span>
        </div>

        {/* Predicted trajectory */}
        {(() => {
          const dailyRate = windowDays > 1 ? scoreDelta / windowDays : 0
          const projected30 = Math.min(100, Math.max(0, Math.round(lastScore + dailyRate * 30)))
          const willPass = projected30 >= 70
          const color = willPass ? '#15803d' : projected30 >= 50 ? '#a16207' : '#dc2626'
          const bg    = willPass ? '#f0fdf4' : projected30 >= 50 ? '#fffbeb' : '#fef2f2'
          return (
            <div style={{ marginTop: '12px', padding: '12px', background: bg, borderRadius: '10px' }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color, marginBottom: '3px' }}>
                30-Day Trajectory
              </p>
              <p style={{ fontSize: '13px', color: '#374151' }}>
                At your current pace, your score will be{' '}
                <strong style={{ color }}>{projected30}/100</strong> in 30 days —{' '}
                {willPass
                  ? 'on track for DOT readiness ✓'
                  : 'below the 70-point DOT-ready threshold. Increase workout frequency to improve.'}
              </p>
            </div>
          )
        })()}
      </div>

      {/* Summary stats */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '14px' }}>
          {windowDays}-Day Summary
        </h3>
        <StatRow label="Weight"        start={first.weight}     end={last.weight}     unit="lbs"   lowerIsBetter />
        <StatRow label="Systolic BP"   start={first.systolic}   end={last.systolic}   unit="mmHg"  lowerIsBetter />
        <StatRow label="Diastolic BP"  start={first.diastolic}  end={last.diastolic}  unit="mmHg"  lowerIsBetter />
        <StatRow label="Blood Glucose" start={first.bloodGlucose} end={last.bloodGlucose} unit="mg/dL" lowerIsBetter />
        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '10px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Total Workouts</span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#2563eb' }}>{totalWorkouts} sessions</span>
        </div>
      </div>

      {/* Weight Chart */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Weight (lbs)</h3>
        <LineChart
          data={slicedHistory}
          lines={[{ key: 'weight', color: '#2563eb' }]}
          height={130}
        />
      </div>

      {/* Blood Pressure Chart */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Blood Pressure</h3>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '2px', background: '#ef4444', display: 'inline-block' }} />
              Systolic
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '2px', background: '#f97316', display: 'inline-block' }} />
              Diastolic
            </span>
          </div>
        </div>
        <LineChart
          data={slicedHistory}
          lines={[
            { key: 'systolic',  color: '#ef4444' },
            { key: 'diastolic', color: '#f97316' },
          ]}
          height={130}
        />
        {/* DOT threshold line annotation */}
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
          DOT limit: 140/90 mmHg
        </p>
      </div>

      {/* Blood Glucose Chart */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Blood Glucose (mg/dL)</h3>
        <LineChart
          data={slicedHistory}
          lines={[{ key: 'bloodGlucose', color: '#a855f7' }]}
          height={130}
        />
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
          Normal fasting: &lt;100 mg/dL · Pre-diabetic: 100–125 · Diabetic: ≥126
        </p>
      </div>

      {/* Workout Frequency */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Workout Frequency</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>Sessions per week</p>
        <BarChart weeklyData={weeklyWorkouts} height={110} />
      </div>
    </div>
  )
}

export default Progress
