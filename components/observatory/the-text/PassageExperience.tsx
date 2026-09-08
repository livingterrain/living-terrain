"use client";

import { useState } from "react";
import { TextLink } from "@/components/design-system";
import {
  INSTRUMENT_01,
  confidenceLabel,
  scholarshipStatusLabel,
  type Passage,
} from "@/lib/observatory/the-text";
import { EvidenceInspect } from "./EvidenceInspect";
import { OriginalLine, useSelectedWord } from "./OriginalLine";
import { TranslationCompare } from "./TranslationCompare";

export function PassageExperience({ passage }: { passage: Passage }) {
  const [revealed, setRevealed] = useState(false);
  const [selectedId, setSelectedId] = useSelectedWord();

  const traditionLabel = {
    jewish: "Jewish interpretive tradition",
    christian: "Christian interpretive tradition",
    academic: "Academic / philological",
    shared: "Shared reading",
  } as const;

  const terrainKindLabel = {
    scripture: "Opened by the text",
    concept: "Concept",
    essay: "Essay",
    question: "Question",
    atlas: "Atlas",
    note: "Note",
  } as const;

  const visibleTranslations = passage.translations.filter(
    (t) => t.visibleInCompare !== false,
  );

  return (
    <article className="obs-studio obs-studio--file obs-text">
      <header className="obs-studio__file-head obs-text__head">
        <TextLink
          href="/observatory/the-text"
          className="obs-studio__back text-sm"
        >
          ← The Text
        </TextLink>
        <p className="obs-studio__status mt-8 sm:mt-10">
          <span className="obs-studio__status-live">
            {passage.scholarshipStatus
              ? scholarshipStatusLabel(passage.scholarshipStatus)
              : passage.status === "prototype"
                ? "Prototype"
                : "Passage"}
          </span>
          {passage.scholarshipStatus === "verified-core" && (
            <>
              <span className="obs-studio__status-sep" aria-hidden>
                ·
              </span>
              <span>Research continues</span>
            </>
          )}
          <span className="obs-studio__status-sep" aria-hidden>
            ·
          </span>
          <span>{passage.language === "hebrew" ? "Hebrew" : "Greek"}</span>
        </p>
        <h1 className="obs-studio__file-title mt-3">{passage.reference}</h1>
        <p className="obs-text-passages__themes mt-3">
          {passage.themes.join(" · ")}
        </p>
      </header>

      <section
        aria-labelledby="obs-text-english"
        className="obs-studio__section obs-text-section obs-text-section--text"
        data-stratum="text"
      >
        <p className="obs-text-section__stratum">Source · translation</p>
        <h2 id="obs-text-english" className="obs-studio__folio">
          Text
        </h2>
        <figure className="obs-text-english mt-7 sm:mt-8">
          <blockquote className="obs-text-english__quote">
            {passage.englishPrimary.text}
          </blockquote>
          <figcaption className="obs-text-english__cap">
            {passage.englishPrimary.label}
            <span className="obs-studio__status-sep" aria-hidden>
              ·
            </span>
            {passage.englishPrimary.attribution}
          </figcaption>
        </figure>

        {!revealed ? (
          <div className="obs-text-reveal">
            <button
              type="button"
              className="obs-text-reveal__btn"
              onClick={() => setRevealed(true)}
            >
              Look beneath the translation
            </button>
            <p className="obs-text-reveal__whisper">
              Reveal the original {passage.original.scriptLabel}.
            </p>
          </div>
        ) : (
          <div className="obs-text-beneath">
            <p className="obs-studio__folio obs-text-beneath__label">
              Beneath the English
            </p>
            <OriginalLine
              passage={passage}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        )}
      </section>

      {revealed && (
        <>
          <section
            aria-labelledby="obs-text-language"
            className="obs-studio__section obs-text-section obs-text-section--language"
            data-stratum="language"
          >
            <p className="obs-text-section__stratum">Linguistic evidence</p>
            <h2 id="obs-text-language" className="obs-studio__folio">
              Language
            </h2>
            <ul className="obs-text-notes mt-7 sm:mt-8" role="list">
              {passage.sections.languageNotes.map((note) => (
                <li key={note.id}>
                  <p className="obs-text-notes__text">{note.text}</p>
                  <EvidenceInspect claim={note} />
                </li>
              ))}
            </ul>
            <p className="obs-text-panel__caution mt-7 max-w-xl">
              {passage.semanticRangeNote}
            </p>
          </section>

          <section
            aria-labelledby="obs-text-compare"
            className="obs-studio__section obs-text-section obs-text-section--language"
            data-stratum="translation"
          >
            <p className="obs-text-section__stratum">Translation choices</p>
            <h2 id="obs-text-compare" className="obs-studio__folio">
              Compare translations
            </h2>
            <p className="obs-text-compare__framing mt-5 max-w-xl">
              English translations must choose how to carry nephesh hayyah.
              Older versions often use “living soul”; others use “living
              creature” or “living being.” The difference matters because
              modern English “soul” can suggest an immaterial, separable self
              in ways the Hebrew phrase does not necessarily specify here.
              “Living being” is not the one correct translation; “soul” is not
              simply a mistranslation.
            </p>
            <div className="mt-7 sm:mt-8">
              <TranslationCompare
                translations={visibleTranslations}
                primaryId={visibleTranslations[0]?.id ?? "asv"}
                preferredRightId="ylt"
              />
            </div>
            <p className="obs-text-compare__jps mt-6 max-w-xl">
              JPS / NJPS 1985 renders the closing phrase as “living being”
              (cited as translation evidence, not as Jewish doctrine; full
              copyrighted verse text is not reproduced here).
            </p>
          </section>

          <section
            aria-labelledby="obs-text-context"
            className="obs-studio__section obs-text-section obs-text-section--context"
            data-stratum="context"
          >
            <p className="obs-text-section__stratum">
              Historical · literary setting
            </p>
            <h2 id="obs-text-context" className="obs-studio__folio">
              Context
            </h2>
            <div className="obs-text-blocks mt-7 sm:mt-8">
              {passage.sections.context.map((block) => (
                <div key={block.title} className="obs-text-block">
                  <h3 className="obs-text-block__title">{block.title}</h3>
                  <p>{block.body}</p>
                  <EvidenceInspect
                    claim={{
                      id: `ctx-${block.title}`,
                      text: block.body,
                      category: block.category,
                      confidence: block.confidence,
                      sourceIds: block.sourceIds,
                      verificationStatus: block.verificationStatus,
                      title: block.title,
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="obs-text-interp"
            className="obs-studio__section obs-text-section obs-text-section--interpretation"
            data-stratum="interpretation"
          >
            <p className="obs-text-section__stratum">Attributed readings</p>
            <h2 id="obs-text-interp" className="obs-studio__folio">
              Interpretation
            </h2>
            <p className="obs-text-interp__framing mt-5 max-w-xl">
              Readings below are attributed voices within traditions — not
              linguistic facts, and not a single consensus for each tradition.
              Jewish interpretation of the Hebrew Bible is not an “alternative”
              to a Christian default.
            </p>
            <ul className="obs-text-interp mt-7 sm:mt-8" role="list">
              {passage.sections.interpretation.map((group) =>
                group.readings.map((reading) => (
                  <li
                    key={reading.id}
                    className="obs-text-interp__item"
                    data-tradition={group.tradition}
                    data-verification={reading.verificationStatus}
                  >
                    <p className="obs-studio__status">
                      <span className="obs-studio__status-live">
                        {traditionLabel[group.tradition]}
                      </span>
                      <span className="obs-studio__status-sep" aria-hidden>
                        ·
                      </span>
                      <span>{confidenceLabel(reading.confidence)}</span>
                    </p>
                    <h3 className="obs-text-block__title">
                      {reading.interpreter
                        ? reading.work
                          ? `${reading.interpreter} — ${reading.work}`
                          : reading.interpreter
                        : group.label}
                    </h3>
                    <p>{reading.body}</p>
                    <EvidenceInspect
                      claim={{
                        id: reading.id,
                        text: reading.body,
                        category:
                          group.tradition === "academic"
                            ? "scholarly-interpretation"
                            : "interpretive-tradition",
                        confidence: reading.confidence,
                        sourceIds: reading.sourceIds,
                        verificationStatus: reading.verificationStatus,
                        title: reading.interpreter ?? group.label,
                      }}
                    />
                  </li>
                )),
              )}
            </ul>
          </section>

          <section
            aria-labelledby="obs-text-terrain"
            className="obs-studio__section obs-text-section obs-text-section--terrain"
            data-stratum="terrain"
          >
            <p className="obs-text-section__stratum">
              Exploratory relationships
            </p>
            <h2 id="obs-text-terrain" className="obs-studio__folio">
              Follow the terrain
            </h2>
            <p className="obs-text-terrain__framing mt-5 max-w-xl">
              The textual evidence ends here. What follows are relationships
              opened by the passage — not equivalences, not destinations that
              exist yet, and not linguistic conclusions.
            </p>
            <ul className="obs-text-terrain mt-7 sm:mt-8" role="list">
              {passage.sections.terrain.map((link) => (
                <li key={link.label} className="obs-text-terrain__item">
                  <p className="obs-text-terrain__kind">
                    {terrainKindLabel[link.kind]} · Exploratory
                  </p>
                  <p className="obs-text-terrain__label">{link.label}</p>
                  {link.note && (
                    <p className="obs-text-terrain__note">{link.note}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="obs-text-open"
            className="obs-studio__section obs-text-section obs-text-section--open"
            data-stratum="open"
          >
            <p className="obs-text-section__stratum">Unresolved</p>
            <h2 id="obs-text-open" className="obs-studio__folio">
              What remains open
            </h2>
            <ul className="obs-text-open mt-7 sm:mt-8" role="list">
              {passage.sections.remainsOpen.map((q) => (
                <li key={q.question} className="obs-text-open__item">
                  <p className="obs-text-open__q">{q.question}</p>
                  <p className="obs-text-open__why">{q.whyOpen}</p>
                </li>
              ))}
            </ul>
          </section>

          <details className="obs-text-method">
            <summary>{INSTRUMENT_01.methodTitle}</summary>
            <div className="obs-text-method__body">
              {INSTRUMENT_01.methodBody.map((para) => (
                <p key={para.slice(0, 48)}>{para}</p>
              ))}
            </div>
          </details>
        </>
      )}
    </article>
  );
}
