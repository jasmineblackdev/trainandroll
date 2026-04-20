import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ArrowLeft, Smile, Frown, Meh, Angry, Heart } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/mental-wellness/mood")({
  head: () => ({ meta: [{ title: "Mood Log — Train & Roll" }] }),
  component: MoodPage,
});

const moods = [
  { v: 5, label: "Great",   icon: Heart,  color: "var(--success)" },
  { v: 4, label: "Good",    icon: Smile,  color: "var(--success)" },
  { v: 3, label: "Okay",    icon: Meh,    color: "var(--accent)" },
  { v: 2, label: "Low",     icon: Frown,  color: "var(--warning)" },
  { v: 1, label: "Bad",     icon: Angry,  color: "var(--destructive)" },
] as const;

const seedHistory = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  const r = Math.sin(i * 7.13) * 1000;
  const v = 2 + Math.round(((r - Math.floor(r)) * 3));
  return { date: d, v };
});

function MoodPage() {
  const nav = useNavigate();
  const [pick, setPick] = React.useState<number | null>(null);
  const [tags, setTags] = React.useState<string[]>([]);
  const [history, setHistory] = React.useState(seedHistory);
  const [saved, setSaved] = React.useState(false);

  const tagOptions = ["Tired", "Lonely", "Wired", "Hungry", "Pain", "Proud", "Stressed", "Calm"];

  const log = () => {
    if (pick === null) return;
    setHistory((p) => [...p.slice(1), { date: new Date(), v: pick }]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setPick(null); setTags([]); }, 1200);
  };

  const avg = history.reduce((a, h) => a + h.v, 0) / history.length;

  return (
    <AppShell showHeader={false}>
      <div className="bg-asphalt text-white">
        <div className="hazard-stripes h-1.5" />
        <div className="px-5 pt-4 pb-6">
          <button onClick={() => nav({ to: "/mental-wellness" })} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
            <ArrowLeft size={16} />
          </button>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Daily check-in</p>
              <h1 className="font-display text-[24px] leading-tight">Mood Log</h1>
            </div>
            <div className="text-right">
              <p className="font-display text-[28px] leading-none num">{avg.toFixed(1)}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">14-day avg</p>
            </div>
          </div>
        </div>
      </div>

      <Section>
        <SectionTitle kicker="Right now" title="How are you feeling?" />
        <Card>
          <div className="flex justify-between gap-2">
            {moods.map((m) => {
              const active = pick === m.v;
              return (
                <button
                  key={m.v}
                  onClick={() => setPick(m.v)}
                  className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border p-3 transition ${
                    active ? "border-primary bg-primary/10 scale-105" : "border-border"
                  }`}
                >
                  <m.icon size={26} style={{ color: active ? m.color : "var(--muted-foreground)" }} />
                  <span className={`text-[11px] font-semibold ${active ? "" : "text-muted-foreground"}`}>{m.label}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">What's driving it?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tagOptions.map((t) => {
              const on = tags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => setTags((p) => on ? p.filter((x) => x !== t) : [...p, t])}
                  className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
                    on ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <button
            onClick={log}
            disabled={pick === null}
            className="mt-5 w-full rounded-xl bg-primary py-3 font-display text-primary-foreground tracking-widest disabled:opacity-50"
          >
            {saved ? "LOGGED ✓" : "LOG MOOD"}
          </button>
        </Card>
      </Section>

      <Section>
        <SectionTitle kicker="Trend" title="Last 14 days" />
        <Card>
          <div className="flex items-end justify-between gap-1.5 h-32">
            {history.map((h, i) => {
              const heightPct = (h.v / 5) * 100;
              const c = h.v >= 4 ? "var(--success)" : h.v >= 3 ? "var(--accent)" : h.v >= 2 ? "var(--warning)" : "var(--destructive)";
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex h-full w-full items-end">
                    <div className="w-full rounded-t" style={{ height: `${heightPct}%`, background: c }} />
                  </div>
                  <span className="font-mono text-[8px] text-muted-foreground">{h.date.getDate()}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </Section>
    </AppShell>
  );
}
