import { createFileRoute } from "@tanstack/react-router";
import { Watch, Bluetooth, CheckCircle2 } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/wearables")({
  head: () => ({ meta: [{ title: "Wearables — Train & Roll" }] }),
  component: WearablesPage,
});

const devices = [
  { name: "Apple Health", connected: true, sync: "Auto · 2 min ago" },
  { name: "Fitbit", connected: false, sync: "Tap to connect" },
  { name: "Garmin", connected: false, sync: "Tap to connect" },
  { name: "Whoop", connected: false, sync: "Tap to connect" },
];

function WearablesPage() {
  return (
    <AppShell title="Wearables" subtitle="Connect your data sources">
      <Section>
        <Card className="bg-primary/10">
          <div className="flex items-center gap-3">
            <Watch size={28} className="text-primary" />
            <div>
              <p className="font-display text-[18px] leading-tight">1 device connected</p>
              <p className="text-[12px] text-muted-foreground">HR, steps, and sleep auto-sync to your DOT score.</p>
            </div>
          </div>
        </Card>
      </Section>
      <Section>
        <SectionTitle kicker="Devices" title="Sync sources" />
        <div className="space-y-2">
          {devices.map((d) => (
            <div key={d.name} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <Bluetooth size={18} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{d.name}</p>
                <p className="text-[12px] text-muted-foreground">{d.sync}</p>
              </div>
              {d.connected ? (
                <CheckCircle2 size={18} className="text-success" />
              ) : (
                <button className="rounded-full bg-primary px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-primary-foreground">CONNECT</button>
              )}
            </div>
          ))}
        </div>
      </Section>
    </AppShell>
  );
}
