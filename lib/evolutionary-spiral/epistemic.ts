import type { SpiralEpistemicCategory, SpiralEpistemicKind } from "./types";

export const SPIRAL_EPISTEMIC_CATEGORIES: readonly SpiralEpistemicCategory[] = [
  {
    id: "empirical",
    label: "Empirical",
    definition: "Observable or testable phenomena.",
  },
  {
    id: "empirical-mechanism",
    label: "Empirical mechanism",
    definition:
      "A proposed causal or process mechanism that can, in principle, be investigated by evidence and method.",
  },
  {
    id: "empirical-observation",
    label: "Empirical observation",
    definition:
      "An observation of pattern or phenomenon without claiming a complete causal mechanism.",
  },
  {
    id: "conceptual-framework",
    label: "Conceptual framework",
    definition:
      "An organizing model or heuristic used to interpret patterns — not itself a universal law or a single experimental hypothesis.",
  },
  {
    id: "systems-principle",
    label: "Systems principle",
    definition:
      "A general systems claim about how organization, history, or constraint operate across cases — broader than one measured mechanism.",
  },
  {
    id: "historical-observation",
    label: "Historical observation",
    definition:
      "Observation grounded in historical record of what people recorded, practiced, or experienced.",
  },
  {
    id: "historical-textual",
    label: "Historical / Textual",
    definition:
      "Claims grounded in historical sources, texts, traditions, or documented observation.",
  },
  {
    id: "textual-observation",
    label: "Textual observation",
    definition:
      "Direct observation of what a text says or how a textual pattern appears, prior to broader interpretation.",
  },
  {
    id: "textual-interpretation",
    label: "Textual interpretation",
    definition:
      "An interpretive reading of a text or corpus — not itself a scientific mechanism.",
  },
  {
    id: "theological-interpretation",
    label: "Theological interpretation",
    definition:
      "A faith-informed or doctrinal reading. Distinct from empirical mechanism and from bare textual observation.",
  },
  {
    id: "symbolic-comparative",
    label: "Symbolic / Comparative",
    definition:
      "Interpretive correspondences across symbolic languages.",
  },
  {
    id: "symbolic-analogy",
    label: "Symbolic analogy",
    definition:
      "A proposed structural analogy in symbolic or archetypal language. Not evidence of empirical causation.",
  },
  {
    id: "hypothesis",
    label: "Hypothesis",
    definition:
      "A provisional proposal offered for further inquiry — not established fact.",
  },
  {
    id: "contested-interpretation",
    label: "Contested interpretation",
    definition:
      "An interpretation of evidence that remains actively debated — not settled consensus, and not a provisional hypothesis offered only for future inquiry.",
  },
  {
    id: "model-projection",
    label: "Model projection",
    definition:
      "A result produced by a formal or computational model under stated assumptions or scenarios, estimating possible system behavior beyond directly observed conditions. Not an observation, not a measured mechanism, and not a provisional hypothesis — a projection is never to be read as observed fact.",
  },
] as const;

/** Defined for authored data but not yet introduced in visitor copy. */
const NOT_YET_IN_LEGEND: ReadonlySet<SpiralEpistemicKind> = new Set([
  "model-projection",
]);

/** Categories shown in the visitor "Ways of knowing" legend. */
export const SPIRAL_EPISTEMIC_LEGEND: readonly SpiralEpistemicCategory[] =
  SPIRAL_EPISTEMIC_CATEGORIES.filter((c) => !NOT_YET_IN_LEGEND.has(c.id));

export type SpiralKnowingFamilyId =
  | "evidence"
  | "framework"
  | "textual"
  | "symbolic"
  | "model"
  | "open";

export type SpiralKnowingFamily = {
  id: SpiralKnowingFamilyId;
  label: string;
  kinds: readonly SpiralEpistemicKind[];
};

/**
 * Plain families for the first glance. Every epistemic kind belongs to exactly
 * one family; the precise kinds remain one step deeper. Evidence, frameworks,
 * readings of texts, symbolic comparison, and open claims never share a family.
 */
export const SPIRAL_KNOWING_FAMILIES: readonly SpiralKnowingFamily[] = [
  {
    id: "evidence",
    label: "Research evidence",
    kinds: ["empirical", "empirical-mechanism", "empirical-observation"],
  },
  {
    id: "framework",
    label: "Theoretical framework",
    kinds: ["conceptual-framework", "systems-principle"],
  },
  {
    id: "textual",
    label: "Historical, textual, or theological reading",
    kinds: [
      "historical-observation",
      "historical-textual",
      "textual-observation",
      "textual-interpretation",
      "theological-interpretation",
    ],
  },
  {
    id: "symbolic",
    label: "Symbolic comparison",
    kinds: ["symbolic-comparative", "symbolic-analogy"],
  },
  { id: "model", label: "Model projection", kinds: ["model-projection"] },
  {
    id: "open",
    label: "Debated or unresolved",
    kinds: ["hypothesis", "contested-interpretation"],
  },
];

/** Families present among the given kinds, in family order. */
export function knowingFamilies(
  kinds: readonly SpiralEpistemicKind[] | undefined,
): SpiralKnowingFamily[] {
  if (!kinds?.length) return [];
  return SPIRAL_KNOWING_FAMILIES.filter((f) => f.kinds.some((k) => kinds.includes(k)));
}

export function epistemicLabel(kind: SpiralEpistemicKind): string {
  return (
    SPIRAL_EPISTEMIC_CATEGORIES.find((c) => c.id === kind)?.label ?? kind
  );
}
