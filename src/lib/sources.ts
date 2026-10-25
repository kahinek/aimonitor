import derivedJson from "../../data/sources-derived.json" with { type: "json" };
import dataJson from "../../data/data.json" with { type: "json" };
import { AREAS, type Area, type Source } from "./types";

type Indicator = {
  area: number;
  area_name: string;
  source_url: string;
};

type DerivedSource = {
  name: string;
  url: string;
  used: string[];
};

const indicators = (dataJson as { indicators: Indicator[] }).indicators;
const derived = derivedJson as DerivedSource[];

function asArea(name: string): Area {
  const match = AREAS.find((area) => area === name);
  if (!match) {
    throw new Error(`Unknown area: ${name}`);
  }
  return match;
}

function areasFromIndicators(url: string): Area[] {
  const hits = indicators
    .filter((indicator) => indicator.source_url === url)
    .sort((a, b) => a.area - b.area);
  const names: Area[] = [];
  for (const hit of hits) {
    const area = asArea(hit.area_name);
    if (!names.includes(area)) names.push(area);
  }
  return names;
}

function areasFromUsed(used: string[]): Area[] {
  if (used.length > 0 && used.every((item) => item.startsWith("Country comparison"))) {
    return ["Country comparison"];
  }
  if (used.includes("Public trust in AI over time")) return ["System effects"];
  if (used.includes("June 2025 business AI use (derived)")) return ["Use"];
  if (used.includes("Three answers to how many people use AI")) return ["Use"];
  return [];
}

export function getSources(): Source[] {
  const sources = derived.map((source) => {
    const fromIndicators = areasFromIndicators(source.url);
    const areas = fromIndicators.length > 0 ? fromIndicators : areasFromUsed(source.used);
    if (areas.length === 0) {
      throw new Error(`No area for source: ${source.name}`);
    }
    return {
      name: source.name,
      url: source.url,
      used: source.used,
      areas,
    };
  });

  sources.sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
  return sources;
}
