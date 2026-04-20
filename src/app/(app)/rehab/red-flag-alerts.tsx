import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RehabLog = {
  date: string;
  pain_level: number | null;
  grip_strength: number | null;
  rom_flexion: number | null;
  rom_extension: number | null;
};

type Alert = { message: string; severity: "warning" | "danger" };

export function RedFlagAlerts({ logs }: { logs: RehabLog[] }) {
  const alerts: Alert[] = [];

  if (logs.length > 0 && logs[0].pain_level !== null && logs[0].pain_level > 2) {
    alerts.push({ message: `Pain level ${logs[0].pain_level}/10 on ${logs[0].date}`, severity: "danger" });
  }

  if (logs.length >= 2) {
    const [latest, prev] = logs;
    if (latest.grip_strength !== null && prev.grip_strength !== null && prev.grip_strength > 0) {
      const drop = ((prev.grip_strength - latest.grip_strength) / prev.grip_strength) * 100;
      if (drop > 10) {
        alerts.push({ message: `Grip strength dropped ${drop.toFixed(0)}% since last entry`, severity: "warning" });
      }
    }
    if (latest.rom_flexion !== null && prev.rom_flexion !== null && latest.rom_flexion < prev.rom_flexion) {
      alerts.push({ message: `ROM flexion regressed: ${latest.rom_flexion}° (was ${prev.rom_flexion}°)`, severity: "warning" });
    }
  }

  if (alerts.length === 0) return null;

  return (
    <Card className="border-destructive/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          Red Flags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {alerts.map((a, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className={a.severity === "danger" ? "text-destructive" : "text-yellow-600"}>&#x2022;</span>
              {a.message}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
