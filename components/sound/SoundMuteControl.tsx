"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTerrainSoundOptional } from "./TerrainSoundProvider";

interface SoundMuteControlProps {
  className?: string;
  style?: React.CSSProperties;
  requireActivation?: boolean;
  iconOnly?: boolean;
  /** Threshold map owns ambience on `/` — skip duplicate control from site chrome */
  hideOnHome?: boolean;
}

export function SoundMuteControl({
  className,
  style,
  requireActivation = true,
  iconOnly = false,
  hideOnHome = true,
}: SoundMuteControlProps) {
  const pathname = usePathname();
  const sound = useTerrainSoundOptional();

  if (!sound) return null;
  if (requireActivation && !sound.activated) return null;
  if (hideOnHome && pathname === "/") return null;

  const showIconOnly = iconOnly;

  return (
    <button
      type="button"
      onClick={sound.toggleMuted}
      className={cn(
        "fixed z-[110] flex min-h-11 min-w-11 items-center justify-center rounded-sm px-3",
        "font-heading text-[0.8125rem] tracking-[0.04em] touch-manipulation",
        "transition-[opacity,background-color,border-color] duration-500 active:bg-ivory/5 sm:text-[0.6875rem] sm:hover:opacity-80",
        "max-md:min-h-10 max-md:min-w-10 max-md:rounded-full max-md:border max-md:border-ivory/14",
        "max-md:bg-[color-mix(in_srgb,#06080c_72%,transparent)] max-md:backdrop-blur-[6px]",
        "max-md:opacity-90",
        className,
      )}
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
        right: "max(1.25rem, env(safe-area-inset-right))",
        opacity: sound.muted ? 0.55 : 0.72,
        ...style,
      }}
      aria-pressed={!sound.muted}
      aria-label={sound.muted ? "Restore ambience" : "Silence the room"}
    >
      {showIconOnly ? (
        <span
          className={cn(
            "block rounded-full bg-current",
            sound.muted ? "h-1.5 w-1.5 opacity-45" : "h-2 w-2 opacity-75",
          )}
          aria-hidden
        />
      ) : sound.muted ? (
        "Ambience"
      ) : (
        "Silence"
      )}
    </button>
  );
}
