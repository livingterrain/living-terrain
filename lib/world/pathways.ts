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
    hint: "Enter through a living question",
  },
  {
    href: "/inquiry",
    label: "The shelves",
    hint: "Books, essays, and visual maps",
  },
  {
    href: "/observatory",
    label: "The Observatory",
    hint: "Research before it becomes a map",
  },
];

/** Whether a pathway should read as the visitor's current direction */
export function pathwayIsActive(pathname: string, href: string): boolean {
  if (pathname === href || pathname.startsWith(`${href}/`)) return true;
  // Shelves realm: books shelf, essays, visual maps
  // Individual book plates keep Atlas route identity (`/atlas/[slug]`)
  if (href === "/inquiry") {
    return (
      pathname === "/books" ||
      pathname.startsWith("/books/") ||
      pathname === "/essays" ||
      pathname.startsWith("/essays/") ||
      pathname.startsWith("/visual-maps")
    );
  }
  return false;
}

export const PATHWAY_DEEPER: WorldPathway[] = [
  {
    href: "/chambers/the-structure-beneath-reality",
    label: "The inner chamber",
    hint: "Structure beneath all structure",
  },
  {
    href: "/about",
    label: "The guide",
    hint: "Not the subject — the one who built the place",
  },
];

/** Quiet Further destinations while the Atlas stays otherwise bare */
export const ATLAS_QUESTIONS_ACTION = "atlas-questions" as const;

export type AtlasOrientationPathway = WorldPathway & {
  action?: typeof ATLAS_QUESTIONS_ACTION;
};

/** @deprecated Prefer TERRAIN_MENU in lib/world/orientation — kept for any residual callers */
export const ATLAS_ORIENTATION_PATHWAYS: AtlasOrientationPathway[] = [
  {
    href: "/atlas",
    label: "Living questions",
    hint: "Return to the questions that open this place",
    action: ATLAS_QUESTIONS_ACTION,
  },
  {
    href: "/",
    label: "Living Terrain",
    hint: "Home / orientation",
  },
  {
    href: "/observatory",
    label: "Observatory",
    hint: "Still forming.",
  },
  {
    href: "/inquiry",
    label: "The Shelves",
    hint: "What has been made.",
  },
];

/** Window event — Atlas returns to the question list without remounting the room */
export const ATLAS_QUESTIONS_EVENT = "living-terrain:atlas-questions";
