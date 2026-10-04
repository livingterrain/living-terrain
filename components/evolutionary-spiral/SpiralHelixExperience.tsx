"use client";

import { useId, useMemo, useRef, useState } from "react";
import {
  defaultTrajectoryId,
  getIntersection,
  getSpiralLens,
  getSpiralStage,
  getTrajectory,
  occurrencesForRelationship,
  relationshipsForStep,
  relationshipsForTrajectory,
  researchedStopsForLens,
  SPIRAL_DEFAULT_OCCURRENCE_ID,
  SPIRAL_SEQUENCE,
  type SpiralLensId,
  type SpiralTrajectoryRelationship,
} from "@/lib/evolutionary-spiral";
import { SpiralHelix } from "./SpiralHelix";
import { SpiralLensContext } from "./SpiralLensContext";
import { SpiralLensRail } from "./SpiralLensRail";
import { SpiralOperationPanel } from "./SpiralOperationPanel";
import { SpiralStageRail } from "./SpiralStageRail";

function occurrenceIdsFor(
  relationships: readonly SpiralTrajectoryRelationship[],
): Set<string> {
  return new Set(
    relationships.flatMap((r) =>
      occurrencesForRelationship(r).map((s) => s.occurrenceId),
    ),
  );
}

/**
 * Client island. Independent state:
 * - selectedOccurrenceId — a coordinate on the reference Spiral
 * - activeLensId / activeTrajectoryId — survive operation changes
 * - selectedStepId — a step of the active trajectory; survives operation changes
 * - exploreOpen / investigateOpen / conceptId — local to lens × operation
 * - lensResearchOpen / lensConceptId — trajectory research; survives operation changes
 */
export function SpiralHelixExperience() {
  const panelId = useId();
  const exploreId = useId();
  const investigateId = useId();
  const lensResearchId = useId();
  const sideRef = useRef<HTMLDivElement>(null);
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState(
    SPIRAL_DEFAULT_OCCURRENCE_ID,
  );
  const [activeLensId, setActiveLensId] = useState<SpiralLensId | null>(null);
  const [activeTrajectoryId, setActiveTrajectoryId] = useState<string | null>(
    null,
  );
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [investigateOpen, setInvestigateOpen] = useState(false);
  const [conceptId, setConceptId] = useState<string | null>(null);
  const [lensResearchOpen, setLensResearchOpen] = useState(false);
  const [lensConceptId, setLensConceptId] = useState<string | null>(null);

  const selected =
    SPIRAL_SEQUENCE.find((s) => s.occurrenceId === selectedOccurrenceId) ??
    SPIRAL_SEQUENCE[0]!;
  const stage = getSpiralStage(selected.stageId);
  const lens = activeLensId ? getSpiralLens(activeLensId) : undefined;
  const trajectory = activeLensId
    ? getTrajectory(activeLensId, activeTrajectoryId)
    : undefined;
  const intersection = activeLensId
    ? getIntersection(activeLensId, selected, trajectory)
    : undefined;

  const relationships = useMemo(
    () => relationshipsForTrajectory(trajectory?.id),
    [trajectory],
  );
  const stepRelationships = useMemo(
    () =>
      trajectory && selectedStepId
        ? relationshipsForStep(trajectory, selectedStepId)
        : [],
    [trajectory, selectedStepId],
  );
  const operationRelationships = intersection?.resonances ?? [];
  const activeRelationshipIds = new Set(
    [...operationRelationships, ...stepRelationships].map((r) => r.id),
  );
  const relatedIds = useMemo(() => occurrenceIdsFor(relationships), [relationships]);
  const emphasizedIds = useMemo(
    () => occurrenceIdsFor(stepRelationships),
    [stepRelationships],
  );
  const researchedStops = useMemo(
    () => (activeLensId ? researchedStopsForLens(activeLensId) : []),
    [activeLensId],
  );
  const railMarks = trajectory
    ? relatedIds
    : new Set(researchedStops.map((s) => s.occurrenceId));

  const resetLocal = () => {
    setExploreOpen(false);
    setInvestigateOpen(false);
    setConceptId(null);
  };

  const handleSelectOccurrence = (occurrenceId: string) => {
    setSelectedOccurrenceId(occurrenceId);
    resetLocal();
  };

  const handleLensSelect = (next: SpiralLensId | null) => {
    setActiveLensId(next);
    setActiveTrajectoryId(next ? defaultTrajectoryId(next) : null);
    setSelectedStepId(null);
    setLensResearchOpen(false);
    setLensConceptId(null);
    resetLocal();
  };

  const handleTrajectorySelect = (trajectoryId: string) => {
    setActiveTrajectoryId(trajectoryId);
    setSelectedStepId(null);
    setLensResearchOpen(false);
    setLensConceptId(null);
    resetLocal();
  };

  const scrollResearchIntoView = (selector: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      const target = sideRef.current?.querySelector<HTMLElement>(selector);
      target?.scrollIntoView({
        block: "start",
        behavior: reduce ? "auto" : "smooth",
      });
    });
  };

  const handleConceptChange = (next: string | null) => {
    setConceptId(next);
    scrollResearchIntoView(".spiral-op__investigate-body");
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

  const name = selected.labelOverride ?? stage?.name;

  return (
    <section
      className="spiral-experience"
      aria-label="Evolutionary Spiral instrument"
      data-stage={selected.stageId}
      data-occurrence={selected.occurrenceId}
      data-lens={activeLensId ?? undefined}
      data-trajectory={trajectory?.id}
      data-step={selectedStepId ?? undefined}
      data-concept={conceptId ?? undefined}
      data-lens-concept={lensConceptId ?? undefined}
    >
      <div className="spiral-experience__stage">
        <div className="spiral-experience__figure">
          <a href="#spiral-lenses" className="spiral-experience__lens-cue">
            Explore through different lenses <span aria-hidden="true">↓</span>
          </a>
          <SpiralHelix
            sequence={SPIRAL_SEQUENCE}
            selectedId={selectedOccurrenceId}
            onSelect={handleSelectOccurrence}
            panelId={panelId}
            lensLabel={lens?.label}
            trajectoryLabel={trajectory?.title}
            relatedIds={relatedIds}
            emphasizedIds={emphasizedIds}
          />
        </div>

        <div ref={sideRef} className="spiral-experience__side">
          <SpiralLensRail
            activeLensId={activeLensId}
            onSelect={handleLensSelect}
          />

          {lens && (
            <SpiralLensContext
              lens={lens}
              trajectory={trajectory}
              onSelectTrajectory={handleTrajectorySelect}
              relationships={relationships}
              activeRelationshipIds={activeRelationshipIds}
              selectedStepId={selectedStepId}
              onSelectStep={setSelectedStepId}
              stepRelationships={stepRelationships}
              researchedStops={researchedStops}
              onSelectOccurrence={handleSelectOccurrence}
              onSelectLens={handleLensSelect}
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

          <div className="spiral-experience__operation">
            <SpiralStageRail
              sequence={SPIRAL_SEQUENCE}
              selectedId={selectedOccurrenceId}
              onSelect={handleSelectOccurrence}
              markedIds={railMarks}
              markLabel={
                trajectory
                  ? `authored relationship with ${trajectory.title}`
                  : lens
                    ? `${lens.label} stage-level research`
                    : undefined
              }
            />
            <SpiralOperationPanel
              stop={selected}
              lens={lens}
              trajectory={trajectory}
              intersection={intersection}
              exploreOpen={exploreOpen}
              onExploreToggle={() => {
                setExploreOpen((open) => !open);
                setInvestigateOpen(false);
                setConceptId(null);
              }}
              investigateOpen={investigateOpen}
              onInvestigateToggle={() => {
                setInvestigateOpen((open) => !open);
                setConceptId(null);
              }}
              conceptId={conceptId}
              onConceptChange={handleConceptChange}
              onOpenConcept={handleOpenConcept}
              panelId={panelId}
              exploreId={exploreId}
              investigateId={investigateId}
            />
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {name}: {stage ? (selected.microcopyOverride ?? stage.microcopy) : null}
        {lens
          ? ` Viewing through ${lens.label}${trajectory ? `, ${trajectory.title}` : ""}.`
          : null}
        {trajectory
          ? ` ${operationRelationships.length} authored relationship${
              operationRelationships.length === 1 ? "" : "s"
            } here.`
          : null}
      </p>
    </section>
  );
}
