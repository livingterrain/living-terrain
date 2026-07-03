"use client";

import { useEffect, useState } from "react";

/** Chromium desktop/mobile — not Edge, Opera, or Samsung Internet */
export function isChromiumBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /CriOS|Chromium|Chrome/i.test(ua) &&
    !/Edg|OPR|SamsungBrowser/i.test(ua)
  );
}

/** Chrome — static first paint, then live background layers */
export const CHROME_BACKGROUND_DELAY_MS = 1000;

export interface ThresholdStaticEntrance {
  /** Chrome static hold — no blur/fog/star motion */
  staticHold: boolean;
  /** Live atmosphere layers mounted (opacity 1, animations paused) */
  atmosphereActive: boolean;
  /** Parallax, fog drift, particles, breathe animations enabled */
  backgroundMotionActive: boolean;
}

export function useThresholdStaticEntrance(
  reducedMotion = false,
): ThresholdStaticEntrance {
  const [staticHold, setStaticHold] = useState(true);
  const [atmosphereActive, setAtmosphereActive] = useState(false);
  const [backgroundMotionActive, setBackgroundMotionActive] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setStaticHold(false);
      setAtmosphereActive(true);
      setBackgroundMotionActive(true);
      return;
    }

    if (!isChromiumBrowser()) {
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          setStaticHold(false);
          setAtmosphereActive(true);
          setBackgroundMotionActive(true);
        });
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    let raf1 = 0;
    let raf2 = 0;
    const timer = window.setTimeout(() => {
      setAtmosphereActive(true);
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          setStaticHold(false);
          setBackgroundMotionActive(true);
        });
      });
    }, CHROME_BACKGROUND_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [reducedMotion]);

  return { staticHold, atmosphereActive, backgroundMotionActive };
}
