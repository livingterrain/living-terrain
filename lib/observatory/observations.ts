/**
 * Observatory — NOTICE.
 *
 * Render only material Chelsea wrote, said, or explicitly approved.
 * Exact source wording for published notes. No invented dates.
 * No AI paraphrase in the live feed.
 *
 * Provenance rule (stricter than “exists in the repo”):
 * 1. Chelsea explicitly authenticates the fragment; or
 * 2. Exact language traces to Chelsea’s published essay/book; or
 * 3. Exact language traces to a real conversation, journal, note,
 *    transcript, or other source created by Chelsea.
 * Text that only appeared in earlier AI-assisted Living Terrain
 * scaffolding is not trusted.
 */

export type ObservationStatus =
  | "open"
  | "returning"
  | "held"
  | "dormant"
  | "discarded";

export type ObservationVisibility = "public" | "private";
export type ObservationProvenance = "chelsea" | "visitor";

export type ObservationForm =
  | "observation"
  | "fragment"
  | "question"
  | "pattern"
  | "quote"
  | "contradiction"
  | "anomaly";

export interface Observation {
  id: string;
  body: string;
  /** Only when source establishes a date — never invented */
  noticedAt?: string | null;
  lastSeenAt?: string | null;
  timesSeen: number;
  status: ObservationStatus;
  form?: ObservationForm;
  uncertainty?: string | null;
  contradicts?: string[];
  echoes?: string[];
  investigationIds?: string[];
  returningWords?: string[];
  visibility: ObservationVisibility;
  provenance: ObservationProvenance;
  /** Human-readable provenance for integrity audits */
  source?: string;
}

/**
 * Live Observatory feed — verified / grounded only.
 *
 * Sources:
 * - User-approved fragments (2026-08-11 session)
 * - Exact sentences from published constraint essay (e1 / Medium)
 */
export const OBSERVATIONS: Observation[] = [
  {
    id: "obs-action-layer",
    body: "The more powerful the action layer becomes, the more accurate the perception and judgment layers have to be.",
    timesSeen: 1,
    status: "open",
    form: "fragment",
    visibility: "public",
    provenance: "chelsea",
    source: "Chelsea — authenticated fragment, 2026-08-11",
  },
  {
    id: "obs-power-discernment",
    body: "Power does not reduce the need for discernment. Power multiplies the consequences of its absence.",
    timesSeen: 1,
    status: "open",
    form: "fragment",
    visibility: "public",
    provenance: "chelsea",
    source: "Chelsea — authenticated fragment, 2026-08-11",
  },
  {
    id: "obs-heart-authority",
    body: "For most of my life, I assumed important things required a central authority issuing instructions. A boss. A leader. A brain. Something in charge.\n\nThen I learned that the heart does not wait for permission from the brain to beat.",
    timesSeen: 1,
    status: "open",
    form: "quote",
    visibility: "public",
    provenance: "chelsea",
    source:
      "atlas essay e1 / constraint-is-not-the-opposite-of-freedom (exact consecutive sentences; Medium-published)",
  },
];

export function getObservations(): Observation[] {
  return OBSERVATIONS;
}

export function getPublicObservations(): Observation[] {
  return OBSERVATIONS.filter((o) => o.visibility === "public");
}

export function getBenchObservations(): Observation[] {
  return getPublicObservations().filter((o) => o.status !== "dormant");
}

export function getObservationById(id: string): Observation | undefined {
  return OBSERVATIONS.find((o) => o.id === id);
}

export function getObservationsByIds(ids: string[]): Observation[] {
  return ids
    .map((id) => getObservationById(id))
    .filter((o): o is Observation => o !== undefined);
}

export function observationCue(o: Observation): string | undefined {
  switch (o.status) {
    case "returning":
      return o.timesSeen >= 3 ? "Seen again" : "Returning";
    case "discarded":
      return "Discarded";
    case "held":
      return "Held";
    case "open":
      return o.timesSeen > 1 ? "Seen again" : undefined;
    default:
      return undefined;
  }
}

/** Display date only when source established an exact date (ISO yyyy-mm-dd). */
export function observationWhen(o: Observation): string | undefined {
  const raw = o.lastSeenAt || o.noticedAt;
  if (!raw) return undefined;
  const full = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (full) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const mi = Number(full[2]) - 1;
    const day = Number(full[3]);
    if (mi >= 0 && mi < 12) return `${months[mi]} ${day}, ${full[1]}`;
  }
  // Reject approximate yyyy-mm aesthetic dates — unknown is better
  return undefined;
}
