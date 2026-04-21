"use client";

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PITCH_TYPE_COLORS, PITCH_TYPE_LABELS, type PitchType } from "@/lib/pitch-types";

type Pitch = {
  pitch_type: string | null;
  release_height: number | null;
  release_side: number | null;
};

function stdDev(nums: number[]): number {
  if (nums.length < 2) return 0;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const variance = nums.reduce((sum, n) => sum + (n - mean) ** 2, 0) / (nums.length - 1);
  return Math.sqrt(variance);
}

export function ReleasePointChart({ pitches }: { pitches: Pitch[] }) {
  const byType: Record<string, Array<{ rh: number; rs: number }>> = {};
  for (const p of pitches) {
    if (!p.pitch_type || p.release_height == null || p.release_side == null) continue;
    if (!byType[p.pitch_type]) byType[p.pitch_type] = [];
    byType[p.pitch_type].push({ rh: p.release_height, rs: p.release_side });
  }

  const types = Object.keys(byType) as PitchType[];

  const stats = types.map((type) => {
    const pts = byType[type];
    const heights = pts.map((p) => p.rh);
    const sides = pts.map((p) => p.rs);
    return {
      type,
      label: PITCH_TYPE_LABELS[type] ?? type,
      count: pts.length,
      avgHeight: (heights.reduce((a, b) => a + b, 0) / heights.length).toFixed(2),
      avgSide: (sides.reduce((a, b) => a + b, 0) / sides.length).toFixed(2),
      stdHeight: stdDev(heights).toFixed(3),
      stdSide: stdDev(sides).toFixed(3),
    };
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Release Point (Height vs Side)</CardTitle>
        </CardHeader>
        <CardContent>
          {types.length === 0 ? (
            <p className="text-sm text-muted-foreground">No release point data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" dataKey="rs" name="Release Side" unit=" ft" className="text-xs" />
                <YAxis type="number" dataKey="rh" name="Release Height" unit=" ft" className="text-xs" />
                <ZAxis range={[30, 30]} />
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

      {stats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Release Point Consistency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2">Pitch</th>
                    <th className="p-2 text-right">Count</th>
                    <th className="p-2 text-right">Avg Height</th>
                    <th className="p-2 text-right">Avg Side</th>
                    <th className="p-2 text-right">SD Height</th>
                    <th className="p-2 text-right">SD Side</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s) => (
                    <tr key={s.type} className="border-b border-muted">
                      <td className="p-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PITCH_TYPE_COLORS[s.type] }} />
                        {s.label}
                      </td>
                      <td className="p-2 text-right">{s.count}</td>
                      <td className="p-2 text-right">{s.avgHeight} ft</td>
                      <td className="p-2 text-right">{s.avgSide} ft</td>
                      <td className="p-2 text-right">{s.stdHeight}</td>
                      <td className="p-2 text-right">{s.stdSide}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
