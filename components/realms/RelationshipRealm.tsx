"use client";

import type { ThemeHub } from "@/lib/realms/types";
import { ProgressiveTerrain } from "./shared/ProgressiveTerrain";

/** Relationship weaves — every thread tugs every other */
export function RelationshipRealm({ hub }: { hub: ThemeHub }) {
  return <ProgressiveTerrain hub={hub} atmosphereVariant="network" />;
}
