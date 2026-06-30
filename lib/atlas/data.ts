import type { AtlasConnection, AtlasData } from "./types";
import { resolveAtlasRoute } from "./routes";

/**
 * Canonical Living Terrain Atlas — single source of truth.
 * Add entries and connections here as the terrain grows.
 */
export const ATLAS_DATA: AtlasData = {
  version: 1,
  site: {
    name: "Living Terrain",
    title: "Living Terrain",
    description:
      "A contemplative space between museum, library, field notebook, and reading room — exploring the questions beneath how we see the world.",
    url: "https://livingterrain.com",
    author: "Chelsea M. Thacker",
    mediumUrl: "https://medium.com/@livingterrain",
    amazonBookUrl:
      "https://www.amazon.com/Structure-Beneath-Reality-Chelsea-Thacker/dp/B0H3ZFPLDN/",
  },

  entries: [
    // ── Major concepts — continents of Living Terrain ──
    {
      id: "th-reality",
      slug: "reality",
      type: "major-concept",
      title: "Reality",
      description: "What is real before interpretation",
      themes: ["th-reality"],
      parentConcepts: [],
      connectedItems: [],
      route: resolveAtlasRoute("major-concept", "reality"),
      status: "published",
      meta: { isContinent: true, order: 1 },
    },
    {
      id: "th-relationship",
      slug: "relationship",
      type: "major-concept",
      title: "Relationship",
      description: "Nothing exists alone",
      themes: ["th-relationship"],
      parentConcepts: [],
      connectedItems: [],
      route: resolveAtlasRoute("major-concept", "relationship"),
      status: "published",
      meta: { isContinent: true, order: 2 },
    },
    {
      id: "th-meaning",
      slug: "meaning",
      type: "major-concept",
      title: "Meaning",
      description: "How significance accumulates",
      themes: ["th-meaning"],
      parentConcepts: [],
      connectedItems: [],
      route: resolveAtlasRoute("major-concept", "meaning"),
      status: "published",
      meta: { isContinent: true, order: 3 },
    },
    {
      id: "th-identity",
      slug: "identity",
      type: "major-concept",
      title: "Identity",
      description: "The self as ongoing inquiry",
      themes: ["th-identity"],
      parentConcepts: [],
      connectedItems: [],
      route: resolveAtlasRoute("major-concept", "identity"),
      status: "published",
      meta: { isContinent: true, order: 4 },
    },
    {
      id: "th-consciousness",
      slug: "consciousness",
      type: "major-concept",
      title: "Consciousness",
      description: "The texture of awareness itself",
      themes: ["th-consciousness"],
      parentConcepts: [],
      connectedItems: [],
      route: resolveAtlasRoute("major-concept", "consciousness"),
      status: "published",
      meta: { isContinent: true, order: 5 },
    },
    {
      id: "th-language",
      slug: "language",
      type: "major-concept",
      title: "Language",
      description: "What can be carried in words — and what cannot",
      themes: ["th-language"],
      parentConcepts: [],
      connectedItems: [],
      route: resolveAtlasRoute("major-concept", "language"),
      status: "published",
      meta: { isContinent: true, order: 6 },
    },
    {
      id: "th-freedom",
      slug: "freedom",
      type: "major-concept",
      title: "Freedom",
      description: "Constraint, choice, and the shape of a life",
      themes: ["th-freedom"],
      parentConcepts: [],
      connectedItems: [],
      route: resolveAtlasRoute("major-concept", "freedom"),
      status: "published",
      meta: { isContinent: true, order: 7 },
    },
    {
      id: "th-embodiment",
      slug: "embodiment",
      type: "major-concept",
      title: "Embodiment",
      description: "The lived body as participant in the real",
      themes: ["th-embodiment"],
      parentConcepts: [],
      connectedItems: [],
      route: resolveAtlasRoute("major-concept", "embodiment"),
      status: "published",
      meta: { isContinent: true, order: 8 },
    },
    {
      id: "th-information",
      slug: "information",
      type: "major-concept",
      title: "Information",
      description: "Signal, structure, and what travels between minds",
      themes: ["th-information"],
      parentConcepts: [],
      connectedItems: [],
      route: resolveAtlasRoute("major-concept", "information"),
      status: "published",
      meta: { isContinent: true, order: 9 },
    },
    {
      id: "th-time",
      slug: "time",
      type: "major-concept",
      title: "Time",
      description: "Duration as lived, not merely measured",
      themes: ["th-time"],
      parentConcepts: [],
      connectedItems: [],
      route: resolveAtlasRoute("major-concept", "time"),
      status: "published",
      meta: { isContinent: true, order: 10 },
    },

    // ── Sub-concepts — finer threads within continents ──
    {
      id: "th-perception",
      slug: "perception",
      type: "concept",
      title: "Perception",
      description: "What organizes seeing before interpretation",
      themes: ["th-perception", "th-consciousness"],
      parentConcepts: ["th-consciousness"],
      connectedItems: [],
      route: resolveAtlasRoute("concept", "perception"),
      status: "published",
      meta: { parentConceptId: "th-consciousness" },
    },
    {
      id: "th-structure",
      slug: "structure",
      type: "concept",
      title: "Structure",
      description: "What holds form while everything changes",
      themes: ["th-structure", "th-reality"],
      parentConcepts: ["th-reality"],
      connectedItems: [],
      route: resolveAtlasRoute("concept", "structure"),
      status: "published",
      meta: { parentConceptId: "th-reality" },
    },

    // ── Chamber — central inquiry hub ──
    {
      id: "p1",
      slug: "the-structure-beneath-reality",
      type: "chamber",
      title: "The Structure Beneath Reality",
      description:
        "Reality appears stable — yet everything within it changes. This book asks what hidden structures allow that stability: the architectures of perception, embodiment, relationship, meaning, and the real that we rarely examine because they work too quietly to notice.",
      themes: [],
      parentConcepts: [],
      connectedItems: [],
      route: resolveAtlasRoute("chamber", "the-structure-beneath-reality"),
      status: "published",
      meta: {
        bookId: "b1",
        subtitle: "An inquiry into what holds the world together",
        introduction:
          "Reality appears stable — yet everything within it changes. This book asks what hidden structures allow that stability: the architectures of perception, embodiment, relationship, meaning, and the real that we rarely examine because they work too quietly to notice.",
        whyExists:
          "Living Terrain began with a question that would not leave: what must already be in place for anything to appear as real? The Structure Beneath Reality is the first full statement of that inquiry — a book, not a conclusion. This website is the ongoing cartography around it: essays on Medium, questions that branch, field notes that record what the book could not hold. The investigation did not end at publication. It opened.",
        statusLabel: "Published · inquiry continues",
        statusDescription:
          "The volume exists in print and digital. Living Terrain maps what continues — the essays, questions, and observations that extend and complicate the work.",
        centralQuestion:
          "What are the hidden structures that allow reality to remain itself while everything within it changes?",
        purchaseUrl:
          "https://www.amazon.com/Structure-Beneath-Reality-Chelsea-Thacker/dp/B0H3ZFPLDN/",
        timeline: [
          {
            id: "t1",
            date: "Origins",
            title: "The question arrives",
            description:
              "Private notes, restlessness — the sense that something organizing experience had been overlooked.",
          },
          {
            id: "t2",
            date: "2024",
            title: "The book takes form",
            description:
              "The Structure Beneath Reality is written and published — a first full statement of the inquiry.",
          },
          {
            id: "t3",
            date: "2025",
            title: "Living Terrain opens",
            description:
              "The investigation moves into a public space — a cartography of questions, essays, and field observations.",
          },
          {
            id: "t4",
            date: "Now",
            title: "The network grows",
            description:
              "Essays on Medium connect to the book. Questions branch. The archive is still being built.",
          },
        ],
        whereToBegin: [
          {
            id: "w1",
            title: "Begin with the central question",
            description:
              "What lies beneath perception? Follow this thread through connected questions, notes, and essays.",
            href: "/questions/what-lies-beneath-perception",
          },
          {
            id: "w2",
            title: "Read essays on Medium",
            description:
              "Shorter writing that orbits the book — published on Medium, mapped here as the inquiry extends.",
            href: "https://medium.com/@livingterrain",
          },
          {
            id: "w3",
            title: "Enter with the published volume",
            description: "The full argument lives in the book. Read at your own pace.",
            href: "https://www.amazon.com/Structure-Beneath-Reality-Chelsea-Thacker/dp/B0H3ZFPLDN/",
          },
        ],
      },
    },

    // ── Books ──
    {
      id: "b1",
      slug: "the-structure-beneath-reality",
      type: "book",
      title: "The Structure Beneath Reality",
      description:
        "A sustained exploration of the invisible architectures — conceptual, perceptual, and cultural — that shape how we encounter what is real.",
      themes: [],
      parentConcepts: ["th-reality", "th-structure"],
      connectedItems: [],
      publishedAt: "2024-01-01",
      route: resolveAtlasRoute("book", "the-structure-beneath-reality"),
      status: "published",
      meta: {
        subtitle: "An inquiry into what holds the world together",
        publishedYear: 2024,
        publisher: "Independently published",
        purchaseUrl:
          "https://www.amazon.com/Structure-Beneath-Reality-Chelsea-Thacker/dp/B0H3ZFPLDN/",
        bookStatus: "published",
        chapters: [],
      },
    },

    // ── Essays ──
    {
      id: "e1",
      slug: "constraint-is-not-the-opposite-of-freedom",
      type: "essay",
      title: "Constraint Is Not the Opposite of Freedom",
      description:
        "The heartbeat does not emerge from complete freedom — it emerges from structure. Maybe constraints are not what stand between us and life. Maybe they are what make freedom possible.",
      themes: ["th-freedom", "th-structure", "th-embodiment", "th-consciousness"],
      parentConcepts: ["th-freedom", "th-embodiment"],
      connectedItems: [],
      publishedAt: "2026-06-24",
      route: resolveAtlasRoute("essay", "constraint-is-not-the-opposite-of-freedom"),
      status: "published",
      meta: {
        subtitle:
          "What the heart taught me about judgment, discernment, and the structure of life",
        excerpt:
          "The heartbeat does not emerge from complete freedom — it emerges from structure. Maybe constraints are not what stand between us and life. Maybe they are what make freedom possible.",
        topics: ["Consciousness", "Philosophy", "Structure", "Embodiment", "Freedom"],
        externalUrl:
          "https://medium.com/illumination/constraint-is-not-the-opposite-of-freedom-5e0d1b6eac28",
      },
    },
    {
      id: "e2",
      slug: "you-have-to-go-far-enough-to-make-a-loop",
      type: "essay",
      title: "You Have to Go Far Enough to Make a Loop",
      description:
        "I chased the big questions hoping to find answers that would quiet them. Instead I made a loop — returning to the same mysteries, realizing everyone has been answering them all along.",
      themes: ["th-consciousness", "th-meaning", "th-time"],
      parentConcepts: ["th-consciousness", "th-meaning"],
      connectedItems: [],
      publishedAt: "2026-06-23",
      route: resolveAtlasRoute("essay", "you-have-to-go-far-enough-to-make-a-loop"),
      status: "published",
      meta: {
        subtitle:
          "I used to think something was wrong with me for asking existential questions. Then I realized everyone was asking them — just in different languages.",
        excerpt:
          "I chased the big questions hoping to find answers that would quiet them. Instead I made a loop — returning to the same mysteries, realizing everyone has been answering them all along.",
        topics: ["Consciousness", "Meaning", "Psychology", "Existence"],
        externalUrl:
          "https://medium.com/illumination/you-have-to-go-far-enough-to-make-a-loop-f21aec4f8d4f",
      },
    },

    // ── Questions ──
    {
      id: "q1",
      slug: "what-lies-beneath-perception",
      type: "question",
      title: "What lies beneath perception?",
      description:
        "Before we interpret the world, something has already organized it. This question asks what frameworks shape seeing itself.",
      themes: ["th-perception", "th-consciousness"],
      parentConcepts: ["th-consciousness"],
      connectedItems: [],
      route: resolveAtlasRoute("question", "what-lies-beneath-perception"),
      status: "published",
      meta: {
        subtitle: "On the structures we inherit before we notice them",
        featured: true,
        order: 1,
      },
    },
    {
      id: "q2",
      slug: "how-do-we-inhabit-time",
      type: "question",
      title: "How do we inhabit time?",
      description:
        "Time is not merely measured but lived. These writings examine how attention, memory, and narrative give time its felt shape.",
      themes: ["th-time"],
      parentConcepts: ["th-time"],
      connectedItems: [],
      route: resolveAtlasRoute("question", "how-do-we-inhabit-time"),
      status: "published",
      meta: {
        subtitle: "Memory, rhythm, and the texture of duration",
        featured: true,
        order: 2,
      },
    },
    {
      id: "q3",
      slug: "what-is-a-place",
      type: "question",
      title: "What is a place?",
      description:
        "A place is more than coordinates. It is accumulated attention, story, and the slow work of return.",
      themes: ["th-reality"],
      parentConcepts: ["th-reality"],
      connectedItems: [],
      route: resolveAtlasRoute("question", "what-is-a-place"),
      status: "published",
      meta: {
        subtitle: "Between geography and belonging",
        featured: true,
        order: 3,
      },
    },
    {
      id: "q4",
      slug: "can-language-hold-the-unsayable",
      type: "question",
      title: "Can language hold the unsayable?",
      description:
        "Some experiences resist articulation. This question explores what language can carry — and what it must leave in reserve.",
      themes: ["th-language"],
      parentConcepts: ["th-language"],
      connectedItems: [],
      route: resolveAtlasRoute("question", "can-language-hold-the-unsayable"),
      status: "published",
      meta: {
        subtitle: "On silence, metaphor, and the edge of expression",
        featured: false,
        order: 4,
      },
    },

    // ── Field notes ──
    {
      id: "fn1",
      slug: "light-on-water",
      type: "field-note",
      title: "Light on Water",
      description: `The creek catches afternoon sun in fragments. Each fragment is complete — a small world — and gone before you can name it.

Perception as mosaic, not photograph.`,
      themes: ["th-perception"],
      parentConcepts: ["th-consciousness"],
      connectedItems: [],
      publishedAt: "2025-06-14",
      route: resolveAtlasRoute("field-note", "light-on-water"),
      status: "published",
      meta: {
        body: `The creek catches afternoon sun in fragments. Each fragment is complete — a small world — and gone before you can name it.

Perception as mosaic, not photograph.`,
        location: "North Carolina",
        displayTitle: "Light on Water",
      },
    },
    {
      id: "fn2",
      slug: "waiting-room",
      type: "field-note",
      title: "Waiting Room",
      description: `Twenty minutes in a waiting room. No book. No phone. Just the slow rearrangement of impatience into something like patience.

Time as alchemy.`,
      themes: ["th-time"],
      parentConcepts: ["th-time"],
      connectedItems: [],
      publishedAt: "2025-05-30",
      route: resolveAtlasRoute("field-note", "waiting-room"),
      status: "published",
      meta: {
        body: `Twenty minutes in a waiting room. No book. No phone. Just the slow rearrangement of impatience into something like patience.

Time as alchemy.`,
        displayTitle: "Waiting Room",
      },
    },
    {
      id: "fn3",
      slug: "threshold",
      type: "field-note",
      title: "Threshold",
      description: `Doorways matter. The pause on the threshold — neither inside nor out — is its own geography.`,
      themes: ["th-reality"],
      parentConcepts: ["th-reality"],
      connectedItems: [],
      publishedAt: "2025-05-12",
      route: resolveAtlasRoute("field-note", "threshold"),
      status: "published",
      meta: {
        body: `Doorways matter. The pause on the threshold — neither inside nor out — is its own geography.`,
        location: "Vermont",
        displayTitle: "Threshold",
      },
    },
    {
      id: "fn4",
      slug: "after-reading",
      type: "field-note",
      title: "After Reading",
      description: `Finished a chapter. Closed the book. The room looked slightly different — as if the words had adjusted the light.`,
      themes: ["th-perception"],
      parentConcepts: ["th-consciousness"],
      connectedItems: [],
      publishedAt: "2025-04-28",
      route: resolveAtlasRoute("field-note", "after-reading"),
      status: "published",
      meta: {
        body: `Finished a chapter. Closed the book. The room looked slightly different — as if the words had adjusted the light.`,
        displayTitle: "After Reading",
      },
    },
    {
      id: "fn5",
      slug: "familiar-path",
      type: "field-note",
      title: "Familiar Path",
      description: `Walked the same path for the hundredth time. Noticed, for the first time, a stone that must have been there always.`,
      themes: ["th-reality"],
      parentConcepts: ["th-reality"],
      connectedItems: [],
      publishedAt: "2025-04-15",
      route: resolveAtlasRoute("field-note", "familiar-path"),
      status: "published",
      meta: {
        body: `Walked the same path for the hundredth time. Noticed, for the first time, a stone that must have been there always.`,
        location: "Local woods",
        displayTitle: "Familiar Path",
      },
    },

    // ── Quotations ──
    {
      id: "qt1",
      slug: "what-we-do-not-notice",
      type: "quotation",
      title: "What we do not notice",
      description:
        "We do not see what we do not notice — and we do not notice what has already organized our seeing.",
      themes: ["th-perception", "th-structure"],
      parentConcepts: ["th-consciousness", "th-reality"],
      connectedItems: [],
      route: resolveAtlasRoute("quotation", "what-we-do-not-notice"),
      status: "published",
      meta: {
        text: "We do not see what we do not notice — and we do not notice what has already organized our seeing.",
        attribution: "Living Terrain",
      },
    },
  ],

  connections: buildConnections(),
};

function conn(
  from: string,
  to: string,
  kind: AtlasConnection["kind"],
  source: AtlasConnection["source"] = "explicit",
  weight = 5,
  rationale?: string,
  quote?: string,
): AtlasConnection {
  return {
    id: `${from}→${to}:${kind}`,
    from,
    to,
    kind,
    source,
    weight,
    ...(rationale ? { rationale } : {}),
    ...(quote ? { quote } : {}),
  };
}

function buildConnections(): AtlasConnection[] {
  const c: AtlasConnection[] = [];

  // Concept hierarchy
  c.push(conn("th-perception", "th-consciousness", "parent-concept", "explicit", 8));
  c.push(conn("th-structure", "th-reality", "parent-concept", "explicit", 8));

  // Chamber ↔ major concepts (architecture spine)
  for (const conceptId of [
    "th-reality",
    "th-relationship",
    "th-meaning",
    "th-identity",
    "th-consciousness",
    "th-language",
    "th-freedom",
    "th-embodiment",
    "th-information",
    "th-time",
  ]) {
    c.push(conn("p1", conceptId, "theme", "explicit", 10));
  }

  // Chamber links
  c.push(conn("p1", "b1", "volume", "explicit", 9));
  c.push(conn("p1", "q1", "pathway", "inferred", 8));
  c.push(conn("p1", "q4", "pathway", "inferred", 8));
  c.push(conn("p1", "fn1", "observation", "inferred", 6));
  c.push(conn("p1", "fn4", "observation", "inferred", 6));

  // Essays
  c.push(conn("e1", "q1", "pathway", "inferred", 8, "asks the same question from a different angle."));
  c.push(conn("e1", "q4", "pathway", "inferred", 8, "neighbors this inquiry through language and what words can carry."));
  c.push(conn("e1", "b1", "volume", "inferred", 7, "extends the argument first made in the published volume."));
  c.push(conn("e1", "p1", "chamber", "inferred", 9, "returns to the chamber where this inquiry began."));
  c.push(conn("e1", "e2", "child", "explicit", 9, "opens further into how meaning is made, not merely found."));
  c.push(conn("e1", "e2", "echo", "inferred", 6, "echoes the same pulse from another direction."));
  c.push(
    conn(
      "e1",
      "th-freedom",
      "theme",
      "explicit",
      9,
      "connects because both investigate the role of constraint.",
    ),
  );
  c.push(
    conn(
      "e1",
      "th-structure",
      "theme",
      "explicit",
      7,
      "asks what must already be in place for freedom to appear at all.",
    ),
  );
  c.push(
    conn(
      "e1",
      "th-embodiment",
      "theme",
      "explicit",
      7,
      "explores how the body stabilizes identity.",
    ),
  );
  c.push(conn("e1", "qt1", "quotation", "explicit", 6, "carries a voice that sharpens the argument."));

  c.push(conn("e2", "q1", "pathway", "inferred", 8, "returns to the question beneath perception."));
  c.push(conn("e2", "q2", "pathway", "inferred", 8, "continues this question across years."));
  c.push(conn("e2", "b1", "volume", "inferred", 7, "belongs to the same volume of inquiry."));
  c.push(conn("e2", "p1", "chamber", "inferred", 9, "deepens the chamber's central question."));
  c.push(conn("e2", "e1", "parent", "explicit", 9, "grows from the earlier essay on constraint and freedom."));
  c.push(conn("e2", "e1", "echo", "inferred", 6, "echoes the same inquiry from a different register."));
  c.push(
    conn(
      "e2",
      "th-consciousness",
      "theme",
      "explicit",
      7,
      "asks what awareness must already be doing for meaning to land.",
    ),
  );
  c.push(
    conn(
      "e2",
      "th-meaning",
      "theme",
      "explicit",
      7,
      "extends into how significance accumulates rather than arrives whole.",
    ),
  );
  c.push(
    conn(
      "e2",
      "th-time",
      "theme",
      "explicit",
      7,
      "continues this question across years.",
    ),
  );

  // Topic → theme inference
  for (const [essayId, themeId] of [
    ["e1", "th-consciousness"],
    ["e2", "th-consciousness"],
  ] as const) {
    c.push(conn(essayId, themeId, "theme", "inferred", 4));
  }

  // Questions
  c.push(conn("q1", "e1", "thread", "explicit", 7, "threads through the essay on constraint and freedom."));
  c.push(conn("q1", "e2", "thread", "explicit", 7, "threads through how meaning is made, not merely found."));
  c.push(conn("q1", "b1", "volume", "explicit", 7, "lives inside the published volume."));
  c.push(conn("q1", "fn1", "observation", "explicit", 6, "grounded in a field note from the walk."));
  c.push(conn("q1", "fn4", "observation", "explicit", 6, "grounded in what the body noticed before words arrived."));
  c.push(conn("q1", "qt1", "quotation", "explicit", 6, "carries a voice that sharpens the question."));
  c.push(
    conn(
      "q1",
      "th-perception",
      "theme",
      "explicit",
      7,
      "asks what organizes seeing before interpretation.",
    ),
  );

  c.push(conn("q2", "e2", "thread", "explicit", 7, "threads through the essay on meaning and time."));
  c.push(conn("q2", "fn2", "observation", "explicit", 6, "grounded in a note from the field."));
  c.push(
    conn(
      "q2",
      "th-time",
      "theme",
      "explicit",
      7,
      "continues this question across years.",
    ),
  );

  c.push(conn("q3", "fn3", "observation", "explicit", 6, "grounded in a field observation."));
  c.push(conn("q3", "fn5", "observation", "explicit", 6, "grounded in what was noticed before it could be named."));
  c.push(
    conn(
      "q3",
      "th-reality",
      "theme",
      "explicit",
      7,
      "asks what is real before interpretation.",
    ),
  );

  c.push(conn("q4", "e1", "thread", "explicit", 7, "threads through the essay on constraint."));
  c.push(conn("q4", "b1", "volume", "explicit", 7, "belongs to the same volume of inquiry."));
  c.push(
    conn(
      "q4",
      "th-language",
      "theme",
      "explicit",
      7,
      "asks what can be carried in words — and what cannot.",
    ),
  );

  // Books
  c.push(conn("b1", "q1", "pathway", "inferred", 7));
  c.push(conn("b1", "q4", "pathway", "inferred", 7));

  // Field notes
  c.push(conn("fn1", "q1", "pathway", "inferred", 7));
  c.push(conn("fn2", "q2", "pathway", "inferred", 7));
  c.push(conn("fn3", "q3", "pathway", "inferred", 7));
  c.push(conn("fn4", "q1", "pathway", "inferred", 7));
  c.push(conn("fn5", "q3", "pathway", "inferred", 7));

  // Quotations
  c.push(conn("qt1", "q1", "pathway", "inferred", 6));
  c.push(conn("qt1", "th-perception", "theme", "inferred", 5));
  c.push(conn("qt1", "th-structure", "theme", "inferred", 5));
  c.push(conn("qt1", "e1", "echo", "inferred", 6));

  // Architecture spine — contemplative threads between major concepts
  c.push(
    conn(
      "th-freedom",
      "th-relationship",
      "thread",
      "inferred",
      7,
      "connects because both investigate the role of constraint.",
    ),
  );
  c.push(
    conn(
      "th-relationship",
      "th-identity",
      "thread",
      "inferred",
      7,
      "explores how the body stabilizes identity.",
    ),
  );
  c.push(
    conn(
      "th-identity",
      "th-embodiment",
      "thread",
      "inferred",
      7,
      "explores how the body stabilizes identity.",
    ),
  );
  c.push(
    conn(
      "th-embodiment",
      "th-meaning",
      "thread",
      "inferred",
      7,
      "asks how significance accumulates in a lived body.",
    ),
  );
  c.push(
    conn(
      "th-meaning",
      "th-reality",
      "thread",
      "inferred",
      6,
      "returns to what is real before interpretation.",
    ),
  );

  return c;
}
