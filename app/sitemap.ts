import type { MetadataRoute } from "next";
import {
  getAllMaps,
  getAllEssays,
  getAllProjects,
  getAllQuestions,
  getAllThemes,
  getAllQuotations,
  getAllFieldNotes,
  getStructureSections,
} from "@/lib/content";
import { concepts } from "@/lib/concepts";
import { getInvestigations } from "@/lib/observatory/investigations";
import { getGrowingIdeas } from "@/lib/observatory/growing-ideas-data";
import { getAllVisitorObservations } from "@/lib/observatory/visitor-observations.server";
import { getReadyPassageSlugs } from "@/lib/observatory/the-text";
import { THREAD_IDS, threadHref } from "@/lib/threads";
import { getVisualMapCollections } from "@/lib/visual-maps";
import { absoluteUrl } from "@/lib/seo";

function entry(
  path: string,
  options: {
    lastModified?: Date | string;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  } = {},
): MetadataRoute.Sitemap[number] {
  const item: MetadataRoute.Sitemap[number] = {
    url: absoluteUrl(path),
    changeFrequency: options.changeFrequency ?? "monthly",
    priority: options.priority ?? 0.7,
  };
  if (options.lastModified) {
    item.lastModified = new Date(options.lastModified);
  }
  return item;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    entry("/", { changeFrequency: "weekly", priority: 1 }),
    entry("/atlas", { changeFrequency: "weekly", priority: 0.95 }),
    entry("/atlas/charts", { changeFrequency: "monthly", priority: 0.55 }),
    entry("/observatory", { changeFrequency: "weekly", priority: 0.9 }),
    entry("/observatory/the-text", { changeFrequency: "weekly", priority: 0.85 }),
    entry("/inquiry", { changeFrequency: "weekly", priority: 0.85 }),
    entry("/books", { changeFrequency: "weekly", priority: 0.8 }),
    entry("/essays", { changeFrequency: "weekly", priority: 0.85 }),
    entry("/visual-maps", { changeFrequency: "monthly", priority: 0.7 }),
    entry("/questions", { changeFrequency: "weekly", priority: 0.8 }),
    entry("/join", { changeFrequency: "monthly", priority: 0.65 }),
    entry("/about", { changeFrequency: "monthly", priority: 0.6 }),
    entry("/concepts", { changeFrequency: "monthly", priority: 0.5 }),
  ];

  const essays = getAllEssays().map((e) =>
    entry(`/essays/${e.slug}`, {
      lastModified: e.publishedAt,
      changeFrequency: "monthly",
      priority: 0.75,
    }),
  );

  const maps = getAllMaps().map((m) =>
    entry(`/atlas/${m.slug}`, {
      changeFrequency: "monthly",
      priority: 0.85,
    }),
  );

  const chambers = getAllProjects().map((p) =>
    entry(`/chambers/${p.slug}`, {
      changeFrequency: "monthly",
      priority: p.slug === "the-structure-beneath-reality" ? 0.9 : 0.8,
    }),
  );

  const sections = getStructureSections().map((s) =>
    entry(`/structure-beneath-reality/${s.slug}`, {
      changeFrequency: "monthly",
      priority: 0.75,
    }),
  );

  const investigations = getInvestigations().map((i) =>
    entry(`/observatory/${i.slug}`, {
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const theTextPassages = getReadyPassageSlugs().map((slug) =>
    entry(`/observatory/the-text/${slug}`, {
      changeFrequency: "weekly",
      priority: 0.75,
    }),
  );

  const visualMaps = getVisualMapCollections().flatMap((c) => [
    entry(`/visual-maps/${c.slug}`, {
      changeFrequency: "monthly",
      priority: 0.65,
    }),
    ...c.items.map((p) =>
      entry(`/visual-maps/${c.slug}/${p.slug}`, {
        changeFrequency: "monthly",
        priority: 0.6,
      }),
    ),
  ]);

  const questions = getAllQuestions().map((q) =>
    entry(`/questions/${q.slug}`, {
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const themes = getAllThemes().map((t) =>
    entry(`/themes/${t.slug}`, {
      changeFrequency: "monthly",
      priority: 0.65,
    }),
  );

  const quotations = getAllQuotations().map((q) =>
    entry(`/quotations/${q.slug}`, {
      changeFrequency: "monthly",
      priority: 0.55,
    }),
  );

  const fieldNotes = getAllFieldNotes().map((n) =>
    entry(`/field-notes/${n.slug}`, {
      lastModified: n.publishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  const observations = getAllVisitorObservations().map((o) =>
    entry(`/observatory/observations/${o.slug}`, {
      lastModified: o.createdAt,
      changeFrequency: "monthly",
      priority: 0.55,
    }),
  );

  const growing = getGrowingIdeas().map((g) =>
    entry(`/observatory/growing/${g.slug}`, {
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  const conceptPages = concepts.map((c) =>
    entry(`/concepts/${c.slug}`, {
      changeFrequency: "monthly",
      priority: 0.45,
    }),
  );

  const threads = THREAD_IDS.map((id) =>
    entry(threadHref(id), {
      changeFrequency: "weekly",
      priority: 0.55,
    }),
  );

  return [
    ...staticRoutes,
    ...chambers,
    ...maps,
    ...investigations,
    ...theTextPassages,
    ...essays,
    ...sections,
    ...visualMaps,
    ...questions,
    ...themes,
    ...quotations,
    ...fieldNotes,
    ...observations,
    ...growing,
    ...conceptPages,
    ...threads,
  ];
}
