import { createFileRoute } from "@tanstack/react-router";
import { Check, Truck, Users } from "lucide-react";
import { AppShell, Section } from "../components/AppShell";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — Train & Roll" }] }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Free",
    price: "$0",
    sub: "Try the app",
    icon: Truck,
    features: ["2 workouts unlocked", "Basic location search", "DOT score (no breakdown)"],
    cta: "Current plan",
    primary: false,
  },
  {
    name: "Driver Pro",
    price: "$9.99",
    sub: "/ month",
    icon: Truck,
    features: ["All 50+ workouts", "Full DOT readiness coaching", "Wearable sync", "Telehealth credits", "Priority support"],
    cta: "Upgrade",
    primary: true,
  },
  {
    name: "Fleet",
    price: "Custom",
    sub: "5+ drivers",
    icon: Users,
    features: ["Anonymized fleet dashboard", "Renewal reminders", "Bulk onboarding", "Dedicated success manager"],
    cta: "Contact sales",
    primary: false,
  },
];

function PricingPage() {
  return (
    <AppShell title="Pricing" subtitle="Cents on the dollar of one DOT failure">
      <Section>
        <div className="space-y-3">
          {tiers.map((t) => (
            <div key={t.name} className={`relative overflow-hidden rounded-2xl border p-5 ${t.primary ? "border-primary bg-asphalt text-white" : "border-border bg-card"}`}>
              {t.primary && <div className="absolute right-4 top-4 rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-asphalt">MOST POPULAR</div>}
              <t.icon size={22} className={t.primary ? "text-accent" : "text-primary"} />
              <p className={`mt-3 font-mono text-[10px] uppercase tracking-widest ${t.primary ? "text-white/60" : "text-muted-foreground"}`}>{t.name}</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-[36px] leading-none num">{t.price}</span>
                {t.sub && <span className={`font-mono text-[12px] ${t.primary ? "text-white/60" : "text-muted-foreground"}`}>{t.sub}</span>}
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={14} className={t.primary ? "mt-0.5 text-accent" : "mt-0.5 text-success"} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`mt-5 w-full rounded-xl py-3 font-display tracking-widest ${t.primary ? "bg-accent text-asphalt" : "bg-muted text-foreground"}`}>
                {t.cta.toUpperCase()}
              </button>
            </div>
          ))}
        </div>
      </Section>
    </AppShell>
  );
}
