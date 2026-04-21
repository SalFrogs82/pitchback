"use client";

import { useActionState } from "react";
import { format } from "date-fns";
import { upsertWellnessLog, type ActionResult } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

const EMOJIS = ["😫", "😕", "😐", "🙂", "😄"];

function EmojiPicker({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="flex gap-1">
        {EMOJIS.map((emoji, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className={cn(
              "text-xl p-1 rounded transition-all",
              value === i + 1 ? "bg-accent scale-125" : "opacity-50 hover:opacity-75"
            )}
          >
            {emoji}
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={value || ""} />
    </div>
  );
}

export function WellnessForm() {
  const [sleepQuality, setSleepQuality] = useState(0);
  const [mood, setMood] = useState(0);
  const [soreness, setSoreness] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    (_prev, fd) => upsertWellnessLog(fd),
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wellness Check-in</CardTitle>
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
              <Label htmlFor="w-date">Date</Label>
              <Input id="w-date" name="date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sleep_hours">Sleep (hours)</Label>
              <Input id="sleep_hours" name="sleep_hours" type="number" step="0.5" min={0} max={24} placeholder="8" />
            </div>
          </div>
          <EmojiPicker name="sleep_quality" label="Sleep Quality" value={sleepQuality} onChange={setSleepQuality} />
          <EmojiPicker name="mood" label="Mood" value={mood} onChange={setMood} />
          <EmojiPicker name="soreness" label="Soreness" value={soreness} onChange={setSoreness} />
          <EmojiPicker name="energy" label="Energy" value={energy} onChange={setEnergy} />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving..." : "Save Check-in"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
