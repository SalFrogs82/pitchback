"use client";

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PITCH_TYPE_COLORS, PITCH_TYPE_LABELS, type PitchType } from "@/lib/pitch-types";

type Pitch = {
  pitch_type: string | null;
  release_height: number | null;
  release_side: number | null;
  horizontal_break: number | null;
  vertical_break: number | null;
};

function stdDev(nums: number[]): number {
  if (nums.length < 2) return 0;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  return Math.sqrt(nums.reduce((sum, n) => sum + (n - mean) ** 2, 0) / (nums.length - 1));
}

function computeTunnelScore(byType: Record<string, Array<{ rh: number; rs: number }>>): number | null {
  const types = Object.keys(byType);
  if (types.length < 2) return null;

  // Tunnel score: inverse of average std dev of release points across all types combined
  const allRH = types.flatMap((t) => byType[t].map((p) => p.rh));
  const allRS = types.flatMap((t) => byType[t].map((p) => p.rs));

  if (allRH.length < 2) return null;

  const sdH = stdDev(allRH);
  const sdS = stdDev(allRS);
  const avgSD = (sdH + sdS) / 2;

  // Normalize: lower SD = higher score. Scale so 0.05 SD = 100, 0.3 SD = 0
  const score = Math.max(0, Math.min(100, (1 - (avgSD - 0.05) / 0.25) * 100));
  return Math.round(score);
}

export function TunnelingChart({ pitches }: { pitches: Pitch[] }) {
  const byType: Record<string, Array<{ rh: number; rs: number }>> = {};
  for (const p of pitches) {
    if (!p.pitch_type || p.release_height == null || p.release_side == null) continue;
    if (!byType[p.pitch_type]) byType[p.pitch_type] = [];
    byType[p.pitch_type].push({ rh: p.release_height, rs: p.release_side });
  }

  const types = Object.keys(byType) as PitchType[];
  const tunnelScore = computeTunnelScore(byType);

  return (
    <div className="space-y-6">
      {tunnelScore !== null && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tunnel Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{tunnelScore}/100</p>
            <p className="text-xs text-muted-foreground">
              {tunnelScore >= 80 ? "Excellent tunneling" :
               tunnelScore >= 60 ? "Good tunneling" :
               tunnelScore >= 40 ? "Average tunneling" :
               "Needs improvement"}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Release Point Overlay</CardTitle>
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
                <ZAxis range={[25, 25]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Legend />
                {types.map((type) => (
                  <Scatter
                    key={type}
                    name={PITCH_TYPE_LABELS[type] ?? type}
                    data={byType[type]}
                    fill={PITCH_TYPE_COLORS[type] ?? "#888"}
                    opacity={0.7}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
