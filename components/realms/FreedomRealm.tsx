"use client";

import type { ThemeHub } from "@/lib/realms/types";
import { ExpandArc, SupportPillars } from "./shared/metaphor-effects";
import { ProgressiveTerrain } from "./shared/ProgressiveTerrain";

/** Freedom expands — structure supports, space opens */
export function FreedomRealm({ hub }: { hub: ThemeHub }) {
  const palette = hub.config.palette;

  return (
    <ProgressiveTerrain hub={hub}>
      {({ disclosure }) => (
        <g opacity={disclosure.primaryId ? 0.45 : 0.22}>
          <SupportPillars stroke={palette.line} accent={palette.accent} />
          <ExpandArc
            d="M 58 48 Q 78 38 88 28"
            stroke={palette.accent}
            delay={0.4}
          />
          <ExpandArc
            d="M 58 52 Q 80 58 90 68"
            stroke={palette.accent}
            delay={0.9}
          />
        </g>
      )}
    </ProgressiveTerrain>
  );
}
