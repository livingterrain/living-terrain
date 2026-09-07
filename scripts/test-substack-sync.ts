import assert from "node:assert/strict";
import { getEssayReadSource, getEssayReadUrl } from "../lib/content";
import { materializeSubstackPost } from "../lib/content-sync/materialize-essays";
import { fetchSubstackRss, syncSubstackRegistry } from "../lib/content-sync/sync";
import type { Essay } from "../lib/content/types";
import type { StoredSubstackPost, SubstackPostRegistry } from "../lib/content-sync/schema";

function item({
  title = "Known Work",
  description = "A concise description.",
  link = "https://livingterrain.substack.com/p/known-work",
  guid = link,
  date = "Fri, 04 Sep 2026 14:30:58 GMT",
}: Partial<{ title: string; description: string; link: string; guid: string; date: string }> = {}): string {
  return `<item><title><![CDATA[${title}]]></title><description><![CDATA[${description}]]></description><link>${link}</link><guid>${guid}</guid><dc:creator>Chelsea Thacker</dc:creator><pubDate>${date}</pubDate></item>`;
}

function feed(...items: string[]): string {
  return `<?xml version="1.0"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>${items.join("")}</channel></rss>`;
}

async function main(): Promise<void> {
const existing: Essay = {
  id: "e7",
  slug: "known-work",
  title: "Known Work",
  publishedAt: "2026-09-04",
  excerpt: "Authored excerpt",
  topics: [],
  questionIds: ["q-authored"],
  relatedEssayIds: ["e8"],
  externalUrl: "https://medium.com/@livingterrain/known-work-old",
  status: "published",
};
const known: StoredSubstackPost = {
  guid: "https://livingterrain.substack.com/p/known-work",
  canonicalUrl: "https://livingterrain.substack.com/p/known-work",
  slug: "known-work",
  title: "Known Work",
  subtitle: "A concise description.",
  description: "A concise description.",
  excerpt: "A concise description.",
  publishedAt: "2026-09-04",
  publishedTimestamp: "Fri, 04 Sep 2026 14:30:58 GMT",
  author: "Chelsea Thacker",
  tags: [],
  publicationStatus: "published",
  essayId: "e7",
  essaySlug: "known-work",
};
const rolledOff: StoredSubstackPost = {
  ...known,
  guid: "https://livingterrain.substack.com/p/older-work",
  canonicalUrl: "https://livingterrain.substack.com/p/older-work",
  slug: "older-work",
  title: "Older Work",
  essayId: "substack-rss-older",
  essaySlug: "older-work",
};
const baseline: SubstackPostRegistry = { version: 1, generatedAt: null, posts: [known, rolledOff] };

// A. Existing post resolves without a duplicate.
const first = syncSubstackRegistry(feed(item()), baseline, [existing, materializeSubstackPost(rolledOff)!], [], "2026-09-07T00:00:00.000Z");
assert.equal(first.registry.posts.length, 2);
assert.equal(first.registry.posts.filter((post) => post.essayId === "e7").length, 1);

// B. A valid new post becomes one published, unmapped essay.
const newItem = item({ title: "A New Work", link: "https://livingterrain.substack.com/p/a-new-work", date: "Mon, 07 Sep 2026 12:00:00 GMT" });
const withNew = syncSubstackRegistry(feed(item(), newItem), first.registry, [existing, materializeSubstackPost(rolledOff)!], [], "2026-09-07T01:00:00.000Z");
const newPost = withNew.registry.posts.find((post) => post.title === "A New Work")!;
assert.ok(newPost.essayId.startsWith("substack-rss-"));
const newEssay = materializeSubstackPost(newPost)!;
assert.equal(newEssay.status, "published");
assert.deepEqual(newEssay.themeIds, []);

// C. Repeating the same feed creates no change.
const repeated = syncSubstackRegistry(feed(item(), newItem), withNew.registry, [existing, materializeSubstackPost(rolledOff)!, newEssay], [], "2026-09-07T02:00:00.000Z");
assert.equal(repeated.changed, false);
assert.deepEqual(repeated.registry, withNew.registry);

// D. A changed title retains the proven identity.
const renamed = syncSubstackRegistry(feed(item({ title: "Known Work, Revised" }), newItem), withNew.registry, [existing, materializeSubstackPost(rolledOff)!, newEssay], [], "2026-09-07T03:00:00.000Z");
assert.equal(renamed.registry.posts.find((post) => post.essayId === "e7")?.title, "Known Work, Revised");
assert.equal(renamed.registry.posts.filter((post) => post.essayId === "e7").length, 1);

// E. A changed canonical URL with a stable GUID retains identity and URL history.
const movedUrl = "https://livingterrain.substack.com/p/known-work-new-url";
const moved = syncSubstackRegistry(feed(item({ link: movedUrl, guid: known.guid })), first.registry, [existing, materializeSubstackPost(rolledOff)!], [], "2026-09-07T04:00:00.000Z");
const movedKnown = moved.registry.posts.find((post) => post.essayId === "e7")!;
assert.equal(movedKnown.canonicalUrl, movedUrl);
assert.ok(movedKnown.sourceUrls?.includes(known.canonicalUrl));
assert.ok(movedKnown.sourceUrls?.includes(movedUrl));

// F. A malformed item is quarantined and cannot produce a registry.
assert.throws(() => syncSubstackRegistry(feed("<item><title>Broken</title></item>"), baseline, [existing], []), /RSS quarantine/);
assert.equal(baseline.posts.length, 2);

// G. An unavailable feed rejects before registry processing.
await assert.rejects(() => fetchSubstackRss("https://livingterrain.substack.com/feed", async () => { throw new Error("offline"); }), /offline/);
assert.equal(baseline.posts.length, 2);

// H. Items outside the rolling RSS window remain durable.
assert.ok(first.registry.posts.some((post) => post.essayId === rolledOff.essayId));

// I. Ambiguous identity fails without a silent merge.
const twin = { ...existing, id: "e8", slug: "known-work-copy" };
assert.throws(() => syncSubstackRegistry(feed(item()), { version: 1, generatedAt: null, posts: [] }, [existing, twin], []), /CONFLICT_REVIEW_REQUIRED/);

// J. A new essay has no generated relationships and uses the visitor content path.
assert.deepEqual(newEssay.questionIds, []);
assert.deepEqual(newEssay.projectIds, []);
assert.deepEqual(newEssay.bookIds, []);
assert.deepEqual(newEssay.relatedEssayIds, []);
assert.deepEqual(newEssay.parentRefs, []);
assert.deepEqual(newEssay.childRefs, []);
assert.equal(`/essays/${newEssay.slug}`, "/essays/a-new-work");
assert.equal(getEssayReadUrl(newEssay), "https://livingterrain.substack.com/p/a-new-work");
assert.equal(getEssayReadSource(newEssay), "Substack");

console.log("test-substack-sync A–J OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
