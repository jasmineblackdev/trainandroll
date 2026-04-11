import React, { createContext, useContext, useState } from 'react'

const OnboardingContext = createContext(null)

const STORAGE_KEY = 'dw_onboarding_data'

const defaultData = {
  name: '',
  cdlNumber: '',
  dotPhysicalDate: '',
  goals: [],
  weight: '',
  height: '',
  systolic: '',
  diastolic: '',
  bloodGlucose: '',
}

const loadData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData
  } catch {
    return defaultData
  }
}

export const OnboardingProvider = ({ children }) => {
  const [completed, setCompleted] = useState(
    () => localStorage.getItem('dw_onboarded') === 'true'
  )
  const [data, setData] = useState(loadData)

  const updateData = (fields) => {
    setData((prev) => {
      const next = { ...prev, ...fields }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const complete = async () => {
    localStorage.setItem('dw_onboarded', 'true')
    setCompleted(true)

    // Save baseline health data and mark onboarding complete in the API
    const API   = import.meta.env.VITE_API_URL || ''
    const token = localStorage.getItem('dw_token') || ''
    if (!API || !token) return

    const d = loadData()
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

    try {
      // Mark onboarding complete and save profile fields
      await fetch(`${API}/users/me`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          onboardingComplete: true,
          cdlNumber:       d.cdlNumber       || undefined,
          dotCertExpiry:   d.dotPhysicalDate || undefined,
        }),
      })

      // Save blood pressure as a health record
      if (d.systolic && d.diastolic) {
        await fetch(`${API}/health/records`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            metricType:     'blood_pressure',
            valuePrimary:   Number(d.systolic),
            valueSecondary: Number(d.diastolic),
            unit:           'mmHg',
            notes:          'Baseline — from onboarding',
          }),
        })
      }

      // Save blood glucose
      if (d.bloodGlucose) {
        await fetch(`${API}/health/records`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            metricType:   'blood_glucose',
            valuePrimary: Number(d.bloodGlucose),
            unit:         'mg/dL',
            notes:        'Baseline — from onboarding',
          }),
        })
      }

      // Save weight
      if (d.weight) {
        await fetch(`${API}/health/records`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            metricType:   'weight',
            valuePrimary: Number(d.weight),
            unit:         'lbs',
            notes:        'Baseline — from onboarding',
          }),
        })
      }
    } catch {
      // Offline — data is already saved locally, sync will happen later
    }
  }

  const reset = () => {
    localStorage.removeItem('dw_onboarded')
    localStorage.removeItem(STORAGE_KEY)
    setData(defaultData)
    setCompleted(false)
  }

  return (
    <OnboardingContext.Provider value={{ completed, data, updateData, complete, reset }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => useContext(OnboardingContext)
