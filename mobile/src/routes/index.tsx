import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
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
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-asphalt text-white">
      {/* topo grid */}
      <div className="absolute inset-0 dot-grid text-white/10" />
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
      <div className="absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />

      {/* hazard top stripe */}
      <div className="hazard-stripes h-2" />

      <div className="relative mx-auto max-w-[480px] px-6 pt-8 pb-12">
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
      </div>
    </section>
  );
}
