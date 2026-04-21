"use client";

import { useActionState } from "react";
import { format } from "date-fns";
import { upsertRehabLog, type ActionResult } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export function RehabLogForm({ currentPhase }: { currentPhase: number }) {
  const [painLevel, setPainLevel] = useState(0);
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    (_prev, fd) => upsertRehabLog(fd),
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Rehab Log</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</div>
          )}
          {state.success && (
            <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">Saved!</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phase">Phase</Label>
              <Input id="phase" name="phase" type="number" min={1} max={5} defaultValue={currentPhase} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rom_flexion">ROM Flexion (&deg;)</Label>
              <Input id="rom_flexion" name="rom_flexion" type="number" placeholder="e.g. 145" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rom_extension">ROM Extension (&deg;)</Label>
              <Input id="rom_extension" name="rom_extension" type="number" placeholder="e.g. 0" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Pain Level: {painLevel}/10</Label>
            <Slider
              min={0}
              max={10}
              step={1}
              value={[painLevel]}
              onValueChange={(v) => setPainLevel(v[0])}
            />
            <input type="hidden" name="pain_level" value={painLevel} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grip_strength">Grip Strength (lbs)</Label>
            <Input id="grip_strength" name="grip_strength" type="number" placeholder="e.g. 65" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="How did today feel?" />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving..." : "Save Log"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
