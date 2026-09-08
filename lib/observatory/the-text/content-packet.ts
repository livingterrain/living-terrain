/**
 * Contract for an externally researched passage content packet.
 * Architecture lock — do not invent scholarship here.
 *
 * The verified Genesis 2:7 packet should supply this shape (or a merge
 * into the existing Passage + TEXT_SOURCES registry).
 */

import type { TextSource } from "./sources";
import type {
  ContextBlock,
  EvidenceClaim,
  InterpretationTraditionGroup,
  LanguageNote,
  OpenQuestion,
  PassageWord,
  TerrainExploration,
  TranslationVariant,
} from "./types";

export interface TextContentPacket {
  /** Matches Passage.slug — e.g. "genesis-2-7". */
  passageSlug: string;
  /** Sources to merge into / replace entries in the source registry. */
  sources: TextSource[];
  /** Optional flat claim index for audit tooling. */
  claims?: EvidenceClaim[];
  words?: PassageWord[];
  translations?: TranslationVariant[];
  languageNotes?: LanguageNote[];
  context?: ContextBlock[];
  /**
   * Multiple named readings per tradition.
   * Example: Rashi + Ramban under Jewish readings;
   * two modern scholars under academic readings.
   */
  interpretation?: InterpretationTraditionGroup[];
  terrain?: TerrainExploration[];
  remainsOpen?: OpenQuestion[];
}
