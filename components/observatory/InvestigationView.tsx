import Link from "next/link";
import { TextLink } from "@/components/design-system";
import {
  echoKindLabel,
  getInvestigationObservations,
  getRelatedInvestigations,
  statusLabel,
  type ObservatoryInvestigation,
} from "@/lib/observatory/investigations";
import {
  observationCue,
  type Observation,
} from "@/lib/observatory/observations";

/**
 * Single investigation — rare notebook built from observations.
 */
export function InvestigationView({
  investigation,
}: {
  investigation: ObservatoryInvestigation;
}) {
  const notes = getInvestigationObservations(investigation);
  const related = getRelatedInvestigations(investigation);
  const echoes = investigation.downstreamEchoes ?? [];
  const dissolved = investigation.status === "dissolved";

  return (
    <article className="obs-studio obs-studio--file">
      <header className="obs-studio__file-head">
        <TextLink href="/observatory" className="obs-studio__back text-sm">
          ← Observatory
        </TextLink>
        <p className="obs-studio__status mt-10">
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
          <h1 className="obs-studio__file-title mt-3">
            {investigation.title}
          </h1>
        )}
        {investigation.question && (
          <p className="obs-studio__case-q obs-studio__case-q--lead mt-6 max-w-2xl">
            {investigation.question}
          </p>
        )}
        {(investigation.description || investigation.whisper) && (
          <p className="obs-studio__file-desc mt-6 max-w-xl text-[1.0625rem] leading-[1.75]">
            {investigation.description ?? investigation.whisper}
          </p>
        )}
        {dissolved && investigation.whisper && investigation.description && (
          <p className="obs-studio__whisper mt-4">{investigation.whisper}</p>
        )}
      </header>

      <section aria-labelledby="obs-notes" className="obs-studio__section">
        <h2 id="obs-notes" className="obs-studio__folio">
          Notes
        </h2>
        <ul className="obs-studio__file-obs mt-9">
          {notes.map((o) => (
            <li key={o.id}>
              <NoteLine observation={o} />
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="obs-related" className="obs-studio__section">
          <h2 id="obs-related" className="obs-studio__folio">
            Nearby
          </h2>
          <ul className="obs-studio__cases mt-7">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/observatory/${r.slug}`}
                  className="obs-studio__case group"
                >
                  <p className="obs-studio__status">
                    <span className="obs-studio__status-live">
                      {statusLabel(r.status)}
                    </span>
                    {r.revised && (
                      <>
                        <span className="obs-studio__status-sep" aria-hidden>
                          ·
                        </span>
                        <span>Revised {r.revised}</span>
                      </>
                    )}
                  </p>
                  {r.title && (
                    <h3 className="obs-studio__case-title">{r.title}</h3>
                  )}
                  {r.question && (
                    <p className="obs-studio__case-q">{r.question}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {echoes.length > 0 && !dissolved && (
        <section
          aria-labelledby="obs-evidence"
          className="obs-studio__section"
        >
          <h2 id="obs-evidence" className="obs-studio__folio">
            In the terrain
          </h2>
          <ul className="obs-studio__evidence mt-7">
            {echoes.map((item) => (
              <li key={item.href}>
                <TextLink
                  href={item.href}
                  className="obs-studio__ev group inline-flex flex-col items-start gap-1 text-left no-underline"
                >
                  <span className="obs-studio__status-live">
                    {echoKindLabel(item.kind)}
                  </span>
                  <span className="obs-studio__ev-label">{item.label}</span>
                </TextLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function NoteLine({ observation }: { observation: Observation }) {
  const cue = observationCue(observation);
  return (
    <>
      {cue && <p className="obs-studio__obs-cue">{cue}</p>}
      <p className="obs-studio__obs-line">{observation.body}</p>
      {observation.uncertainty && (
        <p className="obs-studio__whisper">{observation.uncertainty}</p>
      )}
      {observation.returningWords && observation.returningWords.length > 0 && (
        <p className="obs-studio__term-ref">
          {observation.returningWords.join(" · ")}
        </p>
      )}
    </>
  );
}
