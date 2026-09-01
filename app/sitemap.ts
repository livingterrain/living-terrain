import type { MetadataRoute } from "next";
import {
  getAllMaps,
  getAllEssays,
  getAllProjects,
  getStructureSections,
} from "@/lib/content";
import { siteConfig } from "@/lib/content/data";
import { getInvestigations } from "@/lib/observatory/investigations";
import { getVisualMapCollections } from "@/lib/visual-maps";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes = [
    "",
    "/atlas",
    "/atlas/charts",
    "/inquiry",
    "/books",
    "/essays",
    "/visual-maps",
    "/observatory",
    "/about",
    "/search",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority:
      path === ""
        ? 1
        : path === "/atlas"
          ? 0.9
          : path === "/atlas/charts"
            ? 0.55
            : 0.8,
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

  const investigations = getInvestigations().map((i) => ({
    url: `${base}/observatory/${i.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const visualMaps = getVisualMapCollections().flatMap((c) => [
    {
      url: `${base}/visual-maps/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    },
    ...c.items.map((p) => ({
      url: `${base}/visual-maps/${c.slug}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]);

  return [
    ...staticRoutes,
    ...chambers,
    ...maps,
    ...investigations,
    ...essays,
    ...sections,
    ...visualMaps,
  ];
}
