import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ArrowLeft, Play, Pause, RotateCcw, Wind } from "lucide-react";

export const Route = createFileRoute("/mental-wellness/breathing")({
  head: () => ({ meta: [{ title: "Box Breathing — Train & Roll" }] }),
  component: BreathingPage,
});

const PHASES = [
  { label: "Inhale",  seconds: 4, scale: 1.6 },
  { label: "Hold",    seconds: 4, scale: 1.6 },
  { label: "Exhale",  seconds: 4, scale: 1.0 },
  { label: "Hold",    seconds: 4, scale: 1.0 },
] as const;

function BreathingPage() {
  const nav = useNavigate();
  const [running, setRunning] = React.useState(false);
  const [phaseIdx, setPhaseIdx] = React.useState(0);
  const [secondsLeft, setSecondsLeft] = React.useState<number>(PHASES[0].seconds);
  const [cycles, setCycles] = React.useState(0);

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        setPhaseIdx((p) => {
          const next = (p + 1) % PHASES.length;
          if (next === 0) setCycles((c) => c + 1);
          setSecondsLeft(PHASES[next].seconds);
          return next;
        });
        return PHASES[(phaseIdx + 1) % PHASES.length].seconds;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, phaseIdx]);

  const phase = PHASES[phaseIdx];
  const reset = () => {
    setRunning(false);
    setPhaseIdx(0);
    setSecondsLeft(PHASES[0].seconds);
    setCycles(0);
  };

  return (
    <div className="min-h-screen bg-asphalt text-white">
      <div className="hazard-stripes h-1.5" />
      <div className="px-5 pt-4 pb-10">
        <button onClick={() => nav({ to: "/mental-wellness" })} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
          <ArrowLeft size={16} />
        </button>

        <div className="mt-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">4-4-4-4 Box Breathing</p>
          <h1 className="mt-2 font-display text-[26px] leading-tight">Reset your nerves</h1>
          <p className="mt-1 text-sm text-white/60">Calms the nervous system. Used by truckers, pilots, and SEALs.</p>
        </div>

        <div className="mt-12 grid place-items-center">
          <div className="relative grid h-72 w-72 place-items-center">
            <div
              className="absolute h-56 w-56 rounded-full bg-primary/20 transition-transform ease-in-out"
              style={{ transform: `scale(${running ? phase.scale : 1})`, transitionDuration: "4000ms" }}
            />
            <div
              className="absolute h-44 w-44 rounded-full bg-primary/40 transition-transform ease-in-out"
              style={{ transform: `scale(${running ? phase.scale : 1})`, transitionDuration: "4000ms" }}
            />
            <div className="relative grid h-32 w-32 place-items-center rounded-full bg-primary text-center">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">{phase.label}</p>
                <p className="font-display text-[44px] leading-none num">{secondsLeft}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button onClick={reset} className="grid h-12 w-12 place-items-center rounded-full bg-white/10">
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => setRunning((r) => !r)}
            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_30px_-8px_var(--accent)]"
          >
            {running ? <Pause size={26} /> : <Play size={26} className="ml-1" fill="currentColor" />}
          </button>
          <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10 font-display text-[16px] num">{cycles}</div>
        </div>

        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-white/40">{cycles} cycles complete</p>

        <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2">
            <Wind size={14} className="text-accent" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">How it works</p>
          </div>
          <p className="mt-2 text-[13px] text-white/75">
            Inhale 4 seconds → hold 4 → exhale 4 → hold 4. Repeat for 5 cycles before a tough call, after a near-miss, or to wind down at a rest stop.
          </p>
        </div>
      </div>
    </div>
  );
}
