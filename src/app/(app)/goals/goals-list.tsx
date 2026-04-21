"use client";

import { GoalCard } from "./goal-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

export function GoalsList({ goals }: { goals: Goal[] }) {
  const [filter, setFilter] = useState<"active" | "completed" | "all">("active");

  const filtered = goals.filter((g) => {
    if (filter === "all") return true;
    return g.status === filter;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["active", "completed", "all"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No {filter} goals.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </div>
      )}
    </div>
  );
}
