import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getAtlas, toEssay } from "../lib/atlas";
import { getAllEssays, getEssayBySlug, getEssaysByThreadId } from "../lib/content";
import { materializeSubstackEssays } from "../lib/content-sync/materialize-essays";
import {
  THREAD_IDS,
  THREADS,
  findUnknownEssayThreadSlugs,
  getThreadByParam,
  getThreadCoOccurrence,
  loadEssayThreadRegistry,
  parseEssayThreadRegistry,
  sharedEssaySlugsBetween,
  type ThreadId,
} from "../lib/threads";

/** Near-duplicate / intentionally excluded slugs that must not receive assignments. */
const EXCLUDED_DUPLICATE_SLUGS = [
  "chronic-illness-is-a-paused-process",
  "the-signal-everyone-is-trying-to",
] as const;

async function main(): Promise<void> {
  const committedPath = join(process.cwd(), "data/publications/essay-threads.json");
  const committedRaw = JSON.parse(readFileSync(committedPath, "utf8"));
  const { registry: parsedCommitted, issues: parseIssues } =
    parseEssayThreadRegistry(committedRaw);
  assert.equal(parseIssues.length, 0, parseIssues.map((issue) => issue.message).join("\n"));
  assert.ok(parsedCommitted);

  const registry = loadEssayThreadRegistry();
  assert.deepEqual(
    registry.assignments,
    parsedCommitted.assignments,
    "runtime registry matches committed essay-threads.json",
  );

  const expected: Record<string, readonly ThreadId[]> = Object.fromEntries(
    registry.assignments.map((assignment) => [assignment.slug, assignment.threadIds]),
  );

  const essays = getAllEssays();
  const publicSlugs = essays.map((essay) => essay.slug);
  const stale = findUnknownEssayThreadSlugs(registry, publicSlugs);
  assert.deepEqual(stale, [], stale.map((issue) => issue.message).join("\n"));

  for (const slug of EXCLUDED_DUPLICATE_SLUGS) {
    assert.ok(
      publicSlugs.includes(slug),
      `${slug}: excluded duplicate still exists in public registry`,
    );
    assert.equal(
      expected[slug],
      undefined,
      `${slug}: duplicate slug must remain unmapped`,
    );
  }

  for (const [slug, threadIds] of Object.entries(expected)) {
    const assignment = registry.assignments.find((item) => item.slug === slug);
    assert.deepEqual(assignment?.threadIds, [...threadIds], `${slug}: registry mapping`);

    const essay = getEssayBySlug(slug);
    assert.ok(essay, `${slug}: public essay exists`);
    assert.deepEqual(essay.threadIds, [...threadIds], `${slug}: assembled essay threads`);
    assert.ok(threadIds.length >= 1 && threadIds.length <= 3, `${slug}: 1–3 threads`);
  }

  const covered = new Set(registry.assignments.flatMap((assignment) => assignment.threadIds));
  assert.deepEqual(
    [...covered].sort(),
    [...THREAD_IDS].sort(),
    "approved map covers the full vocabulary",
  );

  const assignedSlugs = new Set(registry.assignments.map((assignment) => assignment.slug));
  const threaded = essays.filter((essay) => (essay.threadIds?.length ?? 0) > 0);
  assert.equal(
    threaded.length,
    registry.assignments.length,
    "only assigned essays receive threads",
  );
  assert.equal(threaded.length, assignedSlugs.size);

  for (const essay of essays) {
    if (assignedSlugs.has(essay.slug)) continue;
    assert.deepEqual(essay.threadIds, [], `${essay.slug}: unmapped essays receive threadIds: []`);
  }

  const atlas = getAtlas();
  const materialized = materializeSubstackEssays();
  for (const essay of materialized) {
    assert.deepEqual(
      essay.threadIds,
      [],
      `${essay.slug}: Substack materialization must not attach threads`,
    );
  }

  for (const slug of Object.keys(expected)) {
    const assembled = getEssayBySlug(slug)!;
    const atlasEntry = atlas.getBySlug("essay", slug);
    const source = atlasEntry
      ? toEssay(atlasEntry, atlas)
      : materialized.find((essay) => essay.slug === slug);
    assert.ok(source, `${slug}: pre-merge source exists`);
    assert.deepEqual(assembled.themeIds ?? [], source.themeIds ?? [], `${slug}: themeIds unchanged`);
    assert.deepEqual(assembled.questionIds, source.questionIds, `${slug}: questionIds unchanged`);
    assert.deepEqual(
      assembled.relatedEssayIds ?? [],
      source.relatedEssayIds ?? [],
      `${slug}: relatedEssayIds unchanged`,
    );
  }

  for (const thread of THREADS) {
    const listed = getEssaysByThreadId(thread.id);
    assert.ok(listed.length > 0, `${thread.id}: at least one essay is gathered`);
    const dates = listed.map((essay) => new Date(essay.publishedAt).getTime());
    assert.deepEqual(dates, [...dates].sort((a, b) => b - a), `${thread.id}: newest first`);
    assert.ok(
      listed.every((essay) => essay.threadIds?.includes(thread.id)),
      `${thread.id}: listed essays belong to the thread`,
    );
  }

  assert.ok(
    getEssaysByThreadId("translation").some(
      (essay) => essay.slug === "the-body-has-more-than-one-map",
    ),
  );
  assert.ok(
    getEssaysByThreadId("intelligence").some(
      (essay) => essay.slug === "agi-may-already-be-herejust-not-in",
    ),
  );
  assert.ok(
    getEssaysByThreadId("translation").some((essay) => essay.slug === "we-leave-each-other-words"),
  );
  assert.ok(
    getEssaysByThreadId("feedback").some(
      (essay) => essay.slug === "the-future-rarely-arrives-from-nowhere",
    ),
  );
  assert.equal(getThreadByParam("not-a-real-thread"), undefined);
  assert.equal(THREADS.map((thread) => thread.id).join(","), THREAD_IDS.join(","));

  // Co-occurrence: registry-only ranking, shared essays retained, cap of 3.
  for (const id of THREAD_IDS) {
    const neighbors = getThreadCoOccurrence(id);
    assert.ok(neighbors.length <= 3, `${id}: at most three co-occurrence neighbors`);
    assert.ok(neighbors.length >= 1, `${id}: every Thread has ≥1 co-member today`);
    for (let i = 1; i < neighbors.length; i++) {
      const prev = neighbors[i - 1];
      const next = neighbors[i];
      assert.ok(
        prev.sharedCount > next.sharedCount ||
          (prev.sharedCount === next.sharedCount &&
            THREAD_IDS.indexOf(prev.threadId) < THREAD_IDS.indexOf(next.threadId)),
        `${id}: neighbors ranked by sharedCount then THREAD_IDS`,
      );
    }
    for (const neighbor of neighbors) {
      assert.equal(
        neighbor.sharedCount,
        neighbor.sharedEssaySlugs.length,
        `${id}↔${neighbor.threadId}: sharedCount matches slug list`,
      );
      assert.deepEqual(
        [...neighbor.sharedEssaySlugs].sort(),
        sharedEssaySlugsBetween(id, neighbor.threadId).sort(),
        `${id}↔${neighbor.threadId}: sharedEssaySlugsBetween agrees`,
      );
      assert.ok(
        !neighbor.sharedEssaySlugs.includes(""),
        `${id}↔${neighbor.threadId}: no empty slugs`,
      );
    }
  }

  // Tie-break sample: equal sharedCount uses vocabulary order.
  const logosNeighbors = getThreadCoOccurrence("logos", 10);
  const byCount = new Map<number, ThreadId[]>();
  for (const n of logosNeighbors) {
    const list = byCount.get(n.sharedCount) ?? [];
    list.push(n.threadId);
    byCount.set(n.sharedCount, list);
  }
  for (const [, ids] of byCount) {
    if (ids.length < 2) continue;
    const ordered = [...ids].sort(
      (a, b) => THREAD_IDS.indexOf(a) - THREAD_IDS.indexOf(b),
    );
    assert.deepEqual(ids, ordered, "logos: THREAD_IDS tie-break within equal counts");
  }

  const counts = Object.fromEntries(
    THREAD_IDS.map((id) => [id, getEssaysByThreadId(id).length]),
  ) as Record<ThreadId, number>;

  console.log(
    JSON.stringify(
      {
        mapped: registry.assignments.length,
        unmapped: essays.length - registry.assignments.length,
        publicEssays: essays.length,
        counts,
      },
      null,
      2,
    ),
  );
  console.log("verify-threads OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
