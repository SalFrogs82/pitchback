"use client";

import { ResponsiveRadar } from "@nivo/radar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PITCH_TYPE_COLORS, PITCH_TYPE_LABELS, type PitchType } from "@/lib/pitch-types";

type Pitch = {
  pitch_type: string | null;
  velocity: number | null;
  spin_rate: number | null;
  vertical_break: number | null;
  horizontal_break: number | null;
  spin_efficiency: number | null;
};

// D1 elite benchmarks for normalization (0 = low, 100 = elite)
const NORMALIZE: Record<string, { min: number; max: number }> = {
  velocity: { min: 50, max: 68 },
  spin_rate: { min: 800, max: 1700 },
  vertical_break: { min: 0, max: 10 }, // absolute value
  horizontal_break: { min: 0, max: 6 },
  spin_efficiency: { min: 0, max: 100 },
};

function normalize(value: number, metric: string): number {
  const range = NORMALIZE[metric];
  if (!range) return 0;
  const clamped = Math.max(range.min, Math.min(range.max, Math.abs(value)));
  return Math.round(((clamped - range.min) / (range.max - range.min)) * 100);
}

function avg(nums: number[]): number {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

export function PitchRadar({ pitches }: { pitches: Pitch[] }) {
  const byType: Record<string, Pitch[]> = {};
  for (const p of pitches) {
    if (!p.pitch_type) continue;
    if (!byType[p.pitch_type]) byType[p.pitch_type] = [];
    byType[p.pitch_type].push(p);
  }

  const types = Object.keys(byType) as PitchType[];
  if (types.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No pitch data available for radar chart.
        </CardContent>
      </Card>
    );
  }

  const metrics = ["Velocity", "Spin Rate", "Vert. Break", "Horiz. Break", "Spin Eff."];
  const metricKeys = ["velocity", "spin_rate", "vertical_break", "horizontal_break", "spin_efficiency"];

  const data = metrics.map((metric, i) => {
    const point: Record<string, string | number> = { metric };
    for (const type of types) {
      const vals = byType[type]
        .map((p) => p[metricKeys[i] as keyof Pitch])
        .filter((v): v is number => v !== null);
      point[type] = vals.length > 0 ? normalize(avg(vals), metricKeys[i]) : 0;
    }
    return point;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pitch Arsenal Radar</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: 450 }}>
          <ResponsiveRadar
            data={data}
            keys={types}
            indexBy="metric"
            maxValue={100}
            margin={{ top: 50, right: 80, bottom: 50, left: 80 }}
            gridShape="circular"
            gridLevels={5}
            dotSize={8}
            dotBorderWidth={2}
            colors={types.map((t) => PITCH_TYPE_COLORS[t] ?? "#888")}
            blendMode="normal"
            fillOpacity={0.15}
            borderWidth={2}
            legends={[
              {
                anchor: "top-left",
                direction: "column",
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                symbolSize: 12,
                symbolShape: "circle",
              },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
