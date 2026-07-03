"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { DistantConstellations } from "./DistantConstellations";
import { useAmbientScroll } from "@/lib/atmosphere/use-ambient-scroll";
import { CIRCADIAN_SSR_SNAPSHOT } from "@/lib/atmosphere/circadian";
import { useCircadian } from "@/lib/atmosphere/useCircadian";
import { useLayoutSettled } from "@/lib/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { attentionGlow, starFieldStrength } from "@/lib/wonder/arrival";

interface ThresholdAtmosphereProps {
  /** 0–1 — distant stars brighten when crossing */
  starBrightness?: number;
  /** 1 = resting, higher = thicker when crossing */
  fogDensity?: number;
  /** When true, fog recedes so the graph layer stays sharp */
  clarity?: boolean;
  /** Cinematic pull-back — stars, dust, and light expand with the universe */
  revealProgress?: number;
  /** Wonder awakening master clock 0–1 */
  awakeningProgress?: number;
  /** 4–8s refinement after map is visible */
  atmosphereRefinement?: number;
  /** Elapsed ms for star ignition curves */
  elapsedMs?: number;
  /** Normalized viewport attention for curiosity response */
  attention?: { x: number; y: number } | null;
  /** False during Chrome static hold — only void base renders */
  atmosphereLive?: boolean;
  /** Gates parallax / fog motion until Chrome first paint settles */
  backgroundMotionActive?: boolean;
}

export function ThresholdAtmosphere({
  starBrightness = 0.35,
  fogDensity = 1,
  clarity = false,
  revealProgress = 0,
  awakeningProgress = 0,
  atmosphereRefinement: atmosphereRefine = 0,
  elapsedMs = 0,
  attention = null,
  atmosphereLive = true,
  backgroundMotionActive = true,
}: ThresholdAtmosphereProps) {
  const liveCircadian = useCircadian();
  const layoutSettled = useLayoutSettled();
  const circadian = layoutSettled ? liveCircadian : CIRCADIAN_SSR_SNAPSHOT;
  const scrollOffset = useAmbientScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const scrollY = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 16, damping: 44, mass: 1.5 });
  const py = useSpring(my, { stiffness: 16, damping: 44, mass: 1.5 });
  const scrollSpring = useSpring(scrollY, { stiffness: 22, damping: 42, mass: 1.1 });
  const starX = useTransform(px, (v) => v * (clarity ? 3 : 6));
  const starY = useTransform(py, (v) => v * (clarity ? 2.5 : 5));
  const farStarX = useTransform(px, (v) => v * (clarity ? 1.1 : 2.2));
  const farStarY = useTransform(py, (v) => v * (clarity ? 0.9 : 1.8));
  const depthX = useTransform(px, (v) => v * 10);
  const depthY = useTransform(py, (v) => v * 8);
  const fogX = useTransform(px, (v) => v * 4);
  const fogY = useTransform(py, (v) => v * 3);
  const fogScrollA = useTransform(scrollSpring, (s) => s * -0.018);
  const fogScrollB = useTransform(scrollSpring, (s) => s * -0.032);
  const fogScrollC = useTransform(scrollSpring, (s) => s * -0.012);
  const dustScroll = useTransform(scrollSpring, (s) => s * -0.008);

  useEffect(() => {
    scrollY.set(scrollOffset);
  }, [scrollOffset, scrollY]);

  useEffect(() => {
    if (!atmosphereLive || !backgroundMotionActive) return;
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
  }, [mx, my, atmosphereLive, backgroundMotionActive]);

  const deepSpace = clarity;
  const reveal = Math.max(0, Math.min(1, revealProgress));
  const awakening = Math.max(0, Math.min(1, awakeningProgress || reveal));
  const starAwaken = starFieldStrength(awakening, elapsedMs);
  const atmosphereTail = Math.max(0, Math.min(1, atmosphereRefine));
  const clarityBoost = circadian.clarityMul;
  const voidColor = deepSpace ? "#020408" : "#06080c";
  const starFill = deepSpace ? "#dce4f4" : circadian.starColor;

  const distantStars = useMemo(
    () =>
      Array.from({ length: deepSpace ? 420 : 180 }, (_, i) => ({
        id: i,
        x: ((i * 127.1) % 1000) / 10,
        y: ((i * 311.7) % 1000) / 10,
        opacity: deepSpace
          ? 0.05 + (i % 9) * 0.022
          : 0.12 + (i % 9) * 0.04,
        size: deepSpace
          ? i % 47 === 0
            ? 1.1
            : i % 19 === 0
              ? 0.85
              : 0.55
          : i % 23 === 0
            ? 1.25
            : 0.75,
        twinkle: deepSpace ? i % 53 === 0 : i % 31 === 0,
        bud: deepSpace ? false : i % 47 === 0,
      })),
    [deepSpace],
  );

  const tinyDistantStars = useMemo(
    () =>
      Array.from({ length: deepSpace ? 280 : 0 }, (_, i) => ({
        id: i,
        x: ((i * 419.3 + 17) % 1000) / 10,
        y: ((i * 271.9 + 53) % 1000) / 10,
        opacity: 0.018 + (i % 7) * 0.008,
        size: i % 31 === 0 ? 0.65 : 0.35,
        twinkle: i % 67 === 0,
      })),
    [deepSpace],
  );

  const dustNear = useMemo(() => genDust(deepSpace ? 0 : 5, 1), [deepSpace]);
  const dustMid = useMemo(() => genDust(deepSpace ? 0 : 4, 2), [deepSpace]);
  const dustFar = useMemo(() => genDust(deepSpace ? 0 : 3, 3), [deepSpace]);
  const driftingMotes = useMemo(
    () => genDriftingMotes(deepSpace ? 10 : 8, deepSpace ? 0.28 : circadian.particleMul),
    [deepSpace, circadian.particleMul],
  );

  const effectiveStarBrightness = deepSpace
    ? starBrightness * circadian.starMul * (0.12 + starAwaken * 0.88)
    : starBrightness * circadian.starMul * (0.28 + reveal * 0.72);
  const fogOpacityA = deepSpace
    ? 0
    : (0.058 * fogDensity) * circadian.fogMul * clarityBoost * (1 - reveal * 0.35);
  const fogOpacityB = deepSpace
    ? 0
    : (0.048 * fogDensity) * circadian.fogMul * clarityBoost * (1 - reveal * 0.3);
  const fogOpacityC = deepSpace
    ? 0
    : (0.04 * fogDensity) * circadian.fogMul * clarityBoost * (1 - reveal * 0.25);
  const dustScale =
    (0.15 + reveal * 0.85) *
    (circadian.phase === "night" ? 0.72 : circadian.phase === "afternoon" ? 1.05 : 1);
  const ambientLightOpacity = deepSpace ? 0 : (0.55 + reveal * 0.45) * clarityBoost;
  const showVolumetric = !deepSpace && (fogOpacityA > 0 || fogOpacityB > 0 || fogOpacityC > 0);
  const showDust =
    !deepSpace && (dustNear.length > 0 || dustMid.length > 0 || dustFar.length > 0);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        deepSpace && "threshold-atmosphere--deep-space",
      )}
    >
      {/* Base darkness */}
      <div
        className="absolute inset-0 transition-[background-color] duration-[300s]"
        style={{ backgroundColor: voidColor }}
      />

      {deepSpace && atmosphereLive && (
        <div className="threshold-nebula-field absolute inset-0" aria-hidden />
      )}

      {atmosphereLive && (
      <div className="threshold-atmosphere-live absolute inset-0">
      <motion.div
        className="absolute inset-[-3%]"
        style={{ x: starX, y: starY }}
      >
        <div
          className="absolute inset-0 transition-opacity duration-[1.1s] ease-out"
          style={{ opacity: effectiveStarBrightness }}
        >
          {distantStars.map((s) => {
            const sx = s.x / 100;
            const sy = s.y / 100;
            const attentionLift = attention
              ? attentionGlow(attention.x, attention.y, sx, sy, 0.22)
              : 0;
            return (
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
                backgroundColor: starFill,
                opacity: s.opacity * (1 + attentionLift),
                animationDelay: `${(s.id % 17) * 0.7}s`,
                transition: "opacity 1.4s cubic-bezier(0.45, 0.05, 0.55, 0.95)",
              }}
            />
            );
          })}
        </div>
      </motion.div>

      {/* Deepest pinpricks — slower parallax */}
      {deepSpace && tinyDistantStars.length > 0 && (
        <motion.div
          className="absolute inset-[-5%]"
          style={{ x: farStarX, y: farStarY }}
        >
          <div
            className="absolute inset-0 transition-opacity duration-[1.4s] ease-out"
            style={{ opacity: effectiveStarBrightness * 0.55 * (starAwaken + atmosphereTail * 0.15) }}
          >
            {tinyDistantStars.map((s) => {
              const sx = s.x / 100;
              const sy = s.y / 100;
              const attentionLift = attention
                ? attentionGlow(attention.x, attention.y, sx, sy, 0.16) * 0.7
                : 0;
              return (
                <span
                  key={`tiny-${s.id}`}
                  className={cn("absolute rounded-full", s.twinkle && "star-twinkle")}
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: s.size,
                    height: s.size,
                    backgroundColor: starFill,
                    opacity: s.opacity * (1 + attentionLift),
                    animationDelay: `${(s.id % 23) * 1.1}s`,
                    transition: "opacity 1.6s cubic-bezier(0.45, 0.05, 0.55, 0.95)",
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Distant unnamed constellations — periphery only, never dominant */}
      {!deepSpace && (clarity || reveal > 0.08) && (
        <div
          className="absolute inset-0 transition-opacity duration-[2.5s]"
          style={{ opacity: 0.35 + reveal * 0.35 }}
        >
          <DistantConstellations visible />
        </div>
      )}
      {deepSpace && (
        <div
          className="absolute inset-0 transition-opacity duration-[2.5s]"
          style={{ opacity: 0.07 }}
        >
          <DistantConstellations visible />
        </div>
      )}

      {/* Warm depth gradient — threshold only; map light comes from the chamber */}
      {!deepSpace && (
        <motion.div
          className="absolute inset-[-2%] atmosphere-breathe-slow transition-opacity duration-[2.5s]"
          style={{
            x: depthX,
            y: depthY,
            opacity: ambientLightOpacity,
            background: `radial-gradient(ellipse 70% 55% at 50% 18%, ${circadian.ambientTop} 0%, transparent 65%)`,
          }}
        />
      )}

      {showVolumetric && (
        <>
          {/* Ethereal mist — far layer */}
          <motion.div
            className="absolute inset-[-22%] transition-opacity duration-[2.5s]"
            style={{
              x: fogX,
              y: fogY,
              translateY: fogScrollA,
              opacity: fogOpacityA,
            }}
          >
            <div className="threshold-fog threshold-fog-a absolute inset-0 atmosphere-breathe-fog" />
          </motion.div>

          {/* Ethereal mist — mid layer */}
          <motion.div
            className="absolute inset-[-28%] transition-opacity duration-[2.5s]"
            style={{
              x: fogX,
              y: fogY,
              translateY: fogScrollB,
              opacity: fogOpacityB,
            }}
          >
            <div className="threshold-fog threshold-fog-b absolute inset-0" />
          </motion.div>

          {/* Low-lying fog — nearest depth, feathered into void */}
          <motion.div
            className="absolute inset-[-18%] transition-opacity duration-[2.5s]"
            style={{
              x: fogX,
              y: fogY,
              translateY: fogScrollC,
              opacity: fogOpacityC,
            }}
          >
            <div className="threshold-fog threshold-fog-c absolute inset-0 atmosphere-breathe-fog-slow" />
          </motion.div>
        </>
      )}

      {showDust && (
        <>
          {/* Dust — far */}
          <DustLayer particles={dustFar} parallax={px} parallaxY={py} scrollY={dustScroll} factor={0.3} opacityScale={dustScale} particleMul={circadian.particleMul} />
          {/* Dust — mid */}
          <DustLayer particles={dustMid} parallax={px} parallaxY={py} scrollY={dustScroll} factor={0.55} opacityScale={dustScale} particleMul={circadian.particleMul} />
          {/* Dust — near */}
          <DustLayer particles={dustNear} parallax={px} parallaxY={py} scrollY={dustScroll} factor={0.85} opacityScale={dustScale} particleMul={circadian.particleMul} />
        </>
      )}

      {/* Ultra-slow drifting motes — faint cosmic dust */}
      {(deepSpace || clarity || reveal > 0.12) && driftingMotes.length > 0 && (
        <motion.div
          className="absolute inset-0 transition-opacity duration-[3s]"
          style={{
            opacity: deepSpace ? starAwaken * 0.35 + atmosphereTail * 0.12 : reveal > 0 ? reveal : 1,
            y: dustScroll,
          }}
        >
          {driftingMotes.map((m) => {
            const mx = m.left / 100;
            const my = m.top / 100;
            const driftToward = attention
              ? attentionGlow(attention.x, attention.y, mx, my, 0.14) * 0.4
              : 0;
            return (
            <span
              key={m.id}
              className={cn(
                "atmosphere-dust-mote absolute rounded-full",
                deepSpace ? "bg-[#c8d0dc]" : "bg-[#b8b0a4]",
                m.glint && "atmosphere-dust-glint",
              )}
              style={{
                left: `${m.left + (attention ? (attention.x - mx) * driftToward * 8 : 0)}%`,
                top: `${m.top + (attention ? (attention.y - my) * driftToward * 8 : 0)}%`,
                width: m.size,
                height: m.size,
                opacity: deepSpace ? 0.12 + driftToward : undefined,
                animationDuration: `${m.duration}s`,
                animationDelay: `${m.delay}s`,
                transition: "left 3.2s ease-out, top 3.2s ease-out, opacity 2.4s ease-out",
              }}
            />
            );
          })}
        </motion.div>
      )}

      </div>
      )}

      {/* Edge falloff — deep space reads as infinite, not enclosed */}
      {atmosphereLive && (
      <div
        className={cn(
          "threshold-ambient-vignette absolute inset-0",
          deepSpace && "threshold-ambient-vignette--deep",
        )}
        aria-hidden
      />
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
    duration: (62 + (i % 5) * 18) * particleMul,
    delay: i * 4.1,
    glint: i % 5 === 0 || i % 7 === 2,
  }));
}

function genDust(count: number, depth: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${depth}-${i}`,
    left: ((i * 47 + depth * 13) % 90) + 5,
    top: ((i * 61 + depth * 29) % 85) + 8,
    size: depth === 1 ? 1.5 : depth === 2 ? 1 : 0.75,
    opacity: depth === 1 ? 0.1 : depth === 2 ? 0.065 : 0.038,
    duration: 110 + depth * 35 + i * 12,
    delay: i * 5.5,
    driftX: (i % 2 === 0 ? 1 : -1) * (6 + depth * 3),
    driftY: 3 + depth * 2,
    glint: depth === 1 && i % 3 === 0,
  }));
}

function DustLayer({
  particles,
  parallax,
  parallaxY,
  scrollY,
  factor,
  opacityScale = 1,
  particleMul = 1,
}: {
  particles: ReturnType<typeof genDust>;
  parallax: ReturnType<typeof useSpring>;
  parallaxY: ReturnType<typeof useSpring>;
  scrollY: ReturnType<typeof useSpring>;
  factor: number;
  opacityScale?: number;
  particleMul?: number;
}) {
  const x = useTransform(parallax, (v) => v * factor * 2);
  const y = useTransform(parallaxY, (v) => v * factor * 1.5);

  return (
    <motion.div className="absolute inset-0" style={{ x, y, translateY: scrollY }}>
      {particles.map((p) => (
        <span
          key={p.id}
          className={cn(
            "atmosphere-dust-particle absolute rounded-full bg-[#c8c0b4]",
            p.glint && "atmosphere-dust-glint",
          )}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity * opacityScale,
            ["--dust-drift-x" as string]: `${p.driftX}px`,
            ["--dust-drift-y" as string]: `${p.driftY}px`,
            ["--dust-duration" as string]: `${p.duration * particleMul}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </motion.div>
  );
}
