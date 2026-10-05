"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  anchorLabel,
  anchorStepIds,
  defaultTrajectoryId,
  getIntersection,
  getSpiralLens,
  getSpiralStage,
  getTrajectory,
  isComparisonBreak,
  isDrawableRelationship,
  microcopyForStop,
  occurrencesForRelationship,
  relationshipsForStep,
  relationshipsForTrajectory,
  researchedStopsForLens,
  SPIRAL_SEQUENCE,
  type SpiralLensId,
  type SpiralTrajectoryRelationship,
} from "@/lib/evolutionary-spiral";
import { SpiralHelix, SpiralHelixLegend } from "./SpiralHelix";
import { SpiralLensContext } from "./SpiralLensContext";
import { SpiralLensRail } from "./SpiralLensRail";
import { SpiralLocalCard, type SpiralFocus } from "./SpiralLocalCard";
import { SpiralRelationshipArcs, type SpiralArcSpec } from "./SpiralRelationshipArcs";
import { arcEndpointsForTrajectory } from "./spiral-arc-endpoints";

function occurrenceIdsFor(
  relationships: readonly SpiralTrajectoryRelationship[],
): Set<string> {
  return new Set(
    relationships.flatMap((r) =>
      occurrencesForRelationship(r).map((s) => s.occurrenceId),
    ),
  );
}

function stopName(occurrenceId: string): string {
  const stop = SPIRAL_SEQUENCE.find((s) => s.occurrenceId === occurrenceId);
  if (!stop) return occurrenceId;
  return stop.labelOverride ?? getSpiralStage(stop.stageId)?.name ?? stop.stageId;
}

type LocalSelection =
  | { kind: "operation"; id: string }
  | { kind: "step"; id: string }
  | { kind: "transition"; id: string }
  | { kind: "relationship"; id: string }
  | null;

/**
 * Client island. SEE: helix + lens control. DISCOVER: a lens lays its whole
 * trajectory against the Spiral; authored relationships alone draw lines.
 * LOCAL: one selection (operation, step, transition, or relationship) opens a small card.
 * INVESTIGATE: research, on request, one entry per context.
 *
 * - selection — nothing is selected on arrival
 * - activeLensId / activeTrajectoryId — survive operation changes
 * - exploreOpen / investigateOpen / conceptId — local to the selection
 * - lensResearchOpen / lensConceptId — trajectory research, when nothing local is open
 */
export function SpiralHelixExperience() {
  const cardId = useId();
  const exploreId = useId();
  const investigateId = useId();
  const lensResearchId = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const lensScrollPendingRef = useRef(false);
  const [selection, setSelection] = useState<LocalSelection>(null);
  const [activeLensId, setActiveLensId] = useState<SpiralLensId | null>(null);
  const [activeTrajectoryId, setActiveTrajectoryId] = useState<string | null>(
    null,
  );
  const [exploreOpen, setExploreOpen] = useState(false);
  const [investigateOpen, setInvestigateOpen] = useState(false);
  const [conceptId, setConceptId] = useState<string | null>(null);
  const [lensResearchOpen, setLensResearchOpen] = useState(false);
  const [lensConceptId, setLensConceptId] = useState<string | null>(null);

  const lens = activeLensId ? getSpiralLens(activeLensId) : undefined;
  const trajectory = activeLensId
    ? getTrajectory(activeLensId, activeTrajectoryId)
    : undefined;
  const relationships = useMemo(
    () => relationshipsForTrajectory(trajectory?.id),
    [trajectory],
  );

  const selectedStop =
    selection?.kind === "operation"
      ? SPIRAL_SEQUENCE.find((s) => s.occurrenceId === selection.id)
      : undefined;
  const selectedStepId = selection?.kind === "step" ? selection.id : null;
  const selectedEdge =
    selection?.kind === "transition"
      ? trajectory?.transitions?.find((e) => e.id === selection.id)
      : undefined;
  const selectedRelationship =
    selection?.kind === "relationship"
      ? relationships.find((r) => r.id === selection.id)
      : undefined;

  const intersection =
    activeLensId && selectedStop
      ? getIntersection(activeLensId, selectedStop, trajectory)
      : undefined;

  /** Relationships in the current local focus — all of them when nothing is focused. */
  const focusedRelationships = useMemo(() => {
    if (!trajectory) return [];
    if (selectedRelationship) return [selectedRelationship];
    if (selectedStepId) return relationshipsForStep(trajectory, selectedStepId);
    if (selectedEdge)
      return relationships.filter((r) => {
        const ids = anchorStepIds(trajectory, r.anchor);
        return ids.some((id, i) => id === selectedEdge.from && ids[i + 1] === selectedEdge.to);
      });
    if (selectedStop)
      return relationships.filter((r) =>
        occurrencesForRelationship(r).some(
          (s) => s.occurrenceId === selectedStop.occurrenceId,
        ),
      );
    return relationships;
  }, [
    trajectory,
    relationships,
    selectedRelationship,
    selectedStepId,
    selectedEdge,
    selectedStop,
  ]);

  const activeRelationshipIds = useMemo(
    () => new Set(focusedRelationships.map((r) => r.id)),
    [focusedRelationships],
  );
  const relatedIds = useMemo(
    () => occurrenceIdsFor(relationships.filter(isDrawableRelationship)),
    [relationships],
  );
  const emphasizedIds = useMemo(
    () =>
      selectedStepId || selectedEdge || selectedRelationship
        ? occurrenceIdsFor(focusedRelationships)
        : new Set<string>(),
    [selectedStepId, selectedEdge, selectedRelationship, focusedRelationships],
  );
  const researchedStops = useMemo(
    () => (activeLensId ? researchedStopsForLens(activeLensId) : []),
    [activeLensId],
  );

  const arcs: SpiralArcSpec[] = useMemo(() => {
    if (!trajectory) return [];
    return arcEndpointsForTrajectory(trajectory.id).map((end) => {
      const r = relationships.find((x) => x.id === end.relationshipId)!;
      return {
        ...end,
        active: activeRelationshipIds.has(end.relationshipId),
        label: `${anchorLabel(trajectory, r.anchor)} ↔ ${stopName(end.occurrenceId)}`,
      };
    });
  }, [trajectory, relationships, activeRelationshipIds]);

  let focus: SpiralFocus | null = null;
  if (selectedStop) focus = { kind: "operation", stop: selectedStop };
  else if (selectedStepId && trajectory) focus = { kind: "step", stepId: selectedStepId };
  else if (selectedEdge) focus = { kind: "transition", edge: selectedEdge };
  else if (selectedRelationship)
    focus = { kind: "relationship", relationship: selectedRelationship };

  const resetLocal = () => {
    setExploreOpen(false);
    setInvestigateOpen(false);
    setConceptId(null);
  };

  const select = (next: LocalSelection) => {
    if (next && !selection) {
      const active = document.activeElement;
      returnFocusRef.current = active instanceof HTMLElement ? active : null;
    }
    setSelection(next);
    resetLocal();
  };

  const closeCard = () => {
    setSelection(null);
    resetLocal();
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    if (target && target.isConnected) target.focus();
  };

  const handleLensSelect = (next: SpiralLensId | null) => {
    lensScrollPendingRef.current = true;
    setActiveLensId(next);
    setActiveTrajectoryId(next ? defaultTrajectoryId(next) : null);
    setSelection((current) => (current?.kind === "operation" ? current : null));
    setLensResearchOpen(false);
    setLensConceptId(null);
    resetLocal();
  };

  const handleTrajectorySelect = (trajectoryId: string) => {
    setActiveTrajectoryId(trajectoryId);
    setSelection((current) => (current?.kind === "operation" ? current : null));
    setLensResearchOpen(false);
    setLensConceptId(null);
    resetLocal();
  };

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scrollResearchIntoView = (selector: string) => {
    requestAnimationFrame(() => {
      const target = stageRef.current?.querySelector<HTMLElement>(selector);
      target?.scrollIntoView({
        block: "start",
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    });
  };

  const handleConceptChange = (next: string | null) => {
    setConceptId(next);
    scrollResearchIntoView(".spiral-card .spiral-op__investigate-body");
  };

  const handleOpenConcept = (next: string) => {
    setExploreOpen(true);
    setInvestigateOpen(true);
    handleConceptChange(next);
  };

  const handleLensConceptChange = (next: string | null) => {
    setLensConceptId(next);
    scrollResearchIntoView(".spiral-lens-context__research-body");
  };

  /** Desktop: bring the card into view beside the figure. Mobile: it is a sheet. */
  const selectionKey = selection ? `${selection.kind}:${selection.id}` : "";
  useEffect(() => {
    if (!selectionKey) return;
    // Moving within the card can remove the control that held focus.
    if (document.activeElement === document.body) {
      cardRef.current?.focus({ preventScroll: true });
    }
    if (!window.matchMedia("(min-width: 640px)").matches) return;
    cardRef.current?.scrollIntoView({
      block: "nearest",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [selectionKey]);

  /** Narrow screens: bring strip, helix, and trajectory into one view after a lens change. */
  useEffect(() => {
    if (!lensScrollPendingRef.current) return;
    lensScrollPendingRef.current = false;
    if (window.matchMedia("(min-width: 960px)").matches) return;
    railRef.current?.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [activeLensId]);

  const breakCount = relationships.filter(isComparisonBreak).length;
  let announcement = "";
  if (focus?.kind === "operation") {
    announcement = `${stopName(focus.stop.occurrenceId)}: ${microcopyForStop(focus.stop)}`;
    if (trajectory) {
      const drawn = focusedRelationships.filter(isDrawableRelationship).length;
      const breaks = focusedRelationships.filter(isComparisonBreak).length;
      announcement += ` ${
        drawn > 0
          ? `${drawn} researched relationship${drawn === 1 ? "" : "s"} with ${trajectory.title}.`
          : `No researched relationship with ${trajectory.title}.`
      }${breaks > 0 ? ` ${breaks} comparison break${breaks === 1 ? "" : "s"}.` : ""}`;
    }
  } else if (focus?.kind === "step" && trajectory) {
    const step = trajectory.steps.find((s) => s.id === focus.stepId);
    const drawn = focusedRelationships.filter(isDrawableRelationship).length;
    const breaks = focusedRelationships.filter(isComparisonBreak).length;
    announcement = `${step?.label ?? ""}: ${
      drawn + breaks > 0
        ? [
            drawn > 0 && `${drawn} researched relationship${drawn === 1 ? "" : "s"}.`,
            breaks > 0 && `${breaks} comparison break${breaks === 1 ? "" : "s"}.`,
          ]
            .filter(Boolean)
            .join(" ")
        : relationships.length === 0
          ? "no Spiral relationships have been authored for this trajectory yet."
          : "no researched relationship with the Spiral."
    }`;
  } else if (focus?.kind === "transition" && trajectory) {
    const name = (id: string) => trajectory.steps.find((s) => s.id === id)?.label ?? id;
    announcement = `Transition from ${name(focus.edge.from)} to ${name(focus.edge.to)}.`;
  } else if (focus?.kind === "relationship" && trajectory) {
    announcement = `${anchorLabel(trajectory, focus.relationship.anchor)}, ${
      isDrawableRelationship(focus.relationship)
        ? "researched relationship with"
        : "comparison break with"
    } ${occurrencesForRelationship(
      focus.relationship,
    )
      .map((s) => stopName(s.occurrenceId))
      .join(", ")}.`;
  } else if (lens) {
    announcement = trajectory
      ? relationships.length === 0
        ? `${lens.label}: ${trajectory.title}, charted independently. No Spiral relationships have been authored yet.`
        : `${lens.label}: ${trajectory.title} laid against the Spiral. ${
            arcs.length
          } line${arcs.length === 1 ? "" : "s"} mark researched relationships.${
            breakCount > 0
              ? ` ${breakCount} comparison break${
                  breakCount === 1 ? "" : "s"
                } drawn without a line.`
              : ""
          }`
      : lens.status === "scaffold"
        ? `${lens.label}: mapped trajectories side by side.`
        : `${lens.label}: not yet charted.`;
  }

  const layoutKey = [
    activeLensId,
    trajectory?.id,
    selectionKey,
    exploreOpen,
    investigateOpen,
    lensResearchOpen,
  ].join("|");

  return (
    <section
      className="spiral-experience"
      aria-label="Evolutionary Spiral instrument"
      data-occurrence={selectedStop?.occurrenceId}
      data-lens={activeLensId ?? undefined}
      data-trajectory={trajectory?.id}
      data-step={selectedStepId ?? undefined}
      data-transition={selectedEdge?.id}
      data-relationship={selectedRelationship?.id}
      data-concept={conceptId ?? undefined}
      data-lens-concept={lensConceptId ?? undefined}
    >
      <div
        ref={stageRef}
        className={
          focus
            ? "spiral-experience__stage spiral-experience__stage--local"
            : "spiral-experience__stage"
        }
        data-comparing={trajectory ? "" : undefined}
        onKeyDown={(e) => {
          if (e.key === "Escape" && focus) closeCard();
        }}
      >
        <div ref={railRef} className="spiral-experience__rail">
          <SpiralLensRail activeLensId={activeLensId} onSelect={handleLensSelect} />
        </div>

        <div className="spiral-experience__figure">
          <div className="spiral-experience__helix">
            <SpiralHelix
              sequence={SPIRAL_SEQUENCE}
              selectedId={selectedStop?.occurrenceId ?? null}
              onSelect={(id) => select({ kind: "operation", id })}
              quiet={Boolean(lens)}
              trajectoryLabel={trajectory?.title}
              relatedIds={relatedIds}
              emphasizedIds={emphasizedIds}
            />
          </div>
          <div className="spiral-experience__legend">
            <SpiralHelixLegend />
          </div>
        </div>

        <div className="spiral-experience__side">
          {lens && (
            <SpiralLensContext
              lens={lens}
              trajectory={trajectory}
              onSelectTrajectory={handleTrajectorySelect}
              relationships={relationships}
              activeRelationshipIds={activeRelationshipIds}
              selectedStepId={selectedStepId}
              onSelectStep={(id) => select({ kind: "step", id })}
              selectedEdgeId={selectedEdge?.id ?? null}
              onSelectEdge={(id) => select({ kind: "transition", id })}
              onSelectRelationship={(id) => select({ kind: "relationship", id })}
              researchedStops={researchedStops}
              onSelectOccurrence={(id) => select({ kind: "operation", id })}
              onSelectLens={handleLensSelect}
              showInvestigate={!focus}
              researchOpen={lensResearchOpen}
              onResearchToggle={() => {
                setLensResearchOpen((open) => !open);
                setLensConceptId(null);
              }}
              researchConceptId={lensConceptId}
              onResearchConceptChange={handleLensConceptChange}
              researchId={lensResearchId}
            />
          )}

          {focus && (
            <SpiralLocalCard
              ref={cardRef}
              focus={focus}
              lens={lens}
              trajectory={trajectory}
              intersection={intersection}
              onSelectOccurrence={(id) => select({ kind: "operation", id })}
              onSelectRelationship={(id) => select({ kind: "relationship", id })}
              onSelectStep={(id) => select({ kind: "step", id })}
              onSelectEdge={(id) => select({ kind: "transition", id })}
              relationshipCount={relationships.length}
              onClose={closeCard}
              exploreOpen={exploreOpen}
              onExploreToggle={() => {
                setExploreOpen((open) => !open);
                setInvestigateOpen(false);
                setConceptId(null);
              }}
              investigateOpen={investigateOpen}
              onInvestigateToggle={(hint) => {
                setInvestigateOpen((open) => !open);
                setConceptId(investigateOpen ? null : (hint ?? null));
              }}
              conceptId={conceptId}
              onConceptChange={handleConceptChange}
              onOpenConcept={handleOpenConcept}
              cardId={cardId}
              exploreId={exploreId}
              investigateId={investigateId}
            />
          )}
        </div>

        <SpiralRelationshipArcs
          containerRef={stageRef}
          arcs={arcs}
          layoutKey={layoutKey}
          onSelect={(id) => select({ kind: "relationship", id })}
        />
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </section>
  );
}
