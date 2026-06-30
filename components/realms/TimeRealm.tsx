"use client";

import type { ThemeHub } from "@/lib/realms/types";
import { FlowSpine } from "./shared/metaphor-effects";
import { ProgressiveTerrain } from "./shared/ProgressiveTerrain";

const SCALE = 100;

/** Time flows — downward current from the center of now */
export function TimeRealm({ hub }: { hub: ThemeHub }) {
  const palette = hub.config.palette;

  return (
    <ProgressiveTerrain hub={hub}>
      {({ ecosystem }) => {
        const cx = ecosystem.center.x * SCALE;
        const cy = ecosystem.center.y * SCALE;
        return <FlowSpine cx={cx} y1={cy} y2={cy + 38} stroke={palette.accent} />;
      }}
    </ProgressiveTerrain>
  );
}
