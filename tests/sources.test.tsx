import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import derived from "../data/sources-derived.json" with { type: "json" };
import { SourceIndex, SourceList } from "../src/components/SourceIndex.tsx";
import { filterSources, usedForLine } from "../src/lib/filter.ts";
import { getSources } from "../src/lib/sources.ts";

const derivedSources = derived as { name: string; url: string; used: string[] }[];

describe("sources", () => {
  const sources = getSources();

  it("lists all 23 derived sources with the same links and used-for lines", () => {
    assert.equal(derivedSources.length, 23);
    assert.equal(sources.length, 23);

    const expectedNames = derivedSources
      .map((source) => source.name)
      .sort((a, b) => a.localeCompare(b, "en-GB"));
    assert.deepEqual(
      sources.map((source) => source.name),
      expectedNames,
    );

    for (const item of derivedSources) {
      const match = sources.find((source) => source.url === item.url);
      assert.ok(match, item.url);
      assert.equal(match.name, item.name);
      assert.deepEqual(match.used, item.used);
      assert.equal(usedForLine(match), `Used for: ${item.used.join("; ")}`);
      assert.ok(item.url.startsWith("https://"));
      assert.ok(match.areas.length > 0);
    }
  });

  it("assigns indicator areas and country comparison", () => {
    const byName = new Map(sources.map((source) => [source.name, source]));
    assert.deepEqual(byName.get("ONS Business Insights and Conditions Survey, wave 165")?.areas, [
      "Use",
      "Task mix",
      "System effects",
    ]);
    assert.deepEqual(
      byName.get("DSIT Artificial Intelligence sector study 2024 (Sep 2025)")?.areas,
      ["Access and readiness", "Outcomes"],
    );
    assert.deepEqual(byName.get("ABS: Business adoption of AI accelerates in 2024–25")?.areas, [
      "Country comparison",
    ]);
    assert.deepEqual(byName.get("Ofcom, Adults' Media Use and Attitudes Report 2026")?.areas, [
      "Use",
    ]);
    assert.deepEqual(byName.get("ONS Opinions and Lifestyle Survey, August 2025")?.areas, [
      "System effects",
    ]);
    assert.equal(sources.filter((source) => source.areas.includes("Use")).length, 7);
    assert.equal(sources.filter((source) => source.areas.includes("Country comparison")).length, 8);
  });

  it("filters by name, used-for text, and area, including no results", () => {
    assert.equal(filterSources(sources, "no-such-publisher-zz", "all").length, 0);
    const hiring = filterSources(sources, "hiring", "all");
    assert.equal(hiring.length, 1);
    assert.equal(hiring[0]?.name, "Bank Underground (Bank of England staff blog), Aug 2026");

    const use = filterSources(sources, "", "Use");
    assert.equal(use.length, 7);
    assert.ok(use.every((source) => source.areas.includes("Use")));
    assert.ok(!use.some((source) => source.name.startsWith("ABS")));

    const trust = filterSources(sources, "trust", "System effects");
    assert.ok(trust.length >= 1);
    assert.ok(trust.every((source) => source.areas.includes("System effects")));
  });

  it("renders every source link and a handwritten empty state", () => {
    const html = renderToStaticMarkup(<SourceIndex sources={sources} />);
    const links = html.match(/href="https:/g) ?? [];
    assert.equal(links.length, 23);
    assert.match(html, /Find a source/);
    assert.match(html, /Used for: Gigabit connectivity/);
    assert.match(html, /Access and readiness/);
    assert.match(html, /area-count">23</);
    assert.match(html, /area-count">7</);
    assert.doesNotMatch(html, /class="num"/);
    assert.doesNotMatch(html, /Nothing matches/);

    const empty = renderToStaticMarkup(
      <SourceList sources={sources} query="no-such-publisher-zz" area="all" />,
    );
    assert.match(empty, /No match\. Try ONS, or hiring\./);
    assert.equal(empty.match(/href="https:/g), null);
    assert.match(empty, /0 sources/);

    const filtered = renderToStaticMarkup(
      <SourceList sources={sources} query="" area="Country comparison" />,
    );
    assert.equal((filtered.match(/href="https:/g) ?? []).length, 8);
  });
});
