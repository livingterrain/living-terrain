import type { Essay } from "../content/types";

export interface SubstackPost {
  title: string;
  url: string;
  publishedAt: string;
}

export interface InventoryCandidate extends SubstackPost {
  score: number;
}

export interface SubstackInventoryReport {
  generatedAt: string;
  sourceUrl: string;
  scopeNote: string;
  counts: Record<"essays" | "posts" | "matches" | "uncertain" | "missing" | "dateConflicts" | "possibleDuplicates", number>;
  matches: Array<{ essayId: string; essayTitle: string; post: SubstackPost }>;
  uncertain: Array<{ essayId: string; essayTitle: string; candidates: InventoryCandidate[] }>;
  missing: Array<{ essayId: string; essayTitle: string; publishedAt: string }>;
  dateConflicts: Array<{ essayId: string; essayTitle: string; websiteDate: string; post: SubstackPost }>;
  possibleDuplicates: Array<{ normalizedTitle: string; posts: SubstackPost[] }>;
}

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function tag(item: string, name: string): string {
  return decodeXml(item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1]?.trim() ?? "");
}

export function parseSubstackFeed(xml: string): SubstackPost[] {
  return [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map((match) => {
    const rawDate = tag(match[1], "pubDate");
    const parsedDate = new Date(rawDate);
    return {
      title: tag(match[1], "title"),
      url: tag(match[1], "link"),
      publishedAt: Number.isNaN(parsedDate.getTime()) ? rawDate : parsedDate.toISOString().slice(0, 10),
    };
  }).filter((post) => post.title && post.url);
}

export function normalizePublicationTitle(title: string): string {
  return title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleScore(left: string, right: string): number {
  const a = new Set(normalizePublicationTitle(left).split(" ").filter(Boolean));
  const b = new Set(normalizePublicationTitle(right).split(" ").filter(Boolean));
  if (!a.size || !b.size) return 0;
  const overlap = [...a].filter((word) => b.has(word)).length;
  return overlap / (a.size + b.size - overlap);
}

function calendarDate(value: string): string {
  return value.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? value;
}

export function compareEssaysWithSubstack(
  essays: Essay[],
  posts: SubstackPost[],
  sourceUrl: string,
  generatedAt = new Date().toISOString(),
): SubstackInventoryReport {
  const postGroups = new Map<string, SubstackPost[]>();
  for (const post of posts) {
    const key = normalizePublicationTitle(post.title);
    postGroups.set(key, [...(postGroups.get(key) ?? []), post]);
  }

  const matches: SubstackInventoryReport["matches"] = [];
  const uncertain: SubstackInventoryReport["uncertain"] = [];
  const missing: SubstackInventoryReport["missing"] = [];
  const dateConflicts: SubstackInventoryReport["dateConflicts"] = [];

  for (const essay of essays) {
    const exact = postGroups.get(normalizePublicationTitle(essay.title)) ?? [];
    if (exact.length === 1) {
      const post = exact[0];
      matches.push({ essayId: essay.id, essayTitle: essay.title, post });
      if (
        essay.publishedAt &&
        post.publishedAt &&
        calendarDate(essay.publishedAt) !== calendarDate(post.publishedAt)
      ) {
        dateConflicts.push({
          essayId: essay.id,
          essayTitle: essay.title,
          websiteDate: essay.publishedAt,
          post,
        });
      }
      continue;
    }

    const candidates = posts
      .map((post) => ({ ...post, score: titleScore(essay.title, post.title) }))
      .filter((post) => post.score >= 0.55)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    if (exact.length > 1 || candidates.length > 0) {
      uncertain.push({
        essayId: essay.id,
        essayTitle: essay.title,
        candidates: exact.length > 1 ? exact.map((post) => ({ ...post, score: 1 })) : candidates,
      });
    } else {
      missing.push({ essayId: essay.id, essayTitle: essay.title, publishedAt: essay.publishedAt });
    }
  }

  const possibleDuplicates = [...postGroups.entries()]
    .filter(([, grouped]) => grouped.length > 1)
    .map(([normalizedTitle, grouped]) => ({ normalizedTitle, posts: grouped }));

  return {
    generatedAt,
    sourceUrl,
    scopeNote: "Public Substack RSS feeds may expose only a recent window. Missing means absent from this feed, not confirmed unpublished.",
    counts: {
      essays: essays.length,
      posts: posts.length,
      matches: matches.length,
      uncertain: uncertain.length,
      missing: missing.length,
      dateConflicts: dateConflicts.length,
      possibleDuplicates: possibleDuplicates.length,
    },
    matches,
    uncertain,
    missing,
    dateConflicts,
    possibleDuplicates,
  };
}
