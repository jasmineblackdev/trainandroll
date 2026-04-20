import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sunrise, AlertTriangle } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/sleep-health")({
  head: () => ({ meta: [{ title: "Sleep & Fatigue — Train & Roll" }] }),
  component: SleepPage,
});

const week = [6.5, 7, 5.5, 8, 6, 7.5, 7];

function SleepPage() {
  const avg = (week.reduce((a, b) => a + b, 0) / week.length).toFixed(1);
  const max = Math.max(...week);
  return (
    <AppShell title="Sleep & Fatigue" subtitle="Your rest, tracked">
      <Section>
        <Card className="bg-asphalt text-white">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">7-day avg</p>
              <p className="mt-1 font-display text-[44px] leading-none num">{avg}<span className="text-base font-mono uppercase tracking-widest text-white/60"> hrs</span></p>
            </div>
            <Moon size={36} className="text-accent" />
          </div>
          <div className="mt-6 flex items-end justify-between gap-2">
            {week.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-md bg-accent/80" style={{ height: `${(h / max) * 80}px` }} />
                <span className="font-mono text-[9px] uppercase text-white/50">{["M","T","W","T","F","S","S"][i]}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section>
        <SectionTitle kicker="HOS" title="Hours of service" />
        <Card>
          <div className="flex items-center gap-3">
            <Sunrise size={20} className="text-accent" />
            <div className="flex-1">
              <p className="font-display text-[18px] leading-tight">7h 12m driven today</p>
              <p className="text-[12px] text-muted-foreground">3h 48m before mandatory break</p>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-accent" style={{ width: "65%" }} />
          </div>
        </Card>
      </Section>

      <Section>
        <Card className="bg-destructive/10 border-destructive/30">
          <AlertTriangle size={20} className="text-destructive" />
          <p className="mt-2 font-display text-[16px]">Fatigue alert thresholds active</p>
          <p className="mt-1 text-[12px] text-muted-foreground">We'll nudge you if your sleep average drops below 6 hrs for 3 nights.</p>
        </Card>
      </Section>
    </AppShell>
  );
}
