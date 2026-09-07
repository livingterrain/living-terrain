import postsRegistry from "../../data/publications/substack-posts.json";
import type { Essay } from "../content/types";
import {
  type StoredSubstackPost,
  type SubstackPostRegistry,
  validateSubstackPost,
} from "./schema";

const registry = postsRegistry as SubstackPostRegistry;

export function materializeSubstackPost(post: StoredSubstackPost): Essay | null {
  if (validateSubstackPost(post).length > 0 || !post.essayId || !post.essaySlug) return null;
  return {
    id: post.essayId,
    slug: post.essaySlug,
    title: post.title,
    subtitle: post.subtitle,
    publishedAt: post.publishedAt,
    excerpt: post.excerpt,
    topics: [],
    questionIds: [],
    projectIds: [],
    bookIds: [],
    relatedEssayIds: [],
    themeIds: [],
    parentRefs: [],
    childRefs: [],
    quotationIds: [],
    observationIds: [],
    canonicalUrl: post.canonicalUrl,
    substackUrl: post.canonicalUrl,
    publicationStatus: post.publicationStatus,
    featuredImage: post.coverImage,
    status: "published",
  };
}

export function materializeSubstackEssays(): Essay[] {
  if (registry.version !== 1 || !Array.isArray(registry.posts)) return [];

  return registry.posts.flatMap((post: StoredSubstackPost) => {
    const essay = materializeSubstackPost(post);
    return essay ? [essay] : [];
  });
}
