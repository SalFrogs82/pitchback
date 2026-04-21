import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReleasePointChart } from "./release-chart";

export default async function ReleasePointPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: pitches } = await supabase
    .from("pitches")
    .select("pitch_type, release_height, release_side")
    .eq("user_id", user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Release Point Analysis</h2>
        <p className="text-sm text-muted-foreground">
          Per-pitch-type clustering with standard deviation stats.
        </p>
      </div>
      <ReleasePointChart pitches={pitches ?? []} />
    </div>
  );
}
