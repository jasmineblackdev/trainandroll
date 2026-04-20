import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity, Heart, Scale, Droplets, Flame, ChevronRight, Calendar,
  Dumbbell, MapPin, ClipboardList, Trophy, Brain,
} from "lucide-react";
import { AppShell, Card, Section, SectionTitle, Pill } from "../components/AppShell";
import { mockUser, mockWorkouts, getDotScore, daysUntil } from "../lib/mockData";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Train & Roll" }] }),
  component: Dashboard,
});

function Dashboard() {
  const score = getDotScore(mockUser.metrics);
  const daysToDOT = daysUntil(mockUser.dotPhysicalDate);

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const tone = score.status === "green" ? "success" : score.status === "yellow" ? "warning" : "danger";
  const ringColor = score.status === "green" ? "var(--success)" : score.status === "yellow" ? "var(--warning)" : "var(--destructive)";
  const progress = (score.score / 100) * 276;

  // Coach pick — routine targeting the user's weakest DOT factor
  const ratios = {
    "blood-pressure": score.breakdown.bp.pts  / score.breakdown.bp.max,
    "weight":         score.breakdown.bmi.pts / score.breakdown.bmi.max,
    "mobility":       score.breakdown.hr.pts  / score.breakdown.hr.max,
  } as const;
  const weakestGoal = (Object.entries(ratios).sort((a, z) => a[1] - z[1])[0][0]) as
    "blood-pressure" | "weight" | "mobility";
  const pickedWorkout =
    mockWorkouts.find((w) => w.dotGoal === weakestGoal && w.duration <= 15) ?? mockWorkouts[0];
  const goalLabel =
    weakestGoal === "blood-pressure" ? "BP Focus" :
    weakestGoal === "weight"         ? "Weight Focus" : "Mobility Focus";
  const goalReason =
    weakestGoal === "blood-pressure" ? "BP is your biggest DOT risk right now." :
    weakestGoal === "weight"         ? "Weight is your biggest DOT risk right now." :
                                        "Mobility is dragging your DOT score.";

  return (
    <AppShell showHeader={false}>
      {/* Custom dark header with score */}
      <div className="bg-asphalt text-white">
        <div className="hazard-stripes h-1.5" />
        <div className="px-5 pt-5 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">{greet()}</p>
              <h1 className="font-display text-[24px] leading-tight">{mockUser.name.split(" ")[0]}</h1>
            </div>
            <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-accent font-display text-asphalt">
              {mockUser.name.split(" ").map(n => n[0]).join("")}
            </Link>
          </div>

          {/* Big readiness ring */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-5">
              <div className="relative grid h-32 w-32 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0">
                  <circle cx="50" cy="50" r="44" stroke="oklch(1 0 0 / 0.1)" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="44" stroke={ringColor} strokeWidth="8" fill="none"
                    strokeLinecap="round" strokeDasharray="276" strokeDashoffset={276 - progress}
                    transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 1s ease" }} />
                </svg>
                <div className="text-center">
                  <p className="font-display text-[40px] leading-none">{score.score}</p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-white/60">DOT score</p>
                </div>
              </div>
              <div>
                <Pill tone={tone}>{score.message}</Pill>
                <p className="mt-2 font-display text-[18px] leading-tight">{daysToDOT} days<br />to next exam</p>
                <p className="mt-1 text-[12px] text-white/50">{new Date(mockUser.dotPhysicalDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's action */}
      <Section>
        <SectionTitle kicker="Today" title="Recommended action" />
        <Link to="/workouts/$id" params={{ id: String(pickedWorkout.id) }} className="block">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Pill tone="primary">{pickedWorkout.duration} MIN · {goalLabel.toUpperCase()}</Pill>
                <p className="mt-2 font-display text-[20px] leading-tight">{pickedWorkout.title}</p>
                <p className="mt-1 text-[13px] text-primary-foreground/80">{goalReason}</p>
              </div>
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/20">
                <ChevronRight />
              </div>
            </div>
          </Card>
        </Link>
      </Section>

      {/* Score breakdown */}
      <Section>
        <SectionTitle kicker="Breakdown" title="Your DOT factors" />
        <Card>
          <div className="space-y-3">
            {Object.entries(score.breakdown).map(([k, b]) => {
              const pct = (b.pts / b.max) * 100;
              const c = pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--destructive)";
              return (
                <div key={k}>
                  <div className="flex justify-between text-[12px]">
                    <span className="font-semibold">{b.label}</span>
                    <span className="font-mono text-muted-foreground">{b.pts}/{b.max}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </Section>

      {/* Quick metrics */}
      <Section>
        <SectionTitle kicker="Vitals" title="Today's snapshot" />
        <div className="grid grid-cols-2 gap-3">
          <MetricTile icon={Heart} label="Blood Pressure" value={`${mockUser.metrics.bloodPressure.systolic}/${mockUser.metrics.bloodPressure.diastolic}`} unit="mmHg" tone="warning" />
          <MetricTile icon={Scale} label="Weight" value={String(mockUser.metrics.weight)} unit="lbs" />
          <MetricTile icon={Droplets} label="Glucose" value={String(mockUser.metrics.bloodGlucose)} unit="mg/dL" />
          <MetricTile icon={Activity} label="Resting HR" value={String(mockUser.metrics.restingHeartRate)} unit="bpm" tone="success" />
        </div>
      </Section>

      {/* Quick actions grid */}
      <Section>
        <SectionTitle kicker="Quick access" title="Jump in" />
        <div className="grid grid-cols-3 gap-3">
          <QuickAction to="/workouts" icon={Dumbbell} label="Workouts" />
          <QuickAction to="/locations" icon={MapPin} label="Find Gym" />
          <QuickAction to="/checkin" icon={ClipboardList} label="Check-in" />
          <QuickAction to="/dot-prep" icon={Calendar} label="DOT Prep" />
          <QuickAction to="/achievements" icon={Trophy} label="Streak" />
          <QuickAction to="/mental-wellness" icon={Brain} label="Mind" />
        </div>
      </Section>

      {/* Streak strip */}
      <Section>
        <Card className="flex items-center gap-4 bg-accent/10">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-white">
            <Flame size={22} />
          </div>
          <div className="flex-1">
            <p className="font-display text-[18px] leading-tight">7-day streak</p>
            <p className="text-[12px] text-muted-foreground">Keep going — habits worth +15 DOT pts.</p>
          </div>
          <Link to="/checkin" className="rounded-full bg-asphalt px-4 py-2 text-xs font-display text-white tracking-widest">
            Check in
          </Link>
        </Card>
      </Section>
    </AppShell>
  );
}

function MetricTile({ icon: Icon, label, value, unit, tone = "default" }: { icon: any; label: string; value: string; unit: string; tone?: "default" | "success" | "warning" | "danger" }) {
  const c = tone === "success" ? "var(--success)" : tone === "warning" ? "var(--warning)" : tone === "danger" ? "var(--destructive)" : "var(--primary)";
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
        <Icon size={14} style={{ color: c }} />
      </div>
      <p className="mt-2 font-display text-[26px] leading-none num">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{unit}</p>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon size={18} />
      </span>
      <span className="text-[12px] font-semibold">{label}</span>
    </Link>
  );
}
