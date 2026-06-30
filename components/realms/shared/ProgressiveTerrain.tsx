"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { useTerrainSoundOptional } from "@/components/sound";
import { useTerrainNavigation } from "@/components/navigation";
import type { RealmPalette, ThemeHub } from "@/lib/realms/types";
import { getRealmMetaphor } from "@/lib/realms/metaphors";
import {
  buildProgressiveEcosystem,
  disclosureDepth,
  emptyDisclosure,
  frameViewBox,
  guidanceForDepth,
  lerpViewBox,
  nearbyPrimaryIds,
  visibleProgressiveNodes,
  type DisclosureState,
  type ProgressiveEcosystem,
  type ProgressiveNode,
} from "@/lib/realms/progressive-ecosystem";
import {
  initSimulation,
  readPositions,
  stepSimulation,
  syncSimulation,
} from "@/lib/realms/progressive-simulation";
import { RealmShell } from "./RealmShell";
import { RippleField } from "./metaphor-effects";
import { realmEntry, realmFade } from "./motion";

const DEFAULT_VIEW = { x: 0.06, y: 0.06, w: 0.88, h: 0.88 };
const SCALE = 100;

function toSvg(n: number): number {
  return n * SCALE;
}

export interface ProgressiveTerrainContext {
  hub: ThemeHub;
  palette: RealmPalette;
  ecosystem: ProgressiveEcosystem;
  disclosure: DisclosureState;
  hoveredId: string | null;
  positions: Map<string, { x: number; y: number }>;
  litIds: Set<string>;
}

interface ProgressiveTerrainProps {
  hub: ThemeHub;
  atmosphereVariant?: "default" | "cathedral" | "network";
  children?: (ctx: ProgressiveTerrainContext) => ReactNode;
}

function toggleId(current: string | null, id: string): string | null {
  return current === id ? null : id;
}

function litNodeIds(
  eco: ProgressiveEcosystem,
  hoveredId: string | null,
  disclosure: DisclosureState,
): Set<string> {
  const lit = new Set<string>();
  if (!hoveredId) return lit;

  lit.add(hoveredId);
  lit.add(eco.center.id);

  const node = eco.nodes.find((n) => n.id === hoveredId);
  if (!node) return lit;

  if (node.tier === "primary") {
    for (const id of nearbyPrimaryIds(eco, node.id)) lit.add(id);
    if (disclosure.primaryId === node.id) {
      for (const r of eco.relationshipsByPrimary.get(node.id) ?? []) lit.add(r.id);
    }
  }

  if (node.tier === "relationship" && node.parentId) {
    lit.add(node.parentId);
    for (const r of eco.relationshipsByPrimary.get(node.parentId) ?? []) {
      lit.add(r.id);
    }
    if (disclosure.relationshipId === node.id) {
      for (const e of eco.essaysByRelationship.get(node.id) ?? []) lit.add(e.id);
    }
  }

  if (node.tier === "essay" && node.parentId) {
    lit.add(node.parentId);
    for (const e of eco.essaysByRelationship.get(node.parentId) ?? []) {
      lit.add(e.id);
    }
    if (disclosure.essayId === node.id) {
      for (const q of eco.questionsByEssay.get(node.id) ?? []) lit.add(q.id);
    }
  }

  if (node.tier === "question" && node.parentId) {
    lit.add(node.parentId);
    for (const q of eco.questionsByEssay.get(node.parentId) ?? []) {
      lit.add(q.id);
    }
  }

  if (hoveredId === eco.center.id) {
    eco.primaries.forEach((p) => lit.add(p.id));
  }

  return lit;
}

function handleNodeClick(
  node: ProgressiveNode,
  eco: ProgressiveEcosystem,
  disclosure: DisclosureState,
  setDisclosure: (s: DisclosureState) => void,
  navigate: ReturnType<typeof useTerrainNavigation>["navigate"],
): void {
  switch (node.tier) {
    case "center":
      setDisclosure(emptyDisclosure());
      break;
    case "primary":
      setDisclosure({
        primaryId: toggleId(disclosure.primaryId, node.id),
        relationshipId: null,
        essayId: null,
      });
      break;
    case "relationship":
      setDisclosure({
        primaryId: node.primaryId ?? disclosure.primaryId,
        relationshipId: toggleId(disclosure.relationshipId, node.id),
        essayId: null,
      });
      break;
    case "essay": {
      const questions = eco.questionsByEssay.get(node.id) ?? [];
      if (questions.length === 0 && node.href) {
        navigate(node.href);
        return;
      }
      setDisclosure({
        primaryId: node.primaryId ?? disclosure.primaryId,
        relationshipId: node.parentId ?? disclosure.relationshipId,
        essayId: toggleId(disclosure.essayId, node.id),
      });
      break;
    }
    case "question":
      if (node.href) navigate(node.href);
      break;
  }
}

/** Shared progressive terrain — center, five primaries, depth earned by click */
export function ProgressiveTerrain({
  hub,
  atmosphereVariant = "default",
  children,
}: ProgressiveTerrainProps) {
  const { navigate, arriving, arrivalIntent } = useTerrainNavigation();
  const palette = hub.config.palette;
  const sound = useTerrainSoundOptional();
  const metaphor = getRealmMetaphor(hub.config.slug);

  const ecosystem = useMemo(() => buildProgressiveEcosystem(hub), [hub]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [disclosure, setDisclosure] = useState<DisclosureState>(emptyDisclosure);
  const [collapseTimer, setCollapseTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(
    () =>
      new Map(
        visibleProgressiveNodes(ecosystem, emptyDisclosure()).map((n) => [
          n.id,
          { x: n.x, y: n.y },
        ]),
      ),
  );

  const simRef = useRef(
    initSimulation(visibleProgressiveNodes(ecosystem, emptyDisclosure())),
  );
  const viewRef = useRef(DEFAULT_VIEW);
  const viewTargetRef = useRef(DEFAULT_VIEW);
  const viewAnimRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  const visibleNodes = useMemo(
    () => visibleProgressiveNodes(ecosystem, disclosure),
    [ecosystem, disclosure],
  );

  const litIds = useMemo(
    () => litNodeIds(ecosystem, hoveredId, disclosure),
    [ecosystem, hoveredId, disclosure],
  );

  const depth = disclosureDepth(disclosure);

  const animateViewTo = useCallback((target: typeof DEFAULT_VIEW) => {
    viewTargetRef.current = target;
    const t0 = performance.now();
    const from = { ...viewRef.current };

    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 1600);
      viewRef.current = lerpViewBox(from, viewTargetRef.current, t);
      if (t < 1) viewAnimRef.current = requestAnimationFrame(step);
    };
    if (viewAnimRef.current) cancelAnimationFrame(viewAnimRef.current);
    viewAnimRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    syncSimulation(simRef.current, visibleNodes);
    const target =
      depth > 0
        ? frameViewBox(visibleNodes, 0.1)
        : frameViewBox([ecosystem.center, ...ecosystem.primaries], 0.13);
    animateViewTo(target);
  }, [visibleNodes, depth, ecosystem, animateViewTo]);

  useEffect(() => {
    const loop = () => {
      const sep = 0.038 + viewRef.current.w * 0.028;
      stepSimulation(simRef.current, sep);
      setPositions(readPositions(simRef.current));
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(
    () => () => {
      if (viewAnimRef.current) cancelAnimationFrame(viewAnimRef.current);
      if (collapseTimer) clearTimeout(collapseTimer);
    },
    [collapseTimer],
  );

  const [viewBox, setViewBox] = useState(DEFAULT_VIEW);
  useEffect(() => {
    let raf: number;
    const tick = () => {
      setViewBox({ ...viewRef.current });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleLeaveCanvas = () => {
    setHoveredId(null);
    if (depth === 0) return;
    const timer = setTimeout(() => setDisclosure(emptyDisclosure()), 2800);
    setCollapseTimer(timer);
  };

  const handleEnterCanvas = () => {
    if (collapseTimer) {
      clearTimeout(collapseTimer);
      setCollapseTimer(null);
    }
  };

  const vb = viewBox;
  const fontScale = vb.w;
  const guidance = guidanceForDepth(depth, !!hoveredId);
  const showRipple = metaphor.metaphor === "ripple";

  const ctx: ProgressiveTerrainContext = {
    hub,
    palette,
    ecosystem,
    disclosure,
    hoveredId,
    positions,
    litIds,
  };

  const themeArriving = arriving && arrivalIntent === "to-theme";

  return (
    <RealmShell hub={hub} atmosphereVariant={atmosphereVariant}>
      <div className="mx-auto max-w-2xl px-5 pb-24 sm:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ...realmEntry.terrain,
            delay: themeArriving ? realmEntry.terrain.delay : 0.2,
          }}
          className="relative mx-auto h-[min(70vh,580px)] w-full"
          onMouseEnter={handleEnterCanvas}
          onMouseLeave={handleLeaveCanvas}
        >
          <svg
            viewBox={`${toSvg(vb.x)} ${toSvg(vb.y)} ${toSvg(vb.w)} ${toSvg(vb.h)}`}
            className="h-full w-full"
            role="img"
            aria-label={`${hub.theme.title} — explore concepts layer by layer`}
            onClick={() => setDisclosure(emptyDisclosure())}
          >
            <circle
              cx={toSvg(ecosystem.center.x)}
              cy={toSvg(ecosystem.center.y)}
              r={toSvg(0.38)}
              fill={palette.accentSoft}
              opacity={0.1}
            >
              <animate
                attributeName="r"
                values={`${toSvg(0.34)};${toSvg(0.42)};${toSvg(0.34)}`}
                dur="16s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.07;0.13;0.07"
                dur="16s"
                repeatCount="indefinite"
              />
            </circle>

            {showRipple && (
              <RippleField
                cx={toSvg(ecosystem.center.x)}
                cy={toSvg(ecosystem.center.y)}
                stroke={palette.accent}
                active={!!hoveredId || depth > 0}
              />
            )}

            {children?.(ctx)}

            <circle
              cx={toSvg(ecosystem.center.x)}
              cy={toSvg(ecosystem.center.y)}
              r={toSvg(0.24)}
              fill="none"
              stroke={palette.line}
              strokeWidth={0.08}
              opacity={0.2}
            />

            {ecosystem.edges.map((e) => {
              const from = positions.get(e.from);
              const to = positions.get(e.to);
              if (!from || !to) return null;

              const fromNode = ecosystem.nodes.find((n) => n.id === e.from);
              const toNode = ecosystem.nodes.find((n) => n.id === e.to);
              if (!fromNode || !toNode) return null;

              const fromVisible = visibleNodes.some((n) => n.id === e.from);
              const toVisible = visibleNodes.some((n) => n.id === e.to);
              if (!fromVisible || !toVisible) return null;

              const lit =
                (litIds.has(e.from) && litIds.has(e.to)) ||
                (hoveredId &&
                  (e.from === hoveredId || e.to === hoveredId));

              const branchGrowing =
                e.tier === "branch" &&
                (toNode.tier === "relationship"
                  ? disclosure.primaryId === fromNode.id
                  : toNode.tier === "essay"
                    ? disclosure.relationshipId === fromNode.id
                    : disclosure.essayId === fromNode.id);

              return (
                <line
                  key={`${e.from}-${e.to}`}
                  x1={toSvg(from.x)}
                  y1={toSvg(from.y)}
                  x2={toSvg(to.x)}
                  y2={toSvg(to.y)}
                  stroke={lit ? palette.accent : palette.line}
                  strokeWidth={lit ? 0.14 : e.tier === "spoke" ? 0.1 : 0.08}
                  opacity={
                    lit
                      ? 0.55
                      : e.tier === "spoke"
                        ? 0.26
                        : branchGrowing
                          ? 0.36
                          : 0.1
                  }
                >
                  {branchGrowing && (
                    <animate
                      attributeName="opacity"
                      values="0;0.36"
                      dur="1.8s"
                      fill="freeze"
                    />
                  )}
                </line>
              );
            })}

            {visibleNodes.map((node) => {
              const pos = positions.get(node.id) ?? { x: node.x, y: node.y };
              const isHovered = hoveredId === node.id;
              const isLit = litIds.has(node.id) || isHovered;
              const isExpanded =
                (node.tier === "primary" && disclosure.primaryId === node.id) ||
                (node.tier === "relationship" &&
                  disclosure.relationshipId === node.id) ||
                (node.tier === "essay" && disclosure.essayId === node.id);

              return (
                <TerrainNode
                  key={node.id}
                  node={node}
                  x={pos.x}
                  y={pos.y}
                  palette={palette}
                  fontScale={fontScale}
                  lit={isLit}
                  hovered={isHovered}
                  expanded={isExpanded}
                  onEnter={() => {
                    setHoveredId(node.id);
                    sound?.playHover(node.id);
                  }}
                  onLeave={() => setHoveredId(null)}
                  onClick={() =>
                    handleNodeClick(
                      node,
                      ecosystem,
                      disclosure,
                      setDisclosure,
                      navigate,
                    )
                  }
                />
              );
            })}
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...realmFade, delay: 1.2 }}
          className="mx-auto mt-8 max-w-md text-center text-sm italic"
          style={{ color: palette.textMuted }}
        >
          {guidance}
        </motion.p>
      </div>
    </RealmShell>
  );
}

function TerrainNode({
  node,
  x,
  y,
  palette,
  fontScale,
  lit,
  hovered,
  expanded,
  onEnter,
  onLeave,
  onClick,
}: {
  node: ProgressiveNode;
  x: number;
  y: number;
  palette: RealmPalette;
  fontScale: number;
  lit: boolean;
  hovered: boolean;
  expanded: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const r = node.radius * (hovered ? 1.1 : expanded ? 1.08 : 1);
  const glowR = r * (node.tier === "center" ? 2.8 : hovered ? 2.2 : 1.85);

  const showLabel =
    node.tier === "center" ||
    node.tier === "primary" ||
    (node.tier !== "question" && (hovered || expanded)) ||
    (node.tier === "question" && hovered);

  const labelSize = Math.max(
    2,
    fontScale *
      (node.tier === "center"
        ? 0.034
        : node.tier === "primary"
          ? 0.028
          : node.tier === "relationship"
            ? 0.023
            : 0.02),
  );

  const baseOpacity =
    node.tier === "center"
      ? 1
      : node.tier === "primary"
        ? lit
          ? 0.88
          : 0.68
        : lit
          ? 0.82
          : 0.48;

  return (
    <g
      className="cursor-pointer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      opacity={baseOpacity}
      style={{ transition: "opacity 1.4s ease" }}
    >
      <circle
        cx={toSvg(x)}
        cy={toSvg(y)}
        r={toSvg(glowR)}
        fill={palette.accent}
        opacity={lit ? (hovered ? 0.2 : 0.11) : 0.04}
      >
        {node.tier === "center" && (
          <animate
            attributeName="opacity"
            values="0.08;0.14;0.08"
            dur="12s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      <circle
        cx={toSvg(x)}
        cy={toSvg(y)}
        r={toSvg(r)}
        fill={palette.accent}
        opacity={lit ? 0.9 : 0.38}
      />

      {expanded && node.tier !== "center" && (
        <circle
          cx={toSvg(x)}
          cy={toSvg(y)}
          r={toSvg(node.radius * 2.3)}
          fill="none"
          stroke={palette.accent}
          strokeWidth={0.06}
          opacity={0.32}
        />
      )}

      {showLabel && (
        <text
          x={toSvg(x)}
          y={toSvg(y) + toSvg(r) + labelSize * 1.1}
          textAnchor="middle"
          fill={palette.text}
          fontSize={labelSize}
          opacity={hovered ? 0.95 : 0.76}
          stroke={
            node.tier === "center" || node.tier === "primary"
              ? "rgba(4,4,8,0.85)"
              : "none"
          }
          strokeWidth={node.tier === "center" || node.tier === "primary" ? 0.35 : 0}
          paintOrder="stroke fill"
        >
          {node.label.length > 32 ? `${node.label.slice(0, 30)}…` : node.label}
        </text>
      )}
    </g>
  );
}
