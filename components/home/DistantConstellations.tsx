"use client";

import { useMemo } from "react";

/** Faint star patterns in the deep background — distant, unnamed constellations */
export function DistantConstellations({ visible }: { visible?: boolean }) {
  const patterns = useMemo(
    () =>
      [
        { cx: 12, cy: 18, stars: [[0, 0], [8, 4], [14, -2], [18, 6], [6, 10]] },
        { cx: 88, cy: 15, stars: [[0, 0], [-6, 5], [-12, 1], [-8, 9], [-14, 8]] },
        { cx: 8, cy: 82, stars: [[0, 0], [10, 2], [5, 8], [12, 10], [3, 12]] },
        { cx: 92, cy: 78, stars: [[0, 0], [-5, -4], [-10, 2], [-7, 8], [-14, 5]] },
        { cx: 50, cy: 6, stars: [[-8, 0], [0, 0], [8, 0], [4, 5], [-4, 5]] },
      ] as const,
    [],
  );

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-[4s]"
      style={{ opacity: visible ? 1 : 0.6 }}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {patterns.map((pattern, pi) => (
        <g key={pi} opacity={0.35 + (pi % 3) * 0.08}>
          {pattern.stars.map(([dx, dy], si) => (
            <circle
              key={si}
              cx={pattern.cx + dx * 0.35}
              cy={pattern.cy + dy * 0.35}
              r={si === 0 ? 0.12 : 0.07}
              fill="#c8d0c8"
              opacity={0.25 + (si % 2) * 0.12}
            />
          ))}
          {pattern.stars.slice(0, -1).map((_, li) => {
            const a = pattern.stars[li];
            const b = pattern.stars[li + 1];
            return (
              <line
                key={li}
                x1={pattern.cx + a[0] * 0.35}
                y1={pattern.cy + a[1] * 0.35}
                x2={pattern.cx + b[0] * 0.35}
                y2={pattern.cy + b[1] * 0.35}
                stroke="#9ab098"
                strokeWidth={0.04}
                opacity={0.18}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}
