#!/usr/bin/env npx tsx
/**
 * Every slug in data/publications/essay-threads.json must resolve to an essay in
 * the rendered corpus. Read-only; suitable for the sync and deployment workflow.
 */
import committed from "../data/publications/essay-threads.json";
import { getAllEssays } from "../lib/content";
import { assertEssayThreadSlugsResolve, parseEssayThreadRegistry } from "../lib/threads";

function main(): void {
  const { registry, issues } = parseEssayThreadRegistry(committed);
  if (!registry) {
    throw new Error(["essay-threads.json is invalid:", ...issues.map((item) => `  - ${item.message}`)].join("\n"));
  }
  const essays = getAllEssays();
  assertEssayThreadSlugsResolve(registry, essays.map((essay) => essay.slug));

  const bySlug = new Map(essays.map((essay) => [essay.slug, essay]));
  for (const assignment of registry.assignments) {
    const rendered = bySlug.get(assignment.slug)?.threadIds ?? [];
    if (rendered.join(",") !== assignment.threadIds.join(",")) {
      throw new Error(`${assignment.slug}: rendered Threads [${rendered.join(", ")}] differ from authored [${assignment.threadIds.join(", ")}]`);
    }
  }
  console.log(`verify-thread-slugs OK — ${registry.assignments.length} authored assignments resolve in a rendered corpus of ${essays.length} essays`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
