import type { MetadataRoute } from "next";
import {
  getAllBooks,
  getAllEssays,
  getAllFieldNotes,
  getAllQuestions,
  getStructureSections,
} from "@/lib/content";
import { siteConfig } from "@/lib/content/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes = ["", "/questions", "/essays", "/library", "/field-notes", "/structure-beneath-reality", "/observatory", "/about", "/search"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const questions = getAllQuestions().map((q) => ({
    url: `${base}/questions/${q.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const essays = getAllEssays().map((e) => ({
    url: `${base}/essays/${e.slug}`,
    lastModified: new Date(e.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const books = getAllBooks().map((b) => ({
    url: `${base}/library/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const notes = getAllFieldNotes().map((n) => ({
    url: `${base}/field-notes/${n.slug}`,
    lastModified: new Date(n.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const sections = getStructureSections().map((s) => ({
    url: `${base}/structure-beneath-reality/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...questions, ...essays, ...books, ...notes, ...sections];
}
