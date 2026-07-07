import type { AtlasEntry } from "../atlas/types";
import type { EssayIntake } from "./types";

const CONCEPT_SIGNALS: Record<string, string[]> = {
  "th-reality": [
    "real",
    "reality",
    "structure",
    "existence",
    "world",
    "philosophy",
    "interpretation",
  ],
  "th-relationship": [
    "relationship",
    "relation",
    "between",
    "together",
    "alone",
    "bond",
    "other",
  ],
  "th-meaning": [
    "meaning",
    "significance",
    "purpose",
    "matter",
    "coherence",
    "sense",
  ],
  "th-identity": [
    "identity",
    "self",
    "who",
    "person",
    "psychology",
    "character",
  ],
  "th-consciousness": [
    "consciousness",
    "awareness",
    "mind",
    "perception",
    "see",
    "seeing",
    "notice",
  ],
  "th-language": [
    "language",
    "word",
    "words",
    "say",
    "speak",
    "metaphor",
    "silence",
    "expression",
  ],
  "th-freedom": [
    "freedom",
    "free",
    "constraint",
    "choice",
    "judgment",
    "discernment",
    "limit",
  ],
  "th-embodiment": [
    "body",
    "embodiment",
    "heart",
    "felt",
    "physical",
    "somatic",
    "living",
  ],
  "th-information": [
    "information",
    "signal",
    "pattern",
    "data",
    "structure",
    "between minds",
  ],
  "th-time": [
    "time",
    "duration",
    "memory",
    "rhythm",
    "return",
    "loop",
    "years",
    "moment",
  ],
  "th-perception": [
    "perception",
    "see",
    "notice",
    "framework",
    "before we",
    "organize",
  ],
  "th-structure": [
    "structure",
    "framework",
    "hold",
    "form",
    "architecture",
    "beneath",
  ],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function scoreConcept(text: string, concept: AtlasEntry): number {
  const tokens = new Set(tokenize(text));
  let score = 0;

  for (const word of tokenize(concept.title)) {
    if (tokens.has(word)) score += 4;
  }
  for (const word of tokenize(concept.description)) {
    if (tokens.has(word)) score += 2;
  }
  for (const signal of CONCEPT_SIGNALS[concept.id] ?? []) {
    if (text.toLowerCase().includes(signal)) score += 3;
  }
  if (concept.id in tokens) score += 5;

  return score;
}

export interface ThemeInference {
  themes: string[];
  parentConcepts: string[];
  topics: string[];
  majorConceptId: string;
}

export function inferThemes(
  intake: EssayIntake,
  concepts: AtlasEntry[],
): ThemeInference {
  if (intake.overrides?.themes?.length) {
    const themes = [...new Set(intake.overrides.themes)];
    const parentConcepts =
      intake.overrides.parentConcepts ??
      themes.filter((id) => concepts.some((c) => c.id === id && c.type === "major-concept")).slice(0, 2);
    const topics =
      intake.overrides.topics ??
      themes
        .map((id) => concepts.find((c) => c.id === id)?.title)
        .filter((t): t is string => Boolean(t));
    const majorConceptId = resolveMajorFromThemes(themes);
    return { themes, parentConcepts, topics, majorConceptId };
  }

  const corpus = `${intake.title} ${intake.subtitle}`;
  const scored = concepts
    .filter((c) => c.type === "major-concept" || c.type === "concept")
    .map((concept) => ({ concept, score: scoreConcept(corpus, concept) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  const themes = scored.slice(0, 4).map((row) => row.concept.id);
  if (themes.length === 0) {
    themes.push("th-reality");
  }

  const parentConcepts = themes
    .filter((id) => concepts.some((c) => c.id === id && c.type === "major-concept"))
    .slice(0, 2);
  if (parentConcepts.length === 0) {
    parentConcepts.push(resolveMajorFromThemes(themes));
  }

  const topics = themes
    .map((id) => {
      const concept = concepts.find((c) => c.id === id);
      if (!concept) return null;
      if (concept.type === "major-concept") return concept.title;
      const parentId = (concept.meta as { parentConceptId?: string }).parentConceptId;
      const parent = parentId ? concepts.find((c) => c.id === parentId) : null;
      return parent?.title ?? concept.title;
    })
    .filter((t, i, arr): t is string => Boolean(t) && arr.indexOf(t) === i);

  return {
    themes,
    parentConcepts,
    topics,
    majorConceptId: resolveMajorFromThemes(themes),
  };
}

function resolveMajorFromThemes(themeIds: string[]): string {
  const subToMajor: Record<string, string> = {
    "th-perception": "th-consciousness",
    "th-structure": "th-reality",
  };
  for (const id of themeIds) {
    if (subToMajor[id]) return subToMajor[id];
  }
  for (const id of themeIds) {
    if (id.startsWith("th-")) return id;
  }
  return "th-reality";
}
