import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, ChevronRight } from "lucide-react";
import { PITCH_TYPE_LABELS, type PitchType } from "@/lib/pitch-types";

export default async function PitchingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sessions } = await supabase
    .from("pitch_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  // Fetch per-session pitch type averages
  const sessionIds = sessions?.map((s) => s.id) ?? [];
  let pitchSummaries: Record<string, Array<{ pitch_type: string; avg_velocity: number; count: number }>> = {};

  if (sessionIds.length > 0) {
    const { data: pitches } = await supabase
      .from("pitches")
      .select("session_id, pitch_type, velocity")
      .in("session_id", sessionIds);

    if (pitches) {
      const grouped: Record<string, Record<string, { total: number; count: number }>> = {};
      for (const p of pitches) {
        if (!p.pitch_type || p.velocity == null) continue;
        if (!grouped[p.session_id]) grouped[p.session_id] = {};
        if (!grouped[p.session_id][p.pitch_type]) grouped[p.session_id][p.pitch_type] = { total: 0, count: 0 };
        grouped[p.session_id][p.pitch_type].total += p.velocity;
        grouped[p.session_id][p.pitch_type].count += 1;
      }
      for (const [sid, types] of Object.entries(grouped)) {
        pitchSummaries[sid] = Object.entries(types).map(([pt, { total, count }]) => ({
          pitch_type: pt,
          avg_velocity: total / count,
          count,
        }));
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pitching Sessions</h2>
        <Button asChild>
          <Link href="/pitching/upload">
            <Upload className="h-4 w-4 mr-2" /> Upload CSV
          </Link>
        </Button>
      </div>

      {!sessions || sessions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No sessions yet. Upload a Rapsodo CSV to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const summary = pitchSummaries[session.id] ?? [];
            return (
              <Link key={session.id} href={`/pitching/session/${session.id}`}>
                <Card className="hover:bg-accent/50 transition-colors">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{format(new Date(session.date), "MMM d, yyyy")}</span>
                        {session.session_type && (
                          <Badge variant="secondary">{session.session_type}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{session.total_pitches ?? 0} pitches</span>
                        {session.location && <span>{session.location}</span>}
                      </div>
                      {summary.length > 0 && (
                        <div className="flex gap-2 mt-1">
                          {summary.map((s) => (
                            <span key={s.pitch_type} className="text-xs text-muted-foreground">
                              {PITCH_TYPE_LABELS[s.pitch_type as PitchType] ?? s.pitch_type}{" "}
                              {s.avg_velocity.toFixed(1)} mph
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
