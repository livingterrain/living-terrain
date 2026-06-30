"use client";

import { useMemo, useState } from "react";
import type { RealmNetworkEdge, RealmNetworkNode } from "@/lib/realms/types";

export function useRealmHover(
  network: RealmNetworkNode[],
  networkEdges: RealmNetworkEdge[],
) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const litEdges = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    const lit = new Set<string>();
    for (const e of networkEdges) {
      if (e.from === hoveredId || e.to === hoveredId) {
        lit.add(`${e.from}-${e.to}`);
        lit.add(`${e.to}-${e.from}`);
      }
    }
    return lit;
  }, [hoveredId, networkEdges]);

  const litNodes = useMemo(() => {
    if (!hoveredId) return null;
    const ids = new Set<string>([hoveredId]);
    for (const e of networkEdges) {
      if (e.from === hoveredId) ids.add(e.to);
      if (e.to === hoveredId) ids.add(e.from);
    }
    return ids;
  }, [hoveredId, networkEdges]);

  return { hoveredId, setHoveredId, litEdges, litNodes };
}

export function edgeKey(from: string, to: string): string {
  return `${from}-${to}`;
}

/** Map normalized 0–1 coords to SVG viewBox */
export function toSvg(
  x: number,
  y: number,
  w = 100,
  h = 75,
): { cx: number; cy: number } {
  return { cx: x * w, cy: y * h };
}
