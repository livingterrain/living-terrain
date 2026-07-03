"use client";

import { motion } from "framer-motion";
import { NAVIGATION } from "@/lib/atmosphere/tempo";

interface MapRevealVeilProps {
  /** 0 = fully dissolved, 1 = full dark hold */
  opacity?: number;
}

/** Dark adaptation — dissolves with awakening, never snaps */
export function MapRevealVeil({ opacity = 1 }: MapRevealVeilProps) {
  if (opacity <= 0.01) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      aria-hidden
      initial={false}
      animate={{ opacity }}
      transition={{ duration: 0.4, ease: NAVIGATION.ease }}
    >
      <div className="absolute inset-0 bg-[#010204]/96" />
      <div
        className="absolute left-1/2 top-[44%] h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(248, 244, 236, 0.06) 0%, transparent 68%)",
        }}
      />
    </motion.div>
  );
}
