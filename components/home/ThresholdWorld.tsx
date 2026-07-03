"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTerrainSoundOptional, SoundMuteControl } from "@/components/sound";
import { useTerrainNavigation, TerrainLink } from "@/components/navigation";
import { LingerWhisper } from "@/components/atmosphere/LingerWhisper";
import { SearchDialog } from "@/components/search/SearchDialog";
import { ChoosePathPanel } from "./ChoosePathPanel";
import { ConstellationCanvas } from "./ConstellationCanvas";
import { ConstellationHabitat } from "./ConstellationHabitat";
import { HeadingBloom } from "./HeadingBloom";
import { MapRevealVeil } from "./MapRevealVeil";
import { MapWhisper } from "./MapWhisper";
import { MobileTerrainGuide } from "./MobileTerrainGuide";
import { TerrainPulse } from "./TerrainPulse";
import { ThresholdHeroLandscape } from "./ThresholdHeroLandscape";
import { ThresholdAtmosphere } from "./ThresholdAtmosphere";
import { ThresholdChoices } from "./ThresholdChoices";
import { computeDiscoveryDepth } from "@/lib/concepts/constellation-discovery";
import { cn } from "@/lib/utils";
import type { GraphNode } from "@/lib/concepts/graph";
import { buildTerrainGraph } from "@/lib/concepts/graph";
import type { ViewBox } from "@/lib/concepts/universe-viewport";
import {
  loadConstellationSession,
  saveConstellationSession,
  clearConstellationSession,
} from "@/lib/constellation/session";
import { THRESHOLD, NAVIGATION } from "@/lib/atmosphere/tempo";
import { useBreakpoint } from "@/lib/atmosphere/use-breakpoint";
import { usePrefersReducedMotion } from "@/lib/atmosphere/use-prefers-reduced-motion";
import { useWonderArrival } from "@/lib/wonder/use-wonder-arrival";
import { useLayoutSettled } from "@/lib/hooks/use-mounted";

type Phase = "threshold" | "crossing" | "within";

const THRESHOLD_VOID = "#06080c";

const fade = { duration: 2.8, ease: NAVIGATION.ease };

export function ThresholdWorld() {
  const router = useRouter();
  const { navigate, arriving, arrivalIntent } = useTerrainNavigation();
  const { isMobile, isTablet } = useBreakpoint();
  const reducedMotion = usePrefersReducedMotion();
  const thresholdReady = useLayoutSettled();
  const searchParams = useSearchParams();
  const focusId = searchParams.get("focus");
  const sound = useTerrainSoundOptional();
  const { nodes, edges } = useMemo(() => buildTerrainGraph(), []);
  const [phase, setPhase] = useState<Phase>("threshold");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [exploredIds, setExploredIds] = useState<Set<string>>(() => new Set());
  const [discoveryAwake, setDiscoveryAwake] = useState(false);
  const [mapLayoutReady, setMapLayoutReady] = useState(false);
  const [wonderAbbreviated, setWonderAbbreviated] = useState(false);
  const [zoom, setZoom] = useState(0.38);
  const [restoredViewBox, setRestoredViewBox] = useState<ViewBox | null>(null);
  const viewBoxRef = useRef<ViewBox | null>(null);
  const autoExploreRef = useRef(false);
  const wonderEngageRef = useRef<() => void>(() => {});
  const crossingTimerRef = useRef<number | null>(null);
  const crossingMsRef = useRef(500);

  const entered = phase === "within";
  const crossing = phase === "crossing";

  const crossingMs = reducedMotion ? 300 : isMobile ? 900 : 500;
  crossingMsRef.current = crossingMs;
  const fadeDuration = reducedMotion ? 0.01 : 0.5;

  const mapInteractive = entered && mapLayoutReady;
  const wonder = useWonderArrival({
    active: entered,
    abbreviated: wonderAbbreviated || isMobile,
    reducedMotion,
  });
  wonderEngageRef.current = wonder.engage;

  const mapSettled = entered && mapLayoutReady && wonder.awakening >= 0.55;
  const constellationAwake = mapLayoutReady;

  const discoveryDepth = useMemo(
    () => computeDiscoveryDepth(constellationAwake, exploredIds.size, zoom),
    [constellationAwake, exploredIds.size, zoom],
  );

  const hoveredNode = nodes.find((n) => n.id === hoveredId);

  const starBrightness =
    phase === "crossing" ? 0.78 : phase === "within" ? 0.46 : 0.32;
  const fogDensity =
    phase === "crossing" ? 1.7 : phase === "within" ? 0.35 : 1;

  const enterMap = useCallback(() => {
    setPhase((current) => {
      if (current === "within") return current;
      return "within";
    });
    setMapLayoutReady(false);
    setDiscoveryAwake(false);
  }, []);

  const scheduleEnterMap = useCallback(() => {
    if (crossingTimerRef.current) window.clearTimeout(crossingTimerRef.current);
    crossingTimerRef.current = window.setTimeout(() => {
      crossingTimerRef.current = null;
      enterMap();
    }, crossingMsRef.current);
  }, [enterMap]);

  const handleCross = useCallback(() => {
    if (phase !== "threshold") return;
    const saved = loadConstellationSession();
    if (saved) {
      setExploredIds(new Set(saved.exploredIds));
      setRestoredViewBox(saved.viewBox);
      setWonderAbbreviated(true);
    } else {
      setWonderAbbreviated(false);
    }
    sound?.activate();
    setPhase("crossing");
    scheduleEnterMap();
  }, [phase, sound, scheduleEnterMap]);

  const handleMapLayoutReady = useCallback(() => {
    setMapLayoutReady(true);
    setDiscoveryAwake(true);
  }, []);

  useEffect(
    () => () => {
      if (crossingTimerRef.current) window.clearTimeout(crossingTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (phase !== "within" || !isMobile) return;
    setMapLayoutReady(true);
    setDiscoveryAwake(true);
    setWonderAbbreviated(true);
  }, [phase, isMobile]);

  useEffect(() => {
    if (!focusId || autoExploreRef.current || phase !== "threshold") return;
    autoExploreRef.current = true;
    const saved = loadConstellationSession();
    if (saved) {
      setExploredIds(new Set(saved.exploredIds));
      setRestoredViewBox(saved.viewBox);
      setWonderAbbreviated(true);
    }
    sound?.activate();
    setPhase("crossing");
    scheduleEnterMap();
  }, [focusId, phase, sound, scheduleEnterMap]);

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
    setWonderAbbreviated(true);
    setPhase("within");
    setMapLayoutReady(true);
    setDiscoveryAwake(true);
  }, [arrivalIntent, phase, sound]);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      wonderEngageRef.current();
      if (!mapLayoutReady) return;
      markExplored(node.id);
      if (viewBoxRef.current) {
        saveConstellationSession(viewBoxRef.current, exploredIds);
      }
      navigate(node.href);
    },
    [mapLayoutReady, markExplored, navigate, exploredIds],
  );

  const handleViewBoxPersist = useCallback((vb: ViewBox) => {
    viewBoxRef.current = vb;
    if (entered && mapLayoutReady) {
      saveConstellationSession(vb, exploredIds);
    }
  }, [entered, mapLayoutReady, exploredIds]);

  useEffect(() => {
    if (!sound?.activated) return;
    if (entered) sound.setScene("constellation");
    else if (phase === "threshold") sound.setScene("silence");
  }, [entered, phase, sound]);

  const handleNodeHover = useCallback(
    (id: string | null) => {
      if (id) wonderEngageRef.current();
      if (id && entered) sound?.playHover(id);
      if (!mapLayoutReady) return;
      setHoveredId(id);
      if (id) markExplored(id);
    },
    [mapLayoutReady, entered, markExplored, sound],
  );

  const returnToThreshold = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (crossingTimerRef.current) window.clearTimeout(crossingTimerRef.current);
    crossingTimerRef.current = null;
    autoExploreRef.current = false;
    setPhase("threshold");
    setHoveredId(null);
    setExploredIds(new Set());
    setDiscoveryAwake(false);
    setMapLayoutReady(false);
    setWonderAbbreviated(false);
    setRestoredViewBox(null);
    clearConstellationSession();
    router.replace("/", { scroll: false });
  }, [router]);

  const showPathPanel =
    wonder.chromeVisible && mapInteractive && !hoveredId;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden text-ivory supports-[height:100dvh]:min-h-[100dvh] min-h-screen"
      style={{ backgroundColor: entered ? "#020408" : THRESHOLD_VOID }}
    >
      <motion.div
        className={cn(
          "threshold-page-atmosphere pointer-events-none absolute inset-0 z-0",
          entered && "threshold-page-atmosphere--deep",
        )}
        aria-hidden
        initial={false}
        animate={{
          opacity: entered || crossing ? 1 : thresholdReady ? 1 : 0,
        }}
        transition={{
          duration: entered || crossing ? 0 : thresholdReady ? 0.9 : 0,
          ease: fade.ease,
        }}
      >
        <ThresholdAtmosphere
          starBrightness={entered || crossing ? starBrightness : 0}
          fogDensity={fogDensity}
          clarity={entered}
          revealProgress={entered ? wonder.awakening : 0}
          awakeningProgress={entered ? wonder.awakening : 0}
          atmosphereRefinement={entered ? wonder.atmosphere : 0}
          elapsedMs={entered ? wonder.elapsedMs : 0}
          attention={wonder.attention}
        />
        <ObservatoryRings
          visible={entered || crossing}
          crossing={crossing}
          awakening={wonder.awakening}
        />
      </motion.div>

      <SoundMuteControl
        className="text-ivory/40 hover:text-ivory/60 transition-opacity duration-[2.8s]"
        iconOnly={!wonder.chromeVisible}
        style={{ opacity: wonder.chromeVisible ? wonder.chromeOpacity : 0.35 }}
      />

      <AnimatePresence>
        {(phase === "threshold" || crossing) && (
          <motion.div
            key="threshold-layer"
            className="absolute inset-0 z-30 flex items-center justify-center overflow-y-auto overscroll-contain"
            style={{
              paddingTop: "max(1.5rem, env(safe-area-inset-top))",
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            }}
            initial={false}
            animate={{
              opacity: crossing ? 0 : thresholdReady ? 1 : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: crossing ? fadeDuration * 0.9 : thresholdReady ? 0.9 : 0,
              ease: fade.ease,
            }}
          >
            <ThresholdHeroLandscape crossing={crossing} reducedMotion={reducedMotion} />

            <div
              className="hero-foreground relative z-10 mx-auto my-auto w-full max-w-2xl py-8 text-center sm:py-10"
              style={{
                paddingLeft: "max(1.25rem, env(safe-area-inset-left, 0px))",
                paddingRight: "max(1.25rem, env(safe-area-inset-right, 0px))",
              }}
            >
              <p className="type-chamber text-ivory/38 sm:text-ivory/32">
                Threshold
              </p>

              <h1 className="mt-5 font-heading text-[1.75rem] leading-[1.12] text-ivory sm:mt-7 sm:text-3xl md:text-[2.25rem]">
                <HeadingBloom bloomClassName="hero-heading-bloom inset-[-2.5rem_-3.5rem] sm:inset-[-3rem_-4.5rem]">
                  Living Terrain
                </HeadingBloom>
              </h1>

              <div className="mx-auto mt-8 max-w-md space-y-5 text-left text-[0.9375rem] leading-[1.92] text-ivory/52 sm:mt-10 sm:max-w-lg sm:text-center sm:text-base sm:leading-[1.96]">
                <p className="font-heading text-lg italic leading-[1.65] text-ivory/62 sm:text-xl">
                  Something vast and quiet lies ahead.
                </p>
                <p>You need not understand it yet.</p>
                <p className="text-ivory/44">
                  Step forward when something pulls you.
                </p>
              </div>

              {!crossing && (
                <ThresholdChoices onExplore={handleCross} exploring={crossing} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {wonder.chromeVisible && mapInteractive && (
          <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: wonder.chromeOpacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.8, ease: fade.ease }}
            className="threshold-map-chrome relative z-50 flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4 md:px-8"
            style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
          >
            <Link
              href="/"
              className="threshold-map-nav-link flex min-h-11 min-w-11 items-center font-heading text-[0.9375rem] md:text-base"
              onClick={returnToThreshold}
            >
              <HeadingBloom bloomClassName="inset-[-1.25rem_-2rem] opacity-60">
                Living Terrain
              </HeadingBloom>
            </Link>
            <div className="flex items-center gap-1 sm:gap-5">
              <TerrainLink
                href="/inquiry"
                className="threshold-map-nav-link flex min-h-11 min-w-11 items-center justify-center px-2 text-[0.8125rem] tracking-[0.04em] sm:px-0 sm:text-[0.75rem] sm:tracking-[0.06em]"
              >
                Read
              </TerrainLink>
              <div className="flex min-h-11 min-w-11 items-center justify-center [&_button]:threshold-map-nav-link [&_button]:flex [&_button]:min-h-11 [&_button]:min-w-11 [&_button]:items-center [&_button]:justify-center">
                <SearchDialog />
              </div>
              <Link
                href="/about"
                className="threshold-map-nav-link flex min-h-11 min-w-11 items-center justify-center px-2 text-[0.8125rem] tracking-[0.04em] sm:px-0 sm:text-[0.75rem] sm:tracking-[0.06em]"
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
          opacity: entered ? 1 : 0,
        }}
        transition={{
          duration: crossing ? 0.45 : arriving ? NAVIGATION.readingToMap.enter / 1000 : 0,
          delay: crossing ? 0 : arriving ? 0.12 : 0,
          ease: fade.ease,
        }}
      >
        <div className="relative hidden h-full md:block">
          <ConstellationCanvas
            nodes={nodes}
            edges={edges}
            sessionActive={entered}
            enabled={mapInteractive}
            discoveryAwake={constellationAwake}
            discoveryDepth={discoveryDepth}
            revealProgress={1}
            stableLayout
            awakeningProgress={wonder.awakening}
            chamberLabelPresence={wonder.chamberLabel}
            wonderEngaged={wonder.engaged}
            showChrome={wonder.chromeVisible}
            onVisitorEngage={wonder.engage}
            onAttention={wonder.setAttention}
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
            onLayoutReady={handleMapLayoutReady}
          />
          <MapRevealVeil opacity={wonder.veil} />
        </div>

        {entered && (isMobile ? mapLayoutReady : mapSettled) && (
          <div className="md:hidden">
            <MobileTerrainGuide
              nodes={nodes}
              discoveryAwake={mapLayoutReady}
              onPathSelect={markExplored}
              reducedMotion={reducedMotion}
            />
          </div>
        )}

        <div className="hidden md:contents">
          <MapWhisper
            active={wonder.chromeVisible && mapInteractive}
            paused={!!hoveredId}
          />

          <ConstellationHabitat
            active={wonder.chromeVisible && mapInteractive}
            quiet={!!hoveredId}
          />

          <LingerWhisper
            variant="threshold"
            delay={22000}
            paused={!wonder.chromeVisible || !mapInteractive || !!hoveredId}
            className="z-[12]"
          />

          {wonder.chromeVisible && mapInteractive && !hoveredId && (
            <TerrainPulse
              variant="map"
              className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-20 hidden max-w-[11rem] lg:block"
              style={{ opacity: wonder.chromeOpacity }}
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
  awakening,
}: {
  visible: boolean;
  crossing: boolean;
  awakening: number;
}) {
  const opacity =
    (visible ? 0.012 : 0) +
    (crossing ? 0.006 : 0) +
    awakening * 0.02;

  return (
    <svg
      className="pointer-events-none absolute left-1/2 top-[42%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[3s]"
      style={{ opacity }}
      viewBox="0 0 100 100"
      aria-hidden
    >
      <circle cx="50" cy="50" r="48" fill="none" stroke="#788898" strokeWidth="0.12" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="#788898" strokeWidth="0.08" opacity="0.6" />
      <circle cx="50" cy="50" r="24" fill="none" stroke="#788898" strokeWidth="0.06" opacity="0.4" />
    </svg>
  );
}
