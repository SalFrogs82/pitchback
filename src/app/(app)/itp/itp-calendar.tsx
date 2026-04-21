"use client";

import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Session = {
  date: string;
  pain_level: number | null;
};

function getDayColor(sessions: Session[], day: Date): string | null {
  const dayStr = format(day, "yyyy-MM-dd");
  const session = sessions.find((s) => s.date === dayStr);
  if (!session) return null;
  if (session.pain_level === null) return "bg-gray-300 dark:bg-gray-600";
  if (session.pain_level > 2) return "bg-red-400";
  if (session.pain_level > 0) return "bg-yellow-400";
  return "bg-green-400";
}

export function ITPCalendar({ sessions }: { sessions: Session[] }) {
  const [month, setMonth] = useState(new Date());
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  const startPad = getDay(start);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Session Calendar</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{format(month, "MMM yyyy")}</span>
          <Button variant="ghost" size="icon" onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="font-medium text-muted-foreground py-1">{d}</div>
          ))}
          {Array.from({ length: startPad }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {days.map((day) => {
            const color = getDayColor(sessions, day);
            const isToday = isSameDay(day, new Date());
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-md text-xs",
                  isToday && "ring-1 ring-primary",
                  color ?? "bg-muted/30"
                )}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-green-400" /> Pain-free</div>
          <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-yellow-400" /> Mild</div>
          <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-red-400" /> Pain &gt;2</div>
          <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-gray-300 dark:bg-gray-600" /> Rest</div>
        </div>
      </CardContent>
    </Card>
  );
}
