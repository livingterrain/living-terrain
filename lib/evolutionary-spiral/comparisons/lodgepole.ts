import type { SpiralTrajectoryRelationship } from "../types";

/**
 * Lodgepole pine after fire × Spiral — two candidates and two comparison
 * breaks. Each is anchored to one occurrence on the authored topology; none is
 * inferred from an outcome label, a shared step, or the shape of the graph.
 * Variable, reference, and window live in the concept each record names.
 */
export const LODGEPOLE_RELATIONSHIPS: readonly SpiralTrajectoryRelationship[] = [
  {
    id: "lp-cand-transformation-reburn-restructuring",
    trajectoryId: "lodgepole-fire-regeneration",
    anchor: { kind: "transition", from: "reburn", to: "sparse-cohort" },
    operations: [{ stageId: "transformation" }],
    status: "candidate",
    epistemicKinds: ["empirical-observation", "empirical-mechanism"],
    scale: { id: "ecological-community", note: "The stand." },
    conceptId: "lp-cmp-reburn-restructuring",
    note: "After a second fire within about 30 years, a dense stand can persist as a much sparser lodgepole forest. The species stays the same, but fewer trees mean less future seed and less fuel: a change in how the stand maintains itself. Sparseness alone is not the claim; stands that grew sparse naturally after 1988 are not part of it.",
  },
  {
    id: "lp-cand-disruption-short-interval-reburn",
    trajectoryId: "lodgepole-fire-regeneration",
    anchor: { kind: "transition", from: "young-stand", to: "reburn" },
    operations: [{ stageId: "disruption" }],
    status: "candidate",
    epistemicKinds: ["empirical-observation", "empirical-mechanism"],
    scale: {
      id: "ecological-community",
      note: "The stand. Population persistence through serotiny is the mechanism under strain.",
    },
    conceptId: "lp-cmp-reburn-timing",
    note: "A second fire arrives before young trees bear many serotinous cones, so the stand cannot regenerate the way it has after historical fire. What resembles Disruption is the fire's timing against the stand's state, not fire itself. Fire at historical intervals is a separate case, where the comparison breaks.",
  },
  {
    id: "lp-break-disruption-historical-fire",
    trajectoryId: "lodgepole-fire-regeneration",
    anchor: { kind: "step", stepId: "crown-fire" },
    operations: [{ stageId: "disruption" }],
    status: "comparison-break",
    epistemicKinds: ["empirical-observation", "conceptual-framework"],
    scale: { id: "landscape", note: "Read at the scale of the fire regime." },
    conceptId: "lp-cmp-historical-fire",
    note: "Stand-replacing fire kills every canopy tree, which can look like Disruption. At landscape/regime scale, historical-interval stand-replacing fire does not satisfy the Disruption comparison merely by being destructive at smaller scales. It releases seed, carries the population forward, and maintains the landscape's mosaic of stand ages.",
  },
  {
    id: "lp-break-renewal-long-interval-return",
    trajectoryId: "lodgepole-fire-regeneration",
    anchor: { kind: "transition", from: "young-stand", to: "mature-stand" },
    operations: [{ stageId: "renewal" }],
    status: "comparison-break",
    epistemicKinds: ["empirical-observation", "conceptual-framework"],
    scale: { id: "ecological-community", note: "The stand." },
    conceptId: "lp-cmp-return-not-renewal",
    note: "A young stand growing back into a mature one can look like Renewal. But no altered capacity is established on this path: the stand returns toward the kind of stand that burned. This is persistence and recurrence, not Renewal.",
  },
];
