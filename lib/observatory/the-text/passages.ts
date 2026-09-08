import { GENESIS_2_7 } from "./genesis-2-7";
import type { Passage, PassageSummary } from "./types";

/**
 * Curated passage collection for Instrument 01.
 * Genesis 2:7 holds verified-core scholarship; other passages remain forming shells.
 */
export const PASSAGE_SUMMARIES: PassageSummary[] = [
  {
    id: "gen-1-1-5",
    slug: "genesis-1-1-5",
    reference: "Genesis 1:1–5",
    language: "hebrew",
    themes: ["beginning", "creation", "speech", "light"],
    status: "forming",
    whisper: "Beginning, speech, and light — still being prepared.",
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
