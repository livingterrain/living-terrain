import {
  occurrencesForRelationship,
  relationshipsForTrajectory,
  type SpiralRelationshipStatus,
} from "@/lib/evolutionary-spiral";

export type SpiralArcEndpoint = {
  relationshipId: string;
  occurrenceId: string;
  status: SpiralRelationshipStatus;
};

/**
 * Every connecting line on the composite figure comes from here: one per
 * Spiral occurrence named by an authored relationship record. Never derive
 * lines from step order, position, labels, or similarity.
 */
export function arcEndpointsForTrajectory(
  trajectoryId: string | null | undefined,
): SpiralArcEndpoint[] {
  if (!trajectoryId) return [];
  return relationshipsForTrajectory(trajectoryId).flatMap((r) =>
    occurrencesForRelationship(r).map((stop) => ({
      relationshipId: r.id,
      occurrenceId: stop.occurrenceId,
      status: r.status,
    })),
  );
}
