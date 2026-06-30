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
import { MOTION } from "@/lib/atmosphere/tempo";
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
  chamber: "#f0ece4",
  concept: "#b8d4b0",
  essay: "#7a9a72",
  book: "#c4b494",
  question: "#a0b0a8",
  "field-note": "#6a8494",
  quotation: "#889898",
  observation: "#7a8a94",
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

const EDGE_TIER: Record<
  EdgeTier,
  { widthMul: number; baseOpacity: number; color: string; dash?: string }
> = {
  primary: { widthMul: 2.5, baseOpacity: 0.62, color: "#a8c4a0" },
  secondary: { widthMul: 1.4, baseOpacity: 0.36, color: "#90a890" },
  emerging: { widthMul: 0.8, baseOpacity: 0.2, color: "#788878", dash: "5 8" },
};

function nodeRadius(node: GraphNode, viewBoxW: number): number {
  return celestialRadius(node, viewBoxW);
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
}: ConstellationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewBoxRef = useRef<ViewBox>(CHAMBER_INTRO_VIEW);
  const animRef = useRef<number | null>(null);
  const dragRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const inertiaRef = useRef<number | null>(null);
  const enteredSessionRef = useRef(false);
  const navigatingRef = useRef(false);
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
        1.26,
      ),
    [primaryNodes, containerSize.w, containerSize.h],
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

  const reveal = Math.max(0, Math.min(1, revealProgress));
  const inReveal = reveal < 1;

  const effectiveDiscoveryDepth = comfortableMode
    ? Math.min(discoveryDepth, 2)
    : discoveryDepth;

  const zoom = zoomLevel(viewBox);

  const applyViewBox = useCallback((next: ViewBox) => {
    viewBoxRef.current = next;
    setViewBox(next);
    onViewBoxPersist?.(next);
    const atPrimary =
      Math.abs(next.w - primaryViewBox.w) / primaryViewBox.w < 0.08 &&
      Math.abs(next.x - primaryViewBox.x) < primaryViewBox.w * 0.12;
    setShowUniverseBtn(!atPrimary && !inReveal);
  }, [primaryViewBox, inReveal, onViewBoxPersist]);

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
      return;
    }
    if (enteredSessionRef.current) return;
    enteredSessionRef.current = true;
    if (restoredViewBox && !restoredViewRef.current) {
      restoredViewRef.current = true;
      applyViewBox(restoredViewBox);
      return;
    }
    applyViewBox(CHAMBER_INTRO_VIEW);
  }, [sessionActive, applyViewBox, restoredViewBox]);

  useEffect(() => {
    if (!sessionActive || reveal >= 1) return;
    applyViewBox(mixViewBox(CHAMBER_INTRO_VIEW, primaryViewBox, reveal));
  }, [reveal, primaryViewBox, sessionActive, applyViewBox]);

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
    zoomToNode(node);
    onNodeHover(node.id);
  }, [focusNodeId, discoveryAwake, enabled, nodes, zoomToNode, onNodeHover]);

  useEffect(() => {
    if (!sessionActive) focusHandledRef.current = null;
  }, [sessionActive]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!enabled) return;
      e.preventDefault();
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
    [enabled, applyViewBox, stopInertia],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [enabled, handleWheel]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled || e.button !== 0) return;
      if ((e.target as Element).closest('[role="button"]')) return;

      stopInertia();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = { x: e.clientX, y: e.clientY, moved: false };
      velocityRef.current = { vx: 0, vy: 0 };
      setIsDragging(true);
    },
    [enabled, stopInertia],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled || !dragRef.current) return;

      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;
      if (Math.hypot(dx, dy) > 4) dragRef.current.moved = true;

      if (!dragRef.current.moved) return;

      velocityRef.current = {
        vx: dx * 0.85,
        vy: dy * 0.85,
      };

      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      applyViewBox(
        panViewBox(viewBoxRef.current, dx, dy, rect.width, rect.height),
      );
      dragRef.current.x = e.clientX;
      dragRef.current.y = e.clientY;
    },
    [enabled, applyViewBox],
  );

  const handlePointerUp = useCallback(() => {
    const moved = dragRef.current?.moved ?? false;
    dragRef.current = null;
    setIsDragging(false);
    if (moved) startInertia();
  }, [startInertia]);

  const dormantMul = discoveryAwake ? 1 : 0.22 + reveal * 0.78;
  const ringOpacity = 0.04 + reveal * 0.12;
  const interactionEnabled = enabled && !inReveal;
  const hoveredPos = hoveredId ? nodeMap.get(hoveredId) : null;

  const activateNode = useCallback(
    (node: GraphNode) => {
      if (!interactionEnabled || navigatingRef.current) return;
      zoomToNode(node);
      navigatingRef.current = true;
      window.setTimeout(() => {
        onNodeClick(node);
        navigatingRef.current = false;
      }, MOTION.camera - 260);
    },
    [interactionEnabled, onNodeClick, zoomToNode],
  );

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0 touch-none select-none",
          interactionEnabled && (isDragging ? "cursor-grabbing" : "cursor-grab"),
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
            <filter id="halo-origin" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="2.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="halo-constellation" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="halo-supporting" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="0.55" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="halo-observation" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="0.25" result="blur" />
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
          <g className="constellation-drift">
          <ConstellationDriftParticles
            viewBoxW={viewBox.w}
            awake={discoveryAwake}
          />

          {/* Concept ring — architecture visible as the universe assembles */}
          {(zoom < 0.75 || reveal > 0) && (
            <circle
              cx={UNIVERSE_CENTER}
              cy={UNIVERSE_CENTER}
              r={780}
              fill="none"
              stroke="#a8c0a0"
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

            let opacity = tier.baseOpacity * dormantMul;
            const ripple = rippleBoost(
              edgeHopRef.current.get(edgeKey(edge)),
              rippleElapsed,
            );
            if (isHighlighted) {
              opacity = Math.min(
                0.62,
                opacity + (isConnected ? 0.24 : 0.12),
              );
            }
            if (ripple > 0) {
              opacity = Math.min(0.68, opacity + ripple);
            }

            const edgeReveal = inReveal && isPrimaryRing
              ? Math.max(
                  0,
                  Math.min(
                    1,
                    (reveal - edgeIndex * 0.045) / 0.55,
                  ),
                )
              : inReveal
                ? reveal * 0.85
                : 1;

            if (inReveal && edgeReveal <= 0) return null;

            return (
              <CinematicEdge
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isHighlighted || ripple > 0.08 ? "#c4dcc0" : tier.color}
                strokeWidth={isHighlighted || ripple > 0.08 ? sw * 1.15 : sw}
                strokeDasharray={tier.dash}
                opacity={opacity * edgeReveal}
                reveal={edgeReveal}
              />
            );
          })}

          <AmbientEdgePulses
            edges={visibleEdges}
            nodeMap={nodeMap}
            viewBoxW={viewBox.w}
            enabled={interactionEnabled && discoveryAwake && !hoveredId}
          />

          {visibleNodes.map((node) => (
            <ConstellationNode
              key={node.id}
              node={node}
              enabled={interactionEnabled}
              viewBoxW={viewBox.w}
              discoveryAwake={discoveryAwake}
              revealProgress={reveal}
              conceptIndex={conceptOrder.get(node.id) ?? 0}
              conceptCount={conceptOrder.size}
              isHovered={hoveredId === node.id}
              isExplored={exploredIds?.has(node.id) ?? false}
              onClick={() => activateNode(node)}
              onHover={(hover) => onNodeHover(hover ? node.id : null)}
              dragRef={dragRef}
            />
          ))}
          </g>
          </g>
        </svg>
      </div>

      {/* Minimap */}
      {sessionActive && discoveryAwake && (
        <ConstellationMinimap
          nodes={discoveryGraph.nodes}
          viewBox={viewBox}
          onNavigate={(vb) => animateTo(vb, MOTION.camera - 700)}
        />
      )}

      {interactionEnabled && discoveryAwake && (
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
          Return to the constellation
        </motion.button>
      )}

      {/* Poetic hover — one sentence preview */}
      <AnimatePresence>
        {interactionEnabled && hoveredNode && (
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
          </motion.div>
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
}) {
  const length = Math.hypot(x2 - x1, y2 - y1);

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
    />
  );
}

function ConstellationNode({
  node,
  enabled,
  viewBoxW,
  discoveryAwake,
  revealProgress,
  conceptIndex,
  conceptCount,
  isHovered,
  isExplored,
  onClick,
  onHover,
  dragRef,
}: {
  node: GraphNode;
  enabled: boolean;
  viewBoxW: number;
  discoveryAwake: boolean;
  revealProgress: number;
  conceptIndex: number;
  conceptCount: number;
  isHovered: boolean;
  isExplored: boolean;
  onClick: () => void;
  onHover: (hover: boolean) => void;
  dragRef: React.RefObject<{ x: number; y: number; moved: boolean } | null>;
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
        ? 1
        : 0;

  const r = nodeRadius(node, viewBoxW);
  const effectiveR = r * (isHovered ? body.hoverScale : 1);
  const strokeW = viewBoxW / 4800;

  const groupOpacity = celestialGroupOpacity({
    level: node.level,
    discoveryAwake,
    isHovered,
    isExplored,
    conceptReveal: isConcept ? conceptReveal : undefined,
    isChamber,
    isConcept,
    inReveal,
  });

  const showLabel = shouldShowCelestialLabel({
    level: node.level,
    discoveryAwake,
    isHovered,
    isExplored,
    conceptReveal: isConcept ? conceptReveal : undefined,
    isConcept,
  });

  const labelOp = isHovered
    ? 0.96
    : node.level <= 2
      ? 0.82
      : isExplored
        ? 0.72
        : 0.55;

  const fontSize = celestialLabelSize(node, viewBoxW);
  const color = kindColors[node.kind];
  const labelOffset = celestialLabelOffset(effectiveR, node.level);
  const haloOpacity = celestialGlowOpacity(body, isHovered, isExplored);

  if (isConcept && inReveal && conceptReveal <= 0) return null;

  return (
    <g
      role="button"
      tabIndex={enabled ? 0 : -1}
      aria-label={`${node.label}${node.sublabel ? ` — ${node.sublabel}` : ""}`}
      style={{
        opacity: groupOpacity,
        outline: "none",
        pointerEvents: enabled ? "auto" : "none",
        cursor: enabled ? "pointer" : "default",
        transition: "opacity 1.4s cubic-bezier(0.45, 0.05, 0.55, 0.95)",
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
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
      {isChamber && (
        <>
          <circle
            cx={node.x}
            cy={node.y}
            r={effectiveR * 5.2}
            fill={color}
            opacity={haloOpacity * 0.12}
            filter={`url(#${body.filterId})`}
          />
          <circle
            cx={node.x}
            cy={node.y}
            r={effectiveR * 3.6}
            fill="none"
            stroke={color}
            strokeWidth={strokeW * 0.6}
            opacity={0.22}
          />
        </>
      )}

      <circle
        cx={node.x}
        cy={node.y}
        r={effectiveR * body.haloMul}
        fill={color}
        opacity={haloOpacity * (isChamber ? 0.55 : 0.42)}
        filter={`url(#${body.filterId})`}
      />

      <NodeShapeGlyph
        shape={node.shape}
        x={node.x}
        y={node.y}
        r={effectiveR}
        color={color}
        strokeW={strokeW}
        isFocus={isHovered}
        level={node.level}
        pulseId={node.id}
        body={body}
        breathe={body.breathe}
      />

      {isChamber && discoveryAwake && !isHovered && (
        <text
          x={node.x}
          y={node.y + labelOffset + fontSize * 1.1}
          textAnchor="middle"
          fill="#b8d4b0"
          opacity={0.42}
          style={{
            fontSize: Math.max(9, viewBoxW * 0.0028),
            letterSpacing: "0.14em",
          }}
        >
          begin here
        </text>
      )}

      {showLabel && (
        <text
          x={node.x}
          y={node.y + labelOffset}
          textAnchor="middle"
          fill={node.level <= 2 ? "#f4f2ec" : "#e4e2dc"}
          opacity={labelOp}
          stroke={body.labelStroke ? "#0a0c0f" : "none"}
          strokeWidth={body.labelStroke ? viewBoxW / 7500 : 0}
          paintOrder="stroke fill"
          style={{
            fontSize,
            fontWeight: body.fontWeight,
            letterSpacing: body.letterSpacing,
          }}
        >
          {node.label.length > 48 ? `${node.label.slice(0, 46)}…` : node.label}
        </text>
      )}
    </g>
  );
}

function NodeShapeGlyph({
  shape,
  x,
  y,
  r,
  color,
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
  strokeW: number;
  isFocus: boolean;
  level: 1 | 2 | 3 | 4;
  pulseId?: string;
  body: CelestialBodyStyle;
  breathe?: boolean;
}) {
  const coreR = r * (level === 1 ? 0.3 : level === 2 ? 0.36 : level === 3 ? 0.4 : 0.5);
  const coreOpacity = isFocus ? 1 : level <= 2 ? 0.9 : 0.75;
  const { durScale, delay } = pulseOffset(pulseId);
  const breatheDur = `${(body.pulseSec * durScale).toFixed(1)}s`;
  const breatheHalo = r * body.haloMul * 0.42;

  const breatheRing =
    breathe ? (
      <circle cx={x} cy={y} r={breatheHalo} fill={color} opacity={0}>
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

  if (body.renderAsStar) {
    return (
      <>
        {breatheRing}
        <polygon
          points={starPoints(x, y, r * 1.35, r * 0.45)}
          fill={color}
          opacity={isFocus ? 0.95 : 0.72}
        />
        <circle cx={x} cy={y} r={r * 0.22} fill="#f0ece6" opacity={coreOpacity} />
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
              x1={x + Math.cos(a) * r * 1.15}
              y1={y + Math.sin(a) * r * 1.15}
              x2={x + Math.cos(a) * r * 2.4}
              y2={y + Math.sin(a) * r * 2.4}
              stroke={color}
              strokeWidth={strokeW * 0.9}
              strokeLinecap="round"
              opacity={0.55}
            />
          );
        })}
        <circle
          cx={x}
          cy={y}
          r={r * 2.35}
          fill="none"
          stroke={color}
          strokeWidth={strokeW * 1.4}
          opacity={0.5}
        />
        <circle cx={x} cy={y} r={r} fill={color} opacity={0.96} />
        <circle cx={x} cy={y} r={coreR} fill="#faf8f2" opacity={coreOpacity} />
      </>
    );
  }

  if (shape === "hexagon") {
    return (
      <>
        {breatheRing}
        <polygon
          points={hexPoints(x, y, r * 1.08)}
          fill="none"
          stroke={color}
          strokeWidth={strokeW * 1.1}
          opacity={0.45}
        />
        <polygon points={hexPoints(x, y, r)} fill={color} opacity={0.95} />
        <circle cx={x} cy={y} r={coreR} fill="#f4f2ec" opacity={coreOpacity} />
      </>
    );
  }

  if (shape === "book") {
    const w = r * 2.1;
    const h = r * 1.45;
    return (
      <>
        {breatheRing}
        <rect
          x={x - w / 2}
          y={y - h / 2}
          width={w}
          height={h}
          rx={r * 0.12}
          fill={color}
          opacity={0.95}
        />
        <line
          x1={x - w * 0.08}
          y1={y - h / 2 + r * 0.1}
          x2={x - w * 0.08}
          y2={y + h / 2 - r * 0.1}
          stroke="#faf8f2"
          strokeWidth={strokeW * 0.7}
          opacity={0.5}
        />
        <circle cx={x + w * 0.15} cy={y} r={coreR * 0.7} fill="#f4f2ec" opacity={coreOpacity} />
      </>
    );
  }

  if (shape === "diamond") {
    return (
      <>
        {breatheRing}
        <polygon points={diamondPoints(x, y, r)} fill={color} opacity={0.94} />
        <circle cx={x} cy={y} r={coreR * 0.65} fill="#f4f2ec" opacity={coreOpacity} />
      </>
    );
  }

  if (shape === "triangle") {
    return (
      <>
        {breatheRing}
        <polygon points={trianglePoints(x, y, r)} fill={color} opacity={0.92} />
        <circle cx={x} cy={y + r * 0.12} r={coreR * 0.55} fill="#f4f2ec" opacity={coreOpacity} />
      </>
    );
  }

  if (shape === "square") {
    const s = r * 1.55;
    return (
      <>
        {breatheRing}
        <rect
          x={x - s / 2}
          y={y - s / 2}
          width={s}
          height={s}
          rx={r * 0.08}
          fill={color}
          opacity={0.9}
        />
        <circle cx={x} cy={y} r={coreR * 0.55} fill="#f4f2ec" opacity={coreOpacity} />
      </>
    );
  }

  /* circle — essays */
  return (
    <>
      {breatheRing}
      <circle cx={x} cy={y} r={r} fill={color} opacity={0.95} />
      <circle cx={x} cy={y} r={coreR} fill="#f4f2ec" opacity={coreOpacity} />
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
          stroke="#8fa88a"
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
          fill="#b8b0a4"
          className="observatory-dust"
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
    <g aria-hidden opacity={0.28}>
      {pulseEdges.map((edge, i) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        if (!from || !to) return null;

        const path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
        const dur = 14 + (i % 4) * 4;

        return (
          <g key={`pulse-${edge.from}-${edge.to}`}>
            <circle r={r} fill="#b8d4b0" opacity={0}>
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
