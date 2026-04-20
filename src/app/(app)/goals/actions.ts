"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const goalSchema = z.object({
  category: z.enum(["velocity", "movement", "strength", "rehab", "custom"]),
  title: z.string().min(1, "Title is required"),
  start_value: z.coerce.number().optional(),
  current_value: z.coerce.number().optional(),
  target_value: z.coerce.number().optional(),
  unit: z.string().optional(),
  target_date: z.string().optional(),
});

export type GoalActionResult = { error?: string; success?: boolean };

export async function createGoal(formData: FormData): Promise<GoalActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = goalSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("goals").insert({
    ...parsed.data,
    user_id: user.id,
    target_date: parsed.data.target_date || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/goals");
  return { success: true };
}

export async function updateGoalProgress(id: string, currentValue: number): Promise<GoalActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: goal } = await supabase.from("goals").select("target_value").eq("id", id).eq("user_id", user.id).single();

  const status = goal?.target_value !== null && currentValue >= (goal?.target_value ?? Infinity)
    ? "completed"
    : "active";

  const { error } = await supabase
    .from("goals")
    .update({ current_value: currentValue, status })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/goals");
  return { success: true };
}

export async function archiveGoal(id: string): Promise<GoalActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("goals")
    .update({ status: "archived" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/goals");
  return { success: true };
}

export async function deleteGoal(id: string): Promise<GoalActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("goals").delete().eq("id", id).eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/goals");
  return { success: true };
}
