export const AREAS = [
  "Access and readiness",
  "Use",
  "Task mix",
  "Outcomes",
  "System effects",
  "Country comparison",
] as const;

export type Area = (typeof AREAS)[number];

export type Source = {
  name: string;
  url: string;
  used: string[];
  areas: Area[];
};
