#!/usr/bin/env npx tsx
/**
 * Backfill numeric Substack post IDs onto registry records that lack them.
 * Dry run by default; pass --write to update data/publications/substack-posts.json.
 * Only exact URL identity is used, and only `postId` is written.
 */
import fs from "node:fs";
import path from "node:path";
import aliasesRegistry from "../data/publications/substack-aliases.json";
import postsRegistry from "../data/publications/substack-posts.json";
import { siteConfig } from "../lib/content";
import { applyPostIdBackfill, assertRouteStability, planPostIdBackfill } from "../lib/content-sync/post-identity";
import type { SubstackAliasRegistry, SubstackPostRegistry } from "../lib/content-sync/schema";
import { fetchCompleteSubstackArchive } from "../lib/content-sync/substack-archive";

const registryPath = path.join(process.cwd(), "data", "publications", "substack-posts.json");
const reportPath = path.join(process.cwd(), "reports", "substack-backfill", "post-id-backfill.json");

async function main(): Promise<void> {
  const write = process.argv.includes("--write");
  const registry = postsRegistry as SubstackPostRegistry;
  const archive = await fetchCompleteSubstackArchive(siteConfig.substackUrl);
  const plan = planPostIdBackfill(registry.posts, archive.posts, (aliasesRegistry as SubstackAliasRegistry).aliases);

  const report = {
    version: 1,
    generatedAt: new Date().toISOString(),
    archivePublicPosts: archive.posts.length,
    archiveExcluded: archive.errors.map((item) => ({ title: item.title, errors: item.errors })),
    missingBefore: registry.posts.filter((post) => !post.postId).length,
    backfilled: plan.backfilled,
    unresolved: plan.unresolved,
    written: write,
  };
  console.log(JSON.stringify(report, null, 2));

  if (!write) return;
  const posts = applyPostIdBackfill(registry.posts, plan);
  assertRouteStability(registry.posts, posts);
  if (plan.backfilled.length > 0) {
    const next: SubstackPostRegistry = { ...registry, posts };
    const temporaryPath = `${registryPath}.tmp`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
    fs.renameSync(temporaryPath, registryPath);
  }
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
