import { EXODUS_3_13_15 } from "./exodus-3-13-15";
import { GENESIS_1_1_5 } from "./genesis-1-1-5";
import { GENESIS_2_7 } from "./genesis-2-7";
import { JOHN_1_1_5 } from "./john-1-1-5";
import type { Passage, PassageSummary } from "./types";

/**
 * Curated passage collection for Instrument 01.
 * Genesis 1:1–5, Genesis 2:7, Exodus 3:13–15, and John 1:1–5 hold verified-core scholarship.
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
    id: EXODUS_3_13_15.id,
    slug: EXODUS_3_13_15.slug,
    reference: EXODUS_3_13_15.reference,
    language: EXODUS_3_13_15.language,
    themes: EXODUS_3_13_15.themes,
    status: EXODUS_3_13_15.status,
    whisper: EXODUS_3_13_15.whisper,
  },
  {
    id: JOHN_1_1_5.id,
    slug: JOHN_1_1_5.slug,
    reference: JOHN_1_1_5.reference,
    language: JOHN_1_1_5.language,
    themes: JOHN_1_1_5.themes,
    status: JOHN_1_1_5.status,
    whisper: JOHN_1_1_5.whisper,
  },
];

const PASSAGES_BY_SLUG: Record<string, Passage> = {
  [GENESIS_1_1_5.slug]: GENESIS_1_1_5,
  [GENESIS_2_7.slug]: GENESIS_2_7,
  [EXODUS_3_13_15.slug]: EXODUS_3_13_15,
  [JOHN_1_1_5.slug]: JOHN_1_1_5,
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
