"use client";

import { usePathname } from "next/navigation";
import { MobileSheetMenu } from "./mobile-nav";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/rehab": "Rehab Timeline",
  "/itp": "Interval Throwing Program",
  "/pitching": "Pitching Sessions",
  "/pitching/trends": "Pitching Trends",
  "/pitching/upload": "Upload CSV",
  "/pitching/benchmarks": "D1 Benchmarks",
  "/strength": "Strength Log",
  "/strength/trends": "Strength Trends",
  "/workload": "Workload",
  "/goals": "Goals",
  "/journal": "Journal",
  "/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/pitching/session/")) return "Session Detail";
  for (const [route, title] of Object.entries(pageTitles)) {
    if (pathname.startsWith(route)) return title;
  }
  return "PitchBack";
}

export function Header() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
      <MobileSheetMenu />
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}
