import type { Source } from "./types";

export function normalise(value: string): string {
  return value
    .toLocaleLowerCase("en-GB")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

export function filterSources(sources: Source[], query: string, area: string): Source[] {
  const needle = normalise(query);
  return sources.filter((source) => {
    if (area !== "all" && !source.areas.includes(area as Source["areas"][number])) {
      return false;
    }
    if (!needle) return true;
    const haystack = normalise(`${source.name} ${source.used.join(" ")}`);
    return haystack.includes(needle);
  });
}

export function usedForLine(source: Pick<Source, "used">): string {
  return `Used for: ${source.used.join("; ")}`;
}
