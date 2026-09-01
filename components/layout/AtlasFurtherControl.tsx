"use client";

/**
 * Quiet Further control for bare Atlas — orientation without full site chrome.
 * Open panel is a dark floating pathway sheet; destinations and routes are fixed.
 */

import { useEffect, useId, useRef, useState } from "react";
import { PathwayLink } from "@/components/design-system/threshold";
import {
  ATLAS_ORIENTATION_PATHWAYS,
  ATLAS_QUESTIONS_ACTION,
  ATLAS_QUESTIONS_EVENT,
} from "@/lib/world/pathways";
import { whisperForPath } from "@/lib/world/location-for-path";
import { cn } from "@/lib/utils";

function DestinationCopy({ label, hint }: { label: string; hint: string }) {
  return (
    <span className="atlas-further__copy">
      <span className="atlas-further__marker" aria-hidden />
      <span className="atlas-further__text">
        <span className="atlas-further__title">{label}</span>
        <span className="atlas-further__desc">{hint}</span>
      </span>
    </span>
  );
}

export function AtlasFurtherControl() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogId = useId();
  const whisper = whisperForPath("/atlas");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function returnToQuestions() {
    window.dispatchEvent(new Event(ATLAS_QUESTIONS_EVENT));
    setOpen(false);
  }

  return (
    <div className="atlas-further pointer-events-none fixed inset-0 z-[55]">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "atlas-further__trigger pointer-events-auto touch-zone absolute z-[66]",
          open && "atlas-further__trigger--open",
        )}
        aria-label={open ? "Close further directions" : "Further directions"}
        aria-expanded={open}
        aria-controls={dialogId}
      >
        <span className="atlas-further__glyph" aria-hidden>
          {open ? "×" : "···"}
        </span>
      </button>

      {open && (
        <div
          id={dialogId}
          className="atlas-further__horizon pointer-events-auto fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-label="Directions through the terrain"
        >
          <div className="atlas-further__veil" aria-hidden />

          <div className="atlas-further__panel">
            <p className="atlas-further__whisper">{whisper}</p>

            <nav className="atlas-further__nav" aria-label="Pathways">
              {ATLAS_ORIENTATION_PATHWAYS.map((p) =>
                p.action === ATLAS_QUESTIONS_ACTION ? (
                  <button
                    key={p.label}
                    type="button"
                    onClick={returnToQuestions}
                    className="atlas-further__row threshold-pathway group touch-manipulation text-left"
                  >
                    <DestinationCopy label={p.label} hint={p.hint} />
                  </button>
                ) : (
                  <PathwayLink
                    key={p.href}
                    href={p.href}
                    onClick={() => setOpen(false)}
                    className="atlas-further__row"
                  >
                    <DestinationCopy label={p.label} hint={p.hint} />
                  </PathwayLink>
                ),
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
