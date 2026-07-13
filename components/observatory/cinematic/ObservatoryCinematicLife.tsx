"use client";

import {
  motion,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useMemo } from "react";

type Props = {
  isMobile: boolean;
  waterOpacity: MotionValue<number>;
  dustOpacity: MotionValue<number>;
};

/** Restrained atmospheric layers — dust, water shimmer. */
export function ObservatoryCinematicLife({
  isMobile,
  waterOpacity,
  dustOpacity,
}: Props) {
  const reduced = useReducedMotion() ?? false;

  const dust = useMemo(
    () =>
      Array.from({ length: isMobile ? 8 : 14 }, (_, i) => ({
        id: i,
        left: `${((i * 53.1) % 100).toFixed(1)}%`,
        top: `${10 + ((i * 37.7) % 75)}%`,
        size: i % 5 === 0 ? 2 : i % 3 === 0 ? 1.3 : 0.85,
        delay: (i % 6) * 2.4,
        dur: 20 + (i % 5) * 4,
      })),
    [isMobile],
  );

  if (reduced) {
    return (
      <div className="obs-cine-life" aria-hidden>
        <div className="obs-cine-life__vignette" />
      </div>
    );
  }

  return (
    <div className="obs-cine-life" aria-hidden>
      <motion.div
        className="obs-cine-life__water"
        style={{ opacity: waterOpacity }}
      />
      <motion.div
        className="obs-cine-life__dust-field"
        style={{ opacity: dustOpacity }}
      >
        {dust.map((d) => (
          <span
            key={d.id}
            className="obs-cine-life__dust"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.dur}s`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
