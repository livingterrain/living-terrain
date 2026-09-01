"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { ltRegionForPath, type LtRegion } from "@/lib/atmosphere/lt-region";
import { THRESHOLD_MOTION } from "@/lib/design-system/threshold";

const POINTS = Array.from({ length: 28 }, (_, i) => ({
  x: ((i * 127.1) % 1000) / 10,
  y: ((i * 311.7) % 1000) / 10,
  o: 0.12 + (i % 5) * 0.04,
  r: i % 11 === 0 ? 1.1 : 0.55,
}));

const ease = THRESHOLD_MOTION.ease;
const crossfade = THRESHOLD_MOTION.zoneCrossfadeMs / 1000;

/**
 * Shared V2 field — near-black depth, grain, points, sparse geometry.
 * Replaces taupe/gray landscape + paper-wash atmosphere.
 * Home owns its own field; this paints every other public region.
 */
export function PersistentTerrainAtmosphere() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const region: LtRegion = ltRegionForPath(pathname);
  const duration = reduced ? 0.01 : crossfade;

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (pathname === "/") {
      root.removeAttribute("data-lt-region");
      return;
    }
    root.setAttribute("data-lt-region", region);
    return () => root.removeAttribute("data-lt-region");
  }, [pathname, region]);

  const points = useMemo(
    () =>
      POINTS.map((p) => (
        <circle
          key={`${p.x}-${p.y}`}
          cx={p.x}
          cy={p.y}
          r={p.r * 0.08}
          fill="currentColor"
          opacity={p.o}
        />
      )),
    [],
  );

  if (pathname === "/") return null;

  return (
    <div
      className="lt-field terrain-atmosphere"
      aria-hidden
      data-lt-region={region}
      data-route-zone={pathname}
    >
      <div className="lt-field__void" />
      <motion.div
        className="lt-field__depth"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration, ease }}
      />
      <div className="lt-field__orbit" />
      <div className="lt-field__axis" />
      <div className="lt-field__horizon" />
      <div className="lt-field__ecliptic" aria-hidden>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <path
            className="lt-field__ecliptic-arc"
            d="M 8 62 Q 38 48 62 52 T 96 38"
          />
          <path
            className="lt-field__ecliptic-arc lt-field__ecliptic-arc--soft"
            d="M 4 28 Q 42 18 70 34 T 102 22"
          />
          <line
            className="lt-field__ecliptic-line"
            x1="18"
            y1="8"
            x2="22"
            y2="92"
          />
          <line
            className="lt-field__ecliptic-line"
            x1="78"
            y1="12"
            x2="71"
            y2="88"
          />
          <circle className="lt-field__ecliptic-node" cx="38" cy="49" r="0.35" />
          <circle className="lt-field__ecliptic-node" cx="62" cy="52" r="0.28" />
          <circle className="lt-field__ecliptic-node" cx="70" cy="34" r="0.32" />
          <circle className="lt-field__ecliptic-node" cx="22" cy="55" r="0.22" />
        </svg>
      </div>
      <div className="lt-field__refraction" aria-hidden />
      <motion.svg
        className="lt-field__points absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration, ease }}
      >
        {points}
      </motion.svg>
      {region === "observatory" && (
        <div className="lt-field__drift" aria-hidden />
      )}
      <div className="lt-field__grain" />
      <div className="lt-field__vignette" />
    </div>
  );
}
