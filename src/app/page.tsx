import type { Metadata } from "next";
import Link from "next/link";
import { BarChart, LineChart } from "@/components/Charts";
import { Explorer } from "@/components/Explorer";
import {
  AREA_ORDER,
  countByFamily,
  family,
  getAreaBriefs,
  getCharts,
  getIndicators,
  getReadings,
} from "@/lib/monitor";

export const metadata: Metadata = {
  title: { absolute: "UK AI Monitor" },
  description:
    "What the UK can and can't yet measure about AI use and its impact: 26 indicators from access to system effects, with the latest public figures.",
};

function utc(date: string): number {
  return Date.parse(`${date}T00:00:00Z`);
}

export default function OverviewPage() {
  const indicators = getIndicators();
  const counts = countByFamily(indicators);
  const briefs = getAreaBriefs();
  const readings = getReadings();
  const charts = getCharts();
  const byId = new Map(indicators.map((row) => [row.id, row]));

  return (
    <main id="main">
      <div className="wrap">
        <section className="hero" aria-labelledby="h">
          <div className="hero-grid">
          <div>
          <p className="status-line">Prototype. Figures as of October 2026.</p>
          <h1 id="h">The UK can see who uses AI. It can&apos;t yet see what AI changes.</h1>
          <p className="lede">
            The monitor follows {counts.total} indicators, from who could use AI to what it changes
            across the economy. Each block is one indicator. {counts.measured} have a solid UK
            figure, {counts.partial} have a partial one, and the rest have none.
          </p>
          </div>
          <div>
          <div className="sight" aria-label="Each indicator, grouped by area and shaded by whether the UK measures it">
            {AREA_ORDER.map((area) => {
              const rows = indicators.filter((row) => row.area === area);
              const withFigure = rows.filter((row) => family(row.status) !== "blind").length;
              return (
                <div className="sight-group" key={area}>
                  <div className="sight-cells">
                    {rows.map((row) => (
                      <a
                        key={row.id}
                        href={`#${row.id}`}
                        className={`cell ${family(row.status)}`}
                        aria-label={`${row.indicator}: ${family(row.status) === "measured" ? "Measured" : family(row.status) === "partial" ? "Partly measured" : "Not measured"}${row.uk_figure ? `, ${row.uk_figure}` : ""}`}
                      />
                    ))}
                  </div>
                  <p className="sight-name">
                    <span>{area}</span> {rows[0]?.area_name}
                  </p>
                  <p className="sight-count">
                    {withFigure} of {rows.length} with a UK figure
                  </p>
                </div>
              );
            })}
          </div>
          <div className="key">
            <span>
              <i className="swatch measured" /> Measured
            </span>
            <span>
              <i className="swatch partial" /> Partly measured
            </span>
            <span>
              <i className="swatch blind" /> Not measured
            </span>
          </div>
          </div>
          </div>
        </section>
      </div>

      <section className="band" aria-labelledby="a">
        <div className="wrap">
          <h2 id="a">Five areas, from access to impact</h2>
          <p className="intro">
            The monitor sorts every indicator into five areas. Each asks a different question, and
            each is harder to answer than the one before. Taken in order, they show where the
            evidence runs out.
          </p>
          <div className="five-head">
            <span />
            <span />
            <span>Best current reading</span>
            <span>Biggest gap</span>
          </div>
          <ol className="five">
            {briefs.map((brief) => {
              const rows = indicators.filter((row) => row.area === brief.area);
              const withFigure = rows.filter((row) => family(row.status) !== "blind").length;
              const reading = byId.get(brief.reading);
              const gap = byId.get(brief.gap);
              return (
                <li key={brief.area} id={`five-${brief.area}`}>
                  <p className="five-num">{brief.area}</p>
                  <h3>{rows[0]?.area_name}</h3>
                  <p className="five-q">{brief.question}</p>
                  <div className="five-cells" aria-hidden="true">
                    {rows.map((row) => (
                      <i key={row.id} className={family(row.status)} />
                    ))}
                  </div>
                  <p className="five-count">
                    {withFigure} of {rows.length} indicators have a UK figure
                  </p>
                  {reading ? (
                    <div className="five-note">
                      <p className="k">Best current reading</p>
                      <p className="f">{reading.uk_figure}</p>
                      <p className="d">{reading.indicator}</p>
                    </div>
                  ) : null}
                  {gap ? (
                    <div className="five-note">
                      <p className="k">Biggest gap</p>
                      <p className="f">{gap.indicator}</p>
                      <p className="d">{gap.note || gap.definition}</p>
                    </div>
                  ) : null}
                  <a className="five-link" href={`#area-${brief.area}`}>
                    See all {rows.length} indicators in this area
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="band" aria-labelledby="r">
        <div className="wrap">
          <h2 id="r">Four readings</h2>
          <p className="intro">
            What the best current data says, from adoption to the only outcome figure the UK
            publishes.
          </p>
          <ol className="readings">
            {readings.map((reading, index) => (
              <li key={reading.value} className={index === readings.length - 1 ? "outcome" : undefined}>
                <p className="v">{reading.value}</p>
                <p>{reading.text}</p>
                <p className="src">
                  <a href={reading.url} rel="noreferrer">
                    {reading.source}
                  </a>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band" aria-labelledby="e">
        <div className="wrap">
          <h2 id="e">What the data shows</h2>
          <p className="intro">The UK measures adoption well. These charts draw on its strongest sources.</p>
          <div className="charts">
            <figure>
              <h3>Business use has tripled since 2023</h3>
              <p className="what">Share of UK businesses using at least one AI technology.</p>
              <LineChart
                yMax={40}
                aria="Share of UK businesses using AI, September 2023 to September 2026"
                series={[
                  {
                    name: "Businesses",
                    color: "#2c2c2c",
                    points: charts.bicsTrend.map((row) => ({
                      t: utc(`${row.period}-01`),
                      v: row.share_pct,
                      label: row.label,
                    })),
                  },
                ]}
              />
              <figcaption>
                ONS Business Insights and Conditions Survey. The June 2025 point is derived from the
                8-point rise ONS reported to June 2026.
              </figcaption>
            </figure>
            <figure>
              <h3>Bigger firms and tech firms lead</h3>
              <p className="what">
                Share using AI by firm size, and in the industry that uses it most, September 2026.
              </p>
              <BarChart
                aria="Share of businesses using AI by size and in information and communication"
                bars={charts.bicsGroups.map((row) => ({
                  label: row.group,
                  value: row.share_pct,
                  tone: "measured",
                }))}
              />
              <figcaption>ONS Business Insights and Conditions Survey, wave 165.</figcaption>
            </figure>
            <figure>
              <h3>Three answers to &ldquo;how many people use AI?&rdquo;</h3>
              <p className="what">
                Each source asks a different question of a different population. The spread is a
                finding in itself.
              </p>
              <BarChart
                aria="Three published estimates of the share of people using AI"
                bars={charts.people.map((row) => ({
                  label: row.estimate,
                  note: `${row.population}, ${row.period}`,
                  value: row.share_pct,
                }))}
              />
              <figcaption>
                ONS Opinions and Lifestyle Survey (67% derived from 33% reporting no use); Ofcom
                Adults&apos; Media Use and Attitudes 2026; Microsoft AI Diffusion Report.
              </figcaption>
            </figure>
            <figure>
              <h3>A steep age gap</h3>
              <p className="what">Adults using AI for work or education, Great Britain, June 2026.</p>
              <BarChart
                aria="Share of adults using AI for work or education, by age"
                bars={charts.age.map((row) => ({ label: row.age, value: row.share_pct }))}
              />
              <figcaption>ONS Opinions and Lifestyle Survey, June 2026.</figcaption>
            </figure>
            <figure>
              <h3>More use, less confidence</h3>
              <p className="what">
                Adults in Great Britain who expect AI to benefit them, and who think it carries more
                risks than benefits.
              </p>
              <LineChart
                yMax={50}
                aria="Adults expecting AI to benefit them and adults seeing more risks than benefits, 2023 to 2026"
                series={["Agree AI will benefit them", "Say AI has more risks than benefits"].map(
                  (measure, index) => ({
                    name: index === 0 ? "Expect benefit" : "See more risk",
                    color: index === 0 ? "#2c2c2c" : "#535c61",
                    dash: index === 0 ? undefined : "5 4",
                    points: charts.trust
                      .filter((row) => row.measure === measure)
                      .map((row) => ({
                        t: utc(row.date),
                        v: row.share_pct,
                        label: row.date,
                      })),
                  }),
                )}
              />
              <figcaption>ONS Opinions and Lifestyle Survey, November 2023 to June 2026.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="i">
        <div className="wrap">
          <h2 id="i">All {counts.total} indicators</h2>
          <p className="intro">
            Grouped into five areas that run from access to impact. Each shows the latest UK figure,
            where one exists, and its source. <Link href="/method">How the areas and shading work</Link>.
          </p>
          <Explorer indicators={indicators} />
        </div>
      </section>

      <section className="band" aria-labelledby="g">
        <div className="wrap">
          <h2 id="g">What it would take to see impact</h2>
          <p className="intro">
            The UK already runs the surveys. The gaps are in linking data, measuring outcomes and
            seeing inside organisations.
          </p>
          <ol className="gaps">
            <li>
              <h3>Link adoption to firm performance</h3>
              <p>
                ONS already knows which firms say they use AI. Linking those answers to firm-level
                productivity, turnover and employment would show whether adopters pull ahead. It is
                the biggest missing piece.
              </p>
            </li>
            <li>
              <h3>Report results where government uses AI</h3>
              <p>
                Move transparency records from describing tools to reporting what changed: processing
                times, error rates and service quality, before and after.
              </p>
            </li>
            <li>
              <h3>See inside organisations</h3>
              <p>
                A voluntary panel of organisations sharing anonymised data on licences, active users,
                depth of use and tasks. It is the only route to AI embedded in everyday software.
              </p>
            </li>
            <li>
              <h3>Count harms as well as benefits</h3>
              <p>
                A shared way for regulators to record AI-related complaints, incidents and findings,
                so harms can be tracked alongside adoption.
              </p>
            </li>
          </ol>
        </div>
      </section>
    </main>
  );
}
