"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTerrainSoundOptional, SoundMuteControl } from "@/components/sound";
import { useTerrainNavigation, TerrainLink } from "@/components/navigation";
import { useCircadian } from "@/lib/atmosphere/useCircadian";
import { LingerWhisper } from "@/components/atmosphere/LingerWhisper";
import { SearchDialog } from "@/components/search/SearchDialog";
import { ChoosePathPanel } from "./ChoosePathPanel";
import { ConstellationCanvas } from "./ConstellationCanvas";
import { ConstellationHabitat } from "./ConstellationHabitat";
import { DiscoveryOnboarding } from "./DiscoveryOnboarding";
import { HeadingBloom } from "./HeadingBloom";
import { MapWhisper } from "./MapWhisper";
import { MobileTerrainGuide } from "./MobileTerrainGuide";
import { TerrainPulse } from "./TerrainPulse";
import { StoneMapVeil } from "@/components/world";
import { ThresholdHeroLandscape } from "./ThresholdHeroLandscape";
import { ThresholdAtmosphere } from "./ThresholdAtmosphere";
import { ThresholdChoices } from "./ThresholdChoices";
import { computeDiscoveryDepth } from "@/lib/concepts/constellation-discovery";
import type { GraphNode } from "@/lib/concepts/graph";
import { buildTerrainGraph } from "@/lib/concepts/graph";
import { cinematicEase } from "@/lib/concepts/universe-viewport";
import type { ViewBox } from "@/lib/concepts/universe-viewport";
import {
  loadConstellationSession,
  saveConstellationSession,
  clearConstellationSession,
} from "@/lib/constellation/session";
import { THRESHOLD, NAVIGATION } from "@/lib/atmosphere/tempo";
import { useBreakpoint } from "@/lib/atmosphere/use-breakpoint";
import { usePrefersReducedMotion } from "@/lib/atmosphere/use-prefers-reduced-motion";

type Phase = "threshold" | "crossing" | "within";

const fade = { duration: 2.8, ease: NAVIGATION.ease };

export function ThresholdWorld() {
  const router = useRouter();
  const { navigate, arriving, arrivalIntent } = useTerrainNavigation();
  const circadian = useCircadian();
  const { isMobile, isTablet } = useBreakpoint();
  const reducedMotion = usePrefersReducedMotion();
  const searchParams = useSearchParams();
  const focusId = searchParams.get("focus");
  const sound = useTerrainSoundOptional();
  const { nodes, edges } = useMemo(() => buildTerrainGraph(), []);
  const [phase, setPhase] = useState<Phase>("threshold");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [exploredIds, setExploredIds] = useState<Set<string>>(() => new Set());
  const [discoveryAwake, setDiscoveryAwake] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [revealRunning, setRevealRunning] = useState(false);
  const [zoom, setZoom] = useState(0.38);
  const [restoredViewBox, setRestoredViewBox] = useState<ViewBox | null>(null);
  const viewBoxRef = useRef<ViewBox | null>(null);
  const revealFrameRef = useRef<number | null>(null);
  const autoExploreRef = useRef(false);

  const entered = phase === "within";
  const crossing = phase === "crossing";

  const crossingMs = reducedMotion ? 400 : isMobile ? 1500 : THRESHOLD.crossingMs;
  const introHoldMs = reducedMotion ? 150 : isMobile ? 0 : THRESHOLD.introHoldMs;
  const revealMs = reducedMotion ? 250 : isMobile ? 0 : THRESHOLD.revealMs;
  const fadeDuration = reducedMotion ? 0.01 : isMobile ? 1.2 : 2.6;

  const discoveryDepth = useMemo(
    () => computeDiscoveryDepth(discoveryAwake, exploredIds.size, zoom),
    [discoveryAwake, exploredIds.size, zoom],
  );

  const hoveredNode = nodes.find((n) => n.id === hoveredId);

  const starBrightness =
    phase === "crossing" ? 0.78 : phase === "within" ? 0.5 : 0.32;
  const fogDensity =
    phase === "crossing" ? 1.7 : phase === "within" ? 0.85 : 1;

  const handleCross = useCallback(() => {
    if (phase !== "threshold") return;
    const saved = loadConstellationSession();
    if (saved) {
      setExploredIds(new Set(saved.exploredIds));
      setRestoredViewBox(saved.viewBox);
    }
    sound?.activate();
    setPhase("crossing");
    window.setTimeout(() => setPhase("within"), crossingMs);
  }, [phase, sound, crossingMs]);

  const startReveal = useCallback(() => {
    if (isMobile || revealMs <= 0) {
      setIntroVisible(false);
      setRevealRunning(false);
      setRevealProgress(1);
      setDiscoveryAwake(true);
      return;
    }

    setIntroVisible(false);
    setRevealRunning(true);
    setRevealProgress(0);

    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / revealMs);
      setRevealProgress(cinematicEase(t));
      if (t < 1) {
        revealFrameRef.current = requestAnimationFrame(step);
      } else {
        setRevealRunning(false);
        setDiscoveryAwake(true);
      }
    };
    revealFrameRef.current = requestAnimationFrame(step);
  }, [isMobile, revealMs]);

  useEffect(() => {
    if (phase !== "within" || discoveryAwake || revealRunning) return;

    if (isMobile) {
      setDiscoveryAwake(true);
      setRevealProgress(1);
      setIntroVisible(false);
      return;
    }

    setIntroVisible(true);
    const timer = window.setTimeout(startReveal, introHoldMs);
    return () => window.clearTimeout(timer);
  }, [phase, discoveryAwake, revealRunning, startReveal, isMobile, introHoldMs]);

  useEffect(
    () => () => {
      if (revealFrameRef.current) cancelAnimationFrame(revealFrameRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!focusId || autoExploreRef.current || phase !== "threshold") return;
    autoExploreRef.current = true;
    const saved = loadConstellationSession();
    if (saved) {
      setExploredIds(new Set(saved.exploredIds));
      setRestoredViewBox(saved.viewBox);
    }
    sound?.activate();
    setPhase("crossing");
    window.setTimeout(() => setPhase("within"), crossingMs);
  }, [focusId, phase, sound, crossingMs]);

  const markExplored = useCallback((id: string) => {
    setExploredIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (arrivalIntent !== "reading-to-map" && arrivalIntent !== "theme-to-map") {
      return;
    }
    if (phase !== "threshold") return;

    sound?.activate();
    setPhase("within");
    setDiscoveryAwake(true);
    setIntroVisible(false);
    setRevealProgress(0.65);
    setRevealRunning(false);
  }, [arrivalIntent, phase, sound]);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      if (!discoveryAwake) return;
      markExplored(node.id);
      if (viewBoxRef.current) {
        saveConstellationSession(viewBoxRef.current, exploredIds);
      }
      navigate(node.href);
    },
    [discoveryAwake, markExplored, navigate, exploredIds],
  );

  const handleViewBoxPersist = useCallback((vb: ViewBox) => {
    viewBoxRef.current = vb;
    if (entered && discoveryAwake) {
      saveConstellationSession(vb, exploredIds);
    }
  }, [entered, discoveryAwake, exploredIds]);

  useEffect(() => {
    if (!sound?.activated) return;
    if (entered) sound.setScene("constellation");
    else if (phase === "threshold") sound.setScene("silence");
  }, [entered, phase, sound]);

  const handleNodeHover = useCallback(
    (id: string | null) => {
      if (id && entered) sound?.playHover(id);
      if (!discoveryAwake) return;
      setHoveredId(id);
      if (id) markExplored(id);
    },
    [discoveryAwake, entered, markExplored, sound],
  );

  const returnToThreshold = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (revealFrameRef.current) cancelAnimationFrame(revealFrameRef.current);
    autoExploreRef.current = false;
    setPhase("threshold");
    setHoveredId(null);
    setExploredIds(new Set());
    setDiscoveryAwake(false);
    setIntroVisible(false);
    setRevealProgress(0);
    setRevealRunning(false);
    setRestoredViewBox(null);
    clearConstellationSession();
    router.replace("/", { scroll: false });
  }, [router]);

  const [pathPanelReady, setPathPanelReady] = useState(false);

  useEffect(() => {
    if (!entered || !discoveryAwake) return;
    if (exploredIds.size >= 2) {
      setPathPanelReady(true);
      return;
    }
    const timer = window.setTimeout(() => setPathPanelReady(true), 48000);
    return () => window.clearTimeout(timer);
  }, [entered, discoveryAwake, exploredIds.size]);

  const showPathPanel =
    pathPanelReady &&
    entered &&
    discoveryAwake &&
    !introVisible &&
    !revealRunning &&
    !hoveredId;

  return (
    <div
      className="threshold-page-breathe fixed inset-0 flex flex-col overflow-hidden text-ivory transition-[background-color] duration-[300s] supports-[height:100dvh]:min-h-[100dvh] min-h-screen"
      style={{ backgroundColor: circadian.voidBase }}
    >
      <ThresholdAtmosphere
        starBrightness={entered || crossing ? starBrightness : 0}
        fogDensity={fogDensity}
        clarity={entered}
        revealProgress={entered ? revealProgress : 0}
      />
      <ObservatoryRings
        visible={entered || crossing}
        crossing={crossing}
        revealProgress={entered ? revealProgress : 0}
      />

      <SoundMuteControl className="text-ivory/40 hover:text-ivory/60" />

      <AnimatePresence>
        {(phase === "threshold" || crossing) && (
          <motion.div
            key="threshold-layer"
            className="absolute inset-0 z-30 flex items-center justify-center overflow-y-auto overscroll-contain"
            style={{
              paddingTop: "max(1.5rem, env(safe-area-inset-top))",
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: crossing ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: crossing ? fadeDuration * 0.9 : 0.6, ease: fade.ease }}
          >
            <ThresholdHeroLandscape crossing={crossing} reducedMotion={reducedMotion} />

            <div
              className="hero-foreground relative z-10 mx-auto my-auto w-full max-w-2xl py-8 text-center sm:py-10"
              style={{
                paddingLeft: "max(1.25rem, env(safe-area-inset-left, 0px))",
                paddingRight: "max(1.25rem, env(safe-area-inset-right, 0px))",
              }}
            >
              <motion.p
                className="type-chamber text-ivory/38 sm:text-ivory/32"
                initial={{ opacity: 0 }}
                animate={{ opacity: crossing ? 0 : 1 }}
                transition={{ duration: 1.6, delay: 0.1, ease: fade.ease }}
              >
                Threshold
              </motion.p>

              <motion.h1
                className="mt-5 font-heading text-[1.75rem] leading-[1.12] text-ivory sm:mt-7 sm:text-3xl md:text-[2.25rem]"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: crossing ? 0 : 1, y: crossing ? -4 : 0 }}
                transition={{ duration: 1.9, delay: 0.22, ease: fade.ease }}
              >
                <HeadingBloom bloomClassName="hero-heading-bloom inset-[-2.5rem_-3.5rem] sm:inset-[-3rem_-4.5rem]">
                  Living Terrain
                </HeadingBloom>
              </motion.h1>

              <motion.div
                className="mx-auto mt-8 max-w-md space-y-5 text-left text-[0.9375rem] leading-[1.92] text-ivory/52 sm:mt-10 sm:max-w-lg sm:text-center sm:text-base sm:leading-[1.96]"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: crossing ? 0 : 1, y: crossing ? -3 : 0 }}
                transition={{ duration: 2, delay: 0.38, ease: fade.ease }}
              >
                <p className="font-heading text-lg italic leading-[1.65] text-ivory/62 sm:text-xl">
                  Something vast and quiet lies ahead.
                </p>
                <p>You need not understand it yet.</p>
                <p className="text-ivory/44">
                  Step forward when something pulls you.
                </p>
              </motion.div>

              {!crossing && (
                <ThresholdChoices onExplore={handleCross} exploring={crossing} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {entered && discoveryAwake && !introVisible && (
          <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0.01 : isMobile ? 0.8 : 2.4, delay: isMobile ? 0.1 : 0.4, ease: fade.ease }}
            className="relative z-20 flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4 md:px-8"
            style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
          >
            <Link
              href="/"
              className="flex min-h-11 min-w-11 items-center font-heading text-[0.9375rem] text-ivory/80 sm:text-sm sm:text-ivory/75 md:text-base"
              onClick={returnToThreshold}
            >
              <HeadingBloom bloomClassName="inset-[-1.25rem_-2rem] opacity-80">
                Living Terrain
              </HeadingBloom>
            </Link>
            <div className="flex items-center gap-1 sm:gap-5">
              <TerrainLink
                href="/inquiry"
                className="flex min-h-11 min-w-11 items-center justify-center px-2 text-[0.8125rem] tracking-[0.04em] text-ivory/45 transition-colors duration-500 active:text-ivory/70 sm:px-0 sm:text-[0.6875rem] sm:tracking-[0.06em] sm:text-ivory/30 sm:hover:text-ivory/55"
              >
                Read
              </TerrainLink>
              <div className="flex min-h-11 min-w-11 items-center justify-center [&_button]:min-h-11 [&_button]:min-w-11 [&_button]:text-ivory/45 [&_button]:active:text-ivory/70 sm:[&_button]:text-ivory/30 sm:[&_button:hover]:text-ivory/55">
                <SearchDialog />
              </div>
              <Link
                href="/about"
                className="flex min-h-11 min-w-11 items-center justify-center px-2 text-[0.8125rem] tracking-[0.04em] text-ivory/45 transition-colors duration-500 active:text-ivory/70 sm:px-0 sm:text-[0.6875rem] sm:tracking-[0.06em] sm:text-ivory/30 sm:hover:text-ivory/55"
              >
                About
              </Link>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10 min-h-0 flex-1 isolation-isolate"
        initial={{ opacity: arriving ? 0.2 : 0 }}
        animate={{
          opacity: entered ? 1 : crossing ? 0.35 : 0,
        }}
        transition={{
          duration: crossing
            ? crossingMs / 1000
            : arriving
              ? NAVIGATION.readingToMap.enter / 1000
              : 0,
          delay: crossing ? (isMobile ? 0.2 : 0.6) : arriving ? 0.25 : 0,
          ease: fade.ease,
        }}
      >
        {entered && introVisible && (
          <div className="hidden md:block">
            <DiscoveryOnboarding visible />
          </div>
        )}

        <div className="relative hidden h-full md:block">
          <StoneMapVeil active={entered && discoveryAwake} />
          <ConstellationCanvas
            nodes={nodes}
            edges={edges}
            sessionActive={entered}
            enabled={discoveryAwake}
            discoveryAwake={discoveryAwake}
            discoveryDepth={discoveryDepth}
            revealProgress={revealProgress}
            focusNodeId={focusId}
            exploredIds={exploredIds}
            hoveredId={hoveredId}
            hoveredNode={hoveredNode}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            onZoomChange={setZoom}
            restoredViewBox={restoredViewBox}
            onViewBoxPersist={handleViewBoxPersist}
            comfortableMode={isTablet}
          />
        </div>

        {entered && (
          <div className="md:hidden">
            <MobileTerrainGuide
              nodes={nodes}
              discoveryAwake={discoveryAwake}
              onPathSelect={markExplored}
              reducedMotion={reducedMotion}
            />
          </div>
        )}

        <div className="hidden md:contents">
          <MapWhisper
            active={entered && discoveryAwake}
            paused={!!hoveredId || introVisible || revealRunning}
          />

          <ConstellationHabitat
            active={entered && discoveryAwake}
            quiet={!!hoveredId || introVisible || revealRunning}
          />

          <LingerWhisper
            variant="threshold"
            delay={22000}
            paused={!discoveryAwake || !!hoveredId || introVisible}
            className="z-[25]"
          />

          {entered && discoveryAwake && !introVisible && !hoveredId && (
            <TerrainPulse
              variant="map"
              className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-5 z-20"
            />
          )}

          <ChoosePathPanel visible={showPathPanel} onPathSelect={markExplored} />
        </div>
      </motion.div>
    </div>
  );
}

function ObservatoryRings({
  visible,
  crossing,
  revealProgress,
}: {
  visible: boolean;
  crossing: boolean;
  revealProgress: number;
}) {
  const opacity =
    (visible ? 0.035 : 0) +
    (crossing ? 0.015 : 0) +
    revealProgress * 0.04;

  return (
    <svg
      className="pointer-events-none absolute left-1/2 top-[42%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[3s]"
      style={{ opacity }}
      viewBox="0 0 100 100"
      aria-hidden
    >
      <circle cx="50" cy="50" r="48" fill="none" stroke="#8fa88a" strokeWidth="0.12" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="#8fa88a" strokeWidth="0.08" opacity="0.6" />
      <circle cx="50" cy="50" r="24" fill="none" stroke="#8fa88a" strokeWidth="0.06" opacity="0.4" />
    </svg>
  );
}
