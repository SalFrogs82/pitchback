import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TrendsCharts } from "./trends-charts";

export default async function TrendsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sessions } = await supabase
    .from("pitch_sessions")
    .select("id, date")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  const sessionIds = sessions?.map((s) => s.id) ?? [];
  let pitches: Array<{
    session_id: string;
    pitch_type: string | null;
    velocity: number | null;
    spin_rate: number | null;
    horizontal_break: number | null;
    vertical_break: number | null;
  }> = [];

  if (sessionIds.length > 0) {
    const { data } = await supabase
      .from("pitches")
      .select("session_id, pitch_type, velocity, spin_rate, horizontal_break, vertical_break")
      .in("session_id", sessionIds);
    pitches = data ?? [];
  }

  // Build session-level averages by pitch type
  const sessionMap = new Map(sessions?.map((s) => [s.id, s.date]) ?? []);
  const trendData: Array<{
    date: string;
    averages: Record<string, { velocity: number | null; spin: number | null; hb: number | null; vb: number | null }>;
  }> = [];

  const grouped: Record<string, typeof pitches> = {};
  for (const p of pitches) {
    if (!grouped[p.session_id]) grouped[p.session_id] = [];
    grouped[p.session_id].push(p);
  }

  for (const [sid, date] of sessionMap) {
    const sessionPitches = grouped[sid] ?? [];
    const byType: Record<string, { velos: number[]; spins: number[]; hbs: number[]; vbs: number[] }> = {};

    for (const p of sessionPitches) {
      const t = p.pitch_type ?? "unknown";
      if (!byType[t]) byType[t] = { velos: [], spins: [], hbs: [], vbs: [] };
      if (p.velocity != null) byType[t].velos.push(p.velocity);
      if (p.spin_rate != null) byType[t].spins.push(p.spin_rate);
      if (p.horizontal_break != null) byType[t].hbs.push(p.horizontal_break);
      if (p.vertical_break != null) byType[t].vbs.push(p.vertical_break);
    }

    const averages: Record<string, { velocity: number | null; spin: number | null; hb: number | null; vb: number | null }> = {};
    for (const [type, data] of Object.entries(byType)) {
      const mean = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
      averages[type] = {
        velocity: mean(data.velos),
        spin: mean(data.spins),
        hb: mean(data.hbs),
        vb: mean(data.vbs),
      };
    }

    trendData.push({ date, averages });
  }

  return (
    <div className="space-y-6">
      <TrendsCharts data={trendData} />
    </div>
  );
}
