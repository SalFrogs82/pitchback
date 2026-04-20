import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StrengthTrendsCharts } from "./strength-trends-charts";
import { estimateE1RM, BW_BENCHMARKS } from "@/lib/exercise-catalog";

export default async function StrengthTrendsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sessions } = await supabase
    .from("strength_sessions")
    .select("id, date, body_weight")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  const { data: exercises } = await supabase
    .from("strength_exercises")
    .select("session_id, exercise_name, sets, reps, weight")
    .eq("user_id", user.id);

  const sessionMap = new Map(sessions?.map((s) => [s.id, s]) ?? []);

  // Build e1RM trends by exercise grouped by session date
  const e1rmByExercise: Record<string, Array<{ date: string; e1rm: number }>> = {};
  const bodyWeightByDate: Array<{ date: string; bw: number }> = [];

  for (const s of sessions ?? []) {
    if (s.body_weight) bodyWeightByDate.push({ date: s.date, bw: s.body_weight });
  }

  for (const ex of exercises ?? []) {
    const session = sessionMap.get(ex.session_id);
    if (!session || !ex.weight || !ex.reps) continue;
    const e1rm = estimateE1RM(ex.weight, ex.reps);
    if (!e1rmByExercise[ex.exercise_name]) e1rmByExercise[ex.exercise_name] = [];
    e1rmByExercise[ex.exercise_name].push({ date: session.date, e1rm: Math.round(e1rm) });
  }

  // Latest body weight for BW-relative benchmarks
  const latestBW = bodyWeightByDate.length > 0 ? bodyWeightByDate[bodyWeightByDate.length - 1].bw : null;

  return (
    <div className="space-y-6">
      <StrengthTrendsCharts
        e1rmData={e1rmByExercise}
        bodyWeightData={bodyWeightByDate}
        latestBW={latestBW}
        benchmarks={BW_BENCHMARKS}
      />
    </div>
  );
}
