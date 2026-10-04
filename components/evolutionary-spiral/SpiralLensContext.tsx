"use client";

import { useRef, type KeyboardEvent } from "react";
import {
  anchorLabel,
  getSpiralStage,
  occurrencesForRelationship,
  relationshipStatusLabel,
  type SpiralLens,
  type SpiralLensId,
  type SpiralSequenceStop,
  type SpiralSourceRef,
  type SpiralTrajectory,
  type SpiralTrajectoryRelationship,
} from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";
import { SpiralAcrossScaffold } from "./SpiralAcrossScaffold";
import { SpiralInvestigate } from "./SpiralInvestigate";
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
  onSelectStep: (stepId: string | null) => void;
  /** Relationships touching the selected step. */
  stepRelationships: readonly SpiralTrajectoryRelationship[];
  researchedStops: readonly SpiralSequenceStop[];
  onSelectOccurrence: (occurrenceId: string) => void;
  onSelectLens: (lensId: SpiralLensId) => void;
  researchOpen: boolean;
  onResearchToggle: () => void;
  researchConceptId: string | null;
  onResearchConceptChange: (conceptId: string | null) => void;
  researchId: string;
};

function stopName(stop: SpiralSequenceStop): string {
  return stop.labelOverride ?? getSpiralStage(stop.stageId)?.name ?? stop.stageId;
}

function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => (
          <p key={p.slice(0, 48)} className={className}>
            {p}
          </p>
        ))}
    </>
  );
}

function SourceList({ sources }: { sources: readonly SpiralSourceRef[] }) {
  return (
    <ul className="spiral-trajectory__sources">
      {sources.map((s) => (
        <li key={s.id}>
          {s.title ?? s.supports}
          {s.authors ? ` — ${s.authors}` : ""}
          {s.year ? ` (${s.year})` : ""}
        </li>
      ))}
    </ul>
  );
}

/** Operations the trajectory has authored relationships with — never inferred. */
function RelationshipSummary({
  relationships,
  onSelectOccurrence,
}: {
  relationships: readonly SpiralTrajectoryRelationship[];
  onSelectOccurrence: (occurrenceId: string) => void;
}) {
  if (relationships.length === 0) {
    return (
      <p className="spiral-trajectory__summary">
        No authored relationships with the Spiral yet.
      </p>
    );
  }
  const counts = new Map<string, { stop: SpiralSequenceStop; n: number }>();
  for (const r of relationships) {
    for (const stop of occurrencesForRelationship(r)) {
      const prev = counts.get(stop.occurrenceId);
      counts.set(stop.occurrenceId, { stop, n: (prev?.n ?? 0) + 1 });
    }
  }
  return (
    <p className="spiral-trajectory__summary">
      <span>Authored relationships with the Spiral: </span>
      {Array.from(counts.values()).map(({ stop, n }, i) => (
        <span key={stop.occurrenceId}>
          {i > 0 && ", "}
          <button
            type="button"
            className="spiral-lens-context__jump"
            onClick={() => onSelectOccurrence(stop.occurrenceId)}
          >
            {stopName(stop)}
          </button>{" "}
          ({n})
        </span>
      ))}
      <span>
        . Everything else is unresearched. No correspondence is assumed, and
        there may be none.
      </span>
    </p>
  );
}

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
 * The active lens laid against the whole Spiral. The trajectory stays whole
 * while operations change; research about it is opt-in.
 */
export function SpiralLensContext({
  lens,
  trajectory,
  onSelectTrajectory,
  relationships,
  activeRelationshipIds,
  selectedStepId,
  onSelectStep,
  stepRelationships,
  researchedStops,
  onSelectOccurrence,
  onSelectLens,
  researchOpen,
  onResearchToggle,
  researchConceptId,
  onResearchConceptChange,
  researchId,
}: Props) {
  if (lens.status === "scaffold") {
    return (
      <section
        className="spiral-lens-context spiral-lens-context--scaffold"
        aria-label={`${lens.label} — comparison scaffold`}
        data-lens={lens.id}
      >
        <SpiralAcrossScaffold onSelectLens={onSelectLens} />
      </section>
    );
  }

  if (!trajectory) {
    return (
      <section
        className="spiral-lens-context"
        aria-label={`${lens.label} — whole-Spiral view`}
        data-lens={lens.id}
      >
        <p className="spiral-lens-context__intro">{lens.intro}</p>
        <p className="spiral-lens-context__progress">
          Trajectory research in progress.
        </p>
        {lens.forthcoming && lens.forthcoming.length > 0 && (
          <p className="spiral-lens-context__forthcoming">
            <span className="spiral-lens-context__forthcoming-label">
              Being considered, not yet mapped:
            </span>{" "}
            {lens.forthcoming.join(" · ")}
          </p>
        )}
        {researchedStops.length > 0 && (
          <p className="spiral-lens-context__researched">
            <span>Stage-level research so far at </span>
            {researchedStops.map((stop, i) => (
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
        <p className="spiral-lens-context__evidence">{lens.evidence}</p>
      </section>
    );
  }

  const selectedStep = selectedStepId
    ? trajectory.steps.find((s) => s.id === selectedStepId)
    : undefined;
  const research = lens.research;
  const conceptCount = research?.concepts.length ?? 0;
  const hasTrajectoryResearch = Boolean(
    trajectory.framing ||
      trajectory.provenanceNote ||
      trajectory.comparisonBreaks ||
      trajectory.openQuestions?.length ||
      trajectory.sources?.length,
  );
  const researchLead = [
    conceptCount > 0 &&
      `${conceptCount} concept${conceptCount === 1 ? "" : "s"}`,
    (trajectory.framing || trajectory.provenanceNote) && "framing",
    trajectory.comparisonBreaks && "where the comparison breaks",
    (trajectory.openQuestions?.length || research?.openQuestions?.length) &&
      "open questions",
    (trajectory.sources?.length || research) && "sources",
  ].filter(Boolean);

  return (
    <section
      className="spiral-lens-context"
      aria-label={`${lens.label} — ${trajectory.title} laid against the whole Spiral`}
      data-lens={lens.id}
      data-trajectory={trajectory.id}
      data-shape={trajectory.shape}
    >
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
      <p className="spiral-trajectory__desc">{trajectory.description}</p>

      <SpiralTrajectoryFigure
        trajectory={trajectory}
        relationships={relationships}
        activeIds={activeRelationshipIds}
        selectedStepId={selectedStepId}
        onSelectStep={onSelectStep}
      />

      <RelationshipSummary
        relationships={relationships}
        onSelectOccurrence={onSelectOccurrence}
      />

      {selectedStep && (
        <div className="spiral-trajectory__step-detail">
          <p className="spiral-trajectory__step-name">{selectedStep.label}</p>
          {stepRelationships.length > 0 ? (
            <ul className="spiral-trajectory__step-rels">
              {stepRelationships.map((r) => (
                <li key={r.id}>
                  {anchorLabel(trajectory, r.anchor)} ·{" "}
                  {occurrencesForRelationship(r).map((stop, i) => (
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
                  ))}{" "}
                  · {relationshipStatusLabel(r.status)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="spiral-trajectory__step-none">
              No authored relationship for this step. No correspondence is
              assumed, and there may be none.
            </p>
          )}
        </div>
      )}

      {trajectory.researchIssues?.map((issue) => (
        <details key={issue.id} className="spiral-trajectory__issue">
          <summary className="spiral-trajectory__issue-summary">
            <span className="spiral-trajectory__issue-label">
              Open research question
            </span>
            <span className="spiral-trajectory__issue-question">
              {issue.question}
            </span>
          </summary>
          {issue.body && (
            <p className="spiral-trajectory__issue-body">{issue.body}</p>
          )}
          {issue.items && (
            <ul className="spiral-trajectory__issue-items">
              {issue.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </details>
      ))}

      <p className="spiral-lens-context__evidence">{lens.evidence}</p>

      {(research || hasTrajectoryResearch) && (
        <div className="spiral-lens-context__research">
          <button
            type="button"
            className="spiral-op__investigate-toggle"
            aria-expanded={researchOpen}
            aria-controls={researchId}
            onClick={onResearchToggle}
          >
            <span className="spiral-op__investigate-title">
              Investigate this trajectory
            </span>
            <span className="spiral-op__investigate-lead">
              {researchLead.join(" · ")}
            </span>
          </button>
          <div
            id={researchId}
            className="spiral-lens-context__research-body"
            hidden={!researchOpen}
          >
            {researchOpen && (
              <>
                {hasTrajectoryResearch && (
                  <div className="spiral-trajectory__research">
                    {trajectory.framing && (
                      <Paragraphs
                        text={trajectory.framing}
                        className="spiral-trajectory__research-body"
                      />
                    )}
                    {trajectory.provenanceNote && (
                      <p className="spiral-trajectory__research-note">
                        {trajectory.provenanceNote}
                      </p>
                    )}
                    {trajectory.comparisonBreaks && (
                      <div className="spiral-trajectory__research-break">
                        <p className="spiral-trajectory__research-label">
                          {trajectory.comparisonBreaks.title ??
                            "Where the comparison breaks"}
                        </p>
                        <Paragraphs
                          text={trajectory.comparisonBreaks.body}
                          className="spiral-trajectory__research-body"
                        />
                      </div>
                    )}
                    {trajectory.openQuestions &&
                      trajectory.openQuestions.length > 0 && (
                        <div>
                          <p className="spiral-trajectory__research-label">
                            Open questions
                          </p>
                          <ul className="spiral-trajectory__issue-items">
                            {trajectory.openQuestions.map((q) => (
                              <li key={q}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {trajectory.sources && trajectory.sources.length > 0 && (
                      <SourceList sources={trajectory.sources} />
                    )}
                  </div>
                )}
                {research && (
                  <SpiralInvestigate
                    exploration={research}
                    conceptId={researchConceptId}
                    onConceptChange={onResearchConceptChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
