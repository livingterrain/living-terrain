"use client";

import { cn } from "@/lib/utils";
import { useTerrainSoundOptional } from "./TerrainSoundProvider";

interface SoundMuteControlProps {
  className?: string;
  /** Only show after threshold activation */
  requireActivation?: boolean;
}

export function SoundMuteControl({
  className,
  requireActivation = true,
}: SoundMuteControlProps) {
  const sound = useTerrainSoundOptional();
  if (!sound) return null;
  if (requireActivation && !sound.activated) return null;

  return (
    <button
      type="button"
      onClick={sound.toggleMuted}
      className={cn(
        "fixed z-[110] flex min-h-11 min-w-11 items-center justify-center rounded-sm px-3",
        "font-heading text-[0.8125rem] tracking-[0.04em] touch-manipulation",
        "transition-[opacity,background-color] duration-500 active:bg-ivory/5 sm:text-[0.6875rem] sm:hover:opacity-80",
        className,
      )}
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
        right: "max(1.25rem, env(safe-area-inset-right))",
        opacity: sound.muted ? 0.55 : 0.72,
      }}
      aria-pressed={!sound.muted}
      aria-label={sound.muted ? "Restore ambience" : "Silence the room"}
    >
      {sound.muted ? "Ambience" : "Silence"}
    </button>
  );
}
