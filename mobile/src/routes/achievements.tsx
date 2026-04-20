import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Flame, Award, Medal, Lock, Target, Zap } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/achievements")({
  head: () => ({ meta: [{ title: "Achievements — Train & Roll" }] }),
  component: AchievementsPage,
});

const list = [
  { icon: Flame, title: "7-Day Streak", desc: "A week of check-ins", earned: true },
  { icon: Zap, title: "First Workout", desc: "Welcome to the road", earned: true },
  { icon: Target, title: "BP Crusher", desc: "Drop systolic 5 pts", earned: true },
  { icon: Trophy, title: "30-Day Hero", desc: "30 days in a row", earned: false },
  { icon: Medal, title: "DOT Ready", desc: "Score 90+ for a week", earned: false },
  { icon: Award, title: "Iron Driver", desc: "100 workouts logged", earned: false },
];

function AchievementsPage() {
  const earned = list.filter(l => l.earned).length;
  return (
    <AppShell title="Achievements" subtitle={`${earned} of ${list.length} unlocked`}>
      <Section>
        <Card className="bg-accent/15">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-white">
              <Flame size={26} />
            </div>
            <div>
              <p className="font-display text-[24px] leading-none">7</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">DAY STREAK</p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-display text-[24px] leading-none num">42</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">XP THIS WEEK</p>
            </div>
          </div>
        </Card>
      </Section>

      <Section>
        <SectionTitle kicker="Trophy case" title="Your badges" />
        <div className="grid grid-cols-2 gap-3">
          {list.map((a) => (
            <div key={a.title} className={`relative overflow-hidden rounded-2xl border p-4 ${a.earned ? "border-primary/30 bg-card" : "border-border bg-muted/40"}`}>
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${a.earned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {a.earned ? <a.icon size={22} /> : <Lock size={20} />}
              </div>
              <p className={`mt-3 font-display text-[14px] leading-tight ${a.earned ? "" : "text-muted-foreground"}`}>{a.title}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{a.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </AppShell>
  );
}
