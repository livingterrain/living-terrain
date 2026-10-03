import type { SpiralEpistemicCategory, SpiralEpistemicKind } from "./types";

export const SPIRAL_EPISTEMIC_CATEGORIES: readonly SpiralEpistemicCategory[] = [
  {
    id: "empirical",
    label: "Empirical",
    definition:
      "Observable or testable phenomena—legacy Phase 1 umbrella for seeded examples.",
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
      "Claims grounded in historical sources, texts, traditions, or documented observation — legacy Phase 1 label.",
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
      "Interpretive correspondences across symbolic languages — legacy Phase 1 label.",
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
] as const;

export function epistemicLabel(kind: SpiralEpistemicKind): string {
  return (
    SPIRAL_EPISTEMIC_CATEGORIES.find((c) => c.id === kind)?.label ?? kind
  );
}
