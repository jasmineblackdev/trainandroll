import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import {
  Clock, Truck, Dumbbell, Activity, Lock, Filter, Play, Flame,
  Heart, Scale, Wind, ChevronRight, RotateCcw, Check, Zap,
} from "lucide-react";
import { AppShell, Section, SectionTitle, Pill, Card } from "../components/AppShell";
import { mockWorkouts, mockUser, getDotScore, mockHistory, type Workout } from "../lib/mockData";

export const Route = createFileRoute("/workouts")({
  head: () => ({ meta: [{ title: "Train — Train & Roll" }] }),
  component: WorkoutsPage,
});

const spaces = [
  { v: "all", label: "All" },
  { v: "in-truck", label: "In cab" },
  { v: "beside-truck", label: "Beside" },
  { v: "gym", label: "Gym" },
] as const;

const durations = [
  { v: "all", label: "Any" },
  { v: "5", label: "≤ 5" },
  { v: "10", label: "≤ 10" },
  { v: "20", label: "≤ 20" },
  { v: "45", label: "≤ 45" },
] as const;

const focusAreas = [
  { v: "all",            label: "All",      icon: Zap },
  { v: "blood-pressure", label: "BP",       icon: Heart },
  { v: "weight",         label: "Weight",   icon: Scale },
  { v: "mobility",       label: "Mobility", icon: Wind },
] as const;

// Map weakest DOT factor → workout focus
function weakestFocus(): "blood-pressure" | "weight" | "mobility" {
  const b = getDotScore(mockUser.metrics).breakdown;
  const ratios = {
    "blood-pressure": b.bp.pts / b.bp.max,
    "weight":         b.bmi.pts / b.bmi.max,
    "mobility":       b.hr.pts / b.hr.max,
  } as const;
  return (Object.entries(ratios).sort((a, z) => a[1] - z[1])[0][0]) as
    "blood-pressure" | "weight" | "mobility";
}

function WorkoutsPage() {
  const [space, setSpace] = React.useState<string>("all");
  const [dur, setDur] = React.useState<string>("all");
  const [focus, setFocus] = React.useState<string>("all");

  const focusedGoal = weakestFocus();
  const recommended =
    mockWorkouts.find((w) => w.dotGoal === focusedGoal && w.duration <= 15) ?? mockWorkouts[0];
  const lastDone = mockWorkouts[1]; // mock "last session"

  const filtered = mockWorkouts.filter((w) => {
    if (w.id === recommended.id) return false;
    if (space !== "all" && w.space !== space) return false;
    if (dur !== "all" && w.duration > Number(dur)) return false;
    if (focus !== "all" && w.dotGoal !== focus) return false;
    return true;
  });

  // Last 7 days from history
  const week = mockHistory.slice(-7);
  const doneCount = week.filter((d) => d.workoutDone).length;

  const focusLabel =
    focusedGoal === "blood-pressure" ? "Blood Pressure" :
    focusedGoal === "weight"         ? "Weight"         : "Mobility";

  return (
    <AppShell showHeader={false}>
      {/* Dark hero with recommended workout */}
      <div className="bg-asphalt text-white">
        <div className="hazard-stripes h-1.5" />
        <div className="px-5 pt-5 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Today's training</p>
              <h1 className="font-display text-[26px] leading-tight">Let's roll, {mockUser.name.split(" ")[0]}</h1>
            </div>
            <Link to="/progress" className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/70">
              Progress
            </Link>
          </div>

          {/* Recommended hero */}
          <Link to="/workouts/$id" params={{ id: String(recommended.id) }} className="mt-5 block">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-primary to-primary/60 p-5">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
                    <Flame size={11} /> Coach pick · {focusLabel} focus
                  </span>
                  <h2 className="mt-3 font-display text-[22px] leading-tight">{recommended.title}</h2>
                  <p className="mt-1 line-clamp-2 text-[13px] text-white/75">{recommended.description}</p>

                  <div className="mt-4 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest text-white/70">
                    <span className="flex items-center gap-1.5"><Clock size={12} />{recommended.duration} min</span>
                    <span className="flex items-center gap-1.5"><Activity size={12} />{recommended.exercises.length} moves</span>
                    <span className="flex items-center gap-1.5"><Dumbbell size={12} />{recommended.difficulty}</span>
                  </div>
                </div>
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-primary shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]">
                  <Play size={22} className="ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
          </Link>

          {/* Resume / repeat */}
          <Link to="/workouts/$id" params={{ id: String(lastDone.id) }} className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10">
              <RotateCcw size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Repeat last</p>
              <p className="truncate text-[13px] font-semibold">{lastDone.title}</p>
            </div>
            <ChevronRight size={16} className="text-white/50" />
          </Link>
        </div>
      </div>

      {/* Weekly plan strip */}
      <Section>
        <SectionTitle
          kicker="This week"
          title={`${doneCount} of 7 done`}
          action={<Link to="/progress" className="font-mono text-[10px] uppercase tracking-widest text-primary">History →</Link>}
        />
        <Card className="p-3">
          <div className="grid grid-cols-7 gap-1.5">
            {week.map((d, i) => {
              const date = new Date(d.date);
              const isToday = i === week.length - 1;
              return (
                <div key={d.date} className="flex flex-col items-center gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    {date.toLocaleDateString(undefined, { weekday: "narrow" })}
                  </span>
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-lg text-[11px] font-display ${
                      d.workoutDone
                        ? "bg-primary text-primary-foreground"
                        : isToday
                          ? "border-2 border-dashed border-primary text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {d.workoutDone ? <Check size={14} strokeWidth={3} /> : date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </Section>

      {/* Focus area chips */}
      <Section>
        <SectionTitle kicker="Focus" title="What are we training?" />
        <div className="grid grid-cols-4 gap-2">
          {focusAreas.map(({ v, label, icon: Icon }) => {
            const active = focus === v;
            return (
              <button
                key={v}
                onClick={() => setFocus(v)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition ${
                  active ? "border-primary bg-primary/10" : "border-border bg-card"
                }`}
              >
                <span className={`grid h-9 w-9 place-items-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <Icon size={16} />
                </span>
                <span className={`text-[11px] font-semibold ${active ? "text-primary" : ""}`}>{label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Filters */}
      <Section>
        <div className="rounded-2xl bg-card border border-border p-3">
          <div className="flex items-center gap-2 px-1 pb-2">
            <Filter size={12} className="text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Where are you?</span>
          </div>
          <Chips items={spaces} value={space} onChange={setSpace} />
          <div className="mt-3 flex items-center gap-2 px-1 pb-2">
            <Clock size={12} className="text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Time available</span>
          </div>
          <Chips items={durations} value={dur} onChange={setDur} />
        </div>
      </Section>

      {/* Library */}
      <Section>
        <SectionTitle kicker={`${filtered.length} routines`} title="Workout library" />
        <div className="space-y-3">
          {filtered.map((w, i) => (
            <WorkoutCard key={w.id} w={w} locked={i > 4} />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No workouts match those filters yet.
            </div>
          )}
        </div>
      </Section>
    </AppShell>
  );
}

function Chips<T extends string>({ items, value, onChange }: { items: readonly { v: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {items.map((it) => {
        const active = it.v === value;
        return (
          <button
            key={it.v}
            onClick={() => onChange(it.v)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wider transition ${
              active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function WorkoutCard({ w, locked }: { w: Workout; locked: boolean }) {
  const goalColor = w.dotGoal === "blood-pressure" ? "danger" : w.dotGoal === "weight" ? "warning" : "primary";
  const SpaceIcon = w.space === "gym" ? Dumbbell : w.space === "beside-truck" ? Activity : Truck;
  return (
    <Link to="/workouts/$id" params={{ id: String(w.id) }} className="block">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4">
        <div className="absolute right-0 top-0 flex items-baseline gap-1 bg-asphalt px-3 py-1.5 text-white">
          <span className="font-display text-[20px] leading-none num">{w.duration}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">min</span>
        </div>

        <div className="flex items-center gap-2 pr-20">
          <SpaceIcon size={14} className="text-primary" />
          <Pill tone={goalColor as any}>{w.dotGoal.replace("-", " ")}</Pill>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{w.difficulty}</span>
        </div>
        <h3 className="mt-3 font-display text-[18px] leading-tight">{w.title}</h3>
        <p className="mt-1 text-[13px] text-muted-foreground">{w.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{w.exercises.length} moves</span>
          {locked ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
              <Lock size={11} /> Pro
            </span>
          ) : (
            <span className="rounded-full bg-primary px-3 py-1 font-display text-[11px] tracking-widest text-primary-foreground">START →</span>
          )}
        </div>
      </div>
    </Link>
  );
}
