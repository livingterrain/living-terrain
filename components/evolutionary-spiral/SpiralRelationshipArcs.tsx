"use client";

import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from "react";
import type { SpiralRelationshipStatus } from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";

/**
 * One connecting line per (authored relationship × Spiral occurrence it names).
 * Specs are built only from relationship records — never from position,
 * order, labels, or proximity.
 */
export type SpiralArcSpec = {
  relationshipId: string;
  occurrenceId: string;
  status: SpiralRelationshipStatus;
  active: boolean;
  label: string;
};

type Point = { x: number; y: number };

type Geometry = SpiralArcSpec & { d: string; end: Point; inView: boolean };

type Props = {
  containerRef: RefObject<HTMLElement | null>;
  arcs: readonly SpiralArcSpec[];
  /** Changes whenever the layout of either end may have moved. */
  layoutKey: string;
  onSelect: (relationshipId: string) => void;
};

function anchorPoint(
  el: Element,
  origin: DOMRect,
): { point: Point; fromAbove: boolean; rect: DOMRect } {
  if (el instanceof SVGPathElement) {
    const len = el.getTotalLength();
    const pt = el.getPointAtLength(len / 2);
    const ctm = el.getScreenCTM();
    const screen = ctm ? new DOMPoint(pt.x, pt.y).matrixTransform(ctm) : pt;
    return {
      point: { x: screen.x - origin.left, y: screen.y - origin.top },
      fromAbove: false,
      rect: el.getBoundingClientRect(),
    };
  }
  const r = el.getBoundingClientRect();
  if (el instanceof SVGElement) {
    return {
      point: {
        x: r.left + r.width / 2 - origin.left,
        y: r.top + r.height / 2 - origin.top,
      },
      fromAbove: false,
      rect: r,
    };
  }
  return {
    point: { x: r.left + r.width / 2 - origin.left, y: r.top - origin.top },
    fromAbove: true,
    rect: r,
  };
}

const f = (n: number) => n.toFixed(1);

function curve(
  p0: Point,
  p1: Point,
  fromAbove: boolean,
  gutterX: number,
): string {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  if (Math.abs(dx) > 140) {
    const c1 = { x: p0.x + dx * 0.45, y: p0.y };
    const c2 = fromAbove
      ? { x: p1.x, y: p1.y - Math.max(36, Math.abs(dy) * 0.4) }
      : { x: p1.x - dx * 0.35, y: p1.y };
    return `M ${f(p0.x)} ${f(p0.y)} C ${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(p1.x)} ${f(p1.y)}`;
  }
  // Stacked layout: leave the axis sideways, descend along the margin, then
  // turn in to the trajectory, so the line does not cut across the helix.
  const r = Math.min(48, Math.abs(dy) / 3);
  const inY = fromAbove ? p1.y - r * 1.4 : p1.y;
  return [
    `M ${f(p0.x)} ${f(p0.y)}`,
    `C ${f(gutterX)} ${f(p0.y)} ${f(gutterX)} ${f(p0.y)} ${f(gutterX)} ${f(p0.y + r)}`,
    `L ${f(gutterX)} ${f(inY - r)}`,
    fromAbove
      ? `C ${f(gutterX)} ${f(inY)} ${f(p1.x)} ${f(inY)} ${f(p1.x)} ${f(p1.y)}`
      : `C ${f(gutterX)} ${f(p1.y)} ${f(gutterX)} ${f(p1.y)} ${f(p1.x)} ${f(p1.y)}`,
  ].join(" ");
}

export function SpiralRelationshipArcs({
  containerRef,
  arcs,
  layoutKey,
  onSelect,
}: Props) {
  const [geometry, setGeometry] = useState<Geometry[]>([]);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container || arcs.length === 0) {
      setGeometry([]);
      return;
    }
    const origin = container.getBoundingClientRect();
    const vh = window.innerHeight;
    const next: Geometry[] = [];
    for (const [i, arc] of arcs.entries()) {
      const gutterX = origin.width + 9 - i * 4;
      const node = container.querySelector(
        `[data-occurrence-hit="${arc.occurrenceId}"]`,
      );
      const anchor = container.querySelector(
        `[data-rel-anchor~="${arc.relationshipId}"]`,
      );
      if (!node || !anchor) continue;
      const n = node.getBoundingClientRect();
      const p0 = {
        x: n.left + n.width / 2 - origin.left,
        y: n.top + n.height / 2 - origin.top,
      };
      const { point, fromAbove, rect } = anchorPoint(anchor, origin);
      const inView =
        n.bottom > 0 && n.top < vh && rect.bottom > 0 && rect.top < vh;
      next.push({ ...arc, d: curve(p0, point, fromAbove, gutterX), end: point, inView });
    }
    setGeometry(next);
  }, [arcs, containerRef]);

  useLayoutEffect(() => {
    measure();
  }, [measure, layoutKey]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(container);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    document.fonts?.ready.then(schedule).catch(() => {});
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
    };
  }, [containerRef, measure]);

  if (geometry.length === 0) return null;

  return (
    <svg className="spiral-arcs" aria-hidden="true">
      {geometry.map((g) => (
        <g
          key={`${g.relationshipId}-${g.occurrenceId}`}
          className={cn(
            "spiral-arcs__arc",
            `spiral-rel--${g.status}`,
            g.active ? "spiral-arcs__arc--active" : "spiral-arcs__arc--dormant",
            !g.inView && "spiral-arcs__arc--offscreen",
          )}
        >
          <path
            d={g.d}
            className="spiral-arcs__line"
            data-relationship-id={g.relationshipId}
            data-occurrence={g.occurrenceId}
          />
          <circle cx={g.end.x} cy={g.end.y} r={2.4} className="spiral-arcs__end" />
          <path
            d={g.d}
            className="spiral-arcs__hit"
            onClick={() => onSelect(g.relationshipId)}
          >
            <title>{g.label}</title>
          </path>
        </g>
      ))}
    </svg>
  );
}
