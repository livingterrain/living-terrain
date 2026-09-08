"use client";

import {
  confidenceLabel,
  type PassageWord,
} from "@/lib/observatory/the-text";
import { isAuthoringNote } from "@/lib/observatory/the-text/provenance";
import { EvidenceInspect } from "./EvidenceInspect";

export function WordPanel({
  id,
  word,
  semanticRangeNote,
  onClose,
}: {
  id: string;
  word: PassageWord;
  semanticRangeNote: string;
  onClose: () => void;
}) {
  return (
    <aside
      id={id}
      className="obs-text-panel"
      aria-label={`Linguistic evidence for ${word.transliteration}`}
    >
      <div className="obs-text-panel__head">
        <div>
          <p className="obs-text-panel__folio">Of this word</p>
          <p
            className="obs-text-panel__surface"
            dir="auto"
            lang={/[א-ת]/.test(word.surface) ? "he" : undefined}
          >
            {word.surface}
          </p>
        </div>
        <button
          type="button"
          className="obs-text-panel__close"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <dl className="obs-text-panel__fields">
        <div>
          <dt>Transliteration</dt>
          <dd>{word.transliteration}</dd>
        </div>
        <div>
          <dt>Form</dt>
          <dd>
            {word.form}
            {word.formClaim && (
              <span className="obs-text-panel__evidence-inline">
                <EvidenceInspect claim={word.formClaim} compact />
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt>How it is translated here</dt>
          <dd>
            <span className="obs-text-panel__gloss">{word.translatedHere}</span>
            {word.translationNote && (
              <p className="obs-text-panel__note">{word.translationNote}</p>
            )}
            {word.translationClaim && (
              <EvidenceInspect claim={word.translationClaim} compact />
            )}
          </dd>
        </div>
      </dl>

      <section className="obs-text-panel__block" aria-labelledby={`${id}-range`}>
        <h3 id={`${id}-range`} className="obs-text-panel__folio">
          Semantic range
        </h3>
        <p className="obs-text-panel__caution">{semanticRangeNote}</p>
        <ul className="obs-text-panel__senses" role="list">
          {word.semanticRange.senses.map((sense) => (
            <li key={sense.gloss}>
              <p className="obs-text-panel__sense-gloss">{sense.gloss}</p>
              <p className="obs-text-panel__sense-conf">
                {confidenceLabel(sense.confidence)}
              </p>
              {sense.note && !isAuthoringNote(sense.note) && (
                <p className="obs-text-panel__note">{sense.note}</p>
              )}
              {sense.sourceIds && sense.sourceIds.length > 0 && (
                <EvidenceInspect
                  claim={{
                    id: `${word.id}-sense-${sense.gloss}`,
                    text: sense.gloss,
                    category: "lexical",
                    confidence: sense.confidence,
                    sourceIds: sense.sourceIds,
                    verificationStatus:
                      sense.verificationStatus ?? "provisionally-sourced",
                    note: sense.note,
                  }}
                  compact
                />
              )}
            </li>
          ))}
        </ul>
      </section>

      {word.occurrenceNotes && word.occurrenceNotes.length > 0 && (
        <section
          className="obs-text-panel__block"
          aria-labelledby={`${id}-occ`}
        >
          <h3 id={`${id}-occ`} className="obs-text-panel__folio">
            Occurrence notes
          </h3>
          <ul className="obs-text-panel__follow" role="list">
            {word.occurrenceNotes.map((claim) => (
              <li key={claim.id}>
                <p className="obs-text-panel__follow-label">{claim.text}</p>
                <EvidenceInspect claim={claim} compact />
              </li>
            ))}
          </ul>
        </section>
      )}

      {word.followThisWord && word.followThisWord.length > 0 && (
        <section
          className="obs-text-panel__block obs-text-panel__block--follow"
          aria-labelledby={`${id}-follow`}
        >
          <h3 id={`${id}-follow`} className="obs-text-panel__folio">
            Follow this word
          </h3>
          <p className="obs-text-panel__follow-framing">
            Exploratory relationships — not additional lexical proof.
          </p>
          <ul className="obs-text-panel__follow" role="list">
            {word.followThisWord.map((link) => (
              <li key={link.label}>
                <p className="obs-text-panel__follow-label">{link.label}</p>
                {link.note && (
                  <p className="obs-text-panel__note">{link.note}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
