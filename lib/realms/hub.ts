import { NODE_WHISPERS } from "@/lib/concepts/constellation-discovery";
import {
  getAllEssays,
  getAllFieldNotes,
  getAllBooks,
  getAllQuestions,
  getAllQuotations,
  getAllThemes,
  getThemeBySlug,
} from "@/lib/content";
import { getSiteTimeline } from "@/lib/content/terrain";
import { getPeerRefs } from "@/lib/relationships/graph";
import { getAtlas } from "@/lib/atlas";
import { resolveMajorConcept } from "@/lib/concepts/major-concepts";
import { buildRealmLayout } from "./layouts";
import { getRealmConfig, isImmersiveRealm } from "./config";
import type {
  RealmChapter,
  RealmSlug,
  RealmThread,
  RealmTopic,
  ThemeHub,
  WordOccurrence,
} from "./types";

function enrichTopics(
  configTopics: RealmTopic[],
  themeId: string,
  slug: RealmSlug,
): RealmTopic[] {
  const map: Record<RealmSlug, Record<string, Partial<RealmTopic>>> = {
    reality: {
      models: { href: "/themes/structure", contentId: "th-structure" },
      perception: { href: "/themes/perception", contentId: "th-perception" },
      systems: { href: "/themes/structure", contentId: "th-structure" },
      truth: { href: "/questions/what-is-a-place", contentId: "q3" },
      essays: { href: "/essays/constraint-is-not-the-opposite-of-freedom", contentId: "e1" },
      emergence: { href: "/field-notes/familiar-path", contentId: "fn5" },
    },
    relationship: {
      ecology: { href: "/themes/relationship" },
      biology: { href: "/themes/embodiment", contentId: "th-embodiment" },
    },
    meaning: {
      consciousness: { href: "/themes/consciousness", contentId: "th-consciousness" },
      philosophy: { href: "/essays/you-have-to-go-far-enough-to-make-a-loop", contentId: "e2" },
    },
    identity: {
      embodiment: { href: "/themes/embodiment", contentId: "th-embodiment" },
      memory: { href: "/essays/you-have-to-go-far-enough-to-make-a-loop", contentId: "e2" },
      "nervous-system": { href: "/essays/constraint-is-not-the-opposite-of-freedom", contentId: "e1" },
    },
    language: {
      silence: { href: "/questions/can-language-hold-the-unsayable", contentId: "q4" },
      metaphor: { href: "/questions/can-language-hold-the-unsayable", contentId: "q4" },
    },
    time: {
      duration: { href: "/questions/how-do-we-inhabit-time", contentId: "q2" },
      memory: { href: "/field-notes/waiting-room", contentId: "fn2" },
      return: { href: "/essays/you-have-to-go-far-enough-to-make-a-loop", contentId: "e2" },
      accumulation: { href: "/structure-beneath-reality", contentId: "p1" },
    },
    embodiment: {
      "nervous-system": { href: "/essays/constraint-is-not-the-opposite-of-freedom", contentId: "e1" },
      heartbeat: { href: "/essays/constraint-is-not-the-opposite-of-freedom", contentId: "e1" },
      movement: { href: "/field-notes/familiar-path", contentId: "fn5" },
    },
    freedom: {
      constraint: { href: "/essays/constraint-is-not-the-opposite-of-freedom", contentId: "e1" },
      structure: { href: "/themes/structure", contentId: "th-structure" },
      embodiment: { href: "/themes/embodiment", contentId: "th-embodiment" },
      path: { href: "/questions/what-is-a-place", contentId: "q3" },
    },
    consciousness: {
      perception: { href: "/themes/perception", contentId: "th-perception" },
      awareness: { href: "/questions/what-lies-beneath-perception", contentId: "q1" },
      presence: { href: "/field-notes/light-on-water", contentId: "fn1" },
      field: { href: "/essays/you-have-to-go-far-enough-to-make-a-loop", contentId: "e2" },
    },
  };

  return configTopics.map((t) => ({
    ...t,
    ...(map[slug]?.[t.id] ?? {}),
  }));
}

function buildThreads(hub: Omit<ThemeHub, "threads" | "network" | "networkEdges" | "wordLinks" | "chapters">): RealmThread[] {
  const threads: RealmThread[] = [];

  for (const e of hub.essays) {
    threads.push({
      id: e.id,
      title: e.title,
      subtitle: e.subtitle ?? e.excerpt.slice(0, 90),
      href: `/essays/${e.slug}`,
      kind: "essay",
      year: e.publishedAt.slice(0, 4),
    });
  }
  for (const b of hub.books) {
    threads.push({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      href: `/library/${b.slug}`,
      kind: "book",
      year: b.publishedYear?.toString(),
    });
  }
  for (const q of hub.questions) {
    threads.push({
      id: q.id,
      title: q.title,
      subtitle: q.subtitle,
      href: `/questions/${q.slug}`,
      kind: "question",
    });
  }
  for (const fn of hub.fieldNotes) {
    threads.push({
      id: fn.id,
      title: fn.title ?? "Field observation",
      subtitle: fn.body.slice(0, 80),
      href: `/field-notes/${fn.slug}`,
      kind: "field-note",
      year: fn.publishedAt.slice(0, 4),
    });
  }
  for (const qt of hub.quotations) {
    threads.push({
      id: qt.id,
      title: qt.text.slice(0, 60) + (qt.text.length > 60 ? "…" : ""),
      subtitle: qt.attribution,
      href: `/quotations/${qt.slug}`,
      kind: "quotation",
    });
  }
  for (const sc of hub.subConcepts) {
    threads.push({
      id: sc.id,
      title: sc.title,
      subtitle: sc.description,
      href: `/themes/${sc.slug}`,
      kind: "concept",
    });
  }

  return threads;
}

function buildChapters(hub: Omit<ThemeHub, "chapters">): RealmChapter[] {
  const chapters: RealmChapter[] = [];

  for (const q of hub.questions) {
    chapters.push({
      id: q.id,
      title: q.title,
      subtitle: q.subtitle,
      body: q.description,
      href: `/questions/${q.slug}`,
      kind: "question",
    });
  }
  for (const e of hub.essays) {
    chapters.push({
      id: e.id,
      title: e.title,
      subtitle: e.subtitle,
      body: e.excerpt,
      href: `/essays/${e.slug}`,
      kind: "essay",
    });
  }
  for (const fn of hub.fieldNotes) {
    chapters.push({
      id: fn.id,
      title: fn.title ?? "Field observation",
      body: fn.body,
      href: `/field-notes/${fn.slug}`,
      kind: "field-note",
    });
  }
  for (const t of hub.topics) {
    if (t.href) {
      chapters.push({
        id: t.id,
        title: t.label,
        body: t.whisper,
        href: t.href,
        kind: "topic",
      });
    }
  }

  return chapters;
}

function buildWordLinks(themeId: string): WordOccurrence[] {
  const seeds = [
    "structure",
    "freedom",
    "constraint",
    "language",
    "time",
    "meaning",
    "question",
    "loop",
    "perception",
    "relationship",
    "identity",
    "silence",
    "threshold",
  ];
  const occurrences: WordOccurrence[] = [];
  const essays = getAllEssays().filter((e) => e.status === "published");
  const questions = getAllQuestions();
  const notes = getAllFieldNotes();

  for (const word of seeds) {
    const re = new RegExp(`\\b${word}\\b`, "i");
    for (const e of essays) {
      const text = `${e.title} ${e.excerpt}`;
      if (re.test(text)) {
        occurrences.push({
          word,
          href: `/essays/${e.slug}`,
          title: e.title,
          excerpt: e.excerpt.slice(0, 120),
        });
      }
    }
    for (const q of questions) {
      const text = `${q.title} ${q.description}`;
      if (re.test(text)) {
        occurrences.push({
          word,
          href: `/questions/${q.slug}`,
          title: q.title,
          excerpt: q.description.slice(0, 120),
        });
      }
    }
    for (const fn of notes) {
      if (re.test(fn.body)) {
        occurrences.push({
          word,
          href: `/field-notes/${fn.slug}`,
          title: fn.title ?? "Field observation",
          excerpt: fn.body.slice(0, 120),
        });
      }
    }
  }

  // Prioritize content in this theme
  return occurrences.filter((o) => {
    const essay = essays.find((e) => o.href.includes(e.slug));
    if (essay?.themeIds?.includes(themeId)) return true;
    const q = questions.find((qu) => o.href.includes(qu.slug));
    if (q?.themeIds?.includes(themeId)) return true;
    return themeId === "th-language" || occurrences.length < 40;
  });
}

export function getThemeHub(slug: string): ThemeHub | undefined {
  const theme = getThemeBySlug(slug);
  if (!theme) return undefined;

  const config = getRealmConfig(slug);
  if (!config) return undefined;

  const themeId = theme.id;
  const atlas = getAtlas();

  const essays = getAllEssays().filter(
    (e) =>
      e.status === "published" &&
      (e.themeIds?.includes(themeId) ||
        resolveMajorConcept(e.themeIds, e.topics) === themeId),
  );

  const books = getAllBooks().filter(
    (b) =>
      b.themeIds?.includes(themeId) ||
      atlas.getById(b.id)?.parentConcepts?.includes(themeId),
  );

  const questions = getAllQuestions().filter((q) =>
    q.themeIds?.includes(themeId),
  );

  const fieldNotes = getAllFieldNotes().filter((fn) =>
    fn.themeIds?.includes(themeId),
  );

  const quotations = getAllQuotations().filter((q) =>
    q.themeIds?.includes(themeId),
  );

  const subConcepts = getAllThemes().filter((t) => t.parentThemeId === themeId);

  const topics = enrichTopics(config.topics, themeId, config.slug);
  const whisper = NODE_WHISPERS[themeId] ?? config.whisper;

  const peerIds = getPeerRefs({ kind: "theme", id: themeId }).map((r) => r.id);

  const timeline = getSiteTimeline().filter((entry) => {
    const essay = essays.find((e) => entry.href?.includes(e.slug));
    if (essay) return true;
    const note = fieldNotes.find((fn) => entry.href?.includes(fn.slug));
    if (note) return true;
    const book = books.find((b) => entry.href?.includes(b.slug));
    if (book) return true;
    return entry.peerIds.some((id) => id === themeId);
  });

  const partial = {
    theme,
    config,
    whisper,
    subConcepts,
    essays,
    books,
    questions,
    fieldNotes,
    quotations,
    topics,
    timeline,
    peerIds,
  };

  const threads = buildThreads(partial);
  const { nodes, edges } = buildRealmLayout({
    slug: config.slug,
    themeId,
    themeTitle: theme.title,
    topics,
    threads,
  });
  const chapters = buildChapters({ ...partial, threads, network: nodes, networkEdges: edges, wordLinks: [] });
  const wordLinks = buildWordLinks(themeId);

  return {
    ...partial,
    threads,
    network: nodes,
    networkEdges: edges,
    chapters,
    wordLinks,
  };
}

export function getThemeHubBySlug(slug: string): ThemeHub | undefined {
  if (!isImmersiveRealm(slug)) return undefined;
  return getThemeHub(slug);
}

export { isImmersiveRealm };
