/**
 * Seed workout catalog
 * Run: node src/db/seed_workouts.js
 */
require('dotenv').config()
const db = require('./index')

const WORKOUTS = [
  {
    title: '5-Min In-Cab Morning Stretch',
    location_type: 'cab',
    duration_minutes: 5,
    difficulty: 'easy',
    body_focus: ['full_body', 'flexibility'],
    dot_goal: 'habits',
    description: 'Start your shift right. Full-body stretch you can do without leaving the cab.',
    instructions: [
      { step: 1, text: 'Seated neck rolls — 5 each direction' },
      { step: 2, text: 'Shoulder cross-body stretch — 20 sec each arm' },
      { step: 3, text: 'Seated torso twist — 5 reps each side' },
      { step: 4, text: 'Ankle circles and calf pumps — 30 seconds' },
      { step: 5, text: 'Hip flexor tilt — press lower back into seat, hold 5 sec, 5 reps' },
    ],
  },
  {
    title: 'Parking Lot Cardio Blast',
    location_type: 'truck_stop',
    duration_minutes: 20,
    difficulty: 'moderate',
    body_focus: ['cardio', 'lower_body'],
    dot_goal: 'bmi',
    description: '20-minute cardio circuit at any truck stop. No equipment needed. Burns 150-200 calories.',
    instructions: [
      { step: 1, text: 'Brisk walk around the lot — 5 min warmup' },
      { step: 2, text: 'Jumping jacks — 3 sets of 30' },
      { step: 3, text: 'High knees — 3 sets of 20 reps' },
      { step: 4, text: 'Walking lunges — 2 lengths of your truck' },
      { step: 5, text: 'Squat holds — 3 sets of 15 reps' },
      { step: 6, text: 'Cool-down walk — 3 min' },
    ],
  },
  {
    title: 'Blood Pressure Cool-Down',
    location_type: 'cab',
    duration_minutes: 10,
    difficulty: 'easy',
    body_focus: ['cardiovascular', 'stress_relief'],
    dot_goal: 'bp',
    description: 'Breathing and movement sequence clinically shown to lower blood pressure by 5-10 points within 10 minutes.',
    instructions: [
      { step: 1, text: '4-7-8 breathing: inhale 4 counts, hold 7, exhale 8. Repeat 4 times.' },
      { step: 2, text: 'Slow neck rolls — 3 each direction, 10 seconds each' },
      { step: 3, text: 'Progressive muscle relaxation: clench fists 5 sec, release. Repeat up the body.' },
      { step: 4, text: 'Diaphragmatic breathing — hands on belly, breathe into hands for 3 min' },
      { step: 5, text: 'Final 4-7-8 cycle — 4 rounds' },
    ],
  },
  {
    title: 'In-Cab Core Activation',
    location_type: 'cab',
    duration_minutes: 10,
    difficulty: 'easy',
    body_focus: ['core', 'back'],
    dot_goal: 'hr',
    description: 'Core work you can do in the driver seat. Reduces back pain and strengthens the muscles that support your spine.',
    instructions: [
      { step: 1, text: 'Seated ab vacuum: exhale fully, draw navel to spine, hold 10 sec. 10 reps.' },
      { step: 2, text: 'Steering wheel push: press hands against wheel isometrically, 5 sec on/off, 10 reps' },
      { step: 3, text: 'Oblique crunches: hands behind head, crunch elbow toward opposite knee, 15 each side' },
      { step: 4, text: 'Lower back press: press lumbar into seat, hold 5 sec, 15 reps' },
      { step: 5, text: 'Seated leg raises: extend one leg straight, hold 5 sec, alternate, 12 each' },
    ],
  },
  {
    title: 'Upper Body Strength (Resistance Band)',
    location_type: 'truck_stop',
    duration_minutes: 25,
    difficulty: 'moderate',
    body_focus: ['upper_body', 'strength'],
    dot_goal: 'hr',
    equipment_required: 'Resistance band (fits in a pocket)',
    description: 'Full upper body workout with a resistance band at any rest stop. Builds the shoulder and back strength drivers lose from long hauls.',
    instructions: [
      { step: 1, text: 'Band pull-aparts — 3 sets of 20 reps' },
      { step: 2, text: 'Banded rows (anchor band to mirror) — 3 sets of 15' },
      { step: 3, text: 'Overhead press — 3 sets of 12' },
      { step: 4, text: 'Bicep curls — 3 sets of 15 each arm' },
      { step: 5, text: 'Tricep pushdowns — 3 sets of 15' },
      { step: 6, text: 'Face pulls — 3 sets of 20' },
    ],
  },
  {
    title: 'Back Pain Relief Sequence',
    location_type: 'truck_stop',
    duration_minutes: 15,
    difficulty: 'easy',
    body_focus: ['back', 'hip_flexors', 'flexibility'],
    dot_goal: 'habits',
    description: "The #1 driver complaint is lower back pain. This 15-minute sequence directly targets the cause: tight hip flexors and weak glutes.",
    instructions: [
      { step: 1, text: 'Hip flexor lunge stretch: front knee 90°, back knee down, hold 45 sec each side' },
      { step: 2, text: "Piriformis stretch (figure-4): cross ankle over knee, sit back, 45 sec each" },
      { step: 3, text: 'Cat-cow on hands and knees — 10 slow reps' },
      { step: 4, text: 'Glute bridges: on back, feet flat, thrust hips up, 3 sets of 15' },
      { step: 5, text: 'Child\'s pose — hold 1 minute' },
      { step: 6, text: 'Supine twist: lie flat, one knee across body, arms out, 45 sec each side' },
    ],
  },
  {
    title: 'Glucose-Busting Walk',
    location_type: 'truck_stop',
    duration_minutes: 12,
    difficulty: 'easy',
    body_focus: ['cardio', 'metabolic'],
    dot_goal: 'glucose',
    description: 'A brisk 10-minute walk after eating reduces blood glucose spikes by 20-30%. Do this at every fuel stop after eating.',
    instructions: [
      { step: 1, text: 'Start walking within 15-30 min of finishing your meal' },
      { step: 2, text: 'Pace should be brisk — you can talk but are slightly breathless' },
      { step: 3, text: 'Walk a loop around the truck stop or along the entrance road' },
      { step: 4, text: 'Maintain pace for 10-12 minutes continuous' },
      { step: 5, text: 'Final 2 min: slow to a relaxed stroll to cool down' },
    ],
  },
  {
    title: '30-Min Gym Full Body',
    location_type: 'gym',
    duration_minutes: 30,
    difficulty: 'moderate',
    body_focus: ['full_body', 'strength', 'cardio'],
    dot_goal: 'bmi',
    description: 'Efficient full-body workout for Pilot/TA/Love\'s gym stops. Covers cardio, strength, and mobility in 30 minutes.',
    instructions: [
      { step: 1, text: '5 min: treadmill warmup at 3.5 mph' },
      { step: 2, text: 'Dumbbell goblet squats — 3 sets of 12' },
      { step: 3, text: 'Cable rows or dumbbell rows — 3 sets of 12' },
      { step: 4, text: 'Dumbbell press (bench or floor) — 3 sets of 12' },
      { step: 5, text: 'Romanian deadlift — 3 sets of 10' },
      { step: 6, text: '10 min: bike or elliptical at moderate pace' },
      { step: 7, text: '3 min: full-body stretch' },
    ],
  },
  {
    title: 'Shoulder & Neck Decompression',
    location_type: 'cab',
    duration_minutes: 8,
    difficulty: 'easy',
    body_focus: ['neck', 'shoulders', 'flexibility'],
    dot_goal: 'habits',
    description: 'Decompress the neck and shoulders that tighten from constant steering and vibration. Do every 3-4 hours.',
    instructions: [
      { step: 1, text: 'Chin tucks: pull chin straight back, hold 5 sec, 10 reps' },
      { step: 2, text: 'Ear-to-shoulder stretch: tilt head slowly, hand applies gentle pressure, 30 sec each side' },
      { step: 3, text: 'Shoulder shrugs: raise to ears, hold 3 sec, release with exhale, 10 reps' },
      { step: 4, text: 'Wall angel in seat: arms in W shape, press into seat back, slide up to Y, 10 reps' },
      { step: 5, text: 'Doorframe chest stretch (at stops): arms in goalpost, lean into doorframe, 45 sec' },
    ],
  },
  {
    title: 'Pre-DOT Physical Cardio Test Prep',
    location_type: 'truck_stop',
    duration_minutes: 20,
    difficulty: 'moderate',
    body_focus: ['cardio', 'endurance'],
    dot_goal: 'bp',
    description: 'Consistent moderate cardio reduces resting heart rate and blood pressure — the two most-failed DOT exam metrics. Run this 3x/week in the weeks before your physical.',
    instructions: [
      { step: 1, text: '3 min brisk walk warmup' },
      { step: 2, text: '12 min: intervals — 1 min brisk walk, 1 min jog or fast walk, alternate' },
      { step: 3, text: 'After intervals: record your perceived exertion (1-10)' },
      { step: 4, text: '3 min easy walk cooldown' },
      { step: 5, text: 'Sit quietly for 2 min, then check your resting HR. Target under 100 bpm.' },
    ],
  },
]

async function seed () {
  console.log('Seeding workouts...')
  let inserted = 0

  for (const w of WORKOUTS) {
    try {
      await db.query(
        `INSERT INTO workouts (title, location_type, duration_minutes, difficulty, body_focus, dot_goal, description, equipment_required, instructions)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT DO NOTHING`,
        [
          w.title,
          w.location_type,
          w.duration_minutes,
          w.difficulty,
          w.body_focus,
          w.dot_goal     || null,
          w.description  || null,
          w.equipment_required || null,
          JSON.stringify(w.instructions),
        ]
      )
      inserted++
      console.log(`  ✓ ${w.title}`)
    } catch (err) {
      console.error(`  ✗ ${w.title}:`, err.message)
    }
  }

  console.log(`\nDone: ${inserted}/${WORKOUTS.length} workouts seeded.`)
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
