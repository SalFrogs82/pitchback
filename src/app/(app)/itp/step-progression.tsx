"use client";

import { cn } from "@/lib/utils";
import { ITP_STEPS, type ITPStepDef } from "@/lib/itp-steps";
import { CheckCircle, Circle, PlayCircle } from "lucide-react";

export function StepProgression({ currentStep }: { currentStep: number }) {
  return (
    <div className="rounded-xl border bg-card p-4 md:p-6">
      <h2 className="text-sm font-medium text-muted-foreground mb-4">Interval Throwing Program</h2>
      <div className="space-y-2">
        {ITP_STEPS.map((s) => {
          const isComplete = s.step < currentStep;
          const isCurrent = s.step === currentStep;
          return (
            <div
              key={s.step}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isCurrent && "bg-accent",
                isComplete && "text-muted-foreground"
              )}
            >
              {isComplete ? (
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              ) : isCurrent ? (
                <PlayCircle className="h-4 w-4 text-primary shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
              )}
              <span className="font-medium w-14 shrink-0">Step {s.step}</span>
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
