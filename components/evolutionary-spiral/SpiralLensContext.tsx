"use client";

import { useMemo, useRef, type KeyboardEvent } from "react";
import {
  lensDiscovery,
  type SpiralLens,
  type SpiralLensId,
  type SpiralTrajectory,
  type SpiralTrajectoryRelationship,
} from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";
import { AcrossIndex, AcrossMinis } from "./SpiralAcrossScaffold";
import { SpiralDepth } from "./SpiralDepth";
import { SpiralTrajectoryFigure } from "./SpiralTrajectoryFigure";

const SHAPE_LABEL: Record<SpiralTrajectory["shape"], string> = {
  cyclical: "Cyclical",
  directional: "Directional",
  branching: "Branching",
  recurrent: "Recurrent",
  process: "Process",
};

type Props = {
  lens: SpiralLens;
  trajectory: SpiralTrajectory | undefined;
  onSelectTrajectory: (trajectoryId: string) => void;
  relationships: readonly SpiralTrajectoryRelationship[];
  activeRelationshipIds: ReadonlySet<string>;
  selectedStepId: string | null;
  onSelectStep: (stepId: string) => void;
  selectedEdgeId: string | null;
  onSelectEdge: (edgeId: string) => void;
  onSelectRelationship: (relationshipId: string) => void;
  onSelectOccurrence: (occurrenceId: string) => void;
  onSelectLens: (lensId: SpiralLensId) => void;
  /** One deeper surface per context: hidden while a local card holds its own. */
  showInvestigate: boolean;
  exploreOpen: boolean;
  onExploreToggle: () => void;
  exploreId: string;
  researchOpen: boolean;
  onResearchToggle: () => void;
  researchConceptId: string | null;
  onResearchConceptChange: (conceptId: string | null) => void;
  researchId: string;
};

function TrajectoryTabs({
  lens,
  activeId,
  onSelect,
}: {
  lens: SpiralLens;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, index: number) => {
    const n = lens.trajectories.length;
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % n;
    else if (e.key === "ArrowLeft") next = (index - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    onSelect(lens.trajectories[next]!.id);
    refs.current[next]?.focus();
  };
  return (
    <div
      className="spiral-trajectory__tabs"
      role="tablist"
      aria-label={`${lens.label} trajectories`}
    >
      {lens.trajectories.map((t, i) => {
        const selected = t.id === activeId;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            className={cn(
              "spiral-trajectory__tab",
              selected && "spiral-trajectory__tab--selected",
            )}
            onClick={() => onSelect(t.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.shortTitle ?? t.title}
          </button>
        );
      })}
    </div>
  );
}

/**
 * The active lens laid against the whole Spiral, through the shared depth
 * model: the lens's own caveat and the figure first; Explore and Investigate
 * open on request.
 */
export function SpiralLensContext({
  lens,
  trajectory,
  onSelectTrajectory,
  relationships,
  activeRelationshipIds,
  selectedStepId,
  onSelectStep,
  selectedEdgeId,
  onSelectEdge,
  onSelectRelationship,
  onSelectOccurrence,
  onSelectLens,
  showInvestigate,
  exploreOpen,
  onExploreToggle,
  exploreId,
  researchOpen,
  onResearchToggle,
  researchConceptId,
  onResearchConceptChange,
  researchId,
}: Props) {
  const discovery = useMemo(() => lensDiscovery(lens, trajectory), [lens, trajectory]);

  const depth = (
    <SpiralDepth
      discovery={discovery}
      variant="lens"
      showDeeper={showInvestigate}
      exploreOpen={exploreOpen}
      onExploreToggle={onExploreToggle}
      exploreId={exploreId}
      investigateOpen={researchOpen}
      onInvestigateToggle={onResearchToggle}
      investigateId={researchId}
      conceptId={researchConceptId}
      onConceptChange={onResearchConceptChange}
      onSelectOccurrence={onSelectOccurrence}
      places={{
        minis: <AcrossMinis onSelectLens={onSelectLens} />,
        "across-index": <AcrossIndex onSelectLens={onSelectLens} />,
        "trajectory-head": trajectory && (
          <>
            {lens.trajectories.length > 1 && (
              <TrajectoryTabs
                lens={lens}
                activeId={trajectory.id}
                onSelect={onSelectTrajectory}
              />
            )}
            <header className="spiral-trajectory__head">
              <h3 className="spiral-trajectory__title">
                <span className="spiral-trajectory__lens">{lens.label}</span>
                <span aria-hidden="true"> / </span>
                <span className="sr-only">: </span>
                {trajectory.title}
              </h3>
              <span className="spiral-trajectory__shape">
                {SHAPE_LABEL[trajectory.shape]}
              </span>
            </header>
          </>
        ),
        figure: trajectory && (
          <SpiralTrajectoryFigure
            trajectory={trajectory}
            relationships={relationships}
            activeIds={activeRelationshipIds}
            selectedStepId={selectedStepId}
            onSelectStep={onSelectStep}
            selectedEdgeId={selectedEdgeId}
            onSelectEdge={onSelectEdge}
            onSelectRelationship={onSelectRelationship}
          />
        ),
      }}
    />
  );

  if (lens.status === "scaffold") {
    return (
      <section
        className="spiral-lens-context spiral-lens-context--scaffold"
        aria-label={`${lens.label}: mapped trajectories side by side`}
        data-lens={lens.id}
      >
        <div className="spiral-across">{depth}</div>
      </section>
    );
  }

  if (!trajectory) {
    return (
      <section
        className="spiral-lens-context spiral-lens-context--uncharted"
        aria-label={`${lens.label}: not yet charted`}
        data-lens={lens.id}
      >
        {depth}
      </section>
    );
  }

  return (
    <section
      className="spiral-lens-context"
      aria-label={`${lens.label}: ${trajectory.title} laid against the whole Spiral`}
      data-lens={lens.id}
      data-trajectory={trajectory.id}
      data-shape={trajectory.shape}
    >
      {depth}
    </section>
  );
}
