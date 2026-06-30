"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type CursorLightVariant = "threshold" | "room";

interface CursorLightProps {
  variant?: CursorLightVariant;
  className?: string;
  /** Outer pool radius in pixels */
  size?: number;
}

/**
 * Cursor as a subtle light source — reveals depth without demanding attention.
 */
export function CursorLight({
  variant = "room",
  className,
  size = variant === "threshold" ? 320 : 240,
}: CursorLightProps) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 40, damping: 32, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 40, damping: 32, mass: 0.8 });

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[4] hidden md:block",
        className,
      )}
      aria-hidden="true"
    >
      <motion.div
        style={{
          x: springX,
          y: springY,
          width: size,
          height: size,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className={cn(
          "absolute rounded-full",
          variant === "threshold"
            ? "cursor-light-threshold"
            : "cursor-light-room",
        )}
      />
      <motion.div
        style={{
          x: springX,
          y: springY,
          width: size * 0.22,
          height: size * 0.22,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className={cn(
          "absolute rounded-full",
          variant === "threshold"
            ? "cursor-light-core-threshold"
            : "cursor-light-core-room",
        )}
      />
    </div>
  );
}
