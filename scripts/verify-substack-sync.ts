import assert from "node:assert/strict";
import fs from "node:fs";
import aliasesRegistry from "../data/publications/substack-aliases.json";
import postsRegistry from "../data/publications/substack-posts.json";
import { getAllEssays } from "../lib/content";
import { parseSubstackFeed } from "../lib/content-sync/substack-feed";
import { materializeSubstackEssays, materializeSubstackPost } from "../lib/content-sync/materialize-essays";
import { resolveSubstackEssay } from "../lib/content-sync/resolve-essay";
import type { Essay } from "../lib/content/types";
import {
  isPaidSubstackFieldNote,
  type StoredSubstackPost,
  type SubstackAlias,
  type SubstackAliasRegistry,
  type SubstackFeedPost,
  type SubstackPostRegistry,
} from "../lib/content-sync/schema";

const fixture = fs.readFileSync("test/fixtures/substack-feed.xml", "utf8");
const parsed = parseSubstackFeed(fixture);
assert.deepEqual(parsed.errors, []);
assert.equal(parsed.posts.length, 1);
assert.equal(parsed.posts[0].canonicalUrl, "https://livingterrain.substack.com/p/a-living-test");
assert.equal(parsed.posts[0].publishedAt, "2026-09-04");
assert.equal(parsed.posts[0].author, "Chelsea Thacker");
assert.deepEqual(parsed.posts[0].tags, ["Systems"]);

const baseEssay: Essay = { id: "e7", slug: "a-living-test", title: "A Living Test", publishedAt: "2026-09-04", excerpt: "old", topics: [], questionIds: [], status: "published", externalUrl: "https://medium.com/@livingterrain/a-living-test" };
const post: SubstackFeedPost = { ...parsed.posts[0], postId: "123" };
const exactStored: StoredSubstackPost = { ...post, essayId: "e7", essaySlug: "a-living-test" };
const alias: SubstackAlias = { essayId: "e7", postId: "123" };

assert.equal(resolveSubstackEssay(post, [baseEssay], [exactStored], []).kind, "EXACT_MATCH");
assert.equal(resolveSubstackEssay(post, [baseEssay], [], [alias]).kind, "EXPLICIT_ALIAS_MATCH");
assert.equal(resolveSubstackEssay(post, [baseEssay], [], []).kind, "TITLE_DATE_MATCH");
assert.equal(resolveSubstackEssay({ ...post, publishedAt: "2026-09-05" }, [baseEssay], [], []).kind, "CONFLICT_REVIEW_REQUIRED");
assert.equal(resolveSubstackEssay({ ...post, postId: "456", title: "A Different Test", slug: "a-different-test", canonicalUrl: "https://livingterrain.substack.com/p/a-different-test", guid: "https://livingterrain.substack.com/p/a-different-test" }, [baseEssay], [], []).kind, "NEW_UNMAPPED");
assert.deepEqual(resolveSubstackEssay(post, [baseEssay], [], []), resolveSubstackEssay(post, [baseEssay], [], []), "resolution is deterministic");
const otherEssay = { ...baseEssay, id: "e8", slug: "another" };
assert.equal(resolveSubstackEssay(post, [baseEssay, otherEssay], [{ ...exactStored }, { ...exactStored, essayId: "e8", essaySlug: "another" }], []).kind, "CONFLICT_REVIEW_REQUIRED");
assert.equal(parseSubstackFeed("<rss><channel><item><title>Broken</title></item></channel></rss>").posts.length, 0);
assert.ok(parseSubstackFeed("<rss><channel><item><title>Broken</title></item></channel></rss>").errors.length > 0);
const runtimePosts = (postsRegistry as SubstackPostRegistry).posts;
const runtimeAliases = (aliasesRegistry as SubstackAliasRegistry).aliases;
const BASELINE_PUBLIC_POSTS = 81;
const BASELINE_MATCHED_EXISTING = 46;
const BASELINE_UNMAPPED = 35;
const BASELINE_ALIASES = 10;
const BASELINE_ATLAS_PLUS_UNMAPPED = 155;

assert.ok(runtimePosts.length >= BASELINE_PUBLIC_POSTS, "public baseline posts remain stored");
const essayIds = runtimePosts.map((item) => item.essayId);
const essaySlugs = runtimePosts.map((item) => item.essaySlug);
assert.equal(new Set(essayIds).size, essayIds.length, "each stored essay identity is unique");
assert.equal(new Set(essaySlugs).size, essaySlugs.length, "each stored essay slug is unique");
const numericPostIds = runtimePosts.map((item) => item.postId).filter((id): id is string => Boolean(id));
assert.equal(new Set(numericPostIds).size, numericPostIds.length, "numeric Substack post IDs are unique");
assert.equal(runtimeAliases.length, BASELINE_ALIASES, "all reviewed aliases are recorded");
assert.equal(new Set(runtimeAliases.map((item) => item.postId)).size, BASELINE_ALIASES, "reviewed alias post IDs are unique");
for (const storedPost of runtimePosts) {
  assert.ok(!isPaidSubstackFieldNote(storedPost), `${storedPost.slug}: paid Field Notes must not enter the public essay registry`);
}

const materialized = materializeSubstackEssays();
assert.equal(materialized.length, runtimePosts.length, "all stored public posts materialize");
const existingIds = new Set(Array.from({ length: 120 }, (_, index) => `e${index + 1}`));
const matched = materialized.filter((essay) => existingIds.has(essay.id));
const newUnmapped = materialized.filter((essay) => essay.id.startsWith("substack-"));
assert.ok(matched.length >= BASELINE_MATCHED_EXISTING, "existing matched essays remain resolved");
assert.equal(new Set(matched.map((essay) => essay.id)).size, matched.length, "matched works do not create duplicate essay objects");
assert.ok(newUnmapped.length >= BASELINE_UNMAPPED, "unmapped Substack posts remain materialized");
for (const essay of newUnmapped) {
  assert.deepEqual(essay.questionIds, []);
  assert.deepEqual(essay.themeIds, []);
  assert.deepEqual(essay.projectIds, []);
  assert.deepEqual(essay.bookIds, []);
  assert.deepEqual(essay.relatedEssayIds, []);
  assert.deepEqual(essay.parentRefs, []);
  assert.deepEqual(essay.childRefs, []);
  assert.deepEqual(essay.quotationIds, []);
  assert.deepEqual(essay.observationIds, []);
}
const allEssays = getAllEssays();
const atlasEssayCount = allEssays.filter((essay) => !essay.id.startsWith("substack-")).length;
assert.ok(atlasEssayCount >= 120, "authored atlas essays remain");
assert.equal(allEssays.length, atlasEssayCount + newUnmapped.length, "archive is authored essays plus unmapped Substack posts");
assert.ok(allEssays.length >= BASELINE_ATLAS_PLUS_UNMAPPED, "archive does not shrink below the public baseline");
assert.equal(new Set(allEssays.map((essay) => essay.id)).size, allEssays.length, "archive essay IDs are unique");
assert.equal(new Set(allEssays.map((essay) => essay.slug)).size, allEssays.length, "archive essay routes are unique");
for (const storedPost of runtimePosts) {
  const essay = allEssays.find((item) => item.id === storedPost.essayId);
  assert.ok(essay, `${storedPost.essayId}: essay is visible to the archive`);
  assert.ok(!isPaidSubstackFieldNote(essay), `${essay.slug}: paid Field Notes must not appear as public essays`);
  assert.equal(essay.substackUrl, storedPost.canonicalUrl, `${storedPost.essayId}: Substack is the preferred reading source`);
}
for (const essay of allEssays.filter((item) => existingIds.has(item.id) && item.substackUrl)) {
  assert.ok(essay.mediumUrl?.includes("medium.com"), `${essay.id}: historical Medium URL remains explicit`);
  assert.equal(essay.externalUrl, essay.mediumUrl, `${essay.id}: legacy external source remains compatible`);
}
const unmapped = materializeSubstackPost(exactStored)!;
assert.equal(unmapped.id, "e7");
assert.equal(unmapped.slug, "a-living-test");
assert.deepEqual(unmapped.questionIds, []);
assert.deepEqual(unmapped.themeIds, []);
assert.deepEqual(unmapped.projectIds, []);
assert.deepEqual(unmapped.bookIds, []);
assert.deepEqual(unmapped.relatedEssayIds, []);
assert.equal(materializeSubstackPost({ ...exactStored, canonicalUrl: "broken" }), null, "malformed stored data is ignored");
console.log("verify-substack-sync OK");
