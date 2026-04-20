import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Bell, Mail, Moon, MapPin, Smartphone, ChevronRight, Trash2 } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Train & Roll" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [notif, setNotif] = React.useState(true);
  const [emails, setEmails] = React.useState(false);
  const [dark, setDark] = React.useState(false);
  const [loc, setLoc] = React.useState(true);

  return (
    <AppShell title="Settings" subtitle="Tune your Train & Roll">
      <Section>
        <SectionTitle kicker="Preferences" title="App behavior" />
        <Card>
          <Toggle icon={Bell} label="Workout reminders" desc="Daily nudge at 7am" v={notif} on={setNotif} />
          <Divider />
          <Toggle icon={Mail} label="Newsletter" desc="DOT tips, monthly" v={emails} on={setEmails} />
          <Divider />
          <Toggle icon={Moon} label="Dark mode" desc="Easier at night in the cab" v={dark} on={setDark} />
          <Divider />
          <Toggle icon={MapPin} label="Location services" desc="Find nearby gyms & DOT centers" v={loc} on={setLoc} />
        </Card>
      </Section>

      <Section>
        <SectionTitle kicker="Account" title="Manage" />
        <div className="space-y-2">
          <RowLink icon={Smartphone} label="Connected devices" />
          <RowLink icon={Bell} label="Notification settings" />
          <RowLink icon={Trash2} label="Delete account" tone="danger" />
        </div>
      </Section>

      <Section>
        <p className="px-1 text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Train & Roll · v1.0.0</p>
      </Section>
    </AppShell>
  );
}

function Toggle({ icon: Icon, label, desc, v, on }: { icon: any; label: string; desc: string; v: boolean; on: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon size={18} className="text-muted-foreground" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-[12px] text-muted-foreground">{desc}</p>
      </div>
      <button
        onClick={() => on(!v)}
        className={`relative h-7 w-12 rounded-full transition ${v ? "bg-primary" : "bg-muted"}`}
        aria-pressed={v}
      >
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${v ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function Divider() { return <div className="my-1 h-px bg-border" />; }

function RowLink({ icon: Icon, label, tone }: { icon: any; label: string; tone?: "danger" }) {
  return (
    <button className={`flex w-full items-center gap-3 rounded-2xl border bg-card p-4 ${tone === "danger" ? "border-destructive/30 text-destructive" : "border-border"}`}>
      <Icon size={18} />
      <span className="flex-1 text-left text-sm font-semibold">{label}</span>
      <ChevronRight size={16} />
    </button>
  );
}
