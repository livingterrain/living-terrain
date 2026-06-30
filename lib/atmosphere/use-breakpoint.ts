"use client";

import { useEffect, useState } from "react";

export type Breakpoint = "compact" | "mobile" | "tablet" | "desktop";

const QUERIES = {
  compact: "(max-width: 429px)",
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
} as const;

function resolveBreakpoint(): Breakpoint {
  if (typeof window === "undefined") return "desktop";
  if (window.matchMedia(QUERIES.compact).matches) return "compact";
  if (window.matchMedia(QUERIES.mobile).matches) return "mobile";
  if (window.matchMedia(QUERIES.tablet).matches) return "tablet";
  return "desktop";
}

/** Viewport bucket — compact (≤429), mobile (≤767), tablet (768–1023), desktop (≥1024) */
export function useBreakpoint(): {
  breakpoint: Breakpoint;
  isCompact: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
} {
  const [state, setState] = useState(() => ({
    breakpoint: resolveBreakpoint(),
    width: typeof window !== "undefined" ? window.innerWidth : 1280,
  }));

  useEffect(() => {
    const update = () => {
      setState({
        breakpoint: resolveBreakpoint(),
        width: window.innerWidth,
      });
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const { breakpoint, width } = state;

  return {
    breakpoint,
    width,
    isCompact: breakpoint === "compact",
    isMobile: breakpoint === "compact" || breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isDesktop: breakpoint === "desktop",
  };
}
