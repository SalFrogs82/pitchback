"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const rehabLogSchema = z.object({
  date: z.string().min(1),
  phase: z.coerce.number().int().min(1).max(5),
  rom_flexion: z.coerce.number().optional(),
  rom_extension: z.coerce.number().optional(),
  pain_level: z.coerce.number().int().min(0).max(10),
  grip_strength: z.coerce.number().optional(),
  notes: z.string().optional(),
});

const wellnessLogSchema = z.object({
  date: z.string().min(1),
  sleep_hours: z.coerce.number().min(0).max(24).optional(),
  sleep_quality: z.coerce.number().int().min(1).max(5).optional(),
  mood: z.coerce.number().int().min(1).max(5).optional(),
  soreness: z.coerce.number().int().min(1).max(5).optional(),
  energy: z.coerce.number().int().min(1).max(5).optional(),
});

export type ActionResult = { error?: string; success?: boolean };

export async function upsertRehabLog(formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = rehabLogSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("rehab_logs").upsert(
    { ...parsed.data, user_id: user.id },
    { onConflict: "user_id,date" }
  );

  if (error) return { error: error.message };
  revalidatePath("/rehab");
  return { success: true };
}

export async function upsertWellnessLog(formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = wellnessLogSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("wellness_logs").upsert(
    { ...parsed.data, user_id: user.id },
    { onConflict: "user_id,date" }
  );

  if (error) return { error: error.message };
  revalidatePath("/rehab");
  return { success: true };
}
