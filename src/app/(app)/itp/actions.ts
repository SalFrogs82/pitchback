"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PAIN_FREE_DAYS_TO_ADVANCE } from "@/lib/itp-steps";

const itpSessionSchema = z.object({
  date: z.string().min(1),
  step: z.coerce.number().int().min(1).max(13),
  distance: z.coerce.number().int().optional(),
  throw_count: z.coerce.number().int().optional(),
  intensity_pct: z.coerce.number().int().min(0).max(100).optional(),
  pain_level: z.coerce.number().int().min(0).max(10),
  notes: z.string().optional(),
});

export type ITPActionResult = { error?: string; success?: boolean };

export async function createITPSession(formData: FormData): Promise<ITPActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = itpSessionSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Check advancement eligibility: need PAIN_FREE_DAYS_TO_ADVANCE consecutive pain-free sessions at current step
  if (parsed.data.step > 1) {
    const { data: recentSessions } = await supabase
      .from("itp_sessions")
      .select("pain_level, step")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(PAIN_FREE_DAYS_TO_ADVANCE);

    const prevStep = parsed.data.step - 1;
    if (recentSessions) {
      const atPrevStep = recentSessions.filter((s) => s.step === prevStep);
      const painFreeDays = atPrevStep.filter((s) => s.pain_level !== null && s.pain_level <= 2).length;
      const isAdvancing = parsed.data.step > (recentSessions[0]?.step ?? 0);

      if (isAdvancing && painFreeDays < PAIN_FREE_DAYS_TO_ADVANCE) {
        return {
          error: `Need ${PAIN_FREE_DAYS_TO_ADVANCE} consecutive pain-free sessions (pain ≤ 2) at Step ${prevStep} before advancing.`,
        };
      }
    }
  }

  const advanced = parsed.data.pain_level <= 2;

  const { error } = await supabase.from("itp_sessions").insert({
    ...parsed.data,
    user_id: user.id,
    advanced,
  });

  if (error) return { error: error.message };
  revalidatePath("/itp");
  return { success: true };
}
