export const PITCH_TYPES = [
  "fastball",
  "changeup",
  "riseball",
  "curveball",
  "dropball",
  "screwball",
] as const;

export type PitchType = (typeof PITCH_TYPES)[number];

export const PITCH_TYPE_COLORS: Record<PitchType, string> = {
  fastball: "#ef4444",
  changeup: "#22c55e",
  riseball: "#3b82f6",
  curveball: "#a855f7",
  dropball: "#f97316",
  screwball: "#06b6d4",
};

export const PITCH_TYPE_LABELS: Record<PitchType, string> = {
  fastball: "Fastball",
  changeup: "Changeup",
  riseball: "Riseball",
  curveball: "Curveball",
  dropball: "Dropball",
  screwball: "Screwball",
};
