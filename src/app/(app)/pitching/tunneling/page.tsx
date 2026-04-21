import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TunnelingChart } from "./tunneling-chart";

export default async function TunnelingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: pitches } = await supabase
    .from("pitches")
    .select("pitch_type, release_height, release_side, horizontal_break, vertical_break, velocity")
    .eq("user_id", user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Tunneling Analysis</h2>
        <p className="text-sm text-muted-foreground">
          Release point overlap by pitch type. Tighter clustering = better tunneling.
        </p>
      </div>
      <TunnelingChart pitches={pitches ?? []} />
    </div>
  );
}
