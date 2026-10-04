"use client";

/**
 * Persistent orientation: Living Terrain · location whisper · Follow on Substack · Menu.
 * Spatially legible without SaaS chrome.
 */

import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { TerrainLink } from "@/components/navigation";
import { TerrainMenu } from "@/components/layout/TerrainMenu";
import {
  atlasQuestionsAvailable,
  locationWhisperForPath,
} from "@/lib/world/orientation";
import { cn } from "@/lib/utils";

type Props = {
  /** Atlas bare room — keep chrome minimal; Menu still available */
  bare?: boolean;
  /** Soften brand on Home until menu opens */
  homeField?: boolean;
  className?: string;
};

export function TerrainOrientation({
  bare = false,
  homeField = false,
  className,
}: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const whisper = locationWhisperForPath(pathname);
  const onAtlasRoom = atlasQuestionsAvailable(pathname);
  const dissolve = homeField && !menuOpen;

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  return (
    <>
      <div
        className={cn(
          "terrain-orient",
          bare && "terrain-orient--bare",
          dissolve && "terrain-orient--dissolve",
          className,
        )}
      >
        <div className="terrain-orient__inner">
          {dissolve ? (
            <span className="sr-only">Living Terrain</span>
          ) : (
            <TerrainLink href="/" className="terrain-orient__home">
              Living Terrain
            </TerrainLink>
          )}

          {whisper && !dissolve && (
            <p className="terrain-orient__whisper" aria-live="polite">
              {whisper}
            </p>
          )}

          <div className="terrain-orient__trail">
            <TerrainLink
              href="/join"
              className={cn(
                "terrain-orient__join",
                dissolve && "terrain-orient__join--soft",
              )}
            >
              Follow on Substack →
            </TerrainLink>
            <button
              type="button"
              className={cn(
                "terrain-orient__menu-btn",
                dissolve && "terrain-orient__menu-btn--soft",
              )}
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      <TerrainMenu
        open={menuOpen}
        onClose={closeMenu}
        includeAtlasQuestions={onAtlasRoom}
      />
    </>
  );
}
