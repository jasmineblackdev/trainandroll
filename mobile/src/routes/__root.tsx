import { Outlet, Link, createRootRoute } from "@tanstack/react-router";

import { AuthProvider, OnboardingProvider } from "../lib/auth";

function NotFoundComponent() {
  return (
    <div className="grid min-h-screen place-items-center bg-asphalt px-6 text-white">
      <div className="max-w-sm text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Off route</p>
        <h1 className="mt-3 font-display text-7xl">404</h1>
        <p className="mt-3 text-sm text-white/60">No load assigned to this URL. Let's get you back on the highway.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 font-display text-sm tracking-widest text-asphalt"
        >
          Return to base
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <Outlet />
      </OnboardingProvider>
    </AuthProvider>
  );
}
