import { createFileRoute } from "@tanstack/react-router";
import { BellRing, Calendar } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";
import { mockUser, daysUntil } from "../lib/mockData";

export const Route = createFileRoute("/dot-reminders")({
  head: () => ({ meta: [{ title: "DOT reminders — Train & Roll" }] }),
  component: DotRemindersPage,
});

function DotRemindersPage() {
  const days = daysUntil(mockUser.dotPhysicalDate);
  const milestones = [
    { d: 90, label: "90-day prep starts", done: days < 90 },
    { d: 60, label: "Schedule appointment", done: days < 60 },
    { d: 30, label: "Final BP check", done: days < 30 },
    { d: 7, label: "Exam week reminder", done: days < 7 },
    { d: 0, label: "Exam day", done: days === 0 },
  ];
  return (
    <AppShell title="DOT Reminders" subtitle="We'll keep you on schedule">
      <Section>
        <Card className="bg-asphalt text-white">
          <BellRing size={26} className="text-accent" />
          <p className="mt-3 font-display text-[28px] leading-none num">{days}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/60">days until exam</p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-accent" />
            {new Date(mockUser.dotPhysicalDate).toLocaleDateString(undefined, { dateStyle: "full" })}
          </div>
        </Card>
      </Section>
      <Section>
        <SectionTitle kicker="Milestones" title="Reminder schedule" />
        <ol className="relative space-y-3 border-l-2 border-border pl-5">
          {milestones.map((m) => (
            <li key={m.d} className="relative">
              <span className={`absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 ${m.done ? "border-success bg-success" : "border-primary bg-background"}`} />
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">T-minus {m.d} days</p>
                <p className="font-display text-[15px] leading-tight">{m.label}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </AppShell>
  );
}
