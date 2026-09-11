"use client";

/**
 * Terrain Menu — sparse full-field orientation layer.
 * Replaces cryptic ··· / Further… as the primary escape hatch.
 * Portaled to document.body so header backdrop-filter cannot trap the overlay.
 */

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { TerrainLink } from "@/components/navigation";
import {
  ATLAS_QUESTIONS_ACTION,
  ATLAS_QUESTIONS_EVENT,
} from "@/lib/world/pathways";
import {
  TERRAIN_MENU,
  menuDestinationIsActive,
} from "@/lib/world/orientation";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  /** When on Atlas, offer return to living questions without leaving the room */
  includeAtlasQuestions?: boolean;
};

export function TerrainMenu({
  open,
  onClose,
  includeAtlasQuestions = false,
}: Props) {
  const pathname = usePathname();
  const dialogId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function returnToAtlasQuestions() {
    window.dispatchEvent(new Event(ATLAS_QUESTIONS_EVENT));
    onClose();
  }

  const menu = (
    <div
      id={dialogId}
      className="terrain-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="terrain-menu__veil" aria-hidden onClick={onClose} />

      <div className="terrain-menu__field">
        <div className="terrain-menu__chrome">
          <p className="terrain-menu__eyebrow">Menu</p>
          <button
            ref={closeRef}
            type="button"
            className="terrain-menu__close"
            onClick={onClose}
            aria-label="Close menu"
          >
            Close
          </button>
        </div>

        <nav className="terrain-menu__nav" aria-label="Living Terrain">
          {TERRAIN_MENU.map((d) => (
            <TerrainLink
              key={d.href}
              href={d.href}
              onClick={onClose}
              className={cn(
                "terrain-menu__row",
                menuDestinationIsActive(pathname, d.href) &&
                  "terrain-menu__row--here",
              )}
            >
              <span className="terrain-menu__label">{d.label}</span>
              <span className="terrain-menu__hint">{d.hint}</span>
            </TerrainLink>
          ))}

          {includeAtlasQuestions && (
            <button
              type="button"
              className="terrain-menu__row terrain-menu__row--action"
              onClick={returnToAtlasQuestions}
              data-action={ATLAS_QUESTIONS_ACTION}
            >
              <span className="terrain-menu__label">Living questions</span>
              <span className="terrain-menu__hint">
                Return to the Atlas threshold
              </span>
            </button>
          )}
        </nav>
      </div>
    </div>
  );

  return createPortal(menu, document.body);
}
