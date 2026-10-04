"use client";

import {
  epistemicLabel,
  getSpiralDomain,
  getSpiralStage,
  normalizeProvenance,
  provenanceLabel,
  type SpiralAcrossExploration,
  type SpiralAcrossSection,
  type SpiralConcept,
  type SpiralConceptDiveSection,
  type SpiralEpistemicKind,
  type SpiralExploreViewId,
  type SpiralLensCycleContext,
  type SpiralLensExploration,
  type SpiralProvenanceKind,
  type SpiralSequenceStop,
  type SpiralSourceRef,
  type SpiralStageExploration,
} from "@/lib/evolutionary-spiral";
import { SpiralLensRail } from "./SpiralLensRail";
import { cn } from "@/lib/utils";

type Props = {
  stop: SpiralSequenceStop;
  exploration: SpiralStageExploration;
  viewId: SpiralExploreViewId;
  onViewChange: (viewId: SpiralExploreViewId) => void;
  /** Null = concept index (or Across). Set = deep dive. */
  conceptId: string | null;
  onConceptChange: (conceptId: string | null) => void;
  panelId: string;
};

function EpistemicMark({ kind }: { kind: SpiralEpistemicKind }) {
  return (
    <span className="spiral-explore__epistemic" title={epistemicLabel(kind)}>
      {epistemicLabel(kind)}
    </span>
  );
}

function EpistemicMarks({
  kind,
  kinds,
}: {
  kind?: SpiralEpistemicKind;
  kinds?: readonly SpiralEpistemicKind[];
}) {
  const list =
    kinds && kinds.length > 0 ? kinds : kind ? [kind] : ([] as SpiralEpistemicKind[]);
  if (list.length === 0) return null;
  return (
    <span className="spiral-explore__epistemic-row">
      {list.map((k) => (
        <EpistemicMark key={k} kind={k} />
      ))}
    </span>
  );
}

/** Split authored blank-line paragraphs without inventing copy. */
function Prose({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length <= 1) {
    return <p className={className}>{text}</p>;
  }
  return (
    <div className={cn("spiral-explore__prose", className)}>
      {parts.map((part) => (
        <p key={part.slice(0, 48)} className="spiral-explore__section-body">
          {part}
        </p>
      ))}
    </div>
  );
}

function ProvenanceMarks({
  provenance,
}: {
  provenance: SpiralProvenanceKind | readonly SpiralProvenanceKind[] | undefined;
}) {
  const kinds = normalizeProvenance(provenance);
  if (kinds.length === 0) return null;
  return (
    <span className="spiral-explore__provenance-row">
      {kinds.map((kind) => (
        <span
          key={kind}
          className="spiral-explore__provenance"
          title={provenanceLabel(kind)}
        >
          {provenanceLabel(kind)}
        </span>
      ))}
    </span>
  );
}

function PlaceholderMark() {
  return (
    <span className="spiral-explore__placeholder-mark">
      Placeholder — awaiting research
    </span>
  );
}

/** Editorial location path — not a SaaS breadcrumb trail. */
function ExplorePath({
  stageName,
  lensLabel,
  conceptTitle,
  onLens,
}: {
  stageName: string;
  lensLabel?: string;
  conceptTitle?: string;
  onLens?: () => void;
}) {
  return (
    <p className="spiral-explore__path" aria-label="Exploration location">
      <span className="spiral-explore__path-stage">{stageName}</span>
      {lensLabel && (
        <>
          <span className="spiral-explore__path-sep" aria-hidden="true">
            →
          </span>
          {onLens ? (
            <button
              type="button"
              className="spiral-explore__path-link"
              onClick={onLens}
            >
              {lensLabel}
            </button>
          ) : (
            <span className="spiral-explore__path-lens">{lensLabel}</span>
          )}
        </>
      )}
      {conceptTitle && (
        <>
          <span className="spiral-explore__path-sep" aria-hidden="true">
            →
          </span>
          <span className="spiral-explore__path-concept">{conceptTitle}</span>
        </>
      )}
    </p>
  );
}

function DiveSectionView({ section }: { section: SpiralConceptDiveSection }) {
  const isBreak =
    section.kind === "comparison-breaks" || section.kind === "open-questions";
  const isBody = section.kind === "general" || section.kind === "pattern";
  const showTitle = Boolean(section.title?.trim());
  return (
    <section
      className={cn(
        "spiral-explore__section",
        isBody && !showTitle && "spiral-explore__section--body",
        isBreak && "spiral-explore__section--breaks",
        section.placeholder && "spiral-explore__section--placeholder",
      )}
    >
      {(showTitle || section.placeholder) && (
        <header className="spiral-explore__section-head">
          {showTitle && (
            <h4 className="spiral-explore__section-title">{section.title}</h4>
          )}
          {section.placeholder && <PlaceholderMark />}
        </header>
      )}
      {section.body && (
        <Prose text={section.body} className="spiral-explore__section-body" />
      )}
      {section.items && section.items.length > 0 && (
        <ul className="spiral-explore__bullet-list">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

function sourceLocatorLabel(url: string): string {
  const pmc = url.match(/PMC\d+/i);
  if (pmc) return pmc[0].toUpperCase();
  return url;
}

function SourcesBlock({ sources }: { sources: readonly SpiralSourceRef[] }) {
  return (
    <section className="spiral-explore__section spiral-explore__section--sources">
      <header className="spiral-explore__section-head">
        <h4 className="spiral-explore__section-title">Sources</h4>
      </header>
      <ul className="spiral-explore__sources">
        {sources.map((src) => (
          <li
            key={src.id}
            className={cn(
              "spiral-explore__source",
              src.placeholder && "spiral-explore__source--placeholder",
            )}
          >
            {src.title ? (
              <span className="spiral-explore__source-title">{src.title}</span>
            ) : null}
            {(src.authors || src.year || src.publication) && (
              <span className="spiral-explore__source-meta">
                {[src.authors, src.year, src.publication]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            )}
            {src.url && (
              <a
                className="spiral-explore__source-locator"
                href={src.url}
                target="_blank"
                rel="noreferrer"
              >
                {sourceLocatorLabel(src.url)}
              </a>
            )}
            {src.supports && (
              <span className="spiral-explore__source-supports">
                {src.supports}
              </span>
            )}
            {src.placeholder && <PlaceholderMark />}
          </li>
        ))}
      </ul>
    </section>
  );
}

function CycleContextView({ context }: { context: SpiralLensCycleContext }) {
  return (
    <section
      className="spiral-explore__cycle"
      aria-label={context.title ?? "Symbolic cycle context"}
    >
      {context.title && (
        <h4 className="spiral-explore__cycle-title">{context.title}</h4>
      )}
      <p className="spiral-explore__cycle-note">{context.provenanceNote}</p>

      {context.structureNote && (
        <div className="spiral-explore__cycle-structure">
          <div className="spiral-explore__concept-meta">
            <ProvenanceMarks provenance={context.structureNote.provenance} />
          </div>
          <h5 className="spiral-explore__cycle-structure-title">
            {context.structureNote.title}
          </h5>
          <Prose
            text={context.structureNote.body}
            className="spiral-explore__section-body"
          />
        </div>
      )}

      <ol className="spiral-explore__cycle-stops">
        {context.stops.map((stop, index) => {
          const emphasis =
            stop.emphasis ??
            (context.focusId && stop.id === context.focusId
              ? "focus"
              : "default");
          return (
            <li
              key={stop.id}
              className={cn(
                "spiral-explore__cycle-stop",
                emphasis === "focus" && "spiral-explore__cycle-stop--focus",
                emphasis === "neighbor" &&
                  "spiral-explore__cycle-stop--neighbor",
                stop.recurrence && "spiral-explore__cycle-stop--recurrence",
              )}
            >
              {index > 0 && (
                <span className="spiral-explore__cycle-arrow" aria-hidden="true">
                  →
                </span>
              )}
              <span className="spiral-explore__cycle-stop-main">
                <span className="spiral-explore__cycle-stop-label">
                  {stop.label}
                </span>
                {stop.gloss && (
                  <span className="spiral-explore__cycle-stop-gloss">
                    {stop.gloss}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>

      {context.transitions && context.transitions.length > 0 && (
        <div className="spiral-explore__cycle-transitions">
          {context.transitions.map((tr) => (
            <div key={tr.id} className="spiral-explore__cycle-transition">
              <div className="spiral-explore__concept-meta">
                <ProvenanceMarks provenance={tr.provenance} />
              </div>
              <h5 className="spiral-explore__cycle-transition-label">
                {tr.label}
              </h5>
              <Prose
                text={tr.body}
                className="spiral-explore__section-body"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function CircleAndSpiralView({
  section,
}: {
  section: NonNullable<SpiralLensCycleContext["circleAndSpiral"]>;
}) {
  return (
    <section className="spiral-explore__cycle-circle spiral-explore__section">
      <div className="spiral-explore__concept-meta">
        <ProvenanceMarks provenance={section.provenance} />
      </div>
      <h4 className="spiral-explore__cycle-circle-title">{section.title}</h4>
      <Prose text={section.body} className="spiral-explore__section-body" />
    </section>
  );
}

function ConceptIndex({
  lens,
  onOpen,
}: {
  lens: SpiralLensExploration;
  onOpen: (conceptId: string) => void;
}) {
  const domain = getSpiralDomain(lens.lensId);
  return (
    <div className="spiral-explore__lens-body">
      <p className="spiral-explore__lens-label">{domain?.label ?? lens.lensId}</p>
      {lens.title && (
        <h4 className="spiral-explore__lens-title">{lens.title}</h4>
      )}
      {lens.framing && (
        <Prose text={lens.framing} className="spiral-explore__framing" />
      )}
      {lens.cycleContext && <CycleContextView context={lens.cycleContext} />}
      <p className="spiral-explore__index-cue">
        Concepts — choose how far to go
      </p>
      <ul className="spiral-explore__concepts">
        {lens.concepts.map((concept) => (
          <li key={concept.id}>
            <button
              type="button"
              className={cn(
                "spiral-explore__concept",
                concept.placeholder && "spiral-explore__concept--placeholder",
              )}
              onClick={() => onOpen(concept.id)}
            >
              <span className="spiral-explore__concept-meta">
                <EpistemicMarks
                  kind={concept.epistemicKind}
                  kinds={concept.epistemicKinds}
                />
                <ProvenanceMarks provenance={concept.provenance} />
                {concept.placeholder && <PlaceholderMark />}
              </span>
              <span className="spiral-explore__concept-title">
                {concept.title}
              </span>
              <span className="spiral-explore__concept-summary">
                {concept.summary}
              </span>
              <span className="spiral-explore__concept-enter">Explore</span>
            </button>
          </li>
        ))}
      </ul>
      {lens.comparisonBreaks && (
        <section
          className={cn(
            "spiral-explore__section",
            "spiral-explore__section--breaks",
            "spiral-explore__section--lens-breaks",
            lens.comparisonBreaks.placeholder &&
              "spiral-explore__section--placeholder",
          )}
        >
          <header className="spiral-explore__section-head">
            <h4 className="spiral-explore__section-title">
              {lens.comparisonBreaks.title ?? "Where the comparison breaks"}
            </h4>
            {lens.comparisonBreaks.placeholder && <PlaceholderMark />}
          </header>
          <Prose
            text={lens.comparisonBreaks.body}
            className="spiral-explore__section-body"
          />
        </section>
      )}
      {lens.cycleContext?.circleAndSpiral && (
        <CircleAndSpiralView section={lens.cycleContext.circleAndSpiral} />
      )}
      {lens.openQuestions && lens.openQuestions.length > 0 && (
        <section className="spiral-explore__section spiral-explore__section--breaks spiral-explore__section--open">
          <header className="spiral-explore__section-head">
            <h4 className="spiral-explore__section-title">Open question</h4>
          </header>
          <ul className="spiral-explore__open-questions">
            {lens.openQuestions.map((q) => (
              <li key={q} className="spiral-explore__open-question">
                {q}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function ConceptDeepDive({
  concept,
  lensLabel,
  onBack,
}: {
  concept: SpiralConcept;
  lensLabel: string;
  onBack: () => void;
}) {
  return (
    <div
      className={cn(
        "spiral-explore__dive",
        concept.placeholder && "spiral-explore__dive--placeholder",
      )}
    >
      <button
        type="button"
        className="spiral-explore__back"
        onClick={onBack}
      >
        ← {lensLabel} concepts
      </button>

      <header className="spiral-explore__dive-head">
        <div className="spiral-explore__concept-meta">
          <EpistemicMarks
            kind={concept.epistemicKind}
            kinds={concept.epistemicKinds}
          />
          <ProvenanceMarks provenance={concept.provenance} />
          {concept.placeholder && <PlaceholderMark />}
        </div>
        <h4 className="spiral-explore__dive-title">{concept.title}</h4>
        <p className="spiral-explore__dive-summary">{concept.summary}</p>
      </header>

      {(() => {
        const sections = concept.sections ?? [];
        const isBody = (s: SpiralConceptDiveSection) =>
          s.kind === "general" || s.kind === "pattern";
        let split = sections.length;
        for (let i = 0; i < sections.length; i++) {
          if (!isBody(sections[i]!)) {
            split = i;
            break;
          }
        }
        const bodySections = sections.slice(0, split);
        const restSections = sections.slice(split);
        return (
          <>
            {bodySections.map((section) => (
              <DiveSectionView key={section.id} section={section} />
            ))}
            {concept.whisper && (
              <p className="spiral-explore__whisper-line">{concept.whisper}</p>
            )}
            {restSections.map((section) => (
              <DiveSectionView key={section.id} section={section} />
            ))}
          </>
        );
      })()}

      {concept.sources && concept.sources.length > 0 && (
        <SourcesBlock sources={concept.sources} />
      )}

      {concept.comparisonBreaks && (
        <section
          className={cn(
            "spiral-explore__section",
            "spiral-explore__section--breaks",
            concept.comparisonBreaks.placeholder &&
              "spiral-explore__section--placeholder",
          )}
        >
          <header className="spiral-explore__section-head">
            <h4 className="spiral-explore__section-title">
              {concept.comparisonBreaks.title ?? "Where the comparison breaks"}
            </h4>
            {concept.comparisonBreaks.placeholder && <PlaceholderMark />}
          </header>
          <Prose
            text={concept.comparisonBreaks.body}
            className="spiral-explore__section-body"
          />
        </section>
      )}

      {concept.openQuestions && concept.openQuestions.length > 0 && (
        <section className="spiral-explore__section spiral-explore__section--breaks spiral-explore__section--open">
          <header className="spiral-explore__section-head">
            <h4 className="spiral-explore__section-title">Open questions</h4>
          </header>
          <ul className="spiral-explore__open-questions">
            {concept.openQuestions.map((q) => (
              <li key={q} className="spiral-explore__open-question">
                {q}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function AcrossSectionView({ section }: { section: SpiralAcrossSection }) {
  const counter = section.emphasis === "counter";
  return (
    <section
      className={cn(
        "spiral-explore__section",
        "spiral-explore__across-section",
        counter && "spiral-explore__across-section--counter",
        section.placeholder && "spiral-explore__section--placeholder",
      )}
    >
      <header className="spiral-explore__section-head">
        <h4 className="spiral-explore__section-title">{section.title}</h4>
        {counter && (
          <span className="spiral-explore__counter-mark">Disagreement</span>
        )}
        {section.placeholder && <PlaceholderMark />}
      </header>
      {section.body && (
        <p className="spiral-explore__section-body">{section.body}</p>
      )}
      {section.items && section.items.length > 0 && (
        <ul
          className={cn(
            "spiral-explore__across-items",
            counter && "spiral-explore__across-items--counter",
          )}
        >
          {section.items.map((item) => (
            <li
              key={item.id}
              className={cn(
                "spiral-explore__across-item",
                item.placeholder && "spiral-explore__across-item--placeholder",
              )}
            >
              <h5 className="spiral-explore__across-item-title">{item.title}</h5>
              {item.body && (
                <p className="spiral-explore__across-item-body">{item.body}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function AcrossBody({ across }: { across: SpiralAcrossExploration }) {
  return (
    <div
      className={cn(
        "spiral-explore__across",
        across.placeholder && "spiral-explore__across--placeholder",
      )}
    >
      <p className="spiral-explore__lens-label">{across.title ?? "Across lenses"}</p>
      {across.framing && (
        <p className="spiral-explore__framing">{across.framing}</p>
      )}
      <p className="spiral-explore__across-note">
        Structural resemblance is not common causation, historical transmission,
        or equal evidence across languages.
      </p>
      {across.sections.map((section) => (
        <AcrossSectionView key={section.id} section={section} />
      ))}
    </div>
  );
}

/**
 * Deep exploration surface: Stage → Lens → Concept → Deep dive.
 * Lens / concept changes never alter occurrenceId (held by parent).
 */
export function SpiralStageExplorer({
  stop,
  exploration,
  viewId,
  onViewChange,
  conceptId,
  onConceptChange,
  panelId,
}: Props) {
  const stage = getSpiralStage(stop.stageId);
  if (!stage) return null;

  const title = stop.labelOverride ?? stage.name;
  const lens =
    viewId === "across"
      ? undefined
      : exploration.lenses.find((l) => l.lensId === viewId);
  const domain = lens ? getSpiralDomain(lens.lensId) : undefined;
  const concept =
    lens && conceptId
      ? lens.concepts.find((c) => c.id === conceptId)
      : undefined;

  const handleLensSelect = (next: SpiralExploreViewId) => {
    // Parent clears concept + scrolls; keep single ownership of concept reset.
    onViewChange(next);
  };

  const lensLabel =
    viewId === "across"
      ? "Across"
      : (domain?.shortLabel ?? domain?.label ?? viewId);

  return (
    <article
      id={panelId}
      className={cn(
        "spiral-explore",
        concept && "spiral-explore--dive",
      )}
      aria-live="polite"
      aria-atomic="false"
      data-explore-view={viewId}
      data-concept={conceptId ?? undefined}
    >
      <div className="spiral-explore__sticky">
        <header className="spiral-explore__stage-head">
          <p className="spiral-explore__folio type-folio">
            {String(stop.order).padStart(2, "0")} · Exploring
          </p>
          <h3 className="spiral-explore__title">{title}</h3>
          <p className="spiral-explore__whisper">{stage.whisper}</p>
          <ExplorePath
            stageName={title}
            lensLabel={lensLabel}
            conceptTitle={concept?.title}
            onLens={
              concept
                ? () => {
                    onConceptChange(null);
                  }
                : undefined
            }
          />
        </header>

        <SpiralLensRail
          exploration={exploration}
          viewId={viewId}
          onSelect={handleLensSelect}
        />
      </div>

      <div
        key={`${viewId}:${conceptId ?? "index"}`}
        className="spiral-explore__content"
        role="tabpanel"
      >
        {viewId === "across" && exploration.across ? (
          <AcrossBody across={exploration.across} />
        ) : lens && concept ? (
          <ConceptDeepDive
            concept={concept}
            lensLabel={domain?.shortLabel ?? "Lens"}
            onBack={() => onConceptChange(null)}
          />
        ) : lens ? (
          <ConceptIndex lens={lens} onOpen={onConceptChange} />
        ) : (
          <p className="spiral-explore__section-body">
            This lens is not yet available for this stage.
          </p>
        )}
      </div>
    </article>
  );
}
