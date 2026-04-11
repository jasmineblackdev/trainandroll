import React, { useState, useEffect, useRef } from 'react'
import { Utensils, MapPin, Plus, CheckCircle2, Flame, Droplets, AlertCircle, Search, X, ChevronDown, ChevronUp } from 'lucide-react'
import { getDotReadinessStatus, loadCheckIns, getCheckInStreak, mockUser, getTodayStr } from '../data/mockData'
import { useOnboarding } from '../context/OnboardingContext'

// ── Food database (~45 items covering real truck-stop eating) ──────────────────
const FOOD_DB = [
  // Breakfast
  { id: 101, name: 'Scrambled Eggs (3)', cal: 210, protein: 18, carbs: 2, fat: 14, sodium: 300, category: 'Breakfast' },
  { id: 102, name: 'Oatmeal (plain, 1 cup cooked)', cal: 150, protein: 5, carbs: 27, fat: 2, sodium: 105, category: 'Breakfast' },
  { id: 103, name: 'Greek Yogurt (plain, 6oz)', cal: 100, protein: 17, carbs: 6, fat: 0, sodium: 65, category: 'Breakfast' },
  { id: 104, name: 'Hard-boiled Eggs (3)', cal: 210, protein: 18, carbs: 2, fat: 14, sodium: 210, category: 'Breakfast' },
  { id: 105, name: 'Egg & Cheese Biscuit (fast food)', cal: 440, protein: 18, carbs: 35, fat: 27, sodium: 1020, category: 'Breakfast' },
  { id: 106, name: "McDonald's Egg McMuffin", cal: 310, protein: 17, carbs: 30, fat: 12, sodium: 760, category: 'Breakfast' },
  { id: 107, name: 'Sausage Egg McMuffin', cal: 480, protein: 27, carbs: 30, fat: 27, sodium: 890, category: 'Breakfast' },
  // Fruit
  { id: 201, name: 'Banana', cal: 105, protein: 1, carbs: 27, fat: 0, sodium: 1, category: 'Fruit' },
  { id: 202, name: 'Apple', cal: 95, protein: 0, carbs: 25, fat: 0, sodium: 2, category: 'Fruit' },
  { id: 203, name: 'Orange', cal: 62, protein: 1, carbs: 15, fat: 0, sodium: 0, category: 'Fruit' },
  // Subway
  { id: 301, name: 'Subway 6" Turkey (no mayo)', cal: 280, protein: 18, carbs: 40, fat: 4, sodium: 610, category: 'Sandwich' },
  { id: 302, name: 'Subway 6" Chicken Breast', cal: 320, protein: 24, carbs: 45, fat: 5, sodium: 530, category: 'Sandwich' },
  { id: 303, name: 'Subway 6" Veggie Delite', cal: 230, protein: 9, carbs: 44, fat: 2, sodium: 310, category: 'Sandwich' },
  { id: 304, name: 'Subway Chopped Salad (Turkey)', cal: 160, protein: 14, carbs: 14, fat: 4, sodium: 520, category: 'Salad' },
  // Chipotle
  { id: 401, name: 'Chipotle Bowl (Chicken)', cal: 620, protein: 48, carbs: 62, fat: 16, sodium: 1140, category: 'Bowl' },
  { id: 402, name: 'Chipotle Salad (Chicken)', cal: 520, protein: 46, carbs: 26, fat: 22, sodium: 1050, category: 'Salad' },
  { id: 403, name: 'Chipotle Bowl (Steak)', cal: 650, protein: 44, carbs: 62, fat: 19, sodium: 1290, category: 'Bowl' },
  // Wendy's / fast food
  { id: 501, name: "Wendy's Grilled Chicken Sandwich", cal: 370, protein: 34, carbs: 36, fat: 9, sodium: 830, category: 'Sandwich' },
  { id: 502, name: "Wendy's Apple Pecan Chicken Salad", cal: 340, protein: 29, carbs: 32, fat: 9, sodium: 760, category: 'Salad' },
  { id: 503, name: "McDonald's Grilled Chicken Salad", cal: 320, protein: 30, carbs: 11, fat: 15, sodium: 960, category: 'Salad' },
  // Truck stop / diner entrees
  { id: 601, name: 'Grilled Chicken + Steamed Veggies', cal: 380, protein: 42, carbs: 18, fat: 12, sodium: 520, category: 'Entree' },
  { id: 602, name: 'Steak + Side Salad (no dressing)', cal: 420, protein: 50, carbs: 8, fat: 18, sodium: 580, category: 'Entree' },
  { id: 603, name: 'Turkey Chili (1 cup)', cal: 250, protein: 22, carbs: 28, fat: 5, sodium: 780, category: 'Entree' },
  { id: 604, name: 'Grilled Salmon + Veggies', cal: 400, protein: 44, carbs: 12, fat: 18, sodium: 490, category: 'Entree' },
  { id: 605, name: 'Cracker Barrel Grilled Chicken (plain)', cal: 260, protein: 50, carbs: 2, fat: 5, sodium: 440, category: 'Entree' },
  // Snacks
  { id: 701, name: 'Protein Bar (Quest / RXBar)', cal: 200, protein: 20, carbs: 22, fat: 8, sodium: 190, category: 'Snack' },
  { id: 702, name: 'Mixed Nuts (1 oz)', cal: 170, protein: 5, carbs: 6, fat: 15, sodium: 0, category: 'Snack' },
  { id: 703, name: 'String Cheese (2 sticks)', cal: 160, protein: 14, carbs: 2, fat: 10, sodium: 380, category: 'Snack' },
  { id: 704, name: 'Beef Jerky (1 oz, low-sodium)', cal: 80, protein: 13, carbs: 3, fat: 1, sodium: 310, category: 'Snack' },
  { id: 705, name: 'Almonds (1 oz)', cal: 164, protein: 6, carbs: 6, fat: 14, sodium: 0, category: 'Snack' },
  { id: 706, name: 'Sunflower Seeds (1 oz shell-free)', cal: 165, protein: 6, carbs: 6, fat: 14, sodium: 0, category: 'Snack' },
  { id: 707, name: 'Peanut Butter Packet (2 tbsp)', cal: 190, protein: 8, carbs: 6, fat: 16, sodium: 140, category: 'Snack' },
  // Drinks
  { id: 801, name: 'Protein Shake (ready-to-drink, 11oz)', cal: 160, protein: 30, carbs: 6, fat: 4, sodium: 280, category: 'Drink' },
  { id: 802, name: 'Chocolate Milk (12 oz)', cal: 220, protein: 10, carbs: 32, fat: 5, sodium: 190, category: 'Drink' },
  { id: 803, name: 'Coffee (black, 12oz)', cal: 5, protein: 0, carbs: 0, fat: 0, sodium: 5, category: 'Drink' },
  { id: 804, name: 'Gatorade (20oz)', cal: 140, protein: 0, carbs: 36, fat: 0, sodium: 270, category: 'Drink' },
  // Pilot/TA grab & go
  { id: 901, name: 'Hard-boiled Egg Pack (truck stop)', cal: 140, protein: 12, carbs: 2, fat: 10, sodium: 140, category: 'Grab & Go' },
  { id: 902, name: 'Tuna Pouch (single serve)', cal: 100, protein: 22, carbs: 0, fat: 1, sodium: 310, category: 'Grab & Go' },
  { id: 903, name: 'Hot Dog (truck stop)', cal: 290, protein: 10, carbs: 22, fat: 18, sodium: 780, category: 'Grab & Go' },
  { id: 904, name: 'Slice of Pizza (truck stop)', cal: 290, protein: 12, carbs: 36, fat: 10, sodium: 620, category: 'Grab & Go' },
  { id: 905, name: 'Beef Stick (1 oz)', cal: 120, protein: 7, carbs: 1, fat: 10, sodium: 380, category: 'Grab & Go' },
]

// ── Quick-add meal templates ──────────────────────────────────────────────────
const QUICK_MEALS = [
  { id: 1, name: 'Grilled Chicken + Veggies', cal: 380, protein: 42, carbs: 18, fat: 12, sodium: 520 },
  { id: 2, name: 'Subway 6" Turkey (no mayo)', cal: 280, protein: 18, carbs: 40, fat: 4,  sodium: 610 },
  { id: 3, name: 'Protein Bar (Quest / RXBar)', cal: 200, protein: 20, carbs: 22, fat: 8,  sodium: 190 },
  { id: 4, name: 'Hard-boiled Eggs (3)', cal: 210, protein: 18, carbs: 2,  fat: 14, sodium: 210 },
  { id: 5, name: 'Chipotle Bowl (chicken)', cal: 620, protein: 48, carbs: 62, fat: 16, sodium: 1140 },
  { id: 6, name: 'Mixed Nuts (1 oz)',          cal: 170, protein: 5,  carbs: 6,  fat: 15, sodium: 0   },
]

// ── Mock nearby healthy-option restaurants ────────────────────────────────────
const NEARBY_SPOTS = [
  {
    id: 1,
    name: 'Subway',
    type: 'Fast Casual',
    distance: 0.1,
    truckParking: true,
    dotFriendly: true,
    tip: 'Order on whole wheat with double veggies, no mayo. 6" turkey = ~280 cal.',
    tags: ['Low Sodium', 'High Protein'],
  },
  {
    id: 2,
    name: 'Pilot Flying J — Fresh Market',
    type: 'Truck Stop',
    distance: 0.2,
    truckParking: true,
    dotFriendly: true,
    tip: 'Grab a hard-boiled egg pack + string cheese + apple. Skip the hot dogs.',
    tags: ['Truck Parking', 'Grab & Go'],
  },
  {
    id: 3,
    name: 'Chipotle',
    type: 'Fast Casual',
    distance: 0.9,
    truckParking: false,
    dotFriendly: true,
    tip: 'Burrito bowl with chicken, black beans, fajita veggies, salsa. No sour cream.',
    tags: ['High Protein', 'Customizable'],
  },
  {
    id: 4,
    name: 'Cracker Barrel',
    type: 'Sit-Down',
    distance: 1.4,
    truckParking: true,
    dotFriendly: false,
    tip: 'Stick to grilled chicken + steamed veggies. Avoid biscuits and gravy.',
    tags: ['Truck Parking', 'Watch Portions'],
  },
]

// ── DOT Tips — 15 tips across 5 categories ────────────────────────────────────
const ALL_TIPS = [
  {
    id: 1, icon: '🩸', category: 'bp',
    title: 'Control Blood Pressure Through Diet',
    body: 'Sodium is the #1 dietary driver of high BP. Stay under 2,300mg/day. Truck-stop fast food, canned soups, and processed meats are all sodium bombs. A single Chipotle bowl can be 1,140mg — half your daily limit in one meal.',
  },
  {
    id: 2, icon: '🧂', category: 'bp',
    title: 'Slash Sodium Without Sacrificing Taste',
    body: 'Ask for sauces and dressings on the side, then use half. Choose grilled over fried — breading adds 400–600mg sodium. At Subway, double the veggies instead of adding cheese or condiments. Lemon juice and hot sauce are low-sodium flavor boosters.',
  },
  {
    id: 3, icon: '🍌', category: 'bp',
    title: 'Potassium Counteracts High Sodium',
    body: 'Potassium helps your kidneys flush excess sodium and directly lowers blood pressure. Best portable sources: bananas, oranges, avocado, and sweet potatoes. Most truck stops sell bananas at checkout — grab one every morning.',
  },
  {
    id: 4, icon: '⚖️', category: 'bmi',
    title: 'DOT BMI Thresholds You Need to Know',
    body: 'BMI over 40 triggers mandatory sleep apnea screening. This can reduce your medical certificate from 2 years to 1 year — or less. Losing 10–15 lbs can move you under the threshold. Your DOT score awards 20 pts for BMI under 30 and 10 pts for BMI 30–34.',
  },
  {
    id: 5, icon: '🥗', category: 'bmi',
    title: 'Calorie Density Swaps at Truck Stops',
    body: 'The biggest calorie trap is the combo meal. Swap the fries (470 cal) for a side salad (30 cal). Skip the soda (240 cal) for water or unsweetened tea. These two swaps alone cut 680 calories per meal — without eating less food.',
  },
  {
    id: 6, icon: '🍽️', category: 'bmi',
    title: 'Eat Before You Get Desperate',
    body: "Hunger spikes lead to the highest-calorie choices. Keep portable snacks in-cab — protein bars, nuts, jerky, string cheese. Eating something small every 3–4 hours keeps you in control at the next stop. You can't outwork a bad hunger-driven meal decision.",
  },
  {
    id: 7, icon: '🍬', category: 'glucose',
    title: 'Blood Glucose & DOT Physical',
    body: 'Fasting glucose under 100 mg/dL = normal (20 pts on your DOT score). 100–125 = pre-diabetes (10 pts). Over 126 = diabetes — which may require FMCSA exemption for insulin. Cutting sugary drinks alone can drop fasting glucose 10–20 mg/dL within weeks.',
  },
  {
    id: 8, icon: '🚶', category: 'glucose',
    title: 'A 10-Minute Walk After Meals Lowers Glucose',
    body: "Walking after eating activates glucose transporters in your muscles that pull sugar out of the bloodstream — without insulin. Studies show a 10-minute post-meal walk reduces glucose spikes by 20–30%. At any stop, do a few loops around your truck before getting back in the cab.",
  },
  {
    id: 9, icon: '🥚', category: 'glucose',
    title: 'Choose Low-Glycemic Snacks',
    body: "High-glycemic snacks (white bread, chips, candy) spike blood sugar fast, then crash you. Better options at truck stops: hard-boiled eggs, nuts, cheese, beef sticks, or plain Greek yogurt. These give sustained energy without the glucose roller coaster that impairs focus.",
  },
  {
    id: 10, icon: '💧', category: 'habits',
    title: 'Hydration Reduces Fatigue — And It Matters for DOT',
    body: "Even mild dehydration (1–2%) slows reaction time. For a DOT physical, dehydration can spike blood pressure readings by 5–10 points on exam day. Aim for 80–100 oz of water per day. A large water bottle at the start of your shift and at every fuel stop builds the habit.",
  },
  {
    id: 11, icon: '☕', category: 'habits',
    title: 'Coffee Strategy for Drivers',
    body: "Coffee is fine in moderate amounts (2–3 cups/day). The problem is what gets added — a large flavored latte can be 400 cal and 40g sugar. Order black or with a splash of milk. Stop caffeine by 2–3pm to protect sleep quality. Poor sleep is a direct hit to your DOT habits score.",
  },
  {
    id: 12, icon: '🥩', category: 'habits',
    title: 'Best High-Protein Picks at Most Truck Stops',
    body: "Protein keeps you full and supports muscle — critical for drivers sitting 8–10 hours. Best finds at Pilot and TA: hard-boiled egg packs, beef jerky (low-sodium), protein bars (RXBar, Quest), Greek yogurt cups, string cheese, and individual peanut butter packets. All under $4 and under 200 cal.",
  },
  {
    id: 13, icon: '🏃', category: 'hr',
    title: 'Daily Movement Strengthens Your Heart',
    body: "Resting heart rate above 100 BPM (tachycardia) can flag on a DOT exam. Consistent cardio — even 15–20 min/day — lowers resting HR by 5–10 BPM within 4–6 weeks. Parking lot walks, jumping jacks during rest breaks, and in-cab stretching all count. Consistency beats intensity.",
  },
  {
    id: 14, icon: '🧘', category: 'hr',
    title: 'Stress Raises Your Heart Rate and Blood Pressure',
    body: "Chronic stress elevates both HR and BP — two DOT exam factors. 5 deep breaths (4 counts in, 6 out) activates the parasympathetic nervous system and drops HR within 2 minutes. This technique works before exams. Use traffic delays as forced breathing practice instead of stressors.",
  },
  {
    id: 15, icon: '😴', category: 'hr',
    title: 'Sleep Quality Directly Affects Your DOT Score',
    body: "Poor sleep raises cortisol (stress hormone), which raises blood pressure and heart rate. 7–8 hours of quality sleep consistently lowers BP by 5–8 mmHg over time. DOT regs require 10-hour rest periods — use them. Blackout curtains for your sleeper berth and a consistent sleep schedule are the highest-ROI habits.",
  },
]

const DOT_DAILY_TARGETS = { cal: 2200, protein: 150, carbs: 220, fat: 70, sodium: 2300 }
const STORAGE_KEY = 'dw_nutrition_log'

const TIP_FILTERS = [
  { id: 'all',    label: 'All Tips'   },
  { id: 'bp',     label: 'Blood Pressure' },
  { id: 'bmi',    label: 'Weight'     },
  { id: 'glucose',label: 'Glucose'    },
  { id: 'habits', label: 'Hydration & Habits' },
  { id: 'hr',     label: 'Heart Health' },
]

const CATEGORY_LABELS = {
  bp:      'Blood Pressure',
  bmi:     'Weight / BMI',
  glucose: 'Blood Glucose',
  habits:  'Daily Habits',
  hr:      'Heart Rate',
}

const loadTodayLog = () => {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const today = new Date().toISOString().split('T')[0]
    return all[today] || []
  } catch { return [] }
}

const saveTodayLog = (items) => {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const today = new Date().toISOString().split('T')[0]
    all[today] = items
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch { /* ignore */ }
}

const MacroBar = ({ label, value, target, color, unit = 'g' }) => {
  const pct = Math.min((value / target) * 100, 100)
  const over = value > target
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
        <span style={{ color: '#374151', fontWeight: '500' }}>{label}</span>
        <span style={{ color: over ? '#dc2626' : '#6b7280' }}>
          {value}{unit} / {target}{unit} {over && '⚠️'}
        </span>
      </div>
      <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: over ? '#ef4444' : color, borderRadius: '999px', transition: 'width 0.3s' }} />
      </div>
    </div>
  )
}

const Nutrition = () => {
  const { data: ob } = useOnboarding()
  const [log, setLog]             = useState(loadTodayLog)
  const [activeTab, setActiveTab] = useState('log')
  const [added, setAdded]         = useState(null)

  // Food search state
  const [searchQuery, setSearchQuery]   = useState('')
  const [showSearch, setShowSearch]     = useState(false)
  const searchRef = useRef(null)

  // Geolocation state
  const [locationStatus, setLocationStatus] = useState('idle') // 'idle' | 'loading' | 'granted' | 'denied'

  // Tips filter state
  const [tipFilter, setTipFilter] = useState('all')
  const [expandedTip, setExpandedTip] = useState(null)

  // ── Compute worst DOT category for personalized tips ──────────────
  const weight     = Number(ob.weight)    || mockUser.metrics.weight
  const height     = Number(ob.height)    || mockUser.metrics.height
  const systolic   = Number(ob.systolic)  || mockUser.metrics.bloodPressure.systolic
  const diastolic  = Number(ob.diastolic) || mockUser.metrics.bloodPressure.diastolic
  const bloodGlucose = Number(ob.bloodGlucose) || mockUser.metrics.bloodGlucose
  const metrics = { ...mockUser.metrics, weight, height, bloodPressure: { systolic, diastolic }, bloodGlucose }
  const checkInStreak = getCheckInStreak()
  const dotStatus = getDotReadinessStatus(metrics, checkInStreak)
  const worstCategory = dotStatus.breakdown
    ? Object.entries(dotStatus.breakdown)
        .map(([key, { pts, max }]) => ({ key, gap: max - pts }))
        .sort((a, b) => b.gap - a.gap)[0]?.key
    : null

  // ── Geolocation — fires when Find Food tab opens ──────────────────
  useEffect(() => {
    if (activeTab === 'find' && locationStatus === 'idle') {
      setLocationStatus('loading')
      if (!navigator.geolocation) {
        setLocationStatus('denied')
        return
      }
      navigator.geolocation.getCurrentPosition(
        () => setLocationStatus('granted'),
        () => setLocationStatus('denied'),
        { timeout: 6000, maximumAge: 300000 }
      )
    }
  }, [activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Food search results ────────────────────────────────────────────
  const searchResults = searchQuery.length >= 2
    ? FOOD_DB.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10)
    : []

  const addMeal = (meal) => {
    const item = { ...meal, addedAt: Date.now() }
    const next = [...log, item]
    setLog(next)
    saveTodayLog(next)
    setAdded(meal.id)
    setTimeout(() => setAdded(null), 1200)
  }

  const removeItem = (idx) => {
    const next = log.filter((_, i) => i !== idx)
    setLog(next)
    saveTodayLog(next)
  }

  const totals = log.reduce(
    (acc, m) => ({ cal: acc.cal + m.cal, protein: acc.protein + m.protein, carbs: acc.carbs + m.carbs, fat: acc.fat + m.fat, sodium: acc.sodium + m.sodium }),
    { cal: 0, protein: 0, carbs: 0, fat: 0, sodium: 0 }
  )

  // ── Tips: filter then sort so worstCategory tips float to top ─────
  const filteredTips = tipFilter === 'all' ? ALL_TIPS : ALL_TIPS.filter(t => t.category === tipFilter)
  const sortedTips = (worstCategory && tipFilter === 'all')
    ? [...filteredTips].sort((a, b) => {
        if (a.category === worstCategory && b.category !== worstCategory) return -1
        if (b.category === worstCategory && a.category !== worstCategory) return 1
        return 0
      })
    : filteredTips

  const Tab = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
        background: activeTab === id ? '#2563eb' : '#f3f4f6',
        color: activeTab === id ? 'white' : '#374151',
        fontWeight: activeTab === id ? '700' : '400',
        fontSize: '13px',
        borderRadius: '8px',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )

  return (
    <div className="screen">
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>Nutrition</h1>
        <p style={{ color: '#6b7280' }}>Fuel right. Stay DOT-ready.</p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <Tab id="log"  label="Today's Log" />
        <Tab id="find" label="Find Food"   />
        <Tab id="tips" label="DOT Tips"    />
      </div>

      {/* ── TODAY'S LOG ─────────────────────────────────────────────── */}
      {activeTab === 'log' && (
        <>
          {/* Daily summary */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Flame size={20} color="#f97316" />
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Daily Summary</h3>
              <span style={{ marginLeft: 'auto', fontSize: '22px', fontWeight: '700', color: '#2563eb' }}>
                {totals.cal} <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '400' }}>/ {DOT_DAILY_TARGETS.cal} cal</span>
              </span>
            </div>
            <MacroBar label="Protein"  value={totals.protein} target={DOT_DAILY_TARGETS.protein} color="#22c55e" />
            <MacroBar label="Carbs"    value={totals.carbs}   target={DOT_DAILY_TARGETS.carbs}   color="#3b82f6" />
            <MacroBar label="Fat"      value={totals.fat}     target={DOT_DAILY_TARGETS.fat}      color="#f97316" />
            <MacroBar label="Sodium"   value={totals.sodium}  target={DOT_DAILY_TARGETS.sodium}   color="#a855f7" unit="mg" />
            {totals.sodium > DOT_DAILY_TARGETS.sodium && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '10px 12px', background: '#fef2f2', borderRadius: '8px', marginTop: '8px' }}>
                <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ fontSize: '13px', color: '#dc2626' }}>High sodium raises blood pressure — a key DOT disqualifier. Aim to stay under 2,300mg.</p>
              </div>
            )}
          </div>

          {/* Search food */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showSearch ? '14px' : '0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Add Food</h3>
              <button
                onClick={() => { setShowSearch(!showSearch); setSearchQuery(''); setTimeout(() => searchRef.current?.focus(), 50) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px',
                  background: showSearch ? '#f3f4f6' : '#2563eb', color: showSearch ? '#374151' : 'white',
                  border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                }}
              >
                {showSearch ? <><X size={14} /> Close</> : <><Search size={14} /> Search Foods</>}
              </button>
            </div>

            {showSearch && (
              <>
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                  <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search eggs, chicken, chipotle..."
                    style={{
                      width: '100%', padding: '10px 12px 10px 36px', border: '1.5px solid #e5e7eb',
                      borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  {searchQuery.length > 0 && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <p style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'center', padding: '12px 0' }}>No foods found. Try "chicken", "eggs", or "protein".</p>
                )}

                {searchQuery.length < 2 && (
                  <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', padding: '4px 0 8px' }}>Type at least 2 characters to search</p>
                )}

                {searchResults.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto' }}>
                    {searchResults.map(food => (
                      <div key={food.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 12px', background: '#f9fafb', borderRadius: '8px',
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{food.name}</p>
                          <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                            {food.cal} cal · {food.protein}g protein · {food.sodium}mg sodium
                            <span style={{ marginLeft: '6px', padding: '1px 6px', background: '#e5e7eb', borderRadius: '999px', fontSize: '10px', color: '#6b7280' }}>{food.category}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => addMeal(food)}
                          style={{
                            width: '32px', height: '32px', borderRadius: '50%', border: 'none', flexShrink: 0, marginLeft: '10px',
                            background: added === food.id ? '#22c55e' : '#2563eb',
                            color: 'white', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.2s',
                          }}
                        >
                          {added === food.id ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quick add */}
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '14px' }}>Quick Add</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {QUICK_MEALS.map(meal => (
                <div key={meal.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', background: '#f9fafb', borderRadius: '8px',
                }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>{meal.name}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {meal.cal} cal · {meal.protein}g protein · {meal.sodium}mg sodium
                    </p>
                  </div>
                  <button
                    onClick={() => addMeal(meal)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                      background: added === meal.id ? '#22c55e' : '#2563eb',
                      color: 'white', cursor: 'pointer', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s',
                    }}
                  >
                    {added === meal.id ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Today's logged items */}
          {log.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '14px' }}>Logged Today</h3>
              {log.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: idx < log.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>{item.cal} cal · {item.protein}g protein</p>
                  </div>
                  <button
                    onClick={() => removeItem(idx)}
                    style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── FIND FOOD ───────────────────────────────────────────────── */}
      {activeTab === 'find' && (
        <>
          {/* Location status banner */}
          <div className="card" style={{
            background: locationStatus === 'granted' ? '#f0fdf4' : locationStatus === 'denied' ? '#fff7ed' : '#eff6ff',
            border: `1px solid ${locationStatus === 'granted' ? '#bbf7d0' : locationStatus === 'denied' ? '#fed7aa' : '#bfdbfe'}`,
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {locationStatus === 'loading' && (
                <>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #2563eb', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                  <p style={{ fontSize: '13px', color: '#1d4ed8' }}>Getting your location…</p>
                </>
              )}
              {locationStatus === 'granted' && (
                <>
                  <MapPin size={16} color="#15803d" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '13px', color: '#15803d', fontWeight: '500' }}>Using your current location — distances updated</p>
                </>
              )}
              {locationStatus === 'denied' && (
                <>
                  <MapPin size={16} color="#ea580c" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '13px', color: '#ea580c' }}>Location unavailable — showing sample options near common truck routes</p>
                </>
              )}
              {locationStatus === 'idle' && (
                <>
                  <MapPin size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '13px', color: '#1d4ed8' }}>Showing options near your current location. Truck-parking-friendly spots are marked.</p>
                </>
              )}
            </div>
          </div>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          {NEARBY_SPOTS.map(spot => (
            <div key={spot.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '2px' }}>{spot.name}</h3>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{spot.type} · {spot.distance} mi away</p>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {spot.truckParking && (
                    <span style={{ padding: '2px 8px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '999px', fontSize: '11px', fontWeight: '600' }}>🚛 Parking</span>
                  )}
                  {spot.dotFriendly && (
                    <span style={{ padding: '2px 8px', background: '#dcfce7', color: '#15803d', borderRadius: '999px', fontSize: '11px', fontWeight: '600' }}>✓ DOT Friendly</span>
                  )}
                </div>
              </div>
              <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: '8px', marginBottom: '10px' }}>
                <p style={{ fontSize: '13px', color: '#374151' }}>
                  <span style={{ fontWeight: '600' }}>Tip: </span>{spot.tip}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {spot.tags.map(t => (
                  <span key={t} style={{ padding: '3px 10px', background: '#f3f4f6', color: '#6b7280', borderRadius: '999px', fontSize: '12px' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* ── DOT TIPS ────────────────────────────────────────────────── */}
      {activeTab === 'tips' && (
        <>
          {/* Personalized focus banner */}
          {worstCategory && (
            <div className="card" style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb)', color: 'white', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your DOT Focus Area</p>
              <p style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{CATEGORY_LABELS[worstCategory]}</p>
              <p style={{ fontSize: '13px', opacity: 0.85 }}>
                This is your lowest-scoring DOT category. Tips in this area are shown first.
              </p>
            </div>
          )}

          {/* Category filter — horizontal scroll */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
            {TIP_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setTipFilter(f.id)}
                style={{
                  flexShrink: 0, padding: '7px 14px', border: 'none', borderRadius: '999px', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                  background: tipFilter === f.id ? '#2563eb' : '#f3f4f6',
                  color: tipFilter === f.id ? 'white' : '#374151',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Tips list — expandable */}
          {sortedTips.map((tip, i) => {
            const isPersonalized = worstCategory && tip.category === worstCategory && tipFilter === 'all'
            const isExpanded = expandedTip === tip.id
            return (
              <div key={tip.id} className="card" style={isPersonalized ? { border: '1.5px solid #bfdbfe' } : {}}>
                <button
                  onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '28px', flexShrink: 0, lineHeight: 1 }}>{tip.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', flex: 1 }}>{tip.title}</h3>
                        {isPersonalized && (
                          <span style={{ flexShrink: 0, padding: '2px 8px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '999px', fontSize: '10px', fontWeight: '700' }}>FOCUS</span>
                        )}
                        {isExpanded ? <ChevronUp size={16} color="#9ca3af" style={{ flexShrink: 0, marginTop: '2px' }} /> : <ChevronDown size={16} color="#9ca3af" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      </div>
                      {!isExpanded && (
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Tap to read</p>
                      )}
                    </div>
                  </div>
                  {isExpanded && (
                    <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6', marginTop: '12px', paddingLeft: '42px' }}>{tip.body}</p>
                  )}
                </button>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

export default Nutrition
