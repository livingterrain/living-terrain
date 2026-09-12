import assert from "node:assert/strict";
import { getAtlas, toEssay } from "../lib/atlas";
import { getAllEssays, getEssayBySlug, getEssaysByThreadId } from "../lib/content";
import { materializeSubstackEssays } from "../lib/content-sync/materialize-essays";
import {
  THREAD_IDS,
  THREADS,
  findUnknownEssayThreadSlugs,
  getThreadByParam,
  loadEssayThreadRegistry,
  type ThreadId,
} from "../lib/threads";

const EXPECTED_SEED: Record<string, readonly ThreadId[]> = {
  "the-body-has-more-than-one-map": ["boundary", "translation"],
  "resilience-is-not-how-much-you-can": ["boundary", "constraint", "feedback"],
  "the-silent-epidemic-of-dissolving-barriers": ["boundary", "constraint"],
  "when-broken-relationship-becomes-physical-1e585280319d": [
    "relationship",
    "boundary",
    "consciousness",
  ],
  "agi-may-already-be-herejust-not-in": ["intelligence", "constraint", "technology"],
  "the-ai-we-fear-looks-suspiciously": ["intelligence", "relationship", "technology"],
  "we-leave-each-other-words": ["logos", "translation", "participation"],
  "what-taught-you-how-to-see": ["consciousness", "translation", "participation"],
  "the-future-rarely-arrives-from-nowhere": ["feedback", "constraint", "technology"],
  "parallel-lives-the-fire-and-the-feedback-loop": ["feedback", "consciousness"],
};

async function main(): Promise<void> {
  const registry = loadEssayThreadRegistry();
  assert.equal(registry.assignments.length, 10, "seed set stays at ten essays");

  const essays = getAllEssays();
  const publicSlugs = essays.map((essay) => essay.slug);
  const stale = findUnknownEssayThreadSlugs(registry, publicSlugs);
  assert.deepEqual(stale, [], stale.map((issue) => issue.message).join("\n"));

  const assignedSlugs = new Set(registry.assignments.map((assignment) => assignment.slug));
  assert.deepEqual(
    [...assignedSlugs].sort(),
    Object.keys(EXPECTED_SEED).sort(),
    "committed slugs match the approved seed set",
  );

  for (const [slug, threadIds] of Object.entries(EXPECTED_SEED)) {
    const assignment = registry.assignments.find((item) => item.slug === slug);
    assert.deepEqual(assignment?.threadIds, [...threadIds], `${slug}: registry mapping`);

    const essay = getEssayBySlug(slug);
    assert.ok(essay, `${slug}: public essay exists`);
    assert.deepEqual(essay.threadIds, [...threadIds], `${slug}: assembled essay threads`);
  }

  const covered = new Set(registry.assignments.flatMap((assignment) => assignment.threadIds));
  assert.deepEqual([...covered].sort(), [...THREAD_IDS].sort(), "seed set covers the full vocabulary");

  const threaded = essays.filter((essay) => (essay.threadIds?.length ?? 0) > 0);
  assert.equal(threaded.length, 10, "only the seeded essays receive threads");

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

  for (const slug of Object.keys(EXPECTED_SEED)) {
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

  const boundary = getEssaysByThreadId("boundary");
  assert.ok(boundary.some((essay) => essay.slug === "the-body-has-more-than-one-map"));
  assert.ok(getEssaysByThreadId("intelligence").some((essay) => essay.slug === "agi-may-already-be-herejust-not-in"));
  assert.ok(getEssaysByThreadId("translation").some((essay) => essay.slug === "we-leave-each-other-words"));
  assert.equal(getThreadByParam("not-a-real-thread"), undefined);
  assert.equal(THREADS.map((thread) => thread.id).join(","), THREAD_IDS.join(","));

  console.log("verify-threads OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
