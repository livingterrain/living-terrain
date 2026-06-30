"use client";

import { useCircadian } from "@/lib/atmosphere/useCircadian";

/** Imperceptible wash — morning gold, evening blue, never announced */
export function CircadianRoomWash() {
  const { phase } = useCircadian();

  return (
    <div
      className="circadian-room-wash pointer-events-none absolute inset-0"
      data-circadian-phase={phase}
      aria-hidden
    />
  );
}
