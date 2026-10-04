import type { SpiralDomain } from "./types";

/**
 * Comparative lenses.
 * Living Systems / Biology remains the primary empirical anchoring layer.
 * Systems is the structural/process lens — not a claim of scientific domain equivalence.
 * Not every domain is required at every stage.
 */
export const SPIRAL_DOMAINS: readonly SpiralDomain[] = [
  {
    id: "systems",
    label: "Systems",
    shortLabel: "Systems",
    role: "Structural / process lens — describes organization, perturbation, and reorganization without claiming a single scientific domain.",
  },
  {
    id: "living-systems",
    label: "Biology",
    shortLabel: "Biology",
    role: "Primary empirical anchoring layer — strongest and most complete when examples exist.",
  },
  {
    id: "ecology",
    label: "Ecology",
    shortLabel: "Ecology",
    role: "Comparative lens — sparse coverage preferred over forced correspondence.",
  },
  {
    id: "psychology",
    label: "Psychology",
    shortLabel: "Psychology",
    role: "Comparative lens — categorize epistemic status per example.",
  },
  {
    id: "biblical-textual",
    label: "Jesus / Biblical",
    shortLabel: "Jesus / Biblical",
    role: "Optional comparative layer — textual and theological interpretation only when deliberately authored.",
  },
  {
    id: "symbolic-zodiac",
    label: "Zodiac",
    shortLabel: "Zodiac",
    role: "Optional comparative layer — asks where Spiral operations appear within symbolic/historical trajectories; not a one-to-one sign map.",
  },
] as const;

export function getSpiralDomain(id: string): SpiralDomain | undefined {
  return SPIRAL_DOMAINS.find((d) => d.id === id);
}
