"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { DistantConstellations } from "./DistantConstellations";
import { useCircadian } from "@/lib/atmosphere/useCircadian";
import { cn } from "@/lib/utils";

interface ThresholdAtmosphereProps {
  /** 0–1 — distant stars brighten when crossing */
  starBrightness?: number;
  /** 1 = resting, higher = thicker when crossing */
  fogDensity?: number;
  /** When true, fog recedes so the graph layer stays sharp */
  clarity?: boolean;
  /** Cinematic pull-back — stars, dust, and light expand with the universe */
  revealProgress?: number;
}

export function ThresholdAtmosphere({
  starBrightness = 0.35,
  fogDensity = 1,
  clarity = false,
  revealProgress = 0,
}: ThresholdAtmosphereProps) {
  const circadian = useCircadian();
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 20, damping: 40, mass: 1.5 });
  const py = useSpring(my, { stiffness: 20, damping: 40, mass: 1.5 });
  const starX = useTransform(px, (v) => v * 6);
  const starY = useTransform(py, (v) => v * 5);
  const depthX = useTransform(px, (v) => v * 10);
  const depthY = useTransform(py, (v) => v * 8);
  const fogX = useTransform(px, (v) => v * 4);
  const fogY = useTransform(py, (v) => v * 3);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    function onMove(e: MouseEvent) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx.set((e.clientX / w - 0.5) * 0.35);
      my.set((e.clientY / h - 0.5) * 0.25);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const distantStars = useMemo(
    () =>
      Array.from({ length: 180 }, (_, i) => ({
        id: i,
        x: ((i * 127.1) % 1000) / 10,
        y: ((i * 311.7) % 1000) / 10,
        opacity: 0.12 + (i % 9) * 0.04,
        size: i % 23 === 0 ? 1.25 : 0.75,
        twinkle: i % 31 === 0,
        bud: i % 47 === 0,
      })),
    [],
  );

  const dustNear = useMemo(() => genDust(clarity ? 9 : 5, 1), [clarity]);
  const dustMid = useMemo(() => genDust(clarity ? 7 : 4, 2), [clarity]);
  const dustFar = useMemo(() => genDust(clarity ? 6 : 3, 3), [clarity]);
  const driftingMotes = useMemo(
    () => genDriftingMotes(clarity ? 14 : 8, circadian.particleMul),
    [clarity, circadian.particleMul],
  );

  const reveal = Math.max(0, Math.min(1, revealProgress));
  const clarityBoost = circadian.clarityMul;
  const effectiveStarBrightness =
    starBrightness * circadian.starMul * (0.28 + reveal * 0.72);
  const fogOpacityA =
    (clarity ? 0.018 * fogDensity : 0.045 * fogDensity) *
    circadian.fogMul *
    clarityBoost *
    (1 - reveal * 0.35);
  const fogOpacityB =
    (clarity ? 0.014 * fogDensity : 0.035 * fogDensity) *
    circadian.fogMul *
    clarityBoost *
    (1 - reveal * 0.3);
  const dustScale =
    (clarity ? 0.35 + reveal * 0.65 : 0.15 + reveal * 0.85) *
    (circadian.phase === "night" ? 0.72 : circadian.phase === "afternoon" ? 1.05 : 1);
  const ambientLightOpacity = (0.55 + reveal * 0.45) * clarityBoost;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden atmosphere-breathe-root">
      {/* Base darkness */}
      <div
        className="absolute inset-0 transition-[background-color] duration-[300s]"
        style={{ backgroundColor: circadian.voidBase }}
      />

      {/* Distant star field — deepest layer */}
      <motion.div
        className="absolute inset-[-3%]"
        style={{ x: starX, y: starY }}
      >
        <div
          className="absolute inset-0 transition-opacity duration-[2.8s] ease-out"
          style={{ opacity: effectiveStarBrightness }}
        >
          {distantStars.map((s) => (
            <span
              key={s.id}
              className={cn(
                "absolute rounded-full",
                s.bud && "star-bud",
                s.twinkle && !s.bud && "star-twinkle",
              )}
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                backgroundColor: circadian.starColor,
                opacity: s.opacity,
                animationDelay: `${(s.id % 17) * 0.7}s`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Distant unnamed constellations — periphery of the universe */}
      {(clarity || reveal > 0.08) && (
        <div
          className="absolute inset-0 transition-opacity duration-[2.5s]"
          style={{ opacity: 0.35 + reveal * 0.35 }}
        >
          <DistantConstellations visible />
        </div>
      )}

      {/* Warm depth gradient — breathes with the void */}
      <motion.div
        className="absolute inset-[-2%] atmosphere-breathe-slow transition-opacity duration-[2.5s]"
        style={{
          x: depthX,
          y: depthY,
          opacity: ambientLightOpacity,
          background: `radial-gradient(ellipse 70% 55% at 50% 18%, ${circadian.ambientTop} 0%, transparent 65%)`,
        }}
      />

      {/* Volumetric fog — two layers drifting */}
      <motion.div
        className="absolute inset-[-20%] transition-opacity duration-[2.5s]"
        style={{
          x: fogX,
          y: fogY,
          opacity: fogOpacityA,
        }}
      >
        <div className="threshold-fog threshold-fog-a absolute inset-0 atmosphere-breathe-fog" />
      </motion.div>
      <motion.div
        className="absolute inset-[-25%] transition-opacity duration-[2.5s]"
        style={{
          x: fogX,
          y: fogY,
          opacity: fogOpacityB,
        }}
      >
        <div className="threshold-fog threshold-fog-b absolute inset-0" />
      </motion.div>

      {/* Dust — far */}
      <DustLayer particles={dustFar} parallax={px} parallaxY={py} factor={0.3} opacityScale={dustScale} particleMul={circadian.particleMul} />
      {/* Dust — mid */}
      <DustLayer particles={dustMid} parallax={px} parallaxY={py} factor={0.55} opacityScale={dustScale} particleMul={circadian.particleMul} />
      {/* Dust — near */}
      <DustLayer particles={dustNear} parallax={px} parallaxY={py} factor={0.85} opacityScale={dustScale} particleMul={circadian.particleMul} />

      {/* Ultra-slow drifting motes — visible as the universe assembles */}
      {(clarity || reveal > 0.12) && (
        <div
          className="absolute inset-0 transition-opacity duration-[2.5s]"
          style={{ opacity: reveal > 0 ? reveal : 1 }}
        >
          {driftingMotes.map((m) => (
            <span
              key={m.id}
              className="atmosphere-dust-mote absolute rounded-full bg-[#b8b0a4]"
              style={{
                left: `${m.left}%`,
                top: `${m.top}%`,
                width: m.size,
                height: m.size,
                animationDuration: `${m.duration}s`,
                animationDelay: `${m.delay}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function genDriftingMotes(count: number, particleMul = 1) {
  return Array.from({ length: count }, (_, i) => ({
    id: `mote-${i}`,
    left: ((i * 53 + 11) % 94) + 3,
    top: ((i * 71 + 17) % 90) + 5,
    size: i % 4 === 0 ? 1.25 : 0.85,
    duration: (48 + (i % 5) * 14) * particleMul,
    delay: i * 3.2,
  }));
}

function genDust(count: number, depth: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${depth}-${i}`,
    left: ((i * 47 + depth * 13) % 90) + 5,
    top: ((i * 61 + depth * 29) % 85) + 8,
    size: depth === 1 ? 1.5 : depth === 2 ? 1 : 0.75,
    opacity: depth === 1 ? 0.14 : depth === 2 ? 0.09 : 0.05,
    duration: 80 + depth * 25 + i * 8,
    delay: i * 4,
    driftX: (i % 2 === 0 ? 1 : -1) * (8 + depth * 4),
    driftY: 4 + depth * 2,
  }));
}

function DustLayer({
  particles,
  parallax,
  parallaxY,
  factor,
  opacityScale = 1,
  particleMul = 1,
}: {
  particles: ReturnType<typeof genDust>;
  parallax: ReturnType<typeof useSpring>;
  parallaxY: ReturnType<typeof useSpring>;
  factor: number;
  opacityScale?: number;
  particleMul?: number;
}) {
  const x = useTransform(parallax, (v) => v * factor * 2);
  const y = useTransform(parallaxY, (v) => v * factor * 1.5);

  return (
    <motion.div className="absolute inset-0" style={{ x, y }}>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-[#c8c0b4]"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity * opacityScale,
          }}
          animate={{
            x: [0, p.driftX, 0],
            y: [0, p.driftY, 0],
          }}
          transition={{
            duration: p.duration * particleMul,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </motion.div>
  );
}
