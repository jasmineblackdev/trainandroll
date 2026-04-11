/**
 * DOT Readiness Score Algorithm
 * Mirrors the FMCSA medical certification thresholds.
 * Returns { score: 0-100, status: 'green'|'yellow'|'red', breakdown: [...] }
 */

const calcDotScore = ({ systolic, diastolic, weightLbs, heightIn, heartRate, bloodGlucose, checkInStreakDays = 0 }) => {
  const breakdown = []
  let total = 0

  // ── Blood Pressure — 30 pts ──────────────────────────────────────────────
  let bpPts = 0
  let bpNote = ''
  if (diastolic != null && diastolic >= 100) {
    bpPts  = 0
    bpNote = 'Diastolic ≥ 100 — disqualifying threshold'
  } else if (systolic != null) {
    if (systolic < 140) { bpPts = 30; bpNote = 'Normal range — full points' }
    else if (systolic <= 159) { bpPts = 15; bpNote = 'Stage 1 hypertension — monitor before physical' }
    else { bpPts = 0; bpNote = 'Stage 2+ hypertension — high disqualification risk' }
  }
  if (systolic != null) {
    breakdown.push({ metric: 'Blood Pressure', pts: bpPts, max: 30, value: `${systolic}/${diastolic ?? '?'} mmHg`, note: bpNote })
    total += bpPts
  }

  // ── BMI — 20 pts ─────────────────────────────────────────────────────────
  if (weightLbs && heightIn && heightIn > 0) {
    const bmi  = (weightLbs / (heightIn * heightIn)) * 703
    let bmiPts = 0, bmiNote = ''
    if (bmi < 30)       { bmiPts = 20; bmiNote = `BMI ${bmi.toFixed(1)} — healthy range` }
    else if (bmi < 35)  { bmiPts = 10; bmiNote = `BMI ${bmi.toFixed(1)} — obese range, weight loss recommended` }
    else                { bmiPts = 0;  bmiNote = `BMI ${bmi.toFixed(1)} — may trigger sleep apnea evaluation` }
    breakdown.push({ metric: 'BMI', pts: bmiPts, max: 20, value: bmi.toFixed(1), note: bmiNote })
    total += bmiPts
  }

  // ── Resting Heart Rate — 15 pts ───────────────────────────────────────────
  if (heartRate != null) {
    let hrPts = 0, hrNote = ''
    if (heartRate >= 60 && heartRate <= 100) { hrPts = 15; hrNote = 'Normal resting HR' }
    else if (heartRate > 100) { hrPts = 8; hrNote = 'Elevated HR — cardiovascular stress indicator' }
    else { hrPts = 8; hrNote = 'Bradycardia — discuss with your examiner' }
    breakdown.push({ metric: 'Resting Heart Rate', pts: hrPts, max: 15, value: `${heartRate} bpm`, note: hrNote })
    total += hrPts
  }

  // ── Blood Glucose — 20 pts ────────────────────────────────────────────────
  if (bloodGlucose != null) {
    let gPts = 0, gNote = ''
    if (bloodGlucose < 100)       { gPts = 20; gNote = 'Normal fasting glucose' }
    else if (bloodGlucose < 126)  { gPts = 10; gNote = 'Pre-diabetic range — lifestyle changes recommended' }
    else                          { gPts = 0;  gNote = 'Diabetic range — FMCSA exemption may be required' }
    breakdown.push({ metric: 'Blood Glucose', pts: gPts, max: 20, value: `${bloodGlucose} mg/dL`, note: gNote })
    total += gPts
  }

  // ── Check-in Streak — 15 pts ──────────────────────────────────────────────
  let streakPts = 0, streakNote = ''
  if (checkInStreakDays >= 7)      { streakPts = 15; streakNote = '7+ day streak — consistent monitoring' }
  else if (checkInStreakDays >= 3) { streakPts = 8;  streakNote = '3–6 day streak — keep it going' }
  else                             { streakPts = 0;  streakNote = 'No active streak — check in daily to earn points' }
  breakdown.push({ metric: 'Check-In Streak', pts: streakPts, max: 15, value: `${checkInStreakDays} days`, note: streakNote })
  total += streakPts

  // ── Status ────────────────────────────────────────────────────────────────
  let status
  if (total >= 90)      status = 'green'
  else if (total >= 70) status = 'yellow'
  else                  status = 'red'

  return { score: total, status, breakdown }
}

module.exports = { calcDotScore }
