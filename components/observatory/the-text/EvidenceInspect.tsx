"use client";

import { useId, useState } from "react";
import {
  claimStatusLine,
  isAuthoringNote,
  resolveClaimSources,
  visitorFacingNote,
} from "@/lib/observatory/the-text/provenance";
import type { EvidenceClaim } from "@/lib/observatory/the-text";

/**
 * Quiet “Why this?” affordance — instrument inspection, not Wikipedia footnotes.
 * Not used for Living Terrain exploratory nodes.
 * Authoring flags (FLAG / TBD / awaiting research) stay in data; not shown here.
 */
export function EvidenceInspect({
  claim,
  compact = false,
}: {
  claim: EvidenceClaim;
  compact?: boolean;
}) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const sources = resolveClaimSources(claim);
  const clarification = visitorFacingNote(claim);

  if (claim.category === "living-terrain-exploration") {
    return null;
  }

  return (
    <span className="obs-text-evidence">
      <button
        type="button"
        className={
          compact
            ? "obs-text-evidence__mark obs-text-evidence__mark--compact"
            : "obs-text-evidence__mark"
        }
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        Why this?
      </button>
      {open && (
        <div
          id={panelId}
          className="obs-text-evidence__drawer"
          role="region"
          aria-label="Evidence for this claim"
        >
          <p className="obs-text-evidence__status">{claimStatusLine(claim)}</p>
          {clarification && (
            <p className="obs-text-evidence__flag">{clarification}</p>
          )}
          {sources.length > 0 ? (
            <ul className="obs-text-evidence__sources" role="list">
              {sources.map((s) => {
                const srcNote =
                  s.visitorNote ||
                  (s.note && !isAuthoringNote(s.note) ? s.note : undefined);
                return (
                  <li key={s.id}>
                    <p className="obs-text-evidence__short">{s.shortCitation}</p>
                    <p className="obs-text-evidence__full">{s.fullCitation}</p>
                    {srcNote && (
                      <p className="obs-text-evidence__src-note">{srcNote}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="obs-text-evidence__empty">
              No sources attached to this claim yet.
            </p>
          )}
          <button
            type="button"
            className="obs-text-evidence__close"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      )}
    </span>
  );
}
