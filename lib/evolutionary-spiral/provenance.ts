import type { SpiralProvenanceKind } from "./types";

export type SpiralProvenanceCategory = {
  id: SpiralProvenanceKind;
  label: string;
  definition: string;
};

/**
 * Historical / interpretive provenance labels.
 * Used especially for Zodiac material; available wherever chronology matters.
 */
export const SPIRAL_PROVENANCE_CATEGORIES: readonly SpiralProvenanceCategory[] =
  [
    {
      id: "ancient-hellenistic",
      label: "Ancient / Hellenistic",
      definition:
        "Material attested in ancient or Hellenistic sources and practice.",
    },
    {
      id: "later-traditional",
      label: "Later traditional",
      definition:
        "Associations developed in later traditional astrology, after the Hellenistic core.",
    },
    {
      id: "modern-pluto-era",
      label: "Modern Pluto-era",
      definition:
        "Twentieth-century associations following Pluto’s discovery and modern outer-planet rulerships.",
    },
    {
      id: "modern-psychological",
      label: "Modern psychological astrology",
      definition:
        "Developmental or psychological readings from modern humanistic / psychological astrology.",
    },
    {
      id: "our-systems-reading",
      label: "Our systems reading",
      definition:
        "A Living Terrain / Evolutionary Spiral comparative reading — not ancient doctrine.",
    },
  ] as const;

export function provenanceLabel(kind: SpiralProvenanceKind): string {
  return (
    SPIRAL_PROVENANCE_CATEGORIES.find((c) => c.id === kind)?.label ?? kind
  );
}

export function normalizeProvenance(
  value: SpiralProvenanceKind | readonly SpiralProvenanceKind[] | undefined,
): SpiralProvenanceKind[] {
  if (!value) return [];
  if (typeof value === "string") return [value];
  return [...value];
}
