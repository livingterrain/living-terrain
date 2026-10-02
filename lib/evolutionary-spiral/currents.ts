import type { SpiralCurrent } from "./types";

export const SPIRAL_CURRENTS: readonly SpiralCurrent[] = [
  {
    id: "continuity",
    name: "Continuity",
    definition:
      "The forces by which a system preserves organization, identity, and usable history across change.",
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
      "The forces by which a system varies, breaks, learns, and reorganizes so that continuation remains possible under new conditions.",
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
)
