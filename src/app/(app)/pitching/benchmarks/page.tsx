import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  D1_BENCHMARKS,
  NORMALIZED_SPIN_BENCHMARKS,
  getTier,
  TIER_COLORS,
  TIER_LABELS,
} from "@/lib/d1-benchmarks";
import { PITCH_TYPE_LABELS, PITCH_TYPE_COLORS, type PitchType } from "@/lib/pitch-types";

function avg(arr: number[]) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
}

export default async function BenchmarksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: pitches } = await supabase
    .from("pitches")
    .select("pitch_type, velocity, spin_rate, horizontal_break, vertical_break, spin_efficiency")
    .eq("user_id", user.id);

  // Compute user averages by pitch type
  const userAvgs: Record<string, Record<string, number | null>> = {};
  const byType: Record<string, Array<Record<string, number | null>>> = {};

  for (const p of pitches ?? []) {
    const t = p.pitch_type ?? "unknown";
    if (!byType[t]) byType[t] = [];
    byType[t].push(p);
  }

  for (const [type, rows] of Object.entries(byType)) {
    userAvgs[type] = {
      velocity: avg(rows.filter((r) => r.velocity != null).map((r) => r.velocity!)),
      spin_rate: avg(rows.filter((r) => r.spin_rate != null).map((r) => r.spin_rate!)),
      horizontal_break: avg(rows.filter((r) => r.horizontal_break != null).map((r) => r.horizontal_break!)),
      vertical_break: avg(rows.filter((r) => r.vertical_break != null).map((r) => r.vertical_break!)),
      spin_efficiency: avg(rows.filter((r) => r.spin_efficiency != null).map((r) => r.spin_efficiency!)),
    };
    if (userAvgs[type].velocity && userAvgs[type].spin_rate) {
      userAvgs[type].normalized_spin = userAvgs[type].spin_rate! / userAvgs[type].velocity!;
    }
  }

  const metricToField: Record<string, string> = {
    "Velocity": "velocity",
    "Spin Rate": "spin_rate",
    "Vertical Break": "vertical_break",
    "Horizontal Break": "horizontal_break",
    "HB Blend": "horizontal_break",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">D1 Softball Benchmarks</h2>
        <p className="text-sm text-muted-foreground">
          Based on Diamond Solutions / WCWS data. Your averages are compared against D1 tiers.
        </p>
      </div>

      {D1_BENCHMARKS.map((pb) => {
        const userValues = userAvgs[pb.pitch_type];
        return (
          <Card key={pb.pitch_type}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: PITCH_TYPE_COLORS[pb.pitch_type as PitchType] ?? "#888" }}
                />
                {PITCH_TYPE_LABELS[pb.pitch_type as PitchType] ?? pb.pitch_type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-2">Metric</th>
                      <th className="p-2 text-center">Low</th>
                      <th className="p-2 text-center">Average</th>
                      <th className="p-2 text-center">Above Avg</th>
                      <th className="p-2 text-center">Elite</th>
                      <th className="p-2 text-center">Your Avg</th>
                      <th className="p-2 text-center">Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pb.benchmarks.map((b) => {
                      const field = metricToField[b.metric];
                      const userVal = field && userValues ? userValues[field] : null;
                      const tier = userVal !== null && userVal !== undefined ? getTier(userVal, b.tiers, b.inverted) : null;

                      return (
                        <tr key={b.metric} className="border-b border-muted">
                          <td className="p-2 font-medium">{b.metric}</td>
                          <td className="p-2 text-center text-muted-foreground">{b.tiers.low}{b.unit}</td>
                          <td className="p-2 text-center text-muted-foreground">{b.tiers.average}{b.unit}</td>
                          <td className="p-2 text-center text-muted-foreground">{b.tiers.above_average}{b.unit}</td>
                          <td className="p-2 text-center text-muted-foreground">{b.tiers.elite}{b.unit}</td>
                          <td className="p-2 text-center font-medium">
                            {userVal !== null && userVal !== undefined ? `${userVal.toFixed(1)}${b.unit}` : "—"}
                          </td>
                          <td className="p-2 text-center">
                            {tier ? (
                              <Badge variant="outline" className={TIER_COLORS[tier]}>
                                {TIER_LABELS[tier]}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Normalized Spin */}
      <Card>
        <CardHeader>
          <CardTitle>Normalized Spin (RPM / MPH)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Baseline: {NORMALIZED_SPIN_BENCHMARKS.baseline} | Above Avg: {NORMALIZED_SPIN_BENCHMARKS.above_average}+ |
            Elite: {NORMALIZED_SPIN_BENCHMARKS.elite}+
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {Object.entries(userAvgs).map(([type, vals]) => {
              const ns = vals.normalized_spin;
              let tier: string | null = null;
              if (ns !== null && ns !== undefined) {
                if (ns >= NORMALIZED_SPIN_BENCHMARKS.elite) tier = "elite";
                else if (ns >= NORMALIZED_SPIN_BENCHMARKS.above_average) tier = "above_average";
                else if (ns >= NORMALIZED_SPIN_BENCHMARKS.baseline) tier = "average";
                else tier = "low";
              }
              return (
                <div key={type} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm font-medium">
                    {PITCH_TYPE_LABELS[type as PitchType] ?? type}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{ns != null ? ns.toFixed(1) : "—"}</span>
                    {tier && (
                      <Badge variant="outline" className={TIER_COLORS[tier as keyof typeof TIER_COLORS]}>
                        {TIER_LABELS[tier as keyof typeof TIER_LABELS]}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
