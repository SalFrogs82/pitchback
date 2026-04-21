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
    <div className="rounded-xl border bg-card p-4 md:p-6">
      <h2 className="text-sm font-medium text-muted-foreground mb-4">Rehab Phase</h2>
      <div className="flex items-center gap-1 md:gap-2">
        {phases.map((phase) => {
          const isActive = phase.phase === currentPhase;
          const isComplete = phase.phase < currentPhase;
          return (
            <div key={phase.phase} className="flex-1 flex flex-col items-center gap-2">
              <div
                className={cn(
                  "h-2 w-full rounded-full transition-colors",
                  isComplete && "bg-primary",
                  isActive && "bg-primary animate-pulse",
                  !isComplete && !isActive && "bg-muted"
                )}
              />
              <div className="text-center">
                <p
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
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
      <div className="mt-3 text-center">
        <p className="text-sm font-medium">
          Phase {currentPhase}: {phases[currentPhase - 1]?.name}
        </p>
        <p className="text-xs text-muted-foreground">{phases[currentPhase - 1]?.description}</p>
      </div>
    </div>
  );
}
