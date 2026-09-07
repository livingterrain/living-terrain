import type { Essay } from "../content/types";
import {
  normalizePublicationTitle,
  normalizeSourceUrl,
  type StoredSubstackPost,
  type SubstackAlias,
  type SubstackFeedPost,
} from "./schema";

export type ResolutionKind =
  | "EXACT_MATCH"
  | "EXPLICIT_ALIAS_MATCH"
  | "TITLE_DATE_MATCH"
  | "CONFLICT_REVIEW_REQUIRED"
  | "NEW_UNMAPPED"
  | "ERROR";

export interface EssayResolution {
  kind: ResolutionKind;
  essay?: Essay;
  reason: string;
  candidates?: Essay[];
}

function urlsForEssay(essay: Essay): string[] {
  return [essay.canonicalUrl, essay.substackUrl, essay.mediumUrl, essay.externalUrl]
    .filter((url): url is string => Boolean(url))
    .map(normalizeSourceUrl)
    .filter(Boolean);
}

export function resolveSubstackEssay(
  post: SubstackFeedPost,
  essays: Essay[],
  stored: StoredSubstackPost[],
  aliases: SubstackAlias[],
): EssayResolution {
  if (!post.title || !post.canonicalUrl || !post.publishedAt) return { kind: "ERROR", reason: "source record is incomplete" };

  if (post.postId) {
    const storedIds = [...new Set(stored.filter((item) => item.postId === post.postId).map((item) => item.essayId))];
    if (storedIds.length > 1) return { kind: "CONFLICT_REVIEW_REQUIRED", reason: "stored post ID identifies multiple essays", candidates: essays.filter((essay) => storedIds.includes(essay.id)) };
    if (storedIds.length === 1) {
      const essay = essays.find((item) => item.id === storedIds[0]);
      return essay ? { kind: "EXACT_MATCH", essay, reason: "stored numeric Substack post ID" } : { kind: "ERROR", reason: `stored post ID points to missing essay ${storedIds[0]}` };
    }
  }

  const sourceUrls = new Set([post.canonicalUrl, post.guid].map(normalizeSourceUrl).filter(Boolean));
  const exactUrl = essays.filter((essay) => urlsForEssay(essay).some((url) => sourceUrls.has(url)));
  if (exactUrl.length === 1) return { kind: "EXACT_MATCH", essay: exactUrl[0], reason: "exact normalized canonical URL or GUID" };
  if (exactUrl.length > 1) return { kind: "CONFLICT_REVIEW_REQUIRED", reason: "source URL identifies multiple essays", candidates: exactUrl };

  const storedUrlIds = [...new Set(stored.filter((item) =>
    [item.canonicalUrl, item.guid, ...(item.sourceUrls ?? [])]
      .map(normalizeSourceUrl)
      .some((url) => sourceUrls.has(url)),
  ).map((item) => item.essayId))];
  if (storedUrlIds.length > 1) return { kind: "CONFLICT_REVIEW_REQUIRED", reason: "stored source URL identifies multiple essays", candidates: essays.filter((essay) => storedUrlIds.includes(essay.id)) };
  if (storedUrlIds.length === 1) {
    const essay = essays.find((item) => item.id === storedUrlIds[0]);
    return essay ? { kind: "EXACT_MATCH", essay, reason: "stored normalized canonical URL or GUID" } : { kind: "ERROR", reason: `stored source URL points to missing essay ${storedUrlIds[0]}` };
  }

  const aliasIds = [...new Set(aliases.filter((item) =>
    (post.postId && item.postId === post.postId) ||
    (item.canonicalUrl && sourceUrls.has(normalizeSourceUrl(item.canonicalUrl))) ||
    (item.guid && sourceUrls.has(normalizeSourceUrl(item.guid))),
  ).map((item) => item.essayId))];
  if (aliasIds.length > 1) return { kind: "CONFLICT_REVIEW_REQUIRED", reason: "explicit aliases identify multiple essays", candidates: essays.filter((essay) => aliasIds.includes(essay.id)) };
  if (aliasIds.length === 1) {
    const essay = essays.find((item) => item.id === aliasIds[0]);
    return essay ? { kind: "EXPLICIT_ALIAS_MATCH", essay, reason: "explicit recorded source alias" } : { kind: "ERROR", reason: `alias points to missing essay ${aliasIds[0]}` };
  }

  const normalizedTitle = normalizePublicationTitle(post.title);
  const titleMatches = essays.filter((essay) => normalizePublicationTitle(essay.title) === normalizedTitle);
  const titleDateMatches = titleMatches.filter((essay) => essay.publishedAt.slice(0, 10) === post.publishedAt);
  if (titleDateMatches.length === 1) return { kind: "TITLE_DATE_MATCH", essay: titleDateMatches[0], reason: "exact normalized title and matching calendar publication date" };
  if (titleMatches.length > 0) return { kind: "CONFLICT_REVIEW_REQUIRED", reason: titleDateMatches.length > 1 ? "title and date identify multiple essays" : "exact normalized title has a conflicting publication date", candidates: titleMatches };

  return { kind: "NEW_UNMAPPED", reason: "no deterministic existing identity" };
}
