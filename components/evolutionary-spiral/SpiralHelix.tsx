"use client";

import {
  useEffect,
  useId,
  useMemo,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { motion } from "framer-motion";
import {
  SPIRAL_ASCENT_CAPTION,
  SPIRAL_VIEWBOX,
  arcWindowForIndex,
  buildSpiralNodes,
  currentPaths,
  displayNameForStop,
  getSpiralStage,
  localArcPath,
  localAxisPath,
  microcopyForStop,
  nodeHitStyle,
  opacityForDepth,
  strokeWidthForDepth,
  type SpiralDepthSegment,
  type SpiralSequenceStop,
} from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";

/** Local probe — defaults to reduced until measured (no ambient flash). */
function useSpiralReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

type Props = {
  sequence: readonly SpiralSequenceStop[];
  /** No operation is selected until the visitor chooses one. */
  selectedId: string | null;
  onSelect: (occurrenceId: string) => void;
  /** A domain trajectory is laid against the Spiral — the reference recedes. */
  quiet?: boolean;
  /** Active trajectory title, for screen-reader context on related nodes. */
  trajectoryLabel?: string;
  /** Occurrences with an authored relationship to the active trajectory. */
  relatedIds?: ReadonlySet<string>;
  /** Occurrences touched by the focused step or relationship. */
  emphasizedIds?: ReadonlySet<string>;
};

function CurrentSegment({
  segment,
  reduced,
  delay,
}: {
  segment: SpiralDepthSegment;
  reduced: boolean;
  delay: number;
}) {
  const width = strokeWidthForDepth(segment.depth);
  const opacity = opacityForDepth(segment.depth);
  const isTrans = segment.current === "transformation";
  const near = segment.depth > 0.35;
  const isFront = segment.side === "front";

  return (
    <g
      className={cn(
        "spiral-helix__seg",
        isFront ? "spiral-helix__seg--front" : "spiral-helix__seg--back",
        isTrans
          ? "spiral-helix__seg--transformation"
          : "spiral-helix__seg--continuity",
        near && "spiral-helix__seg--near",
      )}
    >
      {/* Soft volume on front only — keeps far side recessed, near side ribbon-like */}
      {isFront && (
        <path
          d={segment.d}
          className="spiral-helix__seg-volume"
          fill="none"
          strokeWidth={width * (near ? 2.7 : 2.2)}
          opacity={opacity * (near ? 0.34 : 0.2)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <motion.path
        d={segment.d}
        className="spiral-helix__seg-core"
        fill="none"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity }}
        transition={
          reduced
            ? { duration: 0 }
            : {
                duration: 1.65,
                delay,
                ease: [0.45, 0.05, 0.55, 0.95],
              }
        }
      />
    </g>
  );
}

/** Continuity ↔ Transformation and the ascent caption — quiet, always present. */
export function SpiralHelixLegend() {
  return (
    <div className="spiral-helix__legend">
      <p className="spiral-helix__legend-row">
        <span className="spiral-helix__swatch spiral-helix__swatch--continuity" />
        <span>Continuity</span>
        <span className="spiral-helix__swatch spiral-helix__swatch--transformation" />
        <span>Transformation</span>
      </p>
      <p className="spiral-helix__caption">{SPIRAL_ASCENT_CAPTION}</p>
    </div>
  );
}

/**
 * Ascending dual-current helix with projected spatial depth.
 * Nodes on the shared reference axis are the operation selector.
 * No DNA grammar (no rungs / base pairs / molecule cues).
 */
export function SpiralHelix({
  sequence,
  selectedId,
  onSelect,
  quiet,
  trajectoryLabel,
  relatedIds,
  emphasizedIds,
}: Props) {
  const reactId = useId();
  const reduced = useSpiralReducedMotion();
  const [previewId, setPreviewId] = useState<string | null>(null);
  const nodes = useMemo(() => buildSpiralNodes(sequence), [sequence]);
  const paths = useMemo(() => currentPaths(), []);
  const backSegments = useMemo(
    () => paths.segmentsPaintOrder.filter((s) => s.side === "back"),
    [paths.segmentsPaintOrder],
  );
  const frontSegments = useMemo(
    () => paths.segmentsPaintOrder.filter((s) => s.side === "front"),
    [paths.segmentsPaintOrder],
  );
  const selectedIndex = selectedId
    ? sequence.findIndex((s) => s.occurrenceId === selectedId)
    : -1;
  const selectedStop = selectedIndex >= 0 ? sequence[selectedIndex] : undefined;
  const local = selectedStop
    ? (() => {
        const { tMin, tMax } = arcWindowForIndex(selectedIndex, sequence.length);
        return {
          cont: localArcPath("continuity", tMin, tMax),
          trans: localArcPath("transformation", tMin, tMax),
          axis: localAxisPath(tMin, tMax),
        };
      })()
    : undefined;
  const emergenceAgainSelected = (selectedStop?.cycleIndex ?? 0) > 0;
  /** Roving tab stop: the selected node, else the first. */
  const tabStopIndex = Math.max(0, selectedIndex);
  const previewNode = previewId
    ? nodes.find((n) => n.stop.occurrenceId === previewId)
    : undefined;

  const onKeyNav = (e: KeyboardEvent, index: number) => {
    let next = index;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      next = Math.min(sequence.length - 1, index + 1);
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      next = Math.max(0, index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = sequence.length - 1;
    } else {
      return;
    }
    onSelect(sequence[next]!.occurrenceId);
    const el = document.getElementById(
      `${reactId}-hit-${sequence[next]!.occurrenceId}`,
    );
    el?.focus();
  };

  const onHitFocus = (e: FocusEvent<HTMLButtonElement>, id: string) => {
    if (e.currentTarget.matches(":focus-visible")) setPreviewId(id);
  };

  return (
    <div className={cn("spiral-helix", quiet && "spiral-helix--quiet")}>
      <div className="spiral-helix__canvas">
        <svg
          className="spiral-helix__svg"
          viewBox={`0 0 ${SPIRAL_VIEWBOX.width} ${SPIRAL_VIEWBOX.height}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-labelledby={`${reactId}-title ${reactId}-desc`}
        >
          <title id={`${reactId}-title`}>The Evolutionary Spiral</title>
          <desc id={`${reactId}-desc`}>
            An ascending helix showing a reference trajectory through a grammar
            of recurrent operations. Emergence appears near the bottom and
            Emergence again near the top after Renewal. Two currents, Continuity
            and Transformation, wind together throughout. History accumulates
            upward; ascent marks changed conditions, not guaranteed improvement
            or a path every system must follow.
          </desc>

          <defs>
            <radialGradient id={`${reactId}-glow`} cx="50%" cy="55%" r="58%">
              <stop offset="0%" stopColor="#d4bc8a" stopOpacity="0.09" />
              <stop offset="45%" stopColor="#8490a4" stopOpacity="0.035" />
              <stop offset="100%" stopColor="#030405" stopOpacity="0" />
            </radialGradient>
            <linearGradient
              id={`${reactId}-axis-glow`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#d4bc8a" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#8490a4" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#d4bc8a" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Atmospheric field — embeds the helix in depth */}
          <rect
            width={SPIRAL_VIEWBOX.width}
            height={SPIRAL_VIEWBOX.height}
            fill={`url(#${reactId}-glow)`}
            aria-hidden
          />

          {/* Depth stack: far currents → axis → near currents → local highlight */}
          <g
            className={cn(
              "spiral-helix__space",
              !reduced && "spiral-helix__space--ambient",
            )}
            aria-hidden
          >
            <g className="spiral-helix__layer spiral-helix__layer--back">
              {backSegments.map((segment, i) => (
                <CurrentSegment
                  key={`back-${segment.current}-${i}`}
                  segment={segment}
                  reduced={reduced}
                  delay={0.08 + i * 0.02}
                />
              ))}
            </g>

            {/* Developmental axis — mid-depth occlusion plane between windings */}
            <g className="spiral-helix__layer spiral-helix__layer--axis">
              <motion.path
                d={paths.axisFull}
                className="spiral-helix__axis spiral-helix__axis--halo"
                fill="none"
                stroke={`url(#${reactId}-axis-glow)`}
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 1.4, ease: [0.45, 0.05, 0.55, 0.95] }
                }
              />
              <motion.path
                d={paths.axisFull}
                className="spiral-helix__axis"
                fill="none"
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.55 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 1.4, ease: [0.45, 0.05, 0.55, 0.95] }
                }
              />
            </g>

            <g className="spiral-helix__layer spiral-helix__layer--front">
              {frontSegments.map((segment, i) => (
                <CurrentSegment
                  key={`front-${segment.current}-${i}`}
                  segment={segment}
                  reduced={reduced}
                  delay={0.14 + i * 0.02}
                />
              ))}
            </g>
          </g>

          {/* Residual wake when Emergence again is selected */}
          {emergenceAgainSelected && (
            <g className="spiral-helix__wake" aria-hidden>
              <path d={paths.continuityFull} className="spiral-helix__wake-path" />
              <path
                d={paths.transformationFull}
                className="spiral-helix__wake-path spiral-helix__wake-path--trans"
              />
            </g>
          )}

          {/* Local arc of BOTH currents + lifted axis — whole-process local state */}
          {local && (
            <g className="spiral-helix__local" aria-hidden>
              <path d={local.axis} className="spiral-helix__local-axis" />
              <path
                d={local.cont}
                className="spiral-helix__local-arc spiral-helix__local-arc--continuity"
              />
              <path
                d={local.trans}
                className="spiral-helix__local-arc spiral-helix__local-arc--transformation"
              />
            </g>
          )}

          {/* Stage labels (visual); interaction via HTML hit targets */}
          {nodes.map((node) => {
            const stage = getSpiralStage(node.stop.stageId);
            const name = displayNameForStop(
              node.stop,
              stage?.name ?? node.stop.stageId,
            );
            const selected = node.stop.occurrenceId === selectedId;
            const previewed = node.stop.occurrenceId === previewId;
            const labelX =
              node.labelSide === "left" ? node.x - 14 : node.x + 14;
            const anchor = node.labelSide === "left" ? "end" : "start";
            const related = relatedIds?.has(node.stop.occurrenceId) ?? false;
            const emphasized = emphasizedIds?.has(node.stop.occurrenceId) ?? false;
            return (
              <g key={`label-${node.stop.occurrenceId}`} aria-hidden>
                {related && (
                  <rect
                    x={node.x - 2.8}
                    y={node.y - 2.8}
                    width={5.6}
                    height={5.6}
                    transform={`rotate(45 ${node.x} ${node.y})`}
                    className={cn(
                      "spiral-helix__node-related",
                      emphasized && "spiral-helix__node-related--emphasized",
                    )}
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={3.4}
                  className={cn(
                    "spiral-helix__node-halo",
                    (selected || previewed) && "spiral-helix__node-halo--on",
                  )}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={selected ? 2.1 : node.stop.cycleIndex > 0 ? 1.85 : 1.55}
                  className={cn(
                    "spiral-helix__node-dot",
                    selected && "spiral-helix__node-dot--selected",
                    node.stop.cycleIndex > 0 && "spiral-helix__node-dot--again",
                  )}
                />
                <text
                  x={labelX}
                  y={node.y + 0.8}
                  textAnchor={anchor}
                  className={cn(
                    "spiral-helix__label",
                    (selected || previewed || emphasized) &&
                      "spiral-helix__label--selected",
                  )}
                >
                  <tspan className="spiral-helix__label-n">
                    {String(node.stop.order).padStart(2, "0")}
                  </tspan>{" "}
                  {name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Min 44px hit targets — the helix is the operation selector */}
        <div
          className="spiral-helix__hits"
          role="group"
          aria-label="Operations of the Spiral"
        >
          {nodes.map((node) => {
            const stage = getSpiralStage(node.stop.stageId);
            const name = displayNameForStop(
              node.stop,
              stage?.name ?? node.stop.stageId,
            );
            const selected = node.stop.occurrenceId === selectedId;
            const related = relatedIds?.has(node.stop.occurrenceId) ?? false;
            const style = nodeHitStyle(node);
            const id = node.stop.occurrenceId;
            return (
              <button
                key={id}
                id={`${reactId}-hit-${id}`}
                type="button"
                data-occurrence-hit={id}
                className={cn(
                  "spiral-helix__hit",
                  selected && "spiral-helix__hit--selected",
                )}
                style={style}
                tabIndex={node.index === tabStopIndex ? 0 : -1}
                aria-pressed={selected}
                aria-describedby={`${reactId}-micro-${id}`}
                aria-label={`${String(node.stop.order).padStart(2, "0")} ${name}${
                  related && trajectoryLabel
                    ? `, researched relationship with ${trajectoryLabel}`
                    : ""
                }`}
                onClick={() => onSelect(id)}
                onKeyDown={(e) => onKeyNav(e, node.index)}
                onMouseEnter={() => setPreviewId(id)}
                onMouseLeave={() =>
                  setPreviewId((current) => (current === id ? null : current))
                }
                onFocus={(e) => onHitFocus(e, id)}
                onBlur={() =>
                  setPreviewId((current) => (current === id ? null : current))
                }
              >
                <span id={`${reactId}-micro-${id}`} className="sr-only">
                  {microcopyForStop(node.stop)}
                </span>
              </button>
            );
          })}
        </div>

        {previewNode && previewNode.stop.occurrenceId !== selectedId && (
          <p
            className={cn(
              "spiral-helix__preview",
              previewNode.labelSide === "left"
                ? "spiral-helix__preview--right"
                : "spiral-helix__preview--left",
            )}
            style={nodeHitStyle(previewNode)}
            aria-hidden="true"
          >
            {microcopyForStop(previewNode.stop)}
          </p>
        )}
      </div>
    </div>
  );
}
