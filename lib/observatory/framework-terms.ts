/**
 * PHASE 1 — Framework vocabulary (Observatory-only).
 *
 * Alive terms — not a glossary, not a taxonomy browser.
 * Appear as notebook material on existing Observatory surfaces.
 * Revert: remove this file and its imports.
 */

export type FrameworkTermStatus =
  | "working"
  | "returning"
  | "forming"
  | "unsettled";

export interface FrameworkTerm {
  id: string;
  term: string;
  workingMeaning: string;
  status: FrameworkTermStatus;
  notes?: string[];
  relatedInvestigations?: string[];
  relatedTerms?: string[];
  tension?: string;
  seenIn?: string[];
  lastRevisited?: string;
}

export const FRAMEWORK_TERMS: FrameworkTerm[] = [
  {
    id: "term-terrain",
    term: "Terrain",
    status: "working",
    workingMeaning:
      "Terrain is not merely the background around a living system. It may be the total set of conditions the system is currently answering: resources, relationships, timing, memory, threat, support, constraint, and possibility. Still unclear where organism ends and terrain begins.",
    tension: "Context sounds passive. Terrain appears participatory.",
    relatedTerms: [
      "term-state",
      "term-participation",
      "term-feedback",
      "term-constraint",
      "term-relationship",
    ],
    relatedInvestigations: ["inv-fragility", "inv-recurrence"],
    lastRevisited: "July 2026",
  },
  {
    id: "term-feedback",
    term: "Feedback",
    status: "returning",
    workingMeaning:
      "Feedback may organize living systems more fundamentally than command. A system can survive imperfect control. It cannot survive indefinitely after losing the ability to sense and correct. Need counterexamples.",
    relatedTerms: [
      "term-correction",
      "term-fragility",
      "term-attention",
      "term-relationship",
      "term-maintenance",
    ],
    relatedInvestigations: ["inv-fragility", "inv-barriers"],
    lastRevisited: "June 2026",
    notes: ["Needs counterexamples."],
  },
  {
    id: "term-constraint",
    term: "Constraint",
    status: "working",
    workingMeaning:
      "People hear prison. I keep seeing scaffold. Constraint can limit motion, but it can also make form, leverage, coordination, and adaptation possible.",
    tension:
      "Constraint is not automatically beneficial. Some constraints organize. Some deform. Some prevent correction.",
    relatedTerms: [
      "term-freedom",
      "term-adaptation",
      "term-structure",
      "term-boundary",
      "term-pressure",
    ],
    relatedInvestigations: ["inv-barriers", "inv-priorities"],
    lastRevisited: "May 2026",
  },
  {
    id: "term-participation",
    term: "Participation",
    status: "returning",
    workingMeaning:
      "Participation keeps replacing control in the framework. The organism does not stand outside its environment and manage it. It changes through contact with what it is inside.",
    seenIn: ["biology", "technology", "relationships", "writing", "observation itself"],
    relatedTerms: [
      "term-attention",
      "term-terrain",
      "term-feedback",
      "term-relationship",
    ],
    relatedInvestigations: ["inv-recurrence", "inv-chakras"],
    lastRevisited: "July 2026",
  },
  {
    id: "term-organizational-recurrence",
    term: "Organizational recurrence",
    status: "working",
    workingMeaning:
      "The same organizational pattern may reappear across unlike materials without those materials being literally identical.",
    seenIn: [
      "cells",
      "bodies",
      "relationships",
      "software",
      "companies",
      "civilizations",
    ],
    tension: "Need to distinguish recurrence from projection.",
    relatedTerms: [
      "term-pattern",
      "term-analogy",
      "term-scale",
      "term-structure",
      "term-translation",
    ],
    relatedInvestigations: ["inv-recurrence"],
    lastRevisited: "July 2026",
  },
  {
    id: "term-reorganization",
    term: "Reorganization",
    status: "working",
    workingMeaning:
      "Transformation increasingly looks like reprioritization and recoordination rather than replacement. The parts may remain. Their relationships, timing, thresholds, and priorities change.",
    relatedTerms: [
      "term-identity",
      "term-state",
      "term-sleep",
      "term-illness",
      "term-adaptation",
      "term-becoming",
    ],
    relatedInvestigations: ["inv-sleep", "inv-priorities", "inv-recurrence"],
    lastRevisited: "April 2026",
  },
  {
    id: "term-identity",
    term: "Identity",
    status: "unsettled",
    workingMeaning:
      "Almost everything inside a living system may change while we continue to track it as the same organism. What is actually persisting? Not necessarily matter. Not necessarily behavior. Possibly continuity of organization, memory, or relation.",
    relatedTerms: [
      "term-reorganization",
      "term-continuity",
      "term-memory",
      "term-self",
      "term-pattern",
    ],
    relatedInvestigations: ["inv-sleep", "inv-recurrence"],
    lastRevisited: "April 2026",
  },
  {
    id: "term-state",
    term: "State",
    status: "returning",
    workingMeaning:
      "Diagnosis names a category. State describes how the whole organism is currently organized. Two people can share a diagnosis and inhabit different states. Two people can have different diagnoses and report remarkably similar whole-body states.",
    relatedTerms: [
      "term-terrain",
      "term-priorities",
      "term-regulation",
      "term-experience",
      "term-identity",
    ],
    relatedInvestigations: ["inv-priorities", "inv-sleep", "inv-chakras"],
    lastRevisited: "July 2026",
  },
  {
    id: "term-signal",
    term: "Signal",
    status: "forming",
    workingMeaning:
      "A signal is not automatically an instruction. It may be: information, noise, distress, coordination, memory, threshold crossing, or an attempt to recruit another system. Need distinctions.",
    relatedTerms: [
      "term-symptom",
      "term-feedback",
      "term-attention",
      "term-communication",
    ],
    relatedInvestigations: ["inv-chakras", "inv-fragility"],
    lastRevisited: "Undated",
  },
  {
    id: "term-symptom",
    term: "Symptom",
    status: "unsettled",
    workingMeaning:
      "Still testing whether symptom is best understood as damage, signal, strategy, overflow, or failed coordination. Probably not one category.",
    tension:
      "Do not romanticize symptoms. A meaningful signal can still be dangerous.",
    relatedTerms: [
      "term-signal",
      "term-state",
      "term-feedback",
      "term-inflammation",
      "term-adaptation",
    ],
    lastRevisited: "Undated",
  },
  {
    id: "term-attention",
    term: "Attention",
    status: "working",
    workingMeaning:
      "Attention changes what becomes available to a system. Not only psychologically. What is sensed, amplified, remembered, acted upon, or ignored changes organization. When does attention become participation?",
    relatedTerms: [
      "term-feedback",
      "term-observation",
      "term-salience",
      "term-relationship",
      "term-participation",
    ],
    relatedInvestigations: ["inv-chakras", "inv-barriers"],
    lastRevisited: "July 2026",
  },
  {
    id: "term-relationship",
    term: "Relationship",
    status: "returning",
    workingMeaning:
      "Nothing exists alone long enough to remain intelligible. Properties that appear intrinsic may actually be produced or stabilized through relationship.",
    relatedTerms: [
      "term-identity",
      "term-terrain",
      "term-feedback",
      "term-participation",
      "term-structure",
    ],
    relatedInvestigations: ["inv-fragility", "inv-recurrence", "inv-chakras"],
    lastRevisited: "July 2026",
  },
  {
    id: "term-maintenance",
    term: "Maintenance",
    status: "working",
    workingMeaning:
      "Every living system pays a cost merely to remain capable of correction. Maintenance is not stagnation. It is active preservation of future responsiveness.",
    relatedTerms: [
      "term-repair",
      "term-energy",
      "term-feedback",
      "term-fragility",
      "term-resilience",
    ],
    relatedInvestigations: ["inv-fragility"],
    lastRevisited: "June 2026",
  },
  {
    id: "term-fragility",
    term: "Fragility",
    status: "working",
    workingMeaning:
      "A system can appear stable after it has already lost the capacity to correct itself. Appearance may lag behind loss of recoverability. Need better distinction between: damage, brittleness, rigidity, low reserve, poor feedback.",
    relatedTerms: [
      "term-maintenance",
      "term-feedback",
      "term-constraint",
      "term-recovery",
    ],
    relatedInvestigations: ["inv-fragility"],
    lastRevisited: "June 2026",
  },
  {
    id: "term-resilience",
    term: "Resilience",
    status: "forming",
    workingMeaning:
      "Not returning unchanged. Possibly retaining or rebuilding the ability to reorganize without losing identity.",
    relatedTerms: [
      "term-adaptation",
      "term-recovery",
      "term-identity",
      "term-terrain",
    ],
    relatedInvestigations: ["inv-fragility", "inv-barriers"],
    lastRevisited: "Undated",
  },
  {
    id: "term-boundary",
    term: "Boundary",
    status: "returning",
    workingMeaning:
      "A boundary protects by controlling exchange. The same boundary can become the thing that prevents necessary reorganization. How does a living system know when to open, close, thicken, or dissolve an edge?",
    relatedTerms: [
      "term-constraint",
      "term-immune",
      "term-relationship",
      "term-identity",
      "term-barrier",
    ],
    relatedInvestigations: ["inv-barriers", "inv-chakras"],
    lastRevisited: "May 2026",
  },
  {
    id: "term-coherence",
    term: "Coherence",
    status: "forming",
    workingMeaning:
      "Coherence may be felt before it can be explained. Writing sometimes resolves physiological tension when one unfinished relationship finally becomes expressible. Need to distinguish: coherence, certainty, relief, closure, pattern completion.",
    relatedTerms: [
      "term-writing",
      "term-body",
      "term-attention",
      "term-integration",
    ],
    relatedInvestigations: ["inv-chakras"],
    lastRevisited: "Seen again",
  },
  {
    id: "term-becoming",
    term: "Becoming",
    status: "working",
    workingMeaning:
      "People describe transformation as becoming themselves, not becoming someone else. Why does radical change so often preserve the language of return?",
    relatedTerms: [
      "term-identity",
      "term-reorganization",
      "term-second-birth",
      "term-continuity",
    ],
    relatedInvestigations: ["inv-sleep", "inv-priorities"],
    lastRevisited: "Returning",
  },
  {
    id: "term-living-terrain",
    term: "Living terrain",
    status: "working",
    workingMeaning:
      "A living system and the conditions it inhabits continuously alter one another. The terrain is not outside the life. The life is not separate from the terrain. Still working.",
    relatedTerms: [
      "term-terrain",
      "term-participation",
      "term-relationship",
      "term-feedback",
    ],
    lastRevisited: "July 2026",
  },
];

/** Soft aliases referenced from relatedTerms that are not full entries yet */
const TERM_ALIASES: Record<string, string> = {
  "term-correction": "correction",
  "term-freedom": "freedom",
  "term-adaptation": "adaptation",
  "term-structure": "structure",
  "term-pressure": "pressure",
  "term-pattern": "pattern",
  "term-analogy": "analogy",
  "term-scale": "scale",
  "term-translation": "translation",
  "term-sleep": "sleep",
  "term-illness": "illness",
  "term-continuity": "continuity",
  "term-memory": "memory",
  "term-self": "self",
  "term-priorities": "priorities",
  "term-regulation": "regulation",
  "term-experience": "experience",
  "term-communication": "communication",
  "term-inflammation": "inflammation",
  "term-observation": "observation",
  "term-salience": "salience",
  "term-repair": "repair",
  "term-energy": "energy",
  "term-recovery": "recovery",
  "term-immune": "immune system",
  "term-barrier": "barrier",
  "term-writing": "writing",
  "term-body": "body",
  "term-integration": "integration",
  "term-second-birth": "second birth",
};

export function getFrameworkTerms(): FrameworkTerm[] {
  return FRAMEWORK_TERMS;
}

export function getFrameworkTermById(id: string): FrameworkTerm | undefined {
  return FRAMEWORK_TERMS.find((t) => t.id === id);
}

/** Quiet label for notebook whisper — never a chip */
export function termLabel(id: string): string | undefined {
  const term = getFrameworkTermById(id);
  if (term) return term.term;
  return TERM_ALIASES[id];
}

export function termLabels(ids: string[] | undefined): string[] {
  if (!ids?.length) return [];
  return ids.map(termLabel).filter((t): t is string => Boolean(t));
}

export function getTermsForInvestigation(
  investigationId: string,
): FrameworkTerm[] {
  return FRAMEWORK_TERMS.filter((t) =>
    t.relatedInvestigations?.includes(investigationId),
  );
}
