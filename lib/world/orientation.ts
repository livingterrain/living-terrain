/**
 * Global orientation — spatially legible navigation for Living Terrain.
 * Conceptual mystery stays; location does not.
 */

export type MenuLink = {
  href: string;
  label: string;
};

/**
 * A quieter doorway nested within a primary room — not a room of its own.
 * Navigation only: it never implies a canonical relationship.
 */
export type MenuWithin = {
  label: string;
  hint: string;
  links: readonly MenuLink[];
};

export type MenuDestination = MenuLink & {
  hint: string;
  within?: MenuWithin;
};

/** Models & instruments live within the Atlas; they are not a fourth room. */
export const ATLAS_MODELS_DOORWAY: MenuWithin = {
  label: "Models & instruments",
  hint: "Explore interactive frameworks.",
  links: [{ href: "/evolutionary-spiral", label: "Evolutionary Spiral" }],
};

/** Sparse Menu destinations — primary rooms only */
export const TERRAIN_MENU: readonly MenuDestination[] = [
  {
    href: "/",
    label: "Living Terrain",
    hint: "Home / orientation",
  },
  {
    href: "/atlas",
    label: "Atlas",
    hint: "Questions, relationships, charts, and models.",
    within: ATLAS_MODELS_DOORWAY,
  },
  {
    href: "/inquiry",
    label: "The Shelves",
    hint: "Books, essays, and visual maps.",
  },
  {
    href: "/observatory",
    label: "Observatory",
    hint: "Ideas and investigations still forming.",
  },
  {
    href: "/join",
    label: "Follow on Substack",
    hint: "New essays and field notes as the work develops.",
  },
] as const;

/**
 * Quiet cartographic notation — answers “where am I?”
 * Not a breadcrumb chain.
 */
export function locationWhisperForPath(pathname: string): string | null {
  if (pathname === "/" || pathname === "") return null;

  if (pathname === "/atlas" || pathname === "/atlas/") return "Atlas";
  if (pathname.startsWith("/atlas/charts")) return "Atlas · Charts";
  if (pathname.startsWith("/atlas/")) return "Atlas";

  if (pathname.startsWith("/evolutionary-spiral")) {
    return "Atlas · Model";
  }

  if (pathname === "/inquiry" || pathname === "/inquiry/") return "The Shelves";
  if (pathname === "/books" || pathname.startsWith("/books/")) {
    return "The Shelves · Books";
  }
  if (pathname === "/essays" || pathname.startsWith("/essays/")) {
    return "The Shelves · Essays";
  }
  if (pathname.startsWith("/threads/")) return "Thread";
  if (pathname === "/visual-maps" || pathname === "/visual-maps/") {
    return "The Shelves · Visual Maps";
  }
  if (pathname.startsWith("/visual-maps/astrology")) {
    return "Visual Maps · Astrology";
  }
  if (pathname.startsWith("/visual-maps/")) {
    return "The Shelves · Visual Maps";
  }

  if (pathname === "/observatory" || pathname === "/observatory/") {
    return "Observatory";
  }
  if (pathname.startsWith("/observatory/")) return "Observatory";

  if (pathname.startsWith("/chambers/")) return "Chamber";
  if (pathname.startsWith("/about")) return "About";
  if (pathname.startsWith("/welcome")) return null;

  return null;
}

export function menuDestinationIsActive(
  pathname: string,
  href: string,
): boolean {
  if (href === "/") return pathname === "/" || pathname === "";
  if (pathname === href || pathname.startsWith(`${href}/`)) return true;
  if (href === "/atlas") {
    return ATLAS_MODELS_DOORWAY.links.some((link) =>
      menuDestinationIsActive(pathname, link.href),
    );
  }
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

/** Atlas question list listens only on the bare /atlas room. */
export function atlasQuestionsAvailable(pathname: string): boolean {
  return pathname === "/atlas" || pathname === "/atlas/";
}
