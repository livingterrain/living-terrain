"use client";

/**
 * Terrain Menu — sparse full-field orientation layer.
 * Replaces cryptic ··· / Further… as the primary escape hatch.
 * Portaled to document.body so header backdrop-filter cannot trap the overlay.
 */

import { Fragment, useEffect, useId, useRef } from "react";
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
  /** Only on bare /atlas, where the question-list event has a listener */
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
            <Fragment key={d.href}>
              <TerrainLink
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
              {d.within && (
                <div
                  className="terrain-menu__within"
                  role="group"
                  aria-labelledby={`${dialogId}-within-${d.href}`}
                >
                  <p
                    id={`${dialogId}-within-${d.href}`}
                    className="terrain-menu__within-label"
                  >
                    {d.within.label}
                    <span className="sr-only">, within the {d.label}</span>
                  </p>
                  <p className="terrain-menu__within-hint">{d.within.hint}</p>
                  <ul className="terrain-menu__within-links">
                    {d.within.links.map((link) => {
                      const here = menuDestinationIsActive(pathname, link.href);
                      return (
                        <li key={link.href}>
                          <TerrainLink
                            href={link.href}
                            onClick={onClose}
                            aria-current={here ? "page" : undefined}
                            className={cn(
                              "terrain-menu__within-link",
                              here && "terrain-menu__within-link--here",
                            )}
                          >
                            {link.label}
                          </TerrainLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </Fragment>
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
                Return to the questions.
              </span>
            </button>
          )}
        </nav>
      </div>
    </div>
  );

  return createPortal(menu, document.body);
}
