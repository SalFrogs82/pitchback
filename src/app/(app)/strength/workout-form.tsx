"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { createStrengthSession } from "./actions";
import { EXERCISE_CATALOG } from "@/lib/exercise-catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

type ExerciseRow = {
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
  rpe?: number;
};

export function WorkoutForm() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [bodyWeight, setBodyWeight] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [exercises, setExercises] = useState<ExerciseRow[]>([
    { exercise_name: "", sets: 3, reps: 8, weight: 0 },
  ]);
  const [search, setSearch] = useState("");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filteredExercises = search.length > 0
    ? EXERCISE_CATALOG.filter((e) => e.toLowerCase().includes(search.toLowerCase()))
    : [];

  const addRow = () => setExercises([...exercises, { exercise_name: "", sets: 3, reps: 8, weight: 0 }]);
  const removeRow = (i: number) => setExercises(exercises.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof ExerciseRow, value: string | number) => {
    const updated = [...exercises];
    (updated[i] as Record<string, string | number>)[field] = value;
    setExercises(updated);
  };

  const handleSubmit = () => {
    const valid = exercises.filter((e) => e.exercise_name.trim() !== "");
    if (valid.length === 0) {
      setError("Add at least one exercise");
      return;
    }
    setError("");
    setSuccess(false);
    startTransition(async () => {
      const result = await createStrengthSession(
        { date, body_weight: bodyWeight ? Number(bodyWeight) : undefined, session_name: sessionName || undefined },
        valid
      );
      if (result.error) setError(result.error);
      else {
        setSuccess(true);
        setExercises([{ exercise_name: "", sets: 3, reps: 8, weight: 0 }]);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Workout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        {success && <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">Workout saved!</div>}

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Session Name</Label>
            <Input placeholder="Upper Body A" value={sessionName} onChange={(e) => setSessionName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Body Weight (lbs)</Label>
            <Input type="number" placeholder="145" value={bodyWeight} onChange={(e) => setBodyWeight(e.target.value)} />
          </div>
        </div>

        <div className="space-y-3">
          {exercises.map((ex, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1 space-y-1 relative">
                <Label className="text-xs">Exercise</Label>
                <Input
                  placeholder="Search exercises..."
                  value={ex.exercise_name}
                  onChange={(e) => {
                    updateRow(i, "exercise_name", e.target.value);
                    setSearch(e.target.value);
                    setActiveIdx(i);
                  }}
                  onFocus={() => { setActiveIdx(i); setSearch(ex.exercise_name); }}
                  onBlur={() => setTimeout(() => setActiveIdx(null), 150)}
                />
                {activeIdx === i && filteredExercises.length > 0 && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-md border bg-popover shadow-md">
                    {filteredExercises.slice(0, 8).map((name) => (
                      <button
                        key={name}
                        type="button"
                        className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent"
                        onMouseDown={() => {
                          updateRow(i, "exercise_name", name);
                          setSearch("");
                          setActiveIdx(null);
                        }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-16 space-y-1">
                <Label className="text-xs">Sets</Label>
                <Input type="number" min={1} value={ex.sets} onChange={(e) => updateRow(i, "sets", Number(e.target.value))} />
              </div>
              <div className="w-16 space-y-1">
                <Label className="text-xs">Reps</Label>
                <Input type="number" min={1} value={ex.reps} onChange={(e) => updateRow(i, "reps", Number(e.target.value))} />
              </div>
              <div className="w-20 space-y-1">
                <Label className="text-xs">Weight</Label>
                <Input type="number" min={0} value={ex.weight} onChange={(e) => updateRow(i, "weight", Number(e.target.value))} />
              </div>
              <div className="w-16 space-y-1">
                <Label className="text-xs">RPE</Label>
                <Input type="number" min={1} max={10} value={ex.rpe ?? ""} onChange={(e) => updateRow(i, "rpe", Number(e.target.value) || 0)} />
              </div>
              <Button variant="ghost" size="icon" className="shrink-0 mb-0.5" onClick={() => removeRow(i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={addRow} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Exercise
        </Button>

        <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Saving..." : "Save Workout"}
        </Button>
      </CardContent>
    </Card>
  );
}
