/**
 * Lightweight client-side mock auth + onboarding store.
 * Uses localStorage so the demo persists across reloads.
 * Wrapped in providers from __root.tsx.
 */
import * as React from "react";

type AuthUser = { name: string; email: string; tier: "free" | "driver_pro" };
type AuthCtx = {
  user: AuthUser | null;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
};

const Auth = React.createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("tnr_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const signIn = React.useCallback((email: string, name?: string) => {
    const u: AuthUser = { email, name: name || email.split("@")[0] || "Driver", tier: "free" };
    setUser(u);
    try { localStorage.setItem("tnr_user", JSON.stringify(u)); } catch {}
  }, []);

  const signOut = React.useCallback(() => {
    setUser(null);
    try { localStorage.removeItem("tnr_user"); } catch {}
  }, []);

  return <Auth.Provider value={{ user, signIn, signOut }}>{children}</Auth.Provider>;
}

export const useAuth = () => {
  const ctx = React.useContext(Auth);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

// Onboarding ----------------------------------------------------------------
type OnboardCtx = {
  completed: boolean;
  complete: () => void;
  reset: () => void;
};
const Onboard = React.createContext<OnboardCtx | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = React.useState(false);
  React.useEffect(() => {
    try { setCompleted(localStorage.getItem("tnr_onboarded") === "1"); } catch {}
  }, []);
  const complete = React.useCallback(() => {
    setCompleted(true);
    try { localStorage.setItem("tnr_onboarded", "1"); } catch {}
  }, []);
  const reset = React.useCallback(() => {
    setCompleted(false);
    try { localStorage.removeItem("tnr_onboarded"); } catch {}
  }, []);
  return <Onboard.Provider value={{ completed, complete, reset }}>{children}</Onboard.Provider>;
}

export const useOnboarding = () => {
  const ctx = React.useContext(Onboard);
  if (!ctx) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
};
