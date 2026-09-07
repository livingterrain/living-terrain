export type PublicationStatus = "published" | "archived";

export interface SubstackFeedPost {
  postId?: string;
  guid: string;
  canonicalUrl: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  publishedTimestamp: string;
  author: string;
  coverImage?: string;
  tags: string[];
  publicationStatus: PublicationStatus;
}

export interface StoredSubstackPost extends SubstackFeedPost {
  essayId: string;
  essaySlug: string;
  /** Previously observed canonical URLs/GUIDs retained as publication history. */
  sourceUrls?: string[];
}

export interface SubstackPostRegistry {
  version: 1;
  generatedAt: string | null;
  posts: StoredSubstackPost[];
}

export interface SubstackAlias {
  essayId: string;
  postId?: string;
  canonicalUrl?: string;
  guid?: string;
  note?: string;
}

export interface SubstackAliasRegistry {
  version: 1;
  aliases: SubstackAlias[];
}

export function calendarDate(value: string): string | null {
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match) return null;
  const parsed = new Date(`${match[1]}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== match[1]
    ? null
    : match[1];
}

export function normalizeSourceUrl(value: string): string {
  try {
    const url = new URL(value.trim());
    url.hash = "";
    url.search = "";
    url.hostname = url.hostname.toLowerCase();
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

export function normalizePublicationTitle(title: string): string {
  return title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateSubstackPost(value: unknown): string[] {
  const errors: string[] = [];
  if (!value || typeof value !== "object") return ["post must be an object"];
  const post = value as Partial<SubstackFeedPost>;
  for (const key of ["guid", "canonicalUrl", "slug", "title", "description", "excerpt", "publishedAt", "publishedTimestamp", "author"] as const) {
    if (typeof post[key] !== "string" || !post[key]?.trim()) errors.push(`${key} is required`);
  }
  if (post.postId !== undefined && !/^\d+$/.test(post.postId)) errors.push("postId must be numeric text");
  if (!calendarDate(post.publishedAt ?? "")) errors.push("publishedAt must be a valid calendar date");
  if (!normalizeSourceUrl(post.canonicalUrl ?? "")) errors.push("canonicalUrl must be a valid URL");
  if (!Array.isArray(post.tags) || post.tags.some((tag) => typeof tag !== "string")) errors.push("tags must be strings");
  const stored = post as Partial<StoredSubstackPost>;
  if (stored.sourceUrls !== undefined && (!Array.isArray(stored.sourceUrls) || stored.sourceUrls.some((url) => typeof url !== "string" || !normalizeSourceUrl(url)))) errors.push("sourceUrls must be valid URLs");
  if (post.publicationStatus !== "published" && post.publicationStatus !== "archived") errors.push("publicationStatus is invalid");
  return errors;
}
