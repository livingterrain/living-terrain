import Link from "next/link";
import {
  getInvestigations,
  getInvestigationById,
  statusLabel,
  type ObservatoryInvestigation,
} from "@/lib/observatory/investigations";
import {
  getBenchObservations,
  observationCue,
  observationWhen,
  type Observation,
} from "@/lib/observatory/observations";

/**
 * Observatory V1 — observations first; investigations rare.
 * Existing typography and pin/case language unchanged.
 */
export function ObservatoryHub() {
  const observations = getBenchObservations();
  const investigations = getInvestigations();

  return (
    <div className="obs-studio">
      <section aria-labelledby="obs-field">
        <h2 id="obs-field" className="obs-studio__folio">
          Field observations
        </h2>
        <ul className="obs-studio__pins mt-8 sm:mt-10" role="list">
          {observations.map((o) => (
            <li key={o.id}>
              <FieldPin observation={o} />
            </li>
          ))}
        </ul>
      </section>

      {investigations.length > 0 && (
        <section
          aria-labelledby="obs-investigations"
          className="obs-studio__section"
        >
          <h2 id="obs-investigations" className="obs-studio__folio">
            Investigations
          </h2>
          <ul className="obs-studio__cases mt-8 sm:mt-10">
            {investigations.map((inv) => (
              <li key={inv.id}>
                <InvestigationRow investigation={inv} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function InvestigationRow({
  investigation,
}: {
  investigation: ObservatoryInvestigation;
}) {
  return (
    <Link
      href={`/observatory/${investigation.slug}`}
      className="obs-studio__case group"
    >
      <p className="obs-studio__status">
        <span className="obs-studio__status-live">
          {statusLabel(investigation.status)}
        </span>
        {investigation.revised && (
          <>
            <span className="obs-studio__status-sep" aria-hidden>
              ·
            </span>
            <span>Revised {investigation.revised}</span>
          </>
        )}
      </p>
      {investigation.title && (
        <h3 className="obs-studio__case-title">{investigation.title}</h3>
      )}
      {investigation.question && (
        <p className="obs-studio__case-q">{investigation.question}</p>
      )}
      {investigation.whisper && (
        <p className="obs-studio__whisper">{investigation.whisper}</p>
      )}
    </Link>
  );
}

function FieldPin({ observation }: { observation: Observation }) {
  const cue = observationCue(observation);
  const when = observationWhen(observation);
  const tetherIds = observation.investigationIds ?? [];
  const tethers = tetherIds
    .map((id) => getInvestigationById(id))
    .filter(
      (i): i is ObservatoryInvestigation =>
        i !== undefined &&
        (i.status === "active" || i.status === "forming"),
    );

  return (
    <figure className="obs-studio__pin">
      {(cue || when || observation.uncertainty) && (
        <p className="obs-studio__pin-meta">
          {cue && <span className="obs-studio__obs-cue">{cue}</span>}
          {cue && when && (
            <span className="obs-studio__status-sep" aria-hidden>
              ·
            </span>
          )}
          {when && <span className="obs-studio__pin-when">{when}</span>}
          {!when && observation.uncertainty && (
            <>
              {cue && (
                <span className="obs-studio__status-sep" aria-hidden>
                  ·
                </span>
              )}
              <span className="obs-studio__pin-when">
                {observation.uncertainty}
              </span>
            </>
          )}
        </p>
      )}
      <blockquote className="obs-studio__pin-text">
        {observation.body}
      </blockquote>
      {observation.uncertainty && when && (
        <p className="obs-studio__whisper">{observation.uncertainty}</p>
      )}
      {observation.returningWords && observation.returningWords.length > 0 && (
        <p className="obs-studio__term-ref">
          {observation.returningWords.join(" · ")}
        </p>
      )}
      {tethers.map((t) => (
        <figcaption key={t.id} className="obs-studio__pin-cap">
          {t.title}
        </figcaption>
      ))}
    </figure>
  );
}
