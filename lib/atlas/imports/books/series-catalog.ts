/**
 * Living Terrain Series — discovered from Amazon series B0GPRBT49Z
 * Canonical purchase URLs; do not guess ASINs.
 */
export const LIVING_TERRAIN_SERIES_URL =
  "https://www.amazon.com/dp/B0GPRBT49Z";

export const STRUCTURE_BENEATH_REALITY_URL =
  "https://www.amazon.com/Structure-Beneath-Reality-Chelsea-Thacker/dp/B0H3ZFPLDN";

export interface SeriesBookCatalogEntry {
  id: string;
  chamberId: string;
  slug: string;
  seriesOrder: number;
  title: string;
  subtitle: string;
  description: string;
  centralQuestion: string;
  whyExists: string;
  purchaseUrl: string;
  publishedYear: number;
  themes: string[];
  parentConcepts: string[];
}

/** Six volumes in the Living Terrain Series (Amazon) */
export const LIVING_TERRAIN_SERIES: SeriesBookCatalogEntry[] = [
  {
    id: "b2",
    chamberId: "p2",
    slug: "the-biology-of-becoming",
    seriesOrder: 1,
    title: "The Biology of Becoming",
    subtitle: "How the Nervous System Rewrites Identity, Reality & Destiny",
    description:
      "A guide to how the nervous system rewrites identity, behavior, perception, and reality — drawing from trauma physiology, somatic psychology, and the biology of adaptation.",
    centralQuestion:
      "What must the nervous system do before identity, perception, or reality can change?",
    whyExists:
      "For readers in collapse — when identity is shifting, the nervous system feels like it is unraveling, and life is dissolving without explanation. This volume names the biological logic beneath transformation.",
    purchaseUrl: "https://www.amazon.com/dp/B0G67H3641",
    publishedYear: 2025,
    themes: ["th-embodiment", "th-consciousness", "th-identity", "th-reality"],
    parentConcepts: ["th-embodiment", "th-consciousness"],
  },
  {
    id: "b3",
    chamberId: "p3",
    slug: "the-second-birth",
    seriesOrder: 2,
    title: "The Second Birth",
    subtitle: "Evidence, Embodiment, and Becoming",
    description:
      "An embodied investigation into how identity, perception, and reality are rewritten through the nervous system — for those rebuilding after collapse.",
    centralQuestion:
      "What does it mean to be born again — not spiritually, but physiologically?",
    whyExists:
      "For readers who have crossed through breakdown and are reconstructing consciously. Nothing was broken — only adapted. This volume moves from awareness into embodiment.",
    purchaseUrl: "https://www.amazon.com/dp/B0GD24JD91",
    publishedYear: 2025,
    themes: ["th-embodiment", "th-meaning", "th-identity", "th-consciousness"],
    parentConcepts: ["th-embodiment", "th-meaning"],
  },
  {
    id: "b4",
    chamberId: "p4",
    slug: "below-criticality",
    seriesOrder: 3,
    title: "Below Criticality",
    subtitle: "How Modern Systems Are Quietly Redesigning Human Life",
    description:
      "Examines the steady lowering of intensity across biological, emotional, and social systems — emotional flatness mistaken for regulation, stability confused with health.",
    centralQuestion:
      "What happens when living systems operate below the threshold where real change remains possible?",
    whyExists:
      "For readers who feel system pressure — when modern life accelerates faster than biology can adapt. Optimization culture, overstimulation, and living above sustainable thresholds.",
    purchaseUrl: "https://www.amazon.com/dp/B0GJ419MJC",
    publishedYear: 2025,
    themes: ["th-information", "th-reality", "th-freedom", "th-embodiment"],
    parentConcepts: ["th-information", "th-reality"],
  },
  {
    id: "b5",
    chamberId: "p5",
    slug: "embodied-physics",
    seriesOrder: 4,
    title: "Embodied Physics",
    subtitle: "Energy, constraint, and the measurable life of identity",
    description:
      "Explores how the body organizes itself in response to pressure, constraint, and signal — identity as a consequence of physical interaction, not abstraction.",
    centralQuestion:
      "How does the body participate in what we call the real?",
    whyExists:
      "For readers ready for the deeper layer — the relationship between energy, biology, perception, and lived experience. Identity as something continuously shaped by constraint.",
    purchaseUrl: "https://www.amazon.com/dp/B0GNMRH8Q6",
    publishedYear: 2025,
    themes: ["th-embodiment", "th-reality", "th-consciousness", "th-structure"],
    parentConcepts: ["th-embodiment", "th-reality"],
  },
  {
    id: "b6",
    chamberId: "p6",
    slug: "a-field-guide-to-the-experience",
    seriesOrder: 5,
    title: "A Field Guide to the Experience",
    subtitle: "An Orientation to Psychedelic States and Integration",
    description:
      "An orientation to psychedelic states — clarity without coercion, language without dogma, orientation without instruction.",
    centralQuestion:
      "How do we integrate expanded states without chasing transcendence?",
    whyExists:
      "For sensitive explorers who have touched expanded states — through psychedelics, trauma, spirituality, or awakening. Not about chasing transcendence. About integration.",
    purchaseUrl: "https://www.amazon.com/dp/B0GK31DYJQ",
    publishedYear: 2025,
    themes: ["th-consciousness", "th-language", "th-meaning", "th-perception"],
    parentConcepts: ["th-consciousness", "th-language"],
  },
  {
    id: "b7",
    chamberId: "p7",
    slug: "feedback-is-god",
    seriesOrder: 6,
    title: "Feedback Is God",
    subtitle: "The Intelligence That Restores What Control Could Never Heal",
    description:
      "Reframes intelligence as relationship — the ongoing conversation between action and consequence, signal and response, rupture and repair.",
    centralQuestion:
      "What restores coherence when force cannot?",
    whyExists:
      "For readers who have tried to control healing and found it fails. Feedback loops — biological, spiritual, systemic — as the intelligence beneath repair.",
    purchaseUrl: "https://www.amazon.com/dp/B0GHPQKGKX",
    publishedYear: 2025,
    themes: ["th-relationship", "th-meaning", "th-freedom", "th-information"],
    parentConcepts: ["th-relationship", "th-meaning"],
  },
];

/** Essay themes for auto-linking (atlas ids) */
export const ESSAY_THEME_INDEX: { id: string; themes: string[] }[] = [
  { id: "e1", themes: ["th-freedom", "th-structure", "th-embodiment", "th-consciousness"] },
  { id: "e2", themes: ["th-consciousness", "th-meaning", "th-time"] },
  { id: "e3", themes: ["th-embodiment", "th-structure", "th-information", "th-consciousness"] },
  { id: "e4", themes: ["th-time", "th-meaning", "th-consciousness", "th-perception"] },
  { id: "e5", themes: ["th-identity", "th-consciousness", "th-relationship", "th-language"] },
  { id: "e6", themes: ["th-identity", "th-consciousness", "th-embodiment", "th-freedom"] },
  { id: "e7", themes: ["th-information", "th-perception", "th-language", "th-consciousness"] },
  { id: "e8", themes: ["th-language", "th-meaning", "th-information", "th-time"] },
  { id: "e9", themes: ["th-reality", "th-perception", "th-consciousness", "th-embodiment"] },
  { id: "e10", themes: ["th-freedom", "th-embodiment", "th-identity", "th-consciousness"] },
  { id: "e11", themes: ["th-embodiment", "th-identity", "th-language", "th-freedom"] },
];
