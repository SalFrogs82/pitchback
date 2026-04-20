export const EXERCISE_CATALOG = [
  // Lower Body
  "Back Squat", "Front Squat", "Goblet Squat", "Bulgarian Split Squat",
  "Romanian Deadlift", "Conventional Deadlift", "Trap Bar Deadlift", "Sumo Deadlift",
  "Hip Thrust", "Barbell Hip Thrust", "Glute Bridge",
  "Leg Press", "Leg Extension", "Leg Curl", "Nordic Hamstring Curl",
  "Walking Lunge", "Reverse Lunge", "Step Up", "Box Jump",
  "Calf Raise",

  // Upper Body - Push
  "Bench Press", "Incline Bench Press", "Dumbbell Bench Press",
  "Overhead Press", "Dumbbell Shoulder Press", "Push Up",
  "Dips", "Landmine Press",

  // Upper Body - Pull
  "Pull Up", "Chin Up", "Lat Pulldown", "Barbell Row", "Dumbbell Row",
  "Cable Row", "Face Pull", "Band Pull Apart",

  // Core & Rotational
  "Pallof Press", "Cable Rotation", "Medicine Ball Slam",
  "Medicine Ball Rotational Throw", "Plank", "Dead Bug", "Bird Dog",
  "Ab Wheel Rollout", "Hanging Leg Raise",

  // Arm Care
  "External Rotation", "Internal Rotation", "Wrist Curl", "Reverse Wrist Curl",
  "Pronation/Supination",
] as const;

export const BW_BENCHMARKS: Record<string, { developing: number; competitive: [number, number]; elite: number }> = {
  "Back Squat": { developing: 1.0, competitive: [1.3, 1.5], elite: 1.8 },
  "Front Squat": { developing: 0.85, competitive: [1.0, 1.3], elite: 1.5 },
  "Conventional Deadlift": { developing: 1.2, competitive: [1.5, 1.8], elite: 2.0 },
  "Trap Bar Deadlift": { developing: 1.2, competitive: [1.5, 1.8], elite: 2.0 },
  "Bench Press": { developing: 0.5, competitive: [0.65, 0.8], elite: 0.85 },
  "Hip Thrust": { developing: 1.2, competitive: [1.5, 2.0], elite: 2.0 },
};

// Epley formula: e1RM = weight × (1 + reps/30)
export function estimateE1RM(weight: number, reps: number): number {
  if (reps <= 0) return weight;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}
