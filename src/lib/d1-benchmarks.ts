export type Tier = "low" | "average" | "above_average" | "elite";

export type BenchmarkDef = {
  metric: string;
  unit: string;
  tiers: { low: number; average: number; above_average: number; elite: number };
  inverted?: boolean; // lower is better (e.g., changeup spin)
};

export type PitchBenchmarks = {
  pitch_type: string;
  benchmarks: BenchmarkDef[];
};

export const D1_BENCHMARKS: PitchBenchmarks[] = [
  {
    pitch_type: "fastball",
    benchmarks: [
      { metric: "Velocity", unit: "mph", tiers: { low: 55, average: 60, above_average: 62, elite: 64 } },
      { metric: "Spin Rate", unit: "rpm", tiers: { low: 1000, average: 1200, above_average: 1350, elite: 1500 } },
      { metric: "Vertical Break", unit: "in", tiers: { low: -3.0, average: -4.0, above_average: -5.0, elite: -5.8 }, inverted: true },
      { metric: "Horizontal Break", unit: "in", tiers: { low: 2.0, average: 3.0, above_average: 4.0, elite: 4.8 } },
    ],
  },
  {
    pitch_type: "riseball",
    benchmarks: [
      { metric: "Spin Rate", unit: "rpm", tiers: { low: 1100, average: 1300, above_average: 1500, elite: 1700 } },
      { metric: "Vertical Break", unit: "in", tiers: { low: 1.5, average: 2.5, above_average: 3.5, elite: 4.3 } },
    ],
  },
  {
    pitch_type: "dropball",
    benchmarks: [
      { metric: "Spin Rate", unit: "rpm", tiers: { low: 900, average: 1100, above_average: 1250, elite: 1400 } },
      { metric: "Vertical Break", unit: "in", tiers: { low: -5.0, average: -6.5, above_average: -7.5, elite: -8.5 }, inverted: true },
    ],
  },
  {
    pitch_type: "changeup",
    benchmarks: [
      { metric: "Spin Rate", unit: "rpm", tiers: { low: 1000, average: 900, above_average: 800, elite: 725 }, inverted: true },
      { metric: "Vertical Break", unit: "in", tiers: { low: -5.0, average: -6.5, above_average: -7.5, elite: -8.3 }, inverted: true },
      { metric: "HB Blend", unit: "in", tiers: { low: 3.0, average: 2.0, above_average: 1.5, elite: 1.0 }, inverted: true },
    ],
  },
  {
    pitch_type: "curveball",
    benchmarks: [
      { metric: "Spin Rate", unit: "rpm", tiers: { low: 1100, average: 1300, above_average: 1500, elite: 1700 } },
    ],
  },
  {
    pitch_type: "screwball",
    benchmarks: [
      { metric: "Spin Rate", unit: "rpm", tiers: { low: 1000, average: 1200, above_average: 1400, elite: 1560 } },
    ],
  },
];

export const NORMALIZED_SPIN_BENCHMARKS = {
  metric: "Normalized Spin (RPM/MPH)",
  baseline: 17,
  above_average: 21,
  elite: 23,
};

export function getTier(value: number, tiers: BenchmarkDef["tiers"], inverted?: boolean): Tier {
  if (inverted) {
    if (value <= tiers.elite) return "elite";
    if (value <= tiers.above_average) return "above_average";
    if (value <= tiers.average) return "average";
    return "low";
  }
  if (value >= tiers.elite) return "elite";
  if (value >= tiers.above_average) return "above_average";
  if (value >= tiers.average) return "average";
  return "low";
}

export const TIER_COLORS: Record<Tier, string> = {
  low: "text-red-500 bg-red-500/10",
  average: "text-yellow-600 bg-yellow-500/10",
  above_average: "text-blue-500 bg-blue-500/10",
  elite: "text-green-500 bg-green-500/10",
};

export const TIER_LABELS: Record<Tier, string> = {
  low: "Low",
  average: "Average",
  above_average: "Above Avg",
  elite: "Elite",
};
