import type { Metadata } from "next";
import { STATUS_ORDER, family, getIndicators, statusNote } from "@/lib/monitor";

export const metadata: Metadata = {
  title: "How it works",
  description: "How the UK AI Monitor groups and shades its indicators, and the traps in measuring AI use.",
};

const CHAIN = [
  ["Access and readiness.", "Who could use AI: connectivity, skills, policies and licences."],
  ["Use.", "Who does use it, how often and how deeply."],
  ["Task mix.", "What it is used for, and whether it helps people work or replaces their work."],
  ["Outcomes.", "Time, quality, cost, service levels and new products."],
  ["System effects.", "Productivity, jobs and skills, who benefits and who is left behind, incidents and trust."],
] as const;

export default function MethodPage() {
  const indicators = getIndicators();

  return (
    <main id="main">
      <div className="wrap doc">
        <header className="page-head">
          <h1>How the monitor works</h1>
          <p className="intro tight">
            Measuring AI is hard because most of it is invisible. It sits inside email, office
            software and customer systems, and the people using it often don&apos;t know it&apos;s
            there. So this monitor doesn&apos;t try to count all AI use. It tracks signals, and is
            open about where the signals run out.
          </p>
        </header>

        <section>
          <h2>Five areas, from access to impact</h2>
          <div>
            <p>
              Each indicator belongs to one of five areas. They form a chain: each one is harder to
              measure than the one before, and matters more.
            </p>
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
            <ol className="chain">
              {CHAIN.map(([name, text], index) => {
                const rows = indicators.filter((row) => row.area === index + 1);
                return (
                  <li key={name}>
                    <span className="chain-cells" aria-hidden="true">
                      {rows.map((row) => (
                        <i key={row.id} className={`cell ${family(row.status)}`} />
                      ))}
                    </span>
                    <p>
                      <strong>{name}</strong> {text}
                    </p>
                  </li>
                );
              })}
            </ol>
            <p>Most measurement today stops at the first two links and implies the last three.</p>
          </div>
        </section>

        <section>
          <h2>What the shading means</h2>
          <div>
            <p>Every indicator is tagged by what it would take to measure it.</p>
            <dl className="status-key">
              {STATUS_ORDER.map((status) => {
                const count = indicators.filter((row) => row.status === status).length;
                return (
                  <div key={status}>
                    <dt>
                      <span className={`swatch ${family(status)}`} aria-hidden="true" />
                      {status}
                    </dt>
                    <dd className="status-count">{count}</dd>
                    <dd>
                      {statusNote(status, count).replace(/\s\d+\sindicators?\.$/, "")}
                      <span className="sr-only">{count === 1 ? `${count} indicator` : `${count} indicators`}</span>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </section>

        <section>
          <h2>Three measurement traps</h2>
          <div>
            <h3>Tokens measure compute, not value</h3>
            <p>
              The amount of text AI systems process is a useful signal of how intensively a tool is used
              inside one organisation. It is a poor proxy for value. Newer models and agents use far more
              tokens for the same task, units differ between vendors, and a target on token use invites
              people to burn tokens.
            </p>
            <h3>Surveys are good for who, weak for how much</h3>
            <p>
              Surveys show who uses AI, what they think of it, and use that no system logs. They are weak
              on frequency and time saved: people misremember, stigma hides some use, enthusiasm inflates
              the rest, and AI built into familiar software often goes unreported. Self-reported time
              savings tend to exceed measured ones.
            </p>
            <h3>Embedded AI is visible only to vendors</h3>
            <p>
              AI inside office software or customer systems shows up only in vendors&apos; admin
              dashboards, licence counts and their own aggregate reports. As AI becomes infrastructure,
              &ldquo;AI use&rdquo; stops being a useful category, and the better question becomes how
              tasks and outcomes are changing.
            </p>
          </div>
        </section>

        <section>
          <h2>Why sources disagree</h2>
          <div>
            <ul className="disagree" aria-hidden="true">
              <li>
                <p className="v">67%</p>
                <p>ONS</p>
              </li>
              <li>
                <p className="v">54%</p>
                <p>Ofcom</p>
              </li>
              <li>
                <p className="v">44%</p>
                <p>Microsoft</p>
              </li>
            </ul>
            <p>
              Three credible sources put the share of people using AI at 67%, 54% and 44%. ONS asks
              adults whether they have knowingly used AI in the past year. Ofcom asks whether people use
              AI tools. Microsoft estimates from device data how many people aged 15 to 64 used a
              generative AI product in a quarter. None is wrong; they measure different things. The
              monitor shows them side by side rather than picking one.
            </p>
          </div>
        </section>

        <section>
          <h2>Updating</h2>
          <p>
            This is a prototype compiled in October 2026. The main official sources update on their own
            timetables: the ONS business survey every two weeks, with AI questions asked regularly; the
            ONS household survey monthly, with AI questions in some waves; productivity figures
            quarterly; and the AI sector study once a year.
          </p>
        </section>
      </div>
    </main>
  );
}
