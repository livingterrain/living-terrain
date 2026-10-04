import type { SpiralCurrent } from "./types";

export const SPIRAL_CURRENTS: readonly SpiralCurrent[] = [
  {
    id: "continuity",
    name: "Continuity",
    definition:
      "Present throughout the helix: the forces by which a system preserves organization, identity, and usable history across change — asking what persists.",
    qualities: [
      "memory",
      "inheritance",
      "structure",
      "identity",
      "stability",
      "preservation",
    ],
  },
  {
    id: "transformation",
    name: "Transformation",
    definition:
      "Present throughout the helix: the forces by which a system varies, breaks, learns, and reorganizes under new conditions — asking what changes. Not reserved for later stages, and not a promise of improvement.",
    qualities: [
      "variation",
      "disruption",
      "adaptation",
      "learning",
      "breakdown",
      "reorganization",
      "renewal",
    ],
  },
] as const;
