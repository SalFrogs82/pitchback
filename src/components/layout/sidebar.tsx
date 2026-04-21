"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { navGroups } from "@/lib/nav-items";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Brand header */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            {/* Inline softball icon */}
            <svg viewBox="0 0 100 100" className="w-7 h-7 shrink-0" fill="none">
              <circle cx="50" cy="50" r="46" fill="#f5a623" stroke="#e8941a" strokeWidth="2" />
              <path d="M30 20 C35 30, 35 40, 30 50 C25 60, 25 70, 30 80" stroke="#c82014" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M70 20 C65 30, 65 40, 70 50 C75 60, 75 70, 70 80" stroke="#c82014" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
            <span className="font-bold text-base text-white tracking-tight">PitchBack</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto text-sidebar-foreground hover:text-white hover:bg-sidebar-accent", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-sidebar-foreground/50">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    collapsed && "justify-center px-2",
                    isActive
                      ? "bg-sidebar-accent text-white"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom softball stitching accent */}
      <div className="h-1 mx-4 mb-4 rounded-full bg-gradient-to-r from-[#c82014]/30 via-[#f5a623]/30 to-[#c82014]/30" />
    </aside>
  );
}
