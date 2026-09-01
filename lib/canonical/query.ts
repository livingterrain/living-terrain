import { getCanonicalObject, listCanonicalObjects } from "./objects";
import {
  listCanonicalRelationRecords,
  listReviewRelationRecords,
} from "./relations";
import { TRUSTED_PROVENANCE, type CanonicalObject, type CanonicalReadOptions, type CanonicalRelation, type TrustedProvenance } from "./types";

const TRUSTED = new Set<string>(TRUSTED_PROVENANCE);

function isTrusted(relation: CanonicalRelation): relation is CanonicalRelation & {
  provenance: TrustedProvenance;
} {
  return TRUSTED.has(relation.provenance);
}

function visibleRelations(options?: CanonicalReadOptions): CanonicalRelation[] {
  const trusted = listCanonicalRelationRecords().filter(isTrusted);
  if (!options?.includeNonCanonical) return [...trusted];
  return [...trusted, ...listReviewRelationRecords()];
}

export function getCanonicalRelationsFrom(
  id: string,
  options?: CanonicalReadOptions,
): CanonicalRelation[] {
  return visibleRelations(options).filter((relation) => relation.from === id);
}

export function getCanonicalRelationsTo(
  id: string,
  options?: CanonicalReadOptions,
): CanonicalRelation[] {
  return visibleRelations(options).filter((relation) => relation.to === id);
}

export function getCanonicalRelations(
  id: string,
  options?: CanonicalReadOptions,
): CanonicalRelation[] {
  return visibleRelations(options).filter(
    (relation) => relation.from === id || relation.to === id,
  );
}

export function listCanonicalRelations(
  options?: CanonicalReadOptions,
): CanonicalRelation[] {
  return visibleRelations(options);
}

export { getCanonicalObject, listCanonicalObjects };

export function countCanonicalObjectsByType(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const object of listCanonicalObjects()) {
    counts[object.type] = (counts[object.type] ?? 0) + 1;
  }
  return counts;
}

export function essaysWithoutCanonicalRelations(): CanonicalObject[] {
  const connected = new Set<string>();
  for (const relation of listCanonicalRelationRecords()) {
    if (isTrusted(relation)) {
      connected.add(relation.from);
      connected.add(relation.to);
    }
  }
  return listCanonicalObjects().filter(
    (object) => object.type === "ESSAY" && !connected.has(object.id),
  );
}
