"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { RoomKind } from "@/lib/rooms";
import { cn } from "@/lib/utils";

interface ScrollDepthProps {
  kind?: RoomKind;
  className?: string;
}

/**
 * The world deepens as you scroll — quieter, richer, more present.
 * Imperceptible at first; felt over time.
 */
export function ScrollDepth({ kind, className }: ScrollDepthProps) {
  const { scrollYProgress } = useScroll();

  const vignetteDepth = useTransform(scrollYProgress, [0, 0.25, 0.6, 1], [0, 0.04, 0.08, 0.12]);
  const starField = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [0, 0.08, 0.18, 0.28]);
  const warmth = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.03, 0.06]);
  const texture = useTransform(scrollYProgress, [0, 1], [0.35, 0.55]);

  const isDarkRoom = kind === "observatory" || kind === "chamber";

  return (
    <div
      className={cn("pointer-events-none fixed inset-0 z-[3]", className)}
      aria-hidden="true"
    >
      {/* Vignette deepens — the room closes gently around you */}
      <motion.div
        style={{ opacity: vignetteDepth }}
        className="absolute inset-0 scroll-depth-vignette"
      />

      {/* Warmth accumulates in reading rooms */}
      {!isDarkRoom && (
        <motion.div
          style={{ opacity: warmth }}
          className="absolute inset-0 scroll-depth-warmth"
        />
      )}

      {/* Distant points emerge — like noticing more stars the longer you stay */}
      <motion.div style={{ opacity: starField }} className="absolute inset-0">
        <ScrollStars count={isDarkRoom ? 48 : 32} dark={isDarkRoom} />
      </motion.div>

      {/* Grain texture enriches */}
      <motion.div
        style={{ opacity: texture }}
        className="absolute inset-0 scroll-depth-grain"
      />
    </div>
  );
}

function ScrollStars({ count, dark }: { count: number; dark?: boolean }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: ((i * 137.5) % 1000) / 10,
    top: ((i * 271.3) % 1000) / 10,
    size: i % 11 === 0 ? 1.25 : 0.75,
    opacity: 0.15 + (i % 5) * 0.05,
  }));

  return (
    <>
      {stars.map((s) => (
        <span
          key={s.id}
          className={cn("absolute rounded-full", dark ? "bg-ivory/50" : "bg-charcoal/35")}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}
    </>
  );
}
