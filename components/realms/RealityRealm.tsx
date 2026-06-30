"use client";

import type { ThemeHub } from "@/lib/realms/types";
import { StabilizeFrame } from "./shared/metaphor-effects";
import { ProgressiveTerrain } from "./shared/ProgressiveTerrain";

const SCALE = 100;

/** Reality stabilizes — nested systems that hold while everything changes */
export function RealityRealm({ hub }: { hub: ThemeHub }) {
  const palette = hub.config.palette;

  return (
    <ProgressiveTerrain hub={hub}>
      {({ ecosystem, disclosure }) => {
        const cx = ecosystem.center.x * SCALE;
        const cy = ecosystem.center.y * SCALE;
        const depth =
          (disclosure.primaryId ? 1 : 0) +
          (disclosure.relationshipId ? 1 : 0) +
          (disclosure.essayId ? 1 : 0);

        return (
          <g>
            <g transform={`translate(${cx - 50}, ${cy - 50})`}>
              <StabilizeFrame stroke={palette.line} />
            </g>
            {[0.2, 0.34, 0.48].map((r, i) => (
              <circle
                key={r}
                cx={cx}
                cy={cy}
                r={r * SCALE}
                fill="none"
                stroke={palette.line}
                strokeWidth={0.1}
                opacity={depth >= i ? 0.32 : 0.14}
              />
            ))}
          </g>
        );
      }}
    </ProgressiveTerrain>
  );
}
