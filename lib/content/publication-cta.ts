/**
 * Shared publication CTA for reader-facing essay surfaces.
 *
 * Substack (exact post URL) is preferred. Medium is a temporary fallback when
 * no verified Substack counterpart exists. Never invents URLs or sends visitors
 * to the Substack homepage as a stand-in for a missing post.
 *
 * SEO page canonicals stay on chelseathacker.com via withCanonical(/essays/…).
 * This module only governs external publication CTAs.
 */

import type { Essay } from "@/lib/content/types";

export type EssayPublicationSource = "Substack" | "Medium" | "publication";

export type EssayPublicationCta = {
  /** Exact external post URL, or null when none is verified. */
  href: string | null;
  source: EssayPublicationSource | null;
  /** e.g. "Read on Substack" */
  readLabel: string | null;
  /** e.g. "Substack" for “published on …” */
  sourceLabel: string | null;
  /** e.g. "Also published on Substack" */
  alsoPublishedLabel: string | null;
  /** True when the CTA points at a Medium URL (temporary fallback). */
  isMediumFallback: boolean;
};

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/** Exact Living Terrain Substack post — not the publication homepage. */
export function isSubstackPostUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === "livingterrain.substack.com" &&
      /^\/p\/[^/]+/.test(u.pathname)
    );
  } catch {
    return false;
  }
}

export function isMediumUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === "medium.com" ||
      u.hostname.endsWith(".medium.com")
    );
  } catch {
    return false;
  }
}

/**
 * Reader-facing publication href.
 * Prefers a verified Substack post even if `canonicalUrl` still points at Medium.
 */
export function getEssayPublicationHref(essay: Essay): string | null {
  const urls = [
    essay.canonicalUrl,
    essay.substackUrl,
    essay.mediumUrl,
    essay.externalUrl,
  ].filter((u): u is string => typeof u === "string" && isHttpUrl(u));

  const substack = urls.find(isSubstackPostUrl);
  if (substack) return substack;

  const medium = urls.find(isMediumUrl);
  if (medium) return medium;

  // Other explicit external publications only — never the Substack homepage.
  const other = urls.find(
    (u) => !isSubstackPostUrl(u) && !isMediumUrl(u) && !u.includes("chelseathacker.com"),
  );
  return other ?? null;
}

export function getEssayPublicationSource(
  essay: Essay,
): EssayPublicationSource | null {
  const href = getEssayPublicationHref(essay);
  if (!href) return null;
  if (isSubstackPostUrl(href)) return "Substack";
  if (isMediumUrl(href)) return "Medium";
  return "publication";
}

export function getEssayPublicationCta(essay: Essay): EssayPublicationCta {
  const href = getEssayPublicationHref(essay);
  const source = getEssayPublicationSource(essay);
  if (!href || !source) {
    return {
      href: null,
      source: null,
      readLabel: null,
      sourceLabel: null,
      alsoPublishedLabel: null,
      isMediumFallback: false,
    };
  }

  const sourceLabel =
    source === "publication" ? "publication" : source;

  return {
    href,
    source,
    readLabel: `Read on ${sourceLabel}`,
    sourceLabel,
    alsoPublishedLabel: `Also published on ${sourceLabel}`,
    isMediumFallback: source === "Medium",
  };
}
