"use client";

/**
 * Quiet field behind orientation — atmosphere only, never interactive.
 */

const STARS: ReadonlyArray<{ cx: number; cy: number; r: number; o: number }> = [
  { cx: 8, cy: 12, r: 0.12, o: 0.32 },
  { cx: 14, cy: 22, r: 0.08, o: 0.24 },
  { cx: 22, cy: 9, r: 0.1, o: 0.28 },
  { cx: 31, cy: 16, r: 0.14, o: 0.36 },
  { cx: 38, cy: 7, r: 0.08, o: 0.22 },
  { cx: 46, cy: 14, r: 0.1, o: 0.26 },
  { cx: 54, cy: 11, r: 0.12, o: 0.34 },
  { cx: 62, cy: 19, r: 0.08, o: 0.2 },
  { cx: 71, cy: 8, r: 0.1, o: 0.3 },
  { cx: 79, cy: 15, r: 0.14, o: 0.38 },
  { cx: 86, cy: 10, r: 0.08, o: 0.24 },
  { cx: 93, cy: 18, r: 0.1, o: 0.28 },
  { cx: 11, cy: 32, r: 0.08, o: 0.22 },
  { cx: 19, cy: 28, r: 0.1, o: 0.28 },
  { cx: 27, cy: 35, r: 0.12, o: 0.32 },
  { cx: 44, cy: 26, r: 0.08, o: 0.24 },
  { cx: 58, cy: 31, r: 0.1, o: 0.26 },
  { cx: 67, cy: 24, r: 0.08, o: 0.2 },
  { cx: 74, cy: 33, r: 0.12, o: 0.3 },
  { cx: 88, cy: 27, r: 0.08, o: 0.24 },
  { cx: 16, cy: 48, r: 0.1, o: 0.22 },
  { cx: 33, cy: 52, r: 0.08, o: 0.18 },
  { cx: 51, cy: 46, r: 0.1, o: 0.24 },
  { cx: 69, cy: 55, r: 0.08, o: 0.2 },
  { cx: 82, cy: 49, r: 0.1, o: 0.22 },
];

/** Faint relational traces — decorative, not destinations */
const TRACES: ReadonlyArray<{ x1: number; y1: number; x2: number; y2: number }> =
  [
    { x1: 22, y1: 18, x2: 38, y2: 28 },
    { x1: 38, y1: 28, x2: 54, y2: 22 },
    { x1: 54, y1: 22, x2: 71, y2: 30 },
    { x1: 31, y1: 42, x2: 48, y2: 48 },
    { x1: 48, y1: 48, x2: 66, y2: 40 },
  ];

export function HomeFieldAtmosphere() {
  return (
    <div className="home-orient-field" aria-hidden>
      <div className="home-orient-field__void" />
      <div className="home-orient-field__horizon" />
      <div className="home-orient-field__glow" />

      <svg
        className="home-orient-field__stars"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {TRACES.map((t, i) => (
          <line
            key={`t-${i}`}
            className="home-orient-field__trace"
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
          />
        ))}
        {STARS.map((s, i) => (
          <circle
            key={i}
            className="home-orient-field__star"
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#c8d0dc"
            opacity={s.o}
          />
        ))}
      </svg>

      <div className="home-orient-field__drift" />
      <div className="home-orient-field__vignette" />
    </div>
  );
}
