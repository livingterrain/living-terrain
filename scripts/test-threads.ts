import assert from "node:assert/strict";
import {
  applyEssayThreads,
  essayThreadMapFromRegistry,
  findUnknownEssayThreadSlugs,
  parseEssayThreadRegistry,
  THREAD_IDS,
} from "../lib/threads";

function validRegistry(assignments: Array<{ slug: string; threadIds: string[] }>) {
  return { version: 1 as const, assignments };
}

async function main(): Promise<void> {
  const parsed = parseEssayThreadRegistry(
    validRegistry([{ slug: "known-work", threadIds: ["boundary", "translation"] }]),
  );
  assert.equal(parsed.issues.length, 0);
  assert.deepEqual(parsed.registry?.assignments[0]?.threadIds, ["boundary", "translation"]);

  const unknown = parseEssayThreadRegistry(
    validRegistry([{ slug: "known-work", threadIds: ["boundary", "mystery"] }]),
  );
  assert.equal(unknown.registry, null);
  assert.ok(unknown.issues.some((issue) => issue.code === "unknown-thread-id"));
  assert.ok(unknown.issues.some((issue) => issue.message.includes("mystery")));

  const duplicates = parseEssayThreadRegistry(
    validRegistry([{ slug: "known-work", threadIds: ["boundary", "boundary"] }]),
  );
  assert.equal(duplicates.registry, null);
  assert.ok(duplicates.issues.some((issue) => issue.code === "duplicate-thread-id"));

  const repeatedSlug = parseEssayThreadRegistry(
    validRegistry([
      { slug: "known-work", threadIds: ["boundary"] },
      { slug: "known-work", threadIds: ["intelligence"] },
    ]),
  );
  assert.equal(repeatedSlug.registry, null);
  assert.ok(repeatedSlug.issues.some((issue) => issue.code === "duplicate-assignment"));

  const empty = parseEssayThreadRegistry(validRegistry([{ slug: "known-work", threadIds: [] }]));
  assert.equal(empty.registry, null);
  assert.ok(empty.issues.some((issue) => issue.code === "empty-thread-ids"));

  const stale = parseEssayThreadRegistry(
    validRegistry([{ slug: "does-not-exist", threadIds: ["logos"] }]),
  );
  assert.equal(stale.issues.length, 0);
  assert.ok(stale.registry);
  const staleIssues = findUnknownEssayThreadSlugs(stale.registry, ["known-work"]);
  assert.equal(staleIssues.length, 1);
  assert.equal(staleIssues[0]?.code, "unknown-essay-slug");
  assert.equal(staleIssues[0]?.slug, "does-not-exist");

  const essays = applyEssayThreads(
    [
      { slug: "known-work", title: "Known Work" },
      { slug: "unmapped-work", title: "Unmapped Work" },
    ],
    essayThreadMapFromRegistry(parsed.registry!),
  );
  assert.deepEqual(essays[0]?.threadIds, ["boundary", "translation"]);
  assert.deepEqual(essays[1]?.threadIds, []);

  assert.equal(THREAD_IDS.length, 10);
  console.log("test-threads OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
