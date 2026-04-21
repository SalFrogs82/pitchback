import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GoalForm } from "./goal-form";
import { GoalsList } from "./goals-list";

export default async function GoalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <GoalForm />
      <GoalsList goals={goals ?? []} />
    </div>
  );
}
