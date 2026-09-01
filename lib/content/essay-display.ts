/**
 * Display-layer cleanup for essay titles on The Shelves archive.
 * Does not rewrite canonical titles or Medium URLs.
 */
const LEADING_ORNAMENT =
  /^(?:[\s*⭐✨⚡✦🜃🌍✝️\*]|[\uFE0F\u200D\u20E3])+/u;

export function displayEssayTitle(title: string): string {
  const cleaned = title
    .replace(/\*\*/g, "")
    .replace(LEADING_ORNAMENT, "")
    .replace(/^[\s*:]+/, "")
    .trim();
  return cleaned || title;
}
