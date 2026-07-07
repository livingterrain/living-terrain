"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { GraphEdge, GraphNode, GraphNodeKind, EdgeTier, NodeShape } from "@/lib/concepts/graph";
import { getVisibleGraph } from "@/lib/concepts/graph";
import {
  filterGraphForDiscovery,
  getConstellationNeighbors,
  getPrimaryConstellationNodes,
  whisperForNode,
} from "@/lib/concepts/constellation-discovery";
import {
  CHAMBER_INTRO_VIEW,
  UNIVERSE_CENTER,
  UNIVERSE_SIZE,
  lerpViewBox,
  mixViewBox,
  panViewBox,
  viewBoxForNode,
  viewBoxForNodes,
  zoomAtPoint,
  zoomLevel,
  type ViewBox,
} from "@/lib/concepts/universe-viewport";
import {
  edgeHopDistances,
  edgeKey,
  rippleBoost,
} from "@/lib/constellation/hover-ripple";
import { cn } from "@/lib/utils";
import { ConstellationBondHint } from "./ConstellationBondHint";
import { MOTION } from "@/lib/atmosphere/tempo";
import { useConstellationCursorDrift } from "@/lib/constellation/use-constellation-cursor-drift";
import {
  chamberPresence,
  conceptPresence,
  edgePresence,
  WONDER_ARRIVAL,
} from "@/lib/wonder/arrival";
import {
  CELESTIAL_KIND_LABEL,
  celestialFocusSpan,
  celestialGlowOpacity,
  celestialGroupOpacity,
  celestialLabelOffset,
  celestialLabelSize,
  celestialRadius,
  celestialStyleFor,
  shouldShowCelestialLabel,
  type CelestialBodyStyle,
} from "@/lib/constellation/celestial-hierarchy";

const kindColors: Record<GraphNodeKind, string> = {
  chamber: "#faf6ee",
  concept: "#f0ece4",
  essay: "#e4e0d8",
  book: "#e8dcc8",
  question: "#d8dce4",
  "field-note": "#ccd4dc",
  quotation: "#c8d0d8",
  observation: "#d0d8e4",
};

/** Warm accent tint — barely perceptible, for halos only */
const kindWarmAccent: Record<GraphNodeKind, string> = {
  chamber: "#f0e0c8",
  concept: "#e8dcc8",
  essay: "#ddd4c4",
  book: "#e0d0b0",
  question: "#d0d4dc",
  "field-note": "#c8d0d8",
  quotation: "#c4ccd4",
  observation: "#c8d4e4",
};

const kindRealm: Record<GraphNodeKind, string> = {
  chamber: `${CELESTIAL_KIND_LABEL.chamber} · foundational`,
  concept: `${CELESTIAL_KIND_LABEL.concept} · architecture`,
  essay: CELESTIAL_KIND_LABEL.essay,
  book: CELESTIAL_KIND_LABEL.book,
  question: CELESTIAL_KIND_LABEL.question,
  "field-note": CELESTIAL_KIND_LABEL["field-note"],
  quotation: CELESTIAL_KIND_LABEL.quotation,
  observation: CELESTIAL_KIND_LABEL.observation,
};

const fade = { duration: MOTION.fade / 1000, ease: [0.45, 0.05, 0.55, 0.95] as const };
const HOVER_TRANSITION =
  "transform 0.22s cubic-bezier(0.45, 0.05, 0.55, 0.95), opacity 0.22s cubic-bezier(0.45, 0.05, 0.55, 0.95)";
const LABEL_TRANSITION =
  "opacity 1.4s cubic-bezier(0.45, 0.05, 0.55, 0.95)";
const ARRIVAL_TRANSITION =
  "opacity 1.1s cubic-bezier(0.45, 0.05, 0.55, 0.95)";
const EDGE_HOVER_TRANSITION = "opacity 0.22s cubic-bezier(0.45, 0.05, 0.55, 0.95)";

function pulseOffset(seed: string): { durScale: number; delay: number } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const n = Math.abs(h);
  return {
    durScale: 0.88 + (n % 24) / 100,
    delay: (n % 90) / 10,
  };
}

const EDGE_PROXIMITY = 480;

/** Mobile handheld instrument — gentle parallax only, always springs home */
const MOBILE_PARALLAX_MAX_PX = 30;
const MOBILE_PARALLAX_DRAG = 0.16;
const MOBILE_SPRING_MS = 540;

function clampMobileParallax(px: number, py: number) {
  const max = MOBILE_PARALLAX_MAX_PX;
  const len = Math.hypot(px, py);
  if (len <= max) return { px, py };
  const scale = max / len;
  return { px: px * scale, py: py * scale };
}

function viewBoxWithMobileParallax(
  anchor: ViewBox,
  parallaxPx: { px: number; py: number },
  containerW: number,
  containerH: number,
): ViewBox {
  const { px, py } = clampMobileParallax(parallaxPx.px, parallaxPx.py);
  const dx = (px / containerW) * anchor.w;
  const dy = (py / containerH) * anchor.h;
  return {
    x: anchor.x - dx,
    y: anchor.y - dy,
    w: anchor.w,
    h: anchor.h,
  };
}

function isNearMobileAnchor(current: ViewBox, anchor: ViewBox): boolean {
  return (
    Math.abs(current.w - anchor.w) / anchor.w < 0.04 &&
    Math.abs(current.x - anchor.x) < anchor.w * 0.06 &&
    Math.abs(current.y - anchor.y) < anchor.h * 0.06
  );
}

const EDGE_TIER: Record<
  EdgeTier,
  { widthMul: number; baseOpacity: number; color: string; dash?: string }
> = {
  primary: { widthMul: 2.2, baseOpacity: 0.09, color: "#8898a8" },
  secondary: { widthMul: 1.2, baseOpacity: 0.05, color: "#687888" },
  emerging: { widthMul: 0.7, baseOpacity: 0.03, color: "#485868", dash: "5 8" },
};

function nodeRadius(
  node: GraphNode,
  viewBoxW: number,
  touchMode = false,
): number {
  const base = celestialRadius(node, viewBoxW);
  return touchMode ? base * 1.8 : base;
}

interface ConstellationCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  sessionActive: boolean;
  enabled: boolean;
  discoveryAwake: boolean;
  discoveryDepth: number;
  revealProgress: number;
  focusNodeId?: string | null;
  exploredIds?: Set<string>;
  hoveredId: string | null;
  hoveredNode: GraphNode | undefined;
  onNodeClick: (node: GraphNode) => void;
  onNodeHover: (id: string | null) => void;
  onZoomChange?: (zoom: number) => void;
  restoredViewBox?: ViewBox | null;
  onViewBoxPersist?: (viewBox: ViewBox) => void;
  /** Tablet: fewer nodes, calmer density */
  comfortableMode?: boolean;
  /** Phone: tap-to-reveal, larger bodies, no inline labels */
  touchMode?: boolean;
  /** Skip camera motion and per-node reveal — full layout at once */
  stableLayout?: boolean;
  onLayoutReady?: () => void;
  /** Wonder arrival — 0–1 master clock */
  awakeningProgress?: number;
  chamberLabelPresence?: number;
  wonderEngaged?: boolean;
  showChrome?: boolean;
  onVisitorEngage?: () => void;
  onAttention?: (x: number, y: number) => void;
}

export function ConstellationCanvas({
  nodes,
  edges,
  sessionActive,
  enabled,
  discoveryAwake,
  discoveryDepth,
  revealProgress,
  focusNodeId,
  exploredIds,
  hoveredId,
  hoveredNode,
  onNodeClick,
  onNodeHover,
  onZoomChange,
  restoredViewBox,
  onViewBoxPersist,
  comfortableMode = false,
  touchMode = false,
  stableLayout = false,
  onLayoutReady,
  awakeningProgress = 1,
  chamberLabelPresence = 1,
  wonderEngaged = true,
  showChrome = true,
  onVisitorEngage,
  onAttention,
}: ConstellationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const driftGroupRef = useRef<SVGGElement>(null);
  const pointerTravelRef = useRef(0);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const viewBoxRef = useRef<ViewBox>(CHAMBER_INTRO_VIEW);
  const animRef = useRef<number | null>(null);
  const dragRef = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const inertiaRef = useRef<number | null>(null);
  const enteredSessionRef = useRef(false);
  const layoutNotifiedRef = useRef(false);
  const navigatingRef = useRef(false);
  const skipHoverClearRef = useRef(false);
  const restoredViewRef = useRef(false);
  const zoomVelocityRef = useRef(0);
  const zoomInertiaRef = useRef<number | null>(null);
  const rippleStartRef = useRef(0);
  const edgeHopRef = useRef<Map<string, number>>(new Map());

  const [rippleElapsed, setRippleElapsed] = useState(0);

  const [viewBox, setViewBox] = useState<ViewBox>(CHAMBER_INTRO_VIEW);
  const [isDragging, setIsDragging] = useState(false);
  const [showUniverseBtn, setShowUniverseBtn] = useState(false);
  const [containerSize, setContainerSize] = useState({ w: 1, h: 1 });

  const primaryNodes = useMemo(
    () => getPrimaryConstellationNodes(nodes),
    [nodes],
  );

  const primaryViewBox = useMemo(
    () =>
      viewBoxForNodes(
        primaryNodes,
        containerSize.w,
        containerSize.h,
        touchMode ? 1.04 : 1.26,
      ),
    [primaryNodes, containerSize.w, containerSize.h, touchMode],
  );

  const conceptOrder = useMemo(() => {
    const cx = UNIVERSE_CENTER;
    const cy = UNIVERSE_CENTER;
    const concepts = primaryNodes
      .filter((n) => n.kind === "concept")
      .sort(
        (a, b) =>
          Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx),
      );
    return new Map(concepts.map((n, i) => [n.id, i]));
  }, [primaryNodes]);

  const reveal = stableLayout ? 1 : Math.max(0, Math.min(1, revealProgress));
  const inReveal = stableLayout ? false : reveal < 1;

  const layoutReady =
    containerSize.w >= 96 && containerSize.h >= 96;

  const effectiveDiscoveryDepth = comfortableMode
    ? Math.min(discoveryDepth, 2)
    : discoveryDepth;

  const zoom = zoomLevel(viewBox);

  const applyViewBox = useCallback(
    (next: ViewBox, options?: { persist?: boolean }) => {
      viewBoxRef.current = next;
      setViewBox(next);
      const shouldPersist =
        options?.persist !== false &&
        (!touchMode || isNearMobileAnchor(next, primaryViewBox));
      if (shouldPersist) onViewBoxPersist?.(touchMode ? primaryViewBox : next);
      const atPrimary =
        Math.abs(next.w - primaryViewBox.w) / primaryViewBox.w < 0.08 &&
        Math.abs(next.x - primaryViewBox.x) < primaryViewBox.w * 0.12;
      setShowUniverseBtn(!touchMode && !atPrimary && !inReveal);
    },
    [primaryViewBox, inReveal, onViewBoxPersist, touchMode],
  );

  useEffect(() => {
    onZoomChange?.(zoom);
  }, [zoom, onZoomChange]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setContainerSize({ w: rect.width || 1, h: rect.height || 1 });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sessionActive) {
      enteredSessionRef.current = false;
      restoredViewRef.current = false;
      layoutNotifiedRef.current = false;
      return;
    }

    if (stableLayout) {
      if (!layoutReady) return;
      const target =
        touchMode || !restoredViewBox ? primaryViewBox : restoredViewBox;
      applyViewBox(target);
      enteredSessionRef.current = true;
      if (!layoutNotifiedRef.current) {
        layoutNotifiedRef.current = true;
        onLayoutReady?.();
      }
      return;
    }

    if (enteredSessionRef.current) return;

    enteredSessionRef.current = true;
    if (restoredViewBox && !restoredViewRef.current) {
      restoredViewRef.current = true;
      applyViewBox(restoredViewBox);
      onLayoutReady?.();
      return;
    }

    applyViewBox(CHAMBER_INTRO_VIEW);
  }, [
    sessionActive,
    stableLayout,
    layoutReady,
    applyViewBox,
    restoredViewBox,
    primaryViewBox,
    onLayoutReady,
  ]);

  useEffect(() => {
    if (!touchMode || !sessionActive || !layoutReady) return;
    applyViewBox(primaryViewBox);
  }, [touchMode, sessionActive, layoutReady, primaryViewBox, applyViewBox]);

  useEffect(() => {
    if (stableLayout || !sessionActive || reveal >= 1) return;
    applyViewBox(mixViewBox(CHAMBER_INTRO_VIEW, primaryViewBox, reveal));
  }, [reveal, primaryViewBox, sessionActive, applyViewBox, stableLayout]);

  useEffect(() => {
    if (stableLayout || !sessionActive || reveal < 1 || restoredViewRef.current) {
      return;
    }
    applyViewBox(primaryViewBox);
  }, [sessionActive, reveal, primaryViewBox, applyViewBox, stableLayout]);

  const discoveryGraph = useMemo(
    () =>
      filterGraphForDiscovery(
        nodes,
        edges,
        effectiveDiscoveryDepth,
        discoveryAwake,
        reveal,
      ),
    [nodes, edges, effectiveDiscoveryDepth, discoveryAwake, reveal],
  );

  const { nodes: visibleNodes, edges: visibleEdges } = useMemo(
    () => getVisibleGraph(discoveryGraph, zoom, viewBox),
    [discoveryGraph, zoom, viewBox],
  );

  const nodeMap = useMemo(
    () => new Map(discoveryGraph.nodes.map((n) => [n.id, n])),
    [discoveryGraph.nodes],
  );

  useEffect(() => {
    if (!hoveredId) {
      setRippleElapsed(0);
      edgeHopRef.current = new Map();
      return;
    }
    edgeHopRef.current = edgeHopDistances(hoveredId, discoveryGraph.edges);
    rippleStartRef.current = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const elapsed = (now - rippleStartRef.current) / 1000;
      setRippleElapsed(elapsed);
      if (elapsed < 2.8) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hoveredId, discoveryGraph.edges]);

  const animateTo = useCallback(
    (target: ViewBox, duration = MOTION.camera) => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current);
      if (zoomInertiaRef.current) cancelAnimationFrame(zoomInertiaRef.current);
      const start = viewBoxRef.current;
      const t0 = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - t, 5);
        const next = lerpViewBox(start, target, eased);
        applyViewBox(next);
        if (t < 1) animRef.current = requestAnimationFrame(step);
      };
      animRef.current = requestAnimationFrame(step);
    },
    [applyViewBox],
  );

  const stopInertia = useCallback(() => {
    if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current);
    inertiaRef.current = null;
  }, []);

  const startInertia = useCallback(() => {
    stopInertia();
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    let { vx, vy } = velocityRef.current;

    const step = () => {
      vx *= 0.91;
      vy *= 0.91;
      velocityRef.current = { vx, vy };
      if (Math.hypot(vx, vy) < 0.4) {
        stopInertia();
        return;
      }
      applyViewBox(
        panViewBox(viewBoxRef.current, vx, vy, rect.width, rect.height),
      );
      inertiaRef.current = requestAnimationFrame(step);
    };
    inertiaRef.current = requestAnimationFrame(step);
  }, [applyViewBox, stopInertia]);

  const returnToUniverse = useCallback(() => {
    animateTo(primaryViewBox, MOTION.camera - 100);
  }, [animateTo, primaryViewBox]);

  const springToAnchor = useCallback(() => {
    if (!touchMode) return;
    animateTo(primaryViewBox, MOBILE_SPRING_MS);
  }, [touchMode, animateTo, primaryViewBox]);

  const zoomToNode = useCallback(
    (node: GraphNode) => {
      const span = celestialFocusSpan(node.level);
      animateTo(viewBoxForNode(node.x, node.y, span), MOTION.camera - 500);
    },
    [animateTo],
  );

  const focusHandledRef = useRef<string | null>(null);

  useEffect(() => {
    if (!focusNodeId || !discoveryAwake || !enabled) return;
    if (focusHandledRef.current === focusNodeId) return;
    const node = nodes.find((n) => n.id === focusNodeId);
    if (!node) return;
    focusHandledRef.current = focusNodeId;
    if (touchMode) {
      onNodeHover(node.id);
      return;
    }
    zoomToNode(node);
    onNodeHover(node.id);
  }, [focusNodeId, discoveryAwake, enabled, nodes, zoomToNode, onNodeHover, touchMode]);

  useEffect(() => {
    if (!sessionActive) focusHandledRef.current = null;
  }, [sessionActive]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!enabled || touchMode) return;
      e.preventDefault();
      onVisitorEngage?.();
      stopInertia();
      if (zoomInertiaRef.current) cancelAnimationFrame(zoomInertiaRef.current);

      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const impulse = e.deltaY < 0 ? 0.045 : -0.045;
      zoomVelocityRef.current += impulse;

      const step = () => {
        const vz = zoomVelocityRef.current;
        if (Math.abs(vz) < 0.0008) {
          zoomVelocityRef.current = 0;
          zoomInertiaRef.current = null;
          return;
        }
        const factor = 1 + vz;
        zoomVelocityRef.current *= 0.88;
        applyViewBox(
          zoomAtPoint(viewBoxRef.current, factor, cx, cy, rect.width, rect.height),
        );
        zoomInertiaRef.current = requestAnimationFrame(step);
      };
      zoomInertiaRef.current = requestAnimationFrame(step);
    },
    [enabled, applyViewBox, stopInertia, onVisitorEngage, touchMode],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [enabled, handleWheel]);

  const trackPointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        onAttention?.(
          (clientX - rect.left) / rect.width,
          (clientY - rect.top) / rect.height,
        );
      }
      const last = lastPointerRef.current;
      if (last) {
        pointerTravelRef.current += Math.hypot(clientX - last.x, clientY - last.y);
        if (pointerTravelRef.current >= WONDER_ARRIVAL.pointerEngagePx) {
          onVisitorEngage?.();
        }
      }
      lastPointerRef.current = { x: clientX, y: clientY };
    },
    [onAttention, onVisitorEngage],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled || e.button !== 0) return;
      if ((e.target as Element).closest('[role="button"]')) return;

      trackPointer(e.clientX, e.clientY);
      stopInertia();
      if (animRef.current) cancelAnimationFrame(animRef.current);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = {
        x: e.clientX,
        y: e.clientY,
        startX: e.clientX,
        startY: e.clientY,
        moved: false,
      };
      velocityRef.current = { vx: 0, vy: 0 };
      setIsDragging(true);
    },
    [enabled, stopInertia, trackPointer],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return;
      trackPointer(e.clientX, e.clientY);
      if (!dragRef.current) return;

      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;
      const totalDx = e.clientX - dragRef.current.startX;
      const totalDy = e.clientY - dragRef.current.startY;
      if (Math.hypot(totalDx, totalDy) > 5) {
        dragRef.current.moved = true;
        onVisitorEngage?.();
      }

      if (!dragRef.current.moved) return;

      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();

      if (touchMode) {
        applyViewBox(
          viewBoxWithMobileParallax(
            primaryViewBox,
            {
              px: totalDx * MOBILE_PARALLAX_DRAG,
              py: totalDy * MOBILE_PARALLAX_DRAG,
            },
            rect.width,
            rect.height,
          ),
          { persist: false },
        );
        dragRef.current.x = e.clientX;
        dragRef.current.y = e.clientY;
        return;
      }

      velocityRef.current = {
        vx: dx * 0.85,
        vy: dy * 0.85,
      };

      applyViewBox(
        panViewBox(viewBoxRef.current, dx, dy, rect.width, rect.height),
      );
      dragRef.current.x = e.clientX;
      dragRef.current.y = e.clientY;
    },
    [enabled, applyViewBox, trackPointer, onVisitorEngage, touchMode, primaryViewBox],
  );

  const handlePointerUp = useCallback(() => {
    const moved = dragRef.current?.moved ?? false;
    dragRef.current = null;
    setIsDragging(false);
    if (touchMode) {
      if (moved) springToAnchor();
      else if (hoveredId && !skipHoverClearRef.current) {
        onNodeHover(null);
        springToAnchor();
      }
      skipHoverClearRef.current = false;
      return;
    }
    if (moved) startInertia();
    else if (hoveredId && !skipHoverClearRef.current) {
      onNodeHover(null);
    }
    skipHoverClearRef.current = false;
  }, [startInertia, touchMode, hoveredId, onNodeHover, springToAnchor]);

  const dormantMul = discoveryAwake ? 1 : stableLayout ? 1 : 0.22 + reveal * 0.78;
  const edgeAwaken = edgePresence(awakeningProgress);
  const ringOpacity = (stableLayout ? 0.05 : 0.02 + reveal * 0.06) * edgeAwaken;
  const interactionEnabled = enabled && !inReveal;
  const hoveredPos = hoveredId ? nodeMap.get(hoveredId) : null;

  const neighborIds = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    const peers = new Set<string>();
    for (const edge of discoveryGraph.edges) {
      if (edge.from === hoveredId) peers.add(edge.to);
      if (edge.to === hoveredId) peers.add(edge.from);
    }
    return peers;
  }, [hoveredId, discoveryGraph.edges]);

  const hoveredNeighbors = useMemo(
    () =>
      hoveredId
        ? getConstellationNeighbors(
            hoveredId,
            discoveryGraph.edges,
            nodeMap,
            4,
          )
        : [],
    [hoveredId, discoveryGraph.edges, nodeMap],
  );

  useConstellationCursorDrift(
    interactionEnabled && discoveryAwake && !isDragging && !touchMode,
    containerRef,
    driftGroupRef,
  );

  const activateNode = useCallback(
    (node: GraphNode) => {
      if (!interactionEnabled || navigatingRef.current) return;
      if (touchMode) {
        navigatingRef.current = true;
        onNodeClick(node);
        navigatingRef.current = false;
        return;
      }
      zoomToNode(node);
      navigatingRef.current = true;
      window.setTimeout(() => {
        onNodeClick(node);
        navigatingRef.current = false;
      }, MOTION.camera - 260);
    },
    [interactionEnabled, onNodeClick, zoomToNode, touchMode],
  );

  const handleNodeActivate = useCallback(
    (node: GraphNode) => {
      if (!touchMode) {
        activateNode(node);
        return;
      }
      skipHoverClearRef.current = true;
      onNodeHover(node.id);
      onVisitorEngage?.();
      springToAnchor();
    },
    [touchMode, activateNode, onNodeHover, onVisitorEngage, springToAnchor],
  );

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0 touch-none select-none",
          interactionEnabled &&
            (isDragging
              ? "cursor-grabbing"
              : wonderEngaged
                ? "cursor-grab"
                : "cursor-default"),
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <svg
          className="constellation-graph h-full w-full"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          preserveAspectRatio="xMidYMid meet"
          aria-label="Map of connected ideas across Living Terrain"
          shapeRendering="geometricPrecision"
          textRendering="optimizeLegibility"
        >
          <defs>
            <radialGradient id="celestial-halo-warm" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffaf2" stopOpacity="0.42" />
              <stop offset="38%" stopColor="#f0e8dc" stopOpacity="0.14" />
              <stop offset="72%" stopColor="#c8d0e0" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#8090a8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="celestial-halo-cool" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f8f6f2" stopOpacity="0.36" />
              <stop offset="45%" stopColor="#e0e4ec" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#687888" stopOpacity="0" />
            </radialGradient>
            <filter id="halo-origin" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="4.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
              </feMerge>
            </filter>
            <filter id="halo-constellation" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="2.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
              </feMerge>
            </filter>
            <filter id="halo-supporting" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
              </feMerge>
            </filter>
            <filter id="halo-observation" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="0.45" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
              </feMerge>
            </filter>
            <filter id="core-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${UNIVERSE_CENTER} ${UNIVERSE_CENTER}`}
              to={`1.15 ${UNIVERSE_CENTER} ${UNIVERSE_CENTER}`}
              dur="1416s"
              repeatCount="indefinite"
            />
          <g ref={driftGroupRef} className="constellation-drift constellation-drift--cursor">
          <ConstellationDriftParticles
            viewBoxW={viewBox.w}
            awake={discoveryAwake}
          />

          {/* Concept ring — architecture visible as the universe assembles */}
          {(stableLayout || zoom < 0.75 || reveal > 0) && (
            <circle
              cx={UNIVERSE_CENTER}
              cy={UNIVERSE_CENTER}
              r={780}
              fill="none"
              stroke="#788898"
              strokeWidth={viewBox.w / 14000}
              opacity={ringOpacity}
            />
          )}

          {visibleEdges.map((edge, edgeIndex) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;

            const isConnected =
              hoveredId === edge.from || hoveredId === edge.to;
            const isNearby =
              !!hoveredPos &&
              (Math.hypot(from.x - hoveredPos.x, from.y - hoveredPos.y) <
                EDGE_PROXIMITY ||
                Math.hypot(to.x - hoveredPos.x, to.y - hoveredPos.y) <
                  EDGE_PROXIMITY);
            const isHighlighted = isConnected || isNearby;
            const tier = EDGE_TIER[edge.tier];
            const sw = (viewBox.w / 9000) * tier.widthMul;
            const isPrimaryRing =
              edge.tier === "primary" &&
              (from.kind === "chamber" || to.kind === "chamber");

            let opacity = tier.baseOpacity * dormantMul * edgeAwaken;
            const ripple = rippleBoost(
              edgeHopRef.current.get(edgeKey(edge)),
              rippleElapsed,
            );
            if (isHighlighted) {
              opacity = Math.min(
                0.72,
                opacity + (isConnected ? 0.28 : 0.14),
              );
            }
            if (ripple > 0) {
              opacity = Math.min(0.68, opacity + ripple);
            }

            const edgeReveal = inReveal
              ? isPrimaryRing
                ? Math.max(
                    0,
                    Math.min(
                      1,
                      (reveal - edgeIndex * 0.045) / 0.55,
                    ),
                  )
                : reveal * 0.85
              : 1;

            if (inReveal && edgeReveal <= 0) return null;

            return (
              <CinematicEdge
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isHighlighted || ripple > 0.08 ? "#c8d4dc" : tier.color}
                strokeWidth={isHighlighted || ripple > 0.08 ? sw * 1.15 : sw}
                strokeDasharray={tier.dash}
                opacity={opacity * edgeReveal}
                reveal={edgeReveal}
                hoverTransition={EDGE_HOVER_TRANSITION}
              />
            );
          })}

          <AmbientEdgePulses
            edges={visibleEdges}
            nodeMap={nodeMap}
            viewBoxW={viewBox.w}
            enabled={interactionEnabled && discoveryAwake && !hoveredId && awakeningProgress > 0.48}
          />

          {visibleNodes.map((node) => (
            <ConstellationNode
              key={node.id}
              node={node}
              enabled={interactionEnabled}
              viewBoxW={viewBox.w}
              discoveryAwake={discoveryAwake}
              revealProgress={reveal}
              awakeningProgress={awakeningProgress}
              chamberLabelPresence={chamberLabelPresence}
              wonderEngaged={wonderEngaged}
              conceptIndex={conceptOrder.get(node.id) ?? 0}
              conceptCount={conceptOrder.size}
              isHovered={hoveredId === node.id}
              isNearFocus={
                !!hoveredId && hoveredId !== node.id && neighborIds.has(node.id)
              }
              isExplored={exploredIds?.has(node.id) ?? false}
              touchMode={touchMode}
              onClick={() => handleNodeActivate(node)}
              onHover={(hover) => {
                if (touchMode) return;
                onNodeHover(hover ? node.id : null);
              }}
              dragRef={dragRef}
            />
          ))}
          </g>
          </g>
        </svg>
      </div>

      {/* Minimap — desktop only */}
      {sessionActive && discoveryAwake && showChrome && !touchMode && (
        <ConstellationMinimap
          nodes={discoveryGraph.nodes}
          viewBox={viewBox}
          onNavigate={(vb) => animateTo(vb, MOTION.camera - 700)}
        />
      )}

      {interactionEnabled && discoveryAwake && showChrome && showUniverseBtn && !touchMode && (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: fade.ease }}
          onClick={returnToUniverse}
          className={cn(
            "absolute left-1/2 top-5 z-20 -translate-x-1/2 border-b pb-1 font-heading tracking-[0.02em] transition-colors duration-700 touch-manipulation",
            comfortableMode
              ? "min-h-11 px-3 text-[0.875rem]"
              : "text-[0.8125rem]",
            showUniverseBtn
              ? "border-forest-light/30 text-ivory/58 hover:border-forest-light/45 hover:text-ivory/82"
              : "border-white/8 text-ivory/24 hover:border-white/14 hover:text-ivory/48",
          )}
          style={{ top: "max(1.25rem, env(safe-area-inset-top))" }}
        >
          Return to the whole sky
        </motion.button>
      )}

      {/* Poetic hover — desktop; mobile reveal card below */}
      <AnimatePresence>
        {interactionEnabled &&
          hoveredNode &&
          showChrome &&
          wonderEngaged &&
          !touchMode && (
          <motion.div
            key={hoveredNode.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.8, ease: fade.ease }}
            className="pointer-events-none absolute left-1/2 z-20 max-w-md -translate-x-1/2 px-5 text-center sm:px-6"
            style={{ bottom: "max(5rem, calc(env(safe-area-inset-bottom) + 4rem))" }}
          >
            <p className="type-chamber text-[0.5625rem] text-ivory/22">
              {kindRealm[hoveredNode.kind]}
            </p>
            <p className="mt-3 font-heading text-lg text-ivory/72">
              {hoveredNode.label}
            </p>
            <p className="mt-3 text-sm italic leading-relaxed text-ivory/40">
              {whisperForNode(hoveredNode)}
            </p>
            <ConstellationBondHint
              neighbors={hoveredNeighbors}
              className="mt-4"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile reveal card — anchored above browser chrome */}
      <AnimatePresence>
        {touchMode && interactionEnabled && hoveredNode && showChrome && (
          <motion.div
            key={hoveredNode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.55, ease: fade.ease }}
            className="absolute inset-x-0 z-30 px-4"
            style={{
              bottom: "max(5.5rem, calc(env(safe-area-inset-bottom) + 4.25rem))",
            }}
          >
            <div className="mx-auto max-w-sm rounded-sm border border-ivory/12 bg-[color-mix(in_srgb,#06080c_90%,transparent)] px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
              <p className="font-heading text-[1.0625rem] leading-snug text-ivory/84">
                {hoveredNode.label}
              </p>
              {whisperForNode(hoveredNode) && (
                <p className="mt-2.5 text-[0.875rem] italic leading-relaxed text-ivory/44">
                  {whisperForNode(hoveredNode)}
                </p>
              )}
              <ConstellationBondHint
                neighbors={hoveredNeighbors}
                className="mt-3 border-t border-ivory/8 pt-3"
              />
              <button
                type="button"
                onClick={() => activateNode(hoveredNode)}
                className="mt-4 min-h-11 w-full touch-manipulation border-b border-forest-light/35 pb-1 font-heading text-[0.8125rem] tracking-[0.04em] text-ivory/68 transition-colors duration-500 active:text-ivory/92"
              >
                Continue deeper
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile exploration hint */}
      <AnimatePresence>
        {touchMode &&
          interactionEnabled &&
          discoveryAwake &&
          showChrome &&
          wonderEngaged &&
          !hoveredId && (
            <motion.p
              key="touch-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: fade.ease, delay: 1.2 }}
              className="pointer-events-none absolute inset-x-0 z-20 px-8 text-center font-heading text-[0.8125rem] italic text-ivory/26"
              style={{
                bottom: "max(2.25rem, calc(env(safe-area-inset-bottom) + 1.5rem))",
              }}
            >
              Touch a point of light.
            </motion.p>
          )}
      </AnimatePresence>
    </div>
  );
}

function CinematicEdge({
  x1,
  y1,
  x2,
  y2,
  stroke,
  strokeWidth,
  strokeDasharray,
  opacity,
  reveal,
  hoverTransition,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
  opacity: number;
  reveal: number;
  hoverTransition?: string;
}) {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const transitionStyle = hoverTransition ? { transition: hoverTransition } : undefined;

  if (strokeDasharray) {
    return (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        opacity={opacity}
        style={transitionStyle}
      />
    );
  }

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={length}
      strokeDashoffset={length * (1 - reveal)}
      opacity={opacity}
      style={transitionStyle}
    />
  );
}

function ConstellationNode({
  node,
  enabled,
  viewBoxW,
  discoveryAwake,
  revealProgress,
  awakeningProgress,
  chamberLabelPresence,
  wonderEngaged,
  conceptIndex,
  conceptCount,
  isHovered,
  isNearFocus = false,
  isExplored,
  touchMode = false,
  onClick,
  onHover,
  dragRef,
}: {
  node: GraphNode;
  enabled: boolean;
  viewBoxW: number;
  discoveryAwake: boolean;
  revealProgress: number;
  awakeningProgress: number;
  chamberLabelPresence: number;
  wonderEngaged: boolean;
  conceptIndex: number;
  conceptCount: number;
  isHovered: boolean;
  isNearFocus?: boolean;
  isExplored: boolean;
  touchMode?: boolean;
  onClick: () => void;
  onHover: (hover: boolean) => void;
  dragRef: React.RefObject<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>;
}) {
  const isChamber = node.kind === "chamber";
  const isConcept = node.kind === "concept";
  const inReveal = revealProgress < 1;
  const body = celestialStyleFor(node);

  const conceptReveal =
    isConcept && inReveal
      ? Math.max(
          0,
          Math.min(
            1,
            (revealProgress - (conceptIndex / Math.max(conceptCount, 1)) * 0.28) /
              0.48,
          ),
        )
      : isConcept
        ? conceptPresence(awakeningProgress, conceptIndex, conceptCount)
        : 1;

  const presenceMul = isChamber
    ? chamberPresence(awakeningProgress)
    : isConcept
      ? conceptReveal
      : Math.min(1, awakeningProgress * 1.15);

  const r = nodeRadius(node, viewBoxW, touchMode);
  const hoverScale =
    isHovered && (wonderEngaged || touchMode)
      ? body.hoverScale
      : isNearFocus
        ? 1.06
        : 1;
  const strokeW = viewBoxW / 4800;

  const groupOpacity =
    celestialGroupOpacity({
      level: node.level,
      discoveryAwake,
      isHovered: isHovered || isNearFocus,
      isExplored,
      conceptReveal: isConcept ? conceptReveal : undefined,
      isChamber,
      isConcept,
      inReveal,
    }) * presenceMul * (isNearFocus && !isHovered ? 1.12 : 1);

  const showLabel =
    !touchMode &&
    (isChamber
      ? chamberLabelPresence > 0.08 && (isHovered || chamberLabelPresence > 0.55)
      : shouldShowCelestialLabel({
          level: node.level,
          discoveryAwake,
          isHovered,
          isExplored,
          conceptReveal: isConcept ? conceptReveal : undefined,
          isConcept,
        }));

  const labelOp = isHovered
    ? 0.82
    : node.level <= 2
      ? 0.52 * chamberLabelPresence
      : isExplored
        ? 0.48
        : 0.36;

  const fontSize = celestialLabelSize(node, viewBoxW);
  const color = kindColors[node.kind];
  const warmAccent = kindWarmAccent[node.kind];
  const labelOffset = celestialLabelOffset(r, node.level);

  if (isConcept && presenceMul <= 0.02) return null;
  if (isChamber && presenceMul <= 0.02) return null;

  const haloBoost = isHovered ? 1.28 : isNearFocus ? 1.12 : 1;
  const haloOpacity = celestialGlowOpacity(body, isHovered, isExplored) * haloBoost;

  return (
    <g
      role="button"
      tabIndex={enabled ? 0 : -1}
      aria-label={`${node.label}${node.sublabel ? ` — ${node.sublabel}` : ""}`}
      transform={`translate(${node.x} ${node.y})`}
      style={{
        opacity: groupOpacity,
        outline: "none",
        pointerEvents: enabled ? "auto" : "none",
        cursor: enabled ? (wonderEngaged ? "pointer" : "default") : "default",
        transition: ARRIVAL_TRANSITION,
      }}
      onMouseEnter={() => {
        if (!touchMode) onHover(true);
      }}
      onMouseLeave={() => {
        if (!touchMode) onHover(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (dragRef.current?.moved) return;
        onClick();
      }}
      onKeyDown={(e) => {
        if (!enabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <g
        style={{
          transform: `scale(${hoverScale})`,
          transformBox: "fill-box",
          transformOrigin: "center",
          transition: HOVER_TRANSITION,
        }}
      >
        {touchMode && enabled && (
          <circle
            cx={0}
            cy={0}
            r={Math.max(r * 3.4, viewBoxW * 0.018)}
            fill="transparent"
            stroke="none"
            pointerEvents="all"
          />
        )}
        {isChamber && (
          <>
            <circle
              cx={0}
              cy={0}
              r={r * 6.4}
              fill="url(#celestial-halo-warm)"
              opacity={haloOpacity * 0.28}
              filter="url(#halo-origin)"
              style={{ transition: HOVER_TRANSITION }}
            >
              {!isHovered && (
                <animate
                  attributeName="opacity"
                  values={`${haloOpacity * 0.2};${haloOpacity * 0.34};${haloOpacity * 0.2}`}
                  dur="24s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
            <circle
              cx={0}
              cy={0}
              r={r * 3.8}
              fill="none"
              stroke="#e8e0d4"
              strokeWidth={strokeW * 0.45}
              opacity={isHovered ? 0.18 : 0.1}
              style={{ transition: HOVER_TRANSITION }}
            />
          </>
        )}

        <circle
          cx={0}
          cy={0}
          r={r * body.haloMul}
          fill={isChamber ? "url(#celestial-halo-warm)" : "url(#celestial-halo-cool)"}
          opacity={haloOpacity * (isChamber ? 0.38 : 0.24)}
          filter={`url(#${body.filterId})`}
          style={{ transition: HOVER_TRANSITION }}
        />

        {isExplored && !isHovered && (
          <circle
            cx={0}
            cy={0}
            r={r * 1.85}
            fill="none"
            stroke="#d4bc8a"
            strokeWidth={strokeW * 0.35}
            opacity={0.22}
            style={{ transition: HOVER_TRANSITION }}
          />
        )}

        <NodeShapeGlyph
          shape={node.shape}
          x={0}
          y={0}
          r={r}
          color={color}
          warmAccent={warmAccent}
          strokeW={strokeW}
          isFocus={isHovered}
          level={node.level}
          pulseId={node.id}
          body={body}
          breathe={isChamber}
        />

        {showLabel && (
          <text
            x={0}
            y={labelOffset}
            textAnchor="middle"
            fill={node.level <= 2 ? "#e8e4dc" : "#c8ccd4"}
            opacity={labelOp}
            stroke={body.labelStroke ? "#0a0c0f" : "none"}
            strokeWidth={body.labelStroke ? viewBoxW / 7500 : 0}
            paintOrder="stroke fill"
            style={{
              fontSize,
              fontWeight: body.fontWeight,
              letterSpacing: body.letterSpacing,
              transition: LABEL_TRANSITION,
            }}
          >
            {node.label.length > 48 ? `${node.label.slice(0, 46)}…` : node.label}
          </text>
        )}
      </g>
    </g>
  );
}

function NodeShapeGlyph({
  shape,
  x,
  y,
  r,
  color: _color,
  warmAccent,
  strokeW,
  isFocus,
  level,
  pulseId = "node",
  body,
  breathe = false,
}: {
  shape: NodeShape;
  x: number;
  y: number;
  r: number;
  color: string;
  warmAccent: string;
  strokeW: number;
  isFocus: boolean;
  level: 1 | 2 | 3 | 4;
  pulseId?: string;
  body: CelestialBodyStyle;
  breathe?: boolean;
}) {
  const coreR =
    r *
    (level === 1 ? 0.24 : level === 2 ? 0.28 : level === 3 ? 0.34 : 0.4);
  const { durScale, delay } = pulseOffset(pulseId);
  const breatheDur = `${(body.pulseSec * durScale).toFixed(1)}s`;
  const breatheHalo = r * body.haloMul * 0.38;

  const breatheRing =
    breathe ? (
      <circle cx={x} cy={y} r={breatheHalo} fill="url(#celestial-halo-warm)" opacity={0}>
        <animate
          attributeName="r"
          values={`${breatheHalo * 0.94};${breatheHalo * 1.05};${breatheHalo * 0.94}`}
          dur={breatheDur}
          begin={`${delay}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values={body.pulseOpacity}
          dur={breatheDur}
          begin={`${delay}s`}
          repeatCount="indefinite"
        />
      </circle>
    ) : null;

  const core = (
    <StellarCore
      x={x}
      y={y}
      coreR={coreR}
      isFocus={isFocus}
      level={level}
      warmAccent={warmAccent}
    />
  );

  if (body.renderAsStar) {
    return (
      <>
        {breatheRing}
        <polygon
          points={starPoints(x, y, r * 1.1, r * 0.38)}
          fill="none"
          stroke="#c8d0dc"
          strokeWidth={strokeW * 0.6}
          opacity={isFocus ? 0.28 : 0.14}
        />
        {core}
      </>
    );
  }

  if (shape === "sun") {
    return (
      <>
        {breatheRing}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (Math.PI / 4) * i;
          return (
            <line
              key={i}
              x1={x + Math.cos(a) * r * 1.05}
              y1={y + Math.sin(a) * r * 1.05}
              x2={x + Math.cos(a) * r * 2.1}
              y2={y + Math.sin(a) * r * 2.1}
              stroke="#e8e0d4"
              strokeWidth={strokeW * 0.65}
              strokeLinecap="round"
              opacity={isFocus ? 0.32 : 0.18}
            />
          );
        })}
        <circle
          cx={x}
          cy={y}
          r={r * 2.1}
          fill="none"
          stroke="#d8dce4"
          strokeWidth={strokeW * 0.9}
          opacity={0.14}
        />
        {core}
      </>
    );
  }

  if (shape === "hexagon") {
    return (
      <>
        {breatheRing}
        <polygon
          points={hexPoints(x, y, r * 1.05)}
          fill="none"
          stroke="#b8c0c8"
          strokeWidth={strokeW * 0.75}
          opacity={isFocus ? 0.22 : 0.1}
        />
        {core}
      </>
    );
  }

  if (shape === "book") {
    const w = r * 1.65;
    const h = r * 1.15;
    return (
      <>
        {breatheRing}
        <rect
          x={x - w / 2}
          y={y - h / 2}
          width={w}
          height={h}
          rx={r * 0.1}
          fill="none"
          stroke="#b8c0c8"
          strokeWidth={strokeW * 0.7}
          opacity={isFocus ? 0.24 : 0.12}
        />
        {core}
      </>
    );
  }

  if (shape === "diamond") {
    return (
      <>
        {breatheRing}
        <polygon
          points={diamondPoints(x, y, r * 0.92)}
          fill="none"
          stroke="#b8c0c8"
          strokeWidth={strokeW * 0.65}
          opacity={isFocus ? 0.22 : 0.11}
        />
        {core}
      </>
    );
  }

  if (shape === "triangle") {
    return (
      <>
        {breatheRing}
        <polygon
          points={trianglePoints(x, y, r * 0.92)}
          fill="none"
          stroke="#b8c0c8"
          strokeWidth={strokeW * 0.65}
          opacity={isFocus ? 0.22 : 0.11}
        />
        {core}
      </>
    );
  }

  if (shape === "square") {
    const s = r * 1.25;
    return (
      <>
        {breatheRing}
        <rect
          x={x - s / 2}
          y={y - s / 2}
          width={s}
          height={s}
          rx={r * 0.06}
          fill="none"
          stroke="#b8c0c8"
          strokeWidth={strokeW * 0.65}
          opacity={isFocus ? 0.22 : 0.11}
        />
        {core}
      </>
    );
  }

  return (
    <>
      {breatheRing}
      <circle
        cx={x}
        cy={y}
        r={r * 0.88}
        fill="none"
        stroke="#b8c0c8"
        strokeWidth={strokeW * 0.6}
        opacity={isFocus ? 0.2 : 0.1}
      />
      {core}
    </>
  );
}

function StellarCore({
  x,
  y,
  coreR,
  isFocus,
  level,
  warmAccent,
}: {
  x: number;
  y: number;
  coreR: number;
  isFocus: boolean;
  level: 1 | 2 | 3 | 4;
  warmAccent: string;
}) {
  const bloom = level <= 2 ? 2.8 : level === 3 ? 2.2 : 1.8;
  const midBloom = level <= 2 ? 1.35 : 1.15;
  const haloFilter =
    level === 1
      ? "halo-origin"
      : level === 2
        ? "halo-constellation"
        : level === 3
          ? "halo-supporting"
          : "halo-observation";

  return (
    <>
      <circle
        cx={x}
        cy={y}
        r={coreR * bloom}
        fill="url(#celestial-halo-cool)"
        opacity={isFocus ? 0.32 : 0.1}
        filter={`url(#${haloFilter})`}
        style={{ transition: "opacity 1.8s cubic-bezier(0.45, 0.05, 0.55, 0.95)" }}
      />
      <circle
        cx={x}
        cy={y}
        r={coreR * midBloom}
        fill="#faf6ee"
        opacity={isFocus ? 0.38 : 0.14}
        filter="url(#core-glow)"
        style={{ transition: "opacity 1.8s cubic-bezier(0.45, 0.05, 0.55, 0.95)" }}
      />
      <circle
        cx={x}
        cy={y}
        r={coreR * 0.72}
        fill={warmAccent}
        opacity={isFocus ? 0.26 : 0.08}
        filter="url(#core-glow)"
        style={{ transition: "opacity 1.8s cubic-bezier(0.45, 0.05, 0.55, 0.95)" }}
      />
      <circle
        cx={x}
        cy={y}
        r={coreR}
        fill="#ffffff"
        opacity={isFocus ? 1 : 0.88}
        filter="url(#core-glow)"
        style={{ transition: "opacity 1.4s cubic-bezier(0.45, 0.05, 0.55, 0.95)" }}
      />
    </>
  );
}

function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return pts.join(" ");
}

function trianglePoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 3; i++) {
    const a = ((Math.PI * 2) / 3) * i - Math.PI / 2;
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return pts.join(" ");
}

function diamondPoints(cx: number, cy: number, r: number): string {
  return `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
}

function starPoints(cx: number, cy: number, outerR: number, innerR: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? outerR : innerR;
    pts.push(`${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`);
  }
  return pts.join(" ");
}

function ConstellationMinimap({
  nodes,
  viewBox,
  onNavigate,
}: {
  nodes: GraphNode[];
  viewBox: ViewBox;
  onNavigate: (vb: ViewBox) => void;
}) {
  const minimapRef = useRef<SVGSVGElement>(null);
  const size = 120;
  const pad = 6;

  const scale = (size - pad * 2) / UNIVERSE_SIZE;

  const vx = pad + viewBox.x * scale;
  const vy = pad + viewBox.y * scale;
  const vw = viewBox.w * scale;
  const vh = viewBox.h * scale;

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = minimapRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = e.clientX - rect.left - pad;
    const my = e.clientY - rect.top - pad;
    const wx = mx / scale;
    const wy = my / scale;

    onNavigate({
      x: wx - viewBox.w / 2,
      y: wy - viewBox.h / 2,
      w: viewBox.w,
      h: viewBox.h,
    });
  };

  return (
    <div className="absolute bottom-6 left-5 z-20 hidden sm:block">
      <p className="type-chamber mb-2 text-[0.5625rem] text-ivory/18">
        Orientation
      </p>
      <svg
        ref={minimapRef}
        width={size}
        height={size}
        className="cursor-pointer opacity-55 transition-opacity duration-[1.4s] hover:opacity-75"
        onClick={handleClick}
        aria-label="Orientation sketch — touch to wander"
      >
        <rect
          x={pad}
          y={pad}
          width={size - pad * 2}
          height={size - pad * 2}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={0.05}
          strokeWidth={0.5}
        />
        {nodes.map((n) => {
          const dotR =
            n.level === 1 ? 3.2 : n.level === 2 ? 2.1 : n.level === 3 ? 1.1 : 0.55;
          return (
            <circle
              key={n.id}
              cx={pad + n.x * scale}
              cy={pad + n.y * scale}
              r={dotR}
              fill={kindColors[n.kind]}
              opacity={n.level === 1 ? 1 : n.level === 2 ? 0.92 : n.level === 3 ? 0.65 : 0.45}
            />
          );
        })}
        <rect
          x={vx}
          y={vy}
          width={Math.max(vw, 3)}
          height={Math.max(vh, 3)}
          fill="none"
          stroke="#788898"
          strokeWidth={1}
          opacity={0.75}
        />
      </svg>
    </div>
  );
}

export { kindColors, kindRealm };

function ConstellationDriftParticles({
  viewBoxW,
  awake,
}: {
  viewBoxW: number;
  awake: boolean;
}) {
  const particles = useMemo(() => {
    const items: Array<{
      id: number;
      x: number;
      y: number;
      delay: number;
      size: number;
      twinkle: boolean;
    }> = [];
    for (let i = 0; i < 26; i++) {
      const angle = (i * 2.399963) % (Math.PI * 2);
      const dist = 320 + (i % 8) * 340;
      items.push({
        id: i,
        x: UNIVERSE_CENTER + Math.cos(angle) * dist,
        y: UNIVERSE_CENTER + Math.sin(angle) * dist,
        delay: i * 1.6,
        size: 0.9 + (i % 4) * 0.45,
        twinkle: i % 9 === 0,
      });
    }
    return items;
  }, []);

  if (!awake) return null;

  const scale = viewBoxW / 1600;

  return (
    <g aria-hidden>
      {particles.map((p) => (
        <circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r={scale * p.size}
          fill="#c8d0dc"
          className={p.twinkle ? "observatory-dust map-particle-twinkle" : "observatory-dust"}
          style={{ animationDelay: `${p.delay}s` }}
        />
      ))}
    </g>
  );
}

function AmbientEdgePulses({
  edges,
  nodeMap,
  viewBoxW,
  enabled,
}: {
  edges: GraphEdge[];
  nodeMap: Map<string, GraphNode>;
  viewBoxW: number;
  enabled: boolean;
}) {
  const pulseEdges = useMemo(
    () => edges.filter((e) => e.tier === "primary" || e.tier === "secondary").slice(0, 12),
    [edges],
  );

  if (!enabled || pulseEdges.length === 0) return null;

  const r = viewBoxW / 7000;

  return (
    <g aria-hidden opacity={0.16}>
      {pulseEdges.map((edge, i) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        if (!from || !to) return null;

        const path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
        const dur = 14 + (i % 4) * 4;

        return (
          <g key={`pulse-${edge.from}-${edge.to}`}>
            <circle r={r} fill="#c8d4dc" opacity={0}>
              <animateMotion
                dur={`${dur}s`}
                repeatCount="indefinite"
                begin={`${i * 2.8}s`}
                path={path}
              />
              <animate
                attributeName="opacity"
                values="0;0.35;0.35;0"
                keyTimes="0;0.15;0.85;1"
                dur={`${dur}s`}
                repeatCount="indefinite"
                begin={`${i * 2.8}s`}
              />
            </circle>
          </g>
        );
      })}
    </g>
  );
}
