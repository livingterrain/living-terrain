import {
  normalizeSourceUrl,
  type StoredSubstackPost,
  type SubstackAlias,
  type SubstackFeedPost,
} from "./schema";

/**
 * Publication identity (Substack post ID, canonical URL) is separate from
 * Living Terrain route identity (`essayId`, `essaySlug`). Publication identity
 * may evolve; route identity never changes once a post is registered.
 */

function postUrls(post: { canonicalUrl: string; guid: string; sourceUrls?: string[] }): Set<string> {
  return new Set(
    [post.canonicalUrl, post.guid, ...(post.sourceUrls ?? [])].map(normalizeSourceUrl).filter(Boolean),
  );
}

function archiveIdsByUrl(archivePosts: SubstackFeedPost[]): Map<string, Set<string>> {
  const byUrl = new Map<string, Set<string>>();
  for (const post of archivePosts) {
    if (!post.postId) continue;
    for (const url of postUrls(post)) {
      const ids = byUrl.get(url) ?? new Set<string>();
      ids.add(post.postId);
      byUrl.set(url, ids);
    }
  }
  return byUrl;
}

function uniqueArchiveId(urls: Set<string>, byUrl: Map<string, Set<string>>): { postId?: string; candidates: string[] } {
  const candidates = new Set<string>();
  for (const url of urls) for (const id of byUrl.get(url) ?? []) candidates.add(id);
  const list = [...candidates].sort();
  return list.length === 1 ? { postId: list[0], candidates: list } : { candidates: list };
}

/** Attach Substack post IDs to RSS items only when an exact URL identifies one archive post. */
export function enrichFeedPostIds(feedPosts: SubstackFeedPost[], archivePosts: SubstackFeedPost[]): SubstackFeedPost[] {
  const byUrl = archiveIdsByUrl(archivePosts);
  return feedPosts.map((post) => {
    if (post.postId) return post;
    const { postId } = uniqueArchiveId(postUrls(post), byUrl);
    return postId ? { ...post, postId } : post;
  });
}

export interface PostIdBackfillEntry {
  essayId: string;
  essaySlug: string;
  title: string;
  postId: string;
}

export interface PostIdBackfillUnresolved {
  essayId: string;
  essaySlug: string;
  title: string;
  reason: string;
  candidates: string[];
}

export interface PostIdBackfillPlan {
  backfilled: PostIdBackfillEntry[];
  unresolved: PostIdBackfillUnresolved[];
}

export function planPostIdBackfill(
  posts: StoredSubstackPost[],
  archivePosts: SubstackFeedPost[],
  aliases: SubstackAlias[] = [],
): PostIdBackfillPlan {
  const byUrl = archiveIdsByUrl(archivePosts);
  const claimed = new Map(posts.filter((post) => post.postId).map((post) => [post.postId!, post.essayId]));
  const backfilled: PostIdBackfillEntry[] = [];
  const unresolved: PostIdBackfillUnresolved[] = [];

  for (const post of posts) {
    if (post.postId) continue;
    const ref = { essayId: post.essayId, essaySlug: post.essaySlug, title: post.title };
    const { postId, candidates } = uniqueArchiveId(postUrls(post), byUrl);
    if (!postId) {
      unresolved.push({ ...ref, candidates, reason: candidates.length ? "exact URL identifies multiple archive posts" : "no archive post shares an exact URL" });
      continue;
    }
    const owner = claimed.get(postId);
    if (owner && owner !== post.essayId) {
      unresolved.push({ ...ref, candidates, reason: `post ID already belongs to ${owner}` });
      continue;
    }
    const alias = aliases.find((item) => item.postId === postId && item.essayId !== post.essayId);
    if (alias) {
      unresolved.push({ ...ref, candidates, reason: `post ID is aliased to ${alias.essayId}` });
      continue;
    }
    claimed.set(postId, post.essayId);
    backfilled.push({ ...ref, postId });
  }
  return { backfilled, unresolved };
}

/** Adds only `postId`; every other field, including route identity, is left untouched. */
export function applyPostIdBackfill(posts: StoredSubstackPost[], plan: PostIdBackfillPlan): StoredSubstackPost[] {
  const ids = new Map(plan.backfilled.map((entry) => [entry.essayId, entry.postId]));
  return posts.map((post) => {
    const postId = ids.get(post.essayId);
    return postId && !post.postId ? { ...post, postId } : post;
  });
}

/** Registered posts are never removed, and their Living Terrain route slug never changes. */
export function assertRouteStability(previous: StoredSubstackPost[], next: StoredSubstackPost[]): void {
  const nextById = new Map(next.map((post) => [post.essayId, post]));
  for (const post of previous) {
    const current = nextById.get(post.essayId);
    if (!current) throw new Error(`${post.essayId}: registered publication disappeared from the registry`);
    if (current.essaySlug !== post.essaySlug) {
      throw new Error(`${post.essayId}: route slug changed from "${post.essaySlug}" to "${current.essaySlug}"`);
    }
    if (post.postId && current.postId !== post.postId) {
      throw new Error(`${post.essayId}: Substack post ID changed from ${post.postId} to ${current.postId ?? "none"}`);
    }
  }
}
