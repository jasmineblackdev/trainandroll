import { createFileRoute } from "@tanstack/react-router";
import { Stethoscope, Video, Pill, FileText, Phone } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/telehealth")({
  head: () => ({ meta: [{ title: "Telehealth — Train & Roll" }] }),
  component: TelehealthPage,
});

function TelehealthPage() {
  return (
    <AppShell title="Telehealth" subtitle="Care between the loads">
      <Section>
        <Card className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
          <Stethoscope size={28} />
          <p className="mt-3 font-display text-[22px] leading-tight">Talk to a DOT-certified clinician</p>
          <p className="mt-1 text-[13px] text-primary-foreground/80">Average wait: 12 minutes. From your cab.</p>
          <button className="mt-5 w-full rounded-xl bg-white py-3 font-display text-primary tracking-widest">
            START VIDEO VISIT
          </button>
        </Card>
      </Section>
      <Section>
        <SectionTitle kicker="Services" title="Available now" />
        <div className="space-y-2">
          <Row icon={Video} label="Video consultations" desc="24/7 on-demand" />
          <Row icon={Pill} label="Prescription refills" desc="Maintenance meds" />
          <Row icon={FileText} label="Lab orders" desc="Through partner labs" />
          <Row icon={Phone} label="Nurse line" desc="Free for members" />
        </div>
      </Section>
    </AppShell>
  );
}

function Row({ icon: Icon, label, desc }: { icon: any; label: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-[12px] text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
