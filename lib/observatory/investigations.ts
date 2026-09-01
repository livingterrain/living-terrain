/**
 * Observatory V1 — Investigations are rare and earned.
 *
 * None have earned a live notebook from documented observations yet.
 * Dissolved shells kept for old URLs only.
 */

import {
  getObservationsByIds,
  type Observation,
} from "./observations";

export type InvestigationStatus =
  | "forming"
  | "active"
  | "dormant"
  | "dissolved";

export interface DownstreamEcho {
  label: string;
  href: string;
  kind: "essay" | "map" | "atlas";
}

export interface ObservatoryInvestigation {
  id: string;
  slug: string;
  title?: string | null;
  question?: string | null;
  status: InvestigationStatus;
  revised?: string | null;
  description?: string | null;
  whisper?: string | null;
  observationIds: string[];
  nearbyIds?: string[];
  downstreamEchoes?: DownstreamEcho[];
}

export function statusLabel(status: InvestigationStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "forming":
      return "Forming";
    case "dormant":
      return "Dormant";
    case "dissolved":
      return "Dissolved";
  }
}

export function echoKindLabel(kind: DownstreamEcho["kind"]): string {
  switch (kind) {
    case "essay":
      return "Essay";
    case "map":
      return "Map";
    case "atlas":
      return "Atlas";
  }
}

/** Live notebooks — empty until real observations force one */
export const INVESTIGATIONS: ObservatoryInvestigation[] = [];

/** Dissolved — history only */
export const DISSOLVED_INVESTIGATIONS: ObservatoryInvestigation[] = [
  {
    id: "inv-barriers",
    slug: "dissolving-barriers",
    title: "Dissolving Barriers",
    status: "dissolved",
    revised: "May 2026",
    description: "Dissolved. Premature.",
    whisper: "Dissolved.",
    observationIds: [],
  },
  {
    id: "inv-sleep",
    slug: "sleep-as-system-reorganization",
    title: "Sleep as System Reorganization",
    status: "dissolved",
    revised: "April 2026",
    description: "Dissolved. Premature.",
    whisper: "Dissolved.",
    observationIds: [],
  },
  {
    id: "inv-fragility",
    slug: "american-fragility",
    title: "American Fragility",
    status: "dissolved",
    revised: "June 2026",
    description: "Dissolved. Premature.",
    whisper: "Dissolved.",
    observationIds: [],
  },
  {
    id: "inv-recurrence",
    slug: "organizational-recurrence",
    title: "Organizational Recurrence",
    status: "dissolved",
    revised: "July 2026",
    description: "Dissolved. Premature.",
    whisper: "Dissolved.",
    observationIds: [],
  },
  {
    id: "inv-priorities",
    slug: "shifting-priorities",
    title: "Shifting Priorities",
    status: "dissolved",
    revised: "March 2026",
    description: "Dissolved. Premature.",
    whisper: "Dissolved.",
    observationIds: [],
  },
  {
    id: "inv-chakras",
    slug: "chakras-as-organizational-maps",
    title: "Chakras as Organizational Maps",
    status: "dissolved",
    revised: "August 2026",
    description: "Dissolved. Premature.",
    whisper: "Dissolved.",
    observationIds: [],
  },
];

export function getInvestigations(): ObservatoryInvestigation[] {
  return INVESTIGATIONS.filter(
    (i) => i.status === "active" || i.status === "forming",
  );
}

export function getInvestigationBySlug(
  slug: string,
): ObservatoryInvestigation | undefined {
  return (
    INVESTIGATIONS.find((i) => i.slug === slug) ??
    DISSOLVED_INVESTIGATIONS.find((i) => i.slug === slug)
  );
}

export function getInvestigationById(
  id: string,
): ObservatoryInvestigation | undefined {
  return (
    INVESTIGATIONS.find((i) => i.id === id) ??
    DISSOLVED_INVESTIGATIONS.find((i) => i.id === id)
  );
}

export function getRelatedInvestigations(
  investigation: ObservatoryInvestigation,
): ObservatoryInvestigation[] {
  return (investigation.nearbyIds ?? [])
    .map((id) => getInvestigationById(id))
    .filter(
      (i): i is ObservatoryInvestigation =>
        i !== undefined &&
        (i.status === "active" || i.status === "forming"),
    );
}

export function getInvestigationObservations(
  investigation: ObservatoryInvestigation,
): Observation[] {
  return getObservationsByIds(investigation.observationIds);
}

/** @deprecated — use echoKindLabel */
export function evidenceKindLabel(
  kind: DownstreamEcho["kind"] | "book" | "note" | "reference",
): string {
  if (kind === "book") return "Map";
  if (kind === "note") return "Note";
  if (kind === "reference") return "Reference";
  return echoKindLabel(kind);
}
