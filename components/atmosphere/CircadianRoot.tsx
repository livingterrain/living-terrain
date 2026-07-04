"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CIRCADIAN_POLL_MS } from "@/lib/atmosphere/circadian";
import { syncCircadian } from "@/lib/atmosphere/circadian-store";
import { isMapPath } from "@/lib/atmosphere/navigation";

/**
 * Installs circadian tokens on <html> — the terrain breathes with local time.
 * Homepage threshold keeps SSR circadian tokens until the map is entered
 * (see ThresholdWorld) so fog CSS vars never shift under blur layers.
 */
export function CircadianRoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (isMapPath(pathname)) return;

    let interval: number | undefined;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      syncCircadian();
      interval = window.setInterval(syncCircadian, CIRCADIAN_POLL_MS);
    };

    const frame = requestAnimationFrame(start);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [pathname]);

  return null;
}
