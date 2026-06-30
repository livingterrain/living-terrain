"use client";

import { useEffect } from "react";
import { CIRCADIAN_POLL_MS } from "@/lib/atmosphere/circadian";
import { syncCircadian } from "@/lib/atmosphere/circadian-store";

/**
 * Installs circadian tokens on <html> — the terrain breathes with local time.
 * No labels. No notifications. Only atmosphere.
 */
export function CircadianRoot() {
  useEffect(() => {
    syncCircadian();
    const id = window.setInterval(syncCircadian, CIRCADIAN_POLL_MS);
    return () => window.clearInterval(id);
  }, []);

  return null;
}
