"use client";

/**
 * The Void 1.0 — emotional threshold before Atlas.
 * Spec: Creative Direction (frames 1–4, 7–9). Frames 5–6 cut for clarity.
 * Law: Sustained attention changes what becomes available.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import type { AtlasV1QuestionId } from "@/lib/atlas-v1/content";
import { VOID_QUESTIONS } from "@/lib/atlas-v1/questions";
import { cn } from "@/lib/utils";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Recognition remains the hard gate — language opens promptly after */
const HOLD_MS = 1000;
const HOLD_MS_REDUCED = 700;
/** After recognition — overlap language; do not stack long waits */
const SETTLE_MS = 250;
const QUESTIONS_AFTER_INQUIRY_MS = 250;
const QUESTION_STAGGER_MS = 100;

/** Enter / exit radii — hysteresis (M6) */
const ENTER_STILLNESS_PX = 36;
const LEAVE_GRACE_MS = 220;

type VoidPhase =
  | "alone"
  | "recognized"
  | "settled"
  | "inquiry"
  | "questions";

export type VoidSurface = "threshold" | "questions" | "rest";

type Props = {
  onChoose: (id: AtlasV1QuestionId) => void;
  /**
   * threshold — full Void entry
   * questions — return path: questions immediately
   * rest — climate only under Atlas journey (M4 continuity)
   */
  surface?: VoidSurface;
};

export function TheVoid({ onChoose, surface = "threshold" }: Props) {
  const reduced = usePrefersReducedMotion();
  const skipThreshold = surface === "questions";
  const isRest = surface === "rest";
  const surfaceEl = useRef<HTMLDivElement>(null);
  const holdTimer = useRef<number | null>(null);
  const settleTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const nearRef = useRef(false);
  const stillOrigin = useRef<{ x: number; y: number } | null>(null);
  /** Keyboard recognition completed — settle/inquiry may continue after blur (C3) */
  const attentionLatched = useRef(skipThreshold);
  const pointerTypeRef = useRef<string>("mouse");
  const capturedPointerId = useRef<number | null>(null);

  const [near, setNear] = useState(false);
  const [recognized, setRecognized] = useState(skipThreshold);
  const [phase, setPhase] = useState<VoidPhase>(
    skipThreshold ? "questions" : "alone",
  );
  const [questionsVisible, setQuestionsVisible] = useState(
    skipThreshold ? VOID_QUESTIONS.length : 0,
  );

  /** Field reciprocity only before the question list is available */
  const listOpen = phase === "questions" || skipThreshold;
  const interactive = surface === "threshold" && !listOpen;

  useEffect(() => {
    if (surface === "questions") {
      attentionLatched.current = true;
      setRecognized(true);
      setPhase("questions");
      setQuestionsVisible(VOID_QUESTIONS.length);
    }
  }, [surface]);

  const releaseCapture = useCallback(() => {
    const id = capturedPointerId.current;
    if (id != null && surfaceEl.current?.hasPointerCapture?.(id)) {
      try {
        surfaceEl.current.releasePointerCapture(id);
      } catch {
        /* ignore */
      }
    }
    capturedPointerId.current = null;
  }, []);

  // When the question list opens, stop field capture so clicks reach the buttons
  useEffect(() => {
    if (!listOpen) return;
    releaseCapture();
    nearRef.current = false;
    setNear(false);
    stillOrigin.current = null;
  }, [listOpen, releaseCapture]);

  const clearHold = useCallback(() => {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  const clearSettle = useCallback(() => {
    if (settleTimer.current) {
      window.clearTimeout(settleTimer.current);
      settleTimer.current = null;
    }
  }, []);

  const clearLeave = useCallback(() => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  const isInsideField = useCallback((clientX: number, clientY: number) => {
    const el = surfaceEl.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return (
      clientX >= r.left &&
      clientX <= r.right &&
      clientY >= r.top &&
      clientY <= r.bottom
    );
  }, []);

  const beginHold = useCallback(() => {
    if (recognized || holdTimer.current) return;
    holdTimer.current = window.setTimeout(() => {
      setRecognized(true);
      attentionLatched.current = true;
      setPhase((p) => (p === "alone" ? "recognized" : p));
    }, reduced ? HOLD_MS_REDUCED : HOLD_MS);
  }, [recognized, reduced]);

  const onNearStart = useCallback(() => {
    clearLeave();
    if (!nearRef.current) {
      nearRef.current = true;
      setNear(true);
    }
    if (!recognized) beginHold();
  }, [clearLeave, recognized, beginHold]);

  const endNearNow = useCallback(() => {
    if (!nearRef.current) return;
    nearRef.current = false;
    setNear(false);
    stillOrigin.current = null;
    clearHold();
  }, [clearHold]);

  /** M6 — grace before ending presence */
  const onNearEnd = useCallback(() => {
    clearLeave();
    leaveTimer.current = window.setTimeout(() => {
      endNearNow();
    }, LEAVE_GRACE_MS);
  }, [clearLeave, endNearNow]);

  const notePointer = useCallback(
    (clientX: number, clientY: number, pointerType: string) => {
      pointerTypeRef.current = pointerType;
      if (!isInsideField(clientX, clientY)) {
        onNearEnd();
        return;
      }

      // C2 — field presence; stillness required so haste still fails
      if (!stillOrigin.current) {
        stillOrigin.current = { x: clientX, y: clientY };
        onNearStart();
        return;
      }

      const dx = clientX - stillOrigin.current.x;
      const dy = clientY - stillOrigin.current.y;
      if (Math.hypot(dx, dy) > ENTER_STILLNESS_PX) {
        stillOrigin.current = { x: clientX, y: clientY };
        clearHold();
        if (!recognized) {
          // reset hold from new stillness origin
          if (nearRef.current) beginHold();
        }
        clearLeave();
        if (!nearRef.current) onNearStart();
        return;
      }

      onNearStart();
    },
    [
      isInsideField,
      onNearEnd,
      onNearStart,
      clearHold,
      clearLeave,
      recognized,
      beginHold,
    ],
  );

  const handlePointer = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!interactive) return;
      const target = e.target as HTMLElement | null;
      // Never steal gestures from the question list / links
      if (target?.closest("button, a, .the-void-language")) return;

      // Do not setPointerCapture — capture on the field retargets later taps
      // away from .the-void-question after recognition (input-routing bug).
      notePointer(e.clientX, e.clientY, e.pointerType);
    },
    [interactive, notePointer],
  );

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!interactive) {
        releaseCapture();
        return;
      }
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, a, .the-void-language")) {
        releaseCapture();
        return;
      }
      // C1 — mouse: pointerup must not abort if still over the field
      if (e.pointerType === "mouse") {
        if (isInsideField(e.clientX, e.clientY)) {
          stillOrigin.current = { x: e.clientX, y: e.clientY };
          onNearStart();
          return;
        }
        onNearEnd();
        releaseCapture();
        return;
      }
      // Touch / pen: finger up ends presence (with grace)
      onNearEnd();
      releaseCapture();
    },
    [interactive, isInsideField, onNearStart, onNearEnd, releaseCapture],
  );

  const handlePointerLeave = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!interactive) return;
      // Related target still inside field — ignore
      const related = e.relatedTarget as Node | null;
      if (related && surfaceEl.current?.contains(related)) return;
      onNearEnd();
    },
    [interactive, onNearEnd],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (!interactive) return;
      e.preventDefault();
    },
    [interactive],
  );

  // C3 — keyboard: focus begins participation; after recognition blur does not block language
  const handleAttendFocus = useCallback(() => {
    if (!interactive) return;
    stillOrigin.current = null;
    onNearStart();
  }, [interactive, onNearStart]);

  const handleAttendBlur = useCallback(() => {
    if (!interactive) return;
    if (attentionLatched.current || recognized) {
      // Presence softens visually but language path continues (C3 / M2)
      endNearNow();
      return;
    }
    onNearEnd();
  }, [interactive, recognized, endNearNow, onNearEnd]);

  // After recognition: short settle → inquiry, then questions soon (no long serial stack)
  useEffect(() => {
    if (!interactive || skipThreshold) return;
    if (!recognized) return;
    if (phase !== "alone" && phase !== "recognized") return;

    const mayProceed = near || attentionLatched.current;
    if (!mayProceed) {
      clearSettle();
      return;
    }

    clearSettle();
    settleTimer.current = window.setTimeout(() => {
      setPhase("inquiry");
    }, reduced ? 120 : SETTLE_MS);

    return () => clearSettle();
  }, [
    interactive,
    near,
    recognized,
    phase,
    skipThreshold,
    reduced,
    clearSettle,
  ]);

  // Questions begin shortly after inquiry is readable — not after another long fade wait
  useEffect(() => {
    if (phase !== "inquiry") return;
    const t = window.setTimeout(
      () => setPhase("questions"),
      reduced ? 40 : QUESTIONS_AFTER_INQUIRY_MS,
    );
    return () => window.clearTimeout(t);
  }, [phase, reduced]);

  // Stagger questions quickly once the list phase opens
  useEffect(() => {
    if (phase !== "questions") {
      if (!skipThreshold) setQuestionsVisible(0);
      return;
    }
    if (skipThreshold || reduced) {
      setQuestionsVisible(VOID_QUESTIONS.length);
      return;
    }
    let i = 1;
    setQuestionsVisible(1);
    const id = window.setInterval(() => {
      i += 1;
      setQuestionsVisible(i);
      if (i >= VOID_QUESTIONS.length) window.clearInterval(id);
    }, QUESTION_STAGGER_MS);
    return () => window.clearInterval(id);
  }, [phase, reduced, skipThreshold]);

  useEffect(() => {
    return () => {
      clearHold();
      clearSettle();
      clearLeave();
    };
  }, [clearHold, clearSettle, clearLeave]);

  // M1 — no pre-recognition glow; ambient life is environmental, not light pulsing
  const activation = recognized ? (near ? 1 : 0.72) : 0;
  const fog = recognized ? (near ? 0.35 : 0.5) : 0.85;
  const showInquiry = !isRest && (phase === "inquiry" || phase === "questions");
  const showQuestions = !isRest && phase === "questions";
  const showAttend = interactive;
  const ambient = !reduced && !isRest;
  /** Inquiry/questions: release threshold lock so the list can scroll */
  const languageOpen =
    !isRest && (phase === "inquiry" || phase === "questions" || skipThreshold);
  const locked = !isRest && !languageOpen;

  return (
    <div
      ref={surfaceEl}
      className={cn(
        "the-void",
        isRest && "the-void--rest",
        locked && "the-void--locked",
        languageOpen && "the-void--choosing",
        ambient && "the-void--alive",
      )}
      onPointerMove={interactive ? handlePointer : undefined}
      onPointerDown={interactive ? handlePointer : undefined}
      onPointerUp={interactive ? handlePointerUp : undefined}
      onPointerCancel={interactive ? onNearEnd : undefined}
      onPointerLeave={interactive ? handlePointerLeave : undefined}
      onContextMenu={interactive ? handleContextMenu : undefined}
      role="presentation"
      aria-hidden={isRest || undefined}
    >
      <div className="the-void-climate" aria-hidden>
        <div
          className={cn("the-void-fog", ambient && "the-void-fog--drift")}
          style={{ opacity: fog }}
        />
        <div
          className={cn(
            "the-void-vignette",
            ambient && "the-void-vignette--shift",
          )}
        />
        {ambient && <div className="the-void-dust" />}
        <div
          className={cn("the-void-light", isRest && "the-void-light--rest")}
          style={{
            opacity: isRest ? 0.38 : 0.22 + activation * 0.55,
            transform: `scale(${isRest ? 1 : 0.92 + activation * 0.14})`,
          }}
        />
      </div>

      {showAttend && (
        <button
          type="button"
          className="the-void-attend"
          aria-label="Remain here"
          onFocus={handleAttendFocus}
          onBlur={handleAttendBlur}
          onPointerDown={(e) => {
            e.preventDefault();
            notePointer(e.clientX, e.clientY, e.pointerType);
          }}
        />
      )}

      {!isRest && (
        <div className="the-void-language">
          {showInquiry && (
            <p
              className={cn(
                "the-void-inquiry",
                !reduced && "the-void-inquiry--enter",
              )}
              aria-live="polite"
            >
              What are you trying to understand?
            </p>
          )}

          {showQuestions && (
            <ul className="the-void-questions">
              {VOID_QUESTIONS.map((q, i) => (
                <li
                  key={q.id}
                  className={cn(
                    "the-void-question-row",
                    i < questionsVisible
                      ? "the-void-question-row--in"
                      : "the-void-question-row--out",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onChoose(q.id)}
                    className="the-void-question"
                    tabIndex={i < questionsVisible ? 0 : -1}
                  >
                    {q.text}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {showQuestions && (
            <p className="the-void-charts">
              <Link href="/atlas/charts">Charted maps</Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
