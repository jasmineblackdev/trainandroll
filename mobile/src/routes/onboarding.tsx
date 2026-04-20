import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ArrowRight, ArrowLeft, Truck, Check } from "lucide-react";
import { useOnboarding } from "../lib/auth";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Set up — Train & Roll" }] }),
  component: OnboardingPage,
});

const steps = [
  {
    title: "What kind of driver are you?",
    options: ["OTR / Long-haul", "Regional", "Local / Day cab", "Owner-operator"],
  },
  {
    title: "When is your next DOT physical?",
    options: ["Within 30 days", "1–3 months", "3–6 months", "6+ months"],
  },
  {
    title: "Pick your top health goal",
    options: ["Lower blood pressure", "Lose weight", "Improve mobility", "Manage glucose"],
  },
  {
    title: "How much time can you train?",
    options: ["5 min in-cab", "10–20 min beside truck", "30+ min at gym", "Mix of all"],
  },
];

function OnboardingPage() {
  const nav = useNavigate();
  const { complete } = useOnboarding();
  const [step, setStep] = React.useState(0);
  const [picks, setPicks] = React.useState<Record<number, string>>({});

  const total = steps.length;
  const progress = ((step + 1) / total) * 100;

  const choose = (opt: string) => {
    setPicks((p) => ({ ...p, [step]: opt }));
    setTimeout(() => {
      if (step < total - 1) setStep(step + 1);
      else { complete(); nav({ to: "/dashboard" }); }
    }, 200);
  };

  const cur = steps[step];

  return (
    <div className="min-h-screen bg-background">
      <div className="hazard-stripes h-2" />
      <div className="mx-auto max-w-[480px] px-6 pt-6">
        <div className="flex items-center justify-between">
          <button onClick={() => step > 0 && setStep(step - 1)} className="grid h-9 w-9 place-items-center rounded-full bg-muted disabled:opacity-30" disabled={step === 0}>
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-primary" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Step {step + 1} / {total}</span>
          </div>
          <button onClick={() => { complete(); nav({ to: "/dashboard" }); }} className="text-xs font-semibold text-muted-foreground">Skip</button>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>

        <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Profile setup</p>
        <h1 className="mt-2 font-display text-[30px] leading-tight">{cur.title}</h1>

        <div className="mt-6 space-y-2.5">
          {cur.options.map((opt) => {
            const selected = picks[step] === opt;
            return (
              <button
                key={opt}
                onClick={() => choose(opt)}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="text-[15px] font-semibold">{opt}</span>
                <span className={`grid h-7 w-7 place-items-center rounded-full ${selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {selected ? <Check size={14} /> : <ArrowRight size={14} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
