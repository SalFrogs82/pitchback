import { differenceInWeeks } from "date-fns";

export type RehabPhase = {
  phase: number;
  name: string;
  weekRange: string;
  description: string;
};

export const REHAB_PHASES: RehabPhase[] = [
  { phase: 1, name: "Protection", weekRange: "0-6 weeks", description: "Immobilization & gentle ROM" },
  { phase: 2, name: "Early Motion", weekRange: "6-12 weeks", description: "Progressive ROM & light strengthening" },
  { phase: 3, name: "Strengthening", weekRange: "12-20 weeks", description: "Progressive resistance & endurance" },
  { phase: 4, name: "Return to Throwing", weekRange: "20-32 weeks", description: "ITP & sport-specific training" },
  { phase: 5, name: "Return to Competition", weekRange: "32+ weeks", description: "Full activity & performance" },
];

export function calculatePhase(surgeryDate: string | null): number {
  if (!surgeryDate) return 1;
  const weeks = differenceInWeeks(new Date(), new Date(surgeryDate));
  if (weeks < 6) return 1;
  if (weeks < 12) return 2;
  if (weeks < 20) return 3;
  if (weeks < 32) return 4;
  return 5;
}
