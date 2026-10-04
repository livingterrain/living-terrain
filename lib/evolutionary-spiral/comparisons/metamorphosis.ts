import type { SpiralTrajectoryRelationship } from "../types";

/**
 * Metamorphosis ↔ Spiral. One relationship, carried by the existing
 * Transformation research on metamorphosis. Scale is unresolved: the same
 * event may involve different operations at tissue, cell, and organism scale.
 */
export const METAMORPHOSIS_RELATIONSHIPS: readonly SpiralTrajectoryRelationship[] =
  [
    {
      id: "meta-res-transformation-reorganization",
      trajectoryId: "metamorphosis",
      anchor: {
        kind: "span",
        from: "metamorphic-transition",
        to: "tissue-remodeling",
      },
      operations: [{ stageId: "transformation" }],
      status: "candidate",
      epistemicKinds: ["empirical-observation", "empirical-mechanism"],
      conceptId: "bio-metamorphosis",
      note: "Development continues across the transition, but the organization through which that continuity is expressed changes dramatically.",
    },
  ];
