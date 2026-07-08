"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useBreakpoint } from "@/lib/atmosphere/use-breakpoint";
import { cn } from "@/lib/utils";

const strokeProps = {
  stroke: "currentColor",
  strokeLinecap: "round" as const,
};
/**
 * Faint evidence of work in progress — notebooks, charts, annotations.
 * Not decoration; objects left mid-investigation.
 */
export function ObservatoryWorkbench({ className }: { className?: string }) {
  const reduced = useReducedMotion() ?? false;
  const { isMobile } = useBreakpoint();
  const { scrollYProgress } = useScroll();
  const parallax = isMobile ? 0.4 : 1;
  const yNear = useTransform(scrollYProgress, [0, 1], [0, -90 * parallax]);
  const yFar = useTransform(scrollYProgress, [0, 1], [0, -40 * parallax]);

  if (isMobile) {
    return (
      <div className={cn("obs-workbench pointer-events-none fixed inset-0 z-[1]", className)} aria-hidden>
        <OpenNotebook className="obs-workbench__artifact obs-workbench__artifact--notebook-mobile" />
      </div>
    );
  }

  return (
    <div className={cn("obs-workbench pointer-events-none fixed inset-0 z-[1]", className)} aria-hidden>
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y: yFar }}>
        <AstronomicalNotes className="obs-workbench__artifact obs-workbench__artifact--astro" />
        <FoldedPage className="obs-workbench__artifact obs-workbench__artifact--fold" />
      </motion.div>

      <motion.div className="absolute inset-0" style={reduced ? undefined : { y: yNear }}>
        <OpenNotebook className="obs-workbench__artifact obs-workbench__artifact--notebook" />
        <BotanicalSketch className="obs-workbench__artifact obs-workbench__artifact--botanical" />
        <GeologicalDiagram className="obs-workbench__artifact obs-workbench__artifact--geo" />
        <HandAnnotation className="obs-workbench__artifact obs-workbench__artifact--note" />
      </motion.div>
    </div>
  );
}

function OpenNotebook({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28 18h164v134H28V18Z"
        stroke={strokeProps.stroke}
        strokeWidth="0.6"
        opacity="0.35"
      />
      <path d="M28 18v134" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M44 18v134" stroke="currentColor" strokeWidth="0.35" opacity="0.25" />
      {[38, 52, 66, 80, 94, 108, 122, 136].map((y) => (
        <path
          key={y}
          d={`M44 ${y}h148`}
          stroke={strokeProps.stroke}
          strokeWidth="0.35"
          opacity="0.18"
        />
      ))}
      <path
        d="M58 48c12-4 22 2 28 10M62 72c8 6 18 8 26 4M56 98c10-2 20 4 30 8"
        stroke={strokeProps.stroke}
        strokeWidth="0.45"
        opacity="0.22"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FoldedPage({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 20h128v96H16V20Z"
        stroke={strokeProps.stroke}
        strokeWidth="0.55"
        opacity="0.3"
      />
      <path
        d="M128 20l16 14v82H16"
        stroke={strokeProps.stroke}
        strokeWidth="0.4"
        opacity="0.2"
      />
      <path
        d="M128 20l16 14H128"
        stroke={strokeProps.stroke}
        strokeWidth="0.45"
        opacity="0.28"
      />
      {[32, 48, 64, 80].map((y) => (
        <path
          key={y}
          d={`M28 ${y} Q56 ${y - 6} 84 ${y} T140 ${y - 2}`}
          stroke={strokeProps.stroke}
          strokeWidth="0.35"
          opacity="0.16"
        />
      ))}
    </svg>
  );
}

function BotanicalSketch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60 140V48"
        stroke={strokeProps.stroke}
        strokeWidth="0.5"
        opacity="0.28"
        strokeLinecap="round"
      />
      <path
        d="M60 90c-18-8-28-22-26-38M60 72c16-6 28-18 30-34M60 108c-14 10-22 24-18 38M60 118c12 8 22 20 20 34"
        stroke={strokeProps.stroke}
        strokeWidth="0.4"
        opacity="0.2"
        strokeLinecap="round"
      />
      <ellipse
        cx="42"
        cy="52"
        rx="10"
        ry="6"
        stroke={strokeProps.stroke}
        strokeWidth="0.35"
        opacity="0.15"
        transform="rotate(-24 42 52)"
      />
    </svg>
  );
}

function AstronomicalNotes({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="80"
        cy="88"
        r="52"
        stroke={strokeProps.stroke}
        strokeWidth="0.45"
        opacity="0.22"
      />
      <path
        d="M80 36v8M80 132v8M36 88h8M124 88h8"
        stroke={strokeProps.stroke}
        strokeWidth="0.35"
        opacity="0.18"
      />
      {[0, 30, 60, 90, 120, 150].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 80 + Math.cos(rad) * 48;
        const y1 = 88 + Math.sin(rad) * 48;
        const x2 = 80 + Math.cos(rad) * 52;
        const y2 = 88 + Math.sin(rad) * 52;
        return (
          <path
            key={deg}
            d={`M${x1} ${y1}L${x2} ${y2}`}
            stroke={strokeProps.stroke}
            strokeWidth="0.35"
            opacity="0.16"
          />
        );
      })}
      <path
        d="M80 88l28-18"
        stroke={strokeProps.stroke}
        strokeWidth="0.4"
        opacity="0.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GeologicalDiagram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 88 L48 62 L92 74 L128 44 L188 58"
        stroke={strokeProps.stroke}
        strokeWidth="0.5"
        opacity="0.22"
        strokeLinecap="round"
      />
      <path
        d="M12 72 L52 54 L96 66 L140 38 L188 48"
        stroke={strokeProps.stroke}
        strokeWidth="0.4"
        opacity="0.16"
        strokeLinecap="round"
      />
      <path
        d="M12 100 L44 82 L88 92 L132 68 L188 78"
        stroke={strokeProps.stroke}
        strokeWidth="0.35"
        opacity="0.14"
        strokeLinecap="round"
      />
      <path d="M128 44v54" stroke="currentColor" strokeWidth="0.3" opacity="0.12" strokeDasharray="2 3" />
      <text
        x="132"
        y="104"
        fill="currentColor"
        fontSize="7"
        fontFamily="serif"
        opacity="0.2"
      >
        sect. B
      </text>
    </svg>
  );
}

function HandAnnotation({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 42c10-8 22-6 32 2s18 8 28 4"
        stroke={strokeProps.stroke}
        strokeWidth="0.45"
        opacity="0.22"
        strokeLinecap="round"
      />
      <path
        d="M62 18l6 8-10 4"
        stroke={strokeProps.stroke}
        strokeWidth="0.4"
        opacity="0.18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="12"
        y="22"
        fill="currentColor"
        fontSize="9"
        fontFamily="serif"
        fontStyle="italic"
        opacity="0.2"
      >
        cf. prior
      </text>
    </svg>
  );
}
