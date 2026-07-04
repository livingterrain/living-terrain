"use client";

import { useEffect, useState } from "react";

/**
 * Starts ambient background motion one frame after layout settles —
 * never in the same commit as lightweight content reveal.
 */
export function useAmbientActive(layoutSettled: boolean): boolean {
  const [ambientActive, setAmbientActive] = useState(false);

  useEffect(() => {
    if (!layoutSettled) {
      setAmbientActive(false);
      return;
    }

    const frame = requestAnimationFrame(() => setAmbientActive(true));
    return () => cancelAnimationFrame(frame);
  }, [layoutSettled]);

  return ambientActive;
}
