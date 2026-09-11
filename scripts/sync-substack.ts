#!/usr/bin/env npx tsx
import fs from "node:fs";
import path from "node:path";
import aliasesRegistry from "../data/publications/substack-aliases.json";
import postsRegistry from "../data/publications/substack-posts.json";
import { getAllEssays, siteConfig } from "../lib/content";
import { fetchSubstackRss, syncSubstackRegistry } from "../lib/content-sync/sync";
import type { SubstackAliasRegistry, SubstackPostRegistry } from "../lib/content-sync/schema";

const registryPath = path.join(process.cwd(), "data", "publications", "substack-posts.json");

async function main(): Promise<void> {
  const feedUrl = new URL("/feed", siteConfig.substackUrl).toString();
  const xml = await fetchSubstackRss(feedUrl);
  const result = syncSubstackRegistry(
    xml,
    postsRegistry as SubstackPostRegistry,
    getAllEssays(),
    (aliasesRegistry as SubstackAliasRegistry).aliases,
  );
  if (!result.changed) {
    console.log("Substack RSS is already synchronized; no registry change.");
    return;
  }

  const temporaryPath = `${registryPath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(result.registry, null, 2)}\n`, "utf8");
  fs.renameSync(temporaryPath, registryPath);
  console.log(JSON.stringify({
    changed: true,
    added: result.added,
    updated: result.updated,
    skipped: result.skipped,
    total: result.registry.posts.length,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
