import type { SpiralExample } from "./types";

/**
 * Sparse Phase 1 seed examples.
 * Living Systems / Biology is prioritized.
 * No zodiac, biblical, or mythological seeds — those await deliberate Phase 3 authorship.
 * Missing stages are intentional.
 */
export const SPIRAL_EXAMPLES: readonly SpiralExample[] = [
  {
    id: "ex-emergence-self-maintaining",
    stageId: "emergence",
    domainId: "living-systems",
    epistemicKind: "empirical",
    title: "Self-maintaining organization",
    body: "In living systems, a boundary can appear where chemistry begins to sustain itself as a unit—metabolism and repair holding a pattern that was not previously available as an organism. The claim is about discernible self-maintenance, not a complete account of life's origin.",
    current: "continuity",
  },
  {
    id: "ex-embodiment-metabolism",
    stageId: "embodiment",
    domainId: "living-systems",
    epistemicKind: "empirical",
    title: "Metabolism as living medium",
    body: "An organism persists only as ongoing material and energetic exchange. The pattern of life is not abstract; it occupies a body through which sensing, action, and repair can occur.",
    current: "continuity",
  },
  {
    id: "ex-differentiation-cell-types",
    stageId: "differentiation",
    domainId: "living-systems",
    epistemicKind: "empirical",
    title: "Cell-type differentiation",
    body: "In multicellular development, cells specialize into distinct types and roles. Distinctions appear within one organism so that the whole is no longer an undifferentiated unity.",
    current: "transformation",
  },
  {
    id: "ex-relationship-symbiosis",
    stageId: "relationship",
    domainId: "ecology",
    epistemicKind: "empirical",
    title: "Symbiosis as constitutive relation",
    body: "In many ecosystems, partners become what they are through sustained mutual influence. Relation is not a later accessory; identity and viability depend on contact that cannot be removed without changing what each partner is.",
    current: "continuity",
  },
  {
    id: "ex-organization-homeostasis",
    stageId: "organization",
    domainId: "living-systems",
    epistemicKind: "empirical",
    title: "Homeostasis through regulated change",
    body: "Physiological systems hold viable ranges of temperature, chemistry, and tone by continuous adjustment. Stability here is organized regulation—not the absence of change.",
    comparisonPair: { left: "homeostasis", right: "adaptation" },
    current: "continuity",
  },
  {
    id: "ex-disruption-perturbation",
    stageId: "disruption",
    domainId: "living-systems",
    epistemicKind: "empirical",
    title: "Perturbation beyond ordinary regulation",
    body: "Injury, infection, scarcity, or environmental shock can exceed the range an existing organization can absorb unchanged. Continuity is forced into contact with demand it cannot meet by routine adjustment alone.",
    current: "transformation",
  },
  {
    id: "ex-transformation-inheritance-variation",
    stageId: "transformation",
    domainId: "living-systems",
    epistemicKind: "empirical",
    title: "Inheritance under variation",
    body: "Populations persist across generations by transmitting structure while admitting variation. Routine variation changes what is inherited, not how inheritance works—and that alone is not Transformation. The comparison begins only where the processes by which a lineage maintains or transmits its organization themselves change. This is related to—but does not replace—the organism-level Adaptation Loop elsewhere in Living Terrain.",
    comparisonPair: { left: "inheritance", right: "variation" },
    current: "transformation",
  },
  {
    id: "ex-integration-coherent-function",
    stageId: "integration",
    domainId: "psychology",
    epistemicKind: "empirical",
    title: "Coherence after developmental reorganization",
    body: "After a sustained rupture in habit, role, or self-pattern, recovery is not only the return of old pieces. Integration names the point at which reorganized capacities become coherent enough to function together again as one life.",
    comparisonPair: { left: "identity", right: "development" },
    current: "continuity",
  },
  {
    id: "ex-renewal-ecological-succession",
    stageId: "renewal",
    domainId: "ecology",
    epistemicKind: "empirical",
    title: "Succession after disturbance",
    body: "After fire, flood, or clearing, an ecological community may regrow. Where it returns toward the kind of community that was there before, that is persistence and recurrence. The comparison with Renewal begins only where the community stabilizes with altered capacity, carrying its history forward.",
    comparisonPair: { left: "persistence", right: "change" },
    current: "continuity",
  },
] as const;

export function examplesForStage(stageId: string): SpiralExample[] {
  return SPIRAL_EXAMPLES.filter((e) => e.stageId === stageId);
}
