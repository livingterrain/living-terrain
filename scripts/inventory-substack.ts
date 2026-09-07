#!/usr/bin/env npx tsx
/** Read-only comparison of the website essay registry with the public Substack RSS feed. */
import fs from "node:fs";
import { getAllEssays, siteConfig } from "../lib/content";
import { compareEssaysWithSubstack, parseSubstackFeed } from "../lib/content-migration/substack-inventory";

const feedUrl = process.argv[2] ?? `${siteConfig.substackUrl}/feed`;
const outputPath = process.argv[3];

async function main(): Promise<void> {
  const response = await fetch(feedUrl, { headers: { "user-agent": "LivingTerrainMigrationInventory/1.0" } });
  if (!response.ok) throw new Error(`Substack feed returned ${response.status} ${response.statusText}`);
  const posts = parseSubstackFeed(await response.text());
  const report = compareEssaysWithSubstack(getAllEssays(), posts, feedUrl);
  const json = `${JSON.stringify(report, null, 2)}\n`;
  if (outputPath) fs.writeFileSync(outputPath, json, "utf8");
  else process.stdout.write(json);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
