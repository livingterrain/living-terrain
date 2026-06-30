"use client";

import { motion } from "framer-motion";
import type { RealmNetworkNode, RealmPalette } from "@/lib/realms/types";
import type { RealmMetaphor } from "@/lib/realms/metaphors";
import { toSvg } from "./realm-graph";
import { metaphorNodeMotion } from "./metaphor-effects";
import { realmFade } from "./motion";

interface RealmNodeProps {
  node: RealmNetworkNode;
  palette: RealmPalette;
  lit: boolean;
  dim: boolean;
  hovered: boolean;
  delay?: number;
  r?: number;
  metaphor?: RealmMetaphor;
  onEnter: () => void;
  onLeave: () => void;
  showLabel?: boolean;
}

export function RealmNode({
  node,
  palette,
  lit,
  dim,
  hovered,
  delay = 0,
  r,
  metaphor = "stabilize",
  onEnter,
  onLeave,
  showLabel,
}: RealmNodeProps) {
  const { cx, cy } = toSvg(node.x, node.y);
  const isCenter = node.kind === "center";
  const radius = r ?? (isCenter ? 3.2 : node.kind === "topic" ? 2.2 : 1.8);
  const motionCfg = metaphorNodeMotion(metaphor);
  const label =
    showLabel || hovered || isCenter || node.kind === "topic"
      ? node.label.length > 26
        ? `${node.label.slice(0, 24)}…`
        : node.label
      : null;

  const glowR =
    metaphor === "illuminate" && hovered
      ? radius * 3.2
      : metaphor === "ripple"
        ? radius * 2.4
        : radius * 1.8;

  return (
    <g
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={node.href ? "cursor-pointer" : undefined}
      onClick={() => node.href && (window.location.href = node.href)}
    >
      {(metaphor === "illuminate" || metaphor === "ripple") && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={glowR}
          fill={palette.accent}
          initial={{ opacity: 0 }}
          animate={{
            opacity: hovered ? 0.22 : metaphor === "ripple" ? 0.06 : 0,
            scale: hovered ? 1 : 0.85,
          }}
          transition={{ duration: 1.6, ease: realmFade.ease }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      )}

      {metaphor === "crystallize" && (
        <polygon
          points={hexPoints(cx, cy, radius * 1.5)}
          fill="none"
          stroke={palette.accent}
          strokeWidth={0.08}
          opacity={hovered ? 0.5 : 0.2}
        />
      )}

      <motion.g
        initial={{ opacity: 0, scale: motionCfg.initialScale }}
        animate={{
          opacity: dim ? 0.1 : lit ? (isCenter ? 0.92 : 0.78) : 0.35,
          scale: hovered ? motionCfg.hoverScale : 1,
          y: motionCfg.animateY ?? 0,
        }}
        transition={{
          duration: metaphor === "stabilize" ? 2.2 : 1.4,
          delay,
          ease: realmFade.ease,
          y: motionCfg.animateY
            ? { duration: 5, repeat: Infinity, ease: "easeInOut" }
            : undefined,
        }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <circle cx={cx} cy={cy} r={radius} fill={palette.accent} />
      </motion.g>

      {label && (
        <text
          x={cx}
          y={cy + radius + 3.5}
          textAnchor="middle"
          fill={palette.text}
          fontSize="2.4"
          opacity={hovered ? 0.92 : 0.72}
        >
          {label}
        </text>
      )}
    </g>
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
