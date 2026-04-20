import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ArrowLeft, Play, Pause, Headphones, Cloud, Waves, Flame, TreePine, Coffee, Moon } from "lucide-react";
import { AppShell, Section } from "../components/AppShell";

export const Route = createFileRoute("/mental-wellness/sounds")({
  head: () => ({ meta: [{ title: "Calming Sounds — Train & Roll" }] }),
  component: SoundsPage,
});

const tracks = [
  { id: 1, icon: Cloud,   name: "Highway Rain",      desc: "Steady rain on a windshield",  duration: "30 min", tone: "primary" },
  { id: 2, icon: Waves,   name: "Coastal Waves",     desc: "Pacific shoreline at dusk",    duration: "45 min", tone: "primary" },
  { id: 3, icon: Flame,   name: "Cab Fireplace",     desc: "Crackling fire, low wind",     duration: "60 min", tone: "warning" },
  { id: 4, icon: TreePine, name: "Forest at Night",  desc: "Crickets, gentle breeze",      duration: "30 min", tone: "success" },
  { id: 5, icon: Coffee,  name: "Truck-stop Diner",  desc: "Soft chatter, clinking cups",  duration: "45 min", tone: "warning" },
  { id: 6, icon: Moon,    name: "Pink Noise",        desc: "Deeper than white noise",      duration: "8 hr",   tone: "primary" },
];

function SoundsPage() {
  const nav = useNavigate();
  const [playing, setPlaying] = React.useState<number | null>(null);

  return (
    <AppShell showHeader={false}>
      <div className="bg-asphalt text-white">
        <div className="hazard-stripes h-1.5" />
        <div className="px-5 pt-4 pb-6">
          <button onClick={() => nav({ to: "/mental-wellness" })} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
            <ArrowLeft size={16} />
          </button>
          <div className="mt-5 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Headphones size={22} />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Audio library</p>
              <h1 className="font-display text-[24px] leading-tight">Calming Sounds</h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-white/60">Drown out engine drone. Drift off at rest stops. Six driver-tested tracks.</p>
        </div>
      </div>

      <Section>
        <div className="space-y-2">
          {tracks.map((t) => {
            const isPlaying = playing === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setPlaying(isPlaying ? null : t.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  isPlaying ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${isPlaying ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <t.icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[15px] leading-tight">{t.name}</p>
                  <p className="text-[12px] text-muted-foreground">{t.desc}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t.duration}</p>
                </div>
                <div className={`grid h-10 w-10 place-items-center rounded-full ${isPlaying ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" fill="currentColor" />}
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {playing && (
        <div className="fixed inset-x-0 bottom-[88px] z-30 mx-auto max-w-[480px] px-3">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/95 backdrop-blur p-3 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.25)]">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              {(() => { const T = tracks.find(t => t.id === playing)!.icon; return <T size={16} />; })()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[13px] font-semibold">{tracks.find(t => t.id === playing)!.name}</p>
              <div className="mt-1 h-1 rounded-full bg-muted">
                <div className="h-full w-1/3 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
            <button onClick={() => setPlaying(null)} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Pause size={14} />
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
