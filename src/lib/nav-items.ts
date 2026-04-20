import {
  LayoutDashboard,
  HeartPulse,
  Target,
  Dumbbell,
  TrendingUp,
  Goal,
  Activity,
  BookOpen,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Rehab",
    items: [
      { title: "Timeline", href: "/rehab", icon: HeartPulse },
      { title: "ITP", href: "/itp", icon: Target },
    ],
  },
  {
    label: "Pitching",
    items: [
      { title: "Sessions", href: "/pitching", icon: Activity },
      { title: "Trends", href: "/pitching/trends", icon: TrendingUp },
    ],
  },
  {
    label: "Training",
    items: [
      { title: "Strength", href: "/strength", icon: Dumbbell },
      { title: "Workload", href: "/workload", icon: Activity },
    ],
  },
  {
    label: "Tracking",
    items: [
      { title: "Goals", href: "/goals", icon: Goal },
      { title: "Journal", href: "/journal", icon: BookOpen },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const mobileNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Rehab", href: "/rehab", icon: HeartPulse },
  { title: "Pitching", href: "/pitching", icon: Activity },
  { title: "Strength", href: "/strength", icon: Dumbbell },
  { title: "Goals", href: "/goals", icon: Goal },
];
