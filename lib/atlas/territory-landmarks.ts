/**
 * Atlas threshold — trusted territory matrix.
 *
 * Derives inspect contents for every root from architecture placement +
 * AUTHORED / SOURCE_GROUNDED canonical truth only.
 *
 * Does not invent relations. Does not expose standalone evidence packs.
 * Superseded Biology (b2) upgrades to Revised & Expanded (b8).
 */

import {
  getRootTerritory,
  placementsForTerritory,
  type QuestionPlacement,
  type RootTerritoryId,
  type TerritoryDepth,
} from "@/lib/atlas/architecture";
import {
  ATLAS_V1_CONCEPTS,
  ATLAS_V1_QUESTIONS,
  type AtlasV1ConceptId,
  type AtlasV1EssayId,
  type AtlasV1QuestionId,
} from "@/lib/atlas-v1/content";
import {
  getCanonicalObject,
  getCanonicalRelationsFrom,
  getCanonicalRelationsTo,
} from "@/lib/canonical/query";
import { resolveCanonicalRef } from "@/lib/canonical/resolve";

export type TerritoryDepthState = "DEEP" | "DEVELOPING" | "THIN";

export type TerritoryConceptTrace = {
  id: AtlasV1ConceptId;
  title: string;
};

export type TerritoryWorkTrace = {
  id: string;
  kind: "essay" | "book";
  title: string;
  href: string;
  /** Evidence pack id that resolved to this public work */
  viaEvidenceId: AtlasV1EssayId;
};

export type TerritoryQuestionTrace = {
  questionId: AtlasV1QuestionId;
  disposition: QuestionPlacement["disposition"];
  journeyOpen: boolean;
};

export type TerritoryMatrix = {
  rootId: RootTerritoryId;
  label: string;
  whisper: string;
  architectureDepth: TerritoryDepth;
  depthState: TerritoryDepthState;
  concepts: readonly TerritoryConceptTrace[];
  questions: readonly TerritoryQuestionTrace[];
  /** Evidence pack ids reached through territory concepts / placed questions */
  evidencePackIds: readonly AtlasV1EssayId[];
  essays: readonly TerritoryWorkTrace[];
  books: readonly TerritoryWorkTrace[];
  /** Combined visitor works (essays + books), capped */
  works: readonly TerritoryWorkTrace[];
  /** Historical / superseded objects that must not appear as current landmarks */
  withheldHistoricalIds: readonly string[];
};

const MAX_CONCEPTS = 5;
/** Visitor OPEN state — keep charted works few enough to read as terrain */
const MAX_WORKS = 3;

function depthStateFromArchitecture(depth: TerritoryDepth): TerritoryDepthState {
  if (depth === "deep") return "DEEP";
  if (depth === "forming") return "DEVELOPING";
  return "THIN";
}

function isTrustedProvenance(provenance: string): boolean {
  return provenance === "AUTHORED" || provenance === "SOURCE_GROUNDED";
}

function evidenceSupportsConcept(
  evidenceId: AtlasV1EssayId,
  conceptId: AtlasV1ConceptId,
): boolean {
  return getCanonicalRelationsFrom(evidenceId).some(
    (relation) =>
      relation.type === "EVIDENCE_FOR" &&
      isTrustedProvenance(relation.provenance) &&
      relation.to === conceptId,
  );
}

/**
 * Resolve evidence → current public essay/book.
 * Returns null when only historical/superseded material remains.
 */
function publicWorkFromEvidence(
  evidenceId: AtlasV1EssayId,
): { work: TerritoryWorkTrace; withheld: string[] } | null {
  const evidence = getCanonicalObject(evidenceId);
  if (!evidence || evidence.type !== "EVIDENCE") return null;

  const sourced = getCanonicalRelationsFrom(evidenceId).find(
    (relation) => relation.type === "SOURCED_FROM",
  );
  if (!sourced || !isTrustedProvenance(sourced.provenance)) return null;

  let ref = resolveCanonicalRef(sourced.to);
  if (!ref) return null;

  const withheld: string[] = [];

  if (ref.type === "BOOK" && ref.visibility === "superseded") {
    withheld.push(ref.id);
    const current = getCanonicalRelationsTo(ref.id).find(
      (relation) =>
        relation.type === "SUPERSEDES" &&
        isTrustedProvenance(relation.provenance),
    );
    if (!current) return null;
    const upgraded = resolveCanonicalRef(current.from);
    if (!upgraded || upgraded.visibility !== "public") return null;
    ref = upgraded;
  }

  if (ref.visibility !== "public") {
    withheld.push(ref.id);
    return null;
  }
  if (ref.type !== "ESSAY" && ref.type !== "BOOK") return null;

  return {
    work: {
      id: ref.id,
      kind: ref.type === "BOOK" ? "book" : "essay",
      title: ref.title,
      href: ref.route,
      viaEvidenceId: evidenceId,
    },
    withheld,
  };
}

function collectEvidenceCandidates(
  territoryId: RootTerritoryId,
): AtlasV1EssayId[] {
  const territory = getRootTerritory(territoryId);
  const concepts = new Set(territory.conceptIds);
  const ordered: AtlasV1EssayId[] = [];
  const seen = new Set<AtlasV1EssayId>();

  function push(evidenceId: AtlasV1EssayId, conceptId: AtlasV1ConceptId) {
    if (seen.has(evidenceId)) return;
    if (!concepts.has(conceptId)) return;
    if (!evidenceSupportsConcept(evidenceId, conceptId)) return;
    seen.add(evidenceId);
    ordered.push(evidenceId);
  }

  const placements = placementsForTerritory(territoryId);

  // 1. Journey-open questions first (PATH evidence)
  for (const placement of placements) {
    if (!placement.journeyOpen) continue;
    const question = ATLAS_V1_QUESTIONS.find((q) => q.id === placement.questionId);
    if (!question) continue;
    for (const [conceptId, evidenceId] of Object.entries(question.evidence)) {
      if (!evidenceId) continue;
      push(evidenceId as AtlasV1EssayId, conceptId as AtlasV1ConceptId);
    }
  }

  // 2. Architecture concept essayIds
  for (const conceptId of territory.conceptIds) {
    const essayId = ATLAS_V1_CONCEPTS[conceptId]?.essayId;
    if (essayId) push(essayId, conceptId);
  }

  // 3. Forming / non-journey placements — only if still room later
  for (const placement of placements) {
    if (placement.journeyOpen) continue;
    const question = ATLAS_V1_QUESTIONS.find((q) => q.id === placement.questionId);
    if (!question) continue;
    for (const [conceptId, evidenceId] of Object.entries(question.evidence)) {
      if (!evidenceId) continue;
      push(evidenceId as AtlasV1EssayId, conceptId as AtlasV1ConceptId);
    }
  }

  return ordered;
}

export function getTerritoryMatrix(territoryId: RootTerritoryId): TerritoryMatrix {
  const territory = getRootTerritory(territoryId);
  const placements = placementsForTerritory(territoryId);

  const concepts: TerritoryConceptTrace[] = [];
  for (const conceptId of territory.conceptIds) {
    if (concepts.length >= MAX_CONCEPTS) break;
    const object = getCanonicalObject(conceptId);
    if (!object || object.type !== "CONCEPT") continue;
    if (object.visibility !== "public") continue;
    concepts.push({ id: conceptId, title: object.title });
  }

  const questions: TerritoryQuestionTrace[] = placements.map((placement) => ({
    questionId: placement.questionId,
    disposition: placement.disposition,
    journeyOpen: placement.journeyOpen,
  }));

  const evidencePackIds = collectEvidenceCandidates(territoryId);
  const works: TerritoryWorkTrace[] = [];
  const essays: TerritoryWorkTrace[] = [];
  const books: TerritoryWorkTrace[] = [];
  const withheldHistoricalIds: string[] = [];
  const seenWorks = new Set<string>();

  for (const evidenceId of evidencePackIds) {
    const resolved = publicWorkFromEvidence(evidenceId);
    if (!resolved) continue;
    for (const id of resolved.withheld) {
      if (!withheldHistoricalIds.includes(id)) withheldHistoricalIds.push(id);
    }
    if (seenWorks.has(resolved.work.id)) continue;
    if (works.length >= MAX_WORKS) continue;
    seenWorks.add(resolved.work.id);
    works.push(resolved.work);
    if (resolved.work.kind === "essay") essays.push(resolved.work);
    else books.push(resolved.work);
  }

  // Always withhold b2 from current landmarks even if unused this pass
  if (!withheldHistoricalIds.includes("b2")) {
    const b2 = getCanonicalObject("b2");
    if (b2?.visibility === "superseded") withheldHistoricalIds.push("b2");
  }

  return {
    rootId: territoryId,
    label: territory.label,
    whisper: territory.whisper,
    architectureDepth: territory.depth,
    depthState: depthStateFromArchitecture(territory.depth),
    concepts,
    questions,
    evidencePackIds,
    essays,
    books,
    works,
    withheldHistoricalIds,
  };
}

export function listTerritoryMatrices(): readonly TerritoryMatrix[] {
  return (
    [
      "r1-living-systems",
      "r2-reality-structure",
      "r3-participation",
      "r4-meaning-orientation",
      "r5-time-emergence",
    ] as const
  ).map(getTerritoryMatrix);
}

/** @deprecated Prefer getTerritoryMatrix — kept for any Phase B call sites */
export type TerritoryLandmark = {
  id: string;
  kind: "concept" | "essay" | "book";
  title: string;
  href: string | null;
};

export function landmarksForTerritory(
  territoryId: RootTerritoryId,
): readonly TerritoryLandmark[] {
  const matrix = getTerritoryMatrix(territoryId);
  return [
    ...matrix.concepts.map((concept) => ({
      id: concept.id,
      kind: "concept" as const,
      title: concept.title,
      href: null,
    })),
    ...matrix.works.map((work) => ({
      id: work.id,
      kind: work.kind,
      title: work.title,
      href: work.href,
    })),
  ];
}
