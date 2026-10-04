"use client";

import {
  anchorLabel,
  epistemicLabel,
  getStageExploration,
  getSpiralStage,
  microcopyForStop,
  relationshipStatusLabel,
  transitionForResonance,
  type SpiralIntersection,
  type SpiralLens,
  type SpiralSequenceStop,
  type SpiralTrajectory,
  type SpiralTrajectoryRelationship,
} from "@/lib/evolutionary-spiral";
import { SpiralInvestigate } from "./SpiralInvestigate";

type Props = {
  stop: SpiralSequenceStop;
  lens: SpiralLens | undefined;
  trajectory: SpiralTrajectory | undefined;
  intersection: SpiralIntersection | undefined;
  exploreOpen: boolean;
  onExploreToggle: () => void;
  investigateOpen: boolean;
  onInvestigateToggle: () => void;
  conceptId: string | null;
  onConceptChange: (conceptId: string | null) => void;
  /** Open Explore + Investigate at the concept carrying a relationship. */
  onOpenConcept: (conceptId: string) => void;
  panelId: string;
  exploreId: string;
  investigateId: string;
};

const GUARDRAIL =
  "Structural resemblance is a reason to investigate—not evidence that the structures share a cause.";

const NONE_AUTHORED =
  "No authored relationship yet. No correspondence is assumed, and there may be none.";

function firstParagraph(text: string | undefined): string | undefined {
  return text?.split(/\n\n+/)[0]?.trim() || undefined;
}

function RelationshipList({
  relationships,
  trajectory,
  lens,
  hasConcept,
  onOpenConcept,
}: {
  relationships: readonly SpiralTrajectoryRelationship[];
  trajectory: SpiralTrajectory;
  lens: SpiralLens;
  hasConcept: (conceptId: string) => boolean;
  onOpenConcept: (conceptId: string) => void;
}) {
  return (
    <ul className="spiral-op__rels">
      {relationships.map((r) => {
        const line = r.note ?? firstParagraph(transitionForResonance(r, lens.id)?.body);
        return (
          <li key={r.id} className={`spiral-op__rel spiral-rel--${r.status}`}>
            <p className="spiral-op__rel-head">
              <span className="spiral-op__rel-anchor">
                {anchorLabel(trajectory, r.anchor)}
              </span>
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

/**
 * Selected operation — a coordinate on the reference Spiral.
 * Understand: name + microcopy. Explore: compact comparison with the active
 * trajectory. Investigate: research, only on request.
 */
export function SpiralOperationPanel({
  stop,
  lens,
  trajectory,
  intersection,
  exploreOpen,
  onExploreToggle,
  investigateOpen,
  onInvestigateToggle,
  conceptId,
  onConceptChange,
  onOpenConcept,
  panelId,
  exploreId,
  investigateId,
}: Props) {
  const stage = getSpiralStage(stop.stageId);
  if (!stage) return null;

  const name = stop.labelOverride ?? stage.name;
  const isAgain = stop.cycleIndex > 0;
  const exploration = intersection?.exploration;
  const across =
    lens?.id === "across" && intersection?.hasAcross
      ? getStageExploration(stop.stageId)?.across
      : undefined;
  const relationships = intersection?.resonances ?? [];
  const examples = intersection?.examples ?? [];
  const canExplore = Boolean(exploration || across || examples.length > 0);
  const canInvestigate = Boolean(exploration || across);
  const conceptCount = exploration?.concepts.length ?? 0;
  const lede = exploration
    ? (exploration.lede ?? firstParagraph(exploration.framing))
    : undefined;
  const question = !lens
    ? undefined
    : (exploration?.title ??
      (lens.id === "across"
        ? `What actually recurs at ${name} across ${lens.inPhrase}?`
        : `Where does ${name} appear within ${trajectory?.inPhrase ?? lens.inPhrase}?`));
  const hasConcept = (id: string) =>
    Boolean(exploration?.concepts.some((c) => c.id === id));

  let status: string;
  if (!lens) {
    status = "";
  } else if (lens.status === "scaffold") {
    status = "Across compares whole trajectories, not single operations.";
  } else if (trajectory) {
    status =
      relationships.length > 0
        ? "This operation has researched resonances with parts of the trajectory."
        : NONE_AUTHORED;
  } else {
    status = exploration
      ? `No ${lens.label} trajectory is authored yet. ${name} has stage-level research under this lens.`
      : `No ${lens.label} trajectory is authored yet. ${NONE_AUTHORED}`;
  }

  return (
    <article
      id={panelId}
      className="spiral-op"
      aria-label={`Selected operation: ${name}`}
      data-occurrence={stop.occurrenceId}
    >
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
        <details className="spiral-op__definition">
          <summary className="spiral-op__definition-summary">
            Definition
          </summary>
          <p className="spiral-op__def">{stage.definition}</p>
        </details>
      ) : (
        <div className="spiral-op__compare">
          <p className="spiral-op__intersection">
            {lens.label}
            {trajectory ? ` / ${trajectory.title}` : null}
          </p>
          <p className="spiral-op__status">{status}</p>

          {trajectory && relationships.length > 0 && (
            <RelationshipList
              relationships={relationships}
              trajectory={trajectory}
              lens={lens}
              hasConcept={hasConcept}
              onOpenConcept={onOpenConcept}
            />
          )}

          {canExplore && (
            <div className="spiral-op__explore">
              <button
                type="button"
                className="spiral-op__explore-toggle"
                aria-expanded={exploreOpen}
                aria-controls={exploreId}
                onClick={onExploreToggle}
              >
                {exploreOpen ? "Close this comparison" : "Explore this comparison"}
                <span aria-hidden="true">{exploreOpen ? " ↑" : " →"}</span>
              </button>
              <div
                id={exploreId}
                className="spiral-op__explore-body"
                hidden={!exploreOpen}
              >
                {exploreOpen && (
                  <>
                    <p className="spiral-op__question">{question}</p>
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
                            <h4 className="spiral-op__example-title">
                              {example.title}
                            </h4>
                            <p className="spiral-op__example-body">
                              {example.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {across && (
                      <p className="spiral-op__empty">
                        Placeholder scaffolding exists here. Nothing is
                        concluded yet.
                      </p>
                    )}

                    {lens.status !== "scaffold" && (
                      <p className="spiral-op__guardrail">{GUARDRAIL}</p>
                    )}

                    {canInvestigate && (
                      <div className="spiral-op__investigate">
                        <button
                          type="button"
                          className="spiral-op__investigate-toggle"
                          aria-expanded={investigateOpen}
                          aria-controls={investigateId}
                          onClick={onInvestigateToggle}
                        >
                          <span className="spiral-op__investigate-title">
                            {investigateOpen ? "Close the research" : "Investigate"}
                          </span>
                          <span className="spiral-op__investigate-lead">
                            {exploration
                              ? `${conceptCount} research concept${conceptCount === 1 ? "" : "s"} · sources · where the comparison breaks · open questions`
                              : "Across scaffold · placeholders only"}
                          </span>
                        </button>
                        <div
                          id={investigateId}
                          className="spiral-op__investigate-body"
                          hidden={!investigateOpen}
                        >
                          {investigateOpen && (
                            <SpiralInvestigate
                              exploration={exploration}
                              across={across}
                              conceptId={conceptId}
                              onConceptChange={onConceptChange}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
