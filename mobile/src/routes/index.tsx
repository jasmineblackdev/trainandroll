import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Truck, Dumbbell, MapPin, ClipboardCheck, ChevronRight, Activity,
  AlertTriangle, Clock, ArrowRight, ShieldCheck, Heart, BarChart3,
  Quote,
} from "lucide-react";
import logoUrl from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Train & Roll — DOT-Ready Fitness for Truck Drivers" },
      { name: "description", content: "1 in 4 drivers fail DOT. 73% of failures are preventable. Train & Roll is the in-cab fitness coach built for the road." },
      { property: "og:title", content: "Train & Roll — Stay Fit. Stay Certified. Stay Driving." },
      { property: "og:description", content: "Driver-built workouts, gym locator, and DOT readiness score." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <MarqueeStrip />
      <Problem />
      <Features />
      <DotScoreSection />
      <Steps />
      <Testimonial />
      <FleetCTA />
      <Footer />
    </div>
  );
}

/* ───────────────────── HERO ───────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-asphalt text-white">
      {/* topo grid */}
      <div className="absolute inset-0 dot-grid text-white/10" />
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
      <div className="absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />

      {/* hazard top stripe */}
      <div className="hazard-stripes h-2" />

      <div className="relative mx-auto max-w-[480px] px-6 pt-8">
        <header className="flex items-center justify-between">
          <div className="flex h-10 items-center rounded-lg bg-white px-2.5">
            <img src={logoUrl} alt="Train & Roll" className="h-6 w-auto" />
          </div>
          <Link to="/login" className="text-sm font-semibold text-white/80 hover:text-white">Sign in</Link>
        </header>

        <div className="mt-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
            <ShieldCheck size={12} /> Driver Fitness · DOT Readiness
          </span>

          <h1 className="mt-5 font-display text-[44px] leading-[0.95] tracking-tight">
            Stay Fit.<br />Stay Certified.<br /><span className="text-accent">Stay Driving.</span>
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
            The fitness coach built for life behind the wheel. Workouts you can do in your cab, beside your rig, or on a quick gym stop — all aimed at one thing: passing your next DOT physical.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              to="/onboarding"
              className="group inline-flex items-center justify-between rounded-xl bg-accent px-5 py-4 font-display text-asphalt shadow-[0_10px_30px_-10px_oklch(0.78_0.16_75)]"
            >
              <span className="tracking-widest">Start free — 30 days</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-sm font-semibold text-white"
            >
              Already a driver? Sign in
            </Link>
          </div>

          {/* stat row */}
          <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
            {[
              { num: "1in4", label: "drivers fail DOT" },
              { num: "73%", label: "failures preventable" },
              { num: "30d", label: "free trial" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-[22px] leading-none text-accent">{s.num}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 -mb-2 grid place-items-center pb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll · Why Drivers Need This</span>
        </div>
      </div>
    </section>
  );
}

function MarqueeStrip() {
  const items = [
    "FMCSA-aligned scoring", "In-cab routines", "Truck-friendly gym filters",
    "Same-day DOT centers", "Built by drivers", "Offline-ready",
  ];
  return (
    <div className="border-y border-border bg-asphalt/95 py-3 text-white">
      <div className="ticker flex gap-10 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.3em] text-white/70">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── PROBLEM ───────────────────── */
function Problem() {
  const probs = [
    { icon: Clock, title: "Limited time between loads", color: "var(--destructive)" },
    { icon: MapPin, title: "No gym access at most truck stops", color: "var(--warning)" },
    { icon: Truck, title: "8–14 hours seated every shift", color: "var(--primary)" },
    { icon: AlertTriangle, title: "DOT failure means lost income", color: "var(--destructive)" },
  ];
  return (
    <section className="bg-secondary px-6 py-14">
      <div className="mx-auto max-w-[480px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">The Problem</p>
        <h2 className="mt-2 font-display text-[28px] leading-tight">
          The road doesn't stop. Neither do the health risks.
        </h2>
        <div className="mt-6 space-y-2.5">
          {probs.map(({ icon: Icon, title, color }) => (
            <div key={title} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <div
                className="grid h-11 w-11 place-items-center rounded-lg"
                style={{ background: `color-mix(in oklab, ${color} 12%, transparent)`, color }}
              >
                <Icon size={20} />
              </div>
              <p className="text-[15px] font-semibold">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── FEATURES ───────────────────── */
function Features() {
  const items = [
    { icon: Dumbbell, title: "Workout Anywhere", body: "5–20 min routines for in-cab, rest stop, or motel room. No gym needed." },
    { icon: MapPin, title: "Truck-Friendly Locator", body: "Find gyms, DOT centers, and stops with verified semi parking." },
    { icon: ClipboardCheck, title: "DOT Readiness Score", body: "Track BP, BMI, and glucose against FMCSA standards before exam day." },
    { icon: BarChart3, title: "Fleet Dashboard", body: "Operations sees anonymized driver readiness trends and renewals." },
  ];
  return (
    <section className="bg-background px-6 py-14">
      <div className="mx-auto max-w-[480px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">What's Inside</p>
        <h2 className="mt-2 font-display text-[28px] leading-tight">Everything a driver actually needs</h2>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {items.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-4"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon size={18} />
              </div>
              <p className="mt-3 font-display text-[15px] leading-tight">{title}</p>
              <p className="mt-1.5 text-[12.5px] leading-snug text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── DOT SCORE PREVIEW ───────────────────── */
function DotScoreSection() {
  return (
    <section className="bg-asphalt px-6 py-14 text-white">
      <div className="mx-auto max-w-[480px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">DOT Readiness Score</p>
        <h2 className="mt-2 font-display text-[28px] leading-tight">Know your number<br />before exam day.</h2>
        <p className="mt-3 text-sm text-white/60">A single 0–100 score tracks your blood pressure, BMI, glucose, heart rate, and habits — weighted to FMCSA exam criteria.</p>

        <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-5">
            <div className="relative grid h-28 w-28 place-items-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0">
                <circle cx="50" cy="50" r="44" stroke="oklch(1 0 0 / 0.1)" strokeWidth="8" fill="none" />
                <circle
                  cx="50" cy="50" r="44" stroke="var(--success)" strokeWidth="8"
                  fill="none" strokeLinecap="round" strokeDasharray="276"
                  strokeDashoffset="60" transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="text-center">
                <p className="font-display text-[34px] leading-none">78</p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/60">/ 100</p>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                <Activity size={10} /> At Risk
              </span>
              <p className="mt-2 font-display text-[18px] leading-tight">12 weeks to pass</p>
              <p className="mt-1 text-[12px] text-white/50">Lower BP & shed 6 lbs to clear DOT.</p>
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            {[
              { label: "Blood Pressure", v: 15, max: 30, c: "var(--warning)" },
              { label: "BMI", v: 10, max: 20, c: "var(--warning)" },
              { label: "Heart Rate", v: 15, max: 15, c: "var(--success)" },
              { label: "Glucose", v: 10, max: 20, c: "var(--warning)" },
              { label: "Habits & Sleep", v: 8, max: 15, c: "var(--success)" },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-[11px]">
                  <span className="font-mono uppercase tracking-widest text-white/60">{m.label}</span>
                  <span className="font-mono text-white/90">{m.v}/{m.max}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full" style={{ width: `${(m.v / m.max) * 100}%`, background: m.c }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── STEPS ───────────────────── */
function Steps() {
  const steps = [
    { n: "01", t: "Onboard in 3 minutes", b: "Tell us your DOT date and current numbers." },
    { n: "02", t: "Get your readiness score", b: "See exactly where you stand against FMCSA limits." },
    { n: "03", t: "Train where you park", b: "Daily routines tuned to your weakest metric." },
    { n: "04", t: "Walk in confident", b: "Hit your DOT exam knowing you'll pass." },
  ];
  return (
    <section className="bg-secondary px-6 py-14">
      <div className="mx-auto max-w-[480px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">How It Works</p>
        <h2 className="mt-2 font-display text-[28px] leading-tight">Up and running in minutes</h2>
        <ol className="mt-6 space-y-1">
          {steps.map((s, i) => (
            <li key={s.n} className="relative flex gap-5 rounded-2xl bg-card p-4 border border-border">
              <div className="font-display text-[34px] leading-none text-primary/30">{s.n}</div>
              <div>
                <p className="font-display text-[16px] leading-tight">{s.t}</p>
                <p className="text-[13px] text-muted-foreground">{s.b}</p>
              </div>
              {i < steps.length - 1 && <div className="absolute left-7 top-full h-3 w-px bg-border" />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────── TESTIMONIAL ───────────────────── */
function Testimonial() {
  return (
    <section className="bg-background px-6 py-14">
      <div className="mx-auto max-w-[480px] rounded-2xl bg-card p-6 border border-border">
        <Quote className="text-primary" size={28} />
        <p className="mt-3 font-display text-[20px] leading-snug">
          "Dropped 14 lbs in three months between hauls. Passed my last DOT with the lowest BP I've had in a decade."
        </p>
        <div className="mt-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary font-display">
            DR
          </div>
          <div>
            <p className="text-sm font-semibold">Darnell R.</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">OTR · 18 years · TX → CA</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── FLEET CTA ───────────────────── */
function FleetCTA() {
  return (
    <section className="bg-asphalt px-6 py-14 text-white">
      <div className="mx-auto max-w-[480px]">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/40 to-transparent p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">For Fleets</p>
          <h3 className="mt-2 font-display text-[26px] leading-tight">Cut DOT-fail downtime by 40%</h3>
          <p className="mt-2 text-sm text-white/70">Anonymized readiness dashboards, renewal reminders, and driver-level coaching at scale.</p>
          <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-display text-asphalt">
            Talk to fleet sales <ChevronRight size={16} />
          </button>
        </div>
        <Link to="/onboarding" className="mt-6 block rounded-2xl bg-accent px-5 py-4 text-center font-display text-asphalt tracking-widest">
          Start your 30-day trial
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-asphalt px-6 pb-10 text-white/50">
      <div className="mx-auto flex max-w-[480px] items-center justify-between border-t border-white/10 pt-6">
        <div className="flex items-center gap-2">
          <Heart size={14} className="text-accent" />
          <span className="font-mono text-[11px] uppercase tracking-widest">Built for drivers</span>
        </div>
        <span className="font-mono text-[11px]">© Train&amp;Roll</span>
      </div>
    </footer>
  );
}
