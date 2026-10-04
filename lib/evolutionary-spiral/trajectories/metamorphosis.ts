import type { SpiralTrajectory } from "../types";

/**
 * Metamorphosis — a developmental process trajectory (holometabolous insects).
 * Movements are not Spiral stages. Relationships live in
 * `../comparisons/metamorphosis.ts`.
 */
export const METAMORPHOSIS_TRAJECTORY: SpiralTrajectory = {
  id: "metamorphosis",
  lensId: "living-systems",
  title: "Metamorphosis",
  inPhrase: "metamorphosis",
  description:
    "The organism continues. Its organization does not remain the same.",
  shape: "process",
  steps: [
    { id: "embryogenesis", label: "Embryogenesis" },
    { id: "hatching", label: "Hatching" },
    { id: "larval-growth", label: "Larval growth" },
    { id: "competence", label: "Competence" },
    { id: "commitment", label: "Commitment" },
    { id: "metamorphic-transition", label: "Metamorphic transition" },
    { id: "tissue-destruction", label: "Selective tissue destruction" },
    {
      id: "tissue-remodeling",
      label: "Tissue remodeling + differentiation",
    },
    { id: "adult-emergence", label: "Adult emergence" },
    { id: "maturation", label: "Maturation / reproduction" },
  ],
  researchIssues: [
    {
      id: "meta-scale",
      question: "At what scale is the operation being observed?",
      body: "Transformation in metamorphosis is not necessarily a single moment. At different scales during the same biological event:",
      items: [
        "some tissue may be undergoing destruction",
        "other cells may be differentiating or proliferating",
        "other structures may persist",
        "organism-level identity may remain continuous",
      ],
    },
    {
      id: "meta-continuity",
      question:
        "What must remain continuous for this to remain transformation of the same system rather than replacement by another system?",
    },
  ],
};
