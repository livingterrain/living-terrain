/**
 * Atlas journey-return snapshot (v1).
 *
 * Short-lived sessionStorage only — separate from Trail (`lt-atlas-living-thread`).
 * Saved when a visitor activates a Thread whisper; restored only via `/atlas?resume=journey`.
 * Does not invent bonds or rewrite authored journeys.
 *
 * Intentional limits:
 * - Browser Back without `?resume=journey` boots Void; the snapshot is preserved for the
 *   explicit Thread return link (Back-to-Void).
 * - Resume handshake uses `setTimeout(0)` so React Strict Mode remounts (dev) that occur
 *   synchronously after query strip can re-apply; a remount after that tick would miss
 *   handshake and Void on bare `/atlas` (development-only timing edge).
 */

import {
  getConcept,
  getEssay,
  getQuestion,
  type AtlasV1ConceptId,
  type AtlasV1EssayId,
  type AtlasV1QuestionId,
} from "@/lib/atlas-v1/content";
import { isJourneyOpen } from "@/lib/atlas/architecture";
import { isThreadId } from "@/lib/threads/vocabulary";
import type { JourneyState } from "@/components/atlas-v1/AtlasJourneyLayer";

export const JOURNEY_RETURN_KEY = "lt-atlas-journey-return-v1";
export const JOURNEY_RETURN_RESUME_PARAM = "resume";
export const JOURNEY_RETURN_RESUME_VALUE = "journey";
export const JOURNEY_RETURN_HREF = `/atlas?${JOURNEY_RETURN_RESUME_PARAM}=${JOURNEY_RETURN_RESUME_VALUE}`;

/** Schema version — bump when JourneyState shape changes. */
export const JOURNEY_RETURN_VERSION = 1 as const;

/** Same browser session; discard after this age. */
export const JOURNEY_RETURN_TTL_MS = 2 * 60 * 60 * 1000;

export type AtlasJourneyReturnSnapshot = {
  v: typeof JOURNEY_RETURN_VERSION;
  savedAt: number;
  /** Thread whisper destination — provenance only. */
  threadId: string;
  journey: JourneyState;
  /** Always true when saved from a whisper (post-reveal). */
  relationsVisible: true;
};

/** Module handshake — survives React Strict Mode remount after query strip. */
let resumeHandshake: {
  journey: JourneyState;
  relationsVisible: true;
  savedAt: number;
} | null = null;

let resumeHandshakeClearTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleHandshakeClear(): void {
  if (resumeHandshakeClearTimer) {
    clearTimeout(resumeHandshakeClearTimer);
  }
  // Strict Mode remounts synchronously before this fires.
  resumeHandshakeClearTimer = setTimeout(() => {
    resumeHandshake = null;
    resumeHandshakeClearTimer = null;
  }, 0);
}

function empty(): null {
  return null;
}

function isConceptId(value: unknown): value is AtlasV1ConceptId {
  if (typeof value !== "string") return false;
  try {
    getConcept(value as AtlasV1ConceptId);
    return true;
  } catch {
    return false;
  }
}

function isQuestionId(value: unknown): value is AtlasV1QuestionId {
  if (typeof value !== "string") return false;
  try {
    getQuestion(value as AtlasV1QuestionId);
    return true;
  } catch {
    return false;
  }
}

function isEssayId(value: unknown): value is AtlasV1EssayId {
  if (typeof value !== "string") return false;
  try {
    getEssay(value as AtlasV1EssayId);
    return true;
  } catch {
    return false;
  }
}

/**
 * Keep known corpus essays; drop stale/unknown IDs without rejecting the journey.
 * Always returns a new array (order preserved, duplicates kept as saved).
 */
export function sanitizeEssaysOpened(raw: unknown): AtlasV1EssayId[] | null {
  if (!Array.isArray(raw)) return null;
  if (!raw.every((id) => typeof id === "string")) return null;
  return raw.filter((id): id is AtlasV1EssayId => isEssayId(id));
}

/**
 * Trail must be the authored walk for this question:
 * trail[0] === startConceptId; each step follows a local relation edge.
 */
export function isAuthoredJourneyTrail(
  questionId: AtlasV1QuestionId,
  trail: readonly AtlasV1ConceptId[],
  currentConceptId: AtlasV1ConceptId,
): boolean {
  if (trail.length === 0) return false;
  let question;
  try {
    question = getQuestion(questionId);
  } catch {
    return false;
  }
  if (trail[0] !== question.startConceptId) return false;
  if (trail[trail.length - 1] !== currentConceptId) return false;
  if (!trail.includes(currentConceptId)) return false;

  for (let i = 0; i < trail.length - 1; i++) {
    const from = trail[i];
    const to = trail[i + 1];
    const edges = question.relations[from] ?? [];
    if (!edges.some((edge) => edge.to === to)) return false;
  }
  return true;
}

export function sanitizeJourneyState(raw: unknown): JourneyState | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  if (!isQuestionId(data.questionId)) return null;
  if (!isJourneyOpen(data.questionId)) return null;
  if (!isConceptId(data.currentConceptId)) return null;
  if (!Array.isArray(data.trail) || data.trail.length === 0) return null;
  if (!data.trail.every(isConceptId)) return null;
  // activeEssayId may be present in older snapshots; restore always clears it.
  if (
    data.activeEssayId !== null &&
    data.activeEssayId !== undefined &&
    typeof data.activeEssayId !== "string"
  ) {
    return null;
  }
  const essaysOpened = sanitizeEssaysOpened(data.essaysOpened);
  if (!essaysOpened) return null;
  if (
    data.noticedWhy !== null &&
    typeof data.noticedWhy !== "string"
  ) {
    return null;
  }

  const trail = data.trail as AtlasV1ConceptId[];
  const currentConceptId = data.currentConceptId;
  if (!isAuthoredJourneyTrail(data.questionId, trail, currentConceptId)) {
    return null;
  }

  return {
    questionId: data.questionId,
    currentConceptId,
    trail: [...trail],
    essaysOpened,
    activeEssayId: null,
    noticedWhy:
      typeof data.noticedWhy === "string" ? data.noticedWhy : null,
  };
}

export function validateJourneyReturnSnapshot(
  raw: unknown,
  now = Date.now(),
): AtlasJourneyReturnSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  if (data.v !== JOURNEY_RETURN_VERSION) return null;
  if (typeof data.savedAt !== "number" || !Number.isFinite(data.savedAt)) {
    return null;
  }
  if (now - data.savedAt > JOURNEY_RETURN_TTL_MS || data.savedAt > now + 60_000) {
    return null;
  }
  if (typeof data.threadId !== "string" || !isThreadId(data.threadId)) {
    return null;
  }
  if (data.relationsVisible !== true) return null;
  const journey = sanitizeJourneyState(data.journey);
  if (!journey) return null;

  return {
    v: JOURNEY_RETURN_VERSION,
    savedAt: data.savedAt,
    threadId: data.threadId,
    journey,
    relationsVisible: true,
  };
}

export function loadJourneyReturnSnapshot(
  now = Date.now(),
): AtlasJourneyReturnSnapshot | null {
  if (typeof window === "undefined") return empty();
  try {
    const raw = sessionStorage.getItem(JOURNEY_RETURN_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as unknown;
    const valid = validateJourneyReturnSnapshot(parsed, now);
    if (!valid) {
      clearJourneyReturnSnapshot();
      return empty();
    }
    return valid;
  } catch {
    clearJourneyReturnSnapshot();
    return empty();
  }
}

export function clearJourneyReturnSnapshot(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(JOURNEY_RETURN_KEY);
  } catch {
    /* storage unavailable */
  }
}

/**
 * Save only on Thread whisper activation. Overwrites any prior snapshot.
 */
export function saveJourneyReturnSnapshot(input: {
  journey: JourneyState;
  threadId: string;
  savedAt?: number;
}): boolean {
  if (typeof window === "undefined") return false;
  if (!isThreadId(input.threadId)) return false;
  const journey = sanitizeJourneyState({
    ...input.journey,
    activeEssayId: null,
  });
  if (!journey) return false;

  const snapshot: AtlasJourneyReturnSnapshot = {
    v: JOURNEY_RETURN_VERSION,
    savedAt: input.savedAt ?? Date.now(),
    threadId: input.threadId,
    journey,
    relationsVisible: true,
  };

  try {
    sessionStorage.setItem(JOURNEY_RETURN_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}

/** Thread page: peek without consuming. */
export function peekAtlasJourneyReturn(): {
  href: string;
  label: string;
} | null {
  const snap = loadJourneyReturnSnapshot();
  if (!snap) return null;
  return {
    href: JOURNEY_RETURN_HREF,
    label: "Return to the Atlas",
  };
}

export function setResumeHandshake(snapshot: AtlasJourneyReturnSnapshot): void {
  resumeHandshake = {
    journey: snapshot.journey,
    relationsVisible: true,
    savedAt: snapshot.savedAt,
  };
  scheduleHandshakeClear();
}

export function peekResumeHandshake(): {
  journey: JourneyState;
  relationsVisible: true;
  savedAt: number;
} | null {
  if (!resumeHandshake) return null;
  return {
    journey: resumeHandshake.journey,
    relationsVisible: true,
    savedAt: resumeHandshake.savedAt,
  };
}

export function clearResumeHandshake(): void {
  if (resumeHandshakeClearTimer) {
    clearTimeout(resumeHandshakeClearTimer);
    resumeHandshakeClearTimer = null;
  }
  resumeHandshake = null;
}

/**
 * Resolve resume payload for Atlas boot.
 * Prefer session snapshot when `?resume=journey`; handshake covers Strict Mode remount.
 * Bare `/atlas` without handshake → null (Void). Snapshot is preserved unless consumed via resume query.
 */
export function resolveJourneyResume(search: string): {
  journey: JourneyState;
  relationsVisible: true;
  fromQuery: boolean;
} | null {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const wantsResume =
    params.get(JOURNEY_RETURN_RESUME_PARAM) === JOURNEY_RETURN_RESUME_VALUE;

  if (wantsResume) {
    const snap = loadJourneyReturnSnapshot();
    if (snap) {
      setResumeHandshake(snap);
      clearJourneyReturnSnapshot();
      return {
        journey: snap.journey,
        relationsVisible: true,
        fromQuery: true,
      };
    }
    const hand = peekResumeHandshake();
    if (hand) {
      scheduleHandshakeClear();
      return {
        journey: hand.journey,
        relationsVisible: true,
        fromQuery: true,
      };
    }
    return null;
  }

  // Clean URL: only re-apply from handshake (Strict Mode after query strip).
  const hand = peekResumeHandshake();
  if (hand) {
    scheduleHandshakeClear();
    return {
      journey: hand.journey,
      relationsVisible: true,
      fromQuery: false,
    };
  }
  return null;
}

export function atlasResumeSearchActive(search: string): boolean {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  return (
    params.get(JOURNEY_RETURN_RESUME_PARAM) === JOURNEY_RETURN_RESUME_VALUE
  );
}
