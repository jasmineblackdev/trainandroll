import { createFileRoute } from "@tanstack/react-router";
import { Star, MessageCircle } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/trainers")({
  head: () => ({ meta: [{ title: "Trainers — Train & Roll" }] }),
  component: TrainersPage,
});

const trainers = [
  { name: "Marcus Reed", spec: "Truck driver fitness", rating: 4.9, sessions: 312, price: 39 },
  { name: "Lina Choi", spec: "Cardiac rehab + DOT prep", rating: 4.8, sessions: 256, price: 45 },
  { name: "James 'Big J' Kovac", spec: "Bodyweight & nutrition", rating: 4.9, sessions: 188, price: 35 },
  { name: "Aaliyah Brooks", spec: "Yoga & spine mobility", rating: 5.0, sessions: 95, price: 30 },
];

function TrainersPage() {
  return (
    <AppShell title="Trainers" subtitle="1-on-1 coaching for drivers">
      <Section>
        <SectionTitle kicker="Marketplace" title="Driver-specialist coaches" />
        <div className="space-y-3">
          {trainers.map((t) => (
            <Card key={t.name}>
              <div className="flex items-start gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground font-display text-[18px]">
                  {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="font-display text-[16px] leading-tight">{t.name}</p>
                  <p className="text-[12px] text-muted-foreground">{t.spec}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-0.5 font-mono text-accent"><Star size={11} fill="currentColor" /> {t.rating}</span>
                    <span className="text-muted-foreground">· {t.sessions} sessions</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-[20px] leading-none num">${t.price}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">/ 30m</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 rounded-xl bg-asphalt py-2.5 font-display text-[12px] text-white tracking-widest">BOOK</button>
                <button className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
                  <MessageCircle size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </AppShell>
  );
}
