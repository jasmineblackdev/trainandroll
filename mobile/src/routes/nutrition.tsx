import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import {
  Apple, Coffee, Beef, Salad, Truck, Plus, Minus, Droplets, Flame,
  Search, Sparkles, ShoppingBasket, AlertTriangle, ShieldCheck, Check,
  Utensils, Sandwich, Fish, Egg,
} from "lucide-react";
import { AppShell, Section, SectionTitle, Card, Pill } from "../components/AppShell";

export const Route = createFileRoute("/nutrition")({
  head: () => ({ meta: [{ title: "Nutrition — Train & Roll" }] }),
  component: NutritionPage,
});

type Meal = {
  id: number;
  icon: any;
  time: "Breakfast" | "Lunch" | "Snack" | "Dinner";
  title: string;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number; // mg
  logged: boolean;
};

const initialMeals: Meal[] = [
  { id: 1, icon: Coffee,  time: "Breakfast", title: "Greek yogurt + berries",        cal: 280, protein: 22, carbs: 28, fat: 8,  sodium: 90,  logged: true  },
  { id: 2, icon: Salad,   time: "Lunch",     title: "Truck-stop chicken salad",      cal: 420, protein: 38, carbs: 22, fat: 18, sodium: 620, logged: true  },
  { id: 3, icon: Apple,   time: "Snack",     title: "Apple + almond butter",         cal: 200, protein: 6,  carbs: 24, fat: 11, sodium: 45,  logged: false },
  { id: 4, icon: Beef,    time: "Dinner",    title: "Grilled chicken + greens",      cal: 540, protein: 45, carbs: 30, fat: 22, sodium: 480, logged: false },
];

const TARGETS = { cal: 2200, protein: 165, carbs: 220, fat: 70, sodium: 2300, water: 8 };

const quickAdds = [
  { icon: Sandwich, name: "Turkey wrap",          cal: 380, protein: 28, carbs: 36, fat: 14, sodium: 720 },
  { icon: Fish,     name: "Tuna pouch + crackers", cal: 250, protein: 22, carbs: 18, fat: 8,  sodium: 540 },
  { icon: Egg,      name: "Hard-boiled eggs (2)",  cal: 140, protein: 12, carbs: 1,  fat: 10, sodium: 140 },
  { icon: Apple,    name: "Banana",                cal: 105, protein: 1,  carbs: 27, fat: 0,  sodium: 1   },
];

const stops = [
  {
    chain: "Pilot / Flying J",
    badge: "Hot food",
    smart: ["Subway 6\" turkey on wheat", "PJ Fresh grilled chicken bowl", "Hard-boiled eggs"],
    avoid: ["Cinnamon roll", "Mac & cheese cup", "Soda fountain"],
  },
  {
    chain: "Love's",
    badge: "Fresh-ish",
    smart: ["Carl's Jr. grilled chicken sandwich (no sauce)", "String cheese", "Beef jerky"],
    avoid: ["Hash brown sticks", "Big-grab chips", "Frozen latte"],
  },
  {
    chain: "TA / Petro",
    badge: "Sit-down",
    smart: ["Country Pride grilled salmon", "Side salad with vinaigrette", "Black coffee"],
    avoid: ["Country-fried steak", "Biscuits & gravy", "Sweet tea refills"],
  },
];

const cabCooler = [
  "Greek yogurt cups",
  "Pre-cooked chicken breasts",
  "Baby carrots & hummus",
  "Apples / oranges / bananas",
  "String cheese",
  "Hard-boiled eggs",
  "Tuna pouches",
  "Unsweetened almond milk",
];

function NutritionPage() {
  const [meals, setMeals] = React.useState<Meal[]>(initialMeals);
  const [water, setWater] = React.useState(4);

  const logged = meals.filter((m) => m.logged);
  const totals = logged.reduce(
    (a, m) => ({
      cal: a.cal + m.cal,
      protein: a.protein + m.protein,
      carbs: a.carbs + m.carbs,
      fat: a.fat + m.fat,
      sodium: a.sodium + m.sodium,
    }),
    { cal: 0, protein: 0, carbs: 0, fat: 0, sodium: 0 },
  );

  const calPct = Math.min(100, (totals.cal / TARGETS.cal) * 100);
  const sodiumPct = Math.min(100, (totals.sodium / TARGETS.sodium) * 100);
  const sodiumStatus = sodiumPct < 60 ? "good" : sodiumPct < 90 ? "watch" : "high";

  const toggleMeal = (id: number) =>
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, logged: !m.logged } : m)));

  const addQuick = (q: typeof quickAdds[number]) =>
    setMeals((prev) => [
      ...prev,
      { id: Date.now(), icon: q.icon, time: "Snack", title: q.name, cal: q.cal, protein: q.protein, carbs: q.carbs, fat: q.fat, sodium: q.sodium, logged: true },
    ]);

  const ringStroke = (pct: number) => 276 - (276 * Math.min(100, pct)) / 100;

  return (
    <AppShell showHeader={false}>
      {/* Hero — calorie ring */}
      <div className="bg-asphalt text-white">
        <div className="hazard-stripes h-1.5" />
        <div className="px-5 pt-5 pb-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Fuel log</p>
              <h1 className="font-display text-[26px] leading-tight">Nutrition</h1>
            </div>
            <Pill tone="primary">Day 1 of 7</Pill>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-5">
              <div className="relative grid h-32 w-32 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                  <circle cx="50" cy="50" r="44" stroke="oklch(1 0 0 / 0.1)" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="44" stroke="var(--primary)" strokeWidth="8" fill="none"
                    strokeLinecap="round" strokeDasharray="276" strokeDashoffset={ringStroke(calPct)}
                    style={{ transition: "stroke-dashoffset 0.5s ease" }} />
                </svg>
                <div className="text-center">
                  <p className="font-display text-[32px] leading-none num">{totals.cal}</p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-white/60">/ {TARGETS.cal}</p>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <MacroBar label="Protein" value={totals.protein} target={TARGETS.protein} unit="g" color="var(--success)" />
                <MacroBar label="Carbs"   value={totals.carbs}   target={TARGETS.carbs}   unit="g" color="var(--accent)"  />
                <MacroBar label="Fat"     value={totals.fat}     target={TARGETS.fat}     unit="g" color="var(--warning)" />
              </div>
            </div>
          </div>

          {/* Water tracker */}
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets size={16} className="text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">Water</span>
                <span className="font-display text-[14px]">{water} / {TARGETS.water} cups</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setWater((w) => Math.max(0, w - 1))} className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
                  <Minus size={14} />
                </button>
                <button onClick={() => setWater((w) => Math.min(TARGETS.water + 4, w + 1))} className="grid h-8 w-8 place-items-center rounded-full bg-primary">
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: TARGETS.water }).map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i < water ? "bg-primary" : "bg-white/10"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DOT impact */}
      <Section>
        <SectionTitle kicker="DOT signal" title="How today affects your exam" />
        <Card>
          <div className="flex items-center gap-3">
            <div className={`grid h-11 w-11 place-items-center rounded-xl ${sodiumStatus === "good" ? "bg-success/15 text-[oklch(0.45_0.18_145)]" : sodiumStatus === "watch" ? "bg-warning/15 text-[oklch(0.45_0.17_75)]" : "bg-destructive/15 text-destructive"}`}>
              {sodiumStatus === "high" ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
            </div>
            <div className="flex-1">
              <p className="font-display text-[16px] leading-tight">
                Sodium {totals.sodium} / {TARGETS.sodium} mg
              </p>
              <p className="text-[12px] text-muted-foreground">
                {sodiumStatus === "good" && "On track — keeps blood pressure in range."}
                {sodiumStatus === "watch" && "Approaching limit. Skip salty snacks tonight."}
                {sodiumStatus === "high" && "Over limit — sodium spikes raise BP and risk DOT failure."}
              </p>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${sodiumPct}%`,
                background: sodiumStatus === "good" ? "var(--success)" : sodiumStatus === "watch" ? "var(--warning)" : "var(--destructive)",
              }}
            />
          </div>
        </Card>
      </Section>

      {/* Today's meals */}
      <Section>
        <SectionTitle kicker="Plan" title="Today's meals" action={
          <button className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            <Search size={12} /> Search food
          </button>
        } />
        <div className="space-y-2">
          {meals.map((m) => (
            <button
              key={m.id}
              onClick={() => toggleMeal(m.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                m.logged ? "border-primary/30 bg-card" : "border-dashed border-border bg-muted/30"
              }`}
            >
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${m.logged ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {m.logged ? <Check size={16} strokeWidth={3} /> : <m.icon size={16} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{m.time}</p>
                <p className={`truncate text-sm font-semibold ${!m.logged ? "text-muted-foreground" : ""}`}>{m.title}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-[16px] leading-none num">{m.cal}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{m.protein}g pro</p>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Quick add */}
      <Section>
        <SectionTitle kicker="Quick add" title="Grab from the cooler" />
        <div className="grid grid-cols-2 gap-2">
          {quickAdds.map((q) => (
            <button
              key={q.name}
              onClick={() => addQuick(q)}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left active:scale-[0.98] transition"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <q.icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{q.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">+{q.cal} kcal</p>
              </div>
              <Plus size={14} className="text-primary" />
            </button>
          ))}
        </div>
      </Section>

      {/* Truck-stop guide */}
      <Section>
        <SectionTitle kicker="On the road" title="Truck-stop playbook" />
        <div className="space-y-3">
          {stops.map((s) => (
            <Card key={s.chain}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Truck size={16} />
                  </div>
                  <p className="font-display text-[15px] leading-tight">{s.chain}</p>
                </div>
                <Pill tone="primary">{s.badge}</Pill>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2.5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[oklch(0.45_0.18_145)]">Smart picks</p>
                  <ul className="mt-1 space-y-1">
                    {s.smart.map((x) => (
                      <li key={x} className="flex items-start gap-2 text-[13px]">
                        <Check size={13} className="mt-0.5 shrink-0 text-success" /> {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-destructive">Skip</p>
                  <ul className="mt-1 space-y-1">
                    {s.avoid.map((x) => (
                      <li key={x} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-destructive" /> {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Cab-cooler prep list */}
      <Section>
        <SectionTitle kicker="Pre-trip" title="Cab cooler shopping list" action={
          <button className="font-mono text-[10px] uppercase tracking-widest text-primary">Share</button>
        } />
        <Card>
          <div className="flex items-center gap-2 pb-2">
            <ShoppingBasket size={14} className="text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{cabCooler.length} items · 3-day haul</span>
          </div>
          <ul className="space-y-1.5">
            {cabCooler.map((item) => (
              <li key={item} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13.5px] hover:bg-muted/50">
                <span className="grid h-5 w-5 place-items-center rounded border border-border" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      {/* Coach tip */}
      <Section>
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/20">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">Coach tip</p>
              <p className="mt-1 font-display text-[16px] leading-tight">Eat your protein first.</p>
              <p className="mt-1 text-[12.5px] text-primary-foreground/85">
                Front-loading protein keeps you full past the next exit and dampens the post-meal glucose spike that sandbags your DOT bloodwork.
              </p>
            </div>
          </div>
        </Card>
      </Section>
    </AppShell>
  );
}

function MacroBar({ label, value, target, unit, color }: { label: string; value: number; target: number; unit: string; color: string }) {
  const pct = Math.min(100, (value / target) * 100);
  return (
    <div>
      <div className="flex justify-between text-[11px]">
        <span className="font-mono uppercase tracking-widest text-white/60">{label}</span>
        <span className="font-mono text-white/80 num">{value}/{target}{unit}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
