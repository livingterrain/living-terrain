import { getLensExploration } from "../exploration";
import type {
  SpiralConcept,
  SpiralStageId,
  SpiralTrajectory,
  SpiralTrajectoryRelationship,
} from "../types";

export type SpiralConceptMatch =
  | { scope: "trajectory"; concept: SpiralConcept }
  | { scope: "stage"; stageId: SpiralStageId; concept: SpiralConcept };

/**
 * Every place a relationship's `conceptId` could resolve: the trajectory's own
 * concepts, and the stage-local research of each named operation for the
 * trajectory's lens.
 */
export function conceptMatches(
  relationship: SpiralTrajectoryRelationship,
  trajectory: SpiralTrajectory,
): SpiralConceptMatch[] {
  const id = relationship.conceptId;
  if (!id) return [];
  const matches: SpiralConceptMatch[] = (trajectory.concepts ?? [])
    .filter((c) => c.id === id)
    .map((concept) => ({ scope: "trajectory" as const, concept }));
  const stageIds = new Set(relationship.operations.map((ref) => ref.stageId));
  for (const stageId of stageIds) {
    const concept = getLensExploration(stageId, trajectory.lensId)?.concepts.find(
      (c) => c.id === id,
    );
    if (concept) matches.push({ scope: "stage", stageId, concept });
  }
  return matches;
}

/** The single concept behind a relationship — undefined when absent or ambiguous. */
export function resolveRelationshipConcept(
  relationship: SpiralTrajectoryRelationship,
  trajectory: SpiralTrajectory,
): SpiralConceptMatch | undefined {
  const matches = conceptMatches(relationship, trajectory);
  return matches.length === 1 ? matches[0] : undefined;
}
