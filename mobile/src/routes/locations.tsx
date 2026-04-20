import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Navigation, Truck, Dumbbell, Heart, Map as MapIcon, List, Bookmark, Clock } from "lucide-react";
import { AppShell, Section, Pill } from "../components/AppShell";
import { mockLocations, type Location } from "../lib/mockData";

export const Route = createFileRoute("/locations")({
  head: () => ({ meta: [{ title: "Stops — Train & Roll" }] }),
  component: LocationsPage,
});

const filters = [
  { v: "all", label: "All" },
  { v: "gym", label: "Gyms" },
  { v: "dot-center", label: "DOT" },
  { v: "truck-stop", label: "Stops" },
] as const;

function LocationsPage() {
  const [view, setView] = React.useState<"list" | "map">("list");
  const [filter, setFilter] = React.useState<string>("all");

  const list = mockLocations.filter((l) => filter === "all" || l.type === filter);

  return (
    <AppShell title="On the road" subtitle="Truck-friendly stops near you">
      <Section>
        <div className="flex gap-2">
          <button onClick={() => setView("list")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 font-display text-[12px] tracking-widest ${view === "list" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
            <List size={14} /> LIST
          </button>
          <button onClick={() => setView("map")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 font-display text-[12px] tracking-widest ${view === "map" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
            <MapIcon size={14} /> MAP
          </button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map((f) => {
            const active = f.v === filter;
            return (
              <button key={f.v} onClick={() => setFilter(f.v)} className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wider ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
                {f.label}
              </button>
            );
          })}
        </div>
      </Section>

      {view === "map" ? (
        <Section>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-asphalt text-white">
            <div className="dot-grid absolute inset-0 text-white/10" />
            {/* Faux map */}
            <div className="relative h-72">
              <svg className="absolute inset-0 h-full w-full">
                <path d="M 0 200 Q 100 80, 200 160 T 400 100" stroke="oklch(0.78 0.17 80 / 0.6)" strokeWidth="3" fill="none" strokeDasharray="6 6" />
                <path d="M 0 80 Q 150 200, 300 140 T 500 200" stroke="oklch(0.5 0.2 258 / 0.6)" strokeWidth="3" fill="none" />
              </svg>
              {list.map((l, i) => (
                <div key={l.id} className="absolute" style={{ left: `${15 + i * 22}%`, top: `${30 + (i % 2) * 30}%` }}>
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-asphalt shadow-lg pulse-ring">
                    {iconFor(l.type, 16)}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">{list.length} locations · GPS preview</p>
            </div>
          </div>
        </Section>
      ) : (
        <Section>
          <div className="space-y-3">
            {list.map((l) => <LocationCard key={l.id} l={l} />)}
          </div>
        </Section>
      )}
    </AppShell>
  );
}

function iconFor(t: Location["type"], size = 18) {
  if (t === "gym") return <Dumbbell size={size} />;
  if (t === "dot-center") return <Heart size={size} />;
  return <Truck size={size} />;
}

function LocationCard({ l }: { l: Location }) {
  const tone = l.type === "gym" ? "primary" : l.type === "dot-center" ? "danger" : "success";
  const label = l.type === "gym" ? "Gym" : l.type === "dot-center" ? "DOT Center" : "Truck Stop";
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-foreground">
            {iconFor(l.type)}
          </span>
          <div>
            <Pill tone={tone as any}>{label}</Pill>
            <h3 className="mt-1.5 font-display text-[16px] leading-tight">{l.name}</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-[22px] leading-none num text-primary">{l.distance}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">mi</p>
        </div>
      </div>

      <p className="mt-2 text-[13px] text-muted-foreground">{l.address}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {l.amenities.map((a) => (
          <span key={a} className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] uppercase tracking-wider">{a}</span>
        ))}
      </div>

      {(l.truckParkingNotes || l.hours) && (
        <div className="mt-3 space-y-1">
          {l.truckParkingNotes && (
            <p className="text-[12px] text-destructive"><strong className="font-semibold">Parking:</strong> {l.truckParkingNotes}</p>
          )}
          {l.hours && <p className="flex items-center gap-1 text-[12px] text-muted-foreground"><Clock size={11} /> {l.hours}</p>}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <a
          target="_blank" rel="noopener noreferrer"
          href={`https://maps.google.com/?q=${encodeURIComponent(l.address)}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 font-display text-[12px] tracking-widest text-primary-foreground"
        >
          <Navigation size={14} /> NAVIGATE
        </a>
        <button className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-foreground">
          <Bookmark size={16} />
        </button>
      </div>
    </div>
  );
}
