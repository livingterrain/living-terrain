import {
  epistemicLabel,
  examplesForStage,
  getSpiralDomain,
  getSpiralStage,
  type SpiralSequenceStop,
} from "@/lib/evolutionary-spiral";

type Props = {
  stop: SpiralSequenceStop;
  panelId: string;
};

/**
 * Selected-stage detail — definitions and Phase 1 seed examples only.
 * No interpretive mappings added in Phase 2.
 */
export function SpiralStagePanel({ stop, panelId }: Props) {
  const stage = getSpiralStage(stop.stageId);
  if (!stage) return null;

  const title = stop.labelOverride ?? stage.name;
  const examples = examplesForStage(stop.stageId);
  const isAgain = stop.cycleIndex > 0;

  return (
    <article
      id={panelId}
      className="spiral-panel"
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="spiral-panel__folio type-folio">
        {String(stop.order).padStart(2, "0")}
        {isAgain ? " · later turn" : null}
      </p>
      <h3 className="spiral-panel__title">{title}</h3>
      <p className="spiral-panel__whisper">{stage.whisper}</p>
      {isAgain && (
        <p className="spiral-panel__again">
          Same stage-kind as the first Emergence — not a return to the identical
          beginning. Something can be present that was not available in the same
          way before.
        </p>
      )}
      <p className="spiral-panel__def">{stage.definition}</p>

      {examples.length > 0 && (
        <div className="spiral-panel__examples">
          {examples.map((example) => {
            const domain = getSpiralDomain(example.domainId);
            return (
              <div key={example.id} className="spiral-page__example">
                <div className="spiral-page__example-meta">
                  <span className="spiral-page__example-domain">
                    {domain?.label ?? example.domainId}
                  </span>
                  <span className="spiral-page__example-epistemic">
                    {epistemicLabel(example.epistemicKind)}
                  </span>
                </div>
                <h4 className="spiral-page__example-title">{example.title}</h4>
                <p className="spiral-page__example-body">{example.body}</p>
                {example.comparisonPair && (
                  <p className="spiral-page__example-pair">
                    {example.comparisonPair.left}
                    {" ↔ "}
                    {example.comparisonPair.right}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
