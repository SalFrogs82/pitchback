"use client";

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PITCH_TYPE_COLORS, PITCH_TYPE_LABELS, type PitchType } from "@/lib/pitch-types";

type Pitch = {
  pitch_type: string | null;
  horizontal_break: number | null;
  vertical_break: number | null;
};

export function MovementChart({ pitches }: { pitches: Pitch[] }) {
  const byType: Record<string, Array<{ hb: number; vb: number }>> = {};
  for (const p of pitches) {
    if (!p.pitch_type || p.horizontal_break == null || p.vertical_break == null) continue;
    if (!byType[p.pitch_type]) byType[p.pitch_type] = [];
    byType[p.pitch_type].push({ hb: p.horizontal_break, vb: p.vertical_break });
  }

  const types = Object.keys(byType) as PitchType[];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement Profile (HB vs VB)</CardTitle>
      </CardHeader>
      <CardContent>
        {types.length === 0 ? (
          <p className="text-sm text-muted-foreground">No movement data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" dataKey="hb" name="HB (in)" unit="in" className="text-xs" />
              <YAxis type="number" dataKey="vb" name="VB (in)" unit="in" className="text-xs" />
              <ZAxis range={[40, 40]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              {types.map((type) => (
                <Scatter
                  key={type}
                  name={PITCH_TYPE_LABELS[type] ?? type}
                  data={byType[type]}
                  fill={PITCH_TYPE_COLORS[type] ?? "#888"}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
