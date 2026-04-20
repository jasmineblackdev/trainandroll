import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { ArrowLeft, Brain, ChevronRight, RotateCcw, ShieldCheck, AlertTriangle, Wind } from "lucide-react";
import { AppShell, Section, Card } from "../components/AppShell";

export const Route = createFileRoute("/mental-wellness/stress-check")({
  head: () => ({ meta: [{ title: "Stress Check — Train & Roll" }] }),
  component: StressPage,
});

const questions = [
  "How rested do you feel right now?",
  "How focused was your driving today?",
  "How tense are your shoulders & jaw?",
  "How well are you handling other drivers?",
  "How confident are you about your next stop / load?",
];

const choices = [
  { v: 0, label: "Wrecked",  tone: "destructive" },
  { v: 1, label: "Off",      tone: "warning" },
  { v: 2, label: "Okay",     tone: "primary" },
  { v: 3, label: "Solid",    tone: "success" },
] as const;

function StressPage() {
  const nav = useNavigate();
  const [idx, setIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<number[]>([]);

  const reset = () => { setIdx(0); setAnswers([]); };
  const choose = (v: number) => {
    const next = [...answers, v];
    setAnswers(next);
    if (idx < questions.length - 1) setIdx(idx + 1);
  };

  if (answers.length === questions.length) {
    const score = answers.reduce((a, b) => a + b, 0);
    const max = questions.length * 3;
    const pct = (score / max) * 100;
    const status =
      pct >= 70 ? { label: "Holding steady",  tone: "success",     icon: ShieldCheck,    msg: "You're managing well. Keep your habits — sleep, hydration, daily reset." } :
      pct >= 40 ? { label: "Pressure building", tone: "warning",   icon: AlertTriangle,  msg: "You're carrying weight. A 5-minute reset and one journal entry tonight will help." } :
                  { label: "Red zone",        tone: "destructive", icon: AlertTriangle,  msg: "Pull over. Take a break. Call someone. Don't push fatigue into a load." };

    return (
      <AppShell showHeader={false}>
        <div className="bg-asphalt text-white">
          <div className="hazard-stripes h-1.5" />
          <div className="px-5 pt-4 pb-10">
            <button onClick={() => nav({ to: "/mental-wellness" })} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
              <ArrowLeft size={16} />
            </button>
            <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Result</p>
            <h1 className="mt-2 text-center font-display text-[28px] leading-tight">{status.label}</h1>
            <div className="mx-auto mt-6 grid h-32 w-32 place-items-center rounded-full bg-white/5">
              <p className="font-display text-[40px] leading-none num">{score}<span className="text-[18px] text-white/50">/{max}</span></p>
            </div>
          </div>
        </div>

        <Section>
          <Card>
            <div className="flex items-start gap-3">
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-${status.tone}/15`} style={{ color: `var(--${status.tone})` }}>
                <status.icon size={20} />
              </div>
              <div>
                <p className="font-display text-[16px] leading-tight">{status.label}</p>
                <p className="mt-1 text-[13px] text-muted-foreground">{status.msg}</p>
              </div>
            </div>
          </Card>
        </Section>

        <Section>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/mental-wellness/breathing" className="flex items-center gap-2 rounded-2xl bg-primary p-4 text-primary-foreground">
              <Wind size={16} /> <span className="font-display tracking-widest">Breathe</span>
            </Link>
            <button onClick={reset} className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4">
              <RotateCcw size={16} /> <span className="font-display tracking-widest">Retake</span>
            </button>
          </div>
        </Section>
      </AppShell>
    );
  }

  const pct = ((idx) / questions.length) * 100;
  return (
    <AppShell showHeader={false}>
      <div className="bg-asphalt text-white">
        <div className="hazard-stripes h-1.5" />
        <div className="px-5 pt-4 pb-6">
          <button onClick={() => nav({ to: "/mental-wellness" })} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
            <ArrowLeft size={16} />
          </button>
          <div className="mt-5 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-white">
              <Brain size={22} />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">2-minute check</p>
              <h1 className="font-display text-[24px] leading-tight">Stress Check</h1>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/50">
            <span>Question {idx + 1} of {questions.length}</span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <Section>
        <Card>
          <p className="font-display text-[20px] leading-tight">{questions[idx]}</p>
          <div className="mt-5 space-y-2">
            {choices.map((c) => (
              <button
                key={c.v}
                onClick={() => choose(c.v)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-background p-4 text-left transition hover:border-primary"
              >
                <span className="text-[14px] font-semibold">{c.label}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </Card>
      </Section>
    </AppShell>
  );
}
