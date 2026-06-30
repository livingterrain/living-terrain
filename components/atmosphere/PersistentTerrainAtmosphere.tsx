"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { FieldTexture } from "@/components/design-system";
import {
  atmosphereMorphForPath,
  themeBackgroundForPath,
} from "@/lib/atmosphere/atmosphere-profile";
import { useCircadian } from "@/lib/atmosphere/useCircadian";
import { NAVIGATION } from "@/lib/atmosphere/tempo";

const STARS = Array.from({ length: 64 }, (_, i) => ({
  x: ((i * 127.1) % 1000) / 10,
  y: ((i * 311.7) % 1000) / 10,
  o: 0.14 + (i % 7) * 0.05,
  r: i % 11 === 0 ? 1.15 : 0.7,
}));

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: ((i * 53.7) % 100),
  y: ((i * 91.3) % 100),
  size: i % 6 === 0 ? 2.2 : 1.1,
  delay: (i % 9) * 1.4,
}));

const ease = NAVIGATION.ease;
const crossfade = NAVIGATION.zoneCrossfadeMs / 1000;

/**
 * Root atmosphere — mounted once, never resets. Morphs with route and circadian.
 */
export function PersistentTerrainAtmosphere() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const circadian = useCircadian();

  const morph = atmosphereMorphForPath(pathname, circadian);
  const themeBg = themeBackgroundForPath(pathname);
  const duration = reduced ? 0.01 : crossfade;

  const starField = useMemo(
    () =>
      STARS.map((s) => (
        <circle
          key={`star-${s.x}-${s.y}`}
          cx={s.x}
          cy={s.y}
          r={s.r * 0.11}
          fill="currentColor"
          opacity={s.o}
        />
      )),
    [],
  );

  return (
    <div
      className="terrain-atmosphere pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
      data-route-zone={pathname}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor: morph.voidColor,
          opacity: morph.voidOpacity,
        }}
        transition={{ duration, ease }}
      />

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
          background: `radial-gradient(ellipse 88% 78% at 50% 38%, ${morph.glowColor} 0%, transparent 62%)`,
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
          background: `radial-gradient(ellipse 92% 82% at 50% 40%, ${morph.paperColor} 0%, #ebe4d6 55%, #e0d8c8 100%)`,
        }}
        animate={{ opacity: morph.paperOpacity }}
        transition={{ duration, ease }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: morph.fieldOpacity }}
        transition={{ duration, ease }}
      >
        <FieldTexture className="relative h-full w-full" />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 120% 90% at 50% 100%, rgba(0,0,0,0.35) 0%, transparent 55%)`,
          mixBlendMode: "multiply",
        }}
        animate={{
          opacity: morph.fogOpacity,
          background: `radial-gradient(ellipse 120% 90% at 50% 100%, color-mix(in srgb, #1a1814 ${Math.round(morph.fogWarmth * 100)}%, #0a1428) 0%, transparent 58%)`,
        }}
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
            className="terrain-atmosphere-mote absolute rounded-full bg-white/80"
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
    </div>
  );
}
