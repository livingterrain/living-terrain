import Link from "next/link";
import { TextLink } from "@/components/design-system";
import {
  getPassageSummaries,
  INSTRUMENT_01,
  passageStatusLabel,
  type PassageSummary,
} from "@/lib/observatory/the-text";

export function TheTextLanding() {
  const passages = getPassageSummaries();

  return (
    <article className="obs-studio obs-studio--file obs-text">
      <header className="obs-studio__file-head">
        <TextLink href="/observatory" className="obs-studio__back text-sm">
          ← Observatory
        </TextLink>
        <p className="obs-studio__status mt-10">
          <span className="obs-studio__status-live">
            Instrument {INSTRUMENT_01.number}
          </span>
        </p>
        <h1 className="obs-studio__file-title mt-3">{INSTRUMENT_01.name}</h1>
        <p className="obs-studio__case-q obs-studio__case-q--lead mt-6 max-w-2xl">
          {INSTRUMENT_01.question}
        </p>
        <div className="obs-studio__file-desc obs-text-landing__desc mt-6 max-w-xl space-y-4">
          <p>
            Translation carries meaning across languages, cultures, and
            centuries. It also requires choices.
          </p>
          <p>
            This instrument lets you look beneath the English: at words,
            grammar, semantic range, textual relationships, and competing
            interpretations.
          </p>
          <p className="obs-text__principle">
            Don’t replace the translation. Reveal the terrain beneath it.
          </p>
        </div>
      </header>

      <section aria-labelledby="obs-text-passages" className="obs-studio__section">
        <h2 id="obs-text-passages" className="obs-studio__folio">
          Passages
        </h2>
        <ul className="obs-text-passages mt-8 sm:mt-10" role="list">
          {passages.map((passage) => (
            <li key={passage.id}>
              <PassageRow passage={passage} />
            </li>
          ))}
        </ul>
      </section>

      <details className="obs-text-method obs-text-method--landing">
        <summary>{INSTRUMENT_01.methodTitle}</summary>
        <div className="obs-text-method__body">
          {INSTRUMENT_01.methodBody.map((para) => (
            <p key={para.slice(0, 48)}>{para}</p>
          ))}
        </div>
      </details>
    </article>
  );
}

function PassageRow({ passage }: { passage: PassageSummary }) {
  const ready = passage.status === "prototype" || passage.status === "ready";
  const href = `/observatory/the-text/${passage.slug}`;

  const inner = (
    <>
      <p className="obs-studio__status">
        <span className="obs-studio__status-live">
          {passageStatusLabel(passage.status)}
        </span>
        <span className="obs-studio__status-sep" aria-hidden>
          ·
        </span>
        <span>{passage.language === "hebrew" ? "Hebrew" : "Greek"}</span>
      </p>
      <h3 className="obs-studio__case-title">{passage.reference}</h3>
      <p className="obs-text-passages__themes">
        {passage.themes.join(" · ")}
      </p>
      <p className="obs-studio__whisper">{passage.whisper}</p>
    </>
  );

  if (ready) {
    return (
      <Link href={href} className="obs-studio__case group">
        {inner}
      </Link>
    );
  }

  return (
    <div className="obs-studio__case obs-studio__case--inert" aria-disabled>
      {inner}
    </div>
  );
}
