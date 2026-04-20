import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ArrowLeft, Play, Pause, RotateCcw, Wind } from "lucide-react";

export const Route = createFileRoute("/mental-wellness/quick-reset")({
  head: () => ({ meta: [{ title: "Quick Reset — Train & Roll" }] }),
  component: QuickResetPage,
});

const steps = [
  { seconds: 30, title: "Settle in",       cue: "Park. Both hands on the wheel. Eyes soft." },
  { seconds: 30, title: "Body scan",       cue: "Notice your jaw, shoulders, lower back. Let them drop." },
  { seconds: 60, title: "Slow breathing",  cue: "Inhale 4. Exhale 6. Long exhales calm your heart." },
  { seconds: 30, title: "Name one thing",  cue: "Pick one thing you can let go of right now." },
  { seconds: 30, title: "Return",          cue: "Open your eyes. Drink water. Roll out clean." },
];

function QuickResetPage() {
  const nav = useNavigate();
  const [running, setRunning] = React.useState(false);
  const [stepIdx, setStepIdx] = React.useState(0);
  const [elapsedInStep, setElapsedInStep] = React.useState(0);

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setElapsedInStep((e) => {
        const cur = steps[stepIdx];
        if (e + 1 >= cur.seconds) {
          if (stepIdx === steps.length - 1) {
            setRunning(false);
            return cur.seconds;
          }
          setStepIdx((s) => s + 1);
          return 0;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, stepIdx]);

  const cur = steps[stepIdx];
  const totalSec = steps.reduce((a, s) => a + s.seconds, 0);
  const passed = steps.slice(0, stepIdx).reduce((a, s) => a + s.seconds, 0) + elapsedInStep;
  const overallPct = (passed / totalSec) * 100;

  const reset = () => { setRunning(false); setStepIdx(0); setElapsedInStep(0); };
  const remaining = cur.seconds - elapsedInStep;

  return (
    <div className="min-h-screen bg-asphalt text-white">
      <div className="hazard-stripes h-1.5" />
      <div className="px-5 pt-4 pb-10">
        <button onClick={() => nav({ to: "/mental-wellness" })} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
          <ArrowLeft size={16} />
        </button>

        <div className="mt-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">3-minute meditation</p>
          <h1 className="mt-2 font-display text-[26px] leading-tight">Quick Reset</h1>
        </div>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${overallPct}%` }} />
        </div>

        <div className="mt-10 grid place-items-center">
          <div className="relative grid h-64 w-64 place-items-center rounded-full bg-white/5">
            <div className="grid h-48 w-48 place-items-center rounded-full bg-primary/20">
              <div className="grid h-32 w-32 place-items-center rounded-full bg-primary text-center">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">{cur.title}</p>
                  <p className="font-display text-[40px] leading-none num">{remaining}s</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-sm text-center">
          <p className="font-display text-[18px] leading-tight">{cur.cue}</p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button onClick={reset} className="grid h-12 w-12 place-items-center rounded-full bg-white/10">
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => setRunning((r) => !r)}
            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white"
          >
            {running ? <Pause size={26} /> : <Play size={26} className="ml-1" fill="currentColor" />}
          </button>
        </div>

        <div className="mx-auto mt-8 grid max-w-sm grid-cols-5 gap-1.5">
          {steps.map((s, i) => (
            <div key={i} className={`h-1 rounded-full ${i < stepIdx ? "bg-primary" : i === stepIdx ? "bg-accent" : "bg-white/10"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
