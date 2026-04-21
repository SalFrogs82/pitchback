"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const exerciseSchema = z.object({
  exercise_name: z.string().min(1),
  sets: z.coerce.number().int().min(1),
  reps: z.coerce.number().int().min(1),
  weight: z.coerce.number().min(0),
  rpe: z.coerce.number().int().min(1).max(10).optional(),
  set_type: z.string().optional(),
});

const sessionSchema = z.object({
  date: z.string().min(1),
  body_weight: z.coerce.number().optional(),
  session_name: z.string().optional(),
});

export type StrengthActionResult = { error?: string; success?: boolean };

export async function createStrengthSession(
  sessionData: { date: string; body_weight?: number; session_name?: string },
  exercises: Array<{ exercise_name: string; sets: number; reps: number; weight: number; rpe?: number; set_type?: string }>
): Promise<StrengthActionResult> {
  const parsedSession = sessionSchema.safeParse(sessionData);
  if (!parsedSession.success) return { error: parsedSession.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: session, error: sessionError } = await supabase
    .from("strength_sessions")
    .insert({
      user_id: user.id,
      date: parsedSession.data.date,
      body_weight: parsedSession.data.body_weight ?? null,
      session_name: parsedSession.data.session_name ?? null,
    })
    .select("id")
    .single();

  if (sessionError || !session) return { error: sessionError?.message ?? "Failed to create session" };

  if (exercises.length > 0) {
    const rows = exercises.map((ex, i) => ({
      session_id: session.id,
      user_id: user.id,
      exercise_name: ex.exercise_name,
      sets: ex.sets,
      reps: ex.reps,
      weight: ex.weight,
      rpe: ex.rpe ?? null,
      set_type: ex.set_type ?? null,
      sort_order: i,
    }));

    const { error } = await supabase.from("strength_exercises").insert(rows);
    if (error) return { error: error.message };
  }

  revalidatePath("/strength");
  return { success: true };
}

const powerTestSchema = z.object({
  date: z.string().min(1),
  test_type: z.enum(["broad_jump", "vertical_jump", "rotational_mb_throw", "grip_strength"]),
  value: z.coerce.number(),
  unit: z.string().min(1),
  bilateral_side: z.enum(["left", "right", "both"]).optional(),
});

export async function logPowerTest(formData: FormData): Promise<StrengthActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = powerTestSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("power_tests").insert({
    ...parsed.data,
    user_id: user.id,
    bilateral_side: parsed.data.bilateral_side ?? "both",
  });

  if (error) return { error: error.message };
  revalidatePath("/strength/power");
  return { success: true };
}

export async function upsertWeeklyWorkload(formData: FormData): Promise<StrengthActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const week_start = raw.week_start as string;
  const pitch_count = Number(raw.pitch_count) || 0;
  const throwing_sessions = Number(raw.throwing_sessions) || 0;

  if (!week_start) return { error: "Week start date is required" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Calculate ACWR: current week / 4-week rolling average
  const { data: recent } = await supabase
    .from("workload_weekly")
    .select("pitch_count")
    .eq("user_id", user.id)
    .order("week_start", { ascending: false })
    .limit(4);

  const recentCounts = recent?.map((r) => r.pitch_count ?? 0) ?? [];
  const chronicAvg = recentCounts.length > 0
    ? recentCounts.reduce((a, b) => a + b, 0) / recentCounts.length
    : pitch_count;
  const acwr = chronicAvg > 0 ? pitch_count / chronicAvg : 1.0;

  const { error } = await supabase.from("workload_weekly").upsert(
    { user_id: user.id, week_start, pitch_count, throwing_sessions, acwr },
    { onConflict: "user_id,week_start" }
  );

  if (error) return { error: error.message };
  revalidatePath("/workload");
  return { success: true };
}
