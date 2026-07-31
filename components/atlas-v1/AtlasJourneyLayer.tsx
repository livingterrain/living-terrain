"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  getConcept,
  getEssay,
  getQuestion,
  relationsFor,
  resolveUnfinishedEdge,
  type AtlasV1ConceptId,
  type AtlasV1EssayId,
  type AtlasV1QuestionId,
  type AtlasV1Relation,
} from "@/lib/atlas-v1/content";
import { cn } from "@/lib/utils";
import Link from "next/link";

const LINGER_MS = 400;
const NOTICE_MS = 2800;
const EASE = [0.38, 0.02, 0.42, 1] as const;
const CROSSFADE = { duration: 0.22, ease: EASE };
const BOND_WHY_DELAY_MS = 1600;
const BOND_READY_MS = 2800;
const BOND_EVIDENCE_MS = 3200;

export type JourneyViewMode = "journey" | "evidence" | "pause" | "notice";

export type JourneyState = {
  questionId: AtlasV1QuestionId;
  currentConceptId: AtlasV1ConceptId;
  trail: AtlasV1ConceptId[];
  essaysOpened: AtlasV1EssayId[];
  activeEssayId: AtlasV1EssayId | null;
  noticedWhy: string | null;
};

export type NoticeState = {
  why: string;
  to: AtlasV1ConceptId;
  from: AtlasV1ConceptId;
};

type Props = {
  view: JourneyViewMode;
  journey: JourneyState;
  notice: NoticeState | null;
  relationsVisible: boolean;
  bondNoticed: boolean;
  onCompleteNotice: () => void;
  onAttendStart: () => void;
  onAttendCancel: () => void;
  onRevealNow: () => void;
  onBondComplete: () => void;
  onFollow: (to: AtlasV1ConceptId, why: string) => void;
  onRead: () => void;
  onDone: () => void;
  onBeginAgain: () => void;
  onReturn: () => void;
  onBack: () => void;
};

export function AtlasJourneyLayer({
  view,
  journey,
  notice,
  relationsVisible,
  bondNoticed,
  onCompleteNotice,
  onAttendStart,
  onAttendCancel,
  onRevealNow,
  onBondComplete,
  onFollow,
  onRead,
  onDone,
  onBeginAgain,
  onReturn,
  onBack,
}: Props) {
  const reduced = useReducedMotion() ?? false;
  const crossfade = reduced ? { duration: 0.01 } : CROSSFADE;
  const question = getQuestion(journey.questionId);
  const current = getConcept(journey.currentConceptId);
  const essay = journey.activeEssayId
    ? getEssay(journey.activeEssayId)
    : null;
  const nextRelations = relationsFor(question, journey.currentConceptId);
  const unfinished = question
    ? resolveUnfinishedEdge(question, journey.trail)
    : null;

  // History can restore pause after the unfinished edge is already known —
  // never leave the visitor on an empty pause surface.
  useEffect(() => {
    if (view === "pause" && !unfinished) {
      onBack();
    }
  }, [view, unfinished, onBack]);

  return (
    <div
      className={cn(
        "relative z-10 mx-auto flex min-h-[100dvh] w-full flex-col",
        view === "evidence"
          ? "max-w-[32rem] sm:max-w-[34rem]"
          : "max-w-[30rem] sm:max-w-[32rem]",
        "px-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(2.75rem,env(safe-area-inset-top))] sm:px-12 sm:pb-20 sm:pt-24",
      )}
    >
      <AnimatePresence mode="sync">
        {view === "notice" && notice && (
          <motion.div
            key={`notice-${notice.from}-${notice.to}`}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={crossfade}
            className="flex flex-1 flex-col justify-center"
          >
            <button
              type="button"
              onClick={onCompleteNotice}
              className="w-full max-w-[26rem] cursor-default text-left outline-none focus-visible:ring-1 focus-visible:ring-gold/30 focus-visible:ring-offset-8 focus-visible:ring-offset-[#06080c]"
              aria-label="Continue"
            >
              <p className="font-heading text-[1.5rem] italic leading-[1.45] text-[#c9d0da] sm:text-[1.75rem] sm:leading-[1.4]">
                {notice.why}
              </p>
            </button>
          </motion.div>
        )}

        {view === "journey" && question && current && (
          <motion.div
            key={`journey-${journey.currentConceptId}`}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={crossfade}
            className="flex flex-1 flex-col"
          >
            <JourneyView
              questionText={question.text}
              closingQuestion={question.closingQuestion}
              conceptName={current.name}
              fragment={current.fragment}
              hasEvidence={Boolean(
                question.evidence[journey.currentConceptId] ??
                  current.essayId,
              )}
              bondNoticed={bondNoticed}
              trail={journey.trail}
              relation={nextRelations[0] ?? null}
              relationsVisible={relationsVisible}
              reduced={reduced}
              onAttendStart={onAttendStart}
              onAttendCancel={onAttendCancel}
              onRevealNow={onRevealNow}
              onBondComplete={onBondComplete}
              onFollow={onFollow}
              onRead={onRead}
              onDone={onDone}
              onBeginAgain={onBeginAgain}
              canRest={Boolean(unfinished)}
            />
          </motion.div>
        )}

        {view === "evidence" && question && essay && current && (
          <motion.div
            key={`evidence-${essay.id}`}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={crossfade}
            className="flex flex-1 flex-col"
          >
            <EvidenceView
              questionText={question.text}
              conceptName={current.name}
              fragment={current.fragment}
              noticedWhy={journey.noticedWhy}
              essay={essay}
              onReturn={onReturn}
            />
          </motion.div>
        )}

        {view === "pause" && question && unfinished && (
          <motion.div
            key="pause"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={crossfade}
            className="flex flex-1 flex-col justify-center"
          >
            <PauseView
              questionText={question.text}
              trail={journey.trail}
              essaysOpened={journey.essaysOpened}
              unfinished={unfinished}
              onBack={onBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LivingBond({
  relation,
  reduced,
  onComplete,
  onFollow,
}: {
  relation: AtlasV1Relation;
  reduced: boolean;
  onComplete: () => void;
  onFollow: (id: AtlasV1ConceptId, why: string) => void;
}) {
  const [growing, setGrowing] = useState(reduced);
  const [whyVisible, setWhyVisible] = useState(reduced);
  const [ready, setReady] = useState(reduced);
  const [evidenceReady, setEvidenceReady] = useState(reduced);
  const completed = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const to = getConcept(relation.to);

  useEffect(() => {
    if (reduced) {
      if (!completed.current) {
        completed.current = true;
        onCompleteRef.current();
      }
      return;
    }

    const grow = window.setTimeout(() => setGrowing(true), 120);
    const why = window.setTimeout(() => setWhyVisible(true), BOND_WHY_DELAY_MS);
    const readyT = window.setTimeout(() => {
      setReady(true);
    }, BOND_READY_MS);
    const evidence = window.setTimeout(() => {
      setEvidenceReady(true);
      if (!completed.current) {
        completed.current = true;
        onCompleteRef.current();
      }
    }, BOND_EVIDENCE_MS);

    return () => {
      window.clearTimeout(grow);
      window.clearTimeout(why);
      window.clearTimeout(readyT);
      window.clearTimeout(evidence);
    };
  }, [reduced]);

  return (
    <div className="atlas-bond">
      <div className="atlas-bond-rail" aria-hidden>
        <svg
          className="atlas-bond-svg"
          viewBox="0 0 24 160"
          preserveAspectRatio="none"
        >
          <path
            className={cn(
              "atlas-bond-stroke",
              growing && "atlas-bond-stroke--grown",
            )}
            d="M12 0 C 12 28, 6 42, 10 64 C 14 86, 18 100, 12 124 C 8 140, 12 148, 12 160"
          />
        </svg>
      </div>

      <div className="atlas-bond-body">
        <AnimatePresence>
          {whyVisible && (
            <motion.p
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0.01 : 1.4, ease: EASE }}
              className="atlas-bond-why"
            >
              {relation.why}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="button"
          disabled={!ready}
          onClick={() => onFollow(relation.to, relation.why)}
          className={cn(
            "atlas-bond-dest mt-7 text-left transition-opacity duration-[1400ms]",
            ready ? "opacity-100" : "opacity-0",
          )}
          aria-label={
            ready
              ? `Continue through this relationship toward ${to.name}`
              : `Relationship still forming`
          }
        >
          <span className="font-heading text-[1.25rem] tracking-[-0.01em] text-ivory/90 transition-colors duration-[1100ms] hover:text-[#d4c4a0] sm:text-[1.375rem]">
            {to.name}
          </span>
        </button>

        {/* evidenceReady reserved for parent via onComplete timing */}
        <span className="sr-only" aria-hidden>
          {evidenceReady ? "ready" : ""}
        </span>
      </div>
    </div>
  );
}

function JourneyView({
  questionText,
  closingQuestion,
  conceptName,
  fragment,
  hasEvidence,
  bondNoticed,
  trail,
  relation,
  relationsVisible,
  reduced,
  onAttendStart,
  onAttendCancel,
  onRevealNow,
  onBondComplete,
  onFollow,
  onRead,
  onDone,
  onBeginAgain,
  canRest,
}: {
  questionText: string;
  closingQuestion: string;
  conceptName: string;
  fragment: string;
  hasEvidence: boolean;
  bondNoticed: boolean;
  trail: AtlasV1ConceptId[];
  relation: AtlasV1Relation | null;
  relationsVisible: boolean;
  reduced: boolean;
  onAttendStart: () => void;
  onAttendCancel: () => void;
  onRevealNow: () => void;
  onBondComplete: () => void;
  onFollow: (id: AtlasV1ConceptId, why: string) => void;
  onRead: () => void;
  onDone: () => void;
  onBeginAgain: () => void;
  canRest: boolean;
}) {
  const onConceptKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRevealNow();
    }
  };

  const prior = trail.slice(0, -1);
  const threadComplete = relationsVisible && !relation;

  return (
    <>
      <p className="atlas-v1-held max-w-[26rem] font-heading text-[0.875rem] italic leading-[1.45] text-[#7d8899] sm:text-[0.9375rem]">
        {questionText}
      </p>

      <div className="mt-16 flex flex-1 flex-col sm:mt-24">
        <div
          role="button"
          tabIndex={0}
          aria-label={`${conceptName}. Stay with this idea, or tap it.`}
          className="atlas-v1-concept max-w-lg cursor-default text-left outline-none focus-visible:ring-1 focus-visible:ring-gold/30 focus-visible:ring-offset-8 focus-visible:ring-offset-[#06080c]"
          onMouseEnter={onAttendStart}
          onMouseLeave={onAttendCancel}
          onFocus={onAttendStart}
          onBlur={onAttendCancel}
          onClick={() => {
            if (!relationsVisible) onRevealNow();
          }}
          onKeyDown={onConceptKeyDown}
        >
          <h2 className="font-heading text-[2.25rem] leading-[1.08] tracking-[-0.025em] text-ivory sm:text-[2.75rem] sm:leading-[1.06]">
            {conceptName}
          </h2>
          <p className="mt-6 max-w-[26rem] font-heading text-[1.125rem] italic leading-[1.55] text-[#b4bdc9] sm:mt-7 sm:text-[1.1875rem] sm:leading-[1.58]">
            {fragment}
          </p>
        </div>

        {relationsVisible && relation && (
          <div className="atlas-bond-origin mt-12" aria-hidden>
            <span className="atlas-bond-node" />
          </div>
        )}

        <AnimatePresence mode="wait">
          {!relationsVisible ? (
            <motion.p
              key="cue"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.01 : 1.2, ease: EASE }}
              className="mt-14 font-body text-[0.6875rem] tracking-[0.04em] text-ivory/28 sm:mt-16"
            >
              Stay with this — or tap it
            </motion.p>
          ) : relation ? (
            <motion.div
              key="bond"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.01 : 1.0, ease: EASE }}
            >
              <LivingBond
                relation={relation}
                reduced={reduced}
                onComplete={onBondComplete}
                onFollow={onFollow}
              />

              {hasEvidence && (
                <motion.div
                  initial={false}
                  animate={{
                    opacity: bondNoticed ? 1 : 0,
                    y: bondNoticed ? 0 : 4,
                  }}
                  transition={{
                    duration: reduced ? 0.01 : 1.4,
                    ease: EASE,
                  }}
                  className="mt-16 sm:mt-20"
                  aria-hidden={!bondNoticed}
                >
                  {bondNoticed && (
                    <button
                      type="button"
                      onClick={onRead}
                      className="font-heading text-[1.0625rem] italic text-[#c9b48a]/85 transition-colors duration-[1100ms] hover:text-[#dcc9a0]"
                    >
                      This lives in the writing
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>
          ) : threadComplete ? (
            <motion.div
              key="complete"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.01 : 1.2, ease: EASE }}
              className="mt-14 sm:mt-16"
            >
              <p className="font-heading text-[1.125rem] italic leading-[1.55] text-[#a8b2c2] sm:text-[1.1875rem]">
                This thread rests here.
              </p>
              <p className="mt-5 max-w-[24rem] font-heading text-[1.0625rem] italic leading-[1.55] text-[#7d8899]">
                {closingQuestion}
              </p>
              {hasEvidence && (
                <button
                  type="button"
                  onClick={onRead}
                  className="mt-10 block font-heading text-[1.0625rem] italic text-[#c9b48a]/85 transition-colors duration-[1100ms] hover:text-[#dcc9a0]"
                >
                  This lives in the writing
                </button>
              )}
              <button
                type="button"
                onClick={onBeginAgain}
                className="mt-10 block font-heading text-[1.125rem] text-[#c9b48a]/90 transition-colors duration-[1100ms] hover:text-[#dcc9a0]"
              >
                Begin another question
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <footer className="mt-auto pt-20 sm:pt-24">
        <div className="border-t border-white/[0.05] pt-8">
          <p className="font-body text-[0.75rem] leading-relaxed tracking-wide text-ivory/28">
            {prior.length > 0 ? (
              <>
                {prior.map((id) => getConcept(id).name).join(" · ")}
                <span className="text-ivory/48"> · {conceptName}</span>
              </>
            ) : (
              conceptName
            )}
          </p>
          {!threadComplete && canRest && (
            <button
              type="button"
              onClick={onDone}
              className="mt-6 font-body text-[0.75rem] tracking-wide text-ivory/30 transition-colors duration-[1100ms] hover:text-ivory/55"
            >
              Rest here
            </button>
          )}
        </div>
      </footer>
    </>
  );
}

function EvidenceView({
  questionText,
  conceptName,
  fragment,
  noticedWhy,
  essay,
  onReturn,
}: {
  questionText: string;
  conceptName: string;
  fragment: string;
  noticedWhy: string | null;
  essay: ReturnType<typeof getEssay>;
  onReturn: () => void;
}) {
  const noticed = noticedWhy ?? fragment;

  return (
    <>
      <header>
        <p className="font-heading text-[0.8125rem] italic leading-[1.45] text-[#6f7a8c]">
          {questionText}
        </p>
      </header>

      <p className="mt-12 max-w-[28rem] font-heading text-[1.125rem] italic leading-[1.55] text-[#a8b2c2] sm:mt-14 sm:text-[1.1875rem]">
        {noticed}
      </p>

      <article className="atlas-v1-prose mt-12 flex-1 sm:mt-14">
        <p className="font-body text-[0.6875rem] tracking-[0.06em] text-ivory/28">
          {conceptName}
        </p>
        <h2 className="mt-5 font-heading text-[1.75rem] leading-[1.18] tracking-[-0.02em] text-ivory sm:text-[2rem] sm:leading-[1.16]">
          {essay.title}
        </h2>
        {essay.subtitle && (
          <p className="mt-5 font-heading text-[1.0625rem] italic leading-[1.55] text-[#a8b2c0]">
            {essay.subtitle}
          </p>
        )}
        <div className="mt-12 space-y-8 sm:mt-14 sm:space-y-9">
          {essay.body.map((p) => (
            <p
              key={p.slice(0, 48)}
              className="font-body text-[1.125rem] leading-[1.92] text-[#d5dae3] sm:text-[1.1875rem] sm:leading-[1.95]"
            >
              {p}
            </p>
          ))}
        </div>
      </article>

      <nav className="mt-16 border-t border-white/[0.06] pt-10 sm:mt-20 sm:pt-12">
        <button
          type="button"
          onClick={onReturn}
          className="font-heading text-[1.0625rem] text-[#c9b48a]/90 transition-colors duration-[1100ms] hover:text-[#dcc9a0]"
        >
          Return to what you noticed
        </button>
      </nav>
    </>
  );
}

function PauseView({
  questionText,
  trail,
  essaysOpened,
  unfinished,
  onBack,
}: {
  questionText: string;
  trail: AtlasV1ConceptId[];
  essaysOpened: AtlasV1EssayId[];
  unfinished: { from: AtlasV1ConceptId; to: AtlasV1ConceptId; why: string };
  onBack: () => void;
}) {
  return (
    <div className="atlas-v1-pause">
      <p className="font-heading text-[0.9375rem] italic leading-[1.45] text-[#7d8899]">
        {questionText}
      </p>

      <p className="mt-12 font-heading text-[1.0625rem] leading-[1.65] text-[#c5ccd6]">
        {trail.map((id) => getConcept(id).name).join(" · ")}
      </p>

      {essaysOpened.length > 0 && (
        <p className="mt-5 font-body text-[0.8125rem] leading-[1.7] text-ivory/30">
          {essaysOpened.map((id) => getEssay(id).title).join(" · ")}
        </p>
      )}

      <div className="mt-16 sm:mt-20">
        <p className="mt-6 max-w-[26rem] font-heading text-[1.25rem] italic leading-[1.5] text-[#a8b2c2] sm:text-[1.375rem]">
          {unfinished.why}
        </p>
        <p className="mt-6 font-heading text-[1.625rem] leading-[1.2] tracking-[-0.015em] text-ivory sm:text-[1.875rem]">
          {getConcept(unfinished.to).name}
        </p>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-16 font-heading text-[1.0625rem] text-[#c9b48a]/90 transition-colors duration-[1100ms] hover:text-[#dcc9a0] sm:mt-20"
      >
        Begin again
      </button>

      <p className="mt-12 font-body text-[0.75rem] leading-[1.7] text-ivory/48">
        <Link
          href="/atlas/charts"
          className="transition-colors duration-[1100ms] hover:text-ivory/45"
        >
          Charted maps
        </Link>
      </p>
    </div>
  );
}
