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
import { ThresholdAtmosphere } from "./ThresholdAtmosphere";
import { ThresholdEntrance } from "./ThresholdEntrance";
import { computeDiscoveryDepth } from "@/lib/concepts/constellation-discovery";
import type { GraphNode } from "@/lib/concepts/graph";
import { buildTerrainGraph } from "@/lib/concepts/graph";
import type { ViewBox } from "@/lib/concepts/universe-viewport";
import {
  loadConstellationSession,
  saveConstellationSession,
  clearConstellationSession,
} from "@/lib/constellation/session";
import { NAVIGATION } from "@/lib/atmosphere/tempo";
import { useBreakpoint } from "@/lib/atmosphere/use-breakpoint";
import { usePrefersReducedMotion } from "@/lib/atmosphere/use-prefers-reduced-motion";
import { CIRCADIAN_POLL_MS } from "@/lib/atmosphere/circadian";
import { syncCircadian } from "@/lib/atmosphere/circadian-store";
import { useWonderArrival } from "@/lib/wonder/use-wonder-arrival";

type Phase = "threshold" | "crossing" | "within";

const THRESHOLD_VOID = "#06080c";
const MAP_VOID = "#020408";

const fade = { duration: 2.8, ease: NAVIGATION.ease };

export function ThresholdWorld() {
  const router = useRouter();
  const { navigate, arriving, arrivalIntent } = useTerrainNavigation();
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

  useEffect(() => {
    if (!entered) return;
    syncCircadian();
    const interval = window.setInterval(syncCircadian, CIRCADIAN_POLL_MS);
    return () => window.clearInterval(interval);
  }, [entered]);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden text-ivory supports-[height:100dvh]:min-h-[100dvh] min-h-screen"
      style={{ backgroundColor: entered ? MAP_VOID : THRESHOLD_VOID }}
    >
      {entered && (
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <ThresholdAtmosphere
            atmosphereLive
            backgroundMotionActive={!reducedMotion}
            starBrightness={0.46}
            fogDensity={0.35}
            clarity
            revealProgress={wonder.awakening}
            awakeningProgress={wonder.awakening}
            atmosphereRefinement={wonder.atmosphere}
            elapsedMs={wonder.elapsedMs}
            attention={wonder.attention}
          />
        </div>
      )}

      <SoundMuteControl
        className="relative z-40 text-ivory/40 hover:text-ivory/60 transition-opacity duration-[2.8s]"
        iconOnly={!wonder.chromeVisible}
        style={{ opacity: wonder.chromeVisible ? wonder.chromeOpacity : 0.35 }}
      />

      {(phase === "threshold" || crossing) && (
        <ThresholdEntrance
          crossing={crossing}
          entering={crossing}
          onEnter={handleCross}
        />
      )}

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
        animate={{ opacity: entered ? 1 : 0 }}
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
