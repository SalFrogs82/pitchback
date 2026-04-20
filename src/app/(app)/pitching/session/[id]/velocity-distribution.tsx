"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PITCH_TYPE_COLORS, PITCH_TYPE_LABELS, type PitchType } from "@/lib/pitch-types";

type Pitch = {
  pitch_type: string | null;
  velocity: number | null;
};

export function VelocityDistribution({ pitches }: { pitches: Pitch[] }) {
  const byType: Record<string, number[]> = {};
  for (const p of pitches) {
    if (!p.pitch_type || p.velocity == null) continue;
    if (!byType[p.pitch_type]) byType[p.pitch_type] = [];
    byType[p.pitch_type].push(p.velocity);
  }

  const types = Object.keys(byType) as PitchType[];

  const allVelos = pitches.filter((p) => p.velocity != null).map((p) => p.velocity!);
  if (allVelos.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Velocity Distribution</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">No velocity data.</p></CardContent>
      </Card>
    );
  }

  const minV = Math.floor(Math.min(...allVelos));
  const maxV = Math.ceil(Math.max(...allVelos));
  const bins: Array<Record<string, string | number>> = [];

  for (let v = minV; v <= maxV; v++) {
    const bin: Record<string, string | number> = { range: `${v}` };
    for (const type of types) {
      bin[type] = byType[type].filter((vel) => Math.round(vel) === v).length;
    }
    bins.push(bin);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Velocity Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={bins}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="range" className="text-xs" label={{ value: "mph", position: "insideBottomRight", offset: -5 }} />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            {types.map((type) => (
              <Bar
                key={type}
                dataKey={type}
                name={PITCH_TYPE_LABELS[type] ?? type}
                fill={PITCH_TYPE_COLORS[type] ?? "#888"}
                stackId="vel"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
