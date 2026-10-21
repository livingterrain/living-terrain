"use client";

import { Fragment, type ReactNode } from "react";
import {
  epistemicLabel,
  getSpiralStage,
  occurrencesForRelationship,
  type SpiralDiscovery,
  type SpiralDiscoveryPlace,
  type SpiralDiscoverySlot,
  type SpiralSequenceStop,
  type SpiralSourceRef,
  type SpiralTrajectoryRelationship,
} from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";
import { SpiralInvestigate } from "./SpiralInvestigate";

type Props = {
  discovery: SpiralDiscovery;
  /** Lens panels keep their research rule; cards keep the card's Investigate. */
  variant: "lens" | "card";
  places?: Partial<Record<SpiralDiscoveryPlace, ReactNode>>;
  /** False hides Explore and Investigate — one deeper surface at a time. */
  showDeeper?: boolean;
  exploreOpen: boolean;
  onExploreToggle: () => void;
  exploreId: string;
  investigateOpen: boolean;
  onInvestigateToggle: (conceptHint?: string) => void;
  investigateId: string;
  conceptId: string | null;
  onConceptChange: (conceptId: string | null) => void;
  onSelectOccurrence: (occurrenceId: string) => void;
};

function stopName(stop: SpiralSequenceStop): string {
  return stop.labelOverride ?? getSpiralStage(stop.stageId)?.name ?? stop.stageId;
}

function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => (
          <p key={p.slice(0, 48)} className={className}>
            {p}
          </p>
        ))}
    </>
  );
}

function SourceList({ sources }: { sources: readonly SpiralSourceRef[] }) {
  return (
    <ul className="spiral-trajectory__sources">
      {sources.map((s) => (
        <li key={s.id}>
          {s.title ?? s.supports}
          {s.authors ? ` — ${s.authors}` : ""}
          {s.year ? ` (${s.year})` : ""}
        </li>
      ))}
    </ul>
  );
}

/** Operations the trajectory has authored records with — never inferred. */
function RelationshipSummary({
  drawn,
  breaks,
  onSelectOccurrence,
}: {
  drawn: readonly SpiralTrajectoryRelationship[];
  breaks: readonly SpiralTrajectoryRelationship[];
  onSelectOccurrence: (occurrenceId: string) => void;
}) {
  if (drawn.length + breaks.length === 0) {
    return (
      <p className="spiral-trajectory__summary">
        This trajectory has been charted independently. No Spiral
        relationships have been authored yet.
      </p>
    );
  }
  const tally = (rels: readonly SpiralTrajectoryRelationship[]) => {
    const counts = new Map<string, { stop: SpiralSequenceStop; n: number }>();
    for (const r of rels) {
      for (const stop of occurrencesForRelationship(r)) {
        const prev = counts.get(stop.occurrenceId);
        counts.set(stop.occurrenceId, { stop, n: (prev?.n ?? 0) + 1 });
      }
    }
    return Array.from(counts.values());
  };
  const jumps = (entries: ReturnType<typeof tally>) =>
    entries.map(({ stop, n }, i) => (
      <span key={stop.occurrenceId}>
        {i > 0 && ", "}
        <button
          type="button"
          className="spiral-lens-context__jump"
          onClick={() => onSelectOccurrence(stop.occurrenceId)}
        >
          {stopName(stop)}
        </button>{" "}
        ({n})
      </span>
    ));
  return (
    <p className="spiral-trajectory__summary">
      {drawn.length > 0 && (
        <>
          <span>Authored relationships with the Spiral: </span>
          {jumps(tally(drawn))}
          <span>. </span>
        </>
      )}
      {breaks.length > 0 && (
        <>
          <span>Comparison breaks, drawn without a line: </span>
          {jumps(tally(breaks))}
          <span>. </span>
        </>
      )}
      {drawn.length + breaks.length > 1 && (
        <span>Each is a separate finding, not a path through the Spiral. </span>
      )}
      <span>
        Everything else is unresearched. No correspondence is assumed, and
        there may be none.
      </span>
    </p>
  );
}

/**
 * One depth model for every Spiral surface: Understand is always shown;
 * Explore and Investigate are siblings, each offered only when authored
 * material exists for it.
 */
export function SpiralDepth({
  discovery,
  variant,
  places = {},
  showDeeper = true,
  exploreOpen,
  onExploreToggle,
  exploreId,
  investigateOpen,
  onInvestigateToggle,
  investigateId,
  conceptId,
  onConceptChange,
  onSelectOccurrence,
}: Props) {
  const lensPanel = variant === "lens";
  const conceptHint = discovery.investigate.find(
    (s): s is Extract<SpiralDiscoverySlot, { kind: "research" }> => s.kind === "research",
  )?.conceptHint;

  const render = (slot: SpiralDiscoverySlot, i: number): ReactNode => {
    const key = `${slot.kind}-${i}`;
    switch (slot.kind) {
      case "place":
        return <Fragment key={key}>{places[slot.place]}</Fragment>;
      case "intro":
        return (
          <p key={key} className="spiral-lens-context__intro">
            {slot.text}
          </p>
        );
      case "evidence":
        return (
          <p key={key} className={lensPanel ? "spiral-lens-context__evidence" : "spiral-card__scale"}>
            {slot.lensLabel && <span className="spiral-op__def-label">{slot.lensLabel} lens: </span>}
            {slot.text}
          </p>
        );
      case "description":
        return (
          <p key={key} className="spiral-trajectory__desc">
            {slot.text}
          </p>
        );
      case "uncharted":
        return (
          <Fragment key={key}>
            <p className="spiral-lens-context__progress">Not yet charted.</p>
            {slot.forthcoming.length > 0 && (
              <p className="spiral-lens-context__forthcoming">
                <span className="spiral-lens-context__forthcoming-label">
                  Being considered:
                </span>{" "}
                {slot.forthcoming.join(" · ")}
              </p>
            )}
          </Fragment>
        );
      case "key":
        return (
          <Fragment key={key}>
            {slot.lines && (
              <p className="spiral-trajectory__key">
                <span className="spiral-trajectory__key-line" aria-hidden="true" />
                Lines mark researched relationships.
              </p>
            )}
            {slot.breaks && (
              <p className="spiral-trajectory__key">
                <span
                  className="spiral-trajectory__key-line spiral-trajectory__key-line--break"
                  aria-hidden="true"
                />
                Dotted marks: a comparison was investigated here and does not hold.
              </p>
            )}
          </Fragment>
        );
      case "takeaway":
        return (
          <p key={key} className="spiral-trajectory__takeaway">
            <span className="spiral-trajectory__takeaway-label">What this shows</span>
            {slot.text}
          </p>
        );
      case "caution":
        return (
          <p key={key} className="spiral-trajectory__takeaway spiral-depth__caution">
            <span className="spiral-trajectory__takeaway-label">{slot.title}</span>
            {slot.text}
          </p>
        );
      case "finding":
        return (
          <p
            key={key}
            className="spiral-card__scale spiral-depth__finding"
            data-finding={slot.finding}
          >
            <span className="spiral-op__def-label">
              {slot.finding === "comparison-break" ? "Finding: " : "Status: "}
            </span>
            {slot.label} — {slot.definition}
          </p>
        );
      case "knowing":
        return (
          <p key={key} className="spiral-card__scale spiral-depth__knowing">
            <span className="spiral-op__def-label">Ways of knowing: </span>
            {slot.families.map((f) => f.label).join(" · ")}
          </p>
        );
      case "note":
        return (
          <p key={key} className="spiral-card__note">
            {slot.text}
          </p>
        );
      case "scale":
        return (
          <p key={key} className="spiral-card__scale">
            <span className="spiral-op__def-label">Scale: </span>
            {slot.scale.id.replace(/-/g, " ")}.{slot.scale.note ? ` ${slot.scale.note}` : null}
          </p>
        );
      case "question":
        return (
          <p key={key} className="spiral-card__question">
            {slot.text}
          </p>
        );
      case "epistemic":
        return (
          <p key={key} className="spiral-op__rel-meta">
            {slot.kinds.map(epistemicLabel).join(" · ")}
          </p>
        );
      case "definition":
        return (
          <p key={key} className="spiral-op__def">
            <span className="spiral-op__def-label">{slot.name}, defined: </span>
            {slot.text}
          </p>
        );
      case "issues":
        return (
          <Fragment key={key}>
            {slot.issues.map((issue) => (
              <details key={issue.id} className="spiral-trajectory__issue">
                <summary className="spiral-trajectory__issue-summary">
                  {lensPanel && (
                    <span className="spiral-trajectory__issue-label">
                      Open research question
                    </span>
                  )}
                  <span className="spiral-trajectory__issue-question">{issue.question}</span>
                </summary>
                {issue.body && <p className="spiral-trajectory__issue-body">{issue.body}</p>}
                {issue.items && (
                  <ul className="spiral-trajectory__issue-items">
                    {issue.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </details>
            ))}
          </Fragment>
        );
      case "guardrail":
        return (
          <p key={key} className="spiral-op__guardrail">
            {slot.text}
          </p>
        );
      case "summary":
        return (
          <RelationshipSummary
            key={key}
            drawn={slot.drawn}
            breaks={slot.breaks}
            onSelectOccurrence={onSelectOccurrence}
          />
        );
      case "framing":
        return <Paragraphs key={key} text={slot.text} className="spiral-trajectory__research-body" />;
      case "provenance":
        return (
          <p key={key} className="spiral-trajectory__research-note">
            {slot.text}
          </p>
        );
      case "breaks":
        return (
          <div key={key} className="spiral-trajectory__research-break">
            <p className="spiral-trajectory__research-label">{slot.title}</p>
            <Paragraphs text={slot.body} className="spiral-trajectory__research-body" />
          </div>
        );
      case "open-questions":
        return (
          <div key={key}>
            <p className="spiral-trajectory__research-label">Open questions</p>
            <ul className="spiral-trajectory__issue-items">
              {slot.items.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        );
      case "sources":
        return <SourceList key={key} sources={slot.sources} />;
      case "research":
        return (
          <SpiralInvestigate
            key={key}
            exploration={slot.exploration}
            conceptId={conceptId}
            onConceptChange={onConceptChange}
          />
        );
      case "researched-stops":
        return (
          <p key={key} className="spiral-lens-context__researched">
            <span>Stage-level research so far at </span>
            {slot.stops.map((stop, n) => (
              <span key={stop.occurrenceId}>
                {n > 0 && ", "}
                <button
                  type="button"
                  className="spiral-lens-context__jump"
                  onClick={() => onSelectOccurrence(stop.occurrenceId)}
                >
                  {stopName(stop)}
                </button>
              </span>
            ))}
            <span>.</span>
          </p>
        );
      case "readings":
        return (
          <div key={key} className="spiral-depth__readings">
            <ul className="spiral-depth__reading-list">
              {slot.readings.map((r) => (
                <li key={r.trajectoryTitle} className="spiral-trajectory__summary">
                  <span className="spiral-op__def-label">
                    {r.lensLabel} · {r.trajectoryTitle}:{" "}
                  </span>
                  {r.text}
                </li>
              ))}
            </ul>
            <p className="spiral-across__note">{slot.boundary}</p>
          </div>
        );
    }
  };

  const deeper = (slotsAt: readonly SpiralDiscoverySlot[]) =>
    lensPanel ? (
      <div className="spiral-trajectory__research">{slotsAt.map(render)}</div>
    ) : (
      slotsAt.map(render)
    );

  return (
    <>
      {discovery.understand.map(render)}
      {showDeeper && discovery.explore.length > 0 && (
        <div className={cn("spiral-op__explore", lensPanel && "spiral-depth__explore")}>
          <button
            type="button"
            className="spiral-op__explore-toggle"
            aria-expanded={exploreOpen}
            aria-controls={exploreId}
            onClick={onExploreToggle}
          >
            Explore
            <span aria-hidden="true">{exploreOpen ? " ↑" : " →"}</span>
          </button>
          <div id={exploreId} className="spiral-op__explore-body" hidden={!exploreOpen}>
            {exploreOpen && deeper(discovery.explore)}
          </div>
        </div>
      )}
      {showDeeper && discovery.investigate.length > 0 && (
        <div className={lensPanel ? "spiral-lens-context__research" : "spiral-op__investigate"}>
          <button
            type="button"
            className="spiral-op__investigate-toggle"
            aria-expanded={investigateOpen}
            aria-controls={investigateId}
            onClick={() => onInvestigateToggle(conceptHint)}
          >
            <span className="spiral-op__investigate-title">Investigate</span>
            <span className="spiral-op__investigate-lead">{discovery.investigateLead}</span>
          </button>
          <div
            id={investigateId}
            className={lensPanel ? "spiral-lens-context__research-body" : "spiral-op__investigate-body"}
            hidden={!investigateOpen}
          >
            {investigateOpen && deeper(discovery.investigate)}
          </div>
        </div>
      )}
    </>
  );
}
