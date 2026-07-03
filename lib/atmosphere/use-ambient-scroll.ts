"use client";

import { useEffect, useState } from "react";

/**
 * Window scroll offset for parallax — ignores nested scroll containers
 * (threshold copy, mobile guide, nav drawers) so UI scroll does not jank backgrounds.
 */
export function useAmbientScroll(): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame = 0;

    const flush = () => {
      frame = 0;
      setOffset(window.scrollY);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(flush);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return offset;
}
