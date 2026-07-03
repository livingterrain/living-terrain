"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CIRCADIAN_POLL_MS } from "@/lib/atmosphere/circadian";
import { syncCircadian } from "@/lib/atmosphere/circadian-store";
import { isMapPath } from "@/lib/atmosphere/navigation";

/** Homepage threshold fade — defer live circadian until entrance settles */
const THRESHOLD_CIRCADIAN_DELAY_MS = 1100;

/**
 * Installs circadian tokens on <html> — the terrain breathes with local time.
 * No labels. No notifications. Only atmosphere.
 */
export function CircadianRoot() {
  const pathname = usePathname();

  useEffect(() => {
    let interval: number | undefined;
    let delayTimer: number | undefined;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      syncCircadian();
      interval = window.setInterval(syncCircadian, CIRCADIAN_POLL_MS);
    };

    const delay = isMapPath(pathname) ? THRESHOLD_CIRCADIAN_DELAY_MS : 0;

    if (delay > 0) {
      delayTimer = window.setTimeout(start, delay);
    } else {
      const frame = requestAnimationFrame(start);
      return () => {
        cancelled = true;
        cancelAnimationFrame(frame);
        if (interval !== undefined) window.clearInterval(interval);
      };
    }

    return () => {
      cancelled = true;
      if (delayTimer !== undefined) window.clearTimeout(delayTimer);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [pathname]);

  return null;
}
