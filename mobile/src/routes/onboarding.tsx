import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Dumbbell,
  MapPin,
  Activity,
  Sparkles,
  IdCard,
} from "lucide-react";
import { useOnboarding } from "../lib/auth";
import logoUrl from "@/assets/logo.png";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Set up — Train & Roll" }] }),
  component: OnboardingPage,
});

type Step = { key: string; title: string; sub?: string; options: string[] };

const steps: Step[] = [
  {
    key: "driver",
    title: "What kind of driver are you?",
    sub: "Helps us tune the workout length and difficulty.",
    options: ["OTR / Long-haul", "Regional", "Local / Day cab", "Owner-operator"],
  },
  {
    key: "dot",
    title: "When is your next DOT physical?",
    sub: "We'll reverse-engineer your training plan from this date.",
    options: ["Within 30 days", "1–3 months", "3–6 months", "6+ months"],
  },
  {
    key: "goal",
    title: "Pick your top health goal",
    sub: "You can change this anytime from your profile.",
    options: ["Lower blood pressure", "Lose weight", "Improve mobility", "Manage glucose"],
  },
  {
    key: "time",
    title: "How much time can you train?",
    sub: "Honest answer — we'll meet you where you are.",
    options: ["5 min in-cab", "10–20 min beside truck", "30+ min at gym", "Mix of all"],
  },
];

type Screen = "intro" | "basics" | "quiz" | "done";

type Basics = {
  firstName: string;
  lastName: string;
  age: string;
  dob: string;
  cdlNumber: string;
};

const BASICS_KEY = "tnr_profile";

const emptyBasics: Basics = { firstName: "", lastName: "", age: "", dob: "", cdlNumber: "" };

function loadBasics(): Basics {
  try {
    const raw = localStorage.getItem(BASICS_KEY);
    if (raw) return { ...emptyBasics, ...JSON.parse(raw) };
  } catch {}
  return emptyBasics;
}

function saveBasics(b: Basics) {
  try { localStorage.setItem(BASICS_KEY, JSON.stringify(b)); } catch {}
}

function ageFromDob(dob: string): string {
  if (!dob) return "";
  const d = new Date(dob);
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 0 && age < 120 ? String(age) : "";
}

function OnboardingPage() {
  const nav = useNavigate();
  const { complete } = useOnboarding();

  const [screen, setScreen] = React.useState<Screen>("intro");
  const [step, setStep] = React.useState(0);
  const [picks, setPicks] = React.useState<Record<string, string>>({});
  const [basics, setBasics] = React.useState<Basics>(() => loadBasics());

  const total = steps.length;
  const progress = ((step + 1) / total) * 100;
  const cur = steps[step];

  const choose = (opt: string) => {
    setPicks((p) => ({ ...p, [cur.key]: opt }));
    setTimeout(() => {
      if (step < total - 1) setStep(step + 1);
      else setScreen("done");
    }, 180);
  };

  const finish = () => {
    saveBasics(basics);
    complete();
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-white text-asphalt">
      <div className="hazard-stripes h-2" />

      {screen === "intro" && <IntroScreen onStart={() => setScreen("basics")} />}

      {screen === "basics" && (
        <BasicsScreen
          basics={basics}
          setBasics={setBasics}
          onBack={() => setScreen("intro")}
          onNext={() => { saveBasics(basics); setScreen("quiz"); }}
          onSkip={() => setScreen("quiz")}
        />
      )}

      {screen === "quiz" && (
        <div className="mx-auto max-w-[480px] px-6 pt-6 pb-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => (step > 0 ? setStep(step - 1) : setScreen("basics"))}
              aria-label="Back"
              className="grid h-10 w-10 place-items-center rounded-full border border-asphalt/10 bg-white hover:bg-asphalt/5"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="font-mono text-[11px] uppercase tracking-widest text-asphalt/60">
              Step {step + 1} / {total}
            </span>
            <button onClick={finish} className="text-xs font-semibold text-asphalt/60 hover:text-asphalt">
              Skip
            </button>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-asphalt/10">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
            Profile setup
          </p>
          <h1 className="mt-2 font-display text-[30px] leading-tight text-asphalt">{cur.title}</h1>
          {cur.sub && <p className="mt-2 text-sm text-asphalt/60">{cur.sub}</p>}

          <div className="mt-6 space-y-2.5">
            {cur.options.map((opt) => {
              const selected = picks[cur.key] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-asphalt/10 bg-white hover:border-primary/40"
                  }`}
                >
                  <span className="text-[15px] font-semibold text-asphalt">{opt}</span>
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full ${
                      selected ? "bg-primary text-white" : "bg-asphalt/5 text-asphalt/50"
                    }`}
                  >
                    {selected ? <Check size={14} /> : <ArrowRight size={14} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {screen === "done" && <DoneScreen picks={picks} basics={basics} onFinish={finish} />}
    </div>
  );
}

/* ─────────────── Intro ─────────────── */

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto max-w-[480px] px-6 pt-8 pb-12">
      <header className="flex items-center justify-between">
        <img src={logoUrl} alt="Train & Roll" className="h-8 w-auto" />
        <Link to="/login" className="text-sm font-semibold text-asphalt/70 hover:text-asphalt">
          Sign in
        </Link>
      </header>

      <div className="mt-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-asphalt/15 bg-asphalt/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
          <ShieldCheck size={12} /> 2 minutes · a few quick questions
        </span>

        <h1 className="mt-5 font-display text-[36px] leading-[1] tracking-tight text-asphalt">
          Let's tune your plan.
        </h1>

        <p className="mt-4 text-[15px] leading-relaxed text-asphalt/70">
          Tell us who you are and how you drive so Train&nbsp;&amp;&nbsp;Roll can build a workout
          and readiness plan that actually fits your truck, your clock, and your DOT date.
        </p>

        <ul className="mt-8 space-y-3">
          {[
            { icon: Dumbbell, text: "Workouts sized to your time + space" },
            { icon: MapPin, text: "Gyms & DOT centers along your route" },
            { icon: Activity, text: "Readiness score tracked to FMCSA limits" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 rounded-xl border border-asphalt/10 bg-white p-3.5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon size={18} />
              </div>
              <span className="text-sm font-medium text-asphalt">{text}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onStart}
          className="group mt-8 inline-flex w-full items-center justify-between rounded-xl bg-accent px-5 py-4 font-display text-white"
        >
          <span className="tracking-widest">Get started</span>
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>

        <p className="mt-4 text-center text-[12px] text-asphalt/50">
          No card required · Skip anything you want
        </p>
      </div>
    </div>
  );
}

/* ─────────────── Basics ─────────────── */

function BasicsScreen({
  basics,
  setBasics,
  onBack,
  onNext,
  onSkip,
}: {
  basics: Basics;
  setBasics: React.Dispatch<React.SetStateAction<Basics>>;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const update = (patch: Partial<Basics>) => setBasics((b) => ({ ...b, ...patch }));

  const onDobChange = (dob: string) => {
    const auto = ageFromDob(dob);
    // If age was previously empty OR was auto-derived from an old DOB, update it.
    update({ dob, age: auto || basics.age });
  };

  const canContinue =
    basics.firstName.trim().length > 0 && basics.lastName.trim().length > 0;

  return (
    <div className="mx-auto max-w-[480px] px-6 pt-6 pb-10">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="Back"
          className="grid h-10 w-10 place-items-center rounded-full border border-asphalt/10 bg-white hover:bg-asphalt/5"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="font-mono text-[11px] uppercase tracking-widest text-asphalt/60">
          About you
        </span>
        <button onClick={onSkip} className="text-xs font-semibold text-asphalt/60 hover:text-asphalt">
          Skip
        </button>
      </div>

      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
        Profile setup
      </p>
      <h1 className="mt-2 font-display text-[30px] leading-tight text-asphalt">The basics</h1>
      <p className="mt-2 text-sm text-asphalt/60">
        Just the essentials so we can personalize your plan and keep DOT dates on track.
      </p>

      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="First name"
            value={basics.firstName}
            onChange={(v) => update({ firstName: v })}
            placeholder="Jake"
            autoComplete="given-name"
          />
          <Field
            label="Last name"
            value={basics.lastName}
            onChange={(v) => update({ lastName: v })}
            placeholder="Miller"
            autoComplete="family-name"
          />
        </div>

        <Field
          label="Date of birth"
          type="date"
          value={basics.dob}
          onChange={onDobChange}
          autoComplete="bday"
        />

        <Field
          label="Age"
          type="number"
          value={basics.age}
          onChange={(v) => update({ age: v })}
          placeholder="42"
          inputMode="numeric"
          hint={basics.dob ? "Auto-filled from your date of birth — you can edit it." : undefined}
        />

        <Field
          label="CDL number"
          value={basics.cdlNumber}
          onChange={(v) => update({ cdlNumber: v.toUpperCase() })}
          placeholder="CDL-TX-123456"
          icon={IdCard}
          hint="Printed on the front of your commercial license."
        />
      </div>

      <button
        onClick={onNext}
        disabled={!canContinue}
        className="group mt-8 inline-flex w-full items-center justify-between rounded-xl bg-accent px-5 py-4 font-display text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="tracking-widest">Continue</span>
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </button>

      {!canContinue && (
        <p className="mt-3 text-center text-[12px] text-asphalt/50">
          First and last name required to continue.
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  hint?: string;
}) {
  const id = React.useId();
  return (
    <label htmlFor={id} className="block">
      <span className="text-[12px] font-semibold uppercase tracking-wider text-asphalt/60">
        {label}
      </span>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-asphalt/15 bg-white px-3 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        {Icon && <Icon size={16} className="text-asphalt/40" />}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className="w-full bg-transparent text-[15px] text-asphalt placeholder:text-asphalt/30 outline-none"
        />
      </div>
      {hint && <p className="mt-1.5 text-[12px] text-asphalt/50">{hint}</p>}
    </label>
  );
}

/* ─────────────── Done ─────────────── */

function DoneScreen({
  picks,
  basics,
  onFinish,
}: {
  picks: Record<string, string>;
  basics: Basics;
  onFinish: () => void;
}) {
  const fullName = [basics.firstName, basics.lastName].filter(Boolean).join(" ");
  const summary: { label: string; value: string }[] = [
    { label: "Name",          value: fullName || "—" },
    { label: "Age",           value: basics.age || "—" },
    { label: "CDL",           value: basics.cdlNumber || "—" },
    { label: "Driver type",   value: picks.driver || "—" },
    { label: "Next DOT",      value: picks.dot    || "—" },
    { label: "Top goal",      value: picks.goal   || "—" },
    { label: "Training time", value: picks.time   || "—" },
  ];

  return (
    <div className="mx-auto max-w-[480px] px-6 pt-10 pb-12">
      <div className="flex flex-col items-center text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
          <Sparkles size={28} />
        </div>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Plan ready</p>
        <h1 className="mt-2 font-display text-[30px] leading-tight text-asphalt">
          {basics.firstName ? `Welcome aboard, ${basics.firstName}.` : "You're all set — let's ride."}
        </h1>
        <p className="mt-3 max-w-sm text-sm text-asphalt/70">
          Your workouts and readiness score will calibrate as you log check-ins.
          You can tweak any of this later from Profile.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-asphalt/10 bg-white p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Your answers</p>
        <dl className="mt-3 divide-y divide-asphalt/10">
          {summary.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-3">
              <dt className="text-[13px] uppercase tracking-wider text-asphalt/50">{label}</dt>
              <dd className="text-[14px] font-semibold text-asphalt">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <button
        onClick={onFinish}
        className="group mt-8 inline-flex w-full items-center justify-between rounded-xl bg-accent px-5 py-4 font-display text-white"
      >
        <span className="tracking-widest">Go to dashboard</span>
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
