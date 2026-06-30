"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

/** Faint network paths — drift gently toward the cursor */
export function MycelialField() {
  const ref = useRef<HTMLDivElement>(null);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, { stiffness: 12, damping: 28, mass: 1.2 });
  const springY = useSpring(offsetY, { stiffness: 12, damping: 28, mass: 1.2 });

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    function onMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      offsetX.set(nx * 14);
      offsetY.set(ny * 10);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [offsetX, offsetY]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.svg
        style={{ x: springX, y: springY }}
        className="absolute inset-0 h-full w-full text-forest"
        viewBox="0 0 1440 3200"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="currentColor" strokeWidth="0.35" opacity="0.055">
          <path d="M720 200 C520 400, 320 500, 120 700" />
          <path d="M720 200 C920 400, 1120 500, 1320 700" />
          <path d="M720 600 C480 800, 280 1000, 80 1200" />
          <path d="M720 600 C960 800, 1160 1000, 1360 1200" />
          <path d="M200 900 C400 1000, 560 1100, 720 1300" />
          <path d="M1240 900 C1040 1000, 880 1100, 720 1300" />
          <path d="M720 1300 C520 1500, 360 1700, 200 1900" />
          <path d="M720 1300 C920 1500, 1080 1700, 1240 1900" />
          <path d="M400 400 C560 520, 640 640, 720 800" />
          <path d="M1040 400 C880 520, 800 640, 720 800" />
        </g>
        <g fill="currentColor" opacity="0.04">
          <circle cx="720" cy="800" r="2" />
          <circle cx="400" cy="1000" r="1.5" />
          <circle cx="1040" cy="1000" r="1.5" />
          <circle cx="720" cy="1300" r="2" />
          <circle cx="200" cy="700" r="1" />
          <circle cx="1240" cy="700" r="1" />
        </g>
      </motion.svg>
    </div>
  );
}
