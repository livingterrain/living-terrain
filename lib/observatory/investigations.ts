/**
 * Observatory V1 — working research studio data.
 * Investigations, field observations, and evidence.
 */

export type InvestigationStatus = "active" | "forming" | "dormant";

export interface FieldObservation {
  id: string;
  text: string;
  investigationId?: string;
}

export interface EvidenceLink {
  id: string;
  label: string;
  href: string;
  kind: "essay" | "book" | "atlas" | "note" | "reference";
  investigationId?: string;
  /** Quiet note of how it touches the work */
  relation?: string;
}

export interface ObservatoryInvestigation {
  id: string;
  slug: string;
  title: string;
  question: string;
  status: InvestigationStatus;
  description: string;
  /** Archival — month year, e.g. "March 2026" */
  revised: string;
  observations: { id: string; text: string }[];
  relatedIds: string[];
}

export function statusLabel(status: InvestigationStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "forming":
      return "Forming";
    case "dormant":
      return "Dormant";
  }
}

export function evidenceKindLabel(kind: EvidenceLink["kind"]): string {
  switch (kind) {
    case "essay":
      return "Essay";
    case "book":
      return "Map";
    case "atlas":
      return "Atlas";
    case "note":
      return "Note";
    case "reference":
      return "Reference";
  }
}

export const INVESTIGATIONS: ObservatoryInvestigation[] = [
  {
    id: "inv-fragility",
    slug: "american-fragility",
    title: "American Fragility",
    question:
      "What makes a complex society brittle — and what allows it to recover?",
    status: "active",
    revised: "June 2026",
    description:
      "Institutions, trust, and feedback failing together — and what that reveals about organizational health.",
    observations: [
      {
        id: "o1",
        text: "A system can look intact long after it has lost the ability to correct itself.",
      },
      {
        id: "o2",
        text: "When feedback is delayed or denied, small errors compound into structural failure.",
      },
      {
        id: "o3",
        text: "The same society can be resilient in one domain and fragile in another at once.",
      },
    ],
    relatedIds: ["inv-recurrence", "inv-barriers"],
  },
  {
    id: "inv-barriers",
    slug: "dissolving-barriers",
    title: "Dissolving Barriers",
    question:
      "When do boundaries protect a living system — and when do they prevent reorganization?",
    status: "active",
    revised: "May 2026",
    description:
      "How organisms, people, and cultures open, close, and renegotiate their edges under pressure.",
    observations: [
      {
        id: "o1",
        text: "A barrier that once protected a system can later become what keeps it from healing.",
      },
      {
        id: "o2",
        text: "Opening a boundary too quickly can dissolve organization rather than renew it.",
      },
      {
        id: "o3",
        text: "Constraint sometimes produces adaptation; sometimes it only produces confinement.",
      },
    ],
    relatedIds: ["inv-fragility", "inv-sleep"],
  },
  {
    id: "inv-recurrence",
    slug: "organizational-recurrence",
    title: "Organizational Recurrence",
    question:
      "Where does the same organization reappear across biology, technology, relationships, and civilization?",
    status: "active",
    revised: "July 2026",
    description:
      "The central inquiry of Living Terrain — tracking recurrence before naming it too soon.",
    observations: [
      {
        id: "o1",
        text: "Fever retunes appetite, sleep, movement, attention, and social contact in the same interval.",
      },
      {
        id: "o2",
        text: "Different diseases often produce remarkably similar whole-body experiences.",
      },
      {
        id: "o3",
        text: "A response that intensifies what it answered appears in bodies, conversations, and markets.",
      },
    ],
    relatedIds: ["inv-sleep", "inv-fragility", "inv-priorities"],
  },
  {
    id: "inv-sleep",
    slug: "sleep-as-system-reorganization",
    title: "Sleep as System Reorganization",
    question:
      "How can nearly every physiological system reorganize overnight while the organism remains the same?",
    status: "forming",
    revised: "April 2026",
    description:
      "A daily case of deep reorganization without loss of identity.",
    observations: [
      {
        id: "o1",
        text: "Sleep reorganizes physiology without rewriting DNA.",
      },
      {
        id: "o2",
        text: "Autonomic tone, hormones, immunity, metabolism, and brain dynamics shift together in sleep.",
      },
      {
        id: "o3",
        text: "Waking restores another whole-body pattern — still counted as the same individual.",
      },
    ],
    relatedIds: ["inv-recurrence", "inv-priorities"],
  },
  {
    id: "inv-priorities",
    slug: "shifting-priorities",
    title: "Shifting Priorities",
    question:
      "What changes when a living system revises what it prioritizes — without revising its genome?",
    status: "forming",
    revised: "March 2026",
    description:
      "Growth, defense, repair, and conservation trading places under demand.",
    observations: [
      {
        id: "o1",
        text: "Priorities can shift dramatically while the genome stays the same.",
      },
      {
        id: "o2",
        text: "During infection, defense rises while appetite, activity, and social contact fall.",
      },
      {
        id: "o3",
        text: "During prolonged fasting, fuel use, activity, and reproductive signaling move together.",
      },
    ],
    relatedIds: ["inv-sleep", "inv-recurrence", "inv-barriers"],
  },
];

/** Standalone field notes — pinned notices */
export const FIELD_OBSERVATIONS: FieldObservation[] = [
  {
    id: "fo-fever",
    text: "Fever changes nearly every system while preserving identity.",
    investigationId: "inv-recurrence",
  },
  {
    id: "fo-sleep",
    text: "Sleep reorganizes physiology without changing DNA.",
    investigationId: "inv-sleep",
  },
  {
    id: "fo-constraint",
    text: "Constraint often creates adaptation instead of limitation.",
    investigationId: "inv-barriers",
  },
  {
    id: "fo-persist",
    text: "Almost everything inside can change — and we still track the same organism.",
    investigationId: "inv-recurrence",
  },
  {
    id: "fo-feedback",
    text: "A system can look stable after it has lost the ability to correct itself.",
    investigationId: "inv-fragility",
  },
  {
    id: "fo-similar",
    text: "Different diseases; remarkably similar whole-body experience.",
    investigationId: "inv-recurrence",
  },
  {
    id: "fo-edge",
    text: "A protective boundary can become the thing that prevents healing.",
    investigationId: "inv-barriers",
  },
  {
    id: "fo-domains",
    text: "Resilient in one domain. Fragile in another. Same society.",
    investigationId: "inv-fragility",
  },
];

/** Curated echoes in the terrain — not a link dump */
export const EVIDENCE_LINKS: EvidenceLink[] = [
  {
    id: "ev-feedback",
    label: "Feedback Is God",
    href: "/atlas/feedback-is-god",
    kind: "atlas",
    investigationId: "inv-fragility",
    relation: "Touches American Fragility",
  },
  {
    id: "ev-constraint",
    label: "Constraint Is Not the Opposite of Freedom",
    href: "/essays/constraint-is-not-the-opposite-of-freedom",
    kind: "essay",
    investigationId: "inv-barriers",
    relation: "Touches Dissolving Barriers",
  },
  {
    id: "ev-maintenance",
    label: "Every Living System Pays a Maintenance Cost",
    href: "/essays/every-living-system-pays-a-maintenance-cost",
    kind: "essay",
    investigationId: "inv-recurrence",
    relation: "Touches Organizational Recurrence",
  },
  {
    id: "ev-structure",
    label: "The Structure Beneath Reality",
    href: "/atlas/the-structure-beneath-reality",
    kind: "book",
    investigationId: "inv-recurrence",
    relation: "Touches Organizational Recurrence",
  },
  {
    id: "ev-biology",
    label: "The Biology of Becoming",
    href: "/atlas/the-biology-of-becoming",
    kind: "book",
    investigationId: "inv-priorities",
    relation: "Touches Shifting Priorities",
  },
];

export function getInvestigations(): ObservatoryInvestigation[] {
  return INVESTIGATIONS;
}

export function getInvestigationBySlug(
  slug: string,
): ObservatoryInvestigation | undefined {
  return INVESTIGATIONS.find((i) => i.slug === slug);
}

export function getInvestigationById(
  id: string,
): ObservatoryInvestigation | undefined {
  return INVESTIGATIONS.find((i) => i.id === id);
}

export function getRelatedInvestigations(
  investigation: ObservatoryInvestigation,
): ObservatoryInvestigation[] {
  return investigation.relatedIds
    .map((id) => INVESTIGATIONS.find((i) => i.id === id))
    .filter((i): i is ObservatoryInvestigation => i !== undefined);
}

export function getFieldObservations(): FieldObservation[] {
  return FIELD_OBSERVATIONS;
}

export function getEvidenceLinks(): EvidenceLink[] {
  return EVIDENCE_LINKS;
}

export function getEvidenceForInvestigation(
  investigationId: string,
): EvidenceLink[] {
  return EVIDENCE_LINKS.filter((e) => e.investigationId === investigationId);
}
