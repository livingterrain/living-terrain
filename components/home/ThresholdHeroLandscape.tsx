"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useAmbientScroll } from "@/lib/atmosphere/use-ambient-scroll";
import { cn } from "@/lib/utils";

interface ThresholdHeroLandscapeProps {
  crossing?: boolean;
  reducedMotion?: boolean;
}

const STARS = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  x: ((i * 127.1) % 1000) / 10,
  y: ((i * 89.3) % 380) / 10,
  size: i % 23 === 0 ? 1.2 : i % 9 === 0 ? 0.85 : 0.55,
  delay: (i % 17) * 0.55,
}));

/** Parallax depth tiers — scroll factors scaled for ~3× separation */
const DEPTH = {
  sky: 0.04,
  vanish: 0.07,
  far: 0.11,
  midFar: 0.16,
  mid: 0.22,
  near: 0.3,
  fore: 0.36,
  mistA: 0.13,
  mistB: 0.19,
  mistC: 0.25,
  mistD: 0.31,
  glow: 0.06,
} as const;

export function ThresholdHeroLandscape({
  crossing = false,
  reducedMotion = false,
}: ThresholdHeroLandscapeProps) {
  const scrollOffset = useAmbientScroll();
  const scrollY = useMotionValue(0);
  const scrollSpring = useSpring(scrollY, { stiffness: 22, damping: 42, mass: 1.1 });
  const mx = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 10, damping: 48, mass: 1.8 });

  const skyY = useTransform(scrollSpring, (s) => s * DEPTH.sky);
  const vanishY = useTransform(scrollSpring, (s) => s * DEPTH.vanish);
  const farY = useTransform(scrollSpring, (s) => s * DEPTH.far);
  const midFarY = useTransform(scrollSpring, (s) => s * DEPTH.midFar);
  const midY = useTransform(scrollSpring, (s) => s * DEPTH.mid);
  const nearY = useTransform(scrollSpring, (s) => s * DEPTH.near);
  const foreY = useTransform(scrollSpring, (s) => s * DEPTH.fore);
  const mistAY = useTransform(scrollSpring, (s) => s * DEPTH.mistA);
  const mistBY = useTransform(scrollSpring, (s) => s * DEPTH.mistB);
  const mistCY = useTransform(scrollSpring, (s) => s * DEPTH.mistC);
  const mistDY = useTransform(scrollSpring, (s) => s * DEPTH.mistD);
  const glowY = useTransform(scrollSpring, (s) => s * DEPTH.glow);

  const vanishX = useTransform(px, (v) => v * 4);
  const farX = useTransform(px, (v) => v * 7);
  const midFarX = useTransform(px, (v) => v * 10);
  const midX = useTransform(px, (v) => v * 14);
  const nearX = useTransform(px, (v) => v * 18);
  const foreX = useTransform(px, (v) => v * 22);

  useEffect(() => {
    scrollY.set(scrollOffset);
  }, [scrollOffset, scrollY]);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 0.08);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, reducedMotion]);

  const stars = useMemo(() => STARS, []);

  return (
    <div
      className={cn(
        "hero-landscape pointer-events-none absolute inset-0 overflow-hidden",
        crossing && "hero-landscape--crossing",
        reducedMotion && "hero-landscape--reduced",
      )}
      aria-hidden
    >
      <motion.div className="hero-landscape__sky absolute inset-0" style={{ y: skyY }} />
      <div className="hero-landscape__zenith-haze absolute inset-0" />

      <div className="hero-landscape__stars absolute inset-0">
        {stars.map((s) => (
          <span
            key={s.id}
            className="hero-landscape__star absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="hero-landscape__light-shaft hero-landscape__light-shaft--a absolute inset-0" />
      <div className="hero-landscape__light-shaft hero-landscape__light-shaft--b absolute inset-0" />

      <motion.div className="hero-landscape__horizon-glow absolute inset-0" style={{ y: glowY }} />
      <motion.div className="hero-landscape__observatory-rim absolute inset-x-0" style={{ y: glowY }} />

      <TerrainLayer className="hero-landscape__terrain hero-landscape__terrain--vanish" y={vanishY} x={vanishX}>
        <TopoVanish />
      </TerrainLayer>

      <MistShelf y={mistAY} variant="a" />

      <TerrainLayer className="hero-landscape__terrain hero-landscape__terrain--far" y={farY} x={farX}>
        <TopoFar />
      </TerrainLayer>

      <MistShelf y={mistBY} variant="b" />

      <TerrainLayer className="hero-landscape__terrain hero-landscape__terrain--mid-far" y={midFarY} x={midFarX}>
        <TopoMidFar />
      </TerrainLayer>

      <MistShelf y={mistCY} variant="c" />

      <TerrainLayer className="hero-landscape__terrain hero-landscape__terrain--mid" y={midY} x={midX}>
        <TopoMid />
      </TerrainLayer>

      <MistShelf y={mistDY} variant="d" />

      <TerrainLayer className="hero-landscape__terrain hero-landscape__terrain--near" y={nearY} x={nearX}>
        <TopoNear />
      </TerrainLayer>

      <TerrainLayer className="hero-landscape__terrain hero-landscape__terrain--fore" y={foreY} x={foreX}>
        <TopoFore />
      </TerrainLayer>

      <div className="hero-landscape__valley absolute inset-x-0 bottom-0" />
      <div className="hero-landscape__ground-fog absolute inset-x-0 bottom-0" />
      <div className="hero-landscape__fog-veil hero-landscape__fog-veil--ambient absolute inset-0" />

      <motion.div className="hero-landscape__horizon-line absolute inset-x-0" style={{ y: glowY }} />

      <div className="hero-landscape__vignette absolute inset-0" />
      <div className="hero-landscape__text-lift absolute inset-0" />
    </div>
  );
}

function TerrainLayer({
  children,
  className,
  y,
  x,
}: {
  children: React.ReactNode;
  className?: string;
  y: MotionValue<number>;
  x: MotionValue<number>;
}) {
  return (
    <motion.div
      className={cn("absolute inset-x-0 bottom-0", className)}
      style={{ y, x }}
    >
      {children}
    </motion.div>
  );
}

function MistShelf({
  y,
  variant,
}: {
  y: MotionValue<number>;
  variant: "a" | "b" | "c" | "d";
}) {
  return (
    <motion.div className="absolute inset-0" style={{ y }}>
      <div className={cn("hero-landscape__mist-shelf absolute inset-0", `hero-landscape__mist-shelf--${variant}`)} />
    </motion.div>
  );
}

/** Distant contours — barely visible, dissolving into sky */
function TopoVanish() {
  return (
    <svg className="hero-landscape__svg w-full" viewBox="0 0 1440 280" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <g stroke="#8898a8" strokeWidth="0.6" fill="none" opacity="0.22">
        <path d="M0 248c120-6 240-14 360-10s240 18 360 14 240-16 360-12 240 12 360 8" />
        <path d="M0 232c100-8 220-12 340-8s260 16 380 12 240-14 360-10 240 10 360 6" opacity="0.7" />
        <path d="M0 216c140-4 280-10 420-6s280 14 420 10 280-12 420-8" opacity="0.5" />
      </g>
      <path
        d="M0 280V248c80-4 160-12 240-8 80 4 160 16 240 12 80-4 160-14 240-10 80 4 160 18 240 14 80-4 160-16 240-12 80 4 160 20 240 16V280H0Z"
        fill="url(#topo-vanish-fill)"
      />
      <defs>
        <linearGradient id="topo-vanish-fill" x1="720" y1="200" x2="720" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e2834" stopOpacity="0.35" />
          <stop offset="1" stopColor="#141c26" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TopoFar() {
  return (
    <svg className="hero-landscape__svg w-full" viewBox="0 0 1440 340" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <path
        d="M0 340V268c60-8 120-22 180-18 60 4 120 20 180 16 60-4 120-24 180-20 60 4 120 22 180 18 60-4 120-20 180-16 60 4 120 24 180 20 60-4 120-18 180-14 60 4 120 20 180 16 60-4 120-22 180-18 60 4 120 18 180 14 60-4 120-16 180-12V340H0Z"
        fill="url(#topo-far-fill)"
      />
      <g stroke="#6a7888" strokeWidth="0.75" fill="none" opacity="0.28">
        <path d="M0 290c90-10 180-18 270-14s180 22 270 18 180-20 270-16 180 16 270 12 180-14 270-10 180 12 270 8" />
        <path d="M0 274c110-6 220-14 330-10s220 18 330 14 220-16 330-12" opacity="0.65" />
        <path d="M0 258c80-8 160-16 240-12 80 4 160 20 240 16 80-4 160-18 240-14 80 4 160 16 240 12" opacity="0.45" />
        <path d="M0 242c130-4 260-10 390-6s260 14 390 10" opacity="0.35" />
      </g>
      <defs>
        <linearGradient id="topo-far-fill" x1="720" y1="220" x2="720" y2="340" gradientUnits="userSpaceOnUse">
          <stop stopColor="#242e3a" />
          <stop offset="0.5" stopColor="#1a222c" />
          <stop offset="1" stopColor="#121820" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TopoMidFar() {
  return (
    <svg className="hero-landscape__svg w-full" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <path
        d="M0 400V310c70-14 140-32 210-28 70 4 140 28 210 24 70-4 140-30 210-26 70 4 140 26 210 22 70-4 140-28 210-24 70 4 140 30 210 26 70-4 140-26 210-22 70 4 140 24 210 20 70-4 140-22 210-18V400H0Z"
        fill="url(#topo-midfar-fill)"
      />
      <g stroke="#5a6674" strokeWidth="0.85" fill="none" opacity="0.32">
        <path d="M0 348c80-12 160-24 240-20 80 4 160 26 240 22 80-4 160-22 240-18 80 4 160 24 240 20 80-4 160-20 240-16 80 4 160 22 240 18" />
        <path d="M0 328c100-8 200-18 300-14s200 20 300 16 200-18 300-14" opacity="0.6" />
        <path d="M0 308c120-6 240-14 360-10s240 16 360 12 240-14 360-10" opacity="0.45" />
      </g>
      <defs>
        <linearGradient id="topo-midfar-fill" x1="720" y1="260" x2="720" y2="400" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1c242e" />
          <stop offset="0.55" stopColor="#141c24" />
          <stop offset="1" stopColor="#0e141c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TopoMid() {
  return (
    <svg className="hero-landscape__svg w-full" viewBox="0 0 1440 460" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <path
        d="M0 460V350c50-18 100-40 150-36 50 4 100 32 150 28 50-4 100-36 150-32 50 4 100 30 150 26 50-4 100-34 150-30 50 4 100 28 150 24 50-4 100-32 150-28 50 4 100 34 150 30 50-4 100-28 150-24 50 4 100 30 150 26 50-4 100-26 150-22V460H0Z"
        fill="url(#topo-mid-fill)"
      />
      <g stroke="#4a5664" strokeWidth="1" fill="none" opacity="0.38">
        <path d="M0 400c60-14 120-28 180-24 60 4 120 30 180 26 60-4 120-26 180-22 60 4 120 28 180 24 60-4 120-24 180-20 60 4 120 26 180 22 60-4 120-22 180-18" />
        <path d="M0 378c90-10 180-22 270-18s180 24 270 20 180-22 270-18 180 20 270 16" opacity="0.7" />
        <path d="M0 356c70-12 140-26 210-22 70 4 140 28 210 24 70-4 140-24 210-20 70 4 140 26 210 22" opacity="0.55" />
        <path d="M0 334c110-6 220-14 330-10s220 16 330 12 220-14 330-10" opacity="0.4" />
      </g>
      <defs>
        <linearGradient id="topo-mid-fill" x1="720" y1="300" x2="720" y2="460" gradientUnits="userSpaceOnUse">
          <stop stopColor="#161e28" />
          <stop offset="0.5" stopColor="#101820" />
          <stop offset="1" stopColor="#0a1018" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TopoNear() {
  return (
    <svg className="hero-landscape__svg w-full" viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <path
        d="M0 520V390c40-22 80-48 120-44 40 4 80 38 120 34 40-4 80-42 120-38 40 4 80 36 120 32 40-4 80-40 120-36 40 4 80 34 120 30 40-4 80-38 120-34 40 4 80 32 120 28 40-4 80-36 120-32 40 4 80 38 120 34 40-4 80-30 120-26V520H0Z"
        fill="url(#topo-near-fill)"
      />
      <g stroke="#3a4654" strokeWidth="1.1" fill="none" opacity="0.42">
        <path d="M0 448c50-16 100-32 150-28 50 4 100 34 150 30 50-4 100-30 150-26 50 4 100 32 150 28 50-4 100-28 150-24 50 4 100 30 150 26" />
        <path d="M0 422c70-12 140-26 210-22 70 4 140 30 210 26 70-4 140-28 210-24 70 4 140 26 210 22" opacity="0.75" />
        <path d="M0 396c60-14 120-30 180-26 60 4 120 32 180 28 60-4 120-28 180-24 60 4 120 30 180 26" opacity="0.55" />
        <path d="M0 370c80-10 160-22 240-18 80 4 160 28 240 24 80-4 160-26 240-22" opacity="0.38" />
      </g>
      <defs>
        <linearGradient id="topo-near-fill" x1="720" y1="340" x2="720" y2="520" gradientUnits="userSpaceOnUse">
          <stop stopColor="#121820" />
          <stop offset="0.45" stopColor="#0c1018" />
          <stop offset="1" stopColor="#080c12" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TopoFore() {
  return (
    <svg className="hero-landscape__svg hero-landscape__svg--fore w-full" viewBox="0 0 1440 560" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <path
        d="M0 560V430c35-24 70-52 105-48 35 4 70 42 105 38 35-4 70-46 105-42 35 4 70 40 105 36 35-4 70-44 105-40 35 4 70 38 105 34 35-4 70-42 105-38 35 4 70 36 105 32 35-4 70-40 105-36 35 4 70 44 105 40 35-4 70-34 105-30V560H0Z"
        fill="url(#topo-fore-fill)"
      />
      <path
        d="M960 560L1040 420 1120 480 1180 440 1280 560H960Z"
        fill="#060a10"
        opacity="0.85"
      />
      <path
        d="M0 560L80 460 140 500 220 410 320 560H0Z"
        fill="#060a10"
        opacity="0.8"
      />
      <g stroke="#2a3644" strokeWidth="1.15" fill="none" opacity="0.48">
        <path d="M0 492c45-18 90-36 135-32 45 4 90 38 135 34 45-4 90-34 135-30 45 4 90 36 135 32 45-4 90-32 135-28" />
        <path d="M0 464c55-14 110-28 165-24 55 4 110 32 165 28 55-4 110-30 165-26 55 4 110 28 165 24" opacity="0.7" />
        <path d="M0 436c65-16 130-34 195-30 65 4 130 36 195 32 65-4 130-32 195-28" opacity="0.5" />
      </g>
      <defs>
        <linearGradient id="topo-fore-fill" x1="720" y1="380" x2="720" y2="560" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0e141c" />
          <stop offset="0.4" stopColor="#0a0e14" />
          <stop offset="1" stopColor="#06080c" />
        </linearGradient>
      </defs>
    </svg>
  );
}
