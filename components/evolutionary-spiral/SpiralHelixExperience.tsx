"use client";

import { useId, useMemo, useRef, useState } from "react";
import {
  defaultTrajectoryId,
  getIntersection,
  getSpiralLens,
  getSpiralStage,
  getTrajectory,
  intersectionHasMaterial,
  researchedStopsForLens,
  SPIRAL_DEFAULT_OCCURRENCE_ID,
  SPIRAL_SEQUENCE,
  type SpiralLensId,
} from "@/lib/evolutionary-spiral";
import { SpiralHelix } from "./SpiralHelix";
import { SpiralLensContext } from "./SpiralLensContext";
import { SpiralLensRail } from "./SpiralLensRail";
import { SpiralOperationPanel } from "./SpiralOperationPanel";
import { SpiralStageRail } from "./SpiralStageRail";

/**
 * Client island. Four independent pieces of state:
 * - selectedOccurrenceId — the operation used as a coordinate
 * - activeLensId — belongs to the whole helix; survives operation changes
 * - activeTrajectoryId — belongs to the lens; survives operation changes
 * - conceptId / investigateOpen — local to lens × operation
 * - lensResearchOpen / lensConceptId — lens-level research; survives operation changes
 */
export function SpiralHelixExperience() {
  const panelId = useId();
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
  const [conceptId, setConceptId] = useState<string | null>(null);
  const [investigateOpen, setInvestigateOpen] = useState(false);
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

  const researchedStops = useMemo(
    () => (activeLensId ? researchedStopsForLens(activeLensId) : []),
    [activeLensId],
  );
  const markedIds = useMemo(() => {
    if (!activeLensId) return new Set<string>();
    return new Set(
      SPIRAL_SEQUENCE.filter((stop) =>
        intersectionHasMaterial(getIntersection(activeLensId, stop, trajectory)),
      ).map((stop) => stop.occurrenceId),
    );
  }, [activeLensId, trajectory]);

  const handleSelectOccurrence = (occurrenceId: string) => {
    setSelectedOccurrenceId(occurrenceId);
    setConceptId(null);
    setInvestigateOpen(false);
  };

  const handleLensSelect = (next: SpiralLensId | null) => {
    setActiveLensId(next);
    setActiveTrajectoryId(next ? defaultTrajectoryId(next) : null);
    setConceptId(null);
    setInvestigateOpen(false);
    setLensResearchOpen(false);
    setLensConceptId(null);
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
      data-trajectory={activeTrajectoryId ?? undefined}
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
          />
        </div>

        <div ref={sideRef} className="spiral-experience__side">
          <SpiralLensRail
            activeLensId={activeLensId}
            onSelect={handleLensSelect}
          />

          {lens ? (
            <SpiralLensContext
              lens={lens}
              trajectory={trajectory}
              resonances={intersection?.resonances ?? []}
              researchedStops={researchedStops}
              selectedOccurrenceId={selectedOccurrenceId}
              onSelectOccurrence={handleSelectOccurrence}
              researchOpen={lensResearchOpen}
              onResearchToggle={() => {
                setLensResearchOpen((open) => !open);
                setLensConceptId(null);
              }}
              researchConceptId={lensConceptId}
              onResearchConceptChange={handleLensConceptChange}
              researchId={lensResearchId}
            />
          ) : (
            <p className="spiral-lens-rail__hint">
              Each lens is laid across the whole helix. Pick one, then move
              between operations—the lens stays.
            </p>
          )}

          <div className="spiral-experience__operation">
            <SpiralStageRail
              sequence={SPIRAL_SEQUENCE}
              selectedId={selectedOccurrenceId}
              onSelect={handleSelectOccurrence}
              markedIds={markedIds}
              lensLabel={lens?.label}
            />
            <SpiralOperationPanel
              stop={selected}
              lens={lens}
              trajectory={trajectory}
              intersection={intersection}
              investigateOpen={investigateOpen}
              onInvestigateToggle={() => {
                setInvestigateOpen((open) => !open);
                setConceptId(null);
              }}
              conceptId={conceptId}
              onConceptChange={handleConceptChange}
              panelId={panelId}
              investigateId={investigateId}
            />
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {name}: {stage ? (selected.microcopyOverride ?? stage.microcopy) : null}
        {lens ? ` Viewing through ${lens.label}.` : null}
      </p>
    </section>
  );
}
