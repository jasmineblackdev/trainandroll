import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle, FileCheck, ClipboardList, Heart } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/dot-prep")({
  head: () => ({ meta: [{ title: "DOT exam prep — Train & Roll" }] }),
  component: DotPrepPage,
});

const checklist = [
  { label: "Bring CDL & current med card", done: true },
  { label: "Hydrate (but not over-hydrate) day-of", done: true },
  { label: "Avoid caffeine 4hrs before", done: false },
  { label: "Sleep 7+ hrs night before", done: false },
  { label: "Bring eyeglasses if needed", done: true },
  { label: "List of current medications", done: false },
];

function DotPrepPage() {
  const ready = checklist.filter(c => c.done).length;
  return (
    <AppShell title="DOT Prep" subtitle="Walk in confident">
      <Section>
        <Card className="bg-success/10 border-success/30">
          <FileCheck size={28} className="text-success" />
          <p className="mt-3 font-display text-[22px] leading-tight">{ready}/{checklist.length} ready</p>
          <p className="mt-1 text-[12px] text-muted-foreground">Complete the rest before your appointment.</p>
        </Card>
      </Section>

      <Section>
        <SectionTitle kicker="Day of" title="Pre-exam checklist" />
        <Card>
          <ul className="divide-y divide-border">
            {checklist.map((c, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                {c.done ? <CheckCircle2 size={18} className="text-success" /> : <AlertTriangle size={18} className="text-warning" />}
                <span className={`text-sm ${c.done ? "text-foreground" : "text-muted-foreground"}`}>{c.label}</span>
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section>
        <SectionTitle kicker="Standards" title="What examiners check" />
        <div className="space-y-2">
          <Standard icon={Heart} label="Blood pressure" target="< 140/90 mmHg" />
          <Standard icon={ClipboardList} label="Vision" target="20/40 each eye, both eyes" />
          <Standard icon={ClipboardList} label="Hearing" target="Forced whisper at 5 ft" />
          <Standard icon={ClipboardList} label="Urinalysis" target="No protein/blood/sugar" />
        </div>
      </Section>
    </AppShell>
  );
}

function Standard({ icon: Icon, label, target }: { icon: any; label: string; target: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <Icon size={18} className="text-primary" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="font-mono text-[11px] text-muted-foreground">{target}</p>
      </div>
    </div>
  );
}
