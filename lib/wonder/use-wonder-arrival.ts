"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  WONDER_ARRIVAL,
  atmosphereRefinement,
  awakeningProgress,
  chamberLabelPresence,
  chromeOpacity,
  veilOpacity,
} from "./arrival";

/** Tick interval — avoids 60fps setState on the whole tree */
const TICK_MS = 32;

export interface WonderArrivalState {
  /** 0–1 master clock */
  awakening: number;
  /** Elapsed ms since map awakening began */
  elapsedMs: number;
  /** 4–8s atmosphere refinement */
  atmosphere: number;
  /** Dark hold overlay */
  veil: number;
  /** Marginal UI may show */
  chromeVisible: boolean;
  /** Opacity for chrome fade-in */
  chromeOpacity: number;
  /** Chamber label may show */
  chamberLabel: number;
  /** Visitor has acted — universe noticed them */
  engaged: boolean;
  /** Skip full ceremony (returning visitor) */
  abbreviated: boolean;
  /** Normalized attention 0–1 in viewport */
  attention: { x: number; y: number } | null;
}

interface UseWonderArrivalOptions {
  active: boolean;
  abbreviated?: boolean;
  reducedMotion?: boolean;
}

export function useWonderArrival({
  active,
  abbreviated = false,
  reducedMotion = false,
}: UseWonderArrivalOptions): WonderArrivalState & {
  engage: () => void;
  setAttention: (x: number, y: number) => void;
  clearAttention: () => void;
} {
  const [engaged, setEngaged] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [attention, setAttentionPoint] = useState<{ x: number; y: number } | null>(null);
  const startRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const engagedRef = useRef(false);

  const engage = useCallback(() => {
    if (engagedRef.current) return;
    engagedRef.current = true;
    setEngaged(true);
  }, []);

  const setAttention = useCallback((x: number, y: number) => {
    setAttentionPoint({ x, y });
  }, []);

  const clearAttention = useCallback(() => {
    setAttentionPoint(null);
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!active) {
      startRef.current = null;
      setElapsedMs(0);
      setEngaged(false);
      engagedRef.current = false;
      setAttentionPoint(null);
      return;
    }

    if (abbreviated || reducedMotion) {
      setElapsedMs(WONDER_ARRIVAL.durationMs);
      setEngaged(true);
      engagedRef.current = true;
      return;
    }

    startRef.current = performance.now();
    setElapsedMs(0);
    setEngaged(false);
    engagedRef.current = false;

    const tick = () => {
      const start = startRef.current;
      if (start === null) return;
      setElapsedMs(performance.now() - start);
    };

    tick();
    intervalRef.current = window.setInterval(tick, TICK_MS);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, abbreviated, reducedMotion]);

  const awakening = abbreviated || reducedMotion
    ? 1
    : awakeningProgress(elapsedMs);

  const chromeVisible =
    abbreviated ||
    reducedMotion ||
    engaged ||
    elapsedMs >= WONDER_ARRIVAL.chromeDelayMs;

  return {
    awakening,
    elapsedMs,
    atmosphere: atmosphereRefinement(elapsedMs),
    veil: abbreviated || reducedMotion ? 0 : veilOpacity(awakening),
    chromeVisible,
    chromeOpacity: abbreviated || reducedMotion
      ? chromeVisible
        ? 1
        : 0
      : chromeOpacity(chromeVisible, elapsedMs),
    chamberLabel: abbreviated
      ? 1
      : chamberLabelPresence(awakening, engaged, elapsedMs),
    engaged: engaged || abbreviated || reducedMotion,
    abbreviated: abbreviated || reducedMotion,
    attention,
    engage,
    setAttention,
    clearAttention,
  };
}
