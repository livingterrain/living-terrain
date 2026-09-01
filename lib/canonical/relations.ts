/**
 * Canonical relations — AUTHORED and SOURCE_GROUNDED only.
 *
 * Isolated from:
 * - ATLAS_DATA.connections (legacy graph, including inferred edges)
 * - generateEssayConnections()
 * - q1–q4 pathway fabric
 * - theme-overlap book recommendations
 * - theme hubs
 * - Field Note graph edges
 *
 * Those systems must not write here.
 */

import {
  ATLAS_V1_CONCEPTS,
  ATLAS_V1_QUESTIONS,
  ATLAS_V1_SOURCE,
} from "@/lib/atlas-v1/content";
import {
  BIOLOGY_REVISED_EXPANDED,
  LIVING_TERRAIN_SERIES,
} from "@/lib/atlas/imports/books/series-catalog";
import { getCanonicalObject } from "./objects";
import type {
  CanonicalRelation,
  CanonicalRelationType,
  TrustedProvenance,
} from "./types";

interface TrustedRelation {
  from: string;
  type: CanonicalRelationType;
  to: string;
  provenance: TrustedProvenance;
  note?: string;
  id?: string;
}

function relationId(row: TrustedRelation): string {
  return row.id ?? `${row.from}→${row.to}:${row.type}`;
}

function trusted(row: TrustedRelation): CanonicalRelation {
  return {
    id: relationId(row),
    from: row.from,
    type: row.type,
    to: row.to,
    provenance: row.provenance,
    ...(row.note ? { note: row.note } : {}),
  };
}

function sourceObjectIdForEvidence(evidenceId: keyof typeof ATLAS_V1_SOURCE): string {
  const href = ATLAS_V1_SOURCE[evidenceId].href;
  const object = getCanonicalObject(evidenceId);
  if (object?.sourceObjectId) return object.sourceObjectId;
  throw new Error(
    `ATLAS_V1_SOURCE ${evidenceId} href ${href} does not resolve to a canonical book or essay`,
  );
}

function atlasV1Relations(): TrustedRelation[] {
  const rows: TrustedRelation[] = [];
  const sourced = new Set<string>();
  const evidenceFor = new Set<string>();

  for (const evidenceId of Object.keys(ATLAS_V1_SOURCE) as Array<
    keyof typeof ATLAS_V1_SOURCE
  >) {
    const to = sourceObjectIdForEvidence(evidenceId);
    const id = `${evidenceId}→${to}:SOURCED_FROM`;
    if (sourced.has(id)) continue;
    sourced.add(id);
    rows.push({
      id,
      from: evidenceId,
      type: "SOURCED_FROM",
      to,
      provenance: "SOURCE_GROUNDED",
    });
  }

  function evidenceSupports(evidenceId: string, conceptId: string) {
    const id = `${evidenceId}→${conceptId}:EVIDENCE_FOR`;
    if (evidenceFor.has(id)) return;
    evidenceFor.add(id);
    rows.push({
      id,
      from: evidenceId,
      type: "EVIDENCE_FOR",
      to: conceptId,
      provenance: "AUTHORED",
    });
  }

  for (const concept of Object.values(ATLAS_V1_CONCEPTS)) {
    if (concept.essayId) evidenceSupports(concept.essayId, concept.id);
  }

  for (const question of ATLAS_V1_QUESTIONS) {
    rows.push({
      id: `${question.id}→${question.startConceptId}:QUESTIONS`,
      from: question.id,
      type: "QUESTIONS",
      to: question.startConceptId,
      provenance: "AUTHORED",
    });

    for (const [conceptId, evidenceId] of Object.entries(question.evidence)) {
      if (evidenceId) evidenceSupports(evidenceId, conceptId);
    }

    for (const [fromConcept, edges] of Object.entries(question.relations)) {
      for (const edge of edges ?? []) {
        rows.push({
          id: `v1:${question.id}:${fromConcept}→${edge.to}:RELATES_TO`,
          from: fromConcept,
          type: "RELATES_TO",
          to: edge.to,
          provenance: "AUTHORED",
          note: edge.why,
        });
      }
    }
  }

  return rows;
}

function bookChamberRelations(): TrustedRelation[] {
  const rows: TrustedRelation[] = [
    {
      from: "b1",
      type: "HAS_CHAMBER",
      to: "p1",
      provenance: "AUTHORED",
    },
    {
      from: "b2",
      type: "HAS_CHAMBER",
      to: "p2",
      provenance: "AUTHORED",
      note: "historical edition of this investigation.",
    },
    {
      from: BIOLOGY_REVISED_EXPANDED.id,
      type: "HAS_CHAMBER",
      to: BIOLOGY_REVISED_EXPANDED.chamberId,
      provenance: "AUTHORED",
      note: "the current Revised & Expanded edition of this investigation.",
    },
    {
      from: BIOLOGY_REVISED_EXPANDED.id,
      type: "SUPERSEDES",
      to: BIOLOGY_REVISED_EXPANDED.supersedesId,
      provenance: "AUTHORED",
    },
  ];

  for (const book of LIVING_TERRAIN_SERIES) {
    if (book.id === "b2") continue;
    rows.push({
      from: book.id,
      type: "HAS_CHAMBER",
      to: book.chamberId,
      provenance: "AUTHORED",
    });
  }

  return rows;
}

/**
 * Essay ↔ book/chamber from named chamber references and Structure seed links.
 * Finding-aid pairings are omitted (see NOT_MIGRATED below).
 *
 * Biology chamber names the work, not a specific printing. Those book
 * relations resolve to b8 (current public edition). Original encoding
 * targeted b2; see Phase 1 report.
 */
function essayWorkRelations(): TrustedRelation[] {
  return [
    {
      from: "e11",
      type: "APPEARS_IN",
      to: "p2",
      provenance: "AUTHORED",
      note: "named in The Biology of Becoming chamber as a connected inquiry.",
    },
    {
      from: "e11",
      type: "RELATES_TO",
      to: "b8",
      provenance: "AUTHORED",
      note: "named in The Biology of Becoming chamber as a connected inquiry.",
    },
    {
      from: "e1",
      type: "APPEARS_IN",
      to: "p2",
      provenance: "AUTHORED",
      note: "named in The Biology of Becoming chamber as a related inquiry.",
    },
    {
      from: "e1",
      type: "RELATES_TO",
      to: "b8",
      provenance: "AUTHORED",
      note: "named in The Biology of Becoming chamber as a related inquiry.",
    },
    {
      from: "e11",
      type: "APPEARS_IN",
      to: "p3",
      provenance: "AUTHORED",
      note: "named in The Second Birth chamber editorial references.",
    },
    {
      from: "e11",
      type: "RELATES_TO",
      to: "b3",
      provenance: "AUTHORED",
      note: "named in The Second Birth chamber editorial references.",
    },
    {
      from: "e1",
      type: "RELATES_TO",
      to: "b1",
      provenance: "AUTHORED",
      note: "named beside The Structure Beneath Reality in Living Terrain’s atlas of inquiry.",
    },
    {
      from: "e1",
      type: "APPEARS_IN",
      to: "p1",
      provenance: "AUTHORED",
      note: "returns to the chamber where this inquiry began.",
    },
    {
      from: "e2",
      type: "RELATES_TO",
      to: "b1",
      provenance: "AUTHORED",
      note: "belongs to the same volume of inquiry as The Structure Beneath Reality.",
    },
    {
      from: "e2",
      type: "APPEARS_IN",
      to: "p1",
      provenance: "AUTHORED",
      note: "deepens the chamber's central question.",
    },
  ];
}

function observatoryRelations(): TrustedRelation[] {
  return [
    {
      from: "obs-heart-authority",
      type: "SOURCED_FROM",
      to: "e1",
      provenance: "SOURCE_GROUNDED",
      note: "atlas essay e1 / constraint-is-not-the-opposite-of-freedom (exact consecutive sentences; Medium-published)",
    },
  ];
}

const SEEDED: CanonicalRelation[] = [
  ...atlasV1Relations(),
  ...bookChamberRelations(),
  ...essayWorkRelations(),
  ...observatoryRelations(),
].map(trusted);

const BY_ID = new Map<string, CanonicalRelation>();
for (const relation of SEEDED) {
  if (BY_ID.has(relation.id)) {
    throw new Error(`Duplicate canonical relation id: ${relation.id}`);
  }
  BY_ID.set(relation.id, relation);
}

/**
 * Trusted canonical relations. Never append INFERRED or SUGGESTED here.
 */
export const CANONICAL_RELATIONS: readonly CanonicalRelation[] = SEEDED;

/**
 * Review queue for future AI-suggested / inferred edges.
 * Default canonical reads ignore this array.
 * Must remain empty until a human review process exists.
 */
export const REVIEW_RELATIONS: readonly CanonicalRelation[] = [];

export function listCanonicalRelationRecords(): readonly CanonicalRelation[] {
  return CANONICAL_RELATIONS;
}

export function listReviewRelationRecords(): readonly CanonicalRelation[] {
  return REVIEW_RELATIONS;
}

/*
 * Deliberately NOT migrated into CANONICAL_RELATIONS:
 *
 * - generateEssayConnections() inferred chamber/volume/theme/pathway/echo edges
 * - FLAGSHIP neighboring-volume theme overlap
 * - q1–q4 pathway / thread fabric
 * - theme hubs and th-* theme edges
 * - fn1–fn5 field-note graph edges
 * - Atlas V1 relatedBooksForConcept() theme-overlap book lists
 * - Atlas V1 unfinishedHint (duplicate of the first authored RELATES_TO)
 * - finding-aid essay pairings:
 *     e3 ↔ b4 / p4  “paired with Below Criticality in the Atlas systems finding aid.”
 *     e1 ↔ b5 / p5  “paired with Embodied Physics in the Atlas energy finding aid.”
 *     e9 ↔ b6 / p6  “paired with A Field Guide to the Experience…”
 *     e3 ↔ b7 / p7  “paired with Feedback Is God in the Atlas systems finding aid.”
 * - Visual Map prev/next plate sequence (identity lives on plate.collectionId)
 * - obs-action-layer and obs-power-discernment (no target relationship yet)
 * - the 109 essays with no trusted edges, plus e6, e8, e9
 * - e1 ↔ e2 child/parent seed edges (essay↔essay was out of this pass’s start list)
 * - visitor observations
 */
