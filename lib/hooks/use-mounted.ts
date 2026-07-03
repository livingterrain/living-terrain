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

/** True after layout is stable — one frame after mount */
export function useLayoutSettled(): boolean {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setSettled(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return settled;
}
