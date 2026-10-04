import { SPIRAL_SEQUENCE, SPIRAL_STAGES } from "../stages";
import { EXPLICIT_TOPOLOGY_SHAPES, findEdge, resolveSpan } from "../topology";
import { SPIRAL_SCALE_IDS } from "../types";
import type {
  SpiralOperationRef,
  SpiralSequenceStop,
  SpiralStageId,
  SpiralTrajectory,
  SpiralTrajectoryRelationship,
} from "../types";
import { conceptMatches } from "./research";

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
  | "ambiguous-span"
  | "invalid-span-path"
  | "unknown-concept"
  | "ambiguous-concept"
  | "unknown-scale"
  | "unacknowledged-name-collision"
  | "duplicate-step-id"
  | "missing-explicit-transitions"
  | "duplicate-transition-id"
  | "duplicate-transition"
  | "unknown-transition-step"
  | "unconnected-step"
  | "divergence-requires-branching-shape"
  | "duplicate-trajectory-concept";

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
 * Topology is checked for malformed references only. Cycles, loops and
 * revisits are valid; a step may lead to several next steps only in a
 * branching or recurrent trajectory, which must declare its transitions.
 */
export function validateTrajectoryTopology(
  trajectory: SpiralTrajectory,
): SpiralComparisonIssue[] {
  const issues: SpiralComparisonIssue[] = [];
  const t = trajectory.id;
  const stepIds = new Set<string>();
  for (const step of trajectory.steps) {
    if (stepIds.has(step.id)) {
      issues.push({
        code: "duplicate-step-id",
        trajectoryId: t,
        stepId: step.id,
        message: `${t}/${step.id}: step id is used more than once.`,
      });
    }
    stepIds.add(step.id);
  }

  const conceptIds = new Set<string>();
  for (const concept of trajectory.concepts ?? []) {
    if (conceptIds.has(concept.id)) {
      issues.push({
        code: "duplicate-trajectory-concept",
        trajectoryId: t,
        message: `${t}: concept id "${concept.id}" is used more than once.`,
      });
    }
    conceptIds.add(concept.id);
  }

  if (EXPLICIT_TOPOLOGY_SHAPES.has(trajectory.shape) && !trajectory.transitions) {
    issues.push({
      code: "missing-explicit-transitions",
      trajectoryId: t,
      message: `${t}: a ${trajectory.shape} trajectory cannot be read from step order; declare its transitions.`,
    });
  }

  if (!trajectory.transitions) return issues;

  const edgeIds = new Set<string>();
  const pairs = new Set<string>();
  for (const edge of trajectory.transitions) {
    if (edgeIds.has(edge.id)) {
      issues.push({
        code: "duplicate-transition-id",
        trajectoryId: t,
        message: `${t}: transition id "${edge.id}" is used more than once.`,
      });
    }
    edgeIds.add(edge.id);
    const pair = `${edge.from}\u0000${edge.to}`;
    if (pairs.has(pair)) {
      issues.push({
        code: "duplicate-transition",
        trajectoryId: t,
        message: `${t}: more than one transition ${edge.from} → ${edge.to}.`,
      });
    }
    pairs.add(pair);
    for (const end of [edge.from, edge.to]) {
      if (!stepIds.has(end)) {
        issues.push({
          code: "unknown-transition-step",
          trajectoryId: t,
          stepId: end,
          message: `${t}: transition "${edge.id}" references unknown step "${end}".`,
        });
      }
    }
  }

  if (trajectory.steps.length > 1) {
    for (const step of trajectory.steps) {
      const touched = trajectory.transitions.some(
        (e) => e.from === step.id || e.to === step.id,
      );
      if (!touched) {
        issues.push({
          code: "unconnected-step",
          trajectoryId: t,
          stepId: step.id,
          message: `${t}/${step.id}: no transition reaches or leaves this step.`,
        });
      }
    }
  }

  if (!EXPLICIT_TOPOLOGY_SHAPES.has(trajectory.shape)) {
    for (const step of trajectory.steps) {
      const out = trajectory.transitions.filter((e) => e.from === step.id).length;
      if (out > 1) {
        issues.push({
          code: "divergence-requires-branching-shape",
          trajectoryId: t,
          stepId: step.id,
          message: `${t}/${step.id}: leads to ${out} steps, but the trajectory is ${trajectory.shape}.`,
        });
      }
    }
  }

  return issues;
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
    return findEdge(trajectory, anchor.from, anchor.to)
      ? []
      : [
          {
            code: "unknown-transition",
            relationshipId: r.id,
            message: `${r.id}: ${anchor.from} → ${anchor.to} is not a transition in ${trajectory.id}.`,
          },
        ];
  }
  const missing = [anchor.from, anchor.to].filter((id) => !has(id));
  if (missing.length > 0) {
    return missing.map((id) => ({
      code: "unknown-span-endpoint" as const,
      relationshipId: r.id,
      message: `${r.id}: span endpoint "${id}" is not in ${trajectory.id}.`,
    }));
  }
  const span = resolveSpan(trajectory, anchor);
  if (span.ok) return [];
  if (span.reason === "ambiguous") {
    return [
      {
        code: "ambiguous-span",
        relationshipId: r.id,
        message: `${r.id}: ${anchor.from} … ${anchor.to} in ${trajectory.id} needs an authored path (via).`,
      },
    ];
  }
  return [
    {
      code: "invalid-span-path",
      relationshipId: r.id,
      message: `${r.id}: ${span.path.join(" → ")} is not a path of transitions in ${trajectory.id}.`,
    },
  ];
}

function validateResearch(
  r: SpiralTrajectoryRelationship,
  trajectory: SpiralTrajectory,
): SpiralComparisonIssue[] {
  const issues: SpiralComparisonIssue[] = [];
  if (r.conceptId) {
    const matches = conceptMatches(r, trajectory);
    if (matches.length === 0) {
      issues.push({
        code: "unknown-concept",
        relationshipId: r.id,
        message: `${r.id}: concept "${r.conceptId}" is not in ${trajectory.id} or the stage research it names.`,
      });
    } else if (matches.length > 1) {
      issues.push({
        code: "ambiguous-concept",
        relationshipId: r.id,
        message: `${r.id}: concept "${r.conceptId}" exists in more than one scope (${matches
          .map((m) => (m.scope === "stage" ? `stage:${m.stageId}` : "trajectory"))
          .join(", ")}).`,
      });
    }
  }
  if (r.scale && !(SPIRAL_SCALE_IDS as readonly string[]).includes(r.scale.id)) {
    issues.push({
      code: "unknown-scale",
      relationshipId: r.id,
      message: `${r.id}: scale "${r.scale.id}" is not in the scale vocabulary.`,
    });
  }
  return issues;
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
  const issues: SpiralComparisonIssue[] = trajectories.flatMap(
    validateTrajectoryTopology,
  );
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
      issues.push(...validateResearch(r, trajectory));
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
