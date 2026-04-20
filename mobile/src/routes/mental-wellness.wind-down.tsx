import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { ArrowLeft, Moon, Check, Coffee, Smartphone, Wind, BookOpen, Headphones } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/mental-wellness/wind-down")({
  head: () => ({ meta: [{ title: "Wind Down — Train & Roll" }] }),
  component: WindDownPage,
});

const routine = [
  { icon: Coffee,     label: "Cut caffeine 6 hrs ago",  detail: "Last cup before 4pm if you sleep at 10." },
  { icon: Smartphone, label: "Phone away in 10 min",    detail: "Blue light blocks melatonin. Charge it across the cab." },
  { icon: Wind,       label: "5 min breathwork",        detail: "Box breathing or quick reset slows your heart rate.", to: "/mental-wellness/breathing" },
  { icon: BookOpen,   label: "Brain dump",              detail: "Journal one prompt — clears the mental backlog.",    to: "/mental-wellness/journal" },
  { icon: Headphones, label: "Calming sound on",        detail: "Pink noise or rain — drown the engine.",             to: "/mental-wellness/sounds" },
];

function WindDownPage() {
  const nav = useNavigate();
  const [done, setDone] = React.useState<Set<number>>(new Set());

  const toggle = (i: number) => setDone((p) => {
    const n = new Set(p);
    if (n.has(i)) n.delete(i); else n.add(i);
    return n;
  });

  const allDone = done.size === routine.length;

  return (
    <AppShell showHeader={false}>
      <div className="bg-asphalt text-white">
        <div className="hazard-stripes h-1.5" />
        <div className="px-5 pt-4 pb-7">
          <button onClick={() => nav({ to: "/mental-wellness" })} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
            <ArrowLeft size={16} />
          </button>
          <div className="mt-5 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Moon size={22} />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Pre-sleep ritual</p>
              <h1 className="font-display text-[24px] leading-tight">Wind Down</h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-white/60">Sleep is your DOT secret weapon. Run this 30-min routine before lights out.</p>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Tonight</p>
              <p className="font-display text-[16px] leading-tight">{done.size} of {routine.length} complete</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 font-display num">{Math.round((done.size / routine.length) * 100)}%</div>
          </div>
        </div>
      </div>

      <Section>
        <SectionTitle kicker="Routine" title="Tap as you go" />
        <div className="space-y-2">
          {routine.map((r, i) => {
            const isDone = done.has(i);
            const Inner = (
              <div className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                isDone ? "border-success/40 bg-success/5" : "border-border bg-card"
              }`}>
                <button
                  onClick={(e) => { e.preventDefault(); toggle(i); }}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                    isDone ? "bg-success text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isDone ? <Check size={18} strokeWidth={3} /> : <r.icon size={18} />}
                </button>
                <div className="flex-1">
                  <p className={`font-display text-[15px] leading-tight ${isDone ? "line-through text-muted-foreground" : ""}`}>{r.label}</p>
                  <p className="mt-1 text-[12.5px] text-muted-foreground">{r.detail}</p>
                </div>
              </div>
            );
            return r.to ? (
              <Link key={i} to={r.to}>{Inner}</Link>
            ) : (
              <button key={i} onClick={() => toggle(i)} className="block w-full text-left">{Inner}</button>
            );
          })}
        </div>
      </Section>

      {allDone && (
        <Section>
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-center">
            <Moon size={28} className="mx-auto" />
            <p className="mt-3 font-display text-[20px] leading-tight">Lights out.</p>
            <p className="mt-1 text-[13px] text-primary-foreground/85">Aim for 7+ hours. Your DOT score thanks you.</p>
          </Card>
        </Section>
      )}
    </AppShell>
  );
}
