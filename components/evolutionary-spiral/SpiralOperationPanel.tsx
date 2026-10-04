"use client";

import {
  epistemicLabel,
  getStageExploration,
  getSpiralStage,
  microcopyForStop,
  transitionForResonance,
  type SpiralIntersection,
  type SpiralLens,
  type SpiralSequenceStop,
  type SpiralTrajectory,
  type SpiralTrajectoryResonance,
} from "@/lib/evolutionary-spiral";
import { SpiralInvestigate } from "./SpiralInvestigate";

type Props = {
  stop: SpiralSequenceStop;
  lens: SpiralLens | undefined;
  trajectory: SpiralTrajectory | undefined;
  intersection: SpiralIntersection | undefined;
  investigateOpen: boolean;
  onInvestigateToggle: () => void;
  conceptId: string | null;
  onConceptChange: (conceptId: string | null) => void;
  panelId: string;
  investigateId: string;
};

const STRENGTH_LABEL: Record<SpiralTrajectoryResonance["strength"], string> = {
  candidate: "Candidate resonance",
  context: "Where the cycle continues",
  ambiguous: "Ambiguous",
};

const GUARDRAIL =
  "Structural resemblance is a reason to investigate—not evidence that the structures share a cause.";

function firstParagraph(text: string | undefined): string | undefined {
  return text?.split(/\n\n+/)[0]?.trim() || undefined;
}

function ResonanceList({
  resonances,
  trajectory,
  lens,
}: {
  resonances: readonly SpiralTrajectoryResonance[];
  trajectory: SpiralTrajectory;
  lens: SpiralLens;
}) {
  const label = (id: string) =>
    trajectory.steps.find((s) => s.id === id)?.label ?? id;
  return (
    <ul className="spiral-op__resonances">
      {resonances.map((r) => {
        const transition = transitionForResonance(r, lens.id);
        const line = r.note ?? firstParagraph(transition?.body);
        return (
          <li
            key={r.id}
            className={`spiral-op__resonance spiral-op__resonance--${r.strength}`}
          >
            <p className="spiral-op__resonance-head">
              <span className="spiral-op__resonance-passage">
                {label(r.from)} → {label(r.to)}
              </span>
              <span className="spiral-op__resonance-role">
                {STRENGTH_LABEL[r.strength]}
              </span>
            </p>
            {line && <p className="spiral-op__resonance-line">{line}</p>}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Selected operation — the coordinate used to interrogate the active lens.
 * Explore depth stays readable; Investigate holds the research.
 */
export function SpiralOperationPanel({
  stop,
  lens,
  trajectory,
  intersection,
  investigateOpen,
  onInvestigateToggle,
  conceptId,
  onConceptChange,
  panelId,
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
  const resonances = intersection?.resonances ?? [];
  const examples = intersection?.examples ?? [];
  const hasMaterial =
    Boolean(exploration) ||
    Boolean(across) ||
    resonances.length > 0 ||
    examples.length > 0;
  const canInvestigate = Boolean(exploration || across);

  const question = !lens
    ? undefined
    : (exploration?.title ??
      (lens.id === "across"
        ? `What actually recurs at ${name} across ${lens.inPhrase}?`
        : `Where does ${name} appear within ${trajectory?.inPhrase ?? lens.inPhrase}?`));

  const conceptCount = exploration?.concepts.length ?? 0;
  const lede = exploration
    ? (exploration.lede ?? firstParagraph(exploration.framing))
    : undefined;

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
        <div className="spiral-op__plain">
          <p className="spiral-op__def">{stage.definition}</p>
          <p className="spiral-op__hint">
            Choose a lens above to ask where {name} appears in living systems,
            minds, ecosystems, scripture, or the zodiac.
          </p>
        </div>
      ) : (
        <div className="spiral-op__explore">
          <p className="spiral-op__intersection">
            {lens.label} <span aria-hidden="true">×</span>
            <span className="sr-only">at</span> {name}
          </p>
          <p className="spiral-op__question">{question}</p>

          {lede && <p className="spiral-op__lede">{lede}</p>}

          {trajectory && resonances.length > 0 && (
            <ResonanceList
              resonances={resonances}
              trajectory={trajectory}
              lens={lens}
            />
          )}

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

          {lens.status === "scaffold" ? (
            <p className="spiral-op__empty">
              {across
                ? "Placeholder scaffolding exists here. Nothing is concluded yet."
                : `Nothing to compare yet at ${name}.`}
            </p>
          ) : !hasMaterial ? (
            <p className="spiral-op__empty">
              Not yet researched.{" "}
              {trajectory
                ? `${trajectory.title} stays in view; no correspondence is assumed, and there may be none.`
                : "No correspondence is assumed, and there may be none."}
            </p>
          ) : null}

          {hasMaterial && lens.status !== "scaffold" && (
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
        </div>
      )}
    </article>
  );
}
