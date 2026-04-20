import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Smile, Meh, Frown, Moon, Droplets, CheckCircle2 } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/checkin")({
  head: () => ({ meta: [{ title: "Daily check-in — Train & Roll" }] }),
  component: CheckIn,
});

function CheckIn() {
  const [mood, setMood] = React.useState(2);
  const [sleep, setSleep] = React.useState(4);
  const [water, setWater] = React.useState(5);
  const [done, setDone] = React.useState(false);

  if (done) {
    return (
      <AppShell title="Daily check-in" subtitle="Logged">
        <Section>
          <Card className="bg-success/10 border-success/30">
            <CheckCircle2 size={32} className="text-success" />
            <p className="mt-3 font-display text-[22px] leading-tight">Check-in saved</p>
            <p className="mt-1 text-sm text-muted-foreground">+1 toward your habits score. See you tomorrow, driver.</p>
          </Card>
        </Section>
      </AppShell>
    );
  }

  return (
    <AppShell title="Daily check-in" subtitle="60 seconds. Big payoff.">
      <Section>
        <SectionTitle kicker="Mood" title="How do you feel today?" />
        <Card>
          <div className="flex items-center justify-around">
            {[
              { v: 0, Icon: Frown, label: "Rough" },
              { v: 1, Icon: Meh, label: "Okay" },
              { v: 2, Icon: Smile, label: "Strong" },
            ].map(({ v, Icon, label }) => (
              <button key={v} onClick={() => setMood(v)} className={`flex flex-col items-center gap-1.5 transition ${mood === v ? "scale-110" : "opacity-50"}`}>
                <Icon size={36} className={mood === v ? "text-primary" : ""} />
                <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
              </button>
            ))}
          </div>
        </Card>
      </Section>

      <Section>
        <SectionTitle kicker="Sleep" title="How well did you sleep?" />
        <Card>
          <div className="flex items-center gap-3">
            <Moon size={18} className="text-primary" />
            <input type="range" min={1} max={5} value={sleep} onChange={(e) => setSleep(Number(e.target.value))}
              className="flex-1 accent-[oklch(0.5_0.2_258)]" />
            <span className="font-display text-[22px] leading-none num w-6 text-right">{sleep}</span>
          </div>
        </Card>
      </Section>

      <Section>
        <SectionTitle kicker="Hydration" title="Glasses of water" />
        <Card>
          <div className="flex items-center gap-3">
            <Droplets size={18} className="text-primary" />
            <input type="range" min={0} max={12} value={water} onChange={(e) => setWater(Number(e.target.value))}
              className="flex-1 accent-[oklch(0.5_0.2_258)]" />
            <span className="font-display text-[22px] leading-none num w-6 text-right">{water}</span>
          </div>
        </Card>
      </Section>

      <Section>
        <button onClick={() => setDone(true)} className="w-full rounded-2xl bg-asphalt py-4 font-display text-white tracking-widest">
          LOG CHECK-IN
        </button>
      </Section>
    </AppShell>
  );
}
