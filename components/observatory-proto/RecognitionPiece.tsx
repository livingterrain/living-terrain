"use client";

/**
 * Recognition through participation.
 *
 * Tiny action: bring a second observation into relation with the first.
 * Stay with that relation. Naming arrives only afterward.
 *
 * No quiz. No score. No “correct.”
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  HOLD_BEFORE_NAMING_MS,
  getBody,
  getPattern,
} from "@/lib/observatory-proto/data";

type Beat = "alone" | "available" | "related" | "named";

const OBS_A = "itch" as const;
const OBS_B = "thread" as const;

/** Time alone before the second observation can be brought near */
const ALONE_MS = 3000;
/** Time the pair must remain related before Naming */
const RELATION_MS = Math.max(HOLD_BEFORE_NAMING_MS, 8000);

export function RecognitionPiece() {
  const pattern = getPattern("return");
  const a = getBody(OBS_A);
  const b = getBody(OBS_B);

  const [beat, setBeat] = useState<Beat>("alone");
  const reducedRef = useRef(false);
  const relationTimer = useRef<number | null>(null);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    if (beat !== "alone") return;
    const t = window.setTimeout(
      () => setBeat("available"),
      reducedRef.current ? 500 : ALONE_MS,
    );
    return () => window.clearTimeout(t);
  }, [beat]);

  const clearRelationTimer = useCallback(() => {
    if (relationTimer.current) {
      window.clearTimeout(relationTimer.current);
      relationTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (beat !== "related") {
      clearRelationTimer();
      return;
    }
    const ms = reducedRef.current ? 1000 : RELATION_MS;
    relationTimer.current = window.setTimeout(() => setBeat("named"), ms);
    return clearRelationTimer;
  }, [beat, clearRelationTimer]);

  function relate() {
    if (beat !== "available") return;
    setBeat("related");
  }

  const showB = beat !== "alone";
  const near = beat === "related" || beat === "named";

  return (
    <div className="obs-act">
      <div className={`obs-act__field${near ? " obs-act__field--related" : ""}`}>
        <article className="obs-act__obs obs-act__obs--a">
          <pre className="obs-act__text">{a.text}</pre>
        </article>

        {showB && (
          <button
            type="button"
            className={`obs-act__obs obs-act__obs--b${near ? " obs-act__obs--near" : " obs-act__obs--far"}`}
            onClick={relate}
            disabled={near}
            aria-label={
              near
                ? "Second observation, held in relation"
                : "Bring this observation near the first"
            }
          >
            <pre className="obs-act__text">{b.text}</pre>
          </button>
        )}
      </div>

      {beat === "named" && (
        <footer className="obs-act__naming">
          <p className="obs-act__name">{pattern.name}</p>
          <p className="obs-act__stabilizer">{pattern.stabilizer}</p>
        </footer>
      )}
    </div>
  );
}
