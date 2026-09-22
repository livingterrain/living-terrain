/**
 * One-shot: Medium-only essays linked from Atlas questions / journey evidence.
 * Does not mutate data. Run: npx tsx scripts/audit-medium-atlas-links.ts
 */

import {
  getAllEssays,
  getAllQuestions,
  getEssayBySlug,
} from "../lib/content";
import {
  getEssayPublicationCta,
  isMediumUrl,
  isSubstackPostUrl,
} from "../lib/content/publication-cta";
import {
  ATLAS_V1_CONCEPTS,
  ATLAS_V1_QUESTIONS,
  type AtlasV1EssayId,
} from "../lib/atlas-v1/content";
import { VOID_QUESTIONS } from "../lib/atlas-v1/questions";
import {
  getCanonicalObject,
  getCanonicalRelationsFrom,
} from "../lib/canonical/query";
import { resolveCanonicalRef } from "../lib/canonical/resolve";

function isMediumOnly(essay: {
  canonicalUrl?: string;
  substackUrl?: string;
  mediumUrl?: string;
  externalUrl?: string;
}): boolean {
  const urls = [
    essay.canonicalUrl,
    essay.substackUrl,
    essay.mediumUrl,
    essay.externalUrl,
  ].filter((u): u is string => typeof u === "string");
  return urls.some(isMediumUrl) && !urls.some(isSubstackPostUrl);
}

function publicEssayFromEvidence(evidenceId: AtlasV1EssayId) {
  const evidence = getCanonicalObject(evidenceId);
  if (!evidence || evidence.type !== "EVIDENCE") return null;
  const sourced = getCanonicalRelationsFrom(evidenceId).find(
    (r) => r.type === "SOURCED_FROM",
  );
  if (!sourced) return null;
  const ref = resolveCanonicalRef(sourced.to);
  if (!ref || ref.type !== "ESSAY" || ref.visibility !== "public") return null;
  return ref;
}

function main() {
  const essays = getAllEssays();
  const byId = new Map(essays.map((e) => [e.id, e]));
  const bySlug = new Map(essays.map((e) => [e.slug, e]));
  const mediumOnly = essays.filter(isMediumOnly);
  const mediumIds = new Set(mediumOnly.map((e) => e.id));
  const mediumSlugs = new Set(mediumOnly.map((e) => e.slug));

  type Hit = {
    essayId: string;
    essaySlug: string;
    essayTitle: string;
    publishedAt: string;
    mediumUrl: string | null;
    via: string[];
  };
  const hits = new Map<string, Hit>();

  function touch(
    essay: { id: string; slug: string; title: string; publishedAt: string },
    via: string,
  ) {
    if (!mediumIds.has(essay.id) && !mediumSlugs.has(essay.slug)) return;
    const e = byId.get(essay.id) ?? bySlug.get(essay.slug);
    if (!e || !isMediumOnly(e)) return;
    const existing = hits.get(e.id);
    if (existing) {
      if (!existing.via.includes(via)) existing.via.push(via);
      return;
    }
    hits.set(e.id, {
      essayId: e.id,
      essaySlug: e.slug,
      essayTitle: e.title,
      publishedAt: e.publishedAt,
      mediumUrl: getEssayPublicationCta(e).href,
      via: [via],
    });
  }

  // Site questions → relatedEssayIds
  for (const q of getAllQuestions()) {
    for (const id of q.relatedEssayIds ?? []) {
      const e = byId.get(id);
      if (e) touch(e, `site-question:${q.id} (${q.title})`);
    }
  }

  // Void / journey questions text (slug hints rarely)
  for (const q of VOID_QUESTIONS) {
    // no essay ids on void questions themselves
    void q;
  }

  // Journey evidence map + concept default essayIds
  for (const q of ATLAS_V1_QUESTIONS) {
    for (const [conceptId, evidenceId] of Object.entries(q.evidence)) {
      if (!evidenceId) continue;
      const publicEssay = publicEssayFromEvidence(evidenceId as AtlasV1EssayId);
      if (publicEssay) {
        // route like /essays/slug
        const slug = publicEssay.route?.replace(/^\/essays\//, "");
        const e = slug ? bySlug.get(slug) : undefined;
        if (e) {
          touch(
            e,
            `journey-evidence:${q.id}/${conceptId} → ${evidenceId} → ${publicEssay.id}`,
          );
        }
      }
      // Also check if evidence title maps via atlas essay pack
    }
  }

  for (const concept of Object.values(ATLAS_V1_CONCEPTS)) {
    if (!concept.essayId) continue;
    const publicEssay = publicEssayFromEvidence(concept.essayId);
    if (publicEssay) {
      const slug = publicEssay.route?.replace(/^\/essays\//, "");
      const e = slug ? bySlug.get(slug) : undefined;
      if (e) {
        touch(
          e,
          `concept-default:${concept.id} → ${concept.essayId} → ${publicEssay.id}`,
        );
      }
    }
  }

  // Essay.questionIds pointing at Atlas / site questions
  for (const e of mediumOnly) {
    for (const qid of e.questionIds ?? []) {
      touch(e, `essay.questionIds:${qid}`);
    }
  }

  const prioritized = [...hits.values()].sort((a, b) =>
    a.essayTitle.localeCompare(b.essayTitle),
  );

  console.log(
    JSON.stringify(
      {
        mediumOnlyTotal: mediumOnly.length,
        atlasLinkedMediumOnly: prioritized.length,
        prioritized,
      },
      null,
      2,
    ),
  );
}

main();
