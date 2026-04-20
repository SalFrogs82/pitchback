"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PowerTest = {
  id: string;
  date: string;
  test_type: string;
  value: number;
  unit: string;
  bilateral_side: string | null;
};

const BENCHMARKS: Record<string, { competitive: [number, number]; elite: number; unit: string }> = {
  broad_jump: { competitive: [74, 80], elite: 82, unit: "in" },
  vertical_jump: { competitive: [19, 22], elite: 23, unit: "in" },
  rotational_mb_throw: { competitive: [26, 28], elite: 30, unit: "mph" },
};

const TEST_LABELS: Record<string, string> = {
  broad_jump: "Broad Jump",
  vertical_jump: "Vertical Jump",
  rotational_mb_throw: "Rotational MB Throw",
  grip_strength: "Grip Strength",
};

export function PowerTestResults({ tests }: { tests: PowerTest[] }) {
  const byType: Record<string, PowerTest[]> = {};
  for (const t of tests) {
    if (!byType[t.test_type]) byType[t.test_type] = [];
    byType[t.test_type].push(t);
  }

  // Bilateral symmetry check for grip strength
  const gripTests = byType["grip_strength"] ?? [];
  const latestLeft = gripTests.find((t) => t.bilateral_side === "left");
  const latestRight = gripTests.find((t) => t.bilateral_side === "right");
  let asymmetry: number | null = null;
  if (latestLeft && latestRight) {
    const max = Math.max(latestLeft.value, latestRight.value);
    const min = Math.min(latestLeft.value, latestRight.value);
    asymmetry = max > 0 ? ((max - min) / max) * 100 : 0;
  }

  return (
    <div className="space-y-6">
      {Object.entries(byType).map(([type, results]) => {
        const sorted = [...results].reverse();
        const chartData = sorted.map((r) => ({ date: r.date.slice(5), value: r.value, side: r.bilateral_side }));
        const bm = BENCHMARKS[type];

        return (
          <Card key={type}>
            <CardHeader>
              <CardTitle>{TEST_LABELS[type] ?? type}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} />
                  {bm && (
                    <>
                      <ReferenceLine y={bm.competitive[0]} stroke="#3b82f6" strokeDasharray="3 3" label="Comp" />
                      <ReferenceLine y={bm.elite} stroke="#22c55e" strokeDasharray="3 3" label="Elite" />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      })}

      {asymmetry !== null && (
        <Card className={asymmetry > 10 ? "border-destructive/50" : undefined}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Grip Strength Symmetry
              {asymmetry > 10 && <Badge variant="destructive">Alert: {asymmetry.toFixed(0)}% asymmetry</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="flex gap-8">
              <div>Left: {latestLeft?.value} {latestLeft?.unit}</div>
              <div>Right: {latestRight?.value} {latestRight?.unit}</div>
              <div>Difference: {asymmetry.toFixed(1)}%</div>
            </div>
            {asymmetry > 10 && (
              <p className="mt-2 text-destructive text-xs">Bilateral asymmetry exceeds 10% threshold.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
