import {
  EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS,
  EMERGENCE_AGAIN_OCCURRENCE_ID,
  isDrawableRelationship,
  occurrencesForRelationship,
  relationshipsForTrajectory,
} from "@/lib/evolutionary-spiral/comparisons";
import type {
  SpiralRelationshipStatus,
  SpiralTrajectoryRelationship,
} from "@/lib/evolutionary-spiral/types";

export type SpiralArcEndpoint = {
  relationshipId: string;
  occurrenceId: string;
  status: SpiralRelationshipStatus;
};

/**
 * Every connecting line on the composite figure comes from here: one per
 * Spiral occurrence explicitly named by an authored relationship record.
 * Takes records only — no geometry, step order, labels, or positions — so
 * nothing else can produce a line. Callers pass every record; the filter lives
 * here, so only explicitly drawable statuses become lines whatever the caller
 * forgets. Emergence again is drawn only for approved records.
 */
export function arcEndpointsFromRelationships(
  relationships: readonly SpiralTrajectoryRelationship[],
  approvedEmergenceAgain: readonly string[] = EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS,
): SpiralArcEndpoint[] {
  return relationships.filter(isDrawableRelationship).flatMap((r) =>
    occurrencesForRelationship(r)
      .filter(
        (stop) =>
          stop.occurrenceId !== EMERGENCE_AGAIN_OCCURRENCE_ID ||
          approvedEmergenceAgain.includes(r.id),
      )
      .map((stop) => ({
        relationshipId: r.id,
        occurrenceId: stop.occurrenceId,
        status: r.status,
      })),
  );
}

export function arcEndpointsForTrajectory(
  trajectoryId: string | null | undefined,
): SpiralArcEndpoint[] {
  return arcEndpointsFromRelationships(relationshipsForTrajectory(trajectoryId));
}
