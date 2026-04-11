// Mock data for DriveWell MVP

export const mockUser = {
  name: "Jake Miller",
  cdlNumber: "CDL-TX-123456",
  dotPhysicalDate: "2026-09-15", // Next DOT physical
  metrics: {
    weight: 245, // lbs
    height: 70,  // inches (5'10")
    bloodPressure: { systolic: 138, diastolic: 88 }, // mmHg
    waistMeasurement: 42, // inches
    restingHeartRate: 78, // bpm
    bloodGlucose: 105,    // mg/dL (fasting)
  },
  subscription: "free" // "free" or "premium"
}

// Generate last 90 days of mock history data
const generateHistory = () => {
  const days = 90
  const now = new Date()
  const history = []

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    // Simulate gradual improvement
    const progress = (days - i) / days
    history.push({
      date: dateStr,
      weight: Math.round((248 - progress * 3 + (Math.random() - 0.5) * 1.5) * 10) / 10,
      systolic: Math.round(142 - progress * 4 + (Math.random() - 0.5) * 3),
      diastolic: Math.round(92 - progress * 4 + (Math.random() - 0.5) * 2),
      bloodGlucose: Math.round(112 - progress * 7 + (Math.random() - 0.5) * 5),
      workoutDone: Math.random() > 0.55, // ~45% workout days
      checkInDone: Math.random() > 0.45, // ~55% check-in days
    })
  }
  return history
}

export const mockHistory = generateHistory()

export const mockWorkouts = [
  {
    id: 1,
    title: "5-Minute In-Cab Stretch",
    duration: 5,
    space: "in-truck",
    dotGoal: "mobility",
    difficulty: "easy",
    bodyArea: "back",
    description: "Neck, shoulder, and back stretches you can do in your driver's seat",
    videoId: "dQw4w9WgXcQ", // placeholder — swap with real DriveWell YouTube video ID
    exercises: [
      "Neck rolls (30s)",
      "Shoulder shrugs (30s)",
      "Seated spinal twist (60s each side)",
      "Ankle circles (30s each)"
    ]
  },
  {
    id: 2,
    title: "Parking Lot Cardio Blast",
    duration: 20,
    space: "beside-truck",
    dotGoal: "weight",
    difficulty: "moderate",
    bodyArea: "cardio",
    description: "High-intensity bodyweight workout for truck stop parking lots",
    exercises: [
      "Jumping jacks (45s)",
      "Push-ups (30s)",
      "Mountain climbers (45s)",
      "Bodyweight squats (45s)",
      "Rest (60s) - Repeat 3 rounds"
    ]
  },
  {
    id: 3,
    title: "Blood Pressure Reduction Routine",
    duration: 10,
    space: "beside-truck",
    dotGoal: "blood-pressure",
    difficulty: "easy",
    bodyArea: "cardio",
    description: "Gentle exercises proven to help lower blood pressure",
    exercises: [
      "Deep breathing (2 minutes)",
      "Wall push-ups (2 sets of 10)",
      "Calf raises (2 sets of 15)",
      "Walking in place (3 minutes)",
      "Cool-down stretches (2 minutes)"
    ]
  },
  {
    id: 4,
    title: "Truck Stop Gym Session",
    duration: 45,
    space: "gym",
    dotGoal: "weight",
    difficulty: "hard",
    bodyArea: "full-body",
    description: "Full-body workout for when you have gym access",
    exercises: [
      "Treadmill warm-up (5 min)",
      "Chest press (3 sets of 12)",
      "Lat pulldown (3 sets of 12)",
      "Leg press (3 sets of 15)",
      "Core circuit (10 min)"
    ]
  },
  {
    id: 5,
    title: "In-Cab Core Activation",
    duration: 10,
    space: "in-truck",
    dotGoal: "mobility",
    difficulty: "easy",
    bodyArea: "core",
    description: "Strengthen your core while parked — no space needed",
    exercises: [
      "Seated abdominal bracing (60s)",
      "Oblique twists (30s each side)",
      "Pelvic tilts (2 sets of 15)",
      "Seated leg raises (2 sets of 10)",
      "Deep breathing cool-down (60s)"
    ]
  },
  {
    id: 6,
    title: "Leg Day Beside the Rig",
    duration: 15,
    space: "beside-truck",
    dotGoal: "weight",
    difficulty: "moderate",
    bodyArea: "legs",
    description: "Build leg strength using your truck for balance support",
    exercises: [
      "Bodyweight squats (3 sets of 15)",
      "Reverse lunges (3 sets of 10 each)",
      "Calf raises on step (3 sets of 20)",
      "Glute bridges on ground (3 sets of 15)",
      "Cool-down quad stretch (60s each)"
    ]
  },
  {
    id: 7,
    title: "Upper Body Pump",
    duration: 20,
    space: "beside-truck",
    dotGoal: "weight",
    difficulty: "moderate",
    bodyArea: "back",
    description: "Chest, back, and shoulder workout using the truck and bodyweight",
    exercises: [
      "Push-ups — standard (3 sets of 12)",
      "Incline push-ups on bumper (3 sets of 15)",
      "Truck door rows (3 sets of 12 each)",
      "Pike push-ups (2 sets of 10)",
      "Shoulder taps plank (45s)"
    ]
  },
  {
    id: 8,
    title: "Gym Cardio & Core",
    duration: 30,
    space: "gym",
    dotGoal: "blood-pressure",
    difficulty: "moderate",
    bodyArea: "core",
    description: "Steady-state cardio plus core conditioning for BP management",
    exercises: [
      "Elliptical or bike (15 min, moderate pace)",
      "Plank holds (3 × 45s)",
      "Dead bugs (3 sets of 10)",
      "Bicycle crunches (3 sets of 20)",
      "Seated row machine (3 sets of 12)"
    ]
  },
  {
    id: 9,
    title: "Full Body Stretch & Recovery",
    duration: 10,
    space: "in-truck",
    dotGoal: "mobility",
    difficulty: "easy",
    bodyArea: "full-body",
    description: "Post-drive recovery routine for sore muscles and stiffness",
    exercises: [
      "Seated hamstring stretch (60s each)",
      "Hip flexor stretch (60s each)",
      "Chest opener stretch (30s)",
      "Upper back rounds (30s x 3)",
      "Deep breathing & mindfulness (2 min)"
    ]
  },
  {
    id: 10,
    title: "Glucose-Busting Walk",
    duration: 20,
    space: "beside-truck",
    dotGoal: "blood-pressure",
    difficulty: "easy",
    bodyArea: "cardio",
    description: "A brisk walk after meals helps manage blood glucose levels",
    exercises: [
      "Warm-up walk (2 min easy)",
      "Brisk walk (15 min, conversational pace)",
      "Arm swings while walking (throughout)",
      "Cool-down walk (2 min easy)",
      "Standing calf raises (1 min)"
    ]
  }
]

export const mockLocations = [
  {
    id: 1,
    name: "TA Travel Center - Austin",
    type: "truck-stop",
    distance: 0.2,
    address: "8028 US-290, Austin, TX 78724",
    amenities: ["Showers", "Parking", "Food", "WiFi"],
    coordinates: { lat: 30.2672, lng: -97.7431 },
    notes: "Large truck parking area, well-lit"
  },
  {
    id: 2,
    name: "Planet Fitness - Cedar Park",
    type: "gym",
    distance: 0.8,
    address: "1890 Ranch Shopping Center, Cedar Park, TX",
    amenities: ["24/7 Access", "Day Pass: $15", "Showers"],
    coordinates: { lat: 30.5055, lng: -97.8203 },
    notes: "Walk from truck stop parking. No overnight truck parking on-site",
    truckParkingNotes: "Park at HEB across street, 5min walk"
  },
  {
    id: 3,
    name: "DOT Physical - Dr. Martinez",
    type: "dot-center",
    distance: 2.1,
    address: "3401 Esperanza Crossing, Austin, TX 78758",
    amenities: ["CDL Physical", "Same-day results", "Drug testing"],
    coordinates: { lat: 30.3672, lng: -97.6981 },
    notes: "Accepts walk-ins, truck-friendly location",
    hours: "Mon-Fri 7AM-6PM, Sat 8AM-2PM"
  },
  {
    id: 4,
    name: "Anytime Fitness - Round Rock",
    type: "gym",
    distance: 1.5,
    address: "2120 N Mays St, Round Rock, TX 78664",
    amenities: ["24/7 Access", "Day Pass: $20", "Personal Training"],
    coordinates: { lat: 30.5155, lng: -97.6789 },
    notes: "Truck parking available in back lot",
    truckParkingNotes: "Large vehicles welcome in rear parking"
  }
]

// ── localStorage helpers ──────────────────────────────────────────

export const getTodayStr = () => new Date().toISOString().split('T')[0]

export const loadCheckIns = () => {
  try { return JSON.parse(localStorage.getItem('dw_checkins') || '{}') }
  catch { return {} }
}

export const saveCheckIn = (date, data) => {
  const existing = loadCheckIns()
  existing[date] = data
  localStorage.setItem('dw_checkins', JSON.stringify(existing))
}

export const getCheckInStreak = () => {
  const checkIns = loadCheckIns()
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    if (checkIns[key]) streak++
    else if (i > 0) break // gap found — stop counting
  }
  return streak
}

export const loadWorkoutLogs = () => {
  try { return JSON.parse(localStorage.getItem('dw_workout_logs') || '[]') }
  catch { return [] }
}

export const saveWorkoutLog = (log) => {
  const logs = loadWorkoutLogs()
  logs.push(log)
  localStorage.setItem('dw_workout_logs', JSON.stringify(logs))
}

// ── FMCSA-weighted DOT Score ──────────────────────────────────────

// Average sleep quality (1–5) from recent check-ins
export const getAvgSleep = (days = 7) => {
  const checkIns = loadCheckIns()
  const scores = []
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    if (checkIns[key]?.sleep != null) scores.push(checkIns[key].sleep)
  }
  if (!scores.length) return null
  return scores.reduce((a, b) => a + b, 0) / scores.length
}

export const getDetailedDotScore = (metrics, checkInStreakDays = 0) => {
  const { weight, height, bloodPressure, restingHeartRate, bloodGlucose } = metrics
  const { systolic, diastolic } = bloodPressure

  // BP: 30 pts
  let bpPts = 0
  if (diastolic >= 100) {
    bpPts = 0
  } else if (systolic < 140) {
    bpPts = 30
  } else if (systolic <= 159) {
    bpPts = 15
  }

  // BMI: 20 pts
  let bmiPts = 0
  if (height && height > 0) {
    const bmi = (weight / (height * height)) * 703
    if (bmi < 30) bmiPts = 20
    else if (bmi < 35) bmiPts = 10
  }

  // Resting HR: 15 pts
  const hr = restingHeartRate || 75
  let hrPts = 0
  if (hr >= 60 && hr <= 100) hrPts = 15
  else if (hr > 100) hrPts = 8

  // Glucose: 20 pts
  let glucosePts = 0
  const glucose = bloodGlucose || 0
  if (glucose < 100) glucosePts = 20
  else if (glucose < 126) glucosePts = 10

  // Habits + Sleep: 15 pts (8 streak + 7 sleep quality)
  let streakPts = 0
  if (checkInStreakDays >= 7) streakPts = 8
  else if (checkInStreakDays >= 3) streakPts = 4

  const avgSleep = getAvgSleep(7)
  let sleepPts = 0
  if (avgSleep === null)   sleepPts = 3   // no data — neutral baseline
  else if (avgSleep >= 4)  sleepPts = 7
  else if (avgSleep >= 3)  sleepPts = 4
  else if (avgSleep >= 2)  sleepPts = 2

  const habitsPts = streakPts + sleepPts

  const score = bpPts + bmiPts + hrPts + glucosePts + habitsPts

  let status, message
  if (score >= 90) { status = 'green';  message = 'DOT Ready' }
  else if (score >= 70) { status = 'yellow'; message = 'At Risk' }
  else { status = 'red'; message = 'High Risk' }

  const breakdown = {
    bp:      { pts: bpPts,      max: 30, label: 'Blood Pressure' },
    bmi:     { pts: bmiPts,     max: 20, label: 'BMI' },
    hr:      { pts: hrPts,      max: 15, label: 'Heart Rate' },
    glucose: { pts: glucosePts, max: 20, label: 'Blood Glucose' },
    habits:  { pts: habitsPts,  max: 15, label: 'Habits & Sleep' },
  }

  return { score, status, message, breakdown }
}

// Backward-compatible wrapper
export const getDotReadinessStatus = (metrics, checkInStreakDays = 0) => {
  return getDetailedDotScore(metrics, checkInStreakDays)
}

// Suggested action for today based on score breakdown
export const getTodayAction = (breakdown) => {
  if (!breakdown) return { label: '5-Min In-Cab Stretch', path: '/workouts/1', icon: '🧘', reason: 'Stay mobile and reduce stiffness' }
  const gaps = Object.entries(breakdown)
    .map(([key, { pts, max, label }]) => ({ key, label, gap: max - pts }))
    .sort((a, b) => b.gap - a.gap)
  const worst = gaps[0]
  if (worst.gap === 0) return { label: '5-Min In-Cab Stretch', path: '/workouts/1', icon: '🧘', reason: "You're on track — keep it up!" }
  const actions = {
    bp:      { label: 'Blood Pressure Routine',  path: '/workouts/3',  icon: '❤️',  reason: 'BP is your biggest DOT risk right now' },
    bmi:     { label: 'Parking Lot Cardio Blast', path: '/workouts/2', icon: '🔥',  reason: 'Cardio helps your weight and DOT score' },
    glucose: { label: 'Glucose-Busting Walk',     path: '/workouts/10', icon: '🚶', reason: 'A brisk walk after meals lowers glucose' },
    habits:  { label: 'Complete Daily Check-In',  path: '/checkin',    icon: '📋',  reason: 'Consistency habit is worth 15 pts on your score' },
    hr:      { label: 'In-Cab Core Activation',   path: '/workouts/5', icon: '💪',  reason: 'Core work improves cardiovascular efficiency' },
  }
  return actions[worst.key] || actions.habits
}

// Readiness score trend using mock history health data
export const getReadinessTrend = (days = 30, heightInches = 70) => {
  return mockHistory.slice(-days).map(d => {
    const bmi      = (d.weight / (heightInches * heightInches)) * 703
    const bpPts    = d.diastolic >= 100 ? 0 : d.systolic < 140 ? 30 : d.systolic <= 159 ? 15 : 0
    const bmiPts   = bmi < 30 ? 20 : bmi < 35 ? 10 : 0
    const glucPts  = d.bloodGlucose < 100 ? 20 : d.bloodGlucose < 126 ? 10 : 0
    const habitPts = d.checkInDone ? 11 : 4   // simulated streak + sleep contribution
    return { date: d.date, score: Math.min(bpPts + bmiPts + 15 + glucPts + habitPts, 100) }
  })
}

export const calculateBMI = (weightLbs, heightInches) => {
  if (!heightInches || heightInches <= 0) return null
  return Math.round(((weightLbs / (heightInches * heightInches)) * 703) * 10) / 10
}

export const getWorkoutFilters = () => ({
  duration: [5, 10, 15, 20, 30, 45],
  space: [
    { value: 'in-truck', label: 'In Truck' },
    { value: 'beside-truck', label: 'Beside Truck' },
    { value: 'gym', label: 'Gym Access' }
  ],
  dotGoal: [
    { value: 'weight', label: 'Weight Loss' },
    { value: 'blood-pressure', label: 'Blood Pressure' },
    { value: 'mobility', label: 'Mobility' }
  ],
  bodyArea: [
    { value: 'back', label: 'Back' },
    { value: 'core', label: 'Core' },
    { value: 'legs', label: 'Legs' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'full-body', label: 'Full Body' }
  ],
  difficulty: [
    { value: 'easy', label: 'Easy' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'hard', label: 'Hard' }
  ]
})
