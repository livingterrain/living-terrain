"use client";

import type { ThemeHub } from "@/lib/realms/types";
import { BranchPath } from "./shared/metaphor-effects";
import { ProgressiveTerrain } from "./shared/ProgressiveTerrain";

const SCALE = 100;

/** Language branches — one stream dividing into many tongues */
export function LanguageRealm({ hub }: { hub: ThemeHub }) {
  const palette = hub.config.palette;

  return (
    <ProgressiveTerrain hub={hub}>
      {({ ecosystem, disclosure }) => {
        if (!disclosure.primaryId) return null;
        const primary = ecosystem.primaries.find(
          (p) => p.id === disclosure.primaryId,
        );
        if (!primary) return null;

        const cx = ecosystem.center.x * SCALE;
        const cy = ecosystem.center.y * SCALE;
        const px = primary.x * SCALE;
        const py = primary.y * SCALE;

        return (
          <BranchPath
            d={`M ${cx} ${cy} Q ${(cx + px) / 2} ${(cy + py) / 2 - 6} ${px} ${py}`}
            stroke={palette.accent}
          />
        );
      }}
    </ProgressiveTerrain>
  );
}
