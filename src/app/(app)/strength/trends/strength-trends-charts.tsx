"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type E1RMData = Record<string, Array<{ date: string; e1rm: number }>>;
type BWData = Array<{ date: string; bw: number }>;
type Benchmarks = Record<string, { developing: number; competitive: [number, number]; elite: number }>;

const CHART_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f97316", "#a855f7", "#06b6d4", "#ec4899", "#84cc16"];

export function StrengthTrendsCharts({
  e1rmData,
  bodyWeightData,
  latestBW,
  benchmarks,
}: {
  e1rmData: E1RMData;
  bodyWeightData: BWData;
  latestBW: number | null;
  benchmarks: Benchmarks;
}) {
  const exerciseNames = Object.keys(e1rmData);

  return (
    <div className="space-y-6">
      {/* e1RM Chart per exercise */}
      {exerciseNames.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No strength data yet. Log workouts to see trends.
          </CardContent>
        </Card>
      ) : (
        exerciseNames.map((name, i) => {
          const data = e1rmData[name].map((d) => ({ date: d.date.slice(5), e1rm: d.e1rm }));
          const bm = benchmarks[name];
          const latestE1RM = data.length > 0 ? data[data.length - 1].e1rm : null;
          const bwRatio = latestBW && latestE1RM ? (latestE1RM / latestBW).toFixed(2) : null;

          return (
            <Card key={name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{name} — Estimated 1RM</CardTitle>
                  <div className="flex gap-2 items-center">
                    {latestE1RM && <span className="text-sm font-medium">{latestE1RM} lbs</span>}
                    {bwRatio && <Badge variant="outline">{bwRatio}x BW</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" unit=" lbs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="e1rm" stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2} name="e1RM" />
                    {bm && latestBW && (
                      <>
                        <ReferenceLine y={bm.developing * latestBW} stroke="#fbbf24" strokeDasharray="3 3" label="Dev" />
                        <ReferenceLine y={bm.competitive[0] * latestBW} stroke="#3b82f6" strokeDasharray="3 3" label="Comp" />
                        <ReferenceLine y={bm.elite * latestBW} stroke="#22c55e" strokeDasharray="3 3" label="Elite" />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Body Weight Chart */}
      {bodyWeightData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Body Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={bodyWeightData.map((d) => ({ date: d.date.slice(5), bw: d.bw }))}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" unit=" lbs" />
                <Tooltip />
                <Line type="monotone" dataKey="bw" stroke="#6366f1" strokeWidth={2} name="Body Weight" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
