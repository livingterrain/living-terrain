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
import { VOID_QUESTIONS } from "@/lib/atlas-v1/questions";
import { TheVoid, type VoidSurface } from "@/components/void/TheVoid";
import type {
  JourneyState,
  NoticeState,
  JourneyViewMode,
} from "@/components/atlas-v1/AtlasJourneyLayer";

const PRESENCE_MS = 220;
const LINGER_MS = 280;
const NOTICE_MS = 2800;

type View = "void" | JourneyViewMode;

type HistoryPayload = {
  view: View;
  journey: JourneyState | null;
  relationsVisible?: boolean;
};

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

export function AtlasV1() {
  const reduced = usePrefersReducedMotion();
  const [view, setView] = useState<View>("void");
  const [journey, setJourney] = useState<JourneyState | null>(null);
  const [relationsVisible, setRelationsVisible] = useState(false);
  const [bondNoticed, setBondNoticed] = useState(false);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [voidComplete, setVoidComplete] = useState(false);
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
    // Prefetch journey while the threshold is still open
    void import("@/components/atlas-v1/AtlasJourneyLayer");
  }, [replaceHistory]);

  useEffect(() => {
    function onPop(e: PopStateEvent) {
      const state = e.state as HistoryPayload | null;
      clearLinger();
      clearNoticeTimer();
      setNotice(null);
      if (!state) {
        setView("void");
        setJourney(null);
        setRelationsVisible(false);
        setBondNoticed(false);
        return;
      }
      const nextView =
        (state.view as string) === "start" ? "void" : state.view;
      setView(nextView);
      setJourney(state.journey);
      setRelationsVisible(Boolean(state.relationsVisible));
      setBondNoticed(Boolean(state.relationsVisible));
      scrollTop();
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [clearLinger, clearNoticeTimer, scrollTop]);

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
      clearLinger();
      clearNoticeTimer();
      setNotice(null);
      setVoidComplete(true);
      const q = VOID_QUESTIONS.find((item) => item.id === questionId);
      if (!q) return;
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
      const held: NoticeState = { why, to, from };
      const base = journey;
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

  const openEvidence = useCallback(async () => {
    if (!journey) return;
    const { getQuestion, getConcept } = await import("@/lib/atlas-v1/content");
    const question = getQuestion(journey.questionId);
    const current = getConcept(journey.currentConceptId);
    const essayId =
      question.evidence[journey.currentConceptId] ?? current.essayId;
    if (!essayId) return;
    clearLinger();
    const next: JourneyState = {
      ...journey,
      activeEssayId: essayId,
      essaysOpened: journey.essaysOpened.includes(essayId)
        ? journey.essaysOpened
        : [...journey.essaysOpened, essayId],
    };
    setJourney(next);
    setView("evidence");
    pushHistory("evidence", next, false);
    scrollTop();
  }, [journey, clearLinger, pushHistory, scrollTop]);

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

  const voidSurface: VoidSurface =
    view === "void"
      ? voidComplete
        ? "questions"
        : "threshold"
      : "rest";

  return (
    <div
      ref={shellRef}
      className="atlas-v1-realm min-h-[100dvh] bg-[#06080c] text-ivory"
      style={{ backgroundColor: "#06080c", color: "#ebe6dc", minHeight: "100dvh" }}
    >
      <div
        className="atlas-v1-wash pointer-events-none fixed inset-0"
        aria-hidden
      />

      {/* Climate + language live in TheVoid; not trapped in a fixed shell */}
      <div aria-hidden={view !== "void" ? true : undefined}>
        <TheVoid onChoose={startQuestion} surface={voidSurface} />
      </div>

      {view !== "void" && journey && (
        <AtlasJourneyLayer
          view={view}
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
        />
      )}
    </div>
  );
}
