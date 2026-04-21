import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StepProgression } from "./step-progression";
import { ITPSessionForm } from "./itp-session-form";
import { ITPCalendar } from "./itp-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PAIN_FREE_DAYS_TO_ADVANCE } from "@/lib/itp-steps";

export default async function ITPPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sessions } = await supabase
    .from("itp_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  const currentStep = sessions?.[0]?.step ?? 1;

  // Consecutive pain-free days at current step
  let painFreeDays = 0;
  if (sessions) {
    for (const s of sessions) {
      if (s.step === currentStep && s.pain_level !== null && s.pain_level <= 2) {
        painFreeDays++;
      } else {
        break;
      }
    }
  }

  const canAdvance = painFreeDays >= PAIN_FREE_DAYS_TO_ADVANCE && currentStep < 13;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Step</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{currentStep}/13</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pain-Free Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{painFreeDays} days</p>
            <p className="text-xs text-muted-foreground">
              {canAdvance ? "Ready to advance!" : `${PAIN_FREE_DAYS_TO_ADVANCE - painFreeDays} more needed`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{sessions?.length ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ITPSessionForm currentStep={canAdvance ? Math.min(currentStep + 1, 13) : currentStep} />
        <ITPCalendar sessions={sessions ?? []} />
      </div>

      <StepProgression currentStep={currentStep} />
    </div>
  );
}
