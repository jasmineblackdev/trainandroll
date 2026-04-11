import React, { useState } from 'react'
import { Watch, CheckCircle2, RefreshCw } from 'lucide-react'

const PROVIDERS = [
  { id: 'apple', name: 'Apple Health', icon: '🍎', description: 'Sync heart rate, steps, and activity from iPhone or Apple Watch' },
  { id: 'google', name: 'Google Fit', icon: '🟢', description: 'Connect Google Fit data including workouts and heart rate' },
  { id: 'garmin', name: 'Garmin Connect', icon: '⌚', description: 'Import GPS workouts, HR data, and sleep tracking from Garmin devices' },
]

const loadPersistedState = () => {
  try { return JSON.parse(localStorage.getItem('dw_wearables') || '{}') }
  catch { return {} }
}

const Wearables = () => {
  const [states, setStates] = useState(loadPersistedState)

  const connect = (id) => {
    setStates(prev => {
      const next = { ...prev, [id]: 'connecting' }
      localStorage.setItem('dw_wearables', JSON.stringify(next))
      return next
    })
    setTimeout(() => {
      setStates(prev => {
        const next = { ...prev, [id]: 'connected' }
        localStorage.setItem('dw_wearables', JSON.stringify(next))
        return next
      })
    }, 500)
  }

  const disconnect = (id) => {
    setStates(prev => {
      const next = { ...prev, [id]: 'idle' }
      localStorage.setItem('dw_wearables', JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="screen">
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Connected Devices</h1>
        <p style={{ color: '#6b7280' }}>Sync wearable health data to improve your DOT score</p>
      </header>

      {PROVIDERS.map(provider => {
        const status = states[provider.id] || 'idle'
        return (
          <div key={provider.id} className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ fontSize: '32px', flexShrink: 0 }}>{provider.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: '600' }}>{provider.name}</h3>
                  {status === 'connected' && (
                    <span style={{
                      padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                      background: '#dcfce7', color: '#15803d',
                    }}>
                      Connected
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>{provider.description}</p>

                {status === 'connected' && (
                  <div style={{
                    padding: '10px 12px', background: '#f0fdf4', borderRadius: '8px',
                    fontSize: '13px', color: '#15803d', marginBottom: '12px',
                  }}>
                    <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    Synced 3 days of heart rate data — last sync: today
                  </div>
                )}

                {status === 'idle' && (
                  <button className="btn-primary" style={{ fontSize: '14px', padding: '9px 20px' }} onClick={() => connect(provider.id)}>
                    Connect
                  </button>
                )}
                {status === 'connecting' && (
                  <button className="btn-secondary" disabled style={{ fontSize: '14px', padding: '9px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    Connecting…
                  </button>
                )}
                {status === 'connected' && (
                  <button className="btn-secondary" style={{ fontSize: '14px', padding: '9px 20px' }} onClick={() => disconnect(provider.id)}>
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}

      <div className="card" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <Watch size={20} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>How it helps your DOT score</p>
            <p style={{ fontSize: '13px', color: '#374151' }}>
              Connecting a wearable syncs resting heart rate data, which counts toward your check-in streak points
              and improves DOT readiness scoring accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wearables
