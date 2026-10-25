"use client";

import { useEffect, useRef, useState } from "react";
import { formatShare } from "../lib/monitor";

type Bar = { label: string; value: number; note?: string; tone?: "measured" | "partial" | "muted" };

export function BarChart({ bars, aria, max = 100 }: { bars: Bar[]; aria: string; max?: number }) {
  return (
    <div
      className="bars"
      role="img"
      aria-label={`${aria}. ${bars.map((bar) => `${bar.label} ${formatShare(bar.value)}`).join(", ")}`}
    >
      {bars.map((bar) => (
        <div className={bar.note ? "bar-row has-note" : "bar-row"} key={bar.label}>
          <div className="bar-copy">
            <span className="bar-label">{bar.label}</span>
            {bar.note ? <span className="bar-note">{bar.note}</span> : null}
          </div>
          <div className="bar-meter" aria-hidden="true">
            <span
              className={`bar-fill ${bar.tone ?? "measured"}`}
              style={{ width: `${Math.max(1.5, (bar.value / max) * 100)}%` }}
            />
            <span className="bar-val" style={{ left: `${Math.max(1.5, (bar.value / max) * 100)}%` }}>
              {formatShare(bar.value)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

type Point = { t: number; v: number; label: string };
type Series = { name: string; color: string; points: Point[]; dash?: string };

export function LineChart({
  series,
  aria,
  yMax,
}: {
  series: Series[];
  aria: string;
  yMax: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => setWidth(Math.max(280, Math.round(node.clientWidth)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const height = 248;
  const top = 16;
  const bottom = 28;
  const left = 36;
  const right = series.length > 1 && width >= 520 ? 156 : 18;
  const all = series.flatMap((item) => item.points);
  const t0 = Math.min(...all.map((point) => point.t));
  const t1 = Math.max(...all.map((point) => point.t));
  const xOf = (t: number) => left + ((t - t0) / (t1 - t0 || 1)) * (width - left - right);
  const yOf = (v: number) => top + (1 - v / yMax) * (height - top - bottom);
  const ticks = [0, yMax / 2, yMax];
  const years = Array.from(new Set(all.map((point) => new Date(point.t).getUTCFullYear()))).filter((year) => {
    const t = Date.UTC(year, 0, 1);
    return t >= t0 && t <= t1;
  });

  const ends = series.map((item) => {
    const last = item.points[item.points.length - 1];
    return { y: yOf(last.v), text: `${item.name} ${formatShare(last.v)}`, color: item.color };
  });
  ends.sort((a, b) => a.y - b.y);
  for (let index = 1; index < ends.length; index += 1) {
    if (ends[index].y - ends[index - 1].y < 18) ends[index].y = ends[index - 1].y + 18;
  }

  return (
    <div className="linebox" ref={ref}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={aria} width="100%" height={height}>
        <title>{aria}</title>
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={left}
              x2={width - right}
              y1={yOf(tick)}
              y2={yOf(tick)}
              stroke="#d9d9d9"
            />
            <text x={left - 6} y={yOf(tick)} dy="0.35em" textAnchor="end" className="axis">
              {tick}%
            </text>
          </g>
        ))}
        {years.reduce<{ year: number; x: number }[]>((placed, year) => {
          const t = Date.UTC(year, 0, 1);
          const x = Math.min(width - right, Math.max(left, xOf(t)));
          const prev = placed[placed.length - 1];
          if (!prev || x - prev.x >= 40) placed.push({ year, x });
          return placed;
        }, []).map((item) => (
          <text key={item.year} x={item.x} y={height - 6} textAnchor="middle" className="axis">
            {item.year}
          </text>
        ))}
        {series.map((item) => {
          const d = item.points
            .map((point, index) => `${index === 0 ? "M" : "L"}${xOf(point.t).toFixed(1)},${yOf(point.v).toFixed(1)}`)
            .join(" ");
          return (
            <g key={item.name}>
              <path d={d} fill="none" stroke={item.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={item.dash} />
              {item.points.map((point, index) => {
                const x = xOf(point.t);
                const prev = index > 0 ? xOf(item.points[index - 1].t) : -999;
                const below = series.length === 1 && x - prev < 42;
                return (
                  <g key={point.label}>
                    <circle cx={x} cy={yOf(point.v)} r="4.5" fill={item.color} stroke="#ffffff" strokeWidth="1.5">
                      <title>{`${point.label}: ${item.name} ${formatShare(point.v)}`}</title>
                    </circle>
                    {series.length === 1 ? (
                      <text x={x} y={below ? yOf(point.v) + 16 : yOf(point.v) - 10} textAnchor="middle" className="point-val">
                        {formatShare(point.v)}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </g>
          );
        })}
        {width >= 520 && series.length > 1
          ? ends.map((end) => (
              <g key={end.text}>
                <circle cx={width - right + 14} cy={end.y} r="4" fill={end.color} />
                <text x={width - right + 24} y={end.y} dy="0.35em" fill="#2c2c2c" className="end-label">
                  {end.text}
                </text>
              </g>
            ))
          : null}
      </svg>
        {width < 520 && series.length > 1 ? (
        <ul className="end-list">
          {series.map((item) => {
            const last = item.points[item.points.length - 1];
            return (
              <li key={item.name}>
                <i className="end-swatch" style={{ background: item.color }} />
                {item.name} {formatShare(last.v)}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function DiffusionChart({
  rows,
}: {
  rows: { economy: string; h1_2025: number; q2_2026: number }[];
}) {
  const max = 82;
  const sorted = [...rows].sort((a, b) => b.q2_2026 - a.q2_2026);
  const marks = [0, 20, 40, 60];
  return (
    <div
      className="diffusion"
      role="img"
      aria-label={`Share of people aged 15 to 64 using generative AI, second quarter of 2026. ${sorted
        .map((row) => `${row.economy} ${formatShare(row.q2_2026)}, first half of 2025 ${formatShare(row.h1_2025)}`)
        .join("; ")}`}
    >
      {sorted.map((row) => {
        const uk = row.economy === "United Kingdom";
        return (
          <div className={uk ? "diff-row uk" : "diff-row"} key={row.economy}>
            <span className="diff-name">{row.economy}</span>
            <span className="diff-meter">
              <span className="diff-fill" style={{ width: `${(row.q2_2026 / max) * 100}%` }} />
              <span className="diff-tick" style={{ left: `${(row.h1_2025 / max) * 100}%` }} />
              <span className="diff-val" style={{ left: `${(row.q2_2026 / max) * 100}%` }}>
                {formatShare(row.q2_2026)}
              </span>
            </span>
            <span className="sr-only">
              First half of 2025: {formatShare(row.h1_2025)}
            </span>
          </div>
        );
      })}
      <div className="diff-axis" aria-hidden="true">
        <span className="diff-name" />
        <span className="diff-meter diff-scale">
          {marks.map((mark) => (
            <span key={mark} style={{ left: `${(mark / max) * 100}%` }}>
              {mark}%
            </span>
          ))}
        </span>
        <span className="diff-val" />
      </div>
    </div>
  );
}
