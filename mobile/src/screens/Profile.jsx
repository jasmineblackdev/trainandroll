import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Calendar,
  Scale,
  Heart,
  Ruler,
  Activity,
  Edit,
  Save,
  AlertCircle,
  Settings,
  Droplets,
  ArrowRight,
  Trophy,
  Watch,
  HeartPulse,
} from 'lucide-react'
import { mockUser, getDotReadinessStatus, calculateBMI, getCheckInStreak } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { useOnboarding } from '../context/OnboardingContext'

const Profile = () => {
  const { data: ob, updateData } = useOnboarding()
  const { user: authUser } = useAuth()
  const navigate = useNavigate()
  const isPro = authUser?.subscriptionTier === 'driver_pro'

  const [isEditing, setIsEditing] = useState(false)
  const [metrics, setMetrics] = useState({
    ...mockUser.metrics,
    weight:      ob.weight      ? Number(ob.weight)      : mockUser.metrics.weight,
    height:      ob.height      ? Number(ob.height)      : mockUser.metrics.height,
    bloodGlucose: ob.bloodGlucose ? Number(ob.bloodGlucose) : mockUser.metrics.bloodGlucose,
    bloodPressure: {
      systolic:  ob.systolic  ? Number(ob.systolic)   : mockUser.metrics.bloodPressure.systolic,
      diastolic: ob.diastolic ? Number(ob.diastolic)  : mockUser.metrics.bloodPressure.diastolic,
    },
  })
  const [dotPhysicalDate, setDotPhysicalDate] = useState(
    ob.dotPhysicalDate || mockUser.dotPhysicalDate
  )

  const dotStatus = getDotReadinessStatus(metrics, getCheckInStreak())
  const bmi = calculateBMI(metrics.weight, metrics.height)

  const daysUntilDot = Math.ceil(
    (new Date(dotPhysicalDate) - new Date()) / (1000 * 60 * 60 * 24)
  )

  const handleSave = () => {
    setIsEditing(false)
    updateData({
      weight:       String(metrics.weight),
      height:       String(metrics.height),
      systolic:     String(metrics.bloodPressure.systolic),
      diastolic:    String(metrics.bloodPressure.diastolic),
      bloodGlucose: String(metrics.bloodGlucose),
      dotPhysicalDate,
    })
  }

  const updateMetric = (field, value) => {
    if (field === 'systolic' || field === 'diastolic') {
      setMetrics(prev => ({
        ...prev,
        bloodPressure: { ...prev.bloodPressure, [field]: parseInt(value) || 0 }
      }))
    } else {
      setMetrics(prev => ({ ...prev, [field]: parseInt(value) || 0 }))
    }
  }

  const bmiLabel = bmi
    ? bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
    : null

  const bmiColor = bmi
    ? bmi < 25 ? '#15803d' : bmi < 30 ? '#a16207' : '#dc2626'
    : '#2563eb'

  const glucoseColor = metrics.bloodGlucose < 100
    ? '#15803d' : metrics.bloodGlucose < 126
    ? '#a16207' : '#dc2626'

  return (
    <div className="screen">
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          Health Profile
        </h1>
        <p style={{ color: '#6b7280' }}>Track your DOT physical readiness</p>
      </header>

      {/* DOT Status Overview */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Activity className={`status-${dotStatus.status}`} size={24} />
          <h2 style={{ marginLeft: '12px', fontSize: '20px', fontWeight: '600' }}>
            DOT Physical Status
          </h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <p className={`status-${dotStatus.status}`} style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {dotStatus.message}
            </p>
            <p style={{ color: '#6b7280' }}>
              Next physical: {new Date(dotPhysicalDate).toLocaleDateString()}
            </p>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              {daysUntilDot > 0 ? `${daysUntilDot} days remaining` : 'Overdue!'}
            </p>
          </div>
        </div>

        {/* DOT Date Editor */}
        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Calendar size={16} style={{ color: '#6b7280', marginRight: '8px' }} />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Next DOT Physical Date</span>
            </div>
            {isEditing ? (
              <input
                type="date"
                value={dotPhysicalDate}
                onChange={(e) => setDotPhysicalDate(e.target.value)}
                style={{ padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
              />
            ) : (
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                {new Date(dotPhysicalDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Health Metrics</h3>
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {isEditing ? <Save size={16} /> : <Edit size={16} />}
            <span style={{ marginLeft: '6px' }}>{isEditing ? 'Save' : 'Edit'}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Weight */}
          <div className="metric-item">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Scale size={20} style={{ color: '#6b7280', marginRight: '12px' }} />
              <div>
                <p style={{ fontWeight: '500' }}>Weight</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Current weight in lbs</p>
              </div>
            </div>
            {isEditing ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="number" value={metrics.weight}
                  onChange={(e) => updateMetric('weight', e.target.value)}
                  style={{ width: '80px', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'center' }} />
                <span style={{ marginLeft: '6px', color: '#6b7280' }}>lbs</span>
              </div>
            ) : (
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>{metrics.weight}</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>lbs</p>
              </div>
            )}
          </div>

          {/* Height */}
          <div className="metric-item">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Ruler size={20} style={{ color: '#6b7280', marginRight: '12px' }} />
              <div>
                <p style={{ fontWeight: '500' }}>Height</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Used to calculate BMI</p>
              </div>
            </div>
            {isEditing ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="number" value={metrics.height}
                  onChange={(e) => updateMetric('height', e.target.value)}
                  style={{ width: '80px', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'center' }} />
                <span style={{ marginLeft: '6px', color: '#6b7280' }}>in</span>
              </div>
            ) : (
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>{metrics.height}</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>inches</p>
              </div>
            )}
          </div>

          {/* BMI (calculated, read-only) */}
          <div className="metric-item">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Activity size={20} style={{ color: '#6b7280', marginRight: '12px' }} />
              <div>
                <p style={{ fontWeight: '500' }}>BMI</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Calculated from weight & height</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: bmiColor }}>{bmi ?? '—'}</p>
              {bmiLabel && <p style={{ fontSize: '14px', color: bmiColor }}>{bmiLabel}</p>}
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="metric-item">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Heart size={20} style={{ color: '#6b7280', marginRight: '12px' }} />
              <div>
                <p style={{ fontWeight: '500' }}>Blood Pressure</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Systolic / Diastolic</p>
              </div>
            </div>
            {isEditing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input type="number" value={metrics.bloodPressure.systolic}
                  onChange={(e) => updateMetric('systolic', e.target.value)}
                  style={{ width: '60px', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'center' }} />
                <span>/</span>
                <input type="number" value={metrics.bloodPressure.diastolic}
                  onChange={(e) => updateMetric('diastolic', e.target.value)}
                  style={{ width: '60px', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'center' }} />
                <span style={{ marginLeft: '4px', color: '#6b7280', fontSize: '12px' }}>mmHg</span>
              </div>
            ) : (
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
                  {metrics.bloodPressure.systolic}/{metrics.bloodPressure.diastolic}
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>mmHg</p>
              </div>
            )}
          </div>

          {/* Blood Glucose */}
          <div className="metric-item">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Droplets size={20} style={{ color: '#6b7280', marginRight: '12px' }} />
              <div>
                <p style={{ fontWeight: '500' }}>Blood Glucose</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Fasting (mg/dL)</p>
              </div>
            </div>
            {isEditing ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="number" value={metrics.bloodGlucose}
                  onChange={(e) => updateMetric('bloodGlucose', e.target.value)}
                  style={{ width: '80px', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'center' }} />
                <span style={{ marginLeft: '6px', color: '#6b7280' }}>mg/dL</span>
              </div>
            ) : (
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: glucoseColor }}>
                  {metrics.bloodGlucose}
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>mg/dL</p>
              </div>
            )}
          </div>

          {/* Waist Measurement */}
          <div className="metric-item">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Ruler size={20} style={{ color: '#6b7280', marginRight: '12px' }} />
              <div>
                <p style={{ fontWeight: '500' }}>Waist Measurement</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Measured at navel</p>
              </div>
            </div>
            {isEditing ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="number" value={metrics.waistMeasurement}
                  onChange={(e) => updateMetric('waistMeasurement', e.target.value)}
                  style={{ width: '80px', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'center' }} />
                <span style={{ marginLeft: '6px', color: '#6b7280' }}>in</span>
              </div>
            ) : (
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>{metrics.waistMeasurement}</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>inches</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Risk Factors Alert */}
      {dotStatus.status === 'red' && (
        <div className="card" style={{ borderLeft: '4px solid #ef4444', background: '#fef2f2' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <AlertCircle size={20} style={{ color: '#ef4444', marginRight: '12px', marginTop: '2px' }} />
            <div>
              <h4 style={{ color: '#dc2626', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                High Risk for DOT Physical
              </h4>
              <p style={{ fontSize: '14px', color: '#7f1d1d', marginBottom: '12px' }}>
                Your current metrics indicate you may have difficulty passing your DOT physical.
                Consider speaking with a healthcare provider and increasing your workout frequency.
              </p>
              <button
                className="btn-primary"
                style={{ fontSize: '14px', padding: '8px 16px' }}
                onClick={() => navigate('/locations')}
              >
                Find Nearby DOT Centers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Info */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <User size={20} style={{ color: '#6b7280', marginRight: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Driver Information</h3>
        </div>

        <div className="metric-item">
          <span style={{ color: '#6b7280' }}>Name</span>
          <span style={{ fontWeight: '500' }}>{ob.name || mockUser.name}</span>
        </div>

        <div className="metric-item">
          <span style={{ color: '#6b7280' }}>CDL Number</span>
          <span style={{ fontWeight: '500' }}>{ob.cdlNumber || mockUser.cdlNumber}</span>
        </div>

        <div className="metric-item">
          <span style={{ color: '#6b7280' }}>Subscription</span>
          <span style={{ fontWeight: '500', color: isPro ? '#059669' : '#6b7280' }}>
            {isPro ? 'Driver Pro' : 'Free'}
          </span>
        </div>
      </div>

      {/* Settings Link */}
      <button
        onClick={() => navigate('/settings')}
        className="card"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', textAlign: 'left', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Settings size={20} style={{ color: '#6b7280', marginRight: '12px' }} />
          <span style={{ fontWeight: '500' }}>Settings</span>
        </div>
        <ArrowRight size={18} style={{ color: '#6b7280' }} />
      </button>

      {/* Achievements Link */}
      <button
        onClick={() => navigate('/achievements')}
        className="card"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', textAlign: 'left', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Trophy size={20} style={{ color: '#6b7280', marginRight: '12px' }} />
          <span style={{ fontWeight: '500' }}>Achievements</span>
        </div>
        <ArrowRight size={18} style={{ color: '#6b7280' }} />
      </button>

      {/* Wearables Link */}
      <button
        onClick={() => navigate('/wearables')}
        className="card"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', textAlign: 'left', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Watch size={20} style={{ color: '#6b7280', marginRight: '12px' }} />
          <span style={{ fontWeight: '500' }}>Connected Devices</span>
        </div>
        <ArrowRight size={18} style={{ color: '#6b7280' }} />
      </button>

      {/* Telehealth Link */}
      <button
        onClick={() => navigate('/telehealth')}
        className="card"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', textAlign: 'left', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <HeartPulse size={20} style={{ color: '#6b7280', marginRight: '12px' }} />
          <span style={{ fontWeight: '500' }}>Find a DOT Provider</span>
        </div>
        <ArrowRight size={18} style={{ color: '#6b7280' }} />
      </button>
    </div>
  )
}

export default Profile
