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
    href: "/questions",
    label: "Where paths branch",
    hint: "Questions that stay alive longer than answers",
  },
  {
    href: "/inquiry",
    label: "The shelves",
    hint: "Essays and volumes resting in the quiet",
  },
  {
    href: "/observatory",
    label: "Inward",
    hint: "Amber light where ideas are still forming",
  },
  {
    href: "/about",
    label: "The guide",
    hint: "Not the subject — the one who built the place",
  },
];

export const PATHWAY_DEEPER: WorldPathway[] = [
  {
    href: "/structure-beneath-reality",
    label: "The inner chamber",
    hint: "Structure beneath all structure",
  },
  {
    href: "/field-notes",
    label: "The field desk",
    hint: "Observations taken at the edge of understanding",
  },
  {
    href: "/library",
    label: "The archive",
    hint: "Manuscripts sleeping in the dim",
  },
];
