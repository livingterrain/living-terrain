import type { Metadata } from "next";
import { siteConfig } from "@/lib/content/data";

/** Production origin for Living Terrain. */
export const SITE_ORIGIN = siteConfig.url.replace(/\/$/, "");

/** Absolute URL on https://chelseathacker.com */
export function absoluteUrl(path: string = "/"): string {
  if (!path || path === "/") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Attach a self-referencing canonical for an App Router path. */
export function withCanonical(path: string, metadata: Metadata = {}): Metadata {
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      canonical: absoluteUrl(path),
    },
  };
}
