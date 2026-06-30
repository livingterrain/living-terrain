"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { TerrainTransitionIntent } from "@/lib/atmosphere/navigation";
import { durationForIntent } from "@/lib/atmosphere/navigation";
import { NAVIGATION } from "@/lib/atmosphere/tempo";

interface ThresholdVeilProps {
  active: boolean;
  intent: TerrainTransitionIntent;
  phase: "exit" | "enter";
  atmosphere?: string;
}

const STARS = Array.from({ length: 72 }, (_, i) => ({
  x: ((i * 127.1) % 1000) / 10,
  y: ((i * 311.7) % 1000) / 10,
  o: 0.2 + (i % 7) * 0.08,
  r: i % 11 === 0 ? 1.4 : 0.9,
}));

type LayerKeyframes = {
  paper?: [number, number];
  stars?: [number, number];
  void?: [number, number];
  atmosphere?: [number, number];
  blur?: [number, number];
};

function layerKeyframes(
  intent: TerrainTransitionIntent,
  phase: "exit" | "enter",
): LayerKeyframes {
  switch (intent) {
    case "reading-to-map":
      return phase === "exit"
        ? { paper: [1, 0.2], stars: [0, 0.85], void: [0, 1], blur: [0, 6] }
        : { paper: [0.12, 0], stars: [0.8, 0.3], void: [1, 0], blur: [6, 0] };
    case "map-to-reading":
      return phase === "exit"
        ? { paper: [0, 0.95], stars: [0.8, 0.15], void: [0.85, 0.15], blur: [0, 5] }
        : { paper: [0.95, 0], stars: [0.2, 0], void: [0.15, 0], blur: [5, 0] };
    case "to-theme":
      return phase === "exit"
        ? {
            paper: [0.45, 0],
            stars: [0.45, 0.12],
            void: [0.55, 0.9],
            atmosphere: [0, 1],
            blur: [0, 8],
          }
        : {
            paper: [0, 0],
            stars: [0.15, 0],
            void: [0.9, 0],
            atmosphere: [1, 0.12],
            blur: [8, 0],
          };
    case "theme-to-map":
      return phase === "exit"
        ? {
            paper: [0, 0],
            stars: [0.12, 0.8],
            void: [0.65, 1],
            atmosphere: [1, 0.3],
            blur: [0, 7],
          }
        : {
            paper: [0, 0],
            stars: [0.75, 0.25],
            void: [1, 0],
            atmosphere: [0.3, 0],
            blur: [7, 0],
          };
    case "theme-to-reading":
      return phase === "exit"
        ? {
            paper: [0, 0.9],
            stars: [0.08, 0],
            void: [0.45, 0.08],
            atmosphere: [1, 0.15],
            blur: [0, 6],
          }
        : {
            paper: [0.92, 0],
            stars: [0, 0],
            void: [0.08, 0],
            atmosphere: [0.15, 0],
            blur: [6, 0],
          };
    case "theme-to-theme":
      return phase === "exit"
        ? {
            paper: [0, 0],
            stars: [0.18, 0.08],
            void: [0.75, 0.95],
            atmosphere: [1, 0.55],
            blur: [0, 9],
          }
        : {
            paper: [0, 0],
            stars: [0.08, 0.18],
            void: [0.95, 0],
            atmosphere: [0.55, 0],
            blur: [9, 0],
          };
    case "to-thread":
      return phase === "exit"
        ? { paper: [0.92, 0.35], stars: [0, 0.55], void: [0, 0.75], blur: [0, 8] }
        : { paper: [0.35, 0], stars: [0.55, 0.2], void: [0.75, 0], blur: [8, 0] };
    default:
      return phase === "exit"
        ? { paper: [0, 0], stars: [0, 0], void: [0, 0.7], blur: [0, 5] }
        : { paper: [0, 0], stars: [0, 0], void: [0.7, 0], blur: [5, 0] };
  }
}

/**
 * Fullscreen crossing veil — continuous exit→enter without unmounting between phases.
 */
export function ThresholdVeil({
  active,
  intent,
  phase,
  atmosphere,
}: ThresholdVeilProps) {
  const ms = durationForIntent(intent, phase);
  const duration = ms / 1000;
  const layers = useMemo(
    () => layerKeyframes(intent, phase),
    [intent, phase],
  );

  if (!active) return null;

  return (
    <motion.div
      className="pointer-events-auto fixed inset-0 z-[280]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      aria-hidden
    >
      <motion.div
        className="absolute inset-0 bg-[#030405]/25"
        initial={{
          opacity: 0.25,
          filter: `blur(${layers.blur?.[0] ?? 0}px)`,
        }}
        animate={{
          opacity: 0.42,
          filter: `blur(${layers.blur?.[1] ?? 0}px)`,
        }}
        transition={{ duration, ease: NAVIGATION.ease }}
      />

      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: "#040506" }}
        initial={{ opacity: layers.void?.[0] ?? 0 }}
        animate={{ opacity: layers.void?.[1] ?? 0 }}
        transition={{ duration, ease: NAVIGATION.ease }}
      />

      {atmosphere && (
        <motion.div
          className="absolute inset-0"
          style={{ background: atmosphere }}
          initial={{ opacity: layers.atmosphere?.[0] ?? 0 }}
          animate={{ opacity: layers.atmosphere?.[1] ?? 0 }}
          transition={{ duration, ease: NAVIGATION.ease }}
        />
      )}

      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        initial={{ opacity: layers.stars?.[0] ?? 0 }}
        animate={{ opacity: layers.stars?.[1] ?? 0 }}
        transition={{ duration, ease: NAVIGATION.ease }}
      >
        {STARS.map((s) => (
          <circle
            key={s.x + s.y}
            cx={s.x}
            cy={s.y}
            r={s.r * 0.12}
            fill="#e8e4dc"
            opacity={s.o}
          />
        ))}
      </motion.svg>

      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, #f5f0e6 0%, #ebe4d6 55%, #e0d8c8 100%)",
        }}
        initial={{ opacity: layers.paper?.[0] ?? 0 }}
        animate={{ opacity: layers.paper?.[1] ?? 0 }}
        transition={{ duration, ease: NAVIGATION.ease }}
      />

      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        initial={{ opacity: (layers.paper?.[0] ?? 0) * 0.35 }}
        animate={{ opacity: (layers.paper?.[1] ?? 0) * 0.35 }}
        transition={{ duration, ease: NAVIGATION.ease }}
      />
    </motion.div>
  );
}
