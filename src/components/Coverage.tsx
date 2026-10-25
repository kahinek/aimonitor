"use client";

import { Fragment, useState } from "react";
import { AREA_NAME, type CompareCell, type CompareRow } from "../lib/monitor";

const SHORT: Record<string, string> = {
  "United Kingdom": "UK",
  "United States": "US",
  "European Union": "EU",
};

function tone(status: string): string {
  if (status === "Measured") return "measured";
  if (status === "Partial") return "partial";
  return "blind";
}

function spoken(status: string): string {
  if (status === "Partial") return "partly measured";
  return status.toLowerCase();
}

export function Coverage({
  countries,
  rows,
  cells,
}: {
  countries: string[];
  rows: CompareRow[];
  cells: Record<string, CompareCell[]>;
}) {
  const firstOutcome = Math.max(
    0,
    rows.findIndex((row) => row.area === 4),
  );
  const [picked, setPicked] = useState({ country: 0, row: firstOutcome });
  const country = countries[picked.country];
  const question = rows[picked.row];
  const cell = cells[country][picked.row];
  const lead = question.question.charAt(0).toLowerCase() + question.question.slice(1);
  const prefix =
    cell.status === "Not found" ? "Not found. " : cell.status === "Partial" ? "Partly measured. " : "";

  return (
    <>
      <p className="scroll-hint">Swipe the grid sideways to see every country.</p>
      <div className="cov-layout">
      <div className="grid-scroll">
        <table className="cov">
          <thead>
            <tr>
              <th />
              {countries.map((name) => (
                <th key={name} scope="col" className={name === "United Kingdom" ? "uk" : undefined} title={name}>
                  {SHORT[name] ?? name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <Fragment key={row.question}>
              {rowIndex === 0 || rows[rowIndex - 1].area !== row.area ? (
                <tr className="cov-group">
                  <th colSpan={countries.length + 1} scope="row">
                    {row.area} {AREA_NAME[row.area]}
                  </th>
                </tr>
              ) : null}
              <tr>
                <th scope="row">{row.question}</th>
                {countries.map((name, countryIndex) => {
                  const item = cells[name][rowIndex];
                  const pressed = picked.country === countryIndex && picked.row === rowIndex;
                  return (
                    <td key={name} className={name === "United Kingdom" ? "ukcol" : undefined}>
                      <button
                        type="button"
                        className={`covcell ${tone(item.status)}`}
                        aria-pressed={pressed}
                        aria-label={`${name}, ${row.question}: ${spoken(item.status)}`}
                        onClick={() => setPicked({ country: countryIndex, row: rowIndex })}
                      />
                    </td>
                  );
                })}
              </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="cell-detail" aria-live="polite">
        <p>
          <span className="who">
            {country}, {lead}
          </span>
        </p>
        <p>
          {prefix}
          {cell.text}
          {cell.url ? (
            <>
              {" "}
              <a href={cell.url} rel="noreferrer">
                Source
              </a>
            </>
          ) : null}
        </p>
      </div>
      </div>
    </>
  );
}
