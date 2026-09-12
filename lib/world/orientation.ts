/**
 * Global orientation — spatially legible navigation for Living Terrain.
 * Conceptual mystery stays; location does not.
 */

export type MenuDestination = {
  href: string;
  label: string;
  hint: string;
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
    hint: "Follow what connects.",
  },
  {
    href: "/inquiry",
    label: "The Shelves",
    hint: "What has been made.",
  },
  {
    href: "/observatory",
    label: "Observatory",
    hint: "Still forming.",
  },
  { href: "/join", label: "Join", hint: "Stay in the field." },
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
