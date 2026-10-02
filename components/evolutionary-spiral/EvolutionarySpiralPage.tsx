import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import {
  examplesForStage,
  getEvolutionarySpiral,
  getSpiralDomain,
  getSpiralStage,
  epistemicLabel,
} from "@/lib/evolutionary-spiral";
import "./evolutionary-spiral.css";

/**
 * Phase 1 — static semantic foundation.
 * No helix visualization. Content is readable without client JS.
 */
export function EvolutionarySpiralPage() {
  const {
    copy,
    stages,
    sequence,
    currents,
    epistemicCategories,
  } = getEvolutionarySpiral();

  return (
    <Room kind="atlas">
      <RoomThreshold
        kind="atlas"
        title={copy.name}
        whisper="A systems framework for remaining oneself through change."
        align="left"
        className="py-12 sm:py-16 md:py-20"
      />

      <section className="spiral-page pb-24 pt-0 sm:pb-32">
        <Container narrow>
          <div className="spiral-page__intro type-body">
            {copy.visitorThesis.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
            <p>
              The Evolutionary Spiral begins from that observation.
            </p>
            <p>{copy.evolutionaryClarification}</p>
            <p className="text-charcoal-muted">{copy.oneSentenceDefinition}</p>
          </div>

          <div className="spiral-page__question">
            <p className="spiral-page__question-label">Core question</p>
            <p className="spiral-page__question-text">{copy.coreQuestion}</p>
          </div>

          <p className="spiral-page__shape">{copy.shapeSentence}</p>
          <p className="spiral-page__section-lead mt-4">{copy.ascentNote}</p>

          {/* Currents */}
          <section className="spiral-page__section" aria-labelledby="spiral-currents">
            <h2 id="spiral-currents" className="spiral-page__section-title">
              Two currents
            </h2>
            <p className="spiral-page__section-lead">
              Continuity and Transformation move through the same developmental
              sequence. They are not enemies or a simple binary. The Spiral
              examines their tension and interaction over time.
            </p>
            <p className="spiral-page__section-lead">{copy.interactionTendency}</p>
            <div className="spiral-page__currents">
              {currents.map((current) => (
                <article key={current.id}>
                  <h3 className="spiral-page__current-name">{current.name}</h3>
                  <p className="spiral-page__current-def">{current.definition}</p>
                  <ul className="spiral-page__qualities" aria-label={`${current.name} qualities`}>
                    {current.qualities.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* Epistemic key */}
          <section className="spiral-page__section" aria-labelledby="spiral-epistemic">
            <h2 id="spiral-epistemic" className="spiral-page__section-title">
              Ways of knowing
            </h2>
            <p className="spiral-page__section-lead">
              Examples may come from different languages of description. Their
              evidentiary status is not equivalent. Each example names how it
              knows.
            </p>
            <ul className="spiral-page__epistemic">
              {epistemicCategories.map((cat) => (
                <li key={cat.id}>
                  <span className="spiral-page__epistemic-label">{cat.label}</span>
                  <p className="spiral-page__epistemic-def">{cat.definition}</p>
                </li>
              ))}
            </ul>
            <p className="spiral-page__disclaimer" role="note">
              {copy.disclaimer}
            </p>
          </section>

          {/* Sequence overview */}
          <section className="spiral-page__section" aria-labelledby="spiral-sequence">
            <h2 id="spiral-sequence" className="spiral-page__section-title">
              Developmental sequence
            </h2>
            <p className="spiral-page__section-lead">
              Nine stages, then Emergence again—same stage-kind, later turn of
              the helix. Recurrence with history, not identical return.
            </p>
            <ol className="spiral-page__sequence">
              {sequence.map((stop) => {
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
                      {isAgain && (
                        <span className="spiral-page__sequence-note">
                          {copy.emergenceAgainCue} Cycle turn {stop.cycleIndex + 1}.
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Stages with definitions + sparse examples */}
          <section className="spiral-page__section" aria-labelledby="spiral-stages">
            <h2 id="spiral-stages" className="spiral-page__section-title">
              Stages
            </h2>
            <p className="spiral-page__section-lead">
              Each stage holds a short whisper and a fuller definition. Open a
              stage to read the definition and any seeded examples. Coverage is
              intentionally sparse.
            </p>

            <div className="spiral-page__stages">
              {stages.map((stage) => {
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
                        <span className="spiral-page__stage-toggle" aria-hidden>
                          Definition
                        </span>
                      </div>
                      <p className="spiral-page__stage-whisper">{stage.whisper}</p>
                    </summary>
                    <div className="spiral-page__stage-body">
                      <p className="spiral-page__stage-def">{stage.definition}</p>

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
                                {example.comparisonPair && (
                                  <p className="spiral-page__example-pair">
                                    {example.comparisonPair.left}
                                    {" ↔ "}
                                    {example.comparisonPair.right}
                                  </p>
                                )}
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
          </section>

          {/* Emergence¹ → Renewal → Emergence² */}
          <section className="spiral-page__section" aria-labelledby="spiral-cycle">
            <h2 id="spiral-cycle" className="spiral-page__section-title">
              Recurrence with history
            </h2>
            <div className="spiral-page__cycle">
              <p className="spiral-page__cycle-flow">
                Emergence¹ → … → Renewal → Emergence² → …
              </p>
              <p>
                <strong className="font-heading font-normal text-ivory">
                  Integration
                </strong>{" "}
                — reorganized elements have become coherent enough to function
                together.
              </p>
              <p>
                <strong className="font-heading font-normal text-ivory">
                  Renewal
                </strong>{" "}
                — the reorganized system has stabilized sufficiently to continue
                forward with altered capacity.
              </p>
              <p>
                <strong className="font-heading font-normal text-ivory">
                  Emergence again
                </strong>{" "}
                — a genuinely new pattern, possibility, organization, or level
                becomes discernible from the conditions produced by the prior
                cycle. Something is now possible that was not available in the
                same way at the first Emergence—not because the system is
                guaranteed “better,” but because history has accumulated.
              </p>
              <p>{copy.shapeSentence}</p>
            </div>
          </section>

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
)
