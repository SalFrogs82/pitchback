import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CorrelationChart } from "./correlation-chart";
import { estimateE1RM } from "@/lib/exercise-catalog";

export default async function CorrelationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get strength sessions with exercises
  const { data: strengthSessions } = await supabase
    .from("strength_sessions")
    .select("id, date")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  const { data: exercises } = await supabase
    .from("strength_exercises")
    .select("session_id, exercise_name, reps, weight")
    .eq("user_id", user.id);

  // Get pitch sessions with velocity data
  const { data: pitchSessions } = await supabase
    .from("pitch_sessions")
    .select("id, date")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  const pitchSessionIds = pitchSessions?.map((s) => s.id) ?? [];
  let pitchData: Array<{ session_id: string; velocity: number | null }> = [];
  if (pitchSessionIds.length > 0) {
    const { data } = await supabase
      .from("pitches")
      .select("session_id, velocity")
      .in("session_id", pitchSessionIds)
      .eq("pitch_type", "fastball");
    pitchData = data ?? [];
  }

  // Build e1RM by date for key lifts
  const sessionMap = new Map(strengthSessions?.map((s) => [s.id, s.date]) ?? []);
  const e1rmByDateByLift: Record<string, Array<{ date: string; value: number }>> = {};

  for (const ex of exercises ?? []) {
    const date = sessionMap.get(ex.session_id);
    if (!date || !ex.weight || !ex.reps) continue;
    const e1rm = estimateE1RM(ex.weight, ex.reps);
    if (!e1rmByDateByLift[ex.exercise_name]) e1rmByDateByLift[ex.exercise_name] = [];
    e1rmByDateByLift[ex.exercise_name].push({ date, value: Math.round(e1rm) });
  }

  // Build avg fastball velocity by date
  const pitchDateMap = new Map(pitchSessions?.map((s) => [s.id, s.date]) ?? []);
  const veloByDate: Record<string, number[]> = {};
  for (const p of pitchData) {
    if (p.velocity == null) continue;
    const date = pitchDateMap.get(p.session_id);
    if (!date) continue;
    if (!veloByDate[date]) veloByDate[date] = [];
    veloByDate[date].push(p.velocity);
  }

  const veloTrend = Object.entries(veloByDate)
    .map(([date, velos]) => ({
      date,
      value: velos.reduce((a, b) => a + b, 0) / velos.length,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Pick top exercises for correlation
  const topLifts = Object.entries(e1rmByDateByLift)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3)
    .map(([name, data]) => ({ name, data }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Strength-to-Pitching Correlations</h2>
        <p className="text-sm text-muted-foreground">
          Overlaying strength e1RM with fastball velocity over time.
        </p>
      </div>
      {topLifts.length === 0 || veloTrend.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Need both strength and pitching data to show correlations.
        </p>
      ) : (
        topLifts.map((lift) => (
          <CorrelationChart
            key={lift.name}
            title={`${lift.name} e1RM vs Fastball Velocity`}
            strengthData={lift.data}
            strengthLabel={`${lift.name} e1RM (lbs)`}
            veloData={veloTrend}
          />
        ))
      )}
    </div>
  );
}
