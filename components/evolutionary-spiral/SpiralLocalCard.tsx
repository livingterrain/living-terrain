"use client";

import { forwardRef, type ReactNode } from "react";
import {
  SPIRAL_RELATIONSHIP_STATUS,
  anchorLabel,
  anchorStepIds,
  epistemicLabel,
  getIntersection,
  getSpiralStage,
  getStageExploration,
  incomingEdges,
  microcopyForStop,
  occurrencesForRelationship,
  outgoingEdges,
  relationshipStatusLabel,
  relationshipsForStep,
  relationshipsForTrajectory,
  resolveRelationshipConcept,
  returningEdgeIds,
  topologySource,
  transitionForResonance,
  type SpiralIntersection,
  type SpiralLens,
  type SpiralLensExploration,
  type SpiralScaleRef,
  type SpiralSequenceStop,
  type SpiralTrajectory,
  type SpiralTrajectoryEdge,
  type SpiralTrajectoryOutcome,
  type SpiralTrajectoryRelationship,
} from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";
import { SpiralInvestigate } from "./SpiralInvestigate";

export type SpiralFocus =
  | { kind: "operation"; stop: SpiralSequenceStop }
  | { kind: "step"; stepId: string }
  | { kind: "transition"; edge: SpiralTrajectoryEdge }
  | { kind: "relationship"; relationship: SpiralTrajectoryRelationship };

/** Domain outcomes in plain words — never Spiral operation names. */
const OUTCOME_PHRASE: Record<SpiralTrajectoryOutcome, string> = {
  continues: "continues",
  recovery: "recovery",
  reorganization: "reorganization",
  "regime-shift": "regime shift",
  collapse: "collapse",
  stall: "stall",
  fragmentation: "fragmentation",
  failure: "failure within the observed window",
};

type Props = {
  focus: SpiralFocus;
  lens: SpiralLens | undefined;
  trajectory: SpiralTrajectory | undefined;
  intersection: SpiralIntersection | undefined;
  onSelectOccurrence: (occurrenceId: string) => void;
  onSelectRelationship: (relationshipId: string) => void;
  onSelectStep: (stepId: string) => void;
  onSelectEdge: (edgeId: string) => void;
  /** Authored relationships for the whole trajectory. */
  relationshipCount: number;
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

function isBreak(r: SpiralTrajectoryRelationship): boolean {
  return r.status === "comparison-break";
}

function ScaleLine({ scale }: { scale: SpiralScaleRef }) {
  return (
    <p className="spiral-card__scale">
      <span className="spiral-op__def-label">Scale: </span>
      {scale.id.replace(/-/g, " ")}.{scale.note ? ` ${scale.note}` : null}
    </p>
  );
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
                {isBreak(r) ? " · comparison breaks at " : " ↔ "}
                {occurrencesForRelationship(r).map(stopName).join(", ")}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Authored transitions into or out of a step; each opens its own view. */
function TransitionList({
  label,
  edges,
  trajectory,
  direction,
  onSelectEdge,
}: {
  label: string;
  edges: readonly SpiralTrajectoryEdge[];
  trajectory: SpiralTrajectory;
  direction: "in" | "out";
  onSelectEdge: (edgeId: string) => void;
}) {
  if (edges.length === 0) return null;
  const name = (id: string) => trajectory.steps.find((s) => s.id === id)?.label ?? id;
  return (
    <div className="spiral-card__paths">
      <p className="spiral-card__with-label">{label}</p>
      <ul className="spiral-card__anchors">
        {edges.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              className="spiral-card__anchor"
              onClick={() => onSelectEdge(e.id)}
            >
              {direction === "in" ? name(e.from) : name(e.to)}
              {direction === "out" && e.outcome && (
                <span className="spiral-card__outcome"> · {OUTCOME_PHRASE[e.outcome]}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const UNRELATED_TRAJECTORY =
  "Charted independently. No Spiral relationships have been authored for this trajectory yet.";

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
    onSelectStep,
    onSelectEdge,
    relationshipCount,
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
                  {relationshipCount === 0
                    ? "No Spiral relationships have been authored for this trajectory yet."
                    : "No researched relationship with this trajectory."}
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
    const explicit = topologySource(trajectory) === "explicit";
    const incoming = explicit ? incomingEdges(trajectory, step.id) : [];
    const outgoing = explicit ? outgoingEdges(trajectory, step.id) : [];
    label = `${step.label}, ${trajectory.title}`;
    body = (
      <>
        <header className="spiral-op__head">
          <p className="spiral-op__folio type-folio">
            {explicit
              ? trajectory.title
              : `${trajectory.title} · ${index + 1} of ${trajectory.steps.length}`}
          </p>
          <h3 className="spiral-op__title">{step.label}</h3>
          {step.gloss && <p className="spiral-op__micro">{step.gloss}</p>}
        </header>
        {explicit && outgoing.length === 0 && (
          <p className="spiral-card__open">
            Authored evidence stops here. The observed future remains uncertain.
          </p>
        )}
        {explicit && (
          <>
            <TransitionList
              label="Arrives from"
              edges={incoming}
              trajectory={trajectory}
              direction="in"
              onSelectEdge={onSelectEdge}
            />
            <TransitionList
              label="Leads to"
              edges={outgoing}
              trajectory={trajectory}
              direction="out"
              onSelectEdge={onSelectEdge}
            />
          </>
        )}
        {related.length > 0 ? (
          <AnchorList
            relationships={related}
            trajectory={trajectory}
            onSelectRelationship={onSelectRelationship}
            withOperations
          />
        ) : (
          <p className="spiral-card__status">
            {relationshipCount === 0
              ? UNRELATED_TRAJECTORY
              : "No researched relationship with the Spiral here."}
          </p>
        )}
      </>
    );
  } else if (focus.kind === "transition" && trajectory) {
    const { edge } = focus;
    const name = (id: string) => trajectory.steps.find((s) => s.id === id)?.label ?? id;
    const returns = returningEdgeIds(trajectory).has(edge.id);
    const sources = edge.sources ?? [];
    const onEdge = relationshipsForTrajectory(trajectory.id).filter((r) => {
      if (r.anchor.kind === "step") return false;
      const ids = anchorStepIds(trajectory, r.anchor);
      return ids.some((id, i) => id === edge.from && ids[i + 1] === edge.to);
    });
    label = `${name(edge.from)} to ${name(edge.to)}, transition in ${trajectory.title}`;
    body = (
      <>
        <header className="spiral-op__head">
          <p className="spiral-op__folio type-folio">{trajectory.title} · transition</p>
          <h3 className="spiral-op__title spiral-card__transition">
            <button
              type="button"
              className="spiral-card__anchor"
              onClick={() => onSelectStep(edge.from)}
            >
              {name(edge.from)}
            </button>
            <span aria-hidden="true"> → </span>
            <span className="sr-only"> to </span>
            <button
              type="button"
              className="spiral-card__anchor"
              onClick={() => onSelectStep(edge.to)}
            >
              {name(edge.to)}
            </button>
          </h3>
          {(edge.outcome || returns) && (
            <p className="spiral-op__micro">
              {edge.outcome && <>Outcome: {OUTCOME_PHRASE[edge.outcome]}</>}
              {edge.outcome && returns && " · "}
              {returns && "returns to an earlier step"}
            </p>
          )}
        </header>
        {edge.conditions && (
          <p className="spiral-card__conditions">
            <span className="spiral-op__def-label">Conditions: </span>
            {edge.conditions}
          </p>
        )}
        {edge.epistemicKinds && edge.epistemicKinds.length > 0 && (
          <p className="spiral-op__rel-meta">
            {edge.epistemicKinds.map(epistemicLabel).join(" · ")}
          </p>
        )}
        {onEdge.length > 0 && (
          <div className="spiral-card__with">
            <p className="spiral-card__with-label">With the Spiral</p>
            <AnchorList
              relationships={onEdge}
              trajectory={trajectory}
              onSelectRelationship={onSelectRelationship}
              withOperations
            />
          </div>
        )}
        {sources.length > 0 && (
          <Investigate
            open={investigateOpen}
            onToggle={() => onInvestigateToggle()}
            id={investigateId}
            lead={`${sources.length} source${sources.length === 1 ? "" : "s"} for this transition`}
          >
            <ul className="spiral-trajectory__sources spiral-card__sources">
              {sources.map((s) => (
                <li key={s.id}>
                  {s.title ?? s.supports}
                  {s.authors ? ` — ${s.authors}` : ""}
                  {s.year ? ` (${s.year})` : ""}
                  {s.title && s.supports && (
                    <span className="spiral-card__source-supports"> {s.supports}</span>
                  )}
                </li>
              ))}
            </ul>
          </Investigate>
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
    const broken = isBreak(r);
    const question = broken
      ? undefined
      : (exploration?.title ??
        (first ? `Where does ${opName} appear within ${trajectory.inPhrase}?` : undefined));
    const line = relationshipLine(r, lens);
    const status = SPIRAL_RELATIONSHIP_STATUS[r.status];
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
    const anchor = anchorLabel(trajectory, r.anchor);
    label = `${anchor}, ${broken ? "comparison break" : "researched relationship"}`;
    body = (
      <>
        <header className="spiral-op__head">
          <p className="spiral-op__folio type-folio">{trajectory.title}</p>
          <h3 className="spiral-op__title">{anchor}</h3>
        </header>
        <p className={cn("spiral-card__bridge", broken && "spiral-card__bridge--break")}>
          <span aria-hidden="true">{broken ? "Comparison breaks at " : "↔ "}</span>
          <span className="sr-only">
            {broken ? "Comparison break with " : "Researched relationship with "}
          </span>
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
        {r.note && <p className="spiral-card__note">{r.note}</p>}
        {r.scale && <ScaleLine scale={r.scale} />}
        {question && <p className="spiral-card__question">{question}</p>}
        <Explore open={exploreOpen} onToggle={onExploreToggle} id={exploreId}>
          {line && !r.note && (
            <p className="spiral-op__rel-line spiral-card__note">{line}</p>
          )}
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
          {research && (
            <Investigate
              open={investigateOpen}
              onToggle={() => onInvestigateToggle(conceptHint)}
              id={investigateId}
              lead={
                owned?.scope === "trajectory"
                  ? "what is compared · evidence · limits · sources"
                  : investigateLead(research.concepts.length)
              }
            >
              <SpiralInvestigate
                exploration={research}
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
      tabIndex={-1}
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
