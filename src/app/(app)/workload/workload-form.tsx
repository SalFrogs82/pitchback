"use client";

import { useActionState } from "react";
import { upsertWeeklyWorkload, type StrengthActionResult } from "../strength/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WorkloadForm({ currentWeekStart }: { currentWeekStart: string }) {
  const [state, formAction, pending] = useActionState<StrengthActionResult, FormData>(
    (_prev, fd) => upsertWeeklyWorkload(fd),
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Weekly Workload</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</div>
          )}
          {state.success && (
            <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">Saved!</div>
          )}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Week Start (Monday)</Label>
              <Input name="week_start" type="date" defaultValue={currentWeekStart} required />
            </div>
            <div className="space-y-2">
              <Label>Pitch Count</Label>
              <Input name="pitch_count" type="number" min={0} placeholder="0" required />
            </div>
            <div className="space-y-2">
              <Label>Throwing Sessions</Label>
              <Input name="throwing_sessions" type="number" min={0} placeholder="0" required />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving..." : "Save Workload"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
