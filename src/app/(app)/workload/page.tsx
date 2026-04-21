import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WorkloadForm } from "./workload-form";
import { ACWRGauge } from "./acwr-gauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfWeek } from "date-fns";

export default async function WorkloadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: workloads } = await supabase
    .from("workload_weekly")
    .select("*")
    .eq("user_id", user.id)
    .order("week_start", { ascending: false })
    .limit(12);

  const latest = workloads?.[0];
  const currentWeekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <ACWRGauge acwr={latest?.acwr ?? null} />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{latest?.pitch_count ?? 0} pitches</p>
            <p className="text-xs text-muted-foreground">{latest?.throwing_sessions ?? 0} sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">4-Week Average</CardTitle>
          </CardHeader>
          <CardContent>
            {workloads && workloads.length > 0 ? (
              <>
                <p className="text-2xl font-bold">
                  {Math.round(
                    workloads.slice(0, 4).reduce((sum, w) => sum + (w.pitch_count ?? 0), 0) /
                    Math.min(workloads.length, 4)
                  )} pitches/wk
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No data</p>
            )}
          </CardContent>
        </Card>
      </div>

      <WorkloadForm currentWeekStart={currentWeekStart} />

      <Card>
        <CardHeader>
          <CardTitle>Weekly History</CardTitle>
        </CardHeader>
        <CardContent>
          {!workloads || workloads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No workload data yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2">Week Of</th>
                    <th className="p-2 text-right">Pitches</th>
                    <th className="p-2 text-right">Sessions</th>
                    <th className="p-2 text-right">ACWR</th>
                  </tr>
                </thead>
                <tbody>
                  {workloads.map((w) => {
                    const acwr = w.acwr ?? 0;
                    const acwrColor =
                      acwr > 1.5 ? "text-red-500" :
                      acwr > 1.3 ? "text-yellow-500" :
                      acwr >= 0.8 ? "text-green-500" :
                      "text-muted-foreground";
                    return (
                      <tr key={w.id} className="border-b border-muted">
                        <td className="p-2">{format(new Date(w.week_start), "MMM d")}</td>
                        <td className="p-2 text-right">{w.pitch_count}</td>
                        <td className="p-2 text-right">{w.throwing_sessions}</td>
                        <td className={`p-2 text-right font-medium ${acwrColor}`}>
                          {acwr.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
