"use client";

import type { ThemeHub } from "@/lib/realms/types";
import { IlluminateRays } from "./shared/metaphor-effects";
import { ProgressiveTerrain } from "./shared/ProgressiveTerrain";

/** Meaning illuminates — light gathers where attention rests */
export function MeaningRealm({ hub }: { hub: ThemeHub }) {
  return (
    <ProgressiveTerrain hub={hub} atmosphereVariant="cathedral">
      {({ hoveredId, positions, palette }) => {
        if (!hoveredId) return null;
        const pos = positions.get(hoveredId) ?? { x: 0.5, y: 0.5 };
        return (
          <IlluminateRays
            cx={pos.x * 100}
            cy={pos.y * 100}
            stroke={palette.accent}
            active
          />
        );
      }}
    </ProgressiveTerrain>
  );
}
