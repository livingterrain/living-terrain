import type { SpiralTrajectoryRelationship } from "../types";

/**
 * Jesus narrative ↔ Spiral. One relationship, carried by the existing
 * Transformation research on death, burial, and raised life. Every other
 * movement has none. New Creation is deliberately not related to
 * Emergence again.
 */
export const JESUS_RELATIONSHIPS: readonly SpiralTrajectoryRelationship[] = [
  {
    id: "jesus-res-transformation-death-resurrection",
    trajectoryId: "jesus-narrative",
    anchor: { kind: "span", from: "death", to: "resurrection" },
    operations: [{ stageId: "transformation" }],
    status: "textual-theological",
    epistemicKinds: ["textual-observation", "theological-interpretation"],
    conceptId: "bib-jesus-death-resurrection",
    note: "The claim is continuity and discontinuity together: the one who was crucified is the one proclaimed raised, while resurrection is understood as a transformed mode of life.",
  },
];
