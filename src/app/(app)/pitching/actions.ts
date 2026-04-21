"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type PitchingActionResult = { error?: string; success?: boolean; sessionId?: string };

export async function createPitchSession(
  data: {
    date: string;
    session_type?: string;
    location?: string;
    notes?: string;
    csv_file_url?: string;
  },
  pitches: Array<Record<string, unknown>>
): Promise<PitchingActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: session, error: sessionError } = await supabase
    .from("pitch_sessions")
    .insert({
      user_id: user.id,
      date: data.date,
      session_type: data.session_type || null,
      location: data.location || null,
      notes: data.notes || null,
      csv_file_url: data.csv_file_url || null,
      total_pitches: pitches.length,
    })
    .select("id")
    .single();

  if (sessionError || !session) return { error: sessionError?.message ?? "Failed to create session" };

  if (pitches.length > 0) {
    const pitchRows = pitches.map((p, i) => ({
      session_id: session.id,
      user_id: user.id,
      pitch_number: (p.pitch_number as number) || i + 1,
      pitch_type: (p.pitch_type as string) || null,
      velocity: p.velocity != null ? Number(p.velocity) : null,
      spin_rate: p.spin_rate != null ? Number(p.spin_rate) : null,
      true_spin: p.true_spin != null ? Number(p.true_spin) : null,
      spin_efficiency: p.spin_efficiency != null ? Number(p.spin_efficiency) : null,
      spin_direction: p.spin_direction != null ? Number(p.spin_direction) : null,
      gyro_degree: p.gyro_degree != null ? Number(p.gyro_degree) : null,
      horizontal_break: p.horizontal_break != null ? Number(p.horizontal_break) : null,
      vertical_break: p.vertical_break != null ? Number(p.vertical_break) : null,
      release_height: p.release_height != null ? Number(p.release_height) : null,
      release_side: p.release_side != null ? Number(p.release_side) : null,
      extension: p.extension != null ? Number(p.extension) : null,
      strike_zone: (p.strike_zone as string) || null,
    }));

    const { error: pitchError } = await supabase.from("pitches").insert(pitchRows);
    if (pitchError) return { error: pitchError.message };
  }

  revalidatePath("/pitching");
  return { success: true, sessionId: session.id };
}

export async function deletePitchSession(sessionId: string): Promise<PitchingActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("pitch_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/pitching");
  return { success: true };
}
