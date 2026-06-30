"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ThresholdAtmosphere } from "@/components/home/ThresholdAtmosphere";
import { useTerrainSoundOptional } from "@/components/sound";
import { THREAD } from "@/lib/atmosphere/tempo";
import { recordThreadTraced } from "@/lib/observatory";
import { getNode } from "@/lib/relationships/graph";
import { cn } from "@/lib/utils";
import { computeThreadPath } from "@/lib/relationships/thread-path";
import type { ThreadSession } from "./ThreadProvider";
import { ThreadCanvas } from "./ThreadCanvas";

type Phase = "closing" | "void" | "emerge" | "threading" | "explore";

const SEGMENT_MS = THREAD.segmentMs;
const FADE_MS = THREAD.fadeMs;
const VOID_MS = THREAD.voidMs;
const EMERGE_MS = THREAD.emergeMs;

interface ThreadExperienceProps {
  session: ThreadSession;
  onClose: () => void;
}

export function ThreadExperience({ session, onClose }: ThreadExperienceProps) {
  const sound = useTerrainSoundOptional();
  const path = useMemo(
    () => computeThreadPath(session.origin),
    [session.origin],
  );

  const [phase, setPhase] = useState<Phase>("closing");
  const [activeSegment, setActiveSegment] = useState(-1);
  const [segmentProgress, setSegmentProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [exploreMode, setExploreMode] = useState(false);
  const frameRef = useRef<number | null>(null);
  const segmentStartRef = useRef(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    void sound?.activate();
    void sound?.setScene("constellation");
  }, [sound]);

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("void"), FADE_MS);
    const t2 = window.setTimeout(() => setPhase("emerge"), FADE_MS + VOID_MS);
    const t3 = window.setTimeout(() => {
      setPhase("threading");
      setActiveSegment(0);
      segmentStartRef.current = performance.now();
    }, FADE_MS + VOID_MS + EMERGE_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  const advanceSegment = useCallback(() => {
    setActiveSegment((prev) => {
      const next = prev + 1;
      if (next >= path.segments.length) {
        setExploreMode(true);
        setPhase("explore");
        return prev;
      }
      segmentStartRef.current = performance.now();
      setSegmentProgress(0);
      return next;
    });
  }, [path.segments.length]);

  useEffect(() => {
    if (phase !== "threading" || paused || exploreMode) return;

    const tick = (now: number) => {
      const elapsed = now - segmentStartRef.current;
      const progress = Math.min(1, elapsed / SEGMENT_MS);
      setSegmentProgress(progress);

      if (progress >= 1) {
        sound?.playHover(path.segments[activeSegment]?.to.graphId);
        advanceSegment();
      } else {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [phase, paused, exploreMode, activeSegment, advanceSegment, path.segments, sound]);

  useEffect(() => {
    if (!exploreMode) return;
    const origin = getNode(session.origin);
    recordThreadTraced(
      origin?.title ?? "this idea",
      origin?.themes ?? [],
      session.returnHref,
    );
  }, [exploreMode, session.origin, session.returnHref]);

  const visitedCount = Math.min(
    path.steps.length,
    activeSegment + 2 + (segmentProgress > 0.85 ? 1 : 0),
  );

  const handleReturnToReading = () => {
    setPhase("closing");
    window.setTimeout(onClose, 700);
  };

  const handleExplore = () => {
    setPaused(true);
    setExploreMode(true);
    setPhase("explore");
  };

  const handleContinue = () => {
    if (phase === "explore" && activeSegment >= path.segments.length - 1) {
      onClose();
      return;
    }
    setExploreMode(false);
    setPaused(false);
    setPhase("threading");
    if (activeSegment < 0) {
      setActiveSegment(0);
      segmentStartRef.current = performance.now();
    } else if (segmentProgress >= 1) {
      advanceSegment();
    }
  };

  const currentLabel =
    path.steps[
      Math.min(path.steps.length - 1, Math.max(0, activeSegment + 1))
    ]?.node.title ?? path.steps[0]?.node.title;

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#030405]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      role="dialog"
      aria-modal
      aria-label="Following the thread through the Living Terrain"
    >
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase === "closing" ? 1 : 0.55,
        }}
        transition={{ duration: FADE_MS / 1000, ease: [0.45, 0.05, 0.55, 0.95] }}
      />

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase === "void" || phase === "closing" ? 0 : 1,
        }}
        transition={{ duration: 2.2, ease: [0.45, 0.05, 0.55, 0.95] }}
      >
        <ThresholdAtmosphere
          starBrightness={0.62}
          fogDensity={0.7}
          clarity
          revealProgress={phase === "emerge" ? 0.4 : 1}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity:
            phase === "emerge" || phase === "threading" || phase === "explore"
              ? 1
              : 0,
        }}
        transition={{ duration: 2.4, delay: 0.2, ease: [0.45, 0.05, 0.55, 0.95] }}
      >
        <ThreadCanvas
          path={path}
          activeSegment={activeSegment}
          segmentProgress={segmentProgress}
          visitedCount={visitedCount}
          exploreMode={exploreMode}
          originGraphId={path.steps[0]?.graphId}
        />
      </motion.div>

      {/* Vertical thread labels — the thinking unfolds */}
      <AnimatePresence mode="wait">
        {(phase === "threading" || phase === "explore") && currentLabel && (
          <motion.div
            key={currentLabel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 1.65, ease: [0.45, 0.05, 0.55, 0.95] }}
            className="pointer-events-none absolute bottom-28 left-1/2 z-30 max-w-lg -translate-x-1/2 px-6 text-center sm:bottom-32"
          >
            <p className="type-chamber text-[0.5625rem] text-ivory/22">
              The thread unfolds
            </p>
            <p className="mt-3 font-heading text-lg text-ivory/75 sm:text-xl">
              {currentLabel}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="absolute bottom-0 left-0 right-0 z-40 border-t border-white/4 bg-[#040506]/55 px-5 py-5 backdrop-blur-[2px] sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center sm:justify-between sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {phase === "threading" && !exploreMode && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="font-heading text-[0.8125rem] text-ivory/32 transition-colors duration-[1.2s] hover:text-ivory/58"
              >
                {paused ? "Resume" : "Pause"}
              </button>
            )}
            {(phase === "threading" || phase === "explore") && (
              <button
                type="button"
                onClick={handleExplore}
                className="font-heading text-[0.8125rem] text-ivory/32 transition-colors duration-[1.2s] hover:text-ivory/58"
              >
                Wander nearby
              </button>
            )}
            {activeSegment < path.segments.length - 1 && (
              <button
                type="button"
                onClick={handleContinue}
                className="font-heading text-[0.8125rem] text-ivory/32 transition-colors duration-[1.2s] hover:text-ivory/58"
              >
                Continue
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleReturnToReading}
            className={cn(
              "font-heading text-[0.8125rem] text-forest-light/42 transition-colors duration-[1.2s]",
              "hover:text-forest-light/72",
            )}
          >
            Return to reading
          </button>
        </div>
      </footer>
    </motion.div>
  );
}
