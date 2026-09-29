import assert from "node:assert/strict";
import postsRegistry from "../data/publications/substack-posts.json";
import { getAllEssays, getEssayBySlug } from "../lib/content";
import { validateIdentityDecisions, type IdentityDecisionRegistry } from "../lib/content-sync/identity-decisions";
import { materializeSubstackPost } from "../lib/content-sync/materialize-essays";
import {
  applyPostIdBackfill,
  assertRouteStability,
  enrichFeedPostIds,
  planPostIdBackfill,
} from "../lib/content-sync/post-identity";
import { buildPublicationDrift } from "../lib/content-sync/publication-drift";
import type { StoredSubstackPost, SubstackFeedPost, SubstackPostRegistry } from "../lib/content-sync/schema";
import { syncSubstackRegistry } from "../lib/content-sync/sync";
import type { Essay } from "../lib/content/types";
import { applyEssayThreads, assertEssayThreadSlugsResolve, type EssayThreadRegistry } from "../lib/threads";

const BASE = "https://livingterrain.substack.com/p/";

function item(title: string, slug: string, date = "Thu, 10 Sep 2026 12:00:00 GMT"): string {
  return `<item><title><![CDATA[${title}]]></title><description><![CDATA[A description.]]></description><link>${BASE}${slug}</link><guid>${BASE}${slug}</guid><dc:creator>Chelsea Thacker</dc:creator><pubDate>${date}</pubDate></item>`;
}

function feed(...items: string[]): string {
  return `<?xml version="1.0"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>${items.join("")}</channel></rss>`;
}

function archivePost(postId: string, slug: string, title = "Archive"): SubstackFeedPost {
  return {
    postId,
    guid: `${BASE}${slug}`,
    canonicalUrl: `${BASE}${slug}`,
    slug,
    title,
    description: "A description.",
    excerpt: "A description.",
    publishedAt: "2026-09-10",
    publishedTimestamp: "2026-09-10T12:00:00.000Z",
    author: "Chelsea Thacker",
    tags: [],
    publicationStatus: "published",
  };
}

const known: StoredSubstackPost = {
  ...archivePost("215056384", "we-leave-each-other-words", "We Leave Each Other Words"),
  publishedTimestamp: "Thu, 10 Sep 2026 12:00:00 GMT",
  essayId: "substack-rss-0f3e9e49efe5",
  essaySlug: "we-leave-each-other-words",
};
const registry: SubstackPostRegistry = { version: 1, generatedAt: null, posts: [known] };
const essays = (posts: StoredSubstackPost[]): Essay[] => posts.map((post) => materializeSubstackPost(post)!);
const threads: EssayThreadRegistry = { version: 1, assignments: [{ slug: "we-leave-each-other-words", threadIds: ["logos", "translation"] }] } as EssayThreadRegistry;
const threadMap = new Map(threads.assignments.map((a) => [a.slug, a.threadIds]));

// 1. A known post whose Substack URL changes keeps its Living Terrain route.
const movedSlug = "we-leave-each-other-words-revisited";
const moved = syncSubstackRegistry(
  feed(item("We Leave Each Other Words", movedSlug)),
  registry, essays(registry.posts), [], "2026-09-29T00:00:00.000Z",
  [archivePost("215056384", movedSlug)],
);
assert.equal(moved.registry.posts.length, 1, "URL change does not create a second record");
const movedPost = moved.registry.posts[0];
assert.equal(movedPost.essaySlug, known.essaySlug, "route slug is stable across a URL change");
assert.equal(movedPost.essayId, known.essayId);
assert.equal(movedPost.canonicalUrl, `${BASE}${movedSlug}`, "verified external URL follows Substack");
assert.equal(movedPost.slug, movedSlug, "Substack's own slug is recorded as publication metadata");
assert.ok(movedPost.sourceUrls?.includes(known.canonicalUrl), "previous URL kept as publication history");
assert.equal(materializeSubstackPost(movedPost)!.slug, "we-leave-each-other-words");

// 2. A known post whose title changes keeps its route.
const retitled = syncSubstackRegistry(
  feed(item("Words We Leave Each Other", "we-leave-each-other-words")),
  registry, essays(registry.posts), [], "2026-09-29T00:00:00.000Z",
);
assert.equal(retitled.registry.posts.length, 1);
assert.equal(retitled.registry.posts[0].title, "Words We Leave Each Other");
assert.equal(retitled.registry.posts[0].essaySlug, known.essaySlug, "route slug is stable across a title change");

// 1b. URL and title change together: the Substack post ID keeps the identity.
const both = syncSubstackRegistry(
  feed(item("Words We Leave Each Other", movedSlug)),
  registry, essays(registry.posts), [], "2026-09-29T00:00:00.000Z",
  [archivePost("215056384", movedSlug)],
);
assert.equal(both.registry.posts.length, 1, "post ID prevents a duplicate when URL and title both change");
assert.equal(both.registry.posts[0].essaySlug, known.essaySlug);

// 3. Thread assignments still resolve after publication metadata changes.
for (const result of [moved, retitled, both]) {
  const rendered = applyEssayThreads(essays(result.registry.posts), threadMap);
  assertEssayThreadSlugsResolve(threads, rendered.map((essay) => essay.slug));
  assert.deepEqual(rendered[0].threadIds, ["logos", "translation"], "authored Threads stay attached");
}

// 4. A Thread slug with no rendered essay fails loudly.
assert.throws(
  () => assertEssayThreadSlugsResolve(
    { version: 1, assignments: [...threads.assignments, { slug: "no-such-essay", threadIds: ["logos"] }] } as EssayThreadRegistry,
    essays(registry.posts).map((essay) => essay.slug),
  ),
  /no-such-essay/,
);

// 5. Post-ID backfill adds only postId and never changes route or authored fields.
const unidentified: StoredSubstackPost = { ...known, postId: undefined };
delete unidentified.postId;
const plan = planPostIdBackfill([unidentified], [archivePost("215056384", "we-leave-each-other-words")]);
assert.deepEqual(plan.unresolved, []);
assert.equal(plan.backfilled[0].postId, "215056384");
const [filled] = applyPostIdBackfill([unidentified], plan);
assert.deepEqual({ ...filled, postId: undefined }, { ...unidentified, postId: undefined }, "only postId changes");
assert.equal(filled.essaySlug, unidentified.essaySlug);
assertRouteStability([unidentified], [filled]);
const ambiguous = planPostIdBackfill([unidentified], [archivePost("1", "we-leave-each-other-words"), archivePost("2", "we-leave-each-other-words")]);
assert.equal(ambiguous.backfilled.length, 0, "ambiguous archive identity is not guessed");
assert.match(ambiguous.unresolved[0].reason, /multiple/);
const noMatch = planPostIdBackfill([unidentified], [archivePost("3", "a-similar-title")]);
assert.match(noMatch.unresolved[0].reason, /no archive post/, "no fuzzy title inference");
const owned = planPostIdBackfill([unidentified, { ...known, essayId: "other", essaySlug: "other", postId: "215056384", canonicalUrl: `${BASE}other`, guid: `${BASE}other` }], [archivePost("215056384", "we-leave-each-other-words")]);
assert.match(owned.unresolved[0].reason, /already belongs/, "a post ID owned by another record is not reassigned");
assert.equal(enrichFeedPostIds([{ ...archivePost("x", "a"), postId: undefined }], [archivePost("9", "a")])[0].postId, "9");

// 6. Repeated sync is idempotent, including after a URL change.
for (const [xml, archive] of [
  [feed(item("We Leave Each Other Words", "we-leave-each-other-words")), [archivePost("215056384", "we-leave-each-other-words")]],
  [feed(item("We Leave Each Other Words", movedSlug)), [archivePost("215056384", movedSlug)]],
] as const) {
  const once = syncSubstackRegistry(xml, registry, essays(registry.posts), [], "2026-09-29T00:00:00.000Z", [...archive]);
  const twice = syncSubstackRegistry(xml, once.registry, essays(once.registry.posts), [], "2026-09-29T01:00:00.000Z", [...archive]);
  assert.equal(twice.changed, false, "second identical sync is a no-op");
  assert.deepEqual(twice.registry, once.registry);
}

// Route guard and post-ID conflicts.
assert.throws(() => assertRouteStability([known], [{ ...known, essaySlug: "renamed" }]), /route slug changed/);
assert.throws(() => assertRouteStability([known], []), /disappeared/);
assert.throws(() => assertRouteStability([known], [{ ...known, postId: "1" }]), /post ID changed/);
assert.throws(
  () => syncSubstackRegistry(feed(item("We Leave Each Other Words", "we-leave-each-other-words")), registry, essays(registry.posts), [], undefined, [archivePost("999", "we-leave-each-other-words")]),
  /CONFLICT_REVIEW_REQUIRED/,
  "a URL that now belongs to a different post ID is not silently merged",
);

// Identity decisions: recorded by humans, validated, never inferred.
const atlasIds = new Set(["e66"]);
const registryIds = new Set(["substack-186514312"]);
const pending: IdentityDecisionRegistry = { version: 1, pending: [{ atlasEssayId: "e66", registryEssayId: "substack-186514312", evidenceFor: [], evidenceAgainst: [] }], decisions: [] };
assert.deepEqual(validateIdentityDecisions(pending, atlasIds, registryIds), []);
assert.ok(validateIdentityDecisions({ ...pending, decisions: [{ atlasEssayId: "e66", registryEssayId: "substack-186514312", decision: "distinct-work", decidedBy: "editor", decidedAt: "2026-09-29" }] }, atlasIds, registryIds).some((e) => /more than once/.test(e)));
assert.ok(validateIdentityDecisions({ version: 1, pending: [], decisions: [{ atlasEssayId: "e66", registryEssayId: "substack-186514312", decision: "same-work", decidedBy: "", decidedAt: "soon" }] }, atlasIds, registryIds).length >= 2);

// Drift report distinguishes publication evolution from identity ambiguity.
const atlasEssay: Essay = { id: "e1", slug: "authored", title: "Authored Title", publishedAt: "2026-09-01", excerpt: "Authored.", topics: [], questionIds: [], status: "published" };
const linked = { ...known, essayId: "e1", essaySlug: "authored", title: "Authored Title" };
const [evolution] = buildPublicationDrift([atlasEssay], [linked], [{ essayId: "e1", postId: linked.postId }]);
assert.equal(evolution.identityBasis, "reviewed-alias");
assert.equal(evolution.assessment, "publication-evolution", "date drift under reviewed identity is evolution");
const [ambiguity] = buildPublicationDrift([atlasEssay], [{ ...linked, title: "Something Else" }], []);
assert.equal(ambiguity.assessment, "identity-review-suggested");

// 7. Rendered corpus = Atlas records + registry posts not claimed by an Atlas record.
const runtimePosts = (postsRegistry as SubstackPostRegistry).posts;
const all = getAllEssays();
const atlasRecords = all.filter((essay) => /^e\d+$/.test(essay.id));
const registryOnly = all.filter((essay) => essay.id.startsWith("substack-"));
assert.equal(atlasRecords.length, 120);
assert.equal(all.length, atlasRecords.length + registryOnly.length);
assert.equal(registryOnly.length, runtimePosts.filter((post) => !/^e\d+$/.test(post.essayId)).length);
for (const post of runtimePosts) {
  assert.ok(post.postId, `${post.essayId}: carries a stable Substack post ID`);
  assert.ok(getEssayBySlug(post.essaySlug), `${post.essaySlug}: renders at its route`);
}
assert.deepEqual(getEssayBySlug("we-leave-each-other-words")?.threadIds, ["logos", "translation"], "backfilled record keeps its authored Threads");

console.log(`test-publication-integrity OK — rendered ${all.length} = ${atlasRecords.length} Atlas + ${registryOnly.length} registry-only`);
