import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import {
  SPIRAL_COPY,
  SPIRAL_CURRENTS,
  SPIRAL_EPISTEMIC_CATEGORIES,
  SPIRAL_SEQUENCE,
  SPIRAL_STAGES,
  examplesForStage,
  getEvolutionarySpiral,
  getSpiralDomain,
  getSpiralStage,
  epistemicLabel,
} from "@/lib/evolutionary-spiral";
import { SpiralHelixExperience } from "./SpiralHelixExperience";
import "./evolutionary-spiral.css";

/**
 * Evolutionary Spiral page — Phase 2 instrument + compressed framing.
 * Phase 1 data/canon preserved. Helix is the primary sequence experience.
 * Semantic no-JS fallback retained below the client island.
 */
export function EvolutionarySpiralPage() {
  const { copy } = getEvolutionarySpiral();

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
            <p>{copy.visitorThesis[0]}</p>
            <p>{copy.visitorThesis[1]}</p>
            <p>
              The Evolutionary Spiral begins from that observation.{" "}
              {copy.evolutionaryClarification}
            </p>
          </div>

          <div className="spiral-page__question">
            <p className="spiral-page__question-label">Core question</p>
            <p className="spiral-page__question-text">{copy.coreQuestion}</p>
          </div>

          <p className="spiral-page__shape">{copy.shapeSentence}</p>
        </Container>

        {/* Wider band for the instrument */}
        <Container className="spiral-page__instrument-wrap mt-10 sm:mt-14">
          <SpiralHelixExperience />
        </Container>

        <Container narrow>
          {/* Compressed currents + epistemic — legend-scale, not a second lecture */}
          <section
            className="spiral-page__section spiral-page__section--compact"
            aria-labelledby="spiral-currents"
          >
            <h2 id="spiral-currents" className="spiral-page__section-title">
              Two currents
            </h2>
            <p className="spiral-page__section-lead">
              Continuity and Transformation move together through the same
              sequence — simultaneous, interdependent, equal in weight.{" "}
              {SPIRAL_COPY.interactionTendency}
            </p>
            <div className="spiral-page__currents spiral-page__currents--compact">
              {SPIRAL_CURRENTS.map((current) => (
                <article key={current.id}>
                  <h3 className="spiral-page__current-name">{current.name}</h3>
                  <p className="spiral-page__current-def">{current.definition}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            className="spiral-page__section spiral-page__section--compact"
            aria-labelledby="spiral-epistemic"
          >
            <details className="spiral-page__ways">
              <summary
                id="spiral-epistemic"
                className="spiral-page__ways-summary"
              >
                <span className="spiral-page__ways-heading">
                  <span className="spiral-page__ways-title">Ways of knowing</span>
                  <span className="spiral-page__ways-mark" aria-hidden="true">
                    ⓘ
                  </span>
                </span>
                <span className="spiral-page__ways-lead">
                  How evidence, interpretation, theology, and symbolic comparison
                  are distinguished in this instrument.
                </span>
              </summary>
              <ul className="spiral-page__epistemic spiral-page__epistemic--compact">
                {SPIRAL_EPISTEMIC_CATEGORIES.map((cat) => (
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
          </section>

          <section
            className="spiral-page__section spiral-page__section--compact"
            aria-labelledby="spiral-cycle"
          >
            <h2 id="spiral-cycle" className="spiral-page__section-title">
              Recurrence with history
            </h2>
            <div className="spiral-page__cycle">
              <p className="spiral-page__cycle-flow">
                Emergence¹ → … → Renewal → Emergence² → …
              </p>
              <p>
                Emergence again is the same stage-kind as the first Emergence,
                at a later turn. Recurrence is not reset. Ascent marks changed
                conditions, not guaranteed improvement.
              </p>
              <p>{copy.shapeSentence}</p>
            </div>
          </section>

          {/* Semantic / no-JS fallback — not a second interactive model */}
          <section
            className="spiral-page__fallback"
            aria-labelledby="spiral-fallback"
          >
            <h2 id="spiral-fallback" className="spiral-page__section-title">
              Stages in sequence
            </h2>
            <p className="spiral-page__section-lead">
              A readable sequence with definitions. Prefer the instrument above
              when available.
            </p>

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
                      {stage && (
                        <span className="spiral-page__sequence-note">
                          {stage.whisper}
                        </span>
                      )}
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
