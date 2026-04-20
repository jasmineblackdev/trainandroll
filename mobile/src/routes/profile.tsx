import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Calendar, Edit3, Heart, Scale, Activity, Droplets, ChevronRight, LogOut, Award, Settings as SettingsIcon } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";
import { mockUser, calculateBMI, daysUntil } from "../lib/mockData";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Train & Roll" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const bmi = calculateBMI(mockUser.metrics.weight, mockUser.metrics.height);
  const days = daysUntil(mockUser.dotPhysicalDate);

  return (
    <AppShell showHeader={false}>
      <div className="bg-asphalt text-white">
        <div className="hazard-stripes h-1.5" />
        <div className="px-5 pt-6 pb-10">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-accent font-display text-[24px] text-asphalt">
              {(user?.name || mockUser.name).split(" ").map(s => s[0]).join("")}
            </div>
            <div>
              <h1 className="font-display text-[24px] leading-tight">{user?.name || mockUser.name}</h1>
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/50">{mockUser.cdlNumber}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat n="178" l="day streak" />
            <Stat n={String(days)} l="to DOT" />
            <Stat n="42" l="workouts" />
          </div>
        </div>
      </div>

      <Section>
        <SectionTitle kicker="DOT exam" title="Next certification" />
        <Card className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Calendar size={20} />
          </div>
          <div className="flex-1">
            <p className="font-display text-[18px] leading-tight">{new Date(mockUser.dotPhysicalDate).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p>
            <p className="text-[12px] text-muted-foreground">{days} days remaining · 12 weeks of prep planned</p>
          </div>
          <Link to="/dot-prep" className="grid h-9 w-9 place-items-center rounded-full bg-muted">
            <ChevronRight size={16} />
          </Link>
        </Card>
      </Section>

      <Section>
        <SectionTitle kicker="Health" title="Your metrics" action={
          <button className="flex items-center gap-1 text-[12px] font-semibold text-primary"><Edit3 size={12} /> Edit</button>
        } />
        <Card>
          <Row icon={Heart} label="Blood Pressure" value={`${mockUser.metrics.bloodPressure.systolic}/${mockUser.metrics.bloodPressure.diastolic} mmHg`} />
          <Row icon={Scale} label="Weight" value={`${mockUser.metrics.weight} lbs`} />
          <Row icon={Activity} label="Resting HR" value={`${mockUser.metrics.restingHeartRate} bpm`} />
          <Row icon={Droplets} label="Glucose" value={`${mockUser.metrics.bloodGlucose} mg/dL`} />
          <Row label="BMI" value={String(bmi)} last />
        </Card>
      </Section>

      <Section>
        <div className="space-y-2">
          <LinkRow to="/achievements" icon={Award} label="Achievements" />
          <LinkRow to="/settings" icon={SettingsIcon} label="Settings" />
        </div>
        <button onClick={() => { signOut(); nav({ to: "/" }); }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 font-display text-[12px] tracking-widest text-destructive">
          <LogOut size={14} /> SIGN OUT
        </button>
      </Section>
    </AppShell>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="font-display text-[22px] leading-none num text-accent">{n}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/50">{l}</p>
    </div>
  );
}

function Row({ icon: Icon, label, value, last }: { icon?: any; label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-3 ${last ? "" : "border-b border-border"}`}>
      <div className="flex items-center gap-3">
        {Icon && <Icon size={16} className="text-muted-foreground" />}
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <span className="num text-sm">{value}</span>
    </div>
  );
}

function LinkRow({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <Icon size={18} className="text-primary" />
      <span className="flex-1 text-sm font-semibold">{label}</span>
      <ChevronRight size={16} className="text-muted-foreground" />
    </Link>
  );
}
