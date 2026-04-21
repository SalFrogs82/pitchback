"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PITCH_TYPE_COLORS, PITCH_TYPE_LABELS, type PitchType } from "@/lib/pitch-types";

type TrendPoint = {
  date: string;
  averages: Record<string, { velocity: number | null; spin: number | null; hb: number | null; vb: number | null }>;
};

function buildChartData(data: TrendPoint[], metric: "velocity" | "spin" | "hb" | "vb") {
  const allTypes = new Set<string>();
  for (const d of data) {
    for (const type of Object.keys(d.averages)) allTypes.add(type);
  }

  return {
    types: Array.from(allTypes) as PitchType[],
    points: data.map((d) => {
      const point: Record<string, string | number | null> = { date: d.date.slice(5) };
      for (const type of allTypes) {
        point[type] = d.averages[type]?.[metric] ?? null;
      }
      return point;
    }),
  };
}

function TrendChart({ title, data, metric, unit }: {
  title: string;
  data: TrendPoint[];
  metric: "velocity" | "spin" | "hb" | "vb";
  unit: string;
}) {
  const { types, points } = buildChartData(data, metric);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {points.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={points}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" unit={unit} />
              <Tooltip />
              <Legend />
              {types.map((type) => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  name={PITCH_TYPE_LABELS[type] ?? type}
                  stroke={PITCH_TYPE_COLORS[type] ?? "#888"}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function TrendsCharts({ data }: { data: TrendPoint[] }) {
  return (
    <div className="space-y-6">
      <TrendChart title="Velocity Trend" data={data} metric="velocity" unit=" mph" />
      <TrendChart title="Spin Rate Trend" data={data} metric="spin" unit=" rpm" />
      <div className="grid gap-6 lg:grid-cols-2">
        <TrendChart title="Horizontal Break Trend" data={data} metric="hb" unit=" in" />
        <TrendChart title="Vertical Break Trend" data={data} metric="vb" unit=" in" />
      </div>
    </div>
  );
}
