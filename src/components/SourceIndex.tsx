"use client";

import { useId, useState } from "react";
import { AREAS, type Source } from "../lib/types";
import { filterSources, usedForLine } from "../lib/filter";

function Highlight({ text, query }: { text: string; query: string }) {
  const needle = query.trim();
  if (!needle) return text;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "ig"));
  const folded = needle.toLocaleLowerCase("en-GB");
  return parts.map((part, index) =>
    part.toLocaleLowerCase("en-GB") === folded ? (
      <mark key={`${part}-${index}`}>{part}</mark>
    ) : (
      part
    ),
  );
}

export function SourceList({
  sources,
  query,
  area,
}: {
  sources: Source[];
  query: string;
  area: string;
}) {
  const filtered = filterSources(sources, query, area);
  const narrowed = query.trim() !== "" || area !== "all";
  const countLabel = filtered.length === 1 ? "1 source" : `${filtered.length} sources`;
  const empty =
    area !== "all"
      ? "Nothing in this area. Choose All, or clear the search."
      : "No match. Try ONS, or hiring.";

  return (
    <div className="index" id="source-list">
      <p className={narrowed ? "count" : "sr-only"} aria-live="polite" aria-atomic="true">
        {countLabel}
      </p>
      {filtered.length === 0 ? (
        <p className="empty">{empty}</p>
      ) : (
        <ul className="entries">
          {filtered.map((source) => {
            return (
              <li key={source.url} className="entry">
                <a href={source.url} rel="noreferrer">
                  <Highlight text={source.name} query={query} />
                </a>
                <p className="where">{source.areas.join(", ")}</p>
                <p className="meta">
                  <Highlight text={usedForLine(source)} query={query} />
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function SourceIndex({ sources }: { sources: Source[] }) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("all");
  const options = ["all", ...AREAS] as const;

  return (
    <div className="layout wrap">
      <div className="rail">
        <h1>Sources</h1>
        <p className="intro">
          Every figure on this site comes from a public source. Where a figure is derived or reported
          second-hand, the indicator says so.
        </p>
        <form role="search" onSubmit={(event) => event.preventDefault()}>
          <div className="search">
            <div className="search-row">
              <label htmlFor={searchId}>Find a source</label>
              {query ? (
                <button type="button" className="clear" onClick={() => setQuery("")}>
                  Clear
                </button>
              ) : null}
            </div>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="search"
              aria-controls="source-list"
              className={query.trim() ? "is-active" : undefined}
            />
          </div>
          <fieldset aria-describedby="area-note">
            <legend>Area</legend>
            <div className="areas">
              {options.map((option) => {
                const count = filterSources(sources, query, option).length;
                const label = option === "all" ? "All" : option;
                return (
                  <label key={option}>
                    <input
                      type="radio"
                      name="area"
                      value={option}
                      checked={area === option}
                      onChange={() => setArea(option)}
                    />
                    <span className="area-name">{label}</span>
                    <span className="area-count">{count}</span>
                  </label>
                );
              })}
            </div>
            <p className="area-note" id="area-note">
              A source in two areas is counted twice.
            </p>
          </fieldset>
        </form>
      </div>
      <SourceList sources={sources} query={query} area={area} />
    </div>
  );
}
