/**
 * Review queue for proposed relationships.
 * Empty until a later authoring pass. Do not populate from inference or AI.
 *
 * Approved rows must be copied into CANONICAL_RELATIONS by a human step.
 * They never become canonical by status change alone.
 */

import type { CanonicalRelationType } from "./types";

export type SuggestedRelationStatus = "pending" | "approved" | "rejected";

export type SuggestedRelationSource = "human" | "ai";

export interface SuggestedRelation {
  id: string;
  from: string;
  proposedType: CanonicalRelationType;
  to: string;
  rationale: string;
  source: SuggestedRelationSource;
  status: SuggestedRelationStatus;
}

export const SUGGESTED_RELATIONS: readonly SuggestedRelation[] = [];
