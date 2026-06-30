"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect } from "react";

/** Gentle light pool — cursor as discovery instrument */
export function DiscoveryCursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 120, damping: 28, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }

    if (!prefersReduced) {
      window.addEventListener("mousemove", onMove, { passive: true });
      return () => window.removeEventListener("mousemove", onMove);
    }
  }, [x, y]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[5] hidden md:block"
      aria-hidden="true"
    >
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="discovery-cursor-glow absolute h-64 w-64 rounded-full"
      />
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="discovery-cursor-core absolute h-16 w-16 rounded-full"
      />
    </div>
  );
}
