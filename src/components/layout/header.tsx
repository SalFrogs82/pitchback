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
  "/pitching/release-point": "Release Point Analysis",
  "/strength": "Strength Log",
  "/strength/trends": "Strength Trends",
  "/strength/power": "Power Tests",
  "/strength/correlations": "Strength-Pitching Correlations",
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
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 bg-card px-4 md:px-6 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.06),0_0_2px_rgba(0,0,0,0.07)]">
      <MobileSheetMenu />
      <h1 className="text-lg font-semibold tracking-tight text-[#1a6b3c] dark:text-[#4ade80]">{title}</h1>
    </header>
  );
}
