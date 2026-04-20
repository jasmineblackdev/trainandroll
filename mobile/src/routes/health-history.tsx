import { createFileRoute } from "@tanstack/react-router";
import { FileHeart, Download } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/health-history")({
  head: () => ({ meta: [{ title: "Health history — Train & Roll" }] }),
  component: HealthHistoryPage,
});

const records = [
  { date: "2024-09-12", title: "DOT Physical — PASS", doc: "Dr. Martinez", note: "BP 142/88 · 2-yr cert" },
  { date: "2024-04-03", title: "Lab work", doc: "QuestLab", note: "Glucose 110 · A1C 5.8" },
  { date: "2023-09-12", title: "DOT Physical — PASS", doc: "Dr. Patel", note: "BP 138/86 · 2-yr cert" },
  { date: "2023-06-20", title: "Sleep study", doc: "RestWell", note: "AHI 4 · No CPAP needed" },
];

function HealthHistoryPage() {
  return (
    <AppShell title="Health history" subtitle="Your medical paper trail">
      <Section>
        <Card className="flex items-center justify-between bg-primary/10">
          <div className="flex items-center gap-3">
            <FileHeart size={22} className="text-primary" />
            <div>
              <p className="font-display text-[16px] leading-tight">{records.length} records</p>
              <p className="text-[12px] text-muted-foreground">Synced and encrypted</p>
            </div>
          </div>
          <button className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-primary-foreground">
            <Download size={11} /> Export
          </button>
        </Card>
      </Section>

      <Section>
        <SectionTitle kicker="Timeline" title="Past visits" />
        <ol className="relative space-y-3 border-l-2 border-border pl-5">
          {records.map((r) => (
            <li key={r.date} className="relative">
              <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{new Date(r.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</p>
                <p className="mt-1 font-display text-[15px] leading-tight">{r.title}</p>
                <p className="mt-1 text-[12px] text-muted-foreground">{r.doc} · {r.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </AppShell>
  );
}
