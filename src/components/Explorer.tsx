"use client";

import { useState } from "react";
import {
  AREA_ORDER,
  AREA_WHAT,
  STATUS_TEXT,
  family,
  type Indicator,
} from "../lib/monitor";

export function Explorer({ indicators }: { indicators: Indicator[] }) {
  const [current, setCurrent] = useState("all");
  const areas = AREA_ORDER.filter((area) => current === "all" || current === String(area));

  return (
    <div>
      <div className="filters" role="group" aria-label="Show one area">
        <button type="button" aria-pressed={current === "all"} onClick={() => setCurrent("all")}>
          All areas
        </button>
        {AREA_ORDER.map((area) => {
          const name = indicators.find((row) => row.area === area)?.area_name ?? "";
          return (
            <button
              key={area}
              type="button"
              aria-pressed={current === String(area)}
              onClick={() => setCurrent(String(area))}
            >
              {name}
            </button>
          );
        })}
      </div>
      <div id="explorer">
        {areas.map((area) => {
          const rows = indicators.filter((row) => row.area === area);
          const name = rows[0]?.area_name ?? "";
          return (
            <section className="area-block" id={`area-${area}`} key={area} aria-labelledby={`area-h-${area}`}>
              <div className="area-title">
                <span className="n">{area}</span>
                <h3 id={`area-h-${area}`}>{name}</h3>
                <p>{AREA_WHAT[area]}</p>
              </div>
              {rows.map((row) => {
                const kind = family(row.status);
                return (
                  <article className="ind" id={row.id} key={row.id}>
                    <span className={`swatch ${kind}`} aria-hidden="true" />
                    <div className="ind-body">
                      <div>
                        <h4 className="ind-name">{row.indicator}</h4>
                        <p className="ind-def">{row.definition}</p>
                      </div>
                      <div>
                        <p className={row.uk_figure ? "ind-fig" : "ind-fig none"}>
                          {row.uk_figure || "No UK figure found"}
                        </p>
                        <p className="ind-status">{STATUS_TEXT[row.status] ?? row.status}</p>
                        <p className="ind-meta">
                          {row.source_url ? (
                            <a href={row.source_url} rel="noreferrer">
                              {row.source}
                            </a>
                          ) : (
                            row.source
                          )}
                          {row.note ? `. ${row.note}` : null}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          );
        })}
      </div>
    </div>
  );
}
