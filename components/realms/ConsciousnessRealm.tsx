"use client";

import type { ThemeHub } from "@/lib/realms/types";
import { ProgressiveTerrain } from "./shared/ProgressiveTerrain";

/** Consciousness ripples — field breathing, depth earned by touch */
export function ConsciousnessRealm({ hub }: { hub: ThemeHub }) {
  return <ProgressiveTerrain hub={hub} />;
}
