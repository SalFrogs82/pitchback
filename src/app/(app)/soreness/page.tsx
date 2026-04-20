"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BODY_REGIONS = [
  { id: "shoulder_r", label: "R Shoulder", cx: 175, cy: 95 },
  { id: "shoulder_l", label: "L Shoulder", cx: 105, cy: 95 },
  { id: "elbow_r", label: "R Elbow", cx: 195, cy: 150 },
  { id: "elbow_l", label: "L Elbow", cx: 85, cy: 150 },
  { id: "wrist_r", label: "R Wrist", cx: 210, cy: 200 },
  { id: "wrist_l", label: "L Wrist", cx: 70, cy: 200 },
  { id: "upper_back", label: "Upper Back", cx: 140, cy: 110 },
  { id: "lower_back", label: "Lower Back", cx: 140, cy: 165 },
  { id: "hip_r", label: "R Hip", cx: 160, cy: 210 },
  { id: "hip_l", label: "L Hip", cx: 120, cy: 210 },
  { id: "knee_r", label: "R Knee", cx: 160, cy: 280 },
  { id: "knee_l", label: "L Knee", cx: 120, cy: 280 },
  { id: "ankle_r", label: "R Ankle", cx: 160, cy: 340 },
  { id: "ankle_l", label: "L Ankle", cx: 120, cy: 340 },
];

const SEVERITY_COLORS = [
  "fill-green-400",
  "fill-yellow-400",
  "fill-orange-400",
  "fill-red-400",
  "fill-red-600",
];

export default function SorenessPage() {
  const [soreness, setSoreness] = useState<Record<string, number>>({});

  const handleTap = (id: string) => {
    setSoreness((prev) => {
      const current = prev[id] ?? 0;
      const next = current >= 5 ? 0 : current + 1;
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Soreness Body Map</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Tap a region to cycle severity (0-5). Tap again to clear.</p>
          <svg viewBox="0 0 280 380" className="w-full max-w-xs mx-auto">
            {/* Body outline */}
            <ellipse cx="140" cy="40" rx="25" ry="30" className="fill-none stroke-muted-foreground stroke-1" />
            <rect x="110" y="70" width="60" height="80" rx="10" className="fill-none stroke-muted-foreground stroke-1" />
            <rect x="70" y="75" width="40" height="15" rx="7" className="fill-none stroke-muted-foreground stroke-1" />
            <rect x="170" y="75" width="40" height="15" rx="7" className="fill-none stroke-muted-foreground stroke-1" />
            <line x1="85" y1="90" x2="75" y2="200" className="stroke-muted-foreground stroke-1" />
            <line x1="195" y1="90" x2="205" y2="200" className="stroke-muted-foreground stroke-1" />
            <rect x="115" y="150" width="50" height="70" rx="5" className="fill-none stroke-muted-foreground stroke-1" />
            <line x1="130" y1="220" x2="125" y2="340" className="stroke-muted-foreground stroke-1" />
            <line x1="150" y1="220" x2="155" y2="340" className="stroke-muted-foreground stroke-1" />

            {/* Clickable regions */}
            {BODY_REGIONS.map((region) => {
              const severity = soreness[region.id] ?? 0;
              return (
                <g key={region.id} onClick={() => handleTap(region.id)} className="cursor-pointer">
                  <circle
                    cx={region.cx}
                    cy={region.cy}
                    r={14}
                    className={severity > 0 ? SEVERITY_COLORS[severity - 1] : "fill-muted/40"}
                    opacity={severity > 0 ? 0.8 : 0.4}
                  />
                  {severity > 0 && (
                    <text x={region.cx} y={region.cy + 4} textAnchor="middle" className="fill-foreground text-[10px] font-bold select-none">
                      {severity}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="flex justify-center gap-2 mt-4 text-xs">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`h-3 w-3 rounded-full ${SEVERITY_COLORS[s - 1].replace("fill-", "bg-")}`} />
                <span>{s}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1">
            {Object.entries(soreness)
              .filter(([, v]) => v > 0)
              .map(([id, level]) => {
                const region = BODY_REGIONS.find((r) => r.id === id);
                return (
                  <div key={id} className="flex justify-between text-sm">
                    <span>{region?.label ?? id}</span>
                    <span className="font-medium">{level}/5</span>
                  </div>
                );
              })}
          </div>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setSoreness({})}
          >
            Clear All
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
