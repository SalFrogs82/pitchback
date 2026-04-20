"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().optional(),
  surgery_date: z.string().optional(),
  target_return_date: z.string().optional(),
  throw_hand: z.enum(["left", "right"]).optional(),
});

export type SettingsResult = { error?: string; success?: boolean };

export async function updateProfile(formData: FormData): Promise<SettingsResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("profiles").update({
    full_name: parsed.data.full_name || null,
    surgery_date: parsed.data.surgery_date || null,
    target_return_date: parsed.data.target_return_date || null,
    throw_hand: parsed.data.throw_hand || null,
  }).eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}
