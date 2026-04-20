// Train & Roll — Mock data, ported from the original DriveWell mobile app.
// Pure functions only; localStorage helpers are guarded for SSR.

export type Metrics = {
  weight: number; // lbs
  height: number; // inches
  bloodPressure: { systolic: number; diastolic: number };
  waistMeasurement: number;
  restingHeartRate: number;
  bloodGlucose: number;
};

export type User = {
  name: string;
  cdlNumber: string;
  dotPhysicalDate: string;
  metrics: Metrics;
  subscription: "free" | "premium";
};

export const mockUser: User = {
  name: "Jake Miller",
  cdlNumber: "CDL-TX-123456",
  dotPhysicalDate: "2026-09-15",
  metrics: {
    weight: 245,
    height: 70,
    bloodPressure: { systolic: 138, diastolic: 88 },
    waistMeasurement: 42,
    restingHeartRate: 78,
    bloodGlucose: 105,
  },
  subscription: "free",
};

export type Workout = {
  id: number;
  title: string;
  duration: number;
  space: "in-truck" | "beside-truck" | "gym";
  dotGoal: "weight" | "blood-pressure" | "mobility";
  difficulty: "easy" | "moderate" | "hard";
  bodyArea: string;
  description: string;
  exercises: string[];
};

export const mockWorkouts: Workout[] = [
  { id: 1, title: "5-Minute In-Cab Stretch", duration: 5, space: "in-truck", dotGoal: "mobility", difficulty: "easy", bodyArea: "back", description: "Neck, shoulder, and back stretches you can do in your driver's seat.", exercises: ["Neck rolls (30s)", "Shoulder shrugs (30s)", "Seated spinal twist (60s each side)", "Ankle circles (30s each)"] },
  { id: 2, title: "Parking Lot Cardio Blast", duration: 20, space: "beside-truck", dotGoal: "weight", difficulty: "moderate", bodyArea: "cardio", description: "High-intensity bodyweight workout for truck stop parking lots.", exercises: ["Jumping jacks (45s)", "Push-ups (30s)", "Mountain climbers (45s)", "Bodyweight squats (45s)", "Rest (60s) — repeat 3 rounds"] },
  { id: 3, title: "Blood Pressure Reduction Routine", duration: 10, space: "beside-truck", dotGoal: "blood-pressure", difficulty: "easy", bodyArea: "cardio", description: "Gentle exercises proven to help lower blood pressure.", exercises: ["Deep breathing (2 minutes)", "Wall push-ups (2 sets of 10)", "Calf raises (2 sets of 15)", "Walking in place (3 minutes)", "Cool-down stretches (2 minutes)"] },
  { id: 4, title: "Truck Stop Gym Session", duration: 45, space: "gym", dotGoal: "weight", difficulty: "hard", bodyArea: "full-body", description: "Full-body workout for when you have gym access.", exercises: ["Treadmill warm-up (5 min)", "Chest press (3 sets of 12)", "Lat pulldown (3 sets of 12)", "Leg press (3 sets of 15)", "Core circuit (10 min)"] },
  { id: 5, title: "In-Cab Core Activation", duration: 10, space: "in-truck", dotGoal: "mobility", difficulty: "easy", bodyArea: "core", description: "Strengthen your core while parked — no space needed.", exercises: ["Seated abdominal bracing (60s)", "Oblique twists (30s each side)", "Pelvic tilts (2 sets of 15)", "Seated leg raises (2 sets of 10)", "Deep breathing cool-down (60s)"] },
  { id: 6, title: "Leg Day Beside the Rig", duration: 15, space: "beside-truck", dotGoal: "weight", difficulty: "moderate", bodyArea: "legs", description: "Build leg strength using your truck for balance support.", exercises: ["Bodyweight squats (3 sets of 15)", "Reverse lunges (3 sets of 10 each)", "Calf raises on step (3 sets of 20)", "Glute bridges on ground (3 sets of 15)", "Cool-down quad stretch (60s each)"] },
  { id: 7, title: "Upper Body Pump", duration: 20, space: "beside-truck", dotGoal: "weight", difficulty: "moderate", bodyArea: "back", description: "Chest, back, and shoulder workout using the truck and bodyweight.", exercises: ["Push-ups — standard (3 sets of 12)", "Incline push-ups on bumper (3 sets of 15)", "Truck door rows (3 sets of 12 each)", "Pike push-ups (2 sets of 10)", "Shoulder taps plank (45s)"] },
  { id: 8, title: "Gym Cardio & Core", duration: 30, space: "gym", dotGoal: "blood-pressure", difficulty: "moderate", bodyArea: "core", description: "Steady-state cardio plus core conditioning for BP management.", exercises: ["Elliptical or bike (15 min, moderate pace)", "Plank holds (3 × 45s)", "Dead bugs (3 sets of 10)", "Bicycle crunches (3 sets of 20)", "Seated row machine (3 sets of 12)"] },
  { id: 9, title: "Full Body Stretch & Recovery", duration: 10, space: "in-truck", dotGoal: "mobility", difficulty: "easy", bodyArea: "full-body", description: "Post-drive recovery routine for sore muscles and stiffness.", exercises: ["Seated hamstring stretch (60s each)", "Hip flexor stretch (60s each)", "Chest opener stretch (30s)", "Upper back rounds (30s x 3)", "Deep breathing & mindfulness (2 min)"] },
  { id: 10, title: "Glucose-Busting Walk", duration: 20, space: "beside-truck", dotGoal: "blood-pressure", difficulty: "easy", bodyArea: "cardio", description: "A brisk walk after meals helps manage blood glucose levels.", exercises: ["Warm-up walk (2 min easy)", "Brisk walk (15 min, conversational pace)", "Arm swings while walking (throughout)", "Cool-down walk (2 min easy)", "Standing calf raises (1 min)"] },
];

export type Location = {
  id: number;
  name: string;
  type: "gym" | "dot-center" | "truck-stop";
  distance: number;
  address: string;
  amenities: string[];
  notes?: string;
  truckParkingNotes?: string;
  hours?: string;
};

export const mockLocations: Location[] = [
  { id: 1, name: "TA Travel Center — Austin", type: "truck-stop", distance: 0.2, address: "8028 US-290, Austin, TX 78724", amenities: ["Showers", "Parking", "Food", "WiFi"], notes: "Large truck parking area, well-lit" },
  { id: 2, name: "Planet Fitness — Cedar Park", type: "gym", distance: 0.8, address: "1890 Ranch Shopping Center, Cedar Park, TX", amenities: ["24/7 Access", "Day Pass: $15", "Showers"], notes: "Walk from truck stop parking. No overnight truck parking on-site.", truckParkingNotes: "Park at HEB across street, 5min walk" },
  { id: 3, name: "DOT Physical — Dr. Martinez", type: "dot-center", distance: 2.1, address: "3401 Esperanza Crossing, Austin, TX 78758", amenities: ["CDL Physical", "Same-day results", "Drug testing"], notes: "Accepts walk-ins, truck-friendly location.", hours: "Mon–Fri 7AM–6PM, Sat 8AM–2PM" },
  { id: 4, name: "Anytime Fitness — Round Rock", type: "gym", distance: 1.5, address: "2120 N Mays St, Round Rock, TX 78664", amenities: ["24/7 Access", "Day Pass: $20", "Personal Training"], notes: "Truck parking available in back lot.", truckParkingNotes: "Large vehicles welcome in rear parking" },
];

export const calculateBMI = (lbs: number, inches: number) =>
  inches > 0 ? Math.round(((lbs / (inches * inches)) * 703) * 10) / 10 : 0;

export type DotStatus = "green" | "yellow" | "red";

export type DotScore = {
  score: number;
  status: DotStatus;
  message: string;
  breakdown: Record<string, { pts: number; max: number; label: string }>;
};

export const getDotScore = (m: Metrics): DotScore => {
  const { weight, height, bloodPressure, restingHeartRate, bloodGlucose } = m;
  const { systolic, diastolic } = bloodPressure;

  let bpPts = 0;
  if (diastolic >= 100) bpPts = 0;
  else if (systolic < 140) bpPts = 30;
  else if (systolic <= 159) bpPts = 15;

  let bmiPts = 0;
  const bmi = calculateBMI(weight, height);
  if (bmi < 30) bmiPts = 20;
  else if (bmi < 35) bmiPts = 10;

  let hrPts = 0;
  const hr = restingHeartRate || 75;
  if (hr >= 60 && hr <= 100) hrPts = 15;
  else if (hr > 100) hrPts = 8;

  let gluPts = 0;
  if (bloodGlucose < 100) gluPts = 20;
  else if (bloodGlucose < 126) gluPts = 10;

  const habitsPts = 8; // baseline assumed habits

  const score = bpPts + bmiPts + hrPts + gluPts + habitsPts;
  let status: DotStatus = "red";
  let message = "High Risk";
  if (score >= 90) { status = "green"; message = "DOT Ready"; }
  else if (score >= 70) { status = "yellow"; message = "At Risk"; }

  return {
    score, status, message,
    breakdown: {
      bp:      { pts: bpPts,  max: 30, label: "Blood Pressure" },
      bmi:     { pts: bmiPts, max: 20, label: "BMI" },
      hr:      { pts: hrPts,  max: 15, label: "Heart Rate" },
      glucose: { pts: gluPts, max: 20, label: "Glucose" },
      habits:  { pts: habitsPts, max: 15, label: "Habits & Sleep" },
    },
  };
};

export const daysUntil = (iso: string) =>
  Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));

// History (90 days mock)
export const mockHistory = (() => {
  const days = 90;
  const out: { date: string; weight: number; systolic: number; diastolic: number; glucose: number; workoutDone: boolean }[] = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const p = (days - i) / days;
    // deterministic pseudo-random so SSR matches client
    const r = Math.sin(i * 12.9898) * 43758.5453;
    const rand = r - Math.floor(r);
    out.push({
      date: d.toISOString().split("T")[0],
      weight: Math.round((248 - p * 3 + (rand - 0.5) * 1.5) * 10) / 10,
      systolic: Math.round(142 - p * 4 + (rand - 0.5) * 3),
      diastolic: Math.round(92 - p * 4 + (rand - 0.5) * 2),
      glucose: Math.round(112 - p * 7 + (rand - 0.5) * 5),
      workoutDone: rand > 0.45,
    });
  }
  return out;
})();
