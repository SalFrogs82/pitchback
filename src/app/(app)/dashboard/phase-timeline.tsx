"use client";

import { cn } from "@/lib/utils";
import type { RehabPhase } from "@/lib/rehab-phases";

export function PhaseTimeline({
  currentPhase,
  phases,
}: {
  currentPhase: number;
  phases: RehabPhase[];
}) {
  return (
    <div className="rounded-xl bg-card p-5 md:p-6 shadow-[0_0_0.5px_rgba(0,0,0,0.14),0_1px_1px_rgba(0,0,0,0.24)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">Rehab Phase</h2>
      <div className="flex items-center gap-1.5 md:gap-2">
        {phases.map((phase) => {
          const isActive = phase.phase === currentPhase;
          const isComplete = phase.phase < currentPhase;
          return (
            <div key={phase.phase} className="flex-1 flex flex-col items-center gap-2">
              <div
                className={cn(
                  "h-2.5 w-full rounded-full transition-all duration-300",
                  isComplete && "bg-[#22874a]",
                  isActive && "bg-[var(--softball-gold)] shadow-[0_0_8px_rgba(245,166,35,0.4)]",
                  !isComplete && !isActive && "bg-muted"
                )}
              />
              <div className="text-center">
                <p
                  className={cn(
                    "text-xs font-bold",
                    isActive ? "text-[var(--softball-gold)]" : isComplete ? "text-[#22874a]" : "text-muted-foreground"
                  )}
                >
                  {phase.phase}
                </p>
                <p className="text-[10px] text-muted-foreground hidden md:block">{phase.name}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm font-semibold text-[#1a6b3c] dark:text-[#4ade80]">
          Phase {currentPhase}: {phases[currentPhase - 1]?.name}
        </p>
        <p className="text-xs text-muted-foreground">{phases[currentPhase - 1]?.description}</p>
      </div>
    </div>
  );
}
