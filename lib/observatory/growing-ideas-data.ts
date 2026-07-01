export type GrowingMaturity = "seed" | "sprout" | "blooming";

export interface GrowingIdea {
  id: string;
  slug: string;
  title: string;
  /** Optional — seeds may be title only */
  body?: string;
  maturity: GrowingMaturity;
  themeIds?: string[];
}

export const GROWING_IDEAS: GrowingIdea[] = [
  {
    id: "gi-trust",
    slug: "the-architecture-of-trust",
    title: "The Architecture of Trust",
    maturity: "seed",
    themeIds: ["th-relationship"],
  },
  {
    id: "gi-preservation",
    slug: "what-systems-preserve",
    title: "What Systems Preserve",
    body:
      "Every system reveals itself through what it preserves — and what it is willing to lose.",
    maturity: "sprout",
    themeIds: ["th-reality", "th-information"],
  },
  {
    id: "gi-silence",
    slug: "the-grammar-of-silence",
    title: "The Grammar of Silence",
    body:
      "Before language arranges experience, something else holds the shape. Not emptiness — structure without words.",
    maturity: "sprout",
    themeIds: ["th-language", "th-consciousness"],
  },
  {
    id: "gi-constraint",
    slug: "constraint-as-companion",
    title: "Constraint as Companion",
    body:
      "Freedom without form dissolves. The heartbeat does not emerge from complete liberty — it emerges from rhythm. Still becoming.",
    maturity: "blooming",
    themeIds: ["th-freedom", "th-embodiment"],
  },
];

export function getGrowingIdeas(): GrowingIdea[] {
  return GROWING_IDEAS;
}

export function getGrowingIdeaBySlug(slug: string): GrowingIdea | undefined {
  return GROWING_IDEAS.find((g) => g.slug === slug);
}

const MATURITY_LABEL: Record<GrowingMaturity, string> = {
  seed: "Seed",
  sprout: "Taking form",
  blooming: "Almost ready",
};

export function growingMaturityLabel(maturity: GrowingMaturity): string {
  return MATURITY_LABEL[maturity];
}
