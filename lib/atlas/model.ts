/**
 * Atlas 2.0 typed relationship layer (Phase 2).
 *
 * Frozen Phase 0–1 canon only. Surfaces Territory / Thread / Artifact /
 * Investigation without inventing relationships or redesigning /atlas.
 *
 * See docs/atlas-2.0-phase-0.md.
 */

import {
  getQuestionPlacement,
  getRootTerritory,
  type QuestionDisposition,
  type RootTerritory,
  type RootTerritoryId,
} from "@/lib/atlas/architecture";
import {
  getConcept,
  type AtlasV1ConceptId,
  type AtlasV1EssayId,
  type AtlasV1QuestionId,
} from "@/lib/atlas-v1/content";
import type { CanonicalRef } from "@/lib/canonical/resolve";
import {
  getThreadDefinition,
  isThreadId,
  threadHref,
  type ThreadDefinition,
  type ThreadId,
} from "@/lib/threads/vocabulary";

export type AtlasEntityKind =
  | "territory"
  | "thread"
  | "artifact"
  | "investigation";

export type V1ConceptClassification = "territory-only" | "both";

export type V1ConceptPlacement = {
  conceptId: AtlasV1ConceptId;
  classification: V1ConceptClassification;
  primaryTerritoryId: RootTerritoryId;
  secondaryTerritoryId?: RootTerritoryId;
  /** Present only when classification is "both" — frozen Phase 1. */
  threadId?: ThreadId;
};

/**
 * Phase 1 frozen placements for every Atlas V1 concept.
 * Territory membership mirrors architecture.ts; Thread only for Both mappings.
 */
export const V1_CONCEPT_PLACEMENTS: Record<
  AtlasV1ConceptId,
  V1ConceptPlacement
> = {
  body: {
    conceptId: "body",
    classification: "territory-only",
    primaryTerritoryId: "r1-living-systems",
  },
  relationship: {
    conceptId: "relationship",
    classification: "both",
    primaryTerritoryId: "r3-participation",
    threadId: "relationship",
  },
  feedback: {
    conceptId: "feedback",
    classification: "both",
    primaryTerritoryId: "r1-living-systems",
    threadId: "feedback",
  },
  technology: {
    conceptId: "technology",
    classification: "both",
    primaryTerritoryId: "r3-participation",
    threadId: "technology",
  },
  adaptation: {
    conceptId: "adaptation",
    classification: "territory-only",
    primaryTerritoryId: "r1-living-systems",
    secondaryTerritoryId: "r5-time-emergence",
  },
  constraint: {
    conceptId: "constraint",
    classification: "both",
    primaryTerritoryId: "r2-reality-structure",
    threadId: "constraint",
  },
  participation: {
    conceptId: "participation",
    classification: "both",
    primaryTerritoryId: "r3-participation",
    secondaryTerritoryId: "r1-living-systems",
    threadId: "participation",
  },
  time: {
    conceptId: "time",
    classification: "territory-only",
    primaryTerritoryId: "r5-time-emergence",
  },
  meaning: {
    conceptId: "meaning",
    classification: "territory-only",
    primaryTerritoryId: "r4-meaning-orientation",
  },
  reality: {
    conceptId: "reality",
    classification: "territory-only",
    primaryTerritoryId: "r2-reality-structure",
  },
};

/** Concepts that may receive an authored Thread whisper at a journey stop. */
export const BOTH_CONCEPT_IDS = [
  "relationship",
  "feedback",
  "technology",
  "constraint",
  "participation",
] as const satisfies readonly AtlasV1ConceptId[];

export type BothConceptId = (typeof BOTH_CONCEPT_IDS)[number];

/** Semantic aliases only — no redirects in Phase 2. */
export const MAJOR_CONCEPT_THREAD_ALIASES: Readonly<
  Record<"th-relationship" | "th-consciousness", ThreadId>
> = {
  "th-relationship": "relationship",
  "th-consciousness": "consciousness",
};

export type InvestigationRef = {
  kind: "investigation";
  questionId: AtlasV1QuestionId;
  territoryId: RootTerritoryId;
  disposition: QuestionDisposition;
  journeyOpen: boolean;
};

export type ArtifactForm =
  | "map"
  | "chamber"
  | "essay"
  | "evidence"
  | "field-note"
  | "quotation"
  | "plate";

export type ArtifactRef = {
  kind: "artifact";
  form: ArtifactForm;
  id: string;
  title?: string;
  href?: string;
};

export function getV1ConceptPlacement(
  conceptId: AtlasV1ConceptId,
): V1ConceptPlacement {
  return V1_CONCEPT_PLACEMENTS[conceptId];
}

export function primaryTerritoryForConcept(
  conceptId: AtlasV1ConceptId,
): RootTerritory {
  return getRootTerritory(
    getV1ConceptPlacement(conceptId).primaryTerritoryId,
  );
}

/**
 * Authored Thread whisper for a journey stop — Both mappings only.
 * Territory-only concepts return null (no symmetry whispers).
 */
export function authoredThreadWhisperForConcept(
  conceptId: AtlasV1ConceptId,
): ThreadDefinition | null {
  const placement = getV1ConceptPlacement(conceptId);
  if (placement.classification !== "both" || !placement.threadId) {
    return null;
  }
  return getThreadDefinition(placement.threadId);
}

export function authoredThreadHrefForConcept(
  conceptId: AtlasV1ConceptId,
): string | null {
  const thread = authoredThreadWhisperForConcept(conceptId);
  return thread ? threadHref(thread.id) : null;
}

export type ThreadAtlasBridge = {
  conceptId: BothConceptId;
  conceptName: string;
  /** Primary first; secondary only when frozen in Phase 1. */
  territories: RootTerritory[];
};

/**
 * Thread → Atlas: the frozen Both mapping read in reverse.
 * Names where the pattern is charted — never claims the Thread is a Territory,
 * and says nothing about which Territory its essays belong to.
 */
export function atlasBridgeForThread(threadId: string): ThreadAtlasBridge | null {
  const conceptId = BOTH_CONCEPT_IDS.find(
    (id) => V1_CONCEPT_PLACEMENTS[id].threadId === threadId,
  );
  if (!conceptId) return null;
  const placement = V1_CONCEPT_PLACEMENTS[conceptId];
  return {
    conceptId,
    conceptName: getConcept(conceptId).name,
    territories: [
      getRootTerritory(placement.primaryTerritoryId),
      ...(placement.secondaryTerritoryId
        ? [getRootTerritory(placement.secondaryTerritoryId)]
        : []),
    ],
  };
}

export function investigationForQuestion(
  questionId: AtlasV1QuestionId,
): InvestigationRef {
  const placement = getQuestionPlacement(questionId);
  return {
    kind: "investigation",
    questionId,
    territoryId: placement.territoryId,
    disposition: placement.disposition,
    journeyOpen: placement.journeyOpen,
  };
}

/**
 * Classify an existing evidence source as an Artifact.
 * Does not invent links — only wraps trusted provenance already present.
 */
export function artifactFromEvidenceSource(
  _essayId: AtlasV1EssayId,
  source: CanonicalRef | undefined,
): ArtifactRef | null {
  if (!source) return null;
  const form: ArtifactForm =
    source.type === "BOOK"
      ? "map"
      : source.type === "ESSAY"
        ? "essay"
        : "evidence";
  return {
    kind: "artifact",
    form,
    id: source.id,
    title: source.title,
    href: source.route,
  };
}

export function threadAliasForMajorConceptId(
  majorConceptId: string,
): ThreadId | null {
  if (
    majorConceptId === "th-relationship" ||
    majorConceptId === "th-consciousness"
  ) {
    return MAJOR_CONCEPT_THREAD_ALIASES[majorConceptId];
  }
  return null;
}

/** Sanity: every Both mapping has a real Thread id. */
export function assertAtlasModelIntegrity(): void {
  for (const conceptId of BOTH_CONCEPT_IDS) {
    const placement = V1_CONCEPT_PLACEMENTS[conceptId];
    if (placement.classification !== "both" || !placement.threadId) {
      throw new Error(`Both concept ${conceptId} missing threadId`);
    }
    if (!isThreadId(placement.threadId)) {
      throw new Error(`Invalid threadId on ${conceptId}`);
    }
    if (placement.threadId !== conceptId) {
      throw new Error(
        `Frozen Both mapping expects threadId === conceptId for ${conceptId}`,
      );
    }
  }

  for (const [conceptId, placement] of Object.entries(V1_CONCEPT_PLACEMENTS)) {
    if (placement.classification === "territory-only" && placement.threadId) {
      throw new Error(`Territory-only ${conceptId} must not have threadId`);
    }
    getRootTerritory(placement.primaryTerritoryId);
    if (placement.secondaryTerritoryId) {
      getRootTerritory(placement.secondaryTerritoryId);
    }
  }
}
