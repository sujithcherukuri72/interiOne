export type JourneyPhase = {
  step: string;          // "01" … "08"
  title: string;
  subtitle: string;
  dayRange: string;      // e.g. "Day 0–15"
  detail: string;
  payment?: string;      // e.g. "10% booking fee"
};
