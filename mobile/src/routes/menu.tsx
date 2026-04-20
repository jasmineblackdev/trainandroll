import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp, ClipboardList, Trophy, Watch, Brain, Stethoscope, Apple,
  Moon, Users, CreditCard, FileHeart, BellRing, Shield, LifeBuoy,
  ChevronRight, FileCheck,
} from "lucide-react";
import { AppShell, Section, SectionTitle } from "../components/AppShell";

export const Route = createFileRoute("/menu")({
  head: () => ({ meta: [{ title: "More — Train & Roll" }] }),
  component: MorePage,
});

const groups = [
  {
    title: "Health & training",
    items: [
      { to: "/progress", icon: TrendingUp, label: "Progress trends" },
      { to: "/checkin", icon: ClipboardList, label: "Daily check-in" },
      { to: "/achievements", icon: Trophy, label: "Achievements" },
      { to: "/wearables", icon: Watch, label: "Wearables" },
    ],
  },
  {
    title: "Wellness",
    items: [
      { to: "/mental-wellness", icon: Brain, label: "Mental wellness" },
      { to: "/telehealth", icon: Stethoscope, label: "Telehealth" },
      { to: "/nutrition", icon: Apple, label: "Nutrition" },
      { to: "/sleep-health", icon: Moon, label: "Sleep & fatigue" },
      { to: "/trainers", icon: Users, label: "Trainer marketplace" },
    ],
  },
  {
    title: "DOT & records",
    items: [
      { to: "/dot-prep", icon: FileCheck, label: "DOT exam prep" },
      { to: "/dot-reminders", icon: BellRing, label: "DOT reminders" },
      { to: "/health-history", icon: FileHeart, label: "Health history" },
    ],
  },
  {
    title: "Account",
    items: [
      { to: "/pricing", icon: CreditCard, label: "Pricing & plans" },
      { to: "/settings", icon: Shield, label: "Settings" },
      { to: "/privacy", icon: Shield, label: "Privacy & data" },
      { to: "/help", icon: LifeBuoy, label: "Help & support" },
    ],
  },
] as const;

function MorePage() {
  return (
    <AppShell title="More" subtitle="Everything Train & Roll can do">
      {groups.map((g) => (
        <Section key={g.title}>
          <SectionTitle kicker={g.title} title="" />
          <div className="space-y-2">
            {g.items.map((it) => (
              <Link key={it.to} to={it.to} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <it.icon size={18} />
                </span>
                <span className="flex-1 text-sm font-semibold">{it.label}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        </Section>
      ))}
    </AppShell>
  );
}
