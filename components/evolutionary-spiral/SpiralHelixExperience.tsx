"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  defaultExploreView,
  getStageExploration,
  SPIRAL_DEFAULT_OCCURRENCE_ID,
  SPIRAL_SEQUENCE,
  stageHasDeepExploration,
  getSpiralStage,
  type SpiralExploreViewId,
} from "@/lib/evolutionary-spiral";
import { SpiralHelix } from "./SpiralHelix";
import { SpiralStageExplorer } from "./SpiralStageExplorer";
import { SpiralStagePanel } from "./SpiralStagePanel";
import { SpiralStageRail } from "./SpiralStageRail";
import { cn } from "@/lib/utils";

/**
 * Client island: helix + rail share occurrenceId.
 * Deep stages also hold an independent lens/view id — changing lenses
 * never alters the selected Spiral occurrence.
 */
export function SpiralHelixExperience() {
  const panelId = useId();
  const exploreAnchorRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState(SPIRAL_DEFAULT_OCCURRENCE_ID);
  const [exploreView, setExploreView] = useState<SpiralExploreViewId>("systems");
  /** Concept deep-dive id — null means concept index (or Across). */
  const [conceptId, setConceptId] = useState<string | null>(null);

  const selected =
    SPIRAL_SEQUENCE.find((s) => s.occurrenceId === selectedId) ??
    SPIRAL_SEQUENCE[0]!;
  const stage = getSpiralStage(selected.stageId);
  const deep = stageHasDeepExploration(selected.stageId);
  const exploration = deep
    ? getStageExploration(selected.stageId)
    : undefined;

  // When entering a deep stage, seed a valid default lens and clear concept.
  // occurrenceId stays under selectedId — never altered by lens/concept.
  useEffect(() => {
    if (!deep) {
      setConceptId(null);
      return;
    }
    setExploreView(defaultExploreView(selected.stageId));
    setConceptId(null);
  }, [deep, selected.stageId]);

  const handleSelectOccurrence = (occurrenceId: string) => {
    setSelectedId(occurrenceId);
    // concept cleared by effect when stageId changes; clear eagerly for same-stage no-ops
    setConceptId(null);
  };

  const scrollExploreIntoView = () => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      exploreAnchorRef.current?.scrollIntoView({
        block: "nearest",
        behavior: reduce ? "auto" : "smooth",
      });
    });
  };

  const handleConceptChange = (next: string | null) => {
    setConceptId(next);
    // Keep path / lens rail in view when entering or leaving a deep dive.
    scrollExploreIntoView();
  };

  const handleViewChange = (next: SpiralExploreViewId) => {
    setConceptId(null);
    setExploreView(next);
    scrollExploreIntoView();
  };

  return (
    <section
      className={cn(
        "spiral-experience",
        deep && "spiral-experience--deep",
        conceptId && "spiral-experience--concept-dive",
      )}
      aria-label="Evolutionary Spiral instrument"
      data-stage={selected.stageId}
      data-occurrence={selected.occurrenceId}
      data-explore-view={deep ? exploreView : undefined}
      data-concept={deep ? (conceptId ?? undefined) : undefined}
    >
      <header className="spiral-experience__head">
        <h2 className="spiral-page__section-title">The instrument</h2>
        <p className="spiral-page__section-lead">
          Two currents wind through one developmental process. Select a stage to
          see the local state of the whole — not a part where one current takes
          over.
          {deep
            ? " Transformation opens a deeper exploration: hold the stage, rotate the lens, enter a concept."
            : null}
        </p>
      </header>

      <SpiralStageRail
        sequence={SPIRAL_SEQUENCE}
        selectedId={selectedId}
        onSelect={handleSelectOccurrence}
      />

      <div className="spiral-experience__stage">
        <div className="spiral-experience__figure">
          <SpiralHelix
            sequence={SPIRAL_SEQUENCE}
            selectedId={selectedId}
            onSelect={handleSelectOccurrence}
            panelId={panelId}
          />
        </div>

        {deep && exploration ? (
          <div ref={exploreAnchorRef} className="spiral-experience__explore-anchor">
            <SpiralStageExplorer
              stop={selected}
              exploration={exploration}
              viewId={exploreView}
              onViewChange={handleViewChange}
              conceptId={conceptId}
              onConceptChange={handleConceptChange}
              panelId={panelId}
            />
          </div>
        ) : (
          <SpiralStagePanel stop={selected} panelId={panelId} />
        )}
      </div>

      <p className="spiral-experience__selected-sr sr-only">
        Selected: {selected.labelOverride ?? stage?.name}.{" "}
        {stage?.whisper}
        {deep ? ` Exploring through ${exploreView} lens.` : null}
        {conceptId ? ` Concept ${conceptId}.` : null}
      </p>
    </section>
  );
}
