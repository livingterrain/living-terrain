"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useAmbientScroll } from "@/lib/atmosphere/use-ambient-scroll";
import { THRESHOLD_MOTION } from "@/lib/design-system/threshold";
import { cn } from "@/lib/utils";

interface ObservatoryLandscapeBackdropProps {
  /** 0–1 — deeper into the observatory */
  depth: number;
  className?: string;
}

/**
 * Shared terrain + mist layers for site-wide atmosphere.
 * Sits behind all pages — the landscape you walk through.
 */
export function ObservatoryLandscapeBackdrop({
  depth,
  className,
}: ObservatoryLandscapeBackdropProps) {
  const scroll = useAmbientScroll();
  const reduced = useReducedMotion();
  const terrainOpacity = 0.12 + depth * 0.38;
  const mistOpacity = 0.08 + depth * 0.22;

  return (
    <div
      className={cn("observatory-landscape pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
      data-observatory-depth={depth.toFixed(2)}
    >
      {/* Dawn horizon — always present beyond the walls */}
      <div
        className="observatory-landscape__horizon absolute inset-0"
        style={{ opacity: 0.35 + (1 - depth) * 0.35 }}
      />

      {/* Distant topographic tiers */}
      <motion.div
        className="observatory-landscape__terrain observatory-landscape__terrain--far absolute inset-x-0 bottom-0"
        style={{
          opacity: terrainOpacity * 0.45,
          y: reduced ? 0 : scroll * -0.04,
        }}
      >
        <TopoTierFar />
      </motion.div>

      <div
        className="observatory-landscape__mist observatory-landscape__mist--a absolute inset-0"
        style={{ opacity: mistOpacity * 0.7 }}
      />

      <motion.div
        className="observatory-landscape__terrain observatory-landscape__terrain--mid absolute inset-x-0 bottom-0"
        style={{
          opacity: terrainOpacity * 0.72,
          y: reduced ? 0 : scroll * -0.08,
        }}
      >
        <TopoTierMid />
      </motion.div>

      <div
        className="observatory-landscape__mist observatory-landscape__mist--b absolute inset-0"
        style={{ opacity: mistOpacity }}
      />

      <motion.div
        className="observatory-landscape__terrain observatory-landscape__terrain--near absolute inset-x-0 bottom-0"
        style={{
          opacity: terrainOpacity,
          y: reduced ? 0 : scroll * -0.12,
        }}
      >
        <TopoTierNear />
      </motion.div>

      <div
        className="observatory-landscape__floor absolute inset-x-0 bottom-0"
        style={{ opacity: 0.5 + depth * 0.35 }}
      />

      {/* Depth veil — walking inward, the void gathers */}
      <div
        className="observatory-landscape__depth-veil absolute inset-0"
        style={{ opacity: depth * 0.55 }}
      />
    </div>
  );
}

function TopoTierFar() {
  return (
    <svg className="h-full w-full" viewBox="0 0 1440 240" preserveAspectRatio="xMidYMax slice" fill="none">
      <path
        d="M0 240V190c60-6 120-14 180-10 60 4 120 16 180 12 60-4 120-18 180-14 60 4 120 14 180 10 60-4 120-16 180-12 60 4 120 18 180 14 60-4 120-12 180-8V240H0Z"
        fill="#1e2834"
        opacity="0.55"
      />
      <g stroke="#8898a8" strokeWidth="0.5" opacity="0.2">
        <path d="M0 210c90-4 180-10 270-6s180 12 270 8 180-10 270-6 180 8 270 4" />
        <path d="M0 198c110-6 220-8 330-4s220 10 330 6" opacity="0.6" />
      </g>
    </svg>
  );
}

function TopoTierMid() {
  return (
    <svg className="h-full w-full" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" fill="none">
      <path
        d="M0 300V230c50-10 100-22 150-18 50 4 100 20 150 16 50-4 100-24 150-20 50 4 100 18 150 14 50-4 100-22 150-18 50 4 100 16 150 12 50-4 100-20 150-16 50 4 100 22 150 18 50-4 100-14 150-10V300H0Z"
        fill="#141c24"
      />
      <g stroke="#5a6674" strokeWidth="0.65" opacity="0.28">
        <path d="M0 268c70-8 140-18 210-14 70 4 140 22 210 18 70-4 140-16 210-12 70 4 140 20 210 16" />
        <path d="M0 250c90-6 180-12 270-8s180 14 270 10" opacity="0.55" />
      </g>
    </svg>
  );
}

function TopoTierNear() {
  return (
    <svg className="h-full w-full" viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" fill="none">
      <path
        d="M0 360V280c40-14 80-30 120-26 40 4 80 28 120 24 40-4 80-32 120-28 40 4 80 26 120 22 40-4 80-28 120-24 40 4 80 24 120 20 40-4 80-26 120-22 40 4 80 30 120 26 40-4 80-22 120-18V360H0Z"
        fill="#0a0e14"
      />
      <g stroke="#3a4654" strokeWidth="0.8" opacity="0.35">
        <path d="M0 320c55-12 110-24 165-20 55 4 110 28 165 24 55-4 110-22 165-18 55 4 110 26 165 22" />
        <path d="M0 300c65-8 130-16 195-12 65 4 130 22 195 18" opacity="0.5" />
      </g>
    </svg>
  );
}

export const observatoryLandscapeStyle = {
  transitionDuration: `${THRESHOLD_MOTION.crossingSec}s`,
} as const;
