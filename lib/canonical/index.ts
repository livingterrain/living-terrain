/**
 * Canonical relational foundation.
 *
 * /atlas journey reads a snapshot from lib/canonical/atlas-view.ts.
 * It does not import this barrel from the client Void path.
 *
 * Legacy / non-canonical (still live elsewhere, still not Atlas truth):
 * - lib/atlas/data.ts connections
 * - lib/content-import/connections.ts generateEssayConnections
 * - q1–q4 pathway fabric
 * - lib/atlas-v1/books.ts relatedBooksForConcept
 * - lib/realms/hub.ts theme hubs
 * - fn1–fn5 graph relationships
 */

export type {
  CanonicalObject,
  CanonicalObjectType,
  CanonicalProvenance,
  CanonicalReadOptions,
  CanonicalRelation,
  CanonicalRelationType,
  CanonicalValidationIssue,
  CanonicalVisibility,
  TrustedProvenance,
} from "./types";

export {
  CANONICAL_OBJECT_TYPES,
  CANONICAL_PROVENANCE,
  CANONICAL_RELATION_TYPES,
  TRUSTED_PROVENANCE,
} from "./types";

export {
  getCanonicalObject,
  getCanonicalObjectsByType,
  listCanonicalObjects,
  requireCanonicalObject,
} from "./objects";

export {
  CANONICAL_RELATIONS,
  REVIEW_RELATIONS,
} from "./relations";

export {
  countCanonicalObjectsByType,
  essaysWithoutCanonicalRelations,
  getCanonicalRelations,
  getCanonicalRelationsFrom,
  getCanonicalRelationsTo,
  listCanonicalRelations,
} from "./query";

export {
  assertCanonicalFoundation,
  validateCanonicalFoundation,
} from "./validate";

export {
  requireCanonicalRef,
  resolveCanonicalRef,
  type CanonicalRef,
} from "./resolve";

export { atlasBondKey } from "./atlas-keys";
export {
  getAtlasCanonicalView,
  type AtlasBondView,
  type AtlasBookView,
  type AtlasCanonicalView,
} from "./atlas-view";

export {
  SUGGESTED_RELATIONS,
  type SuggestedRelation,
  type SuggestedRelationSource,
  type SuggestedRelationStatus,
} from "./suggested";
