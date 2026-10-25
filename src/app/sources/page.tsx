import Image from "next/image";
import { SourceIndex } from "@/components/SourceIndex";
import { getSources } from "@/lib/sources";

export default function SourcesPage() {
  const sources = getSources();

  return (
    <>
      <header className="nameplate">
        <div className="wrap">
          <div className="nameplate-inner">
            <a className="logo" href="/sources">
              <Image
                src="/inflect-wordmark.png"
                alt="Inflect"
                width={2046}
                height={176}
                priority
                className="logo-img"
              />
            </a>
            <p className="edition">
              Compiled <time dateTime="2026-10-20">20 October 2026</time>
            </p>
          </div>
        </div>
      </header>
      <main id="main">
        <SourceIndex sources={sources} />
      </main>
      <footer className="wrap colophon">
        <div className="colophon-rule">
          <p>
            Figures come from public sources, compiled{" "}
            <time dateTime="2026-10-20">20 October 2026</time> by the{" "}
            <a href="https://aimonitor.uk" rel="noreferrer">
              UK AI Monitor prototype
            </a>
            . Not an official statistic, and not a government publication.
          </p>
        </div>
      </footer>
    </>
  );
}
