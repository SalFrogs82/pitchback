"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WellnessLog = {
  date: string;
  sleep_hours: number | null;
  sleep_quality: number | null;
  mood: number | null;
  soreness: number | null;
  energy: number | null;
};

export function WellnessChart({ data }: { data: WellnessLog[] }) {
  const chartData = [...data].reverse().map((d) => ({
    date: d.date.slice(5),
    sleep: d.sleep_quality,
    mood: d.mood,
    soreness: d.soreness,
    energy: d.energy,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wellness Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No wellness data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} className="text-xs" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sleep" stroke="hsl(var(--chart-1))" name="Sleep" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="mood" stroke="hsl(var(--chart-2))" name="Mood" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="soreness" stroke="hsl(var(--chart-4))" name="Soreness" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="energy" stroke="hsl(var(--chart-5))" name="Energy" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
