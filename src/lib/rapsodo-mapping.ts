export const RAPSODO_COLUMN_MAP: Record<string, string> = {
  "Velocity": "velocity",
  "Total Spin": "spin_rate",
  "True Spin": "true_spin",
  "Spin Efficiency": "spin_efficiency",
  "Spin Direction": "spin_direction",
  "Gyro Degree": "gyro_degree",
  "HB": "horizontal_break",
  "VB": "vertical_break",
  "Horizontal Break": "horizontal_break",
  "Vertical Break": "vertical_break",
  "Release Height": "release_height",
  "Release Side": "release_side",
  "Extension": "extension",
  "Strike Zone": "strike_zone",
  "Pitch Type": "pitch_type",
  "Pitch No": "pitch_number",
  "Pitch No.": "pitch_number",
};

const PITCH_TYPE_NORMALIZE: Record<string, string> = {
  "fastball": "fastball",
  "fb": "fastball",
  "fast ball": "fastball",
  "changeup": "changeup",
  "ch": "changeup",
  "change up": "changeup",
  "change-up": "changeup",
  "riseball": "riseball",
  "rb": "riseball",
  "rise ball": "riseball",
  "rise": "riseball",
  "curveball": "curveball",
  "cb": "curveball",
  "curve ball": "curveball",
  "curve": "curveball",
  "dropball": "dropball",
  "db": "dropball",
  "drop ball": "dropball",
  "drop": "dropball",
  "screwball": "screwball",
  "sb": "screwball",
  "screw ball": "screwball",
  "screw": "screwball",
};

export function normalizePitchType(raw: string): string | null {
  return PITCH_TYPE_NORMALIZE[raw.toLowerCase().trim()] ?? null;
}

export const METADATA_ROWS_TO_SKIP = 4;
