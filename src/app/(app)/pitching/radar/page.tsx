import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PitchRadar } from "./pitch-radar";

export default async function RadarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: pitches } = await supabase
    .from("pitches")
    .select("pitch_type, velocity, spin_rate, vertical_break, horizontal_break, spin_efficiency")
    .eq("user_id", user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Pitch Radar</h2>
        <p className="text-sm text-muted-foreground">
          Normalized 0-100 using D1 benchmarks. One polygon per pitch type.
        </p>
      </div>
      <PitchRadar pitches={pitches ?? []} />
    </div>
  );
}
