/**
 * Reconcile Medium-only essays against the Substack registry.
 * Confirms exact title/slug matches; lists the rest for republication.
 * Does not invent URLs or mutate essay imports.
 *
 * Run: npx tsx scripts/reconcile-medium-substack.ts
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { getAllEssays } from "../lib/content";
import {
  getEssayPublicationHref,
  isMediumUrl,
  isSubstackPostUrl,
} from "../lib/content/publication-cta";
import { normalizePublicationTitle } from "../lib/content-migration/substack-inventory";
import postsJson from "../data/publications/substack-posts.json";
import aliasesJson from "../data/publications/substack-aliases.json";

type RegistryPost = {
  slug: string;
  title: string;
  publishedAt: string;
  canonicalUrl: string;
  essayId?: string;
  essaySlug?: string;
};

function titleScore(left: string, right: string): number {
  const a = new Set(
    normalizePublicationTitle(left).split(" ").filter(Boolean),
  );
  const b = new Set(
    normalizePublicationTitle(right).split(" ").filter(Boolean),
  );
  if (!a.size || !b.size) return 0;
  const overlap = [...a].filter((word) => b.has(word)).length;
  return overlap / (a.size + b.size - overlap);
}

function essayUrls(essay: {
  canonicalUrl?: string;
  substackUrl?: string;
  mediumUrl?: string;
  externalUrl?: string;
}): string[] {
  return [
    essay.canonicalUrl,
    essay.substackUrl,
    essay.mediumUrl,
    essay.externalUrl,
  ].filter((u): u is string => typeof u === "string" && /^https?:\/\//i.test(u));
}

function main() {
  const essays = getAllEssays();
  const posts = postsJson.posts as RegistryPost[];
  const aliases = aliasesJson.aliases as Array<{
    essayId: string;
    canonicalUrl: string;
  }>;
  const aliasByEssay = new Map(aliases.map((a) => [a.essayId, a]));

  const byTitle = new Map(
    posts.map((p) => [normalizePublicationTitle(p.title), p]),
  );
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  const byEssaySlug = new Map(
    posts
      .filter((p) => p.essaySlug)
      .map((p) => [p.essaySlug!, p]),
  );
  const byEssayId = new Map(
    posts.filter((p) => p.essayId).map((p) => [p.essayId!, p]),
  );

  const mediumOnly = essays.filter((e) => {
    const urls = essayUrls(e);
    return urls.some(isMediumUrl) && !urls.some(isSubstackPostUrl);
  });

  const confirmedNewMatches: Array<Record<string, unknown>> = [];
  const uncertainCandidates: Array<Record<string, unknown>> = [];
  const needsRepublication: Array<Record<string, unknown>> = [];

  for (const essay of mediumOnly) {
    const mediumHref =
      essayUrls(essay).find(isMediumUrl) ?? getEssayPublicationHref(essay);

    const alias = aliasByEssay.get(essay.id);
    if (alias) {
      confirmedNewMatches.push({
        id: essay.id,
        slug: essay.slug,
        title: essay.title,
        publishedAt: essay.publishedAt,
        mediumUrl: mediumHref,
        substackUrl: alias.canonicalUrl,
        matchReason: "substack-aliases.json",
      });
      continue;
    }

    const registryById = byEssayId.get(essay.id);
    if (registryById && isSubstackPostUrl(registryById.canonicalUrl)) {
      confirmedNewMatches.push({
        id: essay.id,
        slug: essay.slug,
        title: essay.title,
        publishedAt: essay.publishedAt,
        mediumUrl: mediumHref,
        substackUrl: registryById.canonicalUrl,
        matchReason: "registry-essayId",
      });
      continue;
    }

    const registryByEssaySlug = byEssaySlug.get(essay.slug);
    if (
      registryByEssaySlug &&
      isSubstackPostUrl(registryByEssaySlug.canonicalUrl)
    ) {
      confirmedNewMatches.push({
        id: essay.id,
        slug: essay.slug,
        title: essay.title,
        publishedAt: essay.publishedAt,
        mediumUrl: mediumHref,
        substackUrl: registryByEssaySlug.canonicalUrl,
        matchReason: "registry-essaySlug",
      });
      continue;
    }

    const exactTitle = byTitle.get(normalizePublicationTitle(essay.title));
    if (exactTitle) {
      confirmedNewMatches.push({
        id: essay.id,
        slug: essay.slug,
        title: essay.title,
        publishedAt: essay.publishedAt,
        mediumUrl: mediumHref,
        substackUrl: exactTitle.canonicalUrl,
        substackTitle: exactTitle.title,
        substackPublishedAt: exactTitle.publishedAt,
        matchReason: "exact-title",
      });
      continue;
    }

    const exactSlug = bySlug.get(essay.slug);
    if (exactSlug) {
      confirmedNewMatches.push({
        id: essay.id,
        slug: essay.slug,
        title: essay.title,
        publishedAt: essay.publishedAt,
        mediumUrl: mediumHref,
        substackUrl: exactSlug.canonicalUrl,
        substackTitle: exactSlug.title,
        substackPublishedAt: exactSlug.publishedAt,
        matchReason: "exact-slug",
      });
      continue;
    }

    const fuzzy = posts
      .map((p) => ({
        post: p,
        score: titleScore(essay.title, p.title),
      }))
      .filter((x) => x.score >= 0.55)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const sameDate = posts.filter(
      (p) => p.publishedAt === essay.publishedAt.slice(0, 10),
    );

    if (fuzzy.length > 0 || sameDate.length > 0) {
      uncertainCandidates.push({
        id: essay.id,
        slug: essay.slug,
        title: essay.title,
        publishedAt: essay.publishedAt,
        mediumUrl: mediumHref,
        titleCandidates: fuzzy.map((f) => ({
          score: Number(f.score.toFixed(3)),
          title: f.post.title,
          slug: f.post.slug,
          url: f.post.canonicalUrl,
          publishedAt: f.post.publishedAt,
        })),
        sameDateCandidates: sameDate.map((p) => ({
          title: p.title,
          slug: p.slug,
          url: p.canonicalUrl,
        })),
      });
    }

    // Not auto-confirmed — preserve Medium link; needs republication / human mapping.
    needsRepublication.push({
      id: essay.id,
      slug: essay.slug,
      title: essay.title,
      publishedAt: essay.publishedAt,
      mediumUrl: mediumHref,
      readUrl: mediumHref,
    });
  }

  const report = {
    version: 1,
    generatedAt: new Date().toISOString(),
    counts: {
      essaysTotal: essays.length,
      mediumOnly: mediumOnly.length,
      confirmedNewMatches: confirmedNewMatches.length,
      uncertainCandidates: uncertainCandidates.length,
      needsRepublication: needsRepublication.length,
      registryPosts: posts.length,
    },
    confirmedNewMatches,
    uncertainCandidates,
    needsRepublication,
    notes: [
      "Reconciled against data/publications/substack-posts.json and substack-aliases.json.",
      "Confirmed matches require exact title, exact slug, registry essayId/essaySlug, or alias — not fuzzy or same-date alone.",
      "Uncertain candidates are for human review only; do not invent Substack URLs from them.",
      "needsRepublication essays keep working Medium links until a verified Substack counterpart exists.",
    ],
  };

  const outPath = join(
    process.cwd(),
    "reports/medium-only-needs-republication.json",
  );
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    JSON.stringify(
      {
        wrote: outPath,
        ...report.counts,
      },
      null,
      2,
    ),
  );
}

main();
