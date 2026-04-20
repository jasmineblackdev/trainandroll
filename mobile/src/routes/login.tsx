import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ArrowRight, Mail, Lock, Truck } from "lucide-react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Train & Roll" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = React.useState("jake@trainandroll.com");
  const [password, setPassword] = React.useState("driver");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    signIn(email, "Jake Miller");
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-asphalt text-white">
      <div className="hazard-stripes h-2" />
      <div className="mx-auto flex max-w-[480px] flex-col px-6 pt-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-accent text-asphalt">
            <Truck size={18} strokeWidth={2.5} />
          </div>
          <span className="font-display tracking-[0.18em]">TRAIN&amp;ROLL</span>
        </Link>

        <h1 className="mt-12 font-display text-[36px] leading-tight">Welcome back,<br /><span className="text-accent">driver.</span></h1>
        <p className="mt-2 text-sm text-white/60">Sign in to keep your DOT score on track.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <Field icon={Mail} label="Email">
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-base outline-none placeholder:text-white/30"
              placeholder="you@road.com"
            />
          </Field>
          <Field icon={Lock} label="Password">
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-base outline-none placeholder:text-white/30"
              placeholder="••••••"
            />
          </Field>

          <button type="submit" className="mt-2 inline-flex w-full items-center justify-between rounded-xl bg-accent px-5 py-4 font-display tracking-widest text-asphalt">
            Sign in <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          New to the road?{" "}
          <Link to="/register" className="font-semibold text-accent">Create account</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon: React.ComponentType<{ size?: number }>; label: string; children: React.ReactNode }) {
  return (
    <label className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{label}</span>
      <div className="mt-1 flex items-center gap-3">
        <Icon size={16} />
        {children}
      </div>
    </label>
  );
}
