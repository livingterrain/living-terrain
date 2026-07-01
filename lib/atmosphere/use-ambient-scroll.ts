"use client";

import { useEffect, useState } from "react";

/**
 * Tracks scroll offset from any scrollable region inside the homepage.
 * Capture-phase listener keeps parallax in sync on mobile guide / threshold scroll.
 */
export function useAmbientScroll(): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame = 0;
    let latest = 0;

    const flush = () => {
      frame = 0;
      setOffset(latest);
    };

    const onScroll = (e: Event) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      latest = target.scrollTop;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return offset;
}
