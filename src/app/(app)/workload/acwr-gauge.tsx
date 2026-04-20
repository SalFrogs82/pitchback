import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ACWRGauge({ acwr }: { acwr: number | null }) {
  const value = acwr ?? 0;
  const zone = value > 1.5 ? "danger" : value > 1.3 ? "warning" : value >= 0.8 ? "optimal" : "low";

  const zoneConfig = {
    low: { label: "Low", color: "text-blue-500", bg: "bg-blue-500" },
    optimal: { label: "Optimal", color: "text-green-500", bg: "bg-green-500" },
    warning: { label: "Caution", color: "text-yellow-500", bg: "bg-yellow-500" },
    danger: { label: "High Risk", color: "text-red-500", bg: "bg-red-500" },
  };

  const config = zoneConfig[zone];
  const pct = Math.min((value / 2) * 100, 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">ACWR</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {acwr !== null ? (
          <>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${config.color}`}>{value.toFixed(2)}</span>
              <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${config.bg} transition-all`} style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0</span>
              <span className="text-green-500">0.8-1.3</span>
              <span className="text-yellow-500">1.3-1.5</span>
              <span className="text-red-500">&gt;1.5</span>
              <span>2.0</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No workload data yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
