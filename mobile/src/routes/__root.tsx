import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#1d4ed8" },
      { title: "Train & Roll — DOT-Ready Fitness for Truck Drivers" },
      { name: "description", content: "Stay fit. Stay certified. Stay driving. Driver-built workouts, gym locator, and DOT readiness tracking for CDL holders." },
      { name: "author", content: "Train & Roll" },
      { property: "og:title", content: "Train & Roll — DOT-Ready Fitness for Truck Drivers" },
      { property: "og:description", content: "Workouts, gym locator, and DOT readiness tracking built for life on the road." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <Outlet />
      </OnboardingProvider>
    </AuthProvider>
  );
}
