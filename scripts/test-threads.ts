import assert from "node:assert/strict";
import {
  applyEssayThreads,
  essayThreadMapFromRegistry,
  findUnknownEssayThreadSlugs,
  getThreadByParam,
  getThreadLabels,
  getThreadRefs,
  parseEssayThreadRegistry,
  THREAD_IDS,
  THREADS,
  threadEssayCountLabel,
  threadHref,
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
  assert.deepEqual(getThreadLabels(["boundary", "translation"]), ["Boundary", "Translation"]);
  assert.deepEqual(getThreadLabels(["intelligence", "constraint", "technology"]), [
    "Intelligence",
    "Constraint",
    "Technology",
  ]);
  assert.deepEqual(getThreadLabels([]), []);
  assert.deepEqual(getThreadLabels(undefined), []);
  assert.deepEqual(getThreadLabels(["boundary", "not-a-thread"]), ["Boundary"]);
  assert.deepEqual(
    getThreadRefs(["boundary", "translation"]).map((thread) => thread.id),
    ["boundary", "translation"],
  );
  assert.equal(threadHref("boundary"), "/threads/boundary");
  assert.equal(getThreadByParam("translation")?.label, "Translation");
  assert.equal(getThreadByParam("not-a-thread"), undefined);
  assert.equal(THREADS.length, 10);
  for (const thread of THREADS) {
    assert.ok(thread.description.trim().length > 40, `${thread.id}: description is present`);
    assert.equal(threadHref(thread.id), `/threads/${thread.id}`);
  }
  assert.equal(threadEssayCountLabel(1), "1 essay in this thread");
  assert.equal(threadEssayCountLabel(4), "4 essays in this thread");
  console.log("test-threads OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
