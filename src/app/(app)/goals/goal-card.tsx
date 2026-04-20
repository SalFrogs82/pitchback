"use client";

import { differenceInDays } from "date-fns";
import { updateGoalProgress, archiveGoal, deleteGoal } from "./actions";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Archive, CheckCircle } from "lucide-react";
import { useState, useTransition } from "react";

type Goal = {
  id: string;
  category: string;
  title: string;
  start_value: number | null;
  current_value: number | null;
  target_value: number | null;
  unit: string | null;
  target_date: string | null;
  status: string;
};

const categoryColors: Record<string, string> = {
  velocity: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  movement: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  strength: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  rehab: "bg-green-500/10 text-green-700 dark:text-green-400",
  custom: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
};

export function GoalCard({ goal }: { goal: Goal }) {
  const [newValue, setNewValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const start = goal.start_value ?? 0;
  const current = goal.current_value ?? 0;
  const target = goal.target_value ?? 100;
  const range = target - start;
  const progressPct = range > 0 ? Math.min(Math.round(((current - start) / range) * 100), 100) : 0;

  const daysLeft = goal.target_date
    ? differenceInDays(new Date(goal.target_date), new Date())
    : null;

  return (
    <Card className={goal.status === "completed" ? "border-green-500/50" : undefined}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={categoryColors[goal.category] ?? ""}>
              {goal.category}
            </Badge>
            {goal.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => startTransition(async () => { await archiveGoal(goal.id); })}
            >
              <Archive className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={() => startTransition(async () => { await deleteGoal(goal.id); })}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-base">{goal.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>
            {current}{goal.unit ? ` ${goal.unit}` : ""} / {target}{goal.unit ? ` ${goal.unit}` : ""}
          </span>
          <span className="text-muted-foreground">{progressPct}%</span>
        </div>
        <Progress value={progressPct} />
        {daysLeft !== null && (
          <p className="text-xs text-muted-foreground">
            {daysLeft > 0 ? `${daysLeft} days remaining` : daysLeft === 0 ? "Due today" : "Overdue"}
          </p>
        )}
        {goal.status === "active" && (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!newValue) return;
              startTransition(async () => { await updateGoalProgress(goal.id, Number(newValue)); });
              setNewValue("");
            }}
          >
            <Input
              type="number"
              step="any"
              placeholder="Update value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="h-8"
            />
            <Button type="submit" size="sm" disabled={isPending}>
              Update
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
