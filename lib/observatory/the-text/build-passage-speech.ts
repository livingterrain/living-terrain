/**
 * Passage speech plan — visitor-facing readable prose derived from Passage data.
 * Prefer this over scraping the DOM.
 */

import type { Passage, PassageStratum } from "./types";
import { normalizePassageSpeechText } from "./passage-speech";

export type PassageSpeechSectionId =
  | "text"
  | "language"
  | "translation"
  | "context"
  | "interpretation"
  | "terrain"
  | "open";

export const PASSAGE_SPEECH_SECTION_ORDER: readonly PassageSpeechSectionId[] = [
  "text",
  "language",
  "translation",
  "context",
  "interpretation",
  "terrain",
  "open",
] as const;

export type PassageSpeechSection = {
  id: PassageSpeechSectionId;
  /** Visitor-facing section title for labels. */
  title: string;
  /** Concatenated prose for this section only. */
  text: string;
};

export type PassageTranslationSpeech = {
  id: string;
  label: string;
  /** Full attribution for accessible labels when available. */
  attribution: string;
  text: string;
};

export type PassageSpeechPlan = {
  passageId: string;
  reference: string;
  /** Primary English shown at top of page. */
  fullPassage: {
    label: string;
    text: string;
  };
  sections: PassageSpeechSection[];
  translations: PassageTranslationSpeech[];
};

const SECTION_TITLE: Record<PassageSpeechSectionId, string> = {
  text: "Text",
  language: "Language",
  translation: "Translation choices",
  context: "Context",
  interpretation: "Interpretation",
  terrain: "Follow the terrain",
  open: "What remains open",
};

/** Stratum → speech section (for UI wiring). */
export function speechSectionForStratum(
  stratum: PassageStratum | string,
): PassageSpeechSectionId | null {
  switch (stratum) {
    case "text":
      return "text";
    case "language":
      return "language";
    case "translation":
      return "translation";
    case "context":
      return "context";
    case "interpretation":
      return "interpretation";
    case "terrain":
      return "terrain";
    case "open":
      return "open";
    default:
      return null;
  }
}

function joinProse(parts: Array<string | undefined | null>): string {
  return normalizePassageSpeechText(
    parts
      .map((p) => (p ?? "").trim())
      .filter(Boolean)
      .join(". "),
  );
}

/**
 * Build reusable speech content for a passage.
 * Intentionally excludes: Why this? provenance, source IDs, stratum eyebrows,
 * confidence badges, How this works, Hebrew surfaces, decorative UI copy.
 */
export function buildPassageSpeechPlan(passage: Passage): PassageSpeechPlan {
  const visibleTranslations = passage.translations.filter(
    (t) => t.visibleInCompare !== false,
  );

  const textSection = joinProse([
    passage.reference,
    passage.englishPrimary.text,
  ]);

  const languageSection = joinProse([
    ...passage.sections.languageNotes.map((n) => n.text),
    passage.semanticRangeNote,
  ]);

  const translationSection = joinProse([
    passage.translationFraming,
    ...visibleTranslations.flatMap((t) => [
      `${t.label}. ${t.text}`,
      ...(t.differenceNotes ?? []).map((n) => `${n.phrase}. ${n.note}`),
    ]),
    passage.translationAside,
  ]);

  const contextSection = joinProse(
    passage.sections.context.map((b) => `${b.title}. ${b.body}`),
  );

  const interpretationSection = joinProse([
    "Readings below are attributed voices within traditions — not linguistic facts, and not a single consensus for each tradition.",
    ...passage.sections.interpretation.flatMap((group) =>
      group.readings.map((r) => {
        const head = [r.interpreter, r.work].filter(Boolean).join(" — ");
        return head ? `${head}. ${r.body}` : r.body;
      }),
    ),
  ]);

  const terrainSection = joinProse([
    "The textual evidence ends here. What follows are relationships opened by the passage — not equivalences, not destinations that exist yet, and not linguistic conclusions.",
    ...passage.sections.terrain.map((t) =>
      t.note ? `${t.label}. ${t.note}` : t.label,
    ),
  ]);

  const openSection = joinProse(
    passage.sections.remainsOpen.map((q) => `${q.question}. ${q.whyOpen}`),
  );

  const sections: PassageSpeechSection[] = (
    [
      ["text", textSection],
      ["language", languageSection],
      ["translation", translationSection],
      ["context", contextSection],
      ["interpretation", interpretationSection],
      ["terrain", terrainSection],
      ["open", openSection],
    ] as const
  )
    .map(([id, text]) => ({
      id,
      title: SECTION_TITLE[id],
      text,
    }))
    .filter((s) => s.text.length > 0);

  return {
    passageId: passage.id,
    reference: passage.reference,
    fullPassage: {
      label: passage.englishPrimary.label,
      text: normalizePassageSpeechText(passage.englishPrimary.text),
    },
    sections,
    translations: visibleTranslations.map((t) => ({
      id: t.id,
      label: t.label,
      attribution: t.attribution,
      text: normalizePassageSpeechText(t.text),
    })),
  };
}

export function textFromSectionOnward(
  plan: PassageSpeechPlan,
  fromId: PassageSpeechSectionId,
): string {
  const start = PASSAGE_SPEECH_SECTION_ORDER.indexOf(fromId);
  if (start < 0) return "";
  const wanted = new Set(PASSAGE_SPEECH_SECTION_ORDER.slice(start));
  return joinProse(
    plan.sections.filter((s) => wanted.has(s.id)).map((s) => s.text),
  );
}

export function textForSectionOnly(
  plan: PassageSpeechPlan,
  sectionId: PassageSpeechSectionId,
): string {
  return plan.sections.find((s) => s.id === sectionId)?.text ?? "";
}
