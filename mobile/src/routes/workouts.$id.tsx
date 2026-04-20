import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import {
  ArrowLeft, Play, Pause, RotateCcw, CheckCircle2, Clock, Flame,
  Truck, Dumbbell, Activity, Heart, Scale, Wind, ChevronRight,
  ListChecks, Info, ShieldCheck, MapPin, X, SkipForward,
} from "lucide-react";
import { mockWorkouts, type Workout } from "../lib/mockData";

export const Route = createFileRoute("/workouts/$id")({
  head: () => ({ meta: [{ title: "Workout — Train & Roll" }] }),
  component: WorkoutDetail,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-asphalt text-white">
      <p>Workout not found</p>
    </div>
  ),
});

/* ─────────── per-goal context (the "why" for each card) ─────────── */
const goalContext: Record<Workout["dotGoal"], {
  label: string;
  caloriesPerMin: number;
  icon: any;
  tone: string;       // tailwind class for accent
  why: string;        // why this routine helps DOT
  targets: string[];  // what it improves
}> = {
  "blood-pressure": {
    label: "Blood Pressure",
    caloriesPerMin: 4,
    icon: Heart,
    tone: "text-destructive",
    why: "FMCSA requires systolic ≤ 140 and diastolic ≤ 90. Low-intensity cardio plus breathwork can drop systolic 4–9 mmHg in weeks.",
    targets: ["Lower systolic BP", "Calm resting heart rate", "Reduce stress hormones"],
  },
  "weight": {
    label: "Weight & BMI",
    caloriesPerMin: 8,
    icon: Scale,
    tone: "text-primary",
    why: "BMI ≥ 35 puts you on a 1-year DOT card or risk of disqualification. Mixed cardio + strength burns fat and protects muscle.",
    targets: ["Burn fat", "Build lean mass", "Lower BMI toward 30"],
  },
  "mobility": {
    label: "Mobility & Recovery",
    caloriesPerMin: 3,
    icon: Wind,
    tone: "text-success",
    why: "Long hauls compress your spine and tighten hips. Daily mobility work prevents the back/neck pain that pulls drivers off the road.",
    targets: ["Reduce stiffness", "Loosen hips & spine", "Prevent injury"],
  },
};

const spaceMeta: Record<Workout["space"], { icon: any; label: string; gear: string[] }> = {
  "in-truck":     { icon: Truck,    label: "In your cab",     gear: ["Driver's seat", "Steering wheel for support"] },
  "beside-truck": { icon: Activity, label: "Beside your rig", gear: ["Flat ground", "Truck for balance / step"] },
  "gym":          { icon: Dumbbell, label: "Truck-stop gym",  gear: ["Treadmill or bike", "Free weights or machines"] },
};

/* parse "Push-ups (30s)" or "Squats (3 sets of 12)" → { name, detail } */
function parseExercise(raw: string): { name: string; detail?: string } {
  const m = raw.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (!m) return { name: raw };
  return { name: m[1].trim(), detail: m[2].trim() };
}

type Phase = "preview" | "active" | "complete";

function WorkoutDetail() {
  const { id } = useParams({ from: "/workouts/$id" });
  const nav = useNavigate();
  const w = mockWorkouts.find((x) => String(x.id) === id);

  const [phase, setPhase] = React.useState<Phase>("preview");
  const [seconds, setSeconds] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [done, setDone] = React.useState<Set<number>>(new Set());
  const [currentIdx, setCurrentIdx] = React.useState(0);

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  if (!w) return null;

  const ctx = goalContext[w.dotGoal];
  const space = spaceMeta[w.space];
  const exercises = w.exercises.map(parseExercise);
  const calories = Math.round(w.duration * ctx.caloriesPerMin);

  if (phase === "preview") {
    return (
      <PreviewScreen
        w={w}
        ctx={ctx}
        space={space}
        exercises={exercises}
        calories={calories}
        onBack={() => nav({ to: "/workouts" })}
        onStart={() => { setPhase("active"); setRunning(true); }}
      />
    );
  }

  if (phase === "complete") {
    return (
      <CompleteScreen
        w={w}
        ctx={ctx}
        seconds={seconds}
        completedCount={done.size}
        totalCount={exercises.length}
      />
    );
  }

  return (
    <ActiveScreen
      w={w}
      ctx={ctx}
      exercises={exercises}
      seconds={seconds}
      running={running}
      currentIdx={currentIdx}
      done={done}
      onTogglePlay={() => setRunning((r) => !r)}
      onReset={() => { setSeconds(0); setRunning(false); }}
      onExit={() => nav({ to: "/workouts" })}
      onPrev={() => setCurrentIdx((i) => Math.max(0, i - 1))}
      onNext={() => {
        setDone((p) => new Set(p).add(currentIdx));
        if (currentIdx === exercises.length - 1) {
          setRunning(false);
          setPhase("complete");
        } else {
          setCurrentIdx((i) => i + 1);
        }
      }}
      onJump={(i) => setCurrentIdx(i)}
    />
  );
}

/* ─────────────────────── PREVIEW (Start page) ─────────────────────── */
function PreviewScreen({
  w, ctx, space, exercises, calories, onBack, onStart,
}: {
  w: Workout;
  ctx: typeof goalContext[Workout["dotGoal"]];
  space: typeof spaceMeta[Workout["space"]];
  exercises: { name: string; detail?: string }[];
  calories: number;
  onBack: () => void;
  onStart: () => void;
}) {
  const SpaceIcon = space.icon;
  const GoalIcon = ctx.icon;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero */}
      <div className="relative overflow-hidden bg-asphalt text-white">
        <div className="hazard-stripes h-1.5" />
        <div className="absolute -right-16 -top-10 h-56 w-56 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative px-5 pt-4 pb-7">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
              <ArrowLeft size={16} />
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest">
              <SpaceIcon size={11} /> {space.label}
            </span>
          </div>

          <div className="mt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
              <GoalIcon size={11} /> {ctx.label} focus
            </span>
            <h1 className="mt-3 font-display text-[30px] leading-[1.05]">{w.title}</h1>
            <p className="mt-2 text-[14px] text-white/70">{w.description}</p>
          </div>

          {/* stat strip */}
          <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
            <Stat icon={Clock}      value={`${w.duration}`} unit="min"      />
            <Stat icon={ListChecks} value={`${exercises.length}`} unit="moves" />
            <Stat icon={Flame}      value={`${calories}`}   unit="kcal"     />
          </div>
        </div>
      </div>

      {/* Why this helps */}
      <div className="mx-auto max-w-[480px] px-5 pt-5">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">Why this helps your DOT</p>
          </div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-foreground/80">{ctx.why}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ctx.targets.map((t) => (
              <span key={t} className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Gear / setup */}
      <div className="mx-auto max-w-[480px] px-5 pt-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <SpaceIcon size={14} className="text-primary" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">What you need</p>
          </div>
          <ul className="mt-2 space-y-1.5">
            {space.gear.map((g) => (
              <li key={g} className="flex items-center gap-2 text-[13.5px]">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {g}
              </li>
            ))}
          </ul>
          {w.space === "gym" && (
            <Link to="/locations" className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
              <MapPin size={12} /> Find a truck-friendly gym
            </Link>
          )}
        </div>
      </div>

      {/* Exercise preview */}
      <div className="mx-auto max-w-[480px] px-5 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">The plan</p>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{exercises.length} steps</span>
        </div>
        <ol className="space-y-2">
          {exercises.map((ex, i) => (
            <li key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted font-display text-[14px]">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold">{ex.name}</p>
                {ex.detail && (
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{ex.detail}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Sticky Start CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[480px] items-center gap-3 px-5 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
          <div className="flex-1">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Ready to roll</p>
            <p className="font-display text-[16px] leading-tight">{w.duration} min · {w.difficulty}</p>
          </div>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-display text-primary-foreground shadow-[0_10px_30px_-10px_var(--primary)]"
          >
            <Play size={18} fill="currentColor" />
            <span className="tracking-widest">START</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── ACTIVE session ─────────────────────── */
function ActiveScreen({
  w, ctx, exercises, seconds, running, currentIdx, done,
  onTogglePlay, onReset, onExit, onPrev, onNext, onJump,
}: {
  w: Workout;
  ctx: typeof goalContext[Workout["dotGoal"]];
  exercises: { name: string; detail?: string }[];
  seconds: number;
  running: boolean;
  currentIdx: number;
  done: Set<number>;
  onTogglePlay: () => void;
  onReset: () => void;
  onExit: () => void;
  onPrev: () => void;
  onNext: () => void;
  onJump: (i: number) => void;
}) {
  const totalSec = w.duration * 60;
  const pct = Math.min(100, (seconds / totalSec) * 100);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const current = exercises[currentIdx];
  const next = exercises[currentIdx + 1];

  return (
    <div className="min-h-screen bg-asphalt text-white pb-28">
      <div className="hazard-stripes h-1.5" />
      <div className="px-5 pt-4 pb-6">
        <div className="flex items-center justify-between">
          <button onClick={onExit} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
            <X size={16} />
          </button>
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">{w.title}</span>
          <span className="w-9" />
        </div>

        {/* Timer ring */}
        <div className="mt-6 grid place-items-center">
          <div className="relative grid h-56 w-56 place-items-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
              <circle cx="50" cy="50" r="44" stroke="oklch(1 0 0 / 0.1)" strokeWidth="6" fill="none" />
              <circle cx="50" cy="50" r="44" stroke="var(--primary)" strokeWidth="6" fill="none"
                strokeLinecap="round" strokeDasharray="276" strokeDashoffset={276 - (276 * pct) / 100}
                style={{ transition: "stroke-dashoffset 0.5s linear" }} />
            </svg>
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Step {currentIdx + 1} / {exercises.length}</p>
              <p className="mt-1 font-display text-[44px] leading-none num">{mm}:{ss}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/50">/ {w.duration}:00</p>
            </div>
          </div>
        </div>

        {/* Current exercise card */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Now</p>
          <p className="mt-1 font-display text-[24px] leading-tight">{current.name}</p>
          {current.detail && (
            <p className="mt-1 font-mono text-[12px] uppercase tracking-widest text-white/70">{current.detail}</p>
          )}
          {next && (
            <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
              <ChevronRight size={14} className="text-white/40" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Next: {next.name}{next.detail ? ` · ${next.detail}` : ""}</p>
            </div>
          )}
        </div>

        {/* Transport */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={onReset} className="grid h-12 w-12 place-items-center rounded-full bg-white/10">
            <RotateCcw size={18} />
          </button>
          <button
            onClick={onTogglePlay}
            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-8px_var(--primary)]"
          >
            {running ? <Pause size={26} /> : <Play size={26} className="ml-1" fill="currentColor" />}
          </button>
          <button onClick={onNext} className="grid h-12 w-12 place-items-center rounded-full bg-accent text-white">
            <SkipForward size={18} />
          </button>
        </div>

        {/* Step list */}
        <div className="mt-7">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">All steps · {done.size} done</p>
          <ol className="mt-2 space-y-1.5">
            {exercises.map((ex, i) => {
              const isDone = done.has(i);
              const isCurrent = i === currentIdx;
              return (
                <li key={i}>
                  <button
                    onClick={() => onJump(i)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left ${
                      isCurrent
                        ? "border-primary bg-primary/15"
                        : isDone
                          ? "border-white/10 bg-white/5 opacity-60"
                          : "border-white/10 bg-white/5"
                    }`}
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-md font-display text-[12px] ${
                      isDone ? "bg-success text-white" : isCurrent ? "bg-primary text-primary-foreground" : "bg-white/10"
                    }`}>
                      {isDone ? <CheckCircle2 size={14} /> : i + 1}
                    </span>
                    <span className={`flex-1 truncate text-[13px] font-semibold ${isDone ? "line-through" : ""}`}>{ex.name}</span>
                    {ex.detail && <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">{ex.detail}</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── COMPLETE ─────────────────────── */
function CompleteScreen({
  w, ctx, seconds, completedCount, totalCount,
}: {
  w: Workout;
  ctx: typeof goalContext[Workout["dotGoal"]];
  seconds: number;
  completedCount: number;
  totalCount: number;
}) {
  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");
  const calories = Math.round((seconds / 60) * ctx.caloriesPerMin);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-asphalt text-white">
        <div className="hazard-stripes h-1.5" />
        <div className="px-5 pt-10 pb-10 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success text-white shadow-[0_10px_40px_-8px_var(--success)]">
            <CheckCircle2 size={40} />
          </div>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Workout complete</p>
          <h1 className="mt-2 font-display text-[28px] leading-tight">Great drive.</h1>
          <p className="mt-1 text-sm text-white/60">{w.title}</p>
        </div>
      </div>

      <div className="mx-auto max-w-[480px] px-5 pt-5 pb-10">
        <div className="grid grid-cols-3 gap-3">
          <ResultStat label="Time" value={`${mm}:${ss}`} />
          <ResultStat label="Moves" value={`${completedCount}/${totalCount}`} />
          <ResultStat label="kcal" value={`${calories}`} />
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">DOT impact</p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed">
            +5 pts toward <span className="font-semibold">{ctx.label}</span>. Keep the streak — daily reps move your readiness score the most.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link to="/checkin" className="rounded-xl bg-asphalt px-4 py-3 text-center font-display text-white tracking-widest">
            Log a check-in
          </Link>
          <Link to="/workouts" className="rounded-xl bg-primary px-4 py-3 text-center font-display text-primary-foreground tracking-widest">
            More routines
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── tiny atoms ─────────────────────── */
function Stat({ icon: Icon, value, unit }: { icon: any; value: string; unit: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl bg-white/5 py-2.5">
      <Icon size={14} className="text-accent" />
      <p className="font-display text-[20px] leading-none num">{value}</p>
      <p className="font-mono text-[9px] uppercase tracking-widest text-white/60">{unit}</p>
    </div>
  );
}
function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center">
      <p className="font-display text-[24px] leading-none num">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
