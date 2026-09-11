import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { promisify, isDeepStrictEqual } from "node:util";
import type { Essay } from "../content/types";
import { parseSubstackFeed } from "./substack-feed";
import { resolveSubstackEssay } from "./resolve-essay";
import {
  isPaidSubstackFieldNote,
  normalizeSourceUrl,
  validateSubstackPost,
  type StoredSubstackPost,
  type SubstackAlias,
  type SubstackPostRegistry,
} from "./schema";

const execFileAsync = promisify(execFile);

export const SUBSTACK_RSS_HEADERS = {
  "user-agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
} as const;

export interface SyncResult {
  changed: boolean;
  registry: SubstackPostRegistry;
  added: string[];
  updated: string[];
  skipped: string[];
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

  const next: StoredSubstackPost[] = registry.posts
    .filter((post) => !isPaidSubstackFieldNote(post))
    .map((post) => ({
      ...post,
      ...(post.sourceUrls ? { sourceUrls: [...post.sourceUrls] } : {}),
    }));
  const added: string[] = [];
  const updated: string[] = [];
  const skipped: string[] = [];

  for (const post of parsed.posts) {
    if (isPaidSubstackFieldNote(post)) {
      skipped.push(post.slug || post.title);
      continue;
    }
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
    skipped,
  };
}

export async function fetchSubstackRssWithCurl(url: string): Promise<string> {
  const { stdout } = await execFileAsync(
    "curl",
    [
      "-sS",
      "-L",
      "--fail",
      "--max-time",
      "30",
      "-A",
      SUBSTACK_RSS_HEADERS["user-agent"],
      "-H",
      `Accept: ${SUBSTACK_RSS_HEADERS.accept}`,
      url,
    ],
    { encoding: "utf8", maxBuffer: 12 * 1024 * 1024 },
  );
  if (!stdout.includes("<item")) throw new Error("Substack RSS curl fallback returned no essay items");
  return stdout;
}

export async function fetchSubstackRss(
  url: string,
  fetcher: typeof fetch = fetch,
  curlFallback: (url: string) => Promise<string> = fetchSubstackRssWithCurl,
): Promise<string> {
  const response = await fetcher(url, { headers: { ...SUBSTACK_RSS_HEADERS } });
  if (response.ok) return response.text();
  if (response.status === 403) {
    try {
      return await curlFallback(url);
    } catch {
      throw new Error("Substack RSS returned 403");
    }
  }
  throw new Error(`Substack RSS returned ${response.status}`);
}
