"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  AtlasV1ConceptId,
  AtlasV1QuestionId,
} from "@/lib/atlas-v1/content";
import {
  getConcept,
  getEssay,
  getQuestion,
  resolveEvidenceEssayId,
  resolveUnfinishedEdge,
} from "@/lib/atlas-v1/content";
import { VOID_QUESTIONS } from "@/lib/atlas-v1/questions";
import { isJourneyOpen } from "@/lib/atlas/architecture";
import { ATLAS_QUESTIONS_EVENT } from "@/lib/world/pathways";
import { TheVoid, type VoidSurface } from "@/components/void/TheVoid";
import type {
  JourneyState,
  NoticeState,
  JourneyViewMode,
} from "@/components/atlas-v1/AtlasJourneyLayer";
import type { AtlasCanonicalView } from "@/lib/canonical/atlas-view";
import { getQuestionPlacement } from "@/lib/atlas/architecture";
import { appendThreadPoint } from "@/lib/atlas-v1/living-thread";
import { LivingThread } from "@/components/atlas-v1/LivingThread";
import type { AtlasBranchOffer } from "@/lib/atlas/branches";

const PRESENCE_MS = 220;
const LINGER_MS = 280;
const NOTICE_MS = 2800;

type View = "void" | JourneyViewMode;

type HistoryPayload = {
  view: View;
  journey: JourneyState | null;
  relationsVisible?: boolean;
};

function isUsableJourney(journey: JourneyState | null): journey is JourneyState {
  if (!journey) return false;
  try {
    getQuestion(journey.questionId);
    return Boolean(getConcept(journey.currentConceptId));
  } catch {
    return false;
  }
}

function sanitizeHistory(
  state: HistoryPayload | null,
): { view: View; journey: JourneyState | null; relationsVisible: boolean; voidComplete: boolean } {
  if (!state) {
    return {
      view: "void",
      journey: null,
      relationsVisible: false,
      voidComplete: true,
    };
  }

  const nextView =
    (state.view as string) === "start" ? "void" : state.view;
  const journey = isUsableJourney(state.journey) ? state.journey : null;

  // Non-void views require a usable journey — otherwise Void rests at height 0
  // and nothing renders (blank Atlas).
  if (nextView !== "void" && !journey) {
    return {
      view: "void",
      journey: null,
      relationsVisible: false,
      voidComplete: true,
    };
  }

  if (nextView === "pause" && journey) {
    try {
      const unfinished = resolveUnfinishedEdge(
        getQuestion(journey.questionId),
        journey.trail,
      );
      if (!unfinished) {
        return {
          view: "journey",
          journey,
          relationsVisible: Boolean(state.relationsVisible),
          voidComplete: true,
        };
      }
    } catch {
      return {
        view: "void",
        journey: null,
        relationsVisible: false,
        voidComplete: true,
      };
    }
  }

  // Evidence requires an active essay — otherwise the layer paints nothing.
  if (nextView === "evidence" && journey && !journey.activeEssayId) {
    return {
      view: "journey",
      journey,
      relationsVisible: Boolean(state.relationsVisible),
      voidComplete: true,
    };
  }

  return {
    view: nextView,
    journey,
    relationsVisible: Boolean(state.relationsVisible),
    voidComplete: true,
  };
}

const AtlasJourneyLayer = dynamic(
  () =>
    import("@/components/atlas-v1/AtlasJourneyLayer").then((m) => ({
      default: m.AtlasJourneyLayer,
    })),
  { ssr: false },
);

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

export function AtlasV1({ canonical }: { canonical: AtlasCanonicalView }) {
  const reduced = usePrefersReducedMotion();
  const [view, setView] = useState<View>("void");
  const [journey, setJourney] = useState<JourneyState | null>(null);
  const [relationsVisible, setRelationsVisible] = useState(false);
  const [bondNoticed, setBondNoticed] = useState(false);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [voidComplete, setVoidComplete] = useState(true);
  const lingerTimer = useRef<number | null>(null);
  const noticeTimer = useRef<number | null>(null);
  const bootstrapped = useRef(false);
  const shellRef = useRef<HTMLDivElement>(null);

  const clearLinger = useCallback(() => {
    if (lingerTimer.current) {
      window.clearTimeout(lingerTimer.current);
      lingerTimer.current = null;
    }
  }, []);

  const clearNoticeTimer = useCallback(() => {
    if (noticeTimer.current) {
      window.clearTimeout(noticeTimer.current);
      noticeTimer.current = null;
    }
  }, []);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    shellRef.current?.scrollTo?.(0, 0);
  }, [reduced]);

  const pushHistory = useCallback(
    (
      nextView: View,
      nextJourney: JourneyState | null,
      nextRelations = false,
    ) => {
      window.history.pushState(
        {
          view: nextView === "notice" ? "journey" : nextView,
          journey: nextJourney,
          relationsVisible: nextRelations,
        } satisfies HistoryPayload,
        "",
        "/atlas",
      );
    },
    [],
  );

  const replaceHistory = useCallback(
    (nextView: View, nextJourney: JourneyState | null) => {
      window.history.replaceState(
        {
          view: nextView,
          journey: nextJourney,
          relationsVisible: false,
        } satisfies HistoryPayload,
        "",
        "/atlas",
      );
    },
    [],
  );

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    replaceHistory("void", null);
    setVoidComplete(true);
    // Prefetch journey layer while questions are already available
    void import("@/components/atlas-v1/AtlasJourneyLayer");
  }, [replaceHistory]);

  useEffect(() => {
    function onPop(e: PopStateEvent) {
      const restored = sanitizeHistory(e.state as HistoryPayload | null);
      clearLinger();
      clearNoticeTimer();
      setNotice(null);
      setView(restored.view);
      setJourney(restored.journey);
      setRelationsVisible(restored.relationsVisible);
      setBondNoticed(restored.relationsVisible);
      setVoidComplete(restored.voidComplete);
      scrollTop();
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [clearLinger, clearNoticeTimer, scrollTop]);

  // Defensive: never leave the realm on a non-void view without a journey.
  useEffect(() => {
    if (view !== "void" && !journey) {
      setView("void");
      setRelationsVisible(false);
      setBondNoticed(false);
      setNotice(null);
      setVoidComplete(true);
    }
  }, [view, journey]);

  useEffect(
    () => () => {
      clearLinger();
      clearNoticeTimer();
    },
    [clearLinger, clearNoticeTimer],
  );

  useEffect(() => {
    scrollTop();
  }, [view, journey?.currentConceptId, journey?.activeEssayId, notice, scrollTop]);

  useEffect(() => {
    if (view !== "journey" || !journey?.currentConceptId) return;
    setBondNoticed(false);
    setRelationsVisible(false);
    setNotice(null);
    if (reduced) {
      setRelationsVisible(true);
      return;
    }
    const auto = window.setTimeout(() => {
      setRelationsVisible(true);
    }, PRESENCE_MS);
    return () => window.clearTimeout(auto);
  }, [journey?.currentConceptId, view, reduced]);

  const settleInto = useCallback(
    (base: JourneyState, to: AtlasV1ConceptId, why: string) => {
      appendThreadPoint({ kind: "concept", id: to });
      const next: JourneyState = {
        ...base,
        currentConceptId: to,
        trail: base.trail.includes(to) ? base.trail : [...base.trail, to],
        activeEssayId: null,
        noticedWhy: why,
      };
      setNotice(null);
      setJourney(next);
      setRelationsVisible(false);
      setBondNoticed(false);
      setView("journey");
      pushHistory("journey", next, false);
    },
    [pushHistory],
  );

  const startQuestion = useCallback(
    (questionId: AtlasV1QuestionId) => {
      // Architecture guard: forming-no-journey questions stay catalogued, not opened
      if (!isJourneyOpen(questionId)) return;
      clearLinger();
      clearNoticeTimer();
      setNotice(null);
      setVoidComplete(true);
      const q = VOID_QUESTIONS.find((item) => item.id === questionId);
      if (!q) return;
      const placement = getQuestionPlacement(questionId);
      appendThreadPoint({ kind: "territory", id: placement.territoryId });
      appendThreadPoint({ kind: "question", id: questionId });
      appendThreadPoint({ kind: "concept", id: q.startConceptId });
      const next: JourneyState = {
        questionId,
        currentConceptId: q.startConceptId,
        trail: [q.startConceptId],
        essaysOpened: [],
        activeEssayId: null,
        noticedWhy: null,
      };
      setJourney(next);
      setRelationsVisible(false);
      setBondNoticed(false);
      setView("journey");
      pushHistory("journey", next, false);
      scrollTop();
    },
    [clearLinger, clearNoticeTimer, pushHistory, scrollTop],
  );

  const beginLinger = useCallback(() => {
    if (view !== "journey" || relationsVisible || notice) return;
    clearLinger();
    lingerTimer.current = window.setTimeout(() => {
      setRelationsVisible(true);
    }, reduced ? 0 : LINGER_MS);
  }, [view, relationsVisible, notice, clearLinger, reduced]);

  const cancelLinger = useCallback(() => {
    if (relationsVisible) return;
    clearLinger();
  }, [relationsVisible, clearLinger]);

  const followBond = useCallback(
    (to: AtlasV1ConceptId, why: string) => {
      if (!journey || notice) return;
      clearLinger();
      const from = journey.currentConceptId;
      const base = journey;

      const held: NoticeState = { why, to, from };
      setNotice(held);
      setView("notice");
      setRelationsVisible(false);
      scrollTop();

      if (reduced) {
        settleInto(base, to, why);
        return;
      }

      clearNoticeTimer();
      noticeTimer.current = window.setTimeout(() => {
        settleInto(base, to, why);
      }, NOTICE_MS);
    },
    [
      journey,
      notice,
      clearLinger,
      clearNoticeTimer,
      reduced,
      settleInto,
      scrollTop,
    ],
  );

  const completeNoticeNow = useCallback(() => {
    if (!notice || !journey) return;
    clearNoticeTimer();
    settleInto(journey, notice.to, notice.why);
  }, [notice, journey, clearNoticeTimer, settleInto]);

  const openEvidence = useCallback(() => {
    if (!journey) return;
    const question = getQuestion(journey.questionId);
    const current = getConcept(journey.currentConceptId);
    const essayId = resolveEvidenceEssayId(question, journey.currentConceptId);
    if (!essayId) return;
    // Ensure the essay corpus entry exists before entering evidence view.
    getEssay(essayId);
    appendThreadPoint({ kind: "evidence", id: essayId });
    const source = canonical.evidenceSource[essayId];
    if (source) {
      appendThreadPoint({ kind: "source", id: source.id, label: source.title });
    }
    clearLinger();
    const next: JourneyState = {
      ...journey,
      activeEssayId: essayId,
      essaysOpened: journey.essaysOpened.includes(essayId)
        ? journey.essaysOpened
        : [...journey.essaysOpened, essayId],
      noticedWhy: journey.noticedWhy ?? current.fragment,
    };
    setJourney(next);
    setView("evidence");
    pushHistory("evidence", next, false);
    scrollTop();
  }, [journey, canonical.evidenceSource, clearLinger, pushHistory, scrollTop]);

  const returnToJourney = useCallback(() => {
    if (!journey) return;
    const next: JourneyState = { ...journey, activeEssayId: null };
    setJourney(next);
    setView("journey");
    pushHistory("journey", next, relationsVisible);
    scrollTop();
  }, [journey, pushHistory, relationsVisible, scrollTop]);

  const doneForNow = useCallback(() => {
    if (!journey) return;
    try {
      const unfinished = resolveUnfinishedEdge(
        getQuestion(journey.questionId),
        journey.trail,
      );
      if (!unfinished) return;
    } catch {
      return;
    }
    clearLinger();
    setView("pause");
    pushHistory("pause", journey, false);
    scrollTop();
  }, [journey, clearLinger, pushHistory, scrollTop]);

  const backToQuestions = useCallback(() => {
    clearLinger();
    clearNoticeTimer();
    setNotice(null);
    setJourney(null);
    setRelationsVisible(false);
    setBondNoticed(false);
    setVoidComplete(true);
    setView("void");
    pushHistory("void", null, false);
    scrollTop();
  }, [clearLinger, clearNoticeTimer, pushHistory, scrollTop]);

  useEffect(() => {
    function onReturnToQuestions() {
      backToQuestions();
    }
    window.addEventListener(ATLAS_QUESTIONS_EVENT, onReturnToQuestions);
    return () =>
      window.removeEventListener(ATLAS_QUESTIONS_EVENT, onReturnToQuestions);
  }, [backToQuestions]);

  // Render-time guard mirrors the effect — avoids one blank paint if state is invalid.
  const showJourney = view !== "void" && isUsableJourney(journey);
  // Questions are always available on the void surface; rest is climate under journey.
  const showVoidSurface: VoidSurface = showJourney ? "rest" : "questions";
  const voidHidden = showJourney;

  const followBranch = useCallback(
    (branch: AtlasBranchOffer) => {
      clearLinger();
      clearNoticeTimer();
      setNotice(null);
      setVoidComplete(true);

      const placement = getQuestionPlacement(branch.entryQuestionId);
      appendThreadPoint({ kind: "territory", id: placement.territoryId });
      appendThreadPoint({ kind: "question", id: branch.entryQuestionId });
      for (const conceptId of branch.trail) {
        appendThreadPoint({ kind: "concept", id: conceptId });
      }

      const next: JourneyState = {
        questionId: branch.entryQuestionId,
        currentConceptId: branch.toConceptId,
        trail: [...branch.trail],
        essaysOpened: [],
        activeEssayId: null,
        noticedWhy: null,
      };
      setJourney(next);
      setRelationsVisible(false);
      setBondNoticed(false);
      setView("journey");
      pushHistory("journey", next, false);
      scrollTop();
    },
    [clearLinger, clearNoticeTimer, pushHistory, scrollTop],
  );

  return (
    <div
      ref={shellRef}
      className="atlas-v1-realm min-h-[100dvh] bg-[#030405] text-ivory"
      style={{ backgroundColor: "#030405", color: "#ebe6dc", minHeight: "100dvh" }}
    >
      <div
        className="atlas-v1-wash pointer-events-none fixed inset-0"
        aria-hidden
      />

      {/* Climate + language live in TheVoid; not trapped in a fixed shell */}
      <div aria-hidden={voidHidden ? true : undefined}>
        <TheVoid onChoose={startQuestion} surface={showVoidSurface} />
      </div>

      <LivingThread canonical={canonical} />

      {showJourney && (
        <AtlasJourneyLayer
          canonical={canonical}
          view={view as JourneyViewMode}
          journey={journey}
          notice={notice}
          relationsVisible={relationsVisible}
          bondNoticed={bondNoticed}
          onCompleteNotice={completeNoticeNow}
          onAttendStart={beginLinger}
          onAttendCancel={cancelLinger}
          onRevealNow={() => setRelationsVisible(true)}
          onBondComplete={() => setBondNoticed(true)}
          onFollow={followBond}
          onRead={openEvidence}
          onDone={doneForNow}
          onBeginAgain={backToQuestions}
          onReturn={returnToJourney}
          onBack={backToQuestions}
          onFollowBranch={followBranch}
        />
      )}
    </div>
  );
}
