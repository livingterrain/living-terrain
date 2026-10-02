import type { SpiralEpistemicCategory, SpiralEpistemicKind } from "./types";

export const SPIRAL_EPISTEMIC_CATEGORIES: readonly SpiralEpistemicCategory[] = [
  {
    id: "empirical",
    label: "Empirical",
    definition:
      "Observable or testable mechanisms or phenomena—claims that can, in principle, be investigated by evidence and method.",
  },
  {
    id: "historical-textual",
    label: "Historical / Textual",
    definition:
      "Claims grounded in historical sources, texts, traditions, or documented observation of what people recorded or practiced.",
  },
  {
    id: "symbolic-comparative",
    label: "Symbolic / Comparative",
    definition:
      "Interpretive correspondences or pattern comparisons across symbolic, mythic, religious, or philosophical languages.",
  },
] as const;

export function epistemicLabel(kind: SpiralEpistemicKind): string {
  return (
    SPIRAL_EPISTEMIC_CATEGORIES.find((c) => c.id === kind)?.label ?? kind
  );
}
