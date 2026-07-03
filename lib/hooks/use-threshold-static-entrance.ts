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

/** Hold static Threshold frame before atmosphere magic (Chrome compositor) */
export const CHROME_ATMOSPHERE_DELAY_MS = 650;

export interface ThresholdStaticEntrance {
  /** Chrome static hold — no blur/fog/star motion */
  staticHold: boolean;
  /** Live atmosphere layers may render and animate */
  atmosphereActive: boolean;
}

export function useThresholdStaticEntrance(
  reducedMotion = false,
): ThresholdStaticEntrance {
  const [staticHold, setStaticHold] = useState(true);
  const [atmosphereActive, setAtmosphereActive] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setStaticHold(false);
      setAtmosphereActive(true);
      return;
    }

    const isChrome = isChromiumBrowser();

    if (!isChrome) {
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          setStaticHold(false);
          setAtmosphereActive(true);
        });
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    const timer = window.setTimeout(() => {
      setAtmosphereActive(true);
      requestAnimationFrame(() => {
        setStaticHold(false);
      });
    }, CHROME_ATMOSPHERE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  return { staticHold, atmosphereActive };
}
