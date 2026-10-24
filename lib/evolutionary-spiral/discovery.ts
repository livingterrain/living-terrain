/**
 * Progressive discovery — one depth model for every Spiral surface.
 *
 * Understand (unlabelled, always shown) · Explore · Investigate.
 *
 * The resolver routes authored material into a depth; it never writes prose.
 * A depth with nothing authored is empty, and an empty depth has no control.
 * What carries a claim's weight — its status, its ways of knowing, a comparison
 * break, the lens's evidentiary line — stays at Understand.
 */
import {
  SPIRAL_RELATIONSHIP_STATUS,
  occurrencesForRelationship,
  relationshipsForTrajectory,
} from "./comparisons";
import {
  comparisonFindingKind,
  isComparisonBreak,
  isDrawableRelationship,
  type SpiralComparisonFindingKind,
} from "./comparisons/findings";
import { resolveRelationshipConcept } from "./comparisons/research";
import {
  ACROSS_SYNTHESIS_BOUNDARY,
  SPIRAL_GUARDRAIL,
  TRAJECTORY_TAKEAWAYS,
} from "./copy";
import { knowingFamilies, type SpiralKnowingFamily } from "./epistemic";
import {
  SPIRAL_LENSES,
  getIntersection,
  researchedStopsForLens,
  transitionForResonance,
} from "./lenses";
import { getSpiralStage } from "./stages";
import type {
  SpiralEpistemicKind,
  SpiralLens,
  SpiralLensExploration,
  SpiralScaleRef,
  SpiralSequenceStop,
  SpiralSourceRef,
  SpiralTrajectory,
  SpiralTrajectoryRelationship,
  SpiralTrajectoryResearchIssue,
} from "./types";

/** Interactive pieces a surface renders itself, positioned by the resolver. */
export type SpiralDiscoveryPlace =
  | "trajectory-head"
  | "figure"
  | "card-head"
  | "bridge"
  | "minis"
  | "across-index";

export type SpiralAcrossReading = {
  lensId: SpiralLens["id"];
  lensLabel: string;
  trajectoryTitle: string;
  text: string;
};

export type SpiralDiscoverySlot =
  | { kind: "place"; place: SpiralDiscoveryPlace }
  | { kind: "intro"; text: string }
  /** The lens's evidentiary line; `lensLabel` when shown outside the lens panel. */
  | { kind: "evidence"; text: string; lensLabel?: string }
  | { kind: "description"; text: string }
  | { kind: "uncharted"; forthcoming: readonly string[] }
  | { kind: "key"; lines: boolean; breaks: boolean }
  | { kind: "takeaway"; text: string }
  | {
      kind: "finding";
      finding: SpiralComparisonFindingKind;
      label: string;
      definition: string;
    }
  | { kind: "knowing"; families: readonly SpiralKnowingFamily[] }
  | { kind: "note"; text: string; label?: string }
  | { kind: "scale"; scale: SpiralScaleRef }
  | { kind: "question"; text: string }
  | { kind: "epistemic"; kinds: readonly SpiralEpistemicKind[] }
  | { kind: "definition"; name: string; text: string }
  | { kind: "issues"; issues: readonly SpiralTrajectoryResearchIssue[] }
  | { kind: "guardrail"; text: string }
  | {
      kind: "summary";
      drawn: readonly SpiralTrajectoryRelationship[];
      breaks: readonly SpiralTrajectoryRelationship[];
    }
  | { kind: "framing"; text: string }
  | { kind: "provenance"; text: string }
  | { kind: "breaks"; title: string; body: string }
  /** Opening of the authored breaks section — the full section stays under Investigate. */
  | { kind: "caution"; title: string; text: string }
  | { kind: "open-questions"; items: readonly string[] }
  | { kind: "sources"; sources: readonly SpiralSourceRef[] }
  | { kind: "research"; exploration: SpiralLensExploration; conceptHint?: string }
  | { kind: "researched-stops"; stops: readonly SpiralSequenceStop[] }
  | { kind: "readings"; readings: readonly SpiralAcrossReading[] }
  /** What side-by-side placement does not establish — before anything is compared. */
  | { kind: "boundary"; text: string };

export type SpiralDiscovery = {
  understand: readonly SpiralDiscoverySlot[];
  explore: readonly SpiralDiscoverySlot[];
  investigate: readonly SpiralDiscoverySlot[];
  investigateLead: string;
};

type Maybe<T> = T | false | null | undefined | 0 | "";

function slots(...items: Maybe<SpiralDiscoverySlot>[]): SpiralDiscoverySlot[] {
  return items.filter((s): s is SpiralDiscoverySlot => Boolean(s));
}

function firstParagraph(text: string | undefined): string | undefined {
  return text?.split(/\n\n+/)[0]?.trim() || undefined;
}

function stopName(stop: SpiralSequenceStop): string {
  return stop.labelOverride ?? getSpiralStage(stop.stageId)?.name ?? stop.stageId;
}

/** The authored line for a relationship: its note, else its transition's first paragraph. */
export function relationshipLine(
  r: SpiralTrajectoryRelationship,
  lens: SpiralLens,
): string | undefined {
  return r.note ?? firstParagraph(transitionForResonance(r, lens.id)?.body);
}

export const SYMBOLIC_READING_LABEL = "Symbolic interpretation";

/**
 * A line taken from a lens's symbolic cycle context, not from the record's own
 * note — labelled so it never reads as a plain statement of fact.
 */
export function relationshipLineLabel(
  r: SpiralTrajectoryRelationship,
  lens: SpiralLens,
): string | undefined {
  if (r.note) return undefined;
  return transitionForResonance(r, lens.id) ? SYMBOLIC_READING_LABEL : undefined;
}

/** Lens-level research: the lens's own, else the research owned by its trajectory. */
function trajectoryResearch(
  lens: SpiralLens,
  trajectory: SpiralTrajectory,
): SpiralLensExploration | undefined {
  if (lens.research) return lens.research;
  if (!trajectory.concepts?.length) return undefined;
  return {
    lensId: trajectory.lensId,
    conceptsCue: "Research beneath this trajectory",
    concepts: trajectory.concepts,
  };
}

function acrossReadings(): SpiralAcrossReading[] {
  return SPIRAL_LENSES.filter((l) => l.status !== "scaffold").flatMap((lens) =>
    lens.trajectories.flatMap((t) => {
      const text = TRAJECTORY_TAKEAWAYS[t.id];
      if (!text || !relationshipsForTrajectory(t.id).some(isDrawableRelationship)) return [];
      return [{ lensId: lens.id, lensLabel: lens.label, trajectoryTitle: t.title, text }];
    }),
  );
}

/** A lens panel: Across, an uncharted lens, or a lens with its active trajectory. */
export function lensDiscovery(
  lens: SpiralLens,
  trajectory: SpiralTrajectory | undefined,
): SpiralDiscovery {
  const opening = [
    { kind: "intro", text: lens.intro },
    { kind: "evidence", text: lens.evidence },
  ] as const;

  if (lens.status === "scaffold") {
    const readings = acrossReadings();
    return {
      understand: slots(
        ...opening,
        { kind: "boundary", text: ACROSS_SYNTHESIS_BOUNDARY },
        { kind: "place", place: "minis" },
      ),
      explore: slots(readings.length > 0 && { kind: "readings", readings }),
      investigate: slots({ kind: "place", place: "across-index" }),
      investigateLead: "every lens · what Across will compare",
    };
  }

  if (!trajectory) {
    const stops = researchedStopsForLens(lens.id);
    return {
      understand: slots(...opening, { kind: "uncharted", forthcoming: lens.forthcoming ?? [] }),
      explore: [],
      investigate: slots(stops.length > 0 && { kind: "researched-stops", stops }),
      investigateLead: "stage-level research so far",
    };
  }

  const relationships = relationshipsForTrajectory(trajectory.id);
  const drawn = relationships.filter(isDrawableRelationship);
  const breaks = relationships.filter(isComparisonBreak);
  const takeaway = drawn.length > 0 ? TRAJECTORY_TAKEAWAYS[trajectory.id] : undefined;
  const research = trajectoryResearch(lens, trajectory);
  const breaksTitle = trajectory.comparisonBreaks?.title ?? "Where the comparison breaks";
  const caution = firstParagraph(trajectory.comparisonBreaks?.body);
  const openQuestions =
    trajectory.researchIssues?.length ||
    trajectory.openQuestions?.length ||
    research?.openQuestions?.length;

  return {
    understand: slots(
      ...opening,
      { kind: "place", place: "trajectory-head" },
      { kind: "description", text: trajectory.description },
      { kind: "place", place: "figure" },
      (drawn.length > 0 || breaks.length > 0) && {
        kind: "key",
        lines: drawn.length > 0,
        breaks: breaks.length > 0,
      },
      relationships.length === 0 && { kind: "summary", drawn, breaks },
      caution && { kind: "caution", title: breaksTitle, text: caution },
      takeaway && { kind: "takeaway", text: takeaway },
    ),
    explore: slots(
      relationships.length > 0 && { kind: "summary", drawn, breaks },
      trajectory.framing && { kind: "framing", text: trajectory.framing },
    ),
    investigate: slots(
      trajectory.researchIssues?.length && {
        kind: "issues",
        issues: trajectory.researchIssues,
      },
      trajectory.provenanceNote && { kind: "provenance", text: trajectory.provenanceNote },
      trajectory.comparisonBreaks && {
        kind: "breaks",
        title: breaksTitle,
        body: trajectory.comparisonBreaks.body,
      },
      trajectory.openQuestions?.length && {
        kind: "open-questions",
        items: trajectory.openQuestions,
      },
      trajectory.sources?.length && { kind: "sources", sources: trajectory.sources },
      research && { kind: "research", exploration: research },
    ),
    investigateLead: [
      research?.concepts.length &&
        `${research.concepts.length} concept${research.concepts.length === 1 ? "" : "s"}`,
      trajectory.provenanceNote && "provenance",
      trajectory.comparisonBreaks && "where the comparison breaks",
      openQuestions && "open questions",
      (trajectory.sources?.length || research) && "sources",
    ]
      .filter(Boolean)
      .join(" · "),
  };
}

/** One authored comparison record between a trajectory and the Spiral. */
export function relationshipDiscovery(
  r: SpiralTrajectoryRelationship,
  trajectory: SpiralTrajectory,
  lens: SpiralLens,
): SpiralDiscovery {
  const finding = comparisonFindingKind(r);
  const status = SPIRAL_RELATIONSHIP_STATUS[r.status];
  const first = occurrencesForRelationship(r)[0];
  const stage = first ? getSpiralStage(first.stageId) : undefined;
  const exploration = first ? getIntersection(lens.id, first, trajectory).exploration : undefined;
  const families = knowingFamilies(r.epistemicKinds);
  const line = relationshipLine(r, lens);
  const owned = resolveRelationshipConcept(r, trajectory);
  const research: SpiralLensExploration | undefined =
    owned?.scope === "trajectory"
      ? {
          lensId: trajectory.lensId,
          conceptsCue: "Research behind this comparison",
          concepts: [owned.concept],
        }
      : exploration;
  const conceptHint =
    r.conceptId && research?.concepts.some((c) => c.id === r.conceptId)
      ? r.conceptId
      : undefined;
  const question =
    finding === "relationship" && first
      ? (exploration?.title ?? `Where does ${stopName(first)} appear within ${trajectory.inPhrase}?`)
      : undefined;

  return {
    understand: slots(
      { kind: "place", place: "card-head" },
      { kind: "place", place: "bridge" },
      finding && {
        kind: "finding",
        finding,
        label: status.label,
        definition: status.definition,
      },
      families.length > 0
        ? { kind: "knowing", families }
        : { kind: "evidence", text: lens.evidence, lensLabel: lens.label },
      line && { kind: "note", text: line, label: relationshipLineLabel(r, lens) },
      r.scale && { kind: "scale", scale: r.scale },
      question && { kind: "question", text: question },
    ),
    explore: slots(
      r.epistemicKinds?.length && { kind: "epistemic", kinds: r.epistemicKinds },
      stage && first && { kind: "definition", name: stopName(first), text: stage.definition },
      trajectory.researchIssues?.length && {
        kind: "issues",
        issues: trajectory.researchIssues,
      },
      { kind: "guardrail", text: SPIRAL_GUARDRAIL },
    ),
    investigate: slots(research && { kind: "research", exploration: research, conceptHint }),
    investigateLead:
      owned?.scope === "trajectory"
        ? "what is compared · evidence · limits · sources"
        : `${research?.concepts.length ?? 0} research concept${
            research?.concepts.length === 1 ? "" : "s"
          } · sources · where the comparison breaks · open questions`,
  };
}
