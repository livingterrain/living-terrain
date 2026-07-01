"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { FieldTexture } from "@/components/design-system";
import {
  atmosphereMorphForPath,
  themeBackgroundForPath,
} from "@/lib/atmosphere/atmosphere-profile";
import {
  depthForPath,
  locationForPath,
  placeForPath,
} from "@/lib/atmosphere/observatory-depth";
import { useCircadian } from "@/lib/atmosphere/useCircadian";
import { THRESHOLD_MOTION } from "@/lib/design-system/threshold";
import { isMapPath } from "@/lib/atmosphere/navigation";
import { ObservatoryLandscapeBackdrop } from "./ObservatoryLandscapeBackdrop";

const STARS = Array.from({ length: 52 }, (_, i) => ({
  x: ((i * 127.1) % 1000) / 10,
  y: ((i * 311.7) % 1000) / 10,
  o: 0.1 + (i % 7) * 0.035,
  r: i % 13 === 0 ? 1 : 0.6,
}));

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: ((i * 53.7) % 100),
  y: ((i * 91.3) % 100),
  size: i % 7 === 0 ? 1.4 : 0.85,
  delay: (i % 11) * 2.2,
}));

const ease = THRESHOLD_MOTION.ease;
const crossfade = THRESHOLD_MOTION.zoneCrossfadeMs / 1000;

/**
 * Root atmosphere — one continuous observatory landscape across every route.
 */
export function PersistentTerrainAtmosphere() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const circadian = useCircadian();

  const depth = depthForPath(pathname);
  const worldLocation = locationForPath(pathname);
  const place = placeForPath(pathname);
  const onMap = isMapPath(pathname);
  const morph = atmosphereMorphForPath(pathname, circadian, depth);
  const themeBg = themeBackgroundForPath(pathname);
  const duration = reduced ? 0.01 : crossfade;

  const starField = useMemo(
    () =>
      STARS.map((s) => (
        <circle
          key={`star-${s.x}-${s.y}`}
          cx={s.x}
          cy={s.y}
          r={s.r * 0.1}
          fill="currentColor"
          opacity={s.o}
        />
      )),
    [],
  );

  if (onMap) return null;

  return (
    <div
      className="terrain-atmosphere pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
      data-route-zone={pathname}
      data-observatory-depth={worldLocation}
      data-world-place={place}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor: morph.voidColor,
          opacity: morph.voidOpacity,
        }}
        transition={{ duration, ease }}
      />

      <ObservatoryLandscapeBackdrop depth={depth} />

      {themeBg && (
        <motion.div
          key={themeBg}
          className="absolute inset-0"
          style={{ background: themeBg }}
          initial={{ opacity: 0 }}
          animate={{ opacity: morph.themeOpacity }}
          transition={{ duration, ease }}
        />
      )}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 88% 72% at 50% ${42 - depth * 8}%, ${morph.glowColor} 0%, transparent 64%)`,
        }}
        animate={{ opacity: morph.glowOpacity }}
        transition={{ duration, ease }}
      />

      <motion.svg
        className="terrain-atmosphere-stars absolute inset-0 h-full w-full text-[var(--star-color)]"
        style={
          {
            "--star-drift": `${morph.starDriftSec}s`,
            "--star-color": morph.starColor,
          } as React.CSSProperties
        }
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        animate={{ opacity: morph.starOpacity }}
        transition={{ duration, ease }}
      >
        {starField}
      </motion.svg>

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 94% 86% at 50% 36%, ${morph.paperColor} 0%, transparent 58%)`,
        }}
        animate={{ opacity: morph.paperOpacity }}
        transition={{ duration, ease }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: morph.fieldOpacity }}
        transition={{ duration, ease }}
      >
        <FieldTexture className="relative h-full w-full opacity-60" />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 130% 95% at 50% 100%, color-mix(in srgb, #1a1814 ${Math.round(morph.fogWarmth * 100)}%, #0a1428) 0%, transparent 60%)`,
          mixBlendMode: "multiply",
        }}
        animate={{ opacity: morph.fogOpacity }}
        transition={{ duration, ease }}
      />

      <motion.div
        className="terrain-atmosphere-particles absolute inset-0"
        style={{ "--particle-drift": `${morph.particleDriftSec}s` } as React.CSSProperties}
        animate={{ opacity: morph.particleOpacity }}
        transition={{ duration, ease }}
      >
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="terrain-atmosphere-mote absolute rounded-full bg-[#d8dce4]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </motion.div>

      <div className="observatory-landscape__vignette absolute inset-0" />
    </div>
  );
}
