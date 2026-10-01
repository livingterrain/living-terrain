import type { Essay } from "../content/types";
import { isSubstackPostUrl } from "../content/publication-cta";
import { normalizePublicationTitle, normalizeSourceUrl, type StoredSubstackPost, type SubstackAlias } from "./schema";

/**
 * Read-only comparison of Atlas-authored publication metadata against the
 * generated Substack registry. Signals only; it never decides or overwrites.
 */

export type TextDrift = "identical" | "formatting-only" | "truncation" | "different" | "absent-in-atlas" | "absent-in-registry";
export type DateDrift = "identical" | "different";
export type UrlDrift = "not-authored-in-atlas" | "identical" | "historical" | "different";
export type IdentityBasis = "reviewed-alias" | "atlas-url" | "title-and-date" | "registry-mapping-only";
export type DriftAssessment = "in-sync" | "publication-evolution" | "identity-review-suggested";

export interface PublicationDriftRow {
  essayId: string;
  slug: string;
  postId?: string;
  identityBasis: IdentityBasis;
  assessment: DriftAssessment;
  title: { status: TextDrift; atlas: string; substack: string };
  date: { status: DateDrift; atlas: string; substack: string; dayDelta: number };
  excerpt: { status: TextDrift };
  substackUrl: { status: UrlDrift; atlas?: string; substack: string };
}

function compareText(atlas: string | undefined, substack: string | undefined): TextDrift {
  if (!atlas?.trim()) return "absent-in-atlas";
  if (!substack?.trim()) return "absent-in-registry";
  if (atlas.trim() === substack.trim()) return "identical";
  const a = normalizePublicationTitle(atlas);
  const s = normalizePublicationTitle(substack);
  if (a === s) return "formatting-only";
  if (a.length > 40 && s.length > 40 && (a.startsWith(s) || s.startsWith(a))) return "truncation";
  return "different";
}

function dayDelta(a: string, b: string): number {
  const ms = new Date(`${b}T00:00:00Z`).getTime() - new Date(`${a}T00:00:00Z`).getTime();
  return Number.isNaN(ms) ? Number.NaN : Math.round(ms / 86_400_000);
}

function postUrls(post: StoredSubstackPost): Set<string> {
  return new Set([post.canonicalUrl, post.guid, ...(post.sourceUrls ?? [])].map(normalizeSourceUrl).filter(Boolean));
}

function authoredSubstackUrl(essay: Essay): string | undefined {
  return [essay.substackUrl, essay.canonicalUrl].find((url): url is string => Boolean(url && isSubstackPostUrl(url)));
}

function identityBasis(essay: Essay, post: StoredSubstackPost, aliases: SubstackAlias[]): IdentityBasis {
  if (aliases.some((alias) => alias.essayId === essay.id && post.postId && alias.postId === post.postId)) return "reviewed-alias";
  const urls = postUrls(post);
  const atlasUrls = [essay.canonicalUrl, essay.substackUrl, essay.mediumUrl, essay.externalUrl]
    .filter((url): url is string => Boolean(url))
    .map(normalizeSourceUrl);
  if (atlasUrls.some((url) => urls.has(url))) return "atlas-url";
  if (
    normalizePublicationTitle(essay.title) === normalizePublicationTitle(post.title) &&
    essay.publishedAt.slice(0, 10) === post.publishedAt
  ) return "title-and-date";
  return "registry-mapping-only";
}

export function buildPublicationDrift(
  atlasEssays: Essay[],
  posts: StoredSubstackPost[],
  aliases: SubstackAlias[],
): PublicationDriftRow[] {
  const rows: PublicationDriftRow[] = [];
  for (const essay of atlasEssays) {
    const post = posts.find((item) => item.essayId === essay.id) ?? posts.find((item) => item.essaySlug === essay.slug);
    if (!post) continue;
    const atlasDate = essay.publishedAt.slice(0, 10);
    const atlasUrl = authoredSubstackUrl(essay);
    const urlStatus: UrlDrift = !atlasUrl
      ? "not-authored-in-atlas"
      : normalizeSourceUrl(atlasUrl) === normalizeSourceUrl(post.canonicalUrl)
        ? "identical"
        : postUrls(post).has(normalizeSourceUrl(atlasUrl)) ? "historical" : "different";
    const title = compareText(essay.title, post.title);
    const date: DateDrift = atlasDate === post.publishedAt ? "identical" : "different";
    const basis = identityBasis(essay, post, aliases);
    const drifted =
      !["identical", "formatting-only"].includes(title) ||
      date === "different" ||
      urlStatus === "different" || urlStatus === "historical";
    const assessment: DriftAssessment =
      basis === "registry-mapping-only" && title === "different"
        ? "identity-review-suggested"
        : drifted ? "publication-evolution" : "in-sync";
    rows.push({
      essayId: essay.id,
      slug: essay.slug,
      postId: post.postId,
      identityBasis: basis,
      assessment,
      title: { status: title, atlas: essay.title, substack: post.title },
      date: { status: date, atlas: atlasDate, substack: post.publishedAt, dayDelta: dayDelta(atlasDate, post.publishedAt) },
      excerpt: { status: compareText(essay.excerpt, post.excerpt) },
      substackUrl: { status: urlStatus, ...(atlasUrl ? { atlas: atlasUrl } : {}), substack: post.canonicalUrl },
    });
  }
  return rows.sort((a, b) => a.essayId.localeCompare(b.essayId, undefined, { numeric: true }));
}
