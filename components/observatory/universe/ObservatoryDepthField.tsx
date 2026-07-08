"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useMemo } from "react";
import { useBreakpoint } from "@/lib/atmosphere/use-breakpoint";
import { generateStarField } from "@/lib/observatory/universe-layout";
import { cn } from "@/lib/utils";

export function ObservatoryDepthField() {
  const reduced = useReducedMotion() ?? false;
  const { isMobile } = useBreakpoint();
  const { scrollYProgress } = useScroll();
  const mx = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 12, damping: 40, mass: 1.8 });

  const starCount = isMobile ? 42 : 88;
  const particleCount = isMobile ? 6 : 18;

  const stars = useMemo(() => generateStarField(starCount), [starCount]);
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: ((i * 73.7) % 1000) / 10,
        y: ((i * 41.3) % 1000) / 10,
        delay: (i % 11) * 1.8,
        size: i % 5 === 0 ? 1.2 : 0.6,
      })),
    [particleCount],
  );

  const parallax = isMobile ? 0.55 : 1;
  const farY = useTransform(scrollYProgress, [0, 1], [0, -120 * parallax]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, -240 * parallax]);
  const nearY = useTransform(scrollYProgress, [0, 1], [0, -380 * parallax]);
  const fogY = useTransform(scrollYProgress, [0, 1], [0, -160 * parallax]);
  const floorY = useTransform(scrollYProgress, [0, 1], [0, -60 * parallax]);

  const farX = useTransform(px, (v) => v * 8 * parallax);
  const midX = useTransform(px, (v) => v * 16 * parallax);
  const nearX = useTransform(px, (v) => v * 24 * parallax);

  useEffect(() => {
    if (reduced || isMobile) return;
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, reduced, isMobile]);

  return (
    <div
      className="obs-universe-field pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="obs-universe-field__sky absolute inset-0" />
      <div className="obs-universe-field__chart absolute inset-0" />

      <motion.div
        className="obs-universe-field__nebula absolute inset-0"
        style={reduced ? undefined : { y: farY, x: farX }}
      />

      {[0.25, 0.55, 0.85].map((depthThreshold, layer) => (
        <motion.div
          key={layer}
          className="absolute inset-0"
          style={
            reduced
              ? undefined
              : {
                  y: layer === 0 ? farY : layer === 1 ? midY : nearY,
                  x: layer === 0 ? farX : layer === 1 ? midX : nearX,
                }
          }
        >
          {stars
            .filter((s) =>
              layer === 0
                ? s.depth < 0.34
                : layer === 1
                  ? s.depth >= 0.34 && s.depth < 0.68
                  : s.depth >= 0.68,
            )
            .map((star) => (
              <span
                key={star.id}
                className={cn(
                  "obs-universe-star absolute rounded-full",
                  star.size > 1 && "obs-universe-star--bright",
                )}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  animationDelay: `${star.delay}s`,
                  opacity: 0.25 + star.depth * 0.55,
                }}
              />
            ))}
        </motion.div>
      ))}

      {!isMobile && (
        <motion.div className="absolute inset-0" style={reduced ? undefined : { y: fogY }}>
          {particles.map((p) => (
            <span
              key={p.id}
              className="obs-universe-particle absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </motion.div>
      )}

      <motion.div
        className="obs-universe-field__fog obs-universe-field__fog--a absolute inset-0"
        style={reduced ? undefined : { y: fogY }}
      />
      <motion.div
        className="obs-universe-field__fog obs-universe-field__fog--b absolute inset-0"
        style={reduced ? undefined : { y: midY }}
      />
      <motion.div
        className="obs-universe-field__fog obs-universe-field__fog--c absolute inset-0"
        style={reduced ? undefined : { y: nearY }}
      />

      <motion.div
        className="obs-universe-field__floor absolute inset-x-0 bottom-0"
        style={reduced ? undefined : { y: floorY }}
      />

      <div className="obs-universe-field__lantern absolute inset-x-0 bottom-0 h-[38vh] sm:h-[45vh]" />

      <div className="obs-universe-field__veil absolute inset-0" />
      <div className="obs-universe-field__vignette absolute inset-0" />
    </div>
  );
}
