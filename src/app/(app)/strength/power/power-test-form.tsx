"use client";

import { useActionState } from "react";
import { format } from "date-fns";
import { logPowerTest, type StrengthActionResult } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TEST_TYPES = [
  { value: "broad_jump", label: "Broad Jump", unit: "in" },
  { value: "vertical_jump", label: "Vertical Jump", unit: "in" },
  { value: "rotational_mb_throw", label: "Rotational MB Throw", unit: "mph" },
  { value: "grip_strength", label: "Grip Strength", unit: "lbs" },
];

export function PowerTestForm() {
  const [state, formAction, pending] = useActionState<StrengthActionResult, FormData>(
    (_prev, fd) => logPowerTest(fd),
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Power Test</CardTitle>
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
              <Label>Date</Label>
              <Input name="date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} required />
            </div>
            <div className="space-y-2">
              <Label>Test Type</Label>
              <select name="test_type" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" required>
                {TEST_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Value</Label>
              <Input name="value" type="number" step="any" required />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input name="unit" defaultValue="in" required />
            </div>
            <div className="space-y-2">
              <Label>Side</Label>
              <select name="bilateral_side" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                <option value="both">Both</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving..." : "Log Test"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
