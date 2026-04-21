import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { differenceInDays, format } from "date-fns";
import { calculatePhase, REHAB_PHASES } from "@/lib/rehab-phases";
import { PhaseTimeline } from "./phase-timeline";
import { SurgeryCountdown } from "./surgery-countdown";
import { MetricCard } from "./metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    { data: rehabLogs },
    { data: itpSessions },
    { data: goals },
    { data: wellnessLogs },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("rehab_logs").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(30),
    supabase.from("itp_sessions").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(30),
    supabase.from("goals").select("*").eq("user_id", user.id).eq("status", "active"),
    supabase.from("wellness_logs").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(14),
  ]);

  const currentPhase = calculatePhase(profile?.surgery_date ?? null);

  const daysSinceSurgery = profile?.surgery_date
    ? differenceInDays(new Date(), new Date(profile.surgery_date))
    : null;

  const daysUntilReturn = profile?.target_return_date
    ? differenceInDays(new Date(profile.target_return_date), new Date())
    : null;

  const totalDays = profile?.surgery_date && profile?.target_return_date
    ? differenceInDays(new Date(profile.target_return_date), new Date(profile.surgery_date))
    : null;

  const returnProgress = daysSinceSurgery !== null && totalDays
    ? Math.min(Math.round((daysSinceSurgery / totalDays) * 100), 100)
    : null;

  const latestPain = rehabLogs?.[0]?.pain_level ?? null;
  const latestROM = rehabLogs?.[0]
    ? { flexion: rehabLogs[0].rom_flexion, extension: rehabLogs[0].rom_extension }
    : null;

  const currentITPStep = itpSessions?.[0]?.step ?? null;
  const activeGoalCount = goals?.length ?? 0;

  // Calculate pain-free streak
  let painFreeStreak = 0;
  if (rehabLogs) {
    for (const log of rehabLogs) {
      if (log.pain_level !== null && log.pain_level <= 2) {
        painFreeStreak++;
      } else {
        break;
      }
    }
  }

  const recentActivity = [
    ...(rehabLogs?.slice(0, 3).map((l) => ({
      type: "rehab" as const,
      date: l.date,
      label: `Rehab log — Phase ${l.phase}, Pain ${l.pain_level}/10`,
    })) ?? []),
    ...(itpSessions?.slice(0, 3).map((s) => ({
      type: "itp" as const,
      date: s.date,
      label: `ITP Step ${s.step} — ${s.throw_count ?? 0} throws`,
    })) ?? []),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PhaseTimeline currentPhase={currentPhase} phases={REHAB_PHASES} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SurgeryCountdown
          daysSinceSurgery={daysSinceSurgery}
          daysUntilReturn={daysUntilReturn}
          progress={returnProgress}
        />
        <MetricCard title="Pain Level" value={latestPain !== null ? `${latestPain}/10` : "—"} sub="Latest entry" />
        <MetricCard
          title="ROM"
          value={latestROM ? `${latestROM.flexion ?? "—"}° / ${latestROM.extension ?? "—"}°` : "—"}
          sub="Flexion / Extension"
        />
        <MetricCard title="ITP Step" value={currentITPStep !== null ? `${currentITPStep}/13` : "—"} sub="Current step" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard title="Active Goals" value={String(activeGoalCount)} sub="In progress" />
        <MetricCard title="Pain-Free Streak" value={`${painFreeStreak} days`} sub="Consecutive days ≤2" />
        <MetricCard
          title="Wellness"
          value={wellnessLogs?.[0] ? `${wellnessLogs[0].mood ?? "—"}/5 mood` : "—"}
          sub="Latest check-in"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet. Start logging your rehab progress!</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="text-muted-foreground">{format(new Date(item.date), "MMM d")}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
