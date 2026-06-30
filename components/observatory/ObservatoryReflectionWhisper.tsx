"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTerrainNavigation } from "@/components/navigation";
import { REFLECTION, NAVIGATION } from "@/lib/atmosphere/tempo";
import type { ObservatoryReflection } from "@/lib/observatory";
import { markReflectionShown } from "@/lib/observatory";
import { cn } from "@/lib/utils";

interface ObservatoryReflectionWhisperProps {
  reflection: ObservatoryReflection | null;
  onDismiss: () => void;
  className?: string;
}

/**
 * A quiet observation at the edge of attention — never a pop-up,
 * never a claim about the visitor.
 */
export function ObservatoryReflectionWhisper({
  reflection,
  onDismiss,
  className,
}: ObservatoryReflectionWhisperProps) {
  const { navigate } = useTerrainNavigation();
  const [visible, setVisible] = useState(false);
  const dwellRef = useRef(Date.now());
  const revealedRef = useRef(false);

  useEffect(() => {
    if (!reflection) {
      setVisible(false);
      revealedRef.current = false;
      dwellRef.current = Date.now();
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const maybeReveal = () => {
      if (revealedRef.current || !reflection) return;
      const elapsed = Date.now() - dwellRef.current;
      if (elapsed >= REFLECTION.pageDwellMs || reduced) {
        revealedRef.current = true;
        setVisible(true);
      }
    };

    if (reduced) {
      const timer = window.setTimeout(() => {
        revealedRef.current = true;
        setVisible(true);
      }, 1800);
      return () => window.clearTimeout(timer);
    }

    const poll = window.setInterval(maybeReveal, 1200);
    return () => window.clearInterval(poll);
  }, [reflection]);

  const handleInvite = useCallback(() => {
    if (!reflection) return;
    markReflectionShown(reflection.id);
    onDismiss();
    navigate(reflection.invitation.href);
  }, [navigate, onDismiss, reflection]);

  const handleDismiss = useCallback(() => {
    if (!reflection) return;
    markReflectionShown(reflection.id);
    onDismiss();
  }, [onDismiss, reflection]);

  if (!reflection) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          key={reflection.id}
          role="note"
          aria-label={reflection.observation}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{
            duration: REFLECTION.revealDuration / 1000,
            ease: NAVIGATION.ease,
          }}
          className={cn(
            "pointer-events-none fixed z-30",
            "bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-5 sm:right-8",
            "max-w-[14rem] sm:max-w-[16rem]",
            className,
          )}
        >
          <div className="pointer-events-auto space-y-3">
            <p
              className={cn(
                "font-body text-[0.75rem] leading-relaxed tracking-[0.01em]",
                "text-charcoal-faint/80 sm:text-[0.8125rem]",
              )}
            >
              {reflection.observation}
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleInvite}
                className={cn(
                  "text-left font-body text-[0.6875rem] italic tracking-[0.02em]",
                  "text-forest/70 transition-colors duration-[1.4s]",
                  "hover:text-forest focus-visible:text-forest focus-visible:outline-none",
                )}
              >
                {reflection.invitation.text}
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className={cn(
                  "text-left text-[0.5625rem] tracking-[0.04em]",
                  "text-charcoal-faint/45 transition-opacity duration-[1.2s]",
                  "hover:opacity-80 focus-visible:outline-none",
                )}
              >
                Noted
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
