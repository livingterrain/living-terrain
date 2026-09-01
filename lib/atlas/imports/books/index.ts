import { resolveAtlasRoute } from "../../routes";
import type { AtlasConnection, AtlasEntry } from "../../types";
import {
  BIOLOGY_REVISED_EXPANDED,
  LIVING_TERRAIN_SERIES,
  type SeriesBookCatalogEntry,
} from "./series-catalog";

function conn(
  from: string,
  to: string,
  kind: AtlasConnection["kind"],
  source: AtlasConnection["source"] = "explicit",
  weight = 5,
  rationale?: string,
): AtlasConnection {
  return {
    id: `${from}→${to}:${kind}`,
    from,
    to,
    kind,
    source,
    weight,
    ...(rationale ? { rationale } : {}),
  };
}

function themeOverlap(a: string[], b: string[]): number {
  return a.filter((t) => b.includes(t)).length;
}

function buildChamberMeta(book: SeriesBookCatalogEntry) {
  const chamberRoute = resolveAtlasRoute("chamber", book.slug);
  return {
    bookId: book.id,
    subtitle: book.subtitle,
    introduction: book.description,
    whyExists: book.whyExists,
    statusLabel: "Published · inquiry continues",
    statusDescription:
      "The volume exists in print and digital. Living Terrain maps what continues — essays, questions, and Observatory themes that gather around this inquiry.",
    centralQuestion: book.centralQuestion,
    purchaseUrl: book.purchaseUrl,
    timeline: [
      {
        id: `${book.chamberId}-t1`,
        date: String(book.publishedYear),
        title: "Published",
        description: `${book.title} enters the Living Terrain Series.`,
      },
      {
        id: `${book.chamberId}-t2`,
        date: "Now",
        title: "The network grows",
        description:
          "Essays, questions, and field observations connect to this chamber as the map expands.",
      },
    ],
    whereToBegin: [
      {
        id: `${book.chamberId}-w1`,
        title: "Begin with the central question",
        description:
          "Follow the compass of this territory through connected questions and themes.",
        href: `${chamberRoute}#chamber-gather`,
      },
      {
        id: `${book.chamberId}-w2`,
        title: "Read related essays",
        description:
          "Scout reports from the edges — shorter writing that orbits this region.",
        href: `${chamberRoute}#chamber-essays`,
      },
      {
        id: `${book.chamberId}-w3`,
        title: "Return to the map",
        description: "Step back to the cartographic plate in The Atlas.",
        href: `/atlas/${book.slug}`,
      },
    ],
  };
}

function buildBookEntry(book: SeriesBookCatalogEntry): AtlasEntry {
  return {
    id: book.id,
    slug: book.slug,
    type: "book",
    title: book.title,
    description: book.description,
    themes: book.themes,
    parentConcepts: book.parentConcepts,
    connectedItems: [],
    publishedAt: `${book.publishedYear}-01-01`,
    route: resolveAtlasRoute("book", book.slug),
    status: "published",
    meta: {
      subtitle: book.subtitle,
      publishedYear: book.publishedYear,
      publisher: "Independently published",
      purchaseUrl: book.purchaseUrl,
      coverImage: `/images/maps/${book.slug}.jpg`,
      bookStatus: "published",
      chapters: [],
    },
  };
}

function buildChamberEntry(book: SeriesBookCatalogEntry): AtlasEntry {
  return {
    id: book.chamberId,
    slug: book.slug,
    type: "chamber",
    title: book.title,
    description: book.description,
    themes: book.themes,
    parentConcepts: book.parentConcepts,
    connectedItems: [],
    route: resolveAtlasRoute("chamber", book.slug),
    status: "published",
    meta: buildChamberMeta(book),
  };
}

function buildRevisedEditionBookEntry(): AtlasEntry {
  const book = BIOLOGY_REVISED_EXPANDED;
  return {
    id: book.id,
    slug: book.slug,
    type: "book",
    title: book.title,
    description: book.description,
    themes: book.themes,
    parentConcepts: book.parentConcepts,
    connectedItems: [],
    publishedAt: book.publishedAt,
    route: resolveAtlasRoute("book", book.slug),
    status: "published",
    meta: {
      ...(book.subtitle ? { subtitle: book.subtitle } : {}),
      publishedYear: book.publishedYear,
      publisher: "Independently published",
      purchaseUrl: book.purchaseUrl,
      coverImage: `/images/maps/${book.slug}.jpg`,
      bookStatus: "published",
      chapters: [],
    },
  };
}

export const IMPORTED_BOOK_ENTRIES: AtlasEntry[] = [
  ...LIVING_TERRAIN_SERIES.flatMap((book) => [
    buildBookEntry(book),
    buildChamberEntry(book),
  ]),
  buildRevisedEditionBookEntry(),
];

/** Theme sets for auto-linking questions and field notes */
const QUESTION_THEMES: { id: string; themes: string[] }[] = [
  { id: "q1", themes: ["th-perception", "th-consciousness"] },
  { id: "q2", themes: ["th-time"] },
  { id: "q3", themes: ["th-reality"] },
  { id: "q4", themes: ["th-language"] },
];

const FIELD_NOTE_THEMES: { id: string; themes: string[] }[] = [
  { id: "fn1", themes: ["th-perception", "th-consciousness"] },
  { id: "fn2", themes: ["th-time"] },
  { id: "fn3", themes: ["th-reality"] },
  { id: "fn4", themes: ["th-perception", "th-consciousness"] },
  { id: "fn5", themes: ["th-reality"] },
];

interface FlagshipVolume {
  id: string;
  chamberId: string;
  themes: string[];
}

const FLAGSHIP_VOLUMES: FlagshipVolume[] = [
  {
    id: "b1",
    chamberId: "p1",
    themes: ["th-reality", "th-structure", "th-consciousness", "th-meaning"],
  },
  ...LIVING_TERRAIN_SERIES.map((b) => ({
    id: b.id,
    chamberId: b.chamberId,
    themes: b.themes,
  })),
];

function linkByThemeOverlap(
  connections: AtlasConnection[],
  volume: FlagshipVolume,
  target: { id: string; themes: string[] },
  kind: AtlasConnection["kind"],
  minOverlap: number,
  rationale: (overlap: number) => string,
) {
  const overlap = themeOverlap(target.themes, volume.themes);
  if (overlap < minOverlap) return;
  connections.push(
    conn(
      volume.chamberId,
      target.id,
      kind,
      "inferred",
      5 + overlap,
      rationale(overlap),
    ),
  );
}

/**
 * LEGACY / NON-CANONICAL book graph edges.
 * Explicit chamber↔volume links are mixed with inferred FLAGSHIP overlap
 * (questions, field notes, neighboring volumes). Must never populate lib/canonical.
 */
export const IMPORTED_BOOK_CONNECTIONS: AtlasConnection[] = (() => {
  const c: AtlasConnection[] = [];

  for (const volume of FLAGSHIP_VOLUMES) {
    c.push(conn(volume.chamberId, volume.id, "volume", "explicit", 9));

    for (const themeId of volume.themes) {
      c.push(conn(volume.chamberId, themeId, "theme", "explicit", 8));
    }

    // Essay↔book links are curated explicitly below — do not dump by theme overlap.

    for (const question of QUESTION_THEMES) {
      linkByThemeOverlap(
        c,
        volume,
        question,
        "pathway",
        1,
        () => "a question that pathways through this chamber's themes.",
      );
      if (themeOverlap(question.themes, volume.themes) >= 1) {
        c.push(
          conn(
            volume.id,
            question.id,
            "pathway",
            "inferred",
            6,
            "lives inside the published volume's inquiry.",
          ),
        );
      }
    }

    for (const note of FIELD_NOTE_THEMES) {
      linkByThemeOverlap(
        c,
        volume,
        note,
        "observation",
        1,
        () => "a field observation connected through shared themes.",
      );
    }

    for (const other of FLAGSHIP_VOLUMES) {
      if (other.id === volume.id) continue;
      if (themeOverlap(volume.themes, other.themes) >= 2) {
        c.push(
          conn(
            volume.chamberId,
            other.id,
            "volume",
            "inferred",
            5,
            "a neighboring volume in the Living Terrain Series.",
          ),
        );
      }
    }
  }

  /**
   * Curated essay ↔ chamber / book links only.
   * Sources: chamber editorial references + Atlas archive domain co-location.
   * Do not invent — omit when no repository evidence exists.
   */
  const EXPLICIT_ESSAY_LINKS: ReadonlyArray<{
    essayId: string;
    bookId: string;
    chamberId: string;
    rationale: string;
  }> = [
    {
      essayId: "e11",
      bookId: "b2",
      chamberId: "p2",
      rationale:
        "named in The Biology of Becoming chamber as a connected inquiry.",
    },
    {
      essayId: "e1",
      bookId: "b2",
      chamberId: "p2",
      rationale:
        "named in The Biology of Becoming chamber as a related inquiry.",
    },
    {
      essayId: "e11",
      bookId: "b3",
      chamberId: "p3",
      rationale: "named in The Second Birth chamber editorial references.",
    },
    {
      essayId: "e3",
      bookId: "b4",
      chamberId: "p4",
      rationale:
        "paired with Below Criticality in the Atlas systems finding aid.",
    },
    {
      essayId: "e1",
      bookId: "b5",
      chamberId: "p5",
      rationale:
        "paired with Embodied Physics in the Atlas energy finding aid.",
    },
    {
      essayId: "e9",
      bookId: "b6",
      chamberId: "p6",
      rationale:
        "paired with A Field Guide to the Experience in the Atlas consciousness finding aid.",
    },
    {
      essayId: "e3",
      bookId: "b7",
      chamberId: "p7",
      rationale:
        "paired with Feedback Is God in the Atlas systems finding aid.",
    },
  ];

  for (const link of EXPLICIT_ESSAY_LINKS) {
    c.push(
      conn(
        link.essayId,
        link.bookId,
        "volume",
        "explicit",
        8,
        link.rationale,
      ),
    );
    c.push(
      conn(
        link.essayId,
        link.chamberId,
        "chamber",
        "explicit",
        8,
        link.rationale,
      ),
    );
  }

  // Revised Biology edition → existing Biology chamber (no duplicate territory prose)
  const revised = BIOLOGY_REVISED_EXPANDED;
  c.push(
    conn(
      revised.chamberId,
      revised.id,
      "volume",
      "explicit",
      9,
      "the current Revised & Expanded edition of this investigation.",
    ),
  );
  for (const themeId of revised.themes) {
    c.push(conn(revised.id, themeId, "theme", "explicit", 8));
  }

  return c;
})();
