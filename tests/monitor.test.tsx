import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import ComparePage from "../src/app/compare/page.tsx";
import MethodPage from "../src/app/method/page.tsx";
import OverviewPage from "../src/app/page.tsx";
import { BarChart } from "../src/components/Charts.tsx";
import { countByFamily, formatShare, getCharts, getCompare, getIndicators, getReadings } from "../src/lib/monitor.ts";

describe("monitor", () => {
  const indicators = getIndicators();

  it("keeps all 26 indicators and the published status split", () => {
    const counts = countByFamily(indicators);
    assert.equal(counts.total, 26);
    assert.equal(counts.measured, 13);
    assert.equal(counts.partial, 4);
    assert.equal(counts.blind, 9);
    assert.equal(indicators.find((row) => row.id === "u1")?.uk_figure, "30% of businesses (Sep 2026)");
    assert.equal(indicators.find((row) => row.id === "u3")?.uk_figure, "43.7% (Q2 2026)");
  });

  it("does not round chart figures", () => {
    const charts = getCharts();
    assert.deepEqual(
      charts.bicsTrend.map((row) => row.share_pct),
      [9, 21, 29, 30],
    );
    assert.equal(formatShare(43.7), "43.7%");
    assert.equal(formatShare(30), "30%");
    assert.equal(charts.people[2]?.share_pct, 43.7);
    const uk = getCompare().diffusion.find((row) => row.economy === "United Kingdom");
    assert.equal(uk?.q2_2026, 43.7);
    assert.equal(uk?.h1_2025, 36.4);
    assert.equal(getCompare().national[0]?.figure, "30%");
    assert.equal(getCompare().national.find((row) => row.country === "Australia")?.figure, "12%");
  });

  it("renders the overview with the headline, readings and indicator figures", () => {
    const html = renderToStaticMarkup(<OverviewPage />);
    assert.match(html, /The UK can see who uses AI/);
    assert.match(html, /It can&#x27;t yet see what AI changes/);
    for (const reading of getReadings()) {
      assert.match(html, new RegExp(reading.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
    assert.match(html, /89% of homes \(Jan 2026\)/);
    assert.match(html, /26 min/);
    assert.match(html, /Business use has tripled since 2023/);
    assert.match(html, /href="#u1"/);
    assert.equal((html.match(/class="ind"/g) ?? []).length, 26);
    assert.doesNotMatch(html, /#1f6f5c|#4fbf9f|#feede7|#f7cadc/i);
  });

  it("renders compare and method with the original findings", () => {
    const compare = renderToStaticMarkup(<ComparePage />);
    assert.match(compare, /How the UK compares/);
    assert.match(compare, /64\.3%/);
    assert.match(compare, /43\.7%/);
    assert.match(compare, /36\.4%/);
    assert.match(compare, /26 minutes a day saved/);
    assert.match(compare, /About 20%/);
    assert.match(compare, /19\.2%/);
    assert.match(compare, /20\.2%/);
    assert.match(compare, /23\.5%/);

    const method = renderToStaticMarkup(<MethodPage />);
    assert.match(method, /How the monitor works/);
    assert.match(method, /Tokens measure compute, not value/);
    assert.match(method, /13 indicators/);
    assert.match(method, /4 indicators/);
  });

  it("draws bar lengths from the values", () => {
    const html = renderToStaticMarkup(
      <BarChart
        aria="test"
        bars={[
          { label: "A", value: 43.7 },
          { label: "B", value: 30 },
        ]}
      />,
    );
    assert.match(html, /43\.7%/);
    assert.match(html, /width:43\.7%/);
    assert.match(html, /width:30%/);
  });

  it("keeps light pink and green out of the stylesheet", () => {
    const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
    assert.doesNotMatch(css, /#feede7|#f7cadc|#1f6f5c|#4fbf9f|#7fb3a4/i);
  });
});
