"use client";

import type { ThemeHub } from "@/lib/realms/types";
import { CrystalRing } from "./shared/metaphor-effects";
import { ProgressiveTerrain } from "./shared/ProgressiveTerrain";

const SCALE = 100;

/** Identity crystallizes — layers settling into form */
export function IdentityRealm({ hub }: { hub: ThemeHub }) {
  const palette = hub.config.palette;

  return (
    <ProgressiveTerrain hub={hub}>
      {({ ecosystem, disclosure, hoveredId }) => {
        const cx = ecosystem.center.x * SCALE;
        const cy = ecosystem.center.y * SCALE;
        const active = !!hoveredId || !!disclosure.primaryId;

        return (
          <>
            <CrystalRing
              cx={cx}
              cy={cy}
              r={22}
              stroke={palette.accent}
              active={active}
            />
            <CrystalRing
              cx={cx}
              cy={cy}
              r={34}
              stroke={palette.line}
              active={!!disclosure.relationshipId}
              sides={8}
            />
          </>
        );
      }}
    </ProgressiveTerrain>
  );
}
