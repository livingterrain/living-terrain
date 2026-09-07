import { validateSubstackPost, type SubstackFeedPost } from "./schema";

interface PublicArchivePost {
  id?: number;
  title?: string;
  subtitle?: string | null;
  description?: string | null;
  canonical_url?: string;
  slug?: string;
  post_date?: string;
  cover_image?: string | null;
  truncated_body_text?: string | null;
  postTags?: Array<{ name?: string }>;
  publishedBylines?: Array<{ name?: string }>;
  audience?: string;
  type?: string;
}

export interface ArchiveFetchResult {
  posts: SubstackFeedPost[];
  errors: Array<{ page: number; index: number; title?: string; errors: string[] }>;
}

function normalizeArchivePost(source: PublicArchivePost): SubstackFeedPost {
  const timestamp = source.post_date ?? "";
  const description = (source.description ?? source.subtitle ?? "").trim();
  return {
    postId: source.id === undefined ? undefined : String(source.id),
    guid: source.canonical_url ?? "",
    canonicalUrl: source.canonical_url ?? "",
    slug: source.slug ?? "",
    title: source.title?.trim() ?? "",
    subtitle: source.subtitle?.trim() || undefined,
    description,
    excerpt: source.truncated_body_text?.trim() || description,
    publishedAt: /^\d{4}-\d{2}-\d{2}/.exec(timestamp)?.[0] ?? "",
    publishedTimestamp: timestamp,
    author: source.publishedBylines?.[0]?.name?.trim() || "Chelsea Thacker",
    coverImage: source.cover_image || undefined,
    tags: (source.postTags ?? []).map((tag) => tag.name?.trim()).filter((tag): tag is string => Boolean(tag)),
    publicationStatus: "published",
  };
}

export async function fetchCompleteSubstackArchive(
  publicationUrl: string,
  fetcher: typeof fetch = fetch,
): Promise<ArchiveFetchResult> {
  const posts: SubstackFeedPost[] = [];
  const errors: ArchiveFetchResult["errors"] = [];
  const seen = new Set<string>();
  const limit = 12;

  for (let page = 0; page < 100; page += 1) {
    const endpoint = new URL("/api/v1/archive", publicationUrl);
    endpoint.searchParams.set("sort", "new");
    endpoint.searchParams.set("search", "");
    endpoint.searchParams.set("offset", String(page * limit));
    endpoint.searchParams.set("limit", String(limit));
    const response = await fetcher(endpoint, { headers: { "user-agent": "LivingTerrainBackfill/1.0" } });
    if (!response.ok) throw new Error(`Substack archive returned ${response.status}`);
    const pageItems = await response.json() as unknown;
    if (!Array.isArray(pageItems)) throw new Error("Substack archive page was not an array");
    if (pageItems.length === 0) break;

    pageItems.forEach((raw, index) => {
      const post = normalizeArchivePost(raw as PublicArchivePost);
      const itemErrors = validateSubstackPost(post);
      if ((raw as PublicArchivePost).audience !== "everyone") itemErrors.push("post is not public");
      if ((raw as PublicArchivePost).type !== "newsletter") itemErrors.push("post is not a newsletter essay");
      if (itemErrors.length) errors.push({ page, index, title: post.title || undefined, errors: itemErrors });
      else if (post.postId && !seen.has(post.postId)) {
        seen.add(post.postId);
        posts.push(post);
      }
    });
    if (pageItems.length < limit) break;
  }

  return { posts, errors };
}
