"use client";

import { cn } from "@/lib/utils";

interface StoneMapVeilProps {
  active?: boolean;
  className?: string;
}

/**
 * The terrain map as if carved into stone — relief, grain, and worn edges.
 */
export function StoneMapVeil({ active = true, className }: StoneMapVeilProps) {
  if (!active) return null;

  return (
    <div
      className={cn("world-stone-map pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div className="world-stone-map__slab absolute inset-[2%] sm:inset-[3%]" />
      <div className="world-stone-map__grain absolute inset-0" />
      <div className="world-stone-map__relief absolute inset-0" />
      <svg
        className="world-stone-map__frame absolute inset-[1.5%] h-[calc(100%-3%)] w-[calc(100%-3%)] sm:inset-[2.5%] sm:h-[calc(100%-5%)] sm:w-[calc(100%-5%)]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <rect
          x="0.5"
          y="0.5"
          width="99"
          height="99"
          stroke="currentColor"
          strokeWidth="0.15"
          opacity="0.12"
        />
        <path
          d="M2 2 L98 2 M2 98 L98 98 M2 2 L2 98 M98 2 L98 98"
          stroke="currentColor"
          strokeWidth="0.08"
          opacity="0.06"
        />
      </svg>
      <div className="world-stone-map__vignette absolute inset-0" />
    </div>
  );
}
