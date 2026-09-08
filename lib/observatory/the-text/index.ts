export type {
  AttributedReading,
  ClaimCategory,
  ClaimConfidence,
  ContentVerification,
  ContextBlock,
  EpistemicConfidence,
  EvidenceClaim,
  InterpretationTraditionGroup,
  InterpretiveTradition,
  LanguageNote,
  NamedInterpretation,
  OpenQuestion,
  OriginalToken,
  Passage,
  PassageOriginal,
  PassageSections,
  PassageStatus,
  PassageStratum,
  PassageSummary,
  PassageWord,
  SemanticRange,
  SemanticSense,
  SourceType,
  TerrainExploration,
  TerrainLinkKind,
  TextLanguage,
  TranslationMeta,
  TranslationVariant,
  VerificationStatus,
} from "./types";

export {
  interpretationGroup,
  namedInterpretation,
  openQuestion,
  terrainNode,
} from "./types";

export type { TextContentPacket } from "./content-packet";

export {
  categoryLabel,
  confidenceLabel,
  EVIDENCE_STRATA,
  isPostEvidenceCategory,
  isScholarlyCategory,
  PASSAGE_STRATUM_ORDER,
  POST_EVIDENCE_CATEGORIES,
  SCHOLARLY_CATEGORIES,
  scholarshipStatusLabel,
  verificationLabel,
} from "./epistemic";

export type { ScholarshipStatus } from "./epistemic";

export {
  claimHasInspectableEvidence,
  claimNeedsResearch,
  claimStatusLine,
  isAuthoringNote,
  makeClaim,
  makeLanguageNote,
  resolveClaimSources,
  visitorFacingNote,
} from "./provenance";

export {
  getSourceById,
  getSourcesByIds,
  TEXT_SOURCES,
  type TextSource,
} from "./sources";

export {
  getPassageBySlug,
  getPassageSummaries,
  getReadyPassageSlugs,
  PASSAGE_SUMMARIES,
  passageStatusLabel,
} from "./passages";

export { GENESIS_1_1_5 } from "./genesis-1-1-5";
export { GENESIS_2_7 } from "./genesis-2-7";

export type {
  OriginalLanguageRecording,
  PassageReadingSource,
  PassageSpeechStatus,
} from "./passage-speech";

export {
  normalizePassageSpeechText,
  pickEnglishVoice,
  speechSynthesisSupported,
} from "./passage-speech";

export const INSTRUMENT_01 = {
  id: "instrument-01",
  number: "01",
  name: "The Text",
  question: "What survives translation?",
  route: "/observatory/the-text",
  supporting: [
    "Translation carries meaning across languages, cultures, and centuries. It also requires choices.",
    "Look beneath the English.",
  ],
  cta: "Enter the Text",
  methodTitle: "How this works",
  methodBody: [
    "This instrument moves in a fixed hierarchy: Text → Language → Context → Interpretation → Follow the terrain → What remains open.",
    "Lexical range is not the same as meaning in a specific occurrence. A word’s possible senses across Scripture do not all activate every time it appears.",
    "Translation requires choices. Differences in English wording are examined as decisions, not as proof that one translator concealed a secret meaning.",
    "Interpretive traditions are attributed as named voices — not collapsed into “Judaism says” or “Christianity says.” They are not linguistic facts, and Jewish readings of the Hebrew Bible are not “alternatives” to a Christian default.",
    "Follow the terrain begins after textual evidence ends. Exploratory Living Terrain relationships are explicitly separated from linguistic conclusions.",
    "Uncertainty is preserved rather than resolved artificially. Where legitimate disagreement exists, disagreement is shown.",
  ],
} as const;
