import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { LifeBuoy, MessageCircle, Mail, BookOpen, ChevronDown } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help & support — Train & Roll" }] }),
  component: HelpPage,
});

const faqs = [
  { q: "Do I need a gym to use Train & Roll?", a: "Nope. Half the library is in-cab or beside-truck — no equipment beyond your body and rig." },
  { q: "How is the DOT score calculated?", a: "We weight blood pressure, BMI, glucose, heart rate, and habits according to FMCSA exam criteria, scaled to 100." },
  { q: "Can I use it offline?", a: "Yes — saved workouts and your readiness score work without signal. Locations need GPS." },
  { q: "Is my health data private?", a: "Encrypted, HIPAA-aligned, and never sold. You can export or delete it any time." },
];

function HelpPage() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <AppShell title="Help & support" subtitle="We're in your corner">
      <Section>
        <div className="grid grid-cols-2 gap-3">
          <Tile icon={MessageCircle} label="Live chat" desc="9am–9pm CT" />
          <Tile icon={Mail} label="Email us" desc="Avg 4hr reply" />
          <Tile icon={LifeBuoy} label="Roadside" desc="Pro members only" />
          <Tile icon={BookOpen} label="Knowledge base" desc="120+ articles" />
        </div>
      </Section>

      <Section>
        <SectionTitle kicker="FAQ" title="Common questions" />
        <Card className="divide-y divide-border p-0">
          {faqs.map((f, i) => (
            <div key={i} className="p-4">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-3 text-left">
                <span className="text-sm font-semibold">{f.q}</span>
                <ChevronDown size={16} className={`text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="mt-2 text-[13px] text-muted-foreground">{f.a}</p>}
            </div>
          ))}
        </Card>
      </Section>
    </AppShell>
  );
}

function Tile({ icon: Icon, label, desc }: { icon: any; label: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <Icon size={22} className="text-primary" />
      <p className="mt-2 font-display text-[14px] leading-tight">{label}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{desc}</p>
    </div>
  );
}
