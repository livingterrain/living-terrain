import {
  calendarDate,
  normalizeSourceUrl,
  type SubstackFeedPost,
  validateSubstackPost,
} from "./schema";

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(Number.parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function tag(item: string, name: string): string {
  return decodeXml(
    item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1]?.trim() ?? "",
  );
}

function attribute(item: string, name: string, attributeName: string): string {
  const raw = item.match(new RegExp(`<${name}\\s[^>]*${attributeName}=["']([^"']+)["'][^>]*>`, "i"))?.[1] ?? "";
  return decodeXml(raw);
}

function slugFromUrl(url: string): string {
  try {
    return new URL(url).pathname.replace(/^\/p\//, "").replace(/\/$/, "");
  } catch {
    return "";
  }
}

export interface ParseFeedResult {
  posts: SubstackFeedPost[];
  errors: Array<{ index: number; title?: string; errors: string[] }>;
}

export function parseSubstackFeed(xml: string): ParseFeedResult {
  const posts: SubstackFeedPost[] = [];
  const errors: ParseFeedResult["errors"] = [];
  const items = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)];

  items.forEach((match, index) => {
    const item = match[1];
    const publishedTimestamp = tag(item, "pubDate");
    const parsedTimestamp = new Date(publishedTimestamp);
    const canonicalUrl = normalizeSourceUrl(tag(item, "link"));
    const guid = normalizeSourceUrl(tag(item, "guid")) || canonicalUrl;
    const description = tag(item, "description").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const post: SubstackFeedPost = {
      guid,
      canonicalUrl,
      slug: slugFromUrl(canonicalUrl),
      title: tag(item, "title"),
      subtitle: description || undefined,
      description,
      excerpt: description,
      publishedAt: Number.isNaN(parsedTimestamp.getTime()) ? "" : parsedTimestamp.toISOString().slice(0, 10),
      publishedTimestamp,
      author: tag(item, "dc:creator"),
      coverImage: attribute(item, "enclosure", "url") || undefined,
      tags: [...item.matchAll(/<category(?:\s[^>]*)?>([\s\S]*?)<\/category>/gi)].map((category) => decodeXml(category[1].trim())),
      publicationStatus: "published",
    };
    const itemErrors = validateSubstackPost(post);
    if (!calendarDate(post.publishedAt)) itemErrors.push("pubDate could not be parsed");
    if (itemErrors.length) errors.push({ index, title: post.title || undefined, errors: [...new Set(itemErrors)] });
    else posts.push(post);
  });

  return { posts, errors };
}
