"use client";

import type { ThemeHub } from "@/lib/realms/types";
import { GrowPath } from "./shared/metaphor-effects";
import { ProgressiveTerrain } from "./shared/ProgressiveTerrain";

const SCALE = 100;

/** Embodiment grows — upward from a living root */
export function EmbodimentRealm({ hub }: { hub: ThemeHub }) {
  const palette = hub.config.palette;

  return (
    <ProgressiveTerrain hub={hub}>
      {({ ecosystem, disclosure }) => {
        const cx = ecosystem.center.x * SCALE;
        const baseY = ecosystem.center.y * SCALE + 8;

        return (
          <GrowPath
            d={`M ${cx} ${baseY + 12} Q ${cx + 4} ${baseY - 4} ${cx} ${baseY - (disclosure.primaryId ? 28 : 16)}`}
            stroke={palette.accent}
          />
        );
      }}
    </ProgressiveTerrain>
  );
}
