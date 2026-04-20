"use client";

import { useActionState } from "react";
import { createGoal, type GoalActionResult } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CATEGORIES = [
  { value: "velocity", label: "Velocity" },
  { value: "movement", label: "Movement" },
  { value: "strength", label: "Strength" },
  { value: "rehab", label: "Rehab" },
  { value: "custom", label: "Custom" },
];

export function GoalForm() {
  const [state, formAction, pending] = useActionState<GoalActionResult, FormData>(
    (_prev, fd) => createGoal(fd),
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Goal</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</div>
          )}
          {state.success && (
            <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">Goal created!</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="g-category">Category</Label>
              <select
                id="g-category"
                name="category"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                required
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="g-unit">Unit</Label>
              <Input id="g-unit" name="unit" placeholder="mph, lbs, °, etc." />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="g-title">Title</Label>
            <Input id="g-title" name="title" placeholder="e.g. Fastball velocity 60 mph" required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="g-start">Start</Label>
              <Input id="g-start" name="start_value" type="number" step="any" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="g-current">Current</Label>
              <Input id="g-current" name="current_value" type="number" step="any" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="g-target">Target</Label>
              <Input id="g-target" name="target_value" type="number" step="any" placeholder="60" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="g-date">Target Date</Label>
            <Input id="g-date" name="target_date" type="date" />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating..." : "Create Goal"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
