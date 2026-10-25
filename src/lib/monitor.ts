import dataJson from "../../data/data.json" with { type: "json" };

export const AREA_ORDER = [1, 2, 3, 4, 5] as const;

export const AREA_NAME: Record<number, string> = Object.fromEntries(
  (dataJson as { indicators: { area: number; area_name: string }[] }).indicators.map((row) => [
    Number(row.area),
    row.area_name,
  ]),
);

export const AREA_WHAT: Record<number, string> = {
  1: "Who could use AI: connectivity, skills, policies and licences.",
  2: "Who does use it, how often and how deeply.",
  3: "What it is used for, and whether it helps people work or replaces their work.",
  4: "Time, quality, cost, service levels and new products.",
  5: "Productivity, jobs and skills, who benefits and who is left behind, incidents and trust.",
};

export const STATUS_TEXT: Record<string, string> = {
  Available: "Measured: a published UK figure exists",
  Partial: "Partly measured: a figure exists but is dated, one-off or self-reported",
  "Target only": "Not measured: a target exists, with no published progress",
  "Not covered": "Not measured: the indices that cover other countries do not cover this",
  "Needs survey": "Not measured: needs a survey question",
  "Needs data-sharing": "Not measured: needs organisations or vendors to share data",
};

export const STATUS_ORDER = [
  "Available",
  "Partial",
  "Target only",
  "Not covered",
  "Needs survey",
  "Needs data-sharing",
] as const;

export type Family = "measured" | "partial" | "blind";

export type Indicator = {
  id: string;
  area: number;
  area_name: string;
  indicator: string;
  definition: string;
  uk_figure: string;
  status: string;
  measures_use: string;
  source: string;
  source_url: string;
  note: string;
};

export type Reading = {
  value: string;
  text: string;
  source: string;
  url: string;
};

export type AreaBrief = {
  area: number;
  question: string;
  reading: string;
  gap: string;
};

export type TrendPoint = { period: string; label: string; share_pct: number };
export type GroupPoint = { group: string; share_pct: number };
export type PeoplePoint = {
  estimate: string;
  population: string;
  period: string;
  share_pct: number;
};
export type AgePoint = { age: string; share_pct: number };
export type TrustPoint = { measure: string; date: string; share_pct: number };

export type DiffusionRow = { economy: string; h1_2025: number; q2_2026: number };
export type CompareRow = { area: number; question: string };
export type CompareCell = { status: string; text: string; url: string | null };
export type NationalRow = {
  country: string;
  figure: string;
  measures: string;
  population: string;
  period: string;
  source: string;
  url: string;
};

type MonitorFile = {
  indicators: Indicator[];
  bics_trend: TrendPoint[];
  bics_groups: GroupPoint[];
  people_estimates: PeoplePoint[];
  age_use: AgePoint[];
  trust: TrustPoint[];
  readings: Reading[];
  areas: AreaBrief[];
  compare: {
    diffusion: DiffusionRow[];
    countries: string[];
    rows: CompareRow[];
    cells: Record<string, CompareCell[]>;
    national: NationalRow[];
  };
};

const data = dataJson as MonitorFile;

export function family(status: string): Family {
  if (status === "Available") return "measured";
  if (status === "Partial") return "partial";
  return "blind";
}

export function familyLabel(kind: Family): string {
  if (kind === "measured") return "Measured";
  if (kind === "partial") return "Partly measured";
  return "Not measured";
}

export function formatShare(value: number): string {
  return `${Number.isInteger(value) ? String(value) : value.toFixed(1)}%`;
}

export function getIndicators(): Indicator[] {
  return data.indicators.map((row) => ({ ...row, area: Number(row.area) }));
}

export function getReadings(): Reading[] {
  return data.readings;
}

export function getAreaBriefs(): AreaBrief[] {
  return data.areas;
}

export function getCharts() {
  return {
    bicsTrend: data.bics_trend,
    bicsGroups: data.bics_groups,
    people: data.people_estimates,
    age: data.age_use,
    trust: data.trust,
  };
}

export function getCompare() {
  return data.compare;
}

export function countByFamily(indicators: Indicator[]) {
  return {
    total: indicators.length,
    measured: indicators.filter((row) => family(row.status) === "measured").length,
    partial: indicators.filter((row) => family(row.status) === "partial").length,
    blind: indicators.filter((row) => family(row.status) === "blind").length,
  };
}

export function statusNote(status: string, count: number): string {
  const detail = STATUS_TEXT[status]?.split(": ")[1] ?? status;
  const sentence = detail.charAt(0).toUpperCase() + detail.slice(1);
  const noun = count === 1 ? "indicator" : "indicators";
  return `${sentence}. ${count} ${noun}.`;
}
