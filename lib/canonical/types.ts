/**
 * Canonical relational foundation — identity + trusted relations only.
 *
 * This module does not replace Atlas V1 UI, the legacy atlas graph, Thread,
 * or theme hubs. Those remain the live visitor machinery until a later phase.
 *
 * Rules:
 * - Registry entries REFERENCE existing objects. They do not copy bodies,
 *   book descriptions, Observatory fragments, or Visual Map images.
 * - Canonical reads return AUTHORED and SOURCE_GROUNDED only.
 * - INFERRED / SUGGESTED may exist on the type for a future review queue.
 *   They must never enter CANONICAL_RELATIONS or default query results.
 */

export const CANONICAL_OBJECT_TYPES = [
  "BOOK",
  "ESSAY",
  "OBSERVATION",
  "VISUAL_MAP_COLLECTION",
  "VISUAL_MAP_PLATE",
  "CHAMBER",
  /** Atlas V1 lived concepts — not legacy th-* theme hubs */
  "CONCEPT",
  /** Atlas V1 living questions — not legacy q1–q4 */
  "QUESTION",
  /**
   * Atlas V1 evidence packs as pointers only (id + routing).
   * Excerpt text stays in lib/atlas-v1. The pack SOURCED_FROM a real essay/book.
   */
  "EVIDENCE",
] as const;

export type CanonicalObjectType = (typeof CANONICAL_OBJECT_TYPES)[number];

export const CANONICAL_PROVENANCE = [
  "AUTHORED",
  "SOURCE_GROUNDED",
  "INFERRED",
  "SUGGESTED",
] as const;

export type CanonicalProvenance = (typeof CANONICAL_PROVENANCE)[number];

/** Provenance allowed in canonical Atlas relationship reads */
export const TRUSTED_PROVENANCE = ["AUTHORED", "SOURCE_GROUNDED"] as const;

export type TrustedProvenance = (typeof TRUSTED_PROVENANCE)[number];

/**
 * Restrained vocabulary for relationships we can already support from
 * trusted sources. Do not add EXTENDS / DEVELOPED_INTO / SAME_PATTERN /
 * CONTRADICTS until a trusted source actually states that.
 */
export const CANONICAL_RELATION_TYPES = [
  "RELATES_TO",
  "SOURCED_FROM",
  "EVIDENCE_FOR",
  "QUESTIONS",
  "HAS_CHAMBER",
  "APPEARS_IN",
  "SUPERSEDES",
] as const;

export type CanonicalRelationType = (typeof CANONICAL_RELATION_TYPES)[number];

export type CanonicalVisibility = "public" | "superseded";

export interface CanonicalObject {
  id: string;
  type: CanonicalObjectType;
  title: string;
  /** Visitor route for the real object (or its room, when it has no page) */
  route: string;
  sourceModule: string;
  visibility: CanonicalVisibility;
  /** On the current edition: id of the historical object it replaces */
  supersedesId?: string;
  /** Visual Map plate → collection (identity, not a conceptual relation) */
  collectionId?: string;
  /** Evidence pack → real essay/book id (routing; the relation is SOURCED_FROM) */
  sourceObjectId?: string;
}

export interface CanonicalRelation {
  id: string;
  from: string;
  type: CanonicalRelationType;
  to: string;
  provenance: CanonicalProvenance;
  note?: string;
}

export interface CanonicalReadOptions {
  /**
   * When true, also return INFERRED / SUGGESTED rows from the review queue.
   * Default false. Canonical Atlas callers must leave this unset.
   */
  includeNonCanonical?: boolean;
}

export interface CanonicalValidationIssue {
  level: "error" | "warning";
  code: string;
  message: string;
}
