import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import type { Essay } from "../content/types";
import { parseSubstackFeed } from "./substack-feed";
import { resolveSubstackEssay } from "./resolve-essay";
import {
  normalizeSourceUrl,
  validateSubstackPost,
  type StoredSubstackPost,
  type SubstackAlias,
  type SubstackPostRegistry,
} from "./schema";

export interface SyncResult {
  changed: boolean;
  registry: SubstackPostRegistry;
  added: string[];
  updated: string[];
}

function identityKey(guid: string, canonicalUrl: string): string {
  return normalizeSourceUrl(guid) || normalizeSourceUrl(canonicalUrl);
}

function generatedId(key: string): string {
  return `substack-rss-${createHash("sha256").update(key).digest("hex").slice(0, 12)}`;
}

function observedUrls(...values: string[]): string[] {
  return [...new Set(values.map(normalizeSourceUrl).filter(Boolean))].sort();
}

function availableSlug(base: string, identity: string, essays: Essay[], stored: StoredSubstackPost[]): string {
  const taken = new Set([...essays.map((essay) => essay.slug), ...stored.map((post) => post.essaySlug)]);
  if (!taken.has(base)) return base;
  return `${base}-${createHash("sha256").update(identity).digest("hex").slice(0, 8)}`;
}

function validateRegistry(posts: StoredSubstackPost[]): void {
  const ids = new Set<string>();
  const essayIds = new Set<string>();
  const slugs = new Set<string>();
  for (const post of posts) {
    const errors = validateSubstackPost(post);
    if (!post.essayId) errors.push("essayId is required");
    if (!post.essaySlug) errors.push("essaySlug is required");
    const key = identityKey(post.guid, post.canonicalUrl);
    if (!key) errors.push("source identity is required");
    if (ids.has(key)) errors.push("source identity is duplicated");
    if (essayIds.has(post.essayId)) errors.push("essay identity is duplicated");
    if (slugs.has(post.essaySlug)) errors.push("essay slug is duplicated");
    if (errors.length) throw new Error(`${post.title || "Untitled post"}: ${errors.join("; ")}`);
    ids.add(key);
    essayIds.add(post.essayId);
    slugs.add(post.essaySlug);
  }
}

export function syncSubstackRegistry(
  xml: string,
  registry: SubstackPostRegistry,
  essays: Essay[],
  aliases: SubstackAlias[],
  generatedAt = new Date().toISOString(),
): SyncResult {
  const parsed = parseSubstackFeed(xml);
  if (parsed.errors.length) {
    throw new Error(`RSS quarantine: ${parsed.errors.map((item) => `item ${item.index + 1}: ${item.errors.join(", ")}`).join(" | ")}`);
  }
  if (parsed.posts.length === 0) throw new Error("RSS feed contained no valid essay items");

  const next: StoredSubstackPost[] = registry.posts.map((post) => ({
    ...post,
    ...(post.sourceUrls ? { sourceUrls: [...post.sourceUrls] } : {}),
  }));
  const added: string[] = [];
  const updated: string[] = [];

  for (const post of parsed.posts) {
    const resolution = resolveSubstackEssay(post, essays, next, aliases);
    if (resolution.kind === "CONFLICT_REVIEW_REQUIRED" || resolution.kind === "ERROR") {
      throw new Error(`${post.title}: ${resolution.kind} — ${resolution.reason}`);
    }

    const knownIndex = next.findIndex((stored) => stored.essayId === resolution.essay?.id);
    if (knownIndex >= 0) {
      const known = next[knownIndex];
      const sourceChanged =
        normalizeSourceUrl(known.canonicalUrl) !== normalizeSourceUrl(post.canonicalUrl) ||
        normalizeSourceUrl(known.guid) !== normalizeSourceUrl(post.guid);
      const sourceUrls = sourceChanged || known.sourceUrls
        ? observedUrls(...(known.sourceUrls ?? []), known.canonicalUrl, known.guid, post.canonicalUrl, post.guid)
        : undefined;
      const candidate: StoredSubstackPost = {
        ...known,
        guid: post.guid,
        canonicalUrl: post.canonicalUrl,
        slug: post.slug,
        title: post.title,
        author: post.author,
        coverImage: post.coverImage ?? known.coverImage,
        publicationStatus: post.publicationStatus,
        ...(sourceUrls ? { sourceUrls } : {}),
      };
      if (!isDeepStrictEqual(candidate, known)) {
        next[knownIndex] = candidate;
        updated.push(known.essayId);
      }
      continue;
    }

    if (resolution.kind !== "NEW_UNMAPPED" && resolution.essay) {
      next.push({ ...post, essayId: resolution.essay.id, essaySlug: resolution.essay.slug });
      added.push(resolution.essay.id);
      continue;
    }

    const key = identityKey(post.guid, post.canonicalUrl);
    const essayId = generatedId(key);
    const essaySlug = availableSlug(post.slug, key, essays, next);
    next.push({ ...post, essayId, essaySlug });
    added.push(essayId);
  }

  next.sort((a, b) => new Date(b.publishedTimestamp).getTime() - new Date(a.publishedTimestamp).getTime() || a.essayId.localeCompare(b.essayId));
  validateRegistry(next);
  const changed = !isDeepStrictEqual(next, registry.posts);
  return {
    changed,
    registry: { version: 1, generatedAt: changed ? generatedAt : registry.generatedAt, posts: next },
    added,
    updated,
  };
}

export async function fetchSubstackRss(url: string, fetcher: typeof fetch = fetch): Promise<string> {
  const response = await fetcher(url, { headers: { "user-agent": "LivingTerrainRssSync/1.0" } });
  if (!response.ok) throw new Error(`Substack RSS returned ${response.status}`);
  return response.text();
}
