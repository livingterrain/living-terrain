/**
 * Pathways through the world — names that pull, not labels that organize.
 */

export interface WorldPathway {
  href: string;
  /** What you might call it if you discovered it alone */
  label: string;
  /** The feeling of walking that way */
  hint: string;
}

/** Visible when the visitor chooses to look for a way forward */
export const PATHWAYS: WorldPathway[] = [
  {
    href: "/atlas",
    label: "The atlas",
    hint: "Maps of completed investigations",
  },
  {
    href: "/inquiry",
    label: "The shelves",
    hint: "Writing from the edges of the terrain",
  },
  {
    href: "/questions",
    label: "Where paths branch",
    hint: "Questions that stay alive longer than answers",
  },
  {
    href: "/observatory",
    label: "Inward",
    hint: "Amber light where ideas are still forming",
  },
];

export const PATHWAY_DEEPER: WorldPathway[] = [
  {
    href: "/chambers/the-structure-beneath-reality",
    label: "The inner chamber",
    hint: "Structure beneath all structure",
  },
  {
    href: "/field-notes",
    label: "The field desk",
    hint: "Observations taken at the edge of understanding",
  },
  {
    href: "/about",
    label: "The guide",
    hint: "Not the subject — the one who built the place",
  },
];
