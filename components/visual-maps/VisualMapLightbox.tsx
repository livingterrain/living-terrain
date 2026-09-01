"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

interface VisualMapLightboxProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
}

/**
 * Minimal enlarge: open plate full-size in an accessible dialog.
 * Escape closes; focus returns to the trigger.
 */
export function VisualMapLightbox({
  src,
  alt,
  width,
  height,
  title,
}: VisualMapLightboxProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const close = useCallback(() => {
    setOpen(false);
    queueMicrotask(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  function onTriggerKey(e: ReactKeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="visual-map-plate__trigger group"
        onClick={() => setOpen(true)}
        onKeyDown={onTriggerKey}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Enlarge ${title}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="visual-map-plate__img"
          sizes="(max-width: 768px) 100vw, min(100vw, 52rem)"
          priority
        />
        <span className="visual-map-plate__hint" aria-hidden>
          Enlarge
        </span>
      </button>

      {open && (
        <div
          className="visual-map-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="visual-map-lightbox__veil"
            aria-label="Close enlarged map"
            tabIndex={-1}
            onClick={close}
          />
          <div className="visual-map-lightbox__panel">
            <div className="visual-map-lightbox__bar">
              <p id={titleId} className="visual-map-lightbox__title">
                {title}
              </p>
              <button
                ref={closeRef}
                type="button"
                className="visual-map-lightbox__close"
                onClick={close}
              >
                Close
              </button>
            </div>
            <div
              className={cn(
                "visual-map-lightbox__scroll",
                height >= width && "visual-map-lightbox__scroll--tall",
              )}
            >
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="visual-map-lightbox__img"
                sizes="100vw"
                quality={95}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
