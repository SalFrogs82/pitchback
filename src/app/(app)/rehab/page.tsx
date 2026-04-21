import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { calculatePhase, REHAB_PHASES } from "@/lib/rehab-phases";
import { PhaseTimeline } from "../dashboard/phase-timeline";
import { RehabLogForm } from "./rehab-log-form";
import { WellnessForm } from "./wellness-form";
import { ROMChart, PainChart, GripStrengthChart } from "./rehab-charts";
import { WellnessChart } from "./wellness-chart";
import { RedFlagAlerts } from "./red-flag-alerts";

export default async function RehabPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: rehabLogs }, { data: wellnessLogs }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("rehab_logs").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(60),
    supabase.from("wellness_logs").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(30),
  ]);

  const currentPhase = calculatePhase(profile?.surgery_date ?? null);

  return (
    <div className="space-y-6">
      <PhaseTimeline currentPhase={currentPhase} phases={REHAB_PHASES} />

      {rehabLogs && rehabLogs.length > 0 && <RedFlagAlerts logs={rehabLogs} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <RehabLogForm currentPhase={currentPhase} />
        <WellnessForm />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ROMChart data={rehabLogs ?? []} />
        <PainChart data={rehabLogs ?? []} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GripStrengthChart data={rehabLogs ?? []} />
        <WellnessChart data={wellnessLogs ?? []} />
      </div>
    </div>
  );
}
