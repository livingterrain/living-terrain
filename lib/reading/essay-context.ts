/**
 * "Where this sits" — authored relationships for an essay record.
 *
 * Reads only authored layers, in descending strength:
 * 1. Atlas evidence at a stop on an open journey (question.evidence + SOURCED_FROM)
 * 2. Explicit chamber links (the same links a chamber page lists)
 * 3. Thread membership (essay-threads.json)
 *
 * Never reads the legacy inferred strand graph, never infers Territory from a
 * Thread, and never recommends related essays.
 */

import {
  ATLAS_V1_QUESTIONS,
  getConcept,
  relationsFor,
  type AtlasV1ConceptId,
  type AtlasV1EvidenceRole,
  type AtlasV1Question,
  type AtlasV1QuestionId,
} from "@/lib/atlas-v1/content";
import { isJourneyOpen } from "@/lib/atlas/architecture";
import { getAtlasCanonicalView } from "@/lib/canonical/atlas-view";
import { getAllProjects } from "@/lib/content";
import type { Essay } from "@/lib/content/types";
import { getThreadRefs, type ThreadDefinition } from "@/lib/threads";

export type EssayAtlasEvidence = {
  questionId: AtlasV1QuestionId;
  questionText: string;
  role: AtlasV1EvidenceRole;
  /** Stop names in journey order. */
  stops: string[];
};

export type EssayChamberContext = {
  slug: string;
  title: string;
  href: string;
};

export type EssayContext = {
  atlasEvidence: EssayAtlasEvidence[];
  chambers: EssayChamberContext[];
  threads: ThreadDefinition[];
};

/** Stops in authored walking order: start concept, then each first relation. */
export function journeyStops(question: AtlasV1Question): AtlasV1ConceptId[] {
  const stops: AtlasV1ConceptId[] = [question.startConceptId];
  let current = question.startConceptId;
  for (;;) {
    const next = relationsFor(question, current)[0]?.to;
    if (!next || stops.includes(next)) break;
    stops.push(next);
    current = next;
  }
  return stops;
}

let evidenceSourceRoutes: Map<string, string> | null = null;

function evidenceRoute(evidenceId: string): string | undefined {
  if (!evidenceSourceRoutes) {
    evidenceSourceRoutes = new Map();
    const { evidenceSource } = getAtlasCanonicalView();
    for (const [id, ref] of Object.entries(evidenceSource)) {
      if (ref?.type === "ESSAY") evidenceSourceRoutes.set(id, ref.route);
    }
  }
  return evidenceSourceRoutes.get(evidenceId);
}

export function getEssayAtlasEvidence(essay: Pick<Essay, "slug">): EssayAtlasEvidence[] {
  const route = `/essays/${essay.slug}`;
  const found: EssayAtlasEvidence[] = [];

  for (const question of ATLAS_V1_QUESTIONS) {
    if (!isJourneyOpen(question.id)) continue;
    const byRole = new Map<AtlasV1EvidenceRole, string[]>();
    for (const conceptId of journeyStops(question)) {
      // Authored per-question evidence only — no concept-default fallback.
      const evidenceId = question.evidence[conceptId];
      if (!evidenceId || evidenceRoute(evidenceId) !== route) continue;
      const role = question.evidenceRole?.[conceptId] ?? "evidence";
      byRole.set(role, [...(byRole.get(role) ?? []), getConcept(conceptId).name]);
    }
    for (const [role, stops] of byRole) {
      found.push({ questionId: question.id, questionText: question.text, role, stops });
    }
  }
  return found;
}

export function getEssayChambers(essay: Pick<Essay, "id">): EssayChamberContext[] {
  return getAllProjects()
    .filter((project) => project.essayIds.includes(essay.id))
    .map((project) => ({
      slug: project.slug,
      title: project.title,
      href: `/chambers/${project.slug}`,
    }));
}

export function getEssayContext(
  essay: Pick<Essay, "id" | "slug" | "threadIds">,
): EssayContext {
  return {
    atlasEvidence: getEssayAtlasEvidence(essay),
    chambers: getEssayChambers(essay),
    threads: getThreadRefs(essay.threadIds),
  };
}

export function hasEssayContext(context: EssayContext): boolean {
  return (
    context.atlasEvidence.length > 0 ||
    context.chambers.length > 0 ||
    context.threads.length > 0
  );
}
