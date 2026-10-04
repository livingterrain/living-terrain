"use client";

import {
  getSpiralStage,
  type SpiralLens,
  type SpiralSequenceStop,
  type SpiralTrajectory,
  type SpiralTrajectoryResonance,
} from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";
import { SpiralInvestigate } from "./SpiralInvestigate";

type Props = {
  lens: SpiralLens;
  trajectory: SpiralTrajectory | undefined;
  /** Resonances for the selected operation — marks passages, never signs. */
  resonances: readonly SpiralTrajectoryResonance[];
  researchedStops: readonly SpiralSequenceStop[];
  selectedOccurrenceId: string;
  onSelectOccurrence: (occurrenceId: string) => void;
  /** Lens-level research — scoped to the lens, survives operation changes. */
  researchOpen: boolean;
  onResearchToggle: () => void;
  researchConceptId: string | null;
  onResearchConceptChange: (conceptId: string | null) => void;
  researchId: string;
};

function stopName(stop: SpiralSequenceStop): string {
  return stop.labelOverride ?? getSpiralStage(stop.stageId)?.name ?? stop.stageId;
}

/** Compact whole trajectory. Resonance is drawn on the arrow between steps. */
function TrajectoryStrip({
  trajectory,
  resonances,
}: {
  trajectory: SpiralTrajectory;
  resonances: readonly SpiralTrajectoryResonance[];
}) {
  return (
    <ol className="spiral-trajectory__steps" aria-label={trajectory.title}>
      {trajectory.steps.map((step, index) => {
        const prev = trajectory.steps[index - 1];
        const passage = prev
          ? resonances.find((r) => r.from === prev.id && r.to === step.id)
          : undefined;
        return (
          <li
            key={step.id}
            className={cn(
              "spiral-trajectory__step",
              step.recurrence && "spiral-trajectory__step--recurrence",
            )}
          >
            {index > 0 && (
              <span
                className={cn(
                  "spiral-trajectory__arrow",
                  passage && `spiral-trajectory__arrow--${passage.strength}`,
                )}
                aria-hidden="true"
              >
                →
              </span>
            )}
            <span className="spiral-trajectory__label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Whole-lens context — belongs to the instrument, not the selected operation.
 * A trajectory stays mounted while operations change.
 */
export function SpiralLensContext({
  lens,
  trajectory,
  resonances,
  researchedStops,
  selectedOccurrenceId,
  onSelectOccurrence,
  researchOpen,
  onResearchToggle,
  researchConceptId,
  onResearchConceptChange,
  researchId,
}: Props) {
  const research = lens.research;
  const researchCount = research?.concepts.length ?? 0;
  const others = researchedStops.filter(
    (s) => s.occurrenceId !== selectedOccurrenceId,
  );

  return (
    <section
      className={cn(
        "spiral-lens-context",
        lens.status === "scaffold" && "spiral-lens-context--scaffold",
      )}
      aria-label={`${lens.label} — whole-Spiral view`}
      data-lens={lens.id}
      data-trajectory={trajectory?.id}
    >
      <p className="spiral-lens-context__intro">{lens.intro}</p>

      {trajectory ? (
        <div className="spiral-trajectory">
          <p className="spiral-trajectory__title">{trajectory.title}</p>
          <TrajectoryStrip trajectory={trajectory} resonances={resonances} />
          <p className="spiral-trajectory__note">{trajectory.note}</p>
        </div>
      ) : lens.forthcoming && lens.forthcoming.length > 0 ? (
        <p className="spiral-lens-context__forthcoming">
          <span className="spiral-lens-context__forthcoming-label">
            Whole-Spiral trajectories still being mapped:
          </span>{" "}
          {lens.forthcoming.join(" · ")}
        </p>
      ) : null}

      <p className="spiral-lens-context__evidence">{lens.evidence}</p>

      {research && (
        <div className="spiral-lens-context__research">
          <button
            type="button"
            className="spiral-op__investigate-toggle"
            aria-expanded={researchOpen}
            aria-controls={researchId}
            onClick={onResearchToggle}
          >
            <span className="spiral-op__investigate-title">
              {lens.label} research
            </span>
            <span className="spiral-op__investigate-lead">
              {research.title} · {researchCount} concept
              {researchCount === 1 ? "" : "s"} · sources
            </span>
          </button>
          <div
            id={researchId}
            className="spiral-lens-context__research-body"
            hidden={!researchOpen}
          >
            {researchOpen && (
              <SpiralInvestigate
                exploration={research}
                conceptId={researchConceptId}
                onConceptChange={onResearchConceptChange}
              />
            )}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <p className="spiral-lens-context__researched">
          <span>Researched in depth so far at </span>
          {others.map((stop, i) => (
            <span key={stop.occurrenceId}>
              {i > 0 && ", "}
              <button
                type="button"
                className="spiral-lens-context__jump"
                onClick={() => onSelectOccurrence(stop.occurrenceId)}
              >
                {stopName(stop)}
              </button>
            </span>
          ))}
          <span>.</span>
        </p>
      )}
    </section>
  );
}
