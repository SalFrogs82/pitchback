"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function SurgeryCountdown({
  daysSinceSurgery,
  daysUntilReturn,
  progress,
}: {
  daysSinceSurgery: number | null;
  daysUntilReturn: number | null;
  progress: number | null;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Surgery Countdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {daysSinceSurgery !== null ? (
          <>
            <div className="flex justify-between text-sm">
              <span>{daysSinceSurgery} days post-op</span>
              {daysUntilReturn !== null && (
                <span className="text-muted-foreground">
                  {daysUntilReturn > 0 ? `${daysUntilReturn} to go` : "Target reached!"}
                </span>
              )}
            </div>
            {progress !== null && <Progress value={progress} />}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Set your surgery date in Settings</p>
        )}
      </CardContent>
    </Card>
  );
}
