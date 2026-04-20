import { createFileRoute } from "@tanstack/react-router";
import { Shield, Lock, Download, Trash2 } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy & data — Train & Roll" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <AppShell title="Privacy & data" subtitle="Your numbers. Your control.">
      <Section>
        <Card className="bg-primary/10">
          <Shield size={28} className="text-primary" />
          <p className="mt-3 font-display text-[20px] leading-tight">HIPAA-aligned storage</p>
          <p className="mt-1 text-[13px] text-muted-foreground">All health data is encrypted in transit and at rest. We never sell driver data — full stop.</p>
        </Card>
      </Section>

      <Section>
        <SectionTitle kicker="Your rights" title="What you can do" />
        <div className="space-y-2">
          <Row icon={Download} label="Export my data" desc="Get a copy of everything we store" />
          <Row icon={Lock} label="Two-factor auth" desc="Add a second layer of protection" />
          <Row icon={Trash2} label="Delete my account" desc="30-day grace period" tone="danger" />
        </div>
      </Section>

      <Section>
        <SectionTitle kicker="Policies" title="Read the fine print" />
        <Card>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between"><span>Privacy policy</span><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">v3.2</span></li>
            <li className="flex items-center justify-between"><span>Terms of service</span><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">v2.1</span></li>
            <li className="flex items-center justify-between"><span>HIPAA notice</span><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">v1.4</span></li>
          </ul>
        </Card>
      </Section>
    </AppShell>
  );
}

function Row({ icon: Icon, label, desc, tone }: { icon: any; label: string; desc: string; tone?: "danger" }) {
  return (
    <button className={`flex w-full items-center gap-3 rounded-2xl border bg-card p-4 text-left ${tone === "danger" ? "border-destructive/30 text-destructive" : "border-border"}`}>
      <Icon size={18} />
      <div className="flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-[12px] text-muted-foreground">{desc}</p>
      </div>
    </button>
  );
}
