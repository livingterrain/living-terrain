import type { SpiralDomain } from "./types";

/**
 * Comparative lenses for the eventual first public version.
 * Living Systems / Biology is the primary anchoring layer.
 * Not every domain is required at every stage.
 */
export const SPIRAL_DOMAINS: readonly SpiralDomain[] = [
  {
    id: "living-systems",
    label: "Living Systems / Biology",
    role: "Primary anchoring layer — strongest and most complete when examples exist.",
  },
  {
    id: "ecology",
    label: "Ecology",
    role: "Comparative lens — sparse coverage preferred over forced correspondence.",
  },
  {
    id: "psychology",
    label: "Psychology / Human Development",
    role: "Comparative lens — categorize epistemic status per example.",
  },
  {
    id: "biblical-textual",
    label: "Biblical / Textual",
    role: "Optional comparative layer — not seeded until deliberately authored.",
  },
  {
    id: "symbolic-zodiac",
    label: "Symbolic / Zodiac",
    role: "Optional comparative layer — not seeded until deliberately authored.",
  },
] as const;

export function getSpiralDomain(id: string): SpiralDomain | undefined {
  return SPIRAL_DOMAINS.find((d) => d.id === id);
}
