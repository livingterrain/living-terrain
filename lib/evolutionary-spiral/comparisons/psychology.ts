import type { SpiralTrajectoryRelationship } from "../types";

/**
 * Memory updating under prediction error × Spiral — one candidate, one
 * ambiguous relationship, and one comparison break. Prediction error itself
 * carries no record: it is a condition, not an operation. Variable, reference,
 * and window live in the concept each record names.
 */
export const PSYCHOLOGY_RELATIONSHIPS: readonly SpiralTrajectoryRelationship[] = [
  {
    id: "psy-cand-disruption-destabilization",
    trajectoryId: "memory-updating-prediction-error",
    anchor: { kind: "transition", from: "prediction-error", to: "destabilized" },
    operations: [{ stageId: "disruption" }],
    status: "candidate",
    epistemicKinds: ["empirical-observation", "empirical-mechanism", "contested-interpretation"],
    scale: {
      id: "person",
      note: "A single memory representation within one person, read through later retrieval. For the broader memory system, destabilization may be ordinary maintenance.",
    },
    conceptId: "psy-cmp-destabilization",
    note: "A reactivated memory meets a mismatch it cannot take in unchanged and becomes labile. What resembles Disruption is the destabilization, at the scale of one memory; the prediction error is its condition, not the operation. Many mismatches never destabilize a memory.",
  },
  {
    id: "psy-res-integration-incorporation",
    trajectoryId: "memory-updating-prediction-error",
    anchor: { kind: "transition", from: "new-information", to: "modified" },
    operations: [{ stageId: "integration" }],
    status: "ambiguous",
    epistemicKinds: ["empirical-observation", "contested-interpretation"],
    scale: {
      id: "person",
      note: "A single memory representation within one person, read through later retrieval.",
    },
    conceptId: "psy-cmp-incorporation",
    note: "New information appears inside the original memory at later recall, as if incorporated rather than kept beside it. Separate but linked memories retrieved together can produce the same result, so whether it has truly joined the old memory is held open.",
  },
  {
    id: "psy-break-renewal-restabilization",
    trajectoryId: "memory-updating-prediction-error",
    anchor: { kind: "step", stepId: "restabilized" },
    operations: [{ stageId: "renewal" }],
    status: "comparison-break",
    epistemicKinds: ["empirical-mechanism", "conceptual-framework"],
    scale: {
      id: "person",
      note: "A single memory representation within one person.",
    },
    conceptId: "psy-cmp-restabilization",
    note: "A labile memory returning to stable storage can look like Renewal. But restabilization happens whether or not the memory changed; it re-establishes persistence, not an altered capacity. Any change was made before it. The “renewal effect” of extinction research is unrelated.",
  },
];
