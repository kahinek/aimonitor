import type { Metadata } from "next";
import { Coverage } from "@/components/Coverage";
import { DiffusionChart } from "@/components/Charts";
import { getCompare } from "@/lib/monitor";

export const metadata: Metadata = {
  title: "How the UK compares",
  description:
    "How UK measurement of AI use and impact compares with the US, EU, Ireland, Canada, Singapore and Australia.",
};

export default function ComparePage() {
  const compare = getCompare();

  return (
    <main id="main">
      <div className="wrap doc">
        <header className="page-head">
          <h1>How the UK compares</h1>
          <p className="intro tight">
            Two comparisons. How many people use AI, measured the same way in every country. And
            what each country&apos;s official statistics can actually see.
          </p>
        </header>
        <p className="finding">
          None of the seven publishes an official measure of what AI changes. The UK and Singapore
          come closest, and both rely on what people say about themselves.
        </p>
      </div>

      <section className="band" aria-labelledby="c1">
        <div className="wrap">
          <h2 id="c1">Like for like: people using AI</h2>
          <p className="intro">
            Share of people aged 15 to 64 who used a generative AI product, estimated the same way
            for every country from Microsoft device data. The bar shows the second quarter of 2026;
            the tick shows the first half of 2025. France and Germany stand in for the EU, which is
            not reported as one.
          </p>
          <DiffusionChart rows={compare.diffusion} />
          <p className="chart-key">
            <span>
              <i className="ink-sample" /> Second quarter of 2026
            </span>
            <span>
              <i className="tick-sample" /> First half of 2025
            </span>
            <span>United Kingdom in black</span>
          </p>
          <p className="src">
            Source:{" "}
            <a href="https://github.com/microsoft/ai-diffusion-report" rel="noreferrer">
              Microsoft AI Diffusion Report data
            </a>
            . A vendor estimate: it counts users of AI tools on devices Microsoft can see, adjusted
            to population.
          </p>
        </div>
      </section>

      <section className="band" aria-labelledby="c2">
        <div className="wrap">
          <h2 id="c2">What each country can see</h2>
          <p className="intro">
            Seven questions across the five areas, and whether each country&apos;s official
            statistics answer them. Select a square for the figure and its source.
          </p>
          <div className="key">
            <span>
              <i className="swatch measured" /> Measured
            </span>
            <span>
              <i className="swatch partial" /> Partly measured
            </span>
            <span>
              <i className="swatch blind" /> Not found
            </span>
          </div>
          <Coverage countries={compare.countries} rows={compare.rows} cells={compare.cells} />
          <p className="small soft">
            &ldquo;Not found&rdquo; means no official figure turned up in the releases reviewed for
            this prototype in October 2026. Some countries may measure more than shown here.
          </p>
        </div>
      </section>

      <section className="band" aria-labelledby="c3">
        <div className="wrap">
          <h2 id="c3">Business adoption, as each country counts it</h2>
          <p className="intro">
            Every country here now measures business use of AI, but each asks a different question
            of a different set of firms. These figures sit side by side, not in a league table.
          </p>
          <div className="grid-scroll nat-wrap">
            <table className="nat">
              <thead>
                <tr>
                  {["Country", "Figure", "What it counts", "Which firms", "When", "Source"].map((label) => (
                    <th key={label} scope="col">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.national.map((row) => (
                  <tr key={row.country} className={row.country === "United Kingdom" ? "uk" : undefined}>
                    <th scope="row">{row.country}</th>
                    <td className="fig">{row.figure}</td>
                    <td data-label="Counts">{row.measures}</td>
                    <td data-label="Firms">{row.population}</td>
                    <td data-label="When">{row.period}</td>
                    <td className="src-cell" data-label="Source">
                      <a href={row.url} rel="noreferrer">
                        {row.source}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
