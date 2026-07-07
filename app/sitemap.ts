import type { MetadataRoute } from "next";
import {
  getAllMaps,
  getAllEssays,
  getAllFieldNotes,
  getAllProjects,
  getAllQuestions,
  getStructureSections,
} from "@/lib/content";
import { siteConfig } from "@/lib/content/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes = [
    "",
    "/atlas",
    "/inquiry",
    "/questions",
    "/essays",
    "/field-notes",
    "/observatory",
    "/about",
    "/search",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/atlas" ? 0.9 : 0.8,
  }));

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

  const maps = getAllMaps().map((m) => ({
    url: `${base}/atlas/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const notes = getAllFieldNotes().map((n) => ({
    url: `${base}/field-notes/${n.slug}`,
    lastModified: new Date(n.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const chambers = getAllProjects().map((p) => ({
    url: `${base}/chambers/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p.slug === "the-structure-beneath-reality" ? 0.95 : 0.85,
  }));

  const sections = getStructureSections().map((s) => ({
    url: `${base}/structure-beneath-reality/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...chambers,
    ...maps,
    ...questions,
    ...essays,
    ...notes,
    ...sections,
  ];
}
