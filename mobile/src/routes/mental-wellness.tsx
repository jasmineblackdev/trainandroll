import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Wind, BookOpen, Headphones, Moon, Smile, ChevronRight, Sparkles } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/mental-wellness")({
  head: () => ({ meta: [{ title: "Mental wellness — Train & Roll" }] }),
  component: MentalWellnessPage,
});

const tools = [
  { to: "/mental-wellness/sounds",       icon: Headphones, label: "Calming sounds",  desc: "6 audio tracks" },
  { to: "/mental-wellness/journal",      icon: BookOpen,   label: "Driver journal",  desc: "Daily prompts" },
  { to: "/mental-wellness/stress-check", icon: Brain,      label: "Stress check",    desc: "2 min quiz" },
  { to: "/mental-wellness/quick-reset",  icon: Wind,       label: "Quick reset",     desc: "3 min meditation" },
] as const;

const extras = [
  { to: "/mental-wellness/mood",      icon: Smile, label: "Mood log",   desc: "Daily check-in & 14-day trend" },
  { to: "/mental-wellness/wind-down", icon: Moon,  label: "Wind down",  desc: "Pre-sleep routine for the cab" },
] as const;

function MentalWellnessPage() {
  return (
    <AppShell title="Mental Wellness" subtitle="Calm. Focused. Road-ready.">
      <Section>
        <Link to="/mental-wellness/breathing" className="block">
          <Card className="bg-asphalt text-white">
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Box breathing</p>
            <p className="mt-2 font-display text-[20px] leading-tight">Reset your nerves in 60 seconds</p>
            <div className="mt-6 grid place-items-center">
              <div className="grid h-40 w-40 place-items-center rounded-full bg-primary/30">
                <Wind size={36} className="text-accent" />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-xl bg-accent px-5 py-3 text-white">
              <span className="font-display tracking-widest">BEGIN BREATHING</span>
              <ChevronRight size={18} />
            </div>
          </Card>
        </Link>
      </Section>

      <Section>
        <SectionTitle kicker="Library" title="Quick reset tools" />
        <div className="grid grid-cols-2 gap-3">
          {tools.map((t) => (
            <Link key={t.to} to={t.to} className="block">
              <Tile icon={t.icon} label={t.label} desc={t.desc} />
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle kicker="Daily" title="Track how you feel" />
        <div className="space-y-2">
          {extras.map((e) => (
            <Link key={e.to} to={e.to} className="block">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <e.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-display text-[15px] leading-tight">{e.label}</p>
                  <p className="text-[12px] text-muted-foreground">{e.desc}</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/20">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">Why this matters</p>
              <p className="mt-1 font-display text-[16px] leading-tight">Stress raises BP. BP fails DOT.</p>
              <p className="mt-1 text-[12.5px] text-primary-foreground/85">
                Drivers who use a daily reset routine report 12% lower stress and better sleep — both move the needle on your DOT exam.
              </p>
            </div>
          </div>
        </Card>
      </Section>
    </AppShell>
  );
}

function Tile({ icon: Icon, label, desc }: { icon: any; label: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <Icon size={24} className="text-primary" />
      <p className="mt-3 font-display text-[14px] leading-tight">{label}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{desc}</p>
    </div>
  );
}
