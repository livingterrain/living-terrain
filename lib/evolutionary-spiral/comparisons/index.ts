import { SPIRAL_SEQUENCE } from "../stages";
import { resolveSpan } from "../topology";
import type {
  SpiralRelationshipStatus,
  SpiralSequenceStop,
  SpiralTrajectory,
  SpiralTrajectoryAnchor,
  SpiralTrajectoryRelationship,
} from "../types";
import { JESUS_RELATIONSHIPS } from "./jesus";
import { METAMORPHOSIS_RELATIONSHIPS } from "./metamorphosis";
import { multiOccurrenceStageIds } from "./validate";
import { ZODIAC_RELATIONSHIPS } from "./zodiac";

/** Every authored trajectory ↔ Spiral relationship. Nothing here is inferred. */
export const SPIRAL_TRAJECTORY_RELATIONSHIPS: readonly SpiralTrajectoryRelationship[] =
  [...ZODIAC_RELATIONSHIPS, ...JESUS_RELATIONSHIPS, ...METAMORPHOSIS_RELATIONSHIPS];

export const SPIRAL_RELATIONSHIP_STATUS: Record<
  SpiralRelationshipStatus,
  { label: string; definition: string }
> = {
  "strong-empirical": {
    label: "Strong empirical correspondence",
    definition: "Supported by evidence within the domain where the claim is made.",
  },
  candidate: {
    label: "Candidate resonance",
    definition: "Worth investigating; not established.",
  },
  structural: {
    label: "Structural resemblance",
    definition: "A similar shape, without a shared mechanism.",
  },
  "symbolic-analogy": {
    label: "Symbolic analogy",
    definition: "A comparison in symbolic language; not evidence of causation.",
  },
  "textual-theological": {
    label: "Textual / theological resonance",
    definition: "A reading of texts and theology; not an empirical mechanism.",
  },
  context: {
    label: "Contextual",
    definition: "Where the sequence continues around a comparison.",
  },
  ambiguous: {
    label: "Ambiguous",
    definition: "Could be read more than one way; the ambiguity is kept.",
  },
  "comparison-break": {
    label: "Comparison break",
    definition: "Where the trajectory and the Spiral disagree.",
  },
};

export function relationshipStatusLabel(status: SpiralRelationshipStatus): string {
  return SPIRAL_RELATIONSHIP_STATUS[status].label;
}

export function relationshipsForTrajectory(
  trajectoryId: string | null | undefined,
): SpiralTrajectoryRelationship[] {
  if (!trajectoryId) return [];
  return SPIRAL_TRAJECTORY_RELATIONSHIPS.filter(
    (r) => r.trajectoryId === trajectoryId,
  );
}

const MULTI_OCCURRENCE_STAGES = multiOccurrenceStageIds();

/**
 * A ref without an occurrence matches only a stage-kind that occurs once.
 * For a recurring stage-kind it matches nothing: it is never expanded to every
 * occurrence (validation reports it as ambiguous).
 */
function refMatchesStop(
  ref: SpiralTrajectoryRelationship["operations"][number],
  stop: SpiralSequenceStop,
): boolean {
  if (ref.stageId !== stop.stageId) return false;
  if (ref.occurrenceId) return ref.occurrenceId === stop.occurrenceId;
  return !MULTI_OCCURRENCE_STAGES.has(ref.stageId);
}

/** Authored relationships for one occurrence. Zero is valid. */
export function relationshipsForStop(
  trajectoryId: string | null | undefined,
  stop: SpiralSequenceStop,
): SpiralTrajectoryRelationship[] {
  return relationshipsForTrajectory(trajectoryId).filter((r) =>
    r.operations.some((ref) => refMatchesStop(ref, stop)),
  );
}

/** Occurrences touched by a relationship — from authored refs only. */
export function occurrencesForRelationship(
  relationship: SpiralTrajectoryRelationship,
): SpiralSequenceStop[] {
  return SPIRAL_SEQUENCE.filter((stop) =>
    relationship.operations.some((ref) => refMatchesStop(ref, stop)),
  );
}

/** Step ids an anchor covers, along its authored path. Unresolvable spans cover nothing. */
export function anchorStepIds(
  trajectory: SpiralTrajectory,
  anchor: SpiralTrajectoryAnchor,
): string[] {
  if (anchor.kind === "step") return [anchor.stepId];
  if (anchor.kind === "transition") return [anchor.from, anchor.to];
  const span = resolveSpan(trajectory, anchor);
  return span.ok ? [...span.path] : [];
}

/** Authored relationships whose anchor touches a step. */
export function relationshipsForStep(
  trajectory: SpiralTrajectory,
  stepId: string,
): SpiralTrajectoryRelationship[] {
  return relationshipsForTrajectory(trajectory.id).filter((r) =>
    anchorStepIds(trajectory, r.anchor).includes(stepId),
  );
}

export function anchorLabel(
  trajectory: SpiralTrajectory,
  anchor: SpiralTrajectoryAnchor,
): string {
  const label = (id: string) =>
    trajectory.steps.find((s) => s.id === id)?.label ?? id;
  if (anchor.kind === "step") return label(anchor.stepId);
  if (anchor.kind === "transition")
    return `${label(anchor.from)} → ${label(anchor.to)}`;
  return `${label(anchor.from)} … ${label(anchor.to)}`;
}

export { JESUS_RELATIONSHIPS, METAMORPHOSIS_RELATIONSHIPS, ZODIAC_RELATIONSHIPS };

export {
  EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS,
  EMERGENCE_AGAIN_OCCURRENCE_ID,
  SPIRAL_NAME_COLLISION_ACKNOWLEDGEMENTS,
  isDrawableCorrespondence,
  multiOccurrenceStageIds,
  validateSpiralComparisons,
  validateTrajectoryTopology,
} from "./validate";
export { conceptMatches, resolveRelationshipConcept } from "./research";
export type { SpiralConceptMatch } from "./research";
export type {
  SpiralComparisonIssue,
  SpiralComparisonIssueCode,
  SpiralComparisonValidationOptions,
  SpiralNameCollisionAcknowledgement,
} from "./validate";
