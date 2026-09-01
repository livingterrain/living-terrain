/**
 * Atlas as a VIEW over canonical relational truth.
 *
 * Builds a serializable snapshot for /atlas so the client journey does not
 * import the full registry (and does not read inferred related-books).
 *
 * Does not add relationships. Does not change journey order.
 * Local V1 files remain presentation metadata (excerpts, fragments, sequence).
 */

import {
  ATLAS_V1_ESSAYS,
  ATLAS_V1_QUESTIONS,
  type AtlasV1ConceptId,
  type AtlasV1EssayId,
  type AtlasV1QuestionId,
} from "@/lib/atlas-v1/content";
import { atlasBondKey } from "./atlas-keys";
import { getCanonicalRelationsFrom, listCanonicalRelations } from "./query";
import { resolveCanonicalRef, type CanonicalRef } from "./resolve";
import type { TrustedProvenance } from "./types";
import type { ThreadRelationEdge } from "@/lib/atlas-v1/living-thread";

export type { CanonicalRef } from "./resolve";
export { atlasBondKey } from "./atlas-keys";

export type AtlasBondView = {
  to: AtlasV1ConceptId;
  why: string;
  provenance: TrustedProvenance;
};

export type AtlasBookView = {
  id: string;
  title: string;
  route: string;
};

export type AtlasCanonicalView = {
  bonds: Record<string, AtlasBondView | null>;
  evidenceSource: Partial<Record<AtlasV1EssayId, CanonicalRef>>;
  relatedBooks: Partial<Record<AtlasV1EssayId, AtlasBookView[]>>;
  /**
   * Trusted AUTHORED / SOURCE_GROUNDED edges among Atlas-relevant objects.
   * For Living Thread overlay only — never invents relations.
   */
  threadRelations: ThreadRelationEdge[];
};

function isConceptId(id: string): id is AtlasV1ConceptId {
  return (
    id === "body" ||
    id === "relationship" ||
    id === "feedback" ||
    id === "technology" ||
    id === "adaptation" ||
    id === "constraint" ||
    id === "participation" ||
    id === "time" ||
    id === "meaning" ||
    id === "reality"
  );
}

function canonicalBondFor(
  questionId: AtlasV1QuestionId,
  from: AtlasV1ConceptId,
  to: AtlasV1ConceptId,
): AtlasBondView | null {
  const expectedId = `v1:${questionId}:${from}→${to}:RELATES_TO`;
  const match = getCanonicalRelationsFrom(from).find(
    (relation) =>
      relation.id === expectedId &&
      relation.type === "RELATES_TO" &&
      relation.to === to,
  );
  if (!match?.note) return null;
  if (
    match.provenance !== "AUTHORED" &&
    match.provenance !== "SOURCE_GROUNDED"
  ) {
    return null;
  }
  return {
    to,
    why: match.note,
    provenance: match.provenance,
  };
}

function evidenceSourceRef(evidenceId: AtlasV1EssayId): CanonicalRef | undefined {
  const sourced = getCanonicalRelationsFrom(evidenceId).find(
    (relation) => relation.type === "SOURCED_FROM",
  );
  if (!sourced) return undefined;
  return resolveCanonicalRef(sourced.to);
}

function trustedPublicBooksFrom(objectId: string): AtlasBookView[] {
  const seen = new Set<string>();
  const books: AtlasBookView[] = [];
  for (const relation of getCanonicalRelationsFrom(objectId)) {
    if (relation.type !== "RELATES_TO") continue;
    const ref = resolveCanonicalRef(relation.to);
    if (!ref || ref.type !== "BOOK") continue;
    if (ref.visibility !== "public") continue;
    if (ref.id === objectId) continue;
    if (seen.has(ref.id)) continue;
    seen.add(ref.id);
    books.push({ id: ref.id, title: ref.title, route: ref.route });
  }
  return books;
}

export function getAtlasCanonicalView(): AtlasCanonicalView {
  const bonds: Record<string, AtlasBondView | null> = {};

  for (const question of ATLAS_V1_QUESTIONS) {
    for (const [from, edges] of Object.entries(question.relations)) {
      const fromId = from as AtlasV1ConceptId;
      const first = (edges ?? [])[0];
      const key = atlasBondKey(question.id, fromId);
      if (!first || !isConceptId(first.to)) {
        bonds[key] = null;
        continue;
      }
      bonds[key] = canonicalBondFor(question.id, fromId, first.to);
    }
  }

  const evidenceSource: Partial<Record<AtlasV1EssayId, CanonicalRef>> = {};
  const relatedBooks: Partial<Record<AtlasV1EssayId, AtlasBookView[]>> = {};

  for (const evidenceId of Object.keys(ATLAS_V1_ESSAYS) as AtlasV1EssayId[]) {
    const source = evidenceSourceRef(evidenceId);
    if (source) evidenceSource[evidenceId] = source;
    const books = source ? trustedPublicBooksFrom(source.id) : [];
    relatedBooks[evidenceId] = books.filter(
      (book) => book.route !== source?.route && book.id !== source?.id,
    );
  }

  return {
    bonds,
    evidenceSource,
    relatedBooks,
    threadRelations: atlasThreadRelations(evidenceSource),
  };
}

/** IDs the Living Thread may encounter while traveling Atlas. */
function atlasThreadIdUniverse(
  evidenceSource: Partial<Record<AtlasV1EssayId, CanonicalRef>>,
): Set<string> {
  const ids = new Set<string>();
  for (const question of ATLAS_V1_QUESTIONS) {
    ids.add(question.id);
    for (const conceptId of Object.keys(question.relations)) {
      ids.add(conceptId);
    }
    for (const conceptId of Object.keys(question.evidence ?? {})) {
      ids.add(conceptId);
    }
  }
  for (const evidenceId of Object.keys(ATLAS_V1_ESSAYS) as AtlasV1EssayId[]) {
    ids.add(evidenceId);
    const source = evidenceSource[evidenceId];
    if (source) ids.add(source.id);
  }
  // All V1 concepts (start concepts may not appear only as relation keys)
  for (const conceptId of [
    "body",
    "relationship",
    "feedback",
    "technology",
    "adaptation",
    "constraint",
    "participation",
    "time",
    "meaning",
    "reality",
  ] as const) {
    ids.add(conceptId);
  }
  return ids;
}

function atlasThreadRelations(
  evidenceSource: Partial<Record<AtlasV1EssayId, CanonicalRef>>,
): ThreadRelationEdge[] {
  const universe = atlasThreadIdUniverse(evidenceSource);
  const seen = new Set<string>();
  const edges: ThreadRelationEdge[] = [];
  for (const relation of listCanonicalRelations()) {
    if (!universe.has(relation.from) || !universe.has(relation.to)) continue;
    const key = `${relation.from}|${relation.to}|${relation.type}`;
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push({
      from: relation.from,
      to: relation.to,
      type: relation.type,
    });
  }
  return edges;
}
