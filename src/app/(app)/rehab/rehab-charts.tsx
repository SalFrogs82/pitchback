"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RehabLog = {
  date: string;
  rom_flexion: number | null;
  rom_extension: number | null;
  pain_level: number | null;
  grip_strength: number | null;
};

export function ROMChart({ data }: { data: RehabLog[] }) {
  const chartData = [...data].reverse().map((d) => ({
    date: d.date.slice(5),
    flexion: d.rom_flexion,
    extension: d.rom_extension,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Range of Motion</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No ROM data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Line type="monotone" dataKey="flexion" stroke="hsl(var(--chart-1))" name="Flexion" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="extension" stroke="hsl(var(--chart-2))" name="Extension" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function PainChart({ data }: { data: RehabLog[] }) {
  const chartData = [...data].reverse().map((d) => ({
    date: d.date.slice(5),
    pain: d.pain_level,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pain Trend</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pain data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis domain={[0, 10]} className="text-xs" />
              <Tooltip />
              <ReferenceLine y={2} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label="Threshold" />
              <defs>
                <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="pain" stroke="hsl(0, 84%, 60%)" fill="url(#painGradient)" name="Pain" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function GripStrengthChart({ data }: { data: RehabLog[] }) {
  const chartData = [...data].reverse().filter((d) => d.grip_strength !== null).map((d) => ({
    date: d.date.slice(5),
    grip: d.grip_strength,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grip Strength</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No grip strength data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Line type="monotone" dataKey="grip" stroke="hsl(var(--chart-3))" name="Grip (lbs)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
