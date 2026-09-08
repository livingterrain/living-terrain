import Link from "next/link";
import { INSTRUMENT_01 } from "@/lib/observatory/the-text";

/**
 * Restrained Observatory hub entry for Instrument 01.
 * One plate — not a feature grid.
 */
export function InstrumentEntry() {
  return (
    <section aria-labelledby="obs-instrument-01" className="obs-text-entry">
      <p className="obs-studio__folio" id="obs-instrument-01">
        Instrument {INSTRUMENT_01.number}
      </p>
      <Link href={INSTRUMENT_01.route} className="obs-text-entry__plate group">
        <h2 className="obs-text-entry__name">{INSTRUMENT_01.name}</h2>
        <p className="obs-text-entry__question">{INSTRUMENT_01.question}</p>
        <p className="obs-text-entry__support">{INSTRUMENT_01.supporting[0]}</p>
        <p className="obs-text-entry__cta">
          <span>{INSTRUMENT_01.cta}</span>
          <span aria-hidden className="obs-text-entry__arrow">
            →
          </span>
        </p>
      </Link>
    </section>
  );
}
