"use client";

import { forwardRef, type ReactNode } from "react";
import {
  SPIRAL_RELATIONSHIP_STATUS,
  anchorLabel,
  epistemicLabel,
  getIntersection,
  getSpiralStage,
  getStageExploration,
  microcopyForStop,
  occurrencesForRelationship,
  relationshipStatusLabel,
  relationshipsForStep,
  transitionForResonance,
  type SpiralIntersection,
  type SpiralLens,
  type SpiralSequenceStop,
  type SpiralTrajectory,
  type SpiralTrajectoryRelationship,
} from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";
import { SpiralInvestigate } from "./SpiralInvestigate";

export type SpiralFocus =
  | { kind: "operation"; stop: SpiralSequenceStop }
  | { kind: "step"; stepId: string }
  | { kind: "relationship"; relationship: SpiralTrajectoryRelationship };

type Props = {
  focus: SpiralFocus;
  lens: SpiralLens | undefined;
  trajectory: SpiralTrajectory | undefined;
  intersection: SpiralIntersection | undefined;
  onSelectOccurrence: (occurrenceId: string) => void;
  onSelectRelationship: (relationshipId: string) => void;
  onClose: () => void;
  exploreOpen: boolean;
  onExploreToggle: () => void;
  investigateOpen: boolean;
  /** Optional concept to open at — the research carrying a relationship. */
  onInvestigateToggle: (conceptHint?: string) => void;
  conceptId: string | null;
  onConceptChange: (conceptId: string | null) => void;
  onOpenConcept: (conceptId: string) => void;
  cardId: string;
  exploreId: string;
  investigateId: string;
};

const GUARDRAIL =
  "Structural resemblance is a reason to investigate—not evidence that the structures share a cause.";

function firstParagraph(text: string | undefined): string | undefined {
  return text?.split(/\n\n+/)[0]?.trim() || undefined;
}

function stopName(stop: SpiralSequenceStop): string {
  return stop.labelOverride ?? getSpiralStage(stop.stageId)?.name ?? stop.stageId;
}

function relationshipLine(
  r: SpiralTrajectoryRelationship,
  lens: SpiralLens,
): string | undefined {
  return r.note ?? firstParagraph(transitionForResonance(r, lens.id)?.body);
}

function Explore({
  open,
  onToggle,
  id,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="spiral-op__explore">
      <button
        type="button"
        className="spiral-op__explore-toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
      >
        Explore
        <span aria-hidden="true">{open ? " ↑" : " →"}</span>
      </button>
      <div id={id} className="spiral-op__explore-body" hidden={!open}>
        {open && children}
      </div>
    </div>
  );
}

function Investigate({
  open,
  onToggle,
  id,
  lead,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  id: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <div className="spiral-op__investigate">
      <button
        type="button"
        className="spiral-op__investigate-toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
      >
        <span className="spiral-op__investigate-title">Investigate</span>
        <span className="spiral-op__investigate-lead">{lead}</span>
      </button>
      <div id={id} className="spiral-op__investigate-body" hidden={!open}>
        {open && children}
      </div>
    </div>
  );
}

/** Status, epistemic kinds, and the authored line — Explore depth. */
function RelationshipList({
  relationships,
  trajectory,
  lens,
  hasConcept,
  onOpenConcept,
  onSelectRelationship,
}: {
  relationships: readonly SpiralTrajectoryRelationship[];
  trajectory: SpiralTrajectory;
  lens: SpiralLens;
  hasConcept: (conceptId: string) => boolean;
  onOpenConcept: (conceptId: string) => void;
  onSelectRelationship: (relationshipId: string) => void;
}) {
  return (
    <ul className="spiral-op__rels">
      {relationships.map((r) => {
        const line = relationshipLine(r, lens);
        return (
          <li key={r.id} className={`spiral-op__rel spiral-rel--${r.status}`}>
            <p className="spiral-op__rel-head">
              <button
                type="button"
                className="spiral-op__rel-anchor spiral-card__anchor"
                onClick={() => onSelectRelationship(r.id)}
              >
                {anchorLabel(trajectory, r.anchor)}
              </button>
              <span className="spiral-op__rel-status">
                {relationshipStatusLabel(r.status)}
              </span>
            </p>
            {line && <p className="spiral-op__rel-line">{line}</p>}
            {r.epistemicKinds && r.epistemicKinds.length > 0 && (
              <p className="spiral-op__rel-meta">
                {r.epistemicKinds.map(epistemicLabel).join(" · ")}
              </p>
            )}
            {r.conceptId && hasConcept(r.conceptId) && (
              <button
                type="button"
                className="spiral-lens-context__jump spiral-op__rel-concept"
                onClick={() => onOpenConcept(r.conceptId!)}
              >
                Read the research behind this
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function AnchorList({
  relationships,
  trajectory,
  onSelectRelationship,
  withOperations,
}: {
  relationships: readonly SpiralTrajectoryRelationship[];
  trajectory: SpiralTrajectory;
  onSelectRelationship: (relationshipId: string) => void;
  withOperations?: boolean;
}) {
  return (
    <ul className="spiral-card__anchors">
      {relationships.map((r) => (
        <li key={r.id}>
          <button
            type="button"
            className="spiral-card__anchor"
            onClick={() => onSelectRelationship(r.id)}
          >
            {anchorLabel(trajectory, r.anchor)}
            {withOperations && (
              <span className="spiral-card__anchor-op">
                {" "}
                ↔ {occurrencesForRelationship(r).map(stopName).join(", ")}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

function investigateLead(conceptCount: number): string {
  return `${conceptCount} research concept${conceptCount === 1 ? "" : "s"} · sources · where the comparison breaks · open questions`;
}

/**
 * Local discovery — appears only after the visitor selects an operation, a
 * trajectory step, or a relationship. Name and invitation first; Explore and
 * Investigate open on request.
 */
export const SpiralLocalCard = forwardRef<HTMLElement, Props>(function SpiralLocalCard(
  {
    focus,
    lens,
    trajectory,
    intersection,
    onSelectOccurrence,
    onSelectRelationship,
    onClose,
    exploreOpen,
    onExploreToggle,
    investigateOpen,
    onInvestigateToggle,
    conceptId,
    onConceptChange,
    onOpenConcept,
    cardId,
    exploreId,
    investigateId,
  },
  ref,
) {
  let label = "";
  let body: ReactNode = null;

  if (focus.kind === "operation") {
    const { stop } = focus;
    const stage = getSpiralStage(stop.stageId);
    if (!stage) return null;
    const name = stopName(stop);
    const isAgain = stop.cycleIndex > 0;
    label = `${name}, selected operation`;
    const exploration = intersection?.exploration;
    const across =
      lens?.id === "across" && intersection?.hasAcross
        ? getStageExploration(stop.stageId)?.across
        : undefined;
    const relationships = intersection?.resonances ?? [];
    const examples = intersection?.examples ?? [];
    const conceptCount = exploration?.concepts.length ?? 0;
    const lede = exploration
      ? (exploration.lede ?? firstParagraph(exploration.framing))
      : undefined;
    const hasConcept = (id: string) =>
      Boolean(exploration?.concepts.some((c) => c.id === id));
    const canExplore = Boolean(
      exploration || across || examples.length > 0 || relationships.length > 0,
    );
    const question =
      lens && lens.status !== "scaffold" && canExplore
        ? (exploration?.title ??
          `Where does ${name} appear within ${trajectory?.inPhrase ?? lens.inPhrase}?`)
        : undefined;

    body = (
      <>
        <header className="spiral-op__head">
          <p className="spiral-op__folio type-folio">
            {String(stop.order).padStart(2, "0")}
            {isAgain ? " · later turn" : null}
          </p>
          <h3 className="spiral-op__title">{name}</h3>
          <p className="spiral-op__micro">{microcopyForStop(stop)}</p>
        </header>

        {isAgain && (
          <p className="spiral-op__again">
            The same operation as the first Emergence, at a later turn—not a
            return to the identical beginning.
          </p>
        )}

        {!lens ? (
          <Explore open={exploreOpen} onToggle={onExploreToggle} id={exploreId}>
            <p className="spiral-op__def">
              <span className="spiral-op__def-label">{name}, defined: </span>
              {stage.definition}
            </p>
          </Explore>
        ) : (
          <>
            {lens.status === "scaffold" ? (
              <p className="spiral-card__status">
                Across compares whole trajectories, not single operations.
              </p>
            ) : trajectory ? (
              relationships.length > 0 ? (
                !exploreOpen && (
                  <div className="spiral-card__with">
                    <p className="spiral-card__with-label">
                      With {trajectory.title}
                    </p>
                    <AnchorList
                      relationships={relationships}
                      trajectory={trajectory}
                      onSelectRelationship={onSelectRelationship}
                    />
                  </div>
                )
              ) : (
                <p className="spiral-card__status">
                  No researched relationship with this trajectory.
                </p>
              )
            ) : (
              <p className="spiral-card__status">
                No {lens.label} trajectory is charted yet.
              </p>
            )}

            {question && <p className="spiral-card__question">{question}</p>}

            {canExplore && (
              <Explore open={exploreOpen} onToggle={onExploreToggle} id={exploreId}>
                {trajectory && relationships.length > 0 && (
                  <RelationshipList
                    relationships={relationships}
                    trajectory={trajectory}
                    lens={lens}
                    hasConcept={hasConcept}
                    onOpenConcept={onOpenConcept}
                    onSelectRelationship={onSelectRelationship}
                  />
                )}
                {lede && <p className="spiral-op__lede">{lede}</p>}
                <p className="spiral-op__def">
                  <span className="spiral-op__def-label">{name}, defined: </span>
                  {stage.definition}
                </p>
                {examples.length > 0 && (
                  <div className="spiral-op__examples">
                    {examples.map((example) => (
                      <div key={example.id} className="spiral-op__example">
                        <p className="spiral-op__example-meta">
                          Example · {epistemicLabel(example.epistemicKind)}
                        </p>
                        <h4 className="spiral-op__example-title">{example.title}</h4>
                        <p className="spiral-op__example-body">{example.body}</p>
                      </div>
                    ))}
                  </div>
                )}
                {across && (
                  <p className="spiral-op__empty">
                    Placeholder scaffolding exists here. Nothing is concluded yet.
                  </p>
                )}
                {lens.status !== "scaffold" && (
                  <p className="spiral-op__guardrail">{GUARDRAIL}</p>
                )}
                {(exploration || across) && (
                  <Investigate
                    open={investigateOpen}
                    onToggle={() => onInvestigateToggle()}
                    id={investigateId}
                    lead={
                      exploration
                        ? investigateLead(conceptCount)
                        : "Across scaffold · placeholders only"
                    }
                  >
                    <SpiralInvestigate
                      exploration={exploration}
                      across={across}
                      conceptId={conceptId}
                      onConceptChange={onConceptChange}
                    />
                  </Investigate>
                )}
              </Explore>
            )}
          </>
        )}
      </>
    );
  } else if (focus.kind === "step" && trajectory) {
    const index = trajectory.steps.findIndex((s) => s.id === focus.stepId);
    const step = trajectory.steps[index];
    if (!step) return null;
    const related = relationshipsForStep(trajectory, step.id);
    label = `${step.label}, ${trajectory.title}`;
    body = (
      <>
        <header className="spiral-op__head">
          <p className="spiral-op__folio type-folio">
            {trajectory.title} · {index + 1} of {trajectory.steps.length}
          </p>
          <h3 className="spiral-op__title">{step.label}</h3>
        </header>
        {related.length > 0 ? (
          <AnchorList
            relationships={related}
            trajectory={trajectory}
            onSelectRelationship={onSelectRelationship}
            withOperations
          />
        ) : (
          <p className="spiral-card__status">
            No researched relationship with the Spiral here.
          </p>
        )}
      </>
    );
  } else if (focus.kind === "relationship" && trajectory && lens) {
    const r = focus.relationship;
    const stops = occurrencesForRelationship(r);
    const first = stops[0];
    const local = first ? getIntersection(lens.id, first, trajectory) : undefined;
    const exploration = local?.exploration;
    const opName = first ? stopName(first) : "";
    const stage = first ? getSpiralStage(first.stageId) : undefined;
    const question =
      exploration?.title ??
      (first ? `Where does ${opName} appear within ${trajectory.inPhrase}?` : undefined);
    const line = relationshipLine(r, lens);
    const status = SPIRAL_RELATIONSHIP_STATUS[r.status];
    const conceptHint =
      r.conceptId && exploration?.concepts.some((c) => c.id === r.conceptId)
        ? r.conceptId
        : undefined;
    const anchor = anchorLabel(trajectory, r.anchor);
    label = `${anchor}, researched relationship`;
    body = (
      <>
        <header className="spiral-op__head">
          <p className="spiral-op__folio type-folio">{trajectory.title}</p>
          <h3 className="spiral-op__title">{anchor}</h3>
        </header>
        <p className="spiral-card__bridge">
          <span aria-hidden="true">↔ </span>
          <span className="sr-only">Researched relationship with </span>
          {stops.map((stop, i) => (
            <span key={stop.occurrenceId}>
              {i > 0 && ", "}
              <button
                type="button"
                className="spiral-card__anchor"
                onClick={() => onSelectOccurrence(stop.occurrenceId)}
              >
                {stopName(stop)}
              </button>
            </span>
          ))}
        </p>
        {question && <p className="spiral-card__question">{question}</p>}
        <Explore open={exploreOpen} onToggle={onExploreToggle} id={exploreId}>
          {line && <p className="spiral-op__rel-line spiral-card__note">{line}</p>}
          <p className="spiral-op__rel-meta">
            {status.label} — {status.definition}
            {r.epistemicKinds && r.epistemicKinds.length > 0
              ? ` · ${r.epistemicKinds.map(epistemicLabel).join(" · ")}`
              : null}
          </p>
          {stage && (
            <p className="spiral-op__def">
              <span className="spiral-op__def-label">{opName}, defined: </span>
              {stage.definition}
            </p>
          )}
          {trajectory.researchIssues?.map((issue) => (
            <details key={issue.id} className="spiral-trajectory__issue">
              <summary className="spiral-trajectory__issue-summary">
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
          <p className="spiral-op__guardrail">{GUARDRAIL}</p>
          {exploration && (
            <Investigate
              open={investigateOpen}
              onToggle={() => onInvestigateToggle(conceptHint)}
              id={investigateId}
              lead={investigateLead(exploration.concepts.length)}
            >
              <SpiralInvestigate
                exploration={exploration}
                conceptId={conceptId}
                onConceptChange={onConceptChange}
              />
            </Investigate>
          )}
        </Explore>
      </>
    );
  } else {
    return null;
  }

  return (
    <section
      ref={ref}
      id={cardId}
      className={cn(
        "spiral-card",
        (exploreOpen || investigateOpen) && "spiral-card--expanded",
      )}
      aria-label={label}
      data-focus={focus.kind}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      <button
        type="button"
        className="spiral-card__close"
        onClick={onClose}
        aria-label="Close and return to the whole Spiral"
      >
        <span aria-hidden="true">×</span>
      </button>
      {body}
    </section>
  );
});
