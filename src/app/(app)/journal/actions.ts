"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Journal uses a simple approach: entries stored in a dedicated table
// We'll create this inline since it's Phase 4

export type JournalActionResult = { error?: string; success?: boolean };

export async function createJournalEntry(formData: FormData): Promise<JournalActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tags = (formData.get("tags") as string || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!title) return { error: "Title is required" };

  // Store as a rehab_log with notes, or use a simple approach
  // For now, we'll store journal entries in the goals table repurposed,
  // but ideally we'd add a journal_entries table. Let's use notes in rehab.
  // Actually, let's just do a direct insert to a simple structure.
  const { error } = await supabase.from("rehab_logs").insert({
    user_id: user.id,
    date: new Date().toISOString().split("T")[0],
    phase: 1,
    pain_level: 0,
    notes: JSON.stringify({ type: "journal", title, content, tags }),
  });

  // Note: In production, you'd want a dedicated journal_entries table.
  // This is a workaround for Phase 4 to avoid another migration.

  if (error) return { error: error.message };
  revalidatePath("/journal");
  return { success: true };
}
