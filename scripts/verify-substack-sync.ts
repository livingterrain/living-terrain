import assert from "node:assert/strict";
import fs from "node:fs";
import aliasesRegistry from "../data/publications/substack-aliases.json";
import postsRegistry from "../data/publications/substack-posts.json";
import { getAllEssays } from "../lib/content";
import { parseSubstackFeed } from "../lib/content-sync/substack-feed";
import { materializeSubstackEssays, materializeSubstackPost } from "../lib/content-sync/materialize-essays";
import { resolveSubstackEssay } from "../lib/content-sync/resolve-essay";
import type { Essay } from "../lib/content/types";
import type { StoredSubstackPost, SubstackAlias, SubstackAliasRegistry, SubstackFeedPost, SubstackPostRegistry } from "../lib/content-sync/schema";

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
assert.equal(runtimePosts.length, 81, "all public baseline posts are stored");
assert.equal(new Set(runtimePosts.map((item) => item.postId)).size, 81, "each Substack post ID is represented once");
assert.equal(runtimeAliases.length, 10, "all reviewed aliases are recorded");
assert.equal(new Set(runtimeAliases.map((item) => item.postId)).size, 10, "reviewed alias post IDs are unique");

const materialized = materializeSubstackEssays();
assert.equal(materialized.length, 81, "all stored posts materialize");
const existingIds = new Set(Array.from({ length: 120 }, (_, index) => `e${index + 1}`));
const matched = materialized.filter((essay) => existingIds.has(essay.id));
const newUnmapped = materialized.filter((essay) => essay.id.startsWith("substack-"));
assert.equal(matched.length, 46, "46 Substack posts resolve to existing essays");
assert.equal(new Set(matched.map((essay) => essay.id)).size, 46, "matched works do not create duplicate essay objects");
assert.equal(newUnmapped.length, 35, "35 posts materialize as new unmapped essays");
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
assert.equal(allEssays.length, 155, "archive exposes 120 existing plus 35 new essays");
assert.equal(new Set(allEssays.map((essay) => essay.id)).size, 155, "archive essay IDs are unique");
assert.equal(new Set(allEssays.map((essay) => essay.slug)).size, 155, "archive essay routes are unique");
for (const storedPost of runtimePosts) {
  const essay = allEssays.find((item) => item.id === storedPost.essayId);
  assert.ok(essay, `${storedPost.postId}: essay is visible to the archive`);
  assert.equal(essay.substackUrl, storedPost.canonicalUrl, `${storedPost.postId}: Substack is the preferred reading source`);
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
