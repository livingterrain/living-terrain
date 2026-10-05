import type {
  SpiralRelationshipStatus,
  SpiralTrajectoryRelationship,
} from "../types";

/**
 * The one authority on what a comparison record is.
 *
 * Drawing is opt-in: only statuses listed in DRAWABLE_RELATIONSHIP_STATUSES
 * may produce an ordinary arc or be presented as a relationship. Anything not
 * listed — including a status that reaches runtime without being classified —
 * is neither a relationship nor a break, and draws nothing.
 *
 * Silence (no record) is not represented here at all: it is not a finding.
 */

/** Affirmative relationship statuses approved to draw ordinary arcs. */
export const DRAWABLE_RELATIONSHIP_STATUSES = [
  "strong-empirical",
  "candidate",
  "structural",
  "symbolic-analogy",
  "textual-theological",
  "context",
  "ambiguous",
] as const satisfies readonly SpiralRelationshipStatus[];

/** Statuses recording that an investigated resemblance does not hold. */
export const COMPARISON_BREAK_STATUSES = [
  "comparison-break",
] as const satisfies readonly SpiralRelationshipStatus[];

type Classified =
  | (typeof DRAWABLE_RELATIONSHIP_STATUSES)[number]
  | (typeof COMPARISON_BREAK_STATUSES)[number];

/**
 * Compile-time guard: a status added to the union does not build until it is
 * classified here. Classification is a decision, not a default; a status that
 * is neither drawable nor a break needs its own non-drawing list.
 */
const everyStatusClassified: [Exclude<SpiralRelationshipStatus, Classified>] extends [never]
  ? true
  : never = true;
void everyStatusClassified;

const DRAWABLE: ReadonlySet<string> = new Set(DRAWABLE_RELATIONSHIP_STATUSES);
const BREAK: ReadonlySet<string> = new Set(COMPARISON_BREAK_STATUSES);

export type SpiralComparisonFindingKind = "relationship" | "comparison-break";

/** What a record asserts — undefined for anything not explicitly classified. */
export function comparisonFindingKind(
  r: Pick<SpiralTrajectoryRelationship, "status">,
): SpiralComparisonFindingKind | undefined {
  if (DRAWABLE.has(r.status)) return "relationship";
  if (BREAK.has(r.status)) return "comparison-break";
  return undefined;
}

/** An affirmative relationship: the only record that may draw an ordinary arc. */
export function isDrawableRelationship(
  r: Pick<SpiralTrajectoryRelationship, "status">,
): boolean {
  return comparisonFindingKind(r) === "relationship";
}

/** A comparison break: an investigated resemblance that fails. Never drawn as an arc. */
export function isComparisonBreak(
  r: Pick<SpiralTrajectoryRelationship, "status">,
): boolean {
  return comparisonFindingKind(r) === "comparison-break";
}

/** Records with an explicit classification; anything else is left out of presentation. */
export function isComparisonFinding(
  r: Pick<SpiralTrajectoryRelationship, "status">,
): boolean {
  return comparisonFindingKind(r) !== undefined;
}
