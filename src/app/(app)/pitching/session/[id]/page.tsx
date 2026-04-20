import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PITCH_TYPE_LABELS, PITCH_TYPE_COLORS, type PitchType } from "@/lib/pitch-types";
import { MovementChart } from "./movement-chart";
import { VelocityDistribution } from "./velocity-distribution";

function avg(nums: number[]) {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: session } = await supabase
    .from("pitch_sessions")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!session) notFound();

  const { data: pitches } = await supabase
    .from("pitches")
    .select("*")
    .eq("session_id", id)
    .order("pitch_number", { ascending: true });

  const allPitches = pitches ?? [];

  // Per-type averages
  const typeStats: Record<string, { velocities: number[]; spins: number[]; hbs: number[]; vbs: number[]; count: number }> = {};
  for (const p of allPitches) {
    const t = p.pitch_type ?? "unknown";
    if (!typeStats[t]) typeStats[t] = { velocities: [], spins: [], hbs: [], vbs: [], count: 0 };
    typeStats[t].count++;
    if (p.velocity != null) typeStats[t].velocities.push(p.velocity);
    if (p.spin_rate != null) typeStats[t].spins.push(p.spin_rate);
    if (p.horizontal_break != null) typeStats[t].hbs.push(p.horizontal_break);
    if (p.vertical_break != null) typeStats[t].vbs.push(p.vertical_break);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          {format(new Date(session.date), "MMM d, yyyy")}
        </h2>
        <div className="flex gap-2 mt-1">
          {session.session_type && <Badge variant="secondary">{session.session_type}</Badge>}
          {session.location && <Badge variant="outline">{session.location}</Badge>}
          <Badge variant="outline">{session.total_pitches} pitches</Badge>
        </div>
        {session.notes && <p className="text-sm text-muted-foreground mt-2">{session.notes}</p>}
      </div>

      {/* Per-type averages */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(typeStats).map(([type, stats]) => (
          <Card key={type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: PITCH_TYPE_COLORS[type as PitchType] ?? "#888" }}
                />
                {PITCH_TYPE_LABELS[type as PitchType] ?? type} ({stats.count})
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Avg Velo</p>
                <p className="font-medium">{stats.velocities.length ? avg(stats.velocities).toFixed(1) : "—"} mph</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Avg Spin</p>
                <p className="font-medium">{stats.spins.length ? Math.round(avg(stats.spins)) : "—"} rpm</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Avg HB</p>
                <p className="font-medium">{stats.hbs.length ? avg(stats.hbs).toFixed(1) : "—"} in</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Avg VB</p>
                <p className="font-medium">{stats.vbs.length ? avg(stats.vbs).toFixed(1) : "—"} in</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Signature movement scatter plot */}
      <MovementChart pitches={allPitches} />

      {/* Velocity distribution */}
      <VelocityDistribution pitches={allPitches} />

      {/* Pitch-by-pitch table */}
      <Card>
        <CardHeader>
          <CardTitle>Pitch-by-Pitch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">#</th>
                  <th className="p-2">Type</th>
                  <th className="p-2 text-right">Velo</th>
                  <th className="p-2 text-right">Spin</th>
                  <th className="p-2 text-right">Eff%</th>
                  <th className="p-2 text-right">HB</th>
                  <th className="p-2 text-right">VB</th>
                  <th className="p-2 text-right">Rel H</th>
                  <th className="p-2 text-right">Rel S</th>
                  <th className="p-2 text-right">Ext</th>
                </tr>
              </thead>
              <tbody>
                {allPitches.map((p) => (
                  <tr key={p.id} className="border-b border-muted hover:bg-muted/30">
                    <td className="p-2">{p.pitch_number}</td>
                    <td className="p-2">
                      <span className="flex items-center gap-1">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: PITCH_TYPE_COLORS[p.pitch_type as PitchType] ?? "#888" }}
                        />
                        {PITCH_TYPE_LABELS[p.pitch_type as PitchType] ?? p.pitch_type ?? "—"}
                      </span>
                    </td>
                    <td className="p-2 text-right">{p.velocity?.toFixed(1) ?? "—"}</td>
                    <td className="p-2 text-right">{p.spin_rate ? Math.round(p.spin_rate) : "—"}</td>
                    <td className="p-2 text-right">{p.spin_efficiency?.toFixed(0) ?? "—"}</td>
                    <td className="p-2 text-right">{p.horizontal_break?.toFixed(1) ?? "—"}</td>
                    <td className="p-2 text-right">{p.vertical_break?.toFixed(1) ?? "—"}</td>
                    <td className="p-2 text-right">{p.release_height?.toFixed(2) ?? "—"}</td>
                    <td className="p-2 text-right">{p.release_side?.toFixed(2) ?? "—"}</td>
                    <td className="p-2 text-right">{p.extension?.toFixed(1) ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
