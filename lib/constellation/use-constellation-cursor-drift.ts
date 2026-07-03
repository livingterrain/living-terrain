"use client";

import { useEffect, useRef } from "react";

const EASE = 0.072;
const MAX_PX = 5;

/**
 * Imperceptible cursor-follow drift for the constellation layer.
 * Updates transform directly on the target element — no React re-renders per frame.
 */
export function useConstellationCursorDrift(
  enabled: boolean,
  containerRef: React.RefObject<HTMLElement | null>,
  targetRef: React.RefObject<SVGGElement | null>,
) {
  const currentRef = useRef({ x: 0, y: 0 });
  const targetRef2 = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      const el = targetRef.current;
      if (el) el.style.transform = "";
      currentRef.current = { x: 0, y: 0 };
      targetRef2.current = { x: 0, y: 0 };
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRef2.current = {
        x: nx * MAX_PX * 2,
        y: ny * MAX_PX * 2,
      };
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      const t = targetRef2.current;
      const c = currentRef.current;
      const nx = c.x + (t.x - c.x) * EASE;
      const ny = c.y + (t.y - c.y) * EASE;
      currentRef.current = { x: nx, y: ny };

      const el = targetRef.current;
      if (el) {
        el.style.transform = `translate3d(${nx.toFixed(2)}px, ${ny.toFixed(2)}px, 0)`;
      }

      const settled =
        Math.abs(t.x - nx) < 0.03 &&
        Math.abs(t.y - ny) < 0.03 &&
        Math.abs(t.x) < 0.03 &&
        Math.abs(t.y) < 0.03;
      frameRef.current = settled ? null : requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      const el = targetRef.current;
      if (el) el.style.transform = "";
    };
  }, [enabled, containerRef, targetRef]);
}
