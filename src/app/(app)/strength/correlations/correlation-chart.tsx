"use client";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DataPoint = { date: string; value: number };

export function CorrelationChart({
  title,
  strengthData,
  strengthLabel,
  veloData,
}: {
  title: string;
  strengthData: DataPoint[];
  strengthLabel: string;
  veloData: DataPoint[];
}) {
  // Merge both datasets by date
  const allDates = new Set([
    ...strengthData.map((d) => d.date),
    ...veloData.map((d) => d.date),
  ]);

  const strengthMap = new Map(strengthData.map((d) => [d.date, d.value]));
  const veloMap = new Map(veloData.map((d) => [d.date, d.value]));

  const merged = Array.from(allDates)
    .sort()
    .map((date) => ({
      date: date.slice(5),
      strength: strengthMap.get(date) ?? null,
      velocity: veloMap.get(date) ?? null,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={merged}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis yAxisId="left" className="text-xs" label={{ value: "lbs", angle: -90, position: "insideLeft" }} />
            <YAxis yAxisId="right" orientation="right" className="text-xs" label={{ value: "mph", angle: 90, position: "insideRight" }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="strength" name={strengthLabel} fill="#6366f1" opacity={0.6} />
            <Line yAxisId="right" type="monotone" dataKey="velocity" name="FB Velocity (mph)" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} connectNulls />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
