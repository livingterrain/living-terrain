import { GENESIS_1_1_5 } from "./genesis-1-1-5";
import { GENESIS_2_7 } from "./genesis-2-7";
import type { Passage, PassageSummary } from "./types";

/**
 * Curated passage collection for Instrument 01.
 * Genesis 1:1–5 and Genesis 2:7 hold verified-core scholarship;
 * other passages remain forming shells.
 */
export const PASSAGE_SUMMARIES: PassageSummary[] = [
  {
    id: GENESIS_1_1_5.id,
    slug: GENESIS_1_1_5.slug,
    reference: GENESIS_1_1_5.reference,
    language: GENESIS_1_1_5.language,
    themes: GENESIS_1_1_5.themes,
    status: GENESIS_1_1_5.status,
    whisper: GENESIS_1_1_5.whisper,
  },
  {
    id: GENESIS_2_7.id,
    slug: GENESIS_2_7.slug,
    reference: GENESIS_2_7.reference,
    language: GENESIS_2_7.language,
    themes: GENESIS_2_7.themes,
    status: GENESIS_2_7.status,
    whisper: GENESIS_2_7.whisper,
  },
  {
    id: "exod-3-13-15",
    slug: "exodus-3-13-15",
    reference: "Exodus 3:13–15",
    language: "hebrew",
    themes: ["name", "being", "ehyeh"],
    status: "forming",
    whisper: "Name and being — still being prepared.",
  },
  {
    id: "john-1-1-5",
    slug: "john-1-1-5",
    reference: "John 1:1–5",
    language: "greek",
    themes: ["beginning", "Logos", "life", "light"],
    status: "forming",
    whisper: "Beginning and Logos — still being prepared.",
  },
];

const PASSAGES_BY_SLUG: Record<string, Passage> = {
  [GENESIS_1_1_5.slug]: GENESIS_1_1_5,
  [GENESIS_2_7.slug]: GENESIS_2_7,
};

export function getPassageSummaries(): PassageSummary[] {
  return PASSAGE_SUMMARIES;
}

export function getPassageBySlug(slug: string): Passage | undefined {
  return PASSAGES_BY_SLUG[slug];
}

export function getReadyPassageSlugs(): string[] {
  return Object.keys(PASSAGES_BY_SLUG);
}

export function passageStatusLabel(status: PassageSummary["status"]): string {
  switch (status) {
    case "ready":
      return "Ready";
    case "prototype":
      return "Prototype";
    case "forming":
      return "Forming";
  }
}
