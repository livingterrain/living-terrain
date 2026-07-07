"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import type { RoomKind } from "@/lib/rooms";
import { cn } from "@/lib/utils";

const roomTints: Record<RoomKind, string> = {
  pathways: "text-gold-faint/60",
  reading: "text-gold-faint/50",
  library: "text-gold-faint/45",
  guide: "text-gold-faint/40",
  notebook: "text-charcoal-faint/70",
  archive: "text-charcoal-faint/60",
  atlas: "text-gold-faint/55",
  observatory: "text-gold-faint/50",
  chamber: "text-gold-faint/55",
};

interface DiscoveryFieldProps {
  kind: RoomKind;
  className?: string;
}

/** Room-level mycelial network — responds to cursor drift */
export function DiscoveryField({ kind, className }: DiscoveryFieldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, { stiffness: 14, damping: 30, mass: 1 });
  const springY = useSpring(offsetY, { stiffness: 14, damping: 30, mass: 1 });

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
      offsetX.set(nx * 18);
      offsetY.set(ny * 12);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [offsetX, offsetY]);

  return (
    <div
      ref={ref}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <motion.svg
        style={{ x: springX, y: springY }}
        className={cn("absolute inset-0 h-full w-full", roomTints[kind])}
        viewBox="0 0 1200 2400"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.4" opacity="0.045">
          <path d="M600 100 C400 300, 200 450, 60 650" />
          <path d="M600 100 C800 300, 1000 450, 1140 650" />
          <path d="M600 500 C350 700, 150 900, 40 1100" />
          <path d="M600 500 C850 700, 1050 900, 1160 1100" />
          <path d="M150 800 C350 900, 500 1050, 600 1250" />
          <path d="M1050 800 C850 900, 700 1050, 600 1250" />
          <path d="M600 1250 C400 1450, 250 1650, 120 1850" />
          <path d="M600 1250 C800 1450, 950 1650, 1080 1850" />
        </g>
        <g fill="currentColor" opacity="0.035">
          <circle cx="600" cy="650" r="2" />
          <circle cx="600" cy="1250" r="2.5" />
          <circle cx="300" cy="900" r="1.5" />
          <circle cx="900" cy="900" r="1.5" />
          <circle cx="600" cy="1850" r="2" />
        </g>
      </motion.svg>
    </div>
  );
}
