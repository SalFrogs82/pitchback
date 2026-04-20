export type ITPStepDef = {
  step: number;
  distance: number;
  throws: number;
  intensity: number;
  label: string;
};

export const ITP_STEPS: ITPStepDef[] = [
  { step: 1,  distance: 30,  throws: 25, intensity: 50,  label: "30 ft / 25 throws / 50%" },
  { step: 2,  distance: 45,  throws: 25, intensity: 50,  label: "45 ft / 25 throws / 50%" },
  { step: 3,  distance: 60,  throws: 25, intensity: 50,  label: "60 ft / 25 throws / 50%" },
  { step: 4,  distance: 60,  throws: 25, intensity: 75,  label: "60 ft / 25 throws / 75%" },
  { step: 5,  distance: 90,  throws: 25, intensity: 50,  label: "90 ft / 25 throws / 50%" },
  { step: 6,  distance: 90,  throws: 25, intensity: 75,  label: "90 ft / 25 throws / 75%" },
  { step: 7,  distance: 120, throws: 25, intensity: 50,  label: "120 ft / 25 throws / 50%" },
  { step: 8,  distance: 120, throws: 25, intensity: 75,  label: "120 ft / 25 throws / 75%" },
  { step: 9,  distance: 120, throws: 25, intensity: 100, label: "120 ft / 25 throws / 100%" },
  { step: 10, distance: 0,   throws: 15, intensity: 50,  label: "Mound 50% / 15 pitches" },
  { step: 11, distance: 0,   throws: 25, intensity: 75,  label: "Mound 75% / 25 pitches" },
  { step: 12, distance: 0,   throws: 25, intensity: 85,  label: "Mound 85% / 25 pitches" },
  { step: 13, distance: 0,   throws: 25, intensity: 100, label: "Mound 100% / 25 pitches" },
];

export const PAIN_FREE_DAYS_TO_ADVANCE = 2;
