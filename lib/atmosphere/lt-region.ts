/**
 * Living Terrain V2 — environmental region of the public site.
 * One world, different regions. Visual only — not IA or canonical data.
 */

export type LtRegion =
  | "threshold" /* Home */
  | "atlas"
  | "shelves" /* inquiry, books, essays, visual-maps */
  | "observatory"
  | "chamber"
  | "reading" /* essay / field-note detail */
  | "field"; /* residual public routes */

export function ltRegionForPath(pathname: string): LtRegion {
  const p = pathname.replace(/\/$/, "") || "/";

  if (p === "/") return "threshold";
  if (p === "/atlas" || p.startsWith("/atlas/")) return "atlas";
  if (p === "/observatory" || p.startsWith("/observatory/") || p === "/concepts") {
    return "observatory";
  }
  if (p.startsWith("/chambers/")) return "chamber";
  if (
    p.startsWith("/essays/") ||
    p.startsWith("/threads/") ||
    p.startsWith("/field-notes/") ||
    p.startsWith("/notebook/")
  ) {
    return "reading";
  }
  if (
    p === "/inquiry" ||
    p === "/books" ||
    p === "/essays" ||
    p === "/field-notes" ||
    p === "/visual-maps" ||
    p.startsWith("/visual-maps/")
  ) {
    return "shelves";
  }
  return "field";
}
