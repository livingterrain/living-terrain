#!/usr/bin/env npx tsx
/** Complete public-archive reconciliation. Writes reports only; never runtime data. */
import fs from "node:fs";
import path from "node:path";
import aliasesRegistry from "../data/publications/substack-aliases.json";
import postsRegistry from "../data/publications/substack-posts.json";
import { getAllEssays, siteConfig } from "../lib/content";
import { fetchCompleteSubstackArchive } from "../lib/content-sync/substack-archive";
import { resolveSubstackEssay, type ResolutionKind } from "../lib/content-sync/resolve-essay";
import type { StoredSubstackPost, SubstackAliasRegistry, SubstackPostRegistry } from "../lib/content-sync/schema";

const REPORT_ROOT = path.join(process.cwd(), "reports", "substack-backfill");
const JSON_REPORT = path.join(REPORT_ROOT, "reconciliation.json");
const MARKDOWN_REPORT = path.join(REPORT_ROOT, "reconciliation.md");

function proposedRecord(post: Awaited<ReturnType<typeof fetchCompleteSubstackArchive>>["posts"][number], takenSlugs: Set<string>): StoredSubstackPost {
  const base = post.slug;
  const essaySlug = takenSlugs.has(base) ? `${base}-substack-${post.postId}` : base;
  return { ...post, essayId: `substack-${post.postId}`, essaySlug };
}

function mediumUrl(essay: ReturnType<typeof getAllEssays>[number]): string | null {
  return essay.mediumUrl ?? (essay.externalUrl?.includes("medium.com") ? essay.externalUrl : undefined) ?? null;
}

async function main(): Promise<void> {
  const essays = getAllEssays();
  const stored = (postsRegistry as SubstackPostRegistry).posts;
  const aliases = (aliasesRegistry as SubstackAliasRegistry).aliases;
  const archive = await fetchCompleteSubstackArchive(siteConfig.substackUrl);
  const takenSlugs = new Set(essays.map((essay) => essay.slug));
  const rows = archive.posts.map((post) => {
    const resolution = resolveSubstackEssay(post, essays, stored, aliases);
    const candidate = resolution.essay ?? resolution.candidates?.[0];
    return {
      classification: resolution.kind,
      matchReason: resolution.reason,
      substack: { postId: post.postId, title: post.title, publishedAt: post.publishedAt, url: post.canonicalUrl },
      existing: candidate ? {
        id: candidate.id,
        slug: candidate.slug,
        title: candidate.title,
        publishedAt: candidate.publishedAt,
        mediumUrl: mediumUrl(candidate),
      } : null,
      candidates: resolution.candidates?.map((essay) => ({ id: essay.id, slug: essay.slug, title: essay.title, publishedAt: essay.publishedAt, mediumUrl: mediumUrl(essay) })) ?? [],
      proposedObject: resolution.kind === "NEW_UNMAPPED" ? proposedRecord(post, takenSlugs) : null,
    };
  });
  for (const error of archive.errors) rows.push({ classification: "ERROR" as ResolutionKind, matchReason: error.errors.join("; "), substack: { postId: undefined, title: error.title ?? "", publishedAt: "", url: "" }, existing: null, candidates: [], proposedObject: null });

  const classifications: ResolutionKind[] = ["EXACT_MATCH", "EXPLICIT_ALIAS_MATCH", "TITLE_DATE_MATCH", "CONFLICT_REVIEW_REQUIRED", "NEW_UNMAPPED", "ERROR"];
  const totals = Object.fromEntries(classifications.map((kind) => [kind, rows.filter((row) => row.classification === kind).length]));
  const report = {
    version: 1,
    source: `${siteConfig.substackUrl}/api/v1/archive`,
    generatedFromArchiveTimestamp: archive.posts[0]?.publishedTimestamp ?? null,
    existingEssayCount: essays.length,
    archivePostCount: archive.posts.length + archive.errors.length,
    totals,
    rows,
  };

  fs.mkdirSync(REPORT_ROOT, { recursive: true });
  fs.writeFileSync(JSON_REPORT, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  const lines = [
    "# Substack backfill reconciliation",
    "",
    `Existing Living Terrain essays: ${report.existingEssayCount}`,
    `Public Substack posts: ${report.archivePostCount}`,
    ...classifications.map((kind) => `${kind}: ${totals[kind]}`),
    "",
    "## Records",
    "",
  ];
  for (const row of rows) {
    lines.push(`### ${row.classification} — ${row.substack.title || "Malformed source record"}`);
    lines.push(`- Substack: ${row.substack.publishedAt || "unknown date"} · ${row.substack.url || "no URL"}`);
    if (row.existing) lines.push(`- Living Terrain: ${row.existing.id} · ${row.existing.slug} · ${row.existing.publishedAt} · ${row.existing.title}`);
    if (row.existing?.mediumUrl) lines.push(`- Medium: ${row.existing.mediumUrl}`);
    lines.push(`- Reason: ${row.matchReason}`);
    if (row.proposedObject) lines.push("- Proposed object:", "```json", JSON.stringify(row.proposedObject, null, 2), "```");
    lines.push("");
  }
  fs.writeFileSync(MARKDOWN_REPORT, `${lines.join("\n")}\n`, "utf8");
  console.log(JSON.stringify({ ...report, rows: undefined, jsonReport: JSON_REPORT, markdownReport: MARKDOWN_REPORT }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
