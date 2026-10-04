import { SPIRAL_SEQUENCE, SPIRAL_STAGES } from "../stages";
import type {
  SpiralOperationRef,
  SpiralSequenceStop,
  SpiralStageId,
  SpiralTrajectory,
  SpiralTrajectoryRelationship,
} from "../types";

/**
 * Validation for authored trajectory ↔ Spiral relationships.
 *
 * Relationships are intellectual claims. These rules make sure a claim can
 * only exist because someone authored it explicitly — never because of
 * ambiguity, position, naming, or an incidental data edit.
 */

export type SpiralComparisonIssueCode =
  | "unknown-trajectory"
  | "duplicate-relationship-id"
  | "no-operations"
  | "ambiguous-occurrence"
  | "unknown-occurrence"
  | "emergence-again-not-approved"
  | "unknown-step"
  | "unknown-transition"
  | "unknown-span-endpoint"
  | "unacknowledged-name-collision";

export type SpiralComparisonIssue = {
  code: SpiralComparisonIssueCode;
  message: string;
  relationshipId?: string;
  trajectoryId?: string;
  stepId?: string;
};

/** The later-turn Emergence occurrence ("Emergence again"). */
export const EMERGENCE_AGAIN_OCCURRENCE_ID: string = SPIRAL_SEQUENCE.find(
  (s) => s.stageId === "emergence" && s.cycleIndex > 0,
)!.occurrenceId;

/**
 * Relationship ids approved to target Emergence again.
 * Adding an id here is an architectural decision, not a data edit.
 */
export const EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS: readonly string[] = [];

/**
 * Reviewed trajectory steps whose label exactly matches a Spiral operation
 * name. A matching name is not a relationship; acknowledging it records that
 * someone checked the collision (e.g. the "renewal effect" in fear-extinction
 * research is not the Spiral's Renewal).
 */
export type SpiralNameCollisionAcknowledgement = {
  trajectoryId: string;
  stepId: string;
  reason: string;
};

export const SPIRAL_NAME_COLLISION_ACKNOWLEDGEMENTS: readonly SpiralNameCollisionAcknowledgement[] =
  [];

/** Stage-kinds that occur more than once in the reference trajectory. */
export function multiOccurrenceStageIds(
  sequence: readonly SpiralSequenceStop[] = SPIRAL_SEQUENCE,
): Set<SpiralStageId> {
  const counts = new Map<SpiralStageId, number>();
  for (const stop of sequence) {
    counts.set(stop.stageId, (counts.get(stop.stageId) ?? 0) + 1);
  }
  return new Set([...counts].filter(([, n]) => n > 1).map(([id]) => id));
}

/** Names a trajectory step must not share silently with a Spiral operation. */
function operationNames(): Set<string> {
  const names = new Set<string>();
  for (const stage of SPIRAL_STAGES) names.add(normalize(stage.name));
  for (const stop of SPIRAL_SEQUENCE) {
    if (stop.labelOverride) names.add(normalize(stop.labelOverride));
  }
  return names;
}

function normalize(label: string): string {
  return label.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Current, linear transition semantics: an explicit edge, or adjacent steps in
 * reading order (closing back to the start for cyclical trajectories).
 */
function transitionExists(
  trajectory: SpiralTrajectory,
  from: string,
  to: string,
): boolean {
  if (trajectory.transitions?.some((e) => e.from === from && e.to === to)) {
    return true;
  }
  const ids = trajectory.steps.map((s) => s.id);
  const i = ids.indexOf(from);
  if (i < 0 || !ids.includes(to)) return false;
  if (ids[i + 1] === to) return true;
  return trajectory.shape === "cyclical" && i === ids.length - 1 && ids[0] === to;
}

function validateOperation(
  r: SpiralTrajectoryRelationship,
  ref: SpiralOperationRef,
  multi: Set<SpiralStageId>,
  approvedEmergenceAgain: readonly string[],
): SpiralComparisonIssue[] {
  const issues: SpiralComparisonIssue[] = [];
  if (!ref.occurrenceId) {
    if (multi.has(ref.stageId)) {
      issues.push({
        code: "ambiguous-occurrence",
        relationshipId: r.id,
        message: `${r.id}: "${ref.stageId}" occurs more than once; name the occurrence explicitly.`,
      });
    }
    return issues;
  }
  const stop = SPIRAL_SEQUENCE.find((s) => s.occurrenceId === ref.occurrenceId);
  if (!stop || stop.stageId !== ref.stageId) {
    issues.push({
      code: "unknown-occurrence",
      relationshipId: r.id,
      message: `${r.id}: occurrence "${ref.occurrenceId}" is not an occurrence of "${ref.stageId}".`,
    });
    return issues;
  }
  if (
    ref.occurrenceId === EMERGENCE_AGAIN_OCCURRENCE_ID &&
    !approvedEmergenceAgain.includes(r.id)
  ) {
    issues.push({
      code: "emergence-again-not-approved",
      relationshipId: r.id,
      message: `${r.id}: relationships to Emergence again require explicit approval.`,
    });
  }
  return issues;
}

function validateAnchor(
  r: SpiralTrajectoryRelationship,
  trajectory: SpiralTrajectory,
): SpiralComparisonIssue[] {
  const has = (id: string) => trajectory.steps.some((s) => s.id === id);
  const { anchor } = r;
  if (anchor.kind === "step") {
    return has(anchor.stepId)
      ? []
      : [
          {
            code: "unknown-step",
            relationshipId: r.id,
            message: `${r.id}: step "${anchor.stepId}" is not in ${trajectory.id}.`,
          },
        ];
  }
  if (anchor.kind === "transition") {
    return transitionExists(trajectory, anchor.from, anchor.to)
      ? []
      : [
          {
            code: "unknown-transition",
            relationshipId: r.id,
            message: `${r.id}: ${anchor.from} → ${anchor.to} is not a transition in ${trajectory.id}.`,
          },
        ];
  }
  return [anchor.from, anchor.to]
    .filter((id) => !has(id))
    .map((id) => ({
      code: "unknown-span-endpoint" as const,
      relationshipId: r.id,
      message: `${r.id}: span endpoint "${id}" is not in ${trajectory.id}.`,
    }));
}

export type SpiralComparisonValidationOptions = {
  approvedEmergenceAgain?: readonly string[];
  nameCollisionAcknowledgements?: readonly SpiralNameCollisionAcknowledgement[];
};

/** Validate relationship records against trajectories. Empty result = valid. */
export function validateSpiralComparisons(
  relationships: readonly SpiralTrajectoryRelationship[],
  trajectories: readonly SpiralTrajectory[],
  options: SpiralComparisonValidationOptions = {},
): SpiralComparisonIssue[] {
  const approved =
    options.approvedEmergenceAgain ?? EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS;
  const acknowledgements =
    options.nameCollisionAcknowledgements ?? SPIRAL_NAME_COLLISION_ACKNOWLEDGEMENTS;
  const multi = multiOccurrenceStageIds();
  const issues: SpiralComparisonIssue[] = [];
  const seen = new Set<string>();

  for (const r of relationships) {
    if (seen.has(r.id)) {
      issues.push({
        code: "duplicate-relationship-id",
        relationshipId: r.id,
        message: `${r.id}: relationship id is used more than once.`,
      });
    }
    seen.add(r.id);

    const trajectory = trajectories.find((t) => t.id === r.trajectoryId);
    if (!trajectory) {
      issues.push({
        code: "unknown-trajectory",
        relationshipId: r.id,
        message: `${r.id}: trajectory "${r.trajectoryId}" does not exist.`,
      });
    } else {
      issues.push(...validateAnchor(r, trajectory));
    }

    if (r.operations.length === 0) {
      issues.push({
        code: "no-operations",
        relationshipId: r.id,
        message: `${r.id}: names no Spiral operation.`,
      });
    }
    for (const ref of r.operations) {
      issues.push(...validateOperation(r, ref, multi, approved));
    }
  }

  const names = operationNames();
  for (const t of trajectories) {
    for (const step of t.steps) {
      if (!names.has(normalize(step.label))) continue;
      const acknowledged = acknowledgements.some(
        (a) => a.trajectoryId === t.id && a.stepId === step.id && a.reason.trim(),
      );
      if (!acknowledged) {
        issues.push({
          code: "unacknowledged-name-collision",
          trajectoryId: t.id,
          stepId: step.id,
          message: `${t.id}/${step.id}: label "${step.label}" matches a Spiral operation name. A shared name is not a relationship; acknowledge the review explicitly.`,
        });
      }
    }
  }

  return issues;
}

/**
 * Whether a relationship may be drawn as a correspondence line.
 * Comparison breaks are evidence of where analogy fails, not correspondence.
 */
export function isDrawableCorrespondence(
  r: SpiralTrajectoryRelationship,
): boolean {
  return r.status !== "comparison-break";
}
