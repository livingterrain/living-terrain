"use client";

import type { RealmMetaphor } from "@/lib/realms/metaphors";

/** Animated stroke — threads that weave over one another */
export function WeaveLine({
  x1,
  y1,
  x2,
  y2,
  stroke,
  strokeWidth = 0.12,
  opacity = 0.28,
  lit = false,
  delay = 0,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth?: number;
  opacity?: number;
  lit?: boolean;
  delay?: number;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={lit ? strokeWidth * 2 : strokeWidth}
      opacity={lit ? 0.72 : opacity}
      strokeDasharray="1.2 0.8"
    >
      <animate
        attributeName="stroke-dashoffset"
        values="0;4;0"
        dur={`${5.5 + delay}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </line>
  );
}

/** Downward flow along a vertical spine */
export function FlowSpine({
  cx,
  y1,
  y2,
  stroke,
  strokeWidth = 0.15,
}: {
  cx: number;
  y1: number;
  y2: number;
  stroke: string;
  strokeWidth?: number;
}) {
  return (
    <g>
      <line
        x1={cx}
        y1={y1}
        x2={cx}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={0.38}
      />
      {[0, 1, 2].map((i) => (
        <circle key={i} r={0.35} fill={stroke} opacity={0}>
          <animateMotion
            dur={`${7 + i * 1.8}s`}
            begin={`${i * 2.2}s`}
            repeatCount="indefinite"
            path={`M ${cx} ${y1} L ${cx} ${y2}`}
          />
          <animate
            attributeName="opacity"
            values="0;0.55;0"
            dur={`${7 + i * 1.8}s`}
            begin={`${i * 2.2}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
}

/** Branching path that grows outward over time */
export function BranchPath({
  d,
  stroke,
  strokeWidth = 0.14,
  delay = 0,
  duration = 3.2,
}: {
  d: string;
  stroke: string;
  strokeWidth?: number;
  delay?: number;
  duration?: number;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray="1"
      opacity={0.32}
    >
      <animate
        attributeName="stroke-dashoffset"
        values="1;0"
        dur={`${duration}s`}
        begin={`${delay}s`}
        fill="freeze"
      />
      <animate
        attributeName="opacity"
        values="0;0.32"
        dur="1.4s"
        begin={`${delay}s`}
        fill="freeze"
      />
    </path>
  );
}

/** Organic growth — path extends upward from root */
export function GrowPath({
  d,
  stroke,
  strokeWidth = 0.16,
  delay = 0,
}: {
  d: string;
  stroke: string;
  strokeWidth?: number;
  delay?: number;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray="1"
      opacity={0.38}
    >
      <animate
        attributeName="stroke-dashoffset"
        values="1;0"
        dur="3.8s"
        begin={`${delay}s`}
        fill="freeze"
      />
      <animate
        attributeName="opacity"
        values="0.05;0.38"
        dur="3.8s"
        begin={`${delay}s`}
        fill="freeze"
      />
    </path>
  );
}

/** Radial illumination from a focal point */
export function IlluminateRays({
  cx,
  cy,
  stroke,
  active,
  count = 6,
}: {
  cx: number;
  cy: number;
  stroke: string;
  active: boolean;
  count?: number;
}) {
  if (!active) return null;
  return (
    <g opacity={0.35}>
      {Array.from({ length: count }, (_, i) => {
        const a = (Math.PI * 2 * i) / count - Math.PI / 2;
        const x2 = cx + Math.cos(a) * 22;
        const y2 = cy + Math.sin(a) * 22;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke={stroke}
            strokeWidth={0.06}
            opacity={0}
          >
            <animate
              attributeName="opacity"
              values="0;0.5;0.2"
              dur="2.4s"
              begin={`${i * 0.12}s`}
              fill="freeze"
            />
          </line>
        );
      })}
      <circle cx={cx} cy={cy} r={14} fill={stroke} opacity={0}>
        <animate attributeName="opacity" values="0;0.12;0.06" dur="2.8s" fill="freeze" />
        <animate attributeName="r" values="4;16;14" dur="2.8s" fill="freeze" />
      </circle>
    </g>
  );
}

/** Crystalline facet ring — sharpens inward */
export function CrystalRing({
  cx,
  cy,
  r,
  stroke,
  active,
  sides = 6,
}: {
  cx: number;
  cy: number;
  r: number;
  stroke: string;
  active: boolean;
  sides?: number;
}) {
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const a = (Math.PI * 2 * i) / sides - Math.PI / 2;
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return (
    <polygon
      points={pts.join(" ")}
      fill="none"
      stroke={stroke}
      strokeWidth={0.1}
      opacity={active ? 0.45 : 0.18}
    >
      <animate
        attributeName="opacity"
        values={active ? "0.18;0.5;0.45" : "0.12;0.22;0.18"}
        dur="4s"
        repeatCount="indefinite"
      />
    </polygon>
  );
}

/** Steady containment — reality stabilizes */
export function StabilizeFrame({
  stroke,
  w = 100,
  h = 100,
}: {
  stroke: string;
  w?: number;
  h?: number;
}) {
  const cx = w / 2;
  const cy = h / 2;
  return (
    <g opacity={0.2}>
      <line x1={cx} y1={8} x2={cx} y2={h - 8} stroke={stroke} strokeWidth={0.06} />
      <line x1={8} y1={cy} x2={w - 8} y2={cy} stroke={stroke} strokeWidth={0.06} />
      <rect
        x={cx - 22}
        y={cy - 22}
        width={44}
        height={44}
        fill="none"
        stroke={stroke}
        strokeWidth={0.05}
      />
    </g>
  );
}

/** Architectural support — constraint holds */
export function SupportPillars({
  stroke,
  accent,
  h = 62,
}: {
  stroke: string;
  accent: string;
  h?: number;
}) {
  return (
    <g opacity={0.38}>
      {[18, 26, 34].map((x) => (
        <line key={x} x1={x} y1={14} x2={x} y2={h - 14} stroke={stroke} strokeWidth={0.1}>
          <animate
            attributeName="opacity"
            values="0.5;0.85;0.5"
            dur="6s"
            repeatCount="indefinite"
          />
        </line>
      ))}
      <rect
        x={16}
        y={17}
        width={16}
        height={20}
        fill="none"
        stroke={accent}
        strokeWidth={0.12}
        opacity={0.55}
      />
    </g>
  );
}

/** Pathways that widen into open space */
export function ExpandArc({
  d,
  stroke,
  delay = 0,
}: {
  d: string;
  stroke: string;
  delay?: number;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={0.12}
      strokeDasharray="0.6 1.4"
      opacity={0.3}
    >
      <animate
        attributeName="stroke-dashoffset"
        values="0;-8"
        dur="9s"
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.2;0.42;0.2"
        dur="12s"
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </path>
  );
}

/** Concentric ripples through a field */
export function RippleField({
  cx,
  cy,
  stroke,
  active,
}: {
  cx: number;
  cy: number;
  stroke: string;
  active: boolean;
}) {
  return (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={8}
          fill="none"
          stroke={stroke}
          strokeWidth={0.06}
          opacity={0}
        >
          <animate
            attributeName="r"
            values={`${6 + i * 2};${28 + i * 6}`}
            dur={`${7 + i * 1.5}s`}
            begin={`${i * 1.8}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values={active ? "0.35;0;0.35" : "0.18;0;0.18"}
            dur={`${7 + i * 1.5}s`}
            begin={`${i * 1.8}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
}

export function metaphorNodeMotion(metaphor: RealmMetaphor): {
  initialScale: number;
  hoverScale: number;
  animateY?: number[];
} {
  switch (metaphor) {
    case "flow":
      return { initialScale: 0, hoverScale: 1.12, animateY: [0, 0.4, 0] };
    case "weave":
      return { initialScale: 0, hoverScale: 1.14 };
    case "illuminate":
      return { initialScale: 0.6, hoverScale: 1.2 };
    case "crystallize":
      return { initialScale: 0.3, hoverScale: 1.1 };
    case "grow":
      return { initialScale: 0.2, hoverScale: 1.16 };
    case "stabilize":
      return { initialScale: 0.85, hoverScale: 1.06 };
    case "support":
      return { initialScale: 0.9, hoverScale: 1.05 };
    case "expand":
      return { initialScale: 0.7, hoverScale: 1.22 };
    case "branch":
      return { initialScale: 0.4, hoverScale: 1.12 };
    case "ripple":
      return { initialScale: 0.5, hoverScale: 1.18 };
  }
}
