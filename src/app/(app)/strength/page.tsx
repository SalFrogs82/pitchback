import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { WorkoutForm } from "./workout-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StrengthPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sessions } = await supabase
    .from("strength_sessions")
    .select("*, strength_exercises(*)")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <WorkoutForm />

      <Card>
        <CardHeader>
          <CardTitle>Workout History</CardTitle>
        </CardHeader>
        <CardContent>
          {!sessions || sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No workouts logged yet.</p>
          ) : (
            <div className="space-y-4">
              {sessions.map((s) => {
                const exercises = ((s as Record<string, unknown>).strength_exercises ?? []) as Array<{
                  id: string; exercise_name: string; sets: number; reps: number; weight: number; rpe: number | null;
                }>;
                return (
                  <div key={s.id} className="rounded-lg border p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-medium">{format(new Date(s.date), "MMM d, yyyy")}</span>
                        {s.session_name ? (
                          <span className="text-sm text-muted-foreground ml-2">{s.session_name}</span>
                        ) : null}
                      </div>
                      {s.body_weight ? (
                        <span className="text-sm text-muted-foreground">{s.body_weight} lbs</span>
                      ) : null}
                    </div>
                    <div className="space-y-1">
                      {exercises.map((ex) => (
                        <div key={ex.id} className="text-sm flex gap-2">
                          <span className="font-medium">{ex.exercise_name}</span>
                          <span className="text-muted-foreground">
                            {ex.sets}x{ex.reps} @ {ex.weight} lbs
                            {ex.rpe ? ` RPE ${ex.rpe}` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
