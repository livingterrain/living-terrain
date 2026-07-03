"use client";

import { useEffect, useState } from "react";

/** True after the first client commit — gates randomness and entrance motion */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * True after layout + compositor are stable.
 * Chrome needs extra frames and font metrics before opacity fades on blur layers.
 */
export function useLayoutSettled(): boolean {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;
    let raf3 = 0;
    let timeout = 0;
    let finished = false;

    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      setSettled(true);
    };

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        raf3 = requestAnimationFrame(() => {
          const fonts = document.fonts?.ready;
          if (fonts) {
            fonts.then(finish).catch(finish);
            timeout = window.setTimeout(finish, 150);
          } else {
            finish();
          }
        });
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cancelAnimationFrame(raf3);
      window.clearTimeout(timeout);
    };
  }, []);

  return settled;
}
