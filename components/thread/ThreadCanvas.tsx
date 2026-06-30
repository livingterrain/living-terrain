"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GraphNode } from "@/lib/concepts/graph";
import { buildTerrainGraph } from "@/lib/concepts/graph";
import {
  lerpViewBox,
  panViewBox,
  viewBoxForNode,
  viewBoxForNodes,
  type ViewBox,
} from "@/lib/concepts/universe-viewport";
import type { ThreadPathResult } from "@/lib/relationships/thread-path";
import { MOTION } from "@/lib/atmosphere/tempo";
import {
  celestialFocusSpan,
  celestialRadius,
  celestialStyleFor,
} from "@/lib/constellation/celestial-hierarchy";

const KIND_COLOR: Record<GraphNode["kind"], string> = {
  chamber: "#f0ece4",
  concept: "#b8d4b0",
  essay: "#7a9a72",
  book: "#c4b494",
  question: "#a0b0a8",
  "field-note": "#6a8494",
  quotation: "#889898",
  observation: "#7a8a94",
};

interface ThreadCanvasProps {
  path: ThreadPathResult;
  activeSegment: number;
  segmentProgress: number;
  visitedCount: number;
  exploreMode: boolean;
  originGraphId?: string;
}

export function ThreadCanvas({
  path,
  activeSegment,
  segmentProgress,
  visitedCount,
  exploreMode,
  originGraphId,
}: ThreadCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const { nodes: allNodes } = useMemo(() => buildTerrainGraph(), []);

  const pathIds = useMemo(
    () => new Set(path.steps.map((s) => s.graphId)),
    [path.steps],
  );

  const nodeMap = useMemo(
    () => new Map(allNodes.map((n) => [n.id, n])),
    [allNodes],
  );

  const pathGraphNodes = useMemo(
    () =>
      path.steps
        .map((s) => nodeMap.get(s.graphId))
        .filter((n): n is GraphNode => Boolean(n)),
    [path.steps, nodeMap],
  );

  const [viewBox, setViewBox] = useState<ViewBox>(() =>
    pathGraphNodes[0]
      ? viewBoxForNode(pathGraphNodes[0].x, pathGraphNodes[0].y, 1400)
      : viewBoxForNodes(pathGraphNodes, 1, 1, 1.4),
  );

  const [containerSize, setContainerSize] = useState({ w: 1, h: 1 });

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

  const viewBoxRef = useRef(viewBox);
  viewBoxRef.current = viewBox;

  const animateTo = useCallback((target: ViewBox, duration = MOTION.camera) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const start = viewBoxRef.current;
    const t0 = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setViewBox(lerpViewBox(start, target, eased));
      if (t < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  }, []);

  const focusIndex = Math.min(
    path.steps.length - 1,
    Math.max(0, activeSegment + 1),
  );

  useEffect(() => {
    const focusNode = pathGraphNodes[focusIndex];
    if (!focusNode) return;
    const span = celestialFocusSpan(focusNode.level);
    animateTo(
      viewBoxForNode(focusNode.x, focusNode.y, span),
      exploreMode ? 1800 : 1500,
    );
  }, [focusIndex, pathGraphNodes, exploreMode, animateTo]);

  const revealedSegments = Math.max(0, activeSegment);

  const backgroundNodes = useMemo(
    () =>
      allNodes.filter(
        (n) =>
          n.level <= 2 ||
          pathIds.has(n.id) ||
          n.kind === "chamber" ||
          n.kind === "concept",
      ),
    [allNodes, pathIds],
  );

  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!exploreMode || e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!exploreMode || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current = { x: e.clientX, y: e.clientY };
    setViewBox((vb) =>
      panViewBox(vb, dx, dy, containerSize.w, containerSize.h),
    );
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pb-20"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ cursor: exploreMode ? "grab" : "default" }}
    >
      <svg
        className="constellation-graph constellation-drift h-full w-full"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <filter id="thread-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Faint constellation context */}
        {backgroundNodes.map((node) => {
          if (pathIds.has(node.id)) return null;
          const r = celestialRadius(node, viewBox.w);
          return (
            <circle
              key={`bg-${node.id}`}
              cx={node.x}
              cy={node.y}
              r={r}
              fill={KIND_COLOR[node.kind]}
              opacity={
                node.level === 1 ? 0.08 : node.level === 2 ? 0.06 : 0.025
              }
            />
          );
        })}

        {/* Completed thread segments */}
        {path.segments.map((segment, i) => {
          if (i > revealedSegments) return null;
          const from = nodeMap.get(segment.from.graphId);
          const to = nodeMap.get(segment.to.graphId);
          if (!from || !to) return null;

          const complete = i < revealedSegments;
          const progress = i === activeSegment ? segmentProgress : complete ? 1 : 0;
          const length = Math.hypot(to.x - from.x, to.y - from.y);
          const sw = viewBox.w / 5200;

          return (
            <g key={`seg-${i}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={segment.inGraph ? "#a8c4a0" : "#8aa890"}
                strokeWidth={sw * (segment.inGraph ? 2.2 : 1.6)}
                strokeLinecap="round"
                strokeDasharray={length}
                strokeDashoffset={length * (1 - progress)}
                opacity={0.15 + progress * 0.45}
              />
              {progress > 0 && progress < 1 && (
                <ThreadParticle
                  from={from}
                  to={to}
                  progress={progress}
                  viewBoxW={viewBox.w}
                />
              )}
            </g>
          );
        })}

        {/* Path nodes */}
        {pathGraphNodes.map((node, i) => {
          const stepIndex = path.steps.findIndex((s) => s.graphId === node.id);
          const isOrigin = node.id === originGraphId;
          const isVisited = stepIndex < visitedCount;
          const isActive = stepIndex === focusIndex;
          const isReached =
            stepIndex <= activeSegment + 1 || (isVisited && segmentProgress > 0.5);

          let opacity = 0.12;
          if (isReached) opacity = 0.55;
          if (isVisited) opacity = 0.72;
          if (isActive) opacity = 1;
          if (isOrigin && activeSegment < 0) opacity = 1;

          const r = celestialRadius(node, viewBox.w) * (isActive ? 1.12 : isOrigin ? 1.25 : 1);
          const body = celestialStyleFor(node);
          const color = KIND_COLOR[node.kind];

          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={r * body.haloMul * (isActive || isOrigin ? 0.95 : 0.75)}
                fill={color}
                opacity={opacity * (isActive ? 0.42 : isOrigin ? 0.5 : 0.28)}
                filter="url(#thread-glow)"
              >
                <animate
                  attributeName="r"
                  values={`${r * 2.4};${r * 2.9};${r * 2.4}`}
                  dur={isActive ? "4.8s" : "7s"}
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={node.x}
                cy={node.y}
                r={r}
                fill={color}
                opacity={opacity}
              />
              {(isActive || isOrigin || isVisited) && (
                <text
                  x={node.x}
                  y={node.y + r * 2.8}
                  textAnchor="middle"
                  fill="#f0ece8"
                  opacity={isActive ? 0.92 : 0.55}
                  style={{
                    fontSize: Math.max(11, viewBox.w * 0.004),
                    letterSpacing: "0.03em",
                  }}
                >
                  {node.label.length > 42
                    ? `${node.label.slice(0, 40)}…`
                    : node.label}
                </text>
              )}
              {i > 0 && isActive && (
                <text
                  x={node.x}
                  y={node.y - r * 2.4}
                  textAnchor="middle"
                  fill="#b8d4b0"
                  opacity={0.35}
                  style={{ fontSize: Math.max(14, viewBox.w * 0.005) }}
                >
                  ↓
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ThreadParticle({
  from,
  to,
  progress,
  viewBoxW,
}: {
  from: GraphNode;
  to: GraphNode;
  progress: number;
  viewBoxW: number;
}) {
  const x = from.x + (to.x - from.x) * progress;
  const y = from.y + (to.y - from.y) * progress;
  const r = viewBoxW / 4500;

  return (
    <circle cx={x} cy={y} r={r} fill="#d8e8d4" opacity={0.85}>
      <animate
        attributeName="opacity"
        values="0.5;0.9;0.5"
        dur="1.8s"
        repeatCount="indefinite"
      />
    </circle>
  );
}
