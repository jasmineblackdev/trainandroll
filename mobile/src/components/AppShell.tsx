import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, Dumbbell, MapPin, User2, Menu, Bell,
} from "lucide-react";
import logoUrl from "@/assets/logo.png";

const tabs = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/workouts",  label: "Train", icon: Dumbbell },
  { to: "/locations", label: "Stops", icon: MapPin },
  { to: "/profile",   label: "Profile", icon: User2 },
  { to: "/menu",      label: "More", icon: Menu },
] as const;

type Props = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  rightSlot?: React.ReactNode;
};

export function AppShell({ children, title, subtitle, showHeader = true, rightSlot }: Props) {
  const { pathname } = useLocation();
  return (
    <div className="app-shell flex flex-col">
      {showHeader && (
        <header className="sticky top-0 z-30 bg-asphalt text-white">
          <div className="hazard-stripes h-1.5 opacity-90" />
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="grid h-9 place-items-center rounded-md bg-white px-2">
                <img src={logoUrl} alt="Train & Roll" className="h-6 w-auto" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">DOT Ready · v1</span>
            </Link>
            <div className="flex items-center gap-2">
              {rightSlot}
              <button className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition">
                <Bell size={16} />
              </button>
            </div>
          </div>
          {(title || subtitle) && (
            <div className="px-5 pb-4">
              {title && <h1 className="font-display text-[26px] leading-tight">{title}</h1>}
              {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
            </div>
          )}
        </header>
      )}

      <main className="flex-1 pb-28">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full">
        <div className="mx-auto max-w-[480px] px-3 pb-[max(env(safe-area-inset-bottom),12px)]">
          <div className="rounded-2xl border border-border bg-card/95 backdrop-blur shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.25)]">
            <ul className="grid grid-cols-5">
              {tabs.map(({ to, label, icon: Icon }) => {
                const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
                return (
                  <li key={to} className="flex">
                    <Link
                      to={to}
                      className="group flex flex-1 flex-col items-center gap-1 py-2.5"
                    >
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-xl transition ${
                          active ? "bg-primary text-primary-foreground shadow-[0_6px_16px_-4px_var(--primary)]" : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                      </span>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${active ? "text-foreground" : "text-muted-foreground"}`}>
                        {label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

// Reusable surface/section components ----------------------------------------

export function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`px-5 py-4 ${className}`}>{children}</section>;
}

export function SectionTitle({ kicker, title, action }: { kicker?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        {kicker && <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">{kicker}</p>}
        <h2 className="font-display text-[18px] leading-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Card({
  children, className = "", as: As = "div",
}: { children: React.ReactNode; className?: string; as?: React.ElementType }) {
  return (
    <As className={`relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] ${className}`}>
      {children}
    </As>
  );
}

export function Pill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "success" | "warning" | "danger" | "primary" }) {
  const tones: Record<string, string> = {
    default: "bg-muted text-foreground",
    success: "bg-success/15 text-[oklch(0.45_0.18_145)]",
    warning: "bg-warning/15 text-[oklch(0.45_0.17_75)]",
    danger:  "bg-destructive/15 text-destructive",
    primary: "bg-primary/15 text-primary",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${tones[tone]}`}>{children}</span>;
}
