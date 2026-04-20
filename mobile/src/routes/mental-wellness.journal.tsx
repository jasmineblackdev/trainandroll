import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ArrowLeft, BookOpen, Plus, Save, Calendar } from "lucide-react";
import { AppShell, Section, SectionTitle, Card } from "../components/AppShell";

export const Route = createFileRoute("/mental-wellness/journal")({
  head: () => ({ meta: [{ title: "Driver Journal — Train & Roll" }] }),
  component: JournalPage,
});

const prompts = [
  "What was the highlight of today's haul?",
  "What's one thing weighing on your mind right now?",
  "Name a moment you handled well today.",
  "What would make tomorrow's drive smoother?",
  "Who do you miss most being on the road?",
  "Three things you're grateful for at this stop.",
];

type Entry = { id: number; date: string; prompt: string; body: string };

const seedEntries: Entry[] = [
  { id: 1, date: "Apr 18", prompt: "Highlight of today's haul?", body: "Smooth run through Kansas. Sunset was unreal outside Salina. No traffic, no DOT stops." },
  { id: 2, date: "Apr 17", prompt: "What's weighing on your mind?", body: "Missing the kids. Three more days till I'm home. Trying to FaceTime more during breaks." },
  { id: 3, date: "Apr 15", prompt: "Three things you're grateful for.", body: "Hot shower at TA. New mattress in the sleeper. Down 4 lbs this month." },
];

function JournalPage() {
  const nav = useNavigate();
  const [prompt] = React.useState(() => prompts[Math.floor(Math.random() * prompts.length)]);
  const [body, setBody] = React.useState("");
  const [entries, setEntries] = React.useState(seedEntries);
  const [saved, setSaved] = React.useState(false);

  const save = () => {
    if (!body.trim()) return;
    const today = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" });
    setEntries((p) => [{ id: Date.now(), date: today, prompt, body }, ...p]);
    setBody("");
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <AppShell showHeader={false}>
      <div className="bg-asphalt text-white">
        <div className="hazard-stripes h-1.5" />
        <div className="px-5 pt-4 pb-6">
          <button onClick={() => nav({ to: "/mental-wellness" })} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
            <ArrowLeft size={16} />
          </button>
          <div className="mt-5 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-white">
              <BookOpen size={22} />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Daily reflection</p>
              <h1 className="font-display text-[24px] leading-tight">Driver Journal</h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-white/60">{entries.length}-day streak · keeps your head clear for the long haul.</p>
        </div>
      </div>

      <Section>
        <SectionTitle kicker="Today's prompt" title="Take five minutes" />
        <Card>
          <p className="font-display text-[18px] leading-tight">{prompt}</p>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type honestly. No one else sees this."
            rows={6}
            className="mt-3 w-full resize-none rounded-xl border border-border bg-background p-3 text-[14px] outline-none focus:border-primary"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{body.length} chars</span>
            <button
              onClick={save}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-display text-primary-foreground tracking-widest disabled:opacity-50"
              disabled={!body.trim()}
            >
              <Save size={14} />
              {saved ? "SAVED" : "SAVE"}
            </button>
          </div>
        </Card>
      </Section>

      <Section>
        <SectionTitle kicker="Logbook" title="Past entries" />
        <div className="space-y-2">
          {entries.map((e) => (
            <Card key={e.id}>
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{e.date}</span>
              </div>
              <p className="mt-2 font-display text-[14px] leading-tight">{e.prompt}</p>
              <p className="mt-1.5 text-[13px] text-foreground/80 leading-relaxed">{e.body}</p>
            </Card>
          ))}
        </div>
      </Section>
    </AppShell>
  );
}
