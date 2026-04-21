import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PowerTestForm } from "./power-test-form";
import { PowerTestResults } from "./power-test-results";

export default async function PowerTestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tests } = await supabase
    .from("power_tests")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  return (
    <div className="space-y-6">
      <PowerTestForm />
      <PowerTestResults tests={tests ?? []} />
    </div>
  );
}
