"use client";

import { useActionState } from "react";
import { format } from "date-fns";
import { createITPSession, type ITPActionResult } from "./actions";
import { ITP_STEPS } from "@/lib/itp-steps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export function ITPSessionForm({ currentStep }: { currentStep: number }) {
  const [step, setStep] = useState(currentStep);
  const [painLevel, setPainLevel] = useState(0);
  const stepDef = ITP_STEPS[step - 1];

  const [state, formAction, pending] = useActionState<ITPActionResult, FormData>(
    (_prev, fd) => createITPSession(fd),
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log ITP Session</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</div>
          )}
          {state.success && (
            <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">Session logged!</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itp-date">Date</Label>
              <Input id="itp-date" name="date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itp-step">Step</Label>
              <select
                id="itp-step"
                name="step"
                value={step}
                onChange={(e) => setStep(Number(e.target.value))}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                {ITP_STEPS.map((s) => (
                  <option key={s.step} value={s.step}>Step {s.step}</option>
                ))}
              </select>
            </div>
          </div>
          {stepDef && (
            <p className="text-sm text-muted-foreground">{stepDef.label}</p>
          )}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itp-distance">Distance (ft)</Label>
              <Input id="itp-distance" name="distance" type="number" defaultValue={stepDef?.distance || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itp-throws">Throws</Label>
              <Input id="itp-throws" name="throw_count" type="number" defaultValue={stepDef?.throws || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itp-intensity">Intensity %</Label>
              <Input id="itp-intensity" name="intensity_pct" type="number" min={0} max={100} defaultValue={stepDef?.intensity || ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Pain Level: {painLevel}/10</Label>
            <Slider min={0} max={10} step={1} value={[painLevel]} onValueChange={(v) => setPainLevel(v[0])} />
            <input type="hidden" name="pain_level" value={painLevel} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="itp-notes">Notes</Label>
            <Textarea id="itp-notes" name="notes" placeholder="How did the session feel?" />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving..." : "Log Session"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
