import { createFileRoute } from "@tanstack/react-router";
import { TrendingDown, Activity } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";
import { mockHistory } from "../lib/mockData";

export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [{ title: "Progress — Train & Roll" }] }),
  component: ProgressPage,
});

function ProgressPage() {
  const last30 = mockHistory.slice(-30);
  const weights = last30.map((d) => d.weight);
  const minW = Math.min(...weights), maxW = Math.max(...weights);
  const range = maxW - minW || 1;

  const sysSeries = last30.map((d) => d.systolic);
  const minS = Math.min(...sysSeries), maxS = Math.max(...sysSeries);
  const sR = maxS - minS || 1;

  return (
    <AppShell title="Progress" subtitle="The last 30 days">
      <Section>
        <SectionTitle kicker="Weight" title="Down 3.4 lbs" />
        <Card>
          <div className="flex items-baseline justify-between">
            <p className="font-display text-[32px] leading-none num">{weights[weights.length - 1].toFixed(1)} <span className="text-base font-mono uppercase tracking-widest text-muted-foreground">lbs</span></p>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[oklch(0.45_0.18_145)]">
              <TrendingDown size={11} /> -1.4%
            </span>
          </div>
          <Spark data={weights} min={minW} max={maxW} range={range} color="var(--primary)" />
        </Card>
      </Section>

      <Section>
        <SectionTitle kicker="Blood pressure" title="Trending healthy" />
        <Card>
          <div className="flex items-baseline justify-between">
            <p className="font-display text-[32px] leading-none num">{sysSeries[sysSeries.length - 1]} <span className="text-base font-mono uppercase tracking-widest text-muted-foreground">sys</span></p>
            <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[oklch(0.45_0.17_75)]">
              <Activity size={11} /> Stage 1
            </span>
          </div>
          <Spark data={sysSeries} min={minS} max={maxS} range={sR} color="var(--warning)" />
        </Card>
      </Section>

      <Section>
        <SectionTitle kicker="Workouts" title="22 of 30 days" />
        <Card>
          <div className="grid grid-cols-10 gap-1.5">
            {last30.map((d, i) => (
              <div key={i} className={`h-7 rounded-md ${d.workoutDone ? "bg-success" : "bg-muted"}`} title={d.date} />
            ))}
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Each square = one day · green = trained</p>
        </Card>
      </Section>
    </AppShell>
  );
}

function Spark({ data, min, max, range, color }: { data: number[]; min: number; max: number; range: number; color: string }) {
  const w = 320, h = 90;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${points} ${w},${h}`} fill={color} opacity="0.1" />
    </svg>
  );
}
