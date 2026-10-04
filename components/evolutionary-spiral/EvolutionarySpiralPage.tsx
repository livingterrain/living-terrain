import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import {
  SPIRAL_CURRENTS,
  SPIRAL_EPISTEMIC_LEGEND,
  SPIRAL_SEQUENCE,
  SPIRAL_STAGES,
  examplesForStage,
  getEvolutionarySpiral,
  getSpiralDomain,
  getSpiralStage,
  epistemicLabel,
  microcopyForStop,
} from "@/lib/evolutionary-spiral";
import { SpiralHelixExperience } from "./SpiralHelixExperience";
import "./evolutionary-spiral.css";

/**
 * Evolutionary Spiral page — complexity revealed at the speed of curiosity.
 * See (title, thesis, helix, lens control) → Discover (a whole trajectory laid
 * against the Spiral) → local card → Investigate (research, model language,
 * ways of knowing). Semantic no-JS fallback retained in a collapsed section.
 */
export function EvolutionarySpiralPage() {
  const { copy } = getEvolutionarySpiral();

  return (
    <Room kind="atlas">
      <RoomThreshold
        kind="atlas"
        title={copy.name}
        whisper={copy.surfaceLine}
        align="left"
        className="spiral-arrival pb-6 pt-10 sm:pb-8 sm:pt-14 md:pb-4 md:pt-12"
      />

      <section className="spiral-page pb-24 pt-0 sm:pb-32">
        <Container className="spiral-page__instrument-wrap">
          <SpiralHelixExperience />
        </Container>

        <Container>
          <div className="spiral-page__deeper">
            <details className="spiral-page__disclosure">
              <summary className="spiral-page__disclosure-summary">
                <span className="spiral-page__disclosure-title">
                  How the model works
                </span>
                <span className="spiral-page__disclosure-lead">
                  What the helix claims, what it does not, and the questions it
                  leaves open.
                </span>
              </summary>

              <div className="spiral-page__model">
                <div className="spiral-page__model-block">
                  <p>{copy.surfaceSupport}</p>
                  <p>{copy.visitorThesis[0]}</p>
                  <p>{copy.visitorThesis[1]}</p>
                  <p className="spiral-page__question-text">
                    {copy.coreQuestion}
                  </p>
                </div>

                <div className="spiral-page__model-block">
                  <h3 className="spiral-page__model-title">
                    A grammar, not a ladder
                  </h3>
                  <p>{copy.oneSentenceDefinition}</p>
                  <p>{copy.evolutionaryClarification}</p>
                  <ul className="spiral-page__how-to-read-list">
                    {copy.howToRead.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <p>{copy.referenceTrajectoryNote}</p>
                </div>

                <div className="spiral-page__model-block">
                  <h3 className="spiral-page__model-title">Two currents</h3>
                  <p>
                    Continuity and Transformation are not separate portions of
                    the helix. Every local state holds both questions—what
                    persists, and what changes—simultaneous, interdependent,
                    equal in weight.
                  </p>
                  <dl className="spiral-page__currents-list">
                    {SPIRAL_CURRENTS.map((current) => (
                      <div key={current.id}>
                        <dt className="spiral-page__current-name">
                          {current.name}
                        </dt>
                        <dd className="spiral-page__current-def">
                          {current.definition}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p>{copy.interactionTendency}</p>
                </div>

                <div className="spiral-page__model-block">
                  <h3 className="spiral-page__model-title">
                    Recurrence with history
                  </h3>
                  <p className="spiral-page__shape">{copy.shapeSentence}</p>
                  <p>{copy.recurrenceNote}</p>
                  <p>
                    Emergence again is the same operation-kind as the first
                    Emergence, at a later turn—not a reset to the first
                    beginning.
                  </p>
                  <p>{copy.ascentNote}</p>
                </div>

                {copy.openQuestions.length > 0 && (
                  <div className="spiral-page__model-block">
                    <h3 className="spiral-page__model-title">Open questions</h3>
                    <ul className="spiral-page__how-to-read-open-list">
                      {copy.openQuestions.map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>

            <details className="spiral-page__disclosure spiral-page__ways">
              <summary className="spiral-page__disclosure-summary">
                <span className="spiral-page__disclosure-title">
                  Ways of knowing
                </span>
                <span className="spiral-page__disclosure-lead">
                  How evidence, interpretation, theology, and symbolic
                  comparison are kept distinct.
                </span>
              </summary>
              <ul className="spiral-page__epistemic spiral-page__epistemic--compact">
                {SPIRAL_EPISTEMIC_LEGEND.map((cat) => (
                  <li key={cat.id}>
                    <span className="spiral-page__epistemic-label">
                      {cat.label}
                    </span>
                    <p className="spiral-page__epistemic-def">{cat.definition}</p>
                  </li>
                ))}
              </ul>
              <p className="spiral-page__disclaimer" role="note">
                {copy.disclaimer}
              </p>
            </details>

            {/* Semantic / no-JS fallback — not a second interactive model */}
            <details className="spiral-page__disclosure spiral-page__fallback">
              <summary className="spiral-page__disclosure-summary">
                <span className="spiral-page__disclosure-title">
                  Read the Spiral as text
                </span>
                <span className="spiral-page__disclosure-lead">
                  The reference trajectory with definitions and seed examples.
                  This order is revisable; not every system follows it.
                </span>
              </summary>

              <ol className="spiral-page__sequence">
                {SPIRAL_SEQUENCE.map((stop) => {
                  const stage = getSpiralStage(stop.stageId);
                  const name = stop.labelOverride ?? stage?.name ?? stop.stageId;
                  const isAgain = stop.cycleIndex > 0;
                  return (
                    <li
                      key={stop.occurrenceId}
                      className={
                        isAgain
                          ? "spiral-page__sequence-item spiral-page__sequence-item--again"
                          : "spiral-page__sequence-item"
                      }
                    >
                      <span className="spiral-page__sequence-n">
                        {String(stop.order).padStart(2, "0")}
                      </span>
                      <div>
                        <span className="spiral-page__sequence-name">{name}</span>
                        <span className="spiral-page__sequence-note">
                          {microcopyForStop(stop)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="spiral-page__fallback-defs">
                {SPIRAL_STAGES.map((stage) => {
                  const examples = examplesForStage(stage.id);
                  return (
                    <details key={stage.id} className="spiral-page__stage">
                      <summary className="spiral-page__stage-summary">
                        <div className="spiral-page__stage-head">
                          <span className="spiral-page__stage-name">
                            <span className="type-folio mr-3">
                              {String(stage.order).padStart(2, "0")}
                            </span>
                            {stage.name}
                          </span>
                        </div>
                        <p className="spiral-page__stage-whisper">
                          {stage.whisper}
                        </p>
                      </summary>
                      <div className="spiral-page__stage-body">
                        <p className="spiral-page__stage-def">
                          {stage.definition}
                        </p>
                        {examples.length > 0 && (
                          <div className="spiral-page__examples">
                            {examples.map((example) => {
                              const domain = getSpiralDomain(example.domainId);
                              return (
                                <article
                                  key={example.id}
                                  className="spiral-page__example"
                                >
                                  <div className="spiral-page__example-meta">
                                    <span className="spiral-page__example-domain">
                                      {domain?.label ?? example.domainId}
                                    </span>
                                    <span className="spiral-page__example-epistemic">
                                      {epistemicLabel(example.epistemicKind)}
                                    </span>
                                  </div>
                                  <h3 className="spiral-page__example-title">
                                    {example.title}
                                  </h3>
                                  <p className="spiral-page__example-body">
                                    {example.body}
                                  </p>
                                </article>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </details>
                  );
                })}
              </div>
            </details>
          </div>

          <nav className="spiral-page__return" aria-label="Continue">
            <Link
              href="/atlas"
              className="lantern-link flex min-h-11 items-center text-[0.875rem]"
            >
              ← Return to the Atlas
            </Link>
          </nav>
        </Container>
      </section>
    </Room>
  );
}
