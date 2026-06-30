"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTerrainNavigation } from "@/components/navigation";
import { DISCOVERY, NAVIGATION } from "@/lib/atmosphere/tempo";
import {
  hasSeenDiscovery,
  markDiscoverySeen,
  pickDiscoveryCue,
  type DiscoveryCue,
} from "@/lib/reading/discovery-cue";
import type { NodeRef } from "@/lib/relationships";
import { nodeKey } from "@/lib/relationships/types";
import { cn } from "@/lib/utils";

interface QuietDiscoveryProps {
  nodeRef: NodeRef;
  /** Precomputed on the server when available */
  cue?: DiscoveryCue | null;
  className?: string;
}

/**
 * A whisper at the edge of attention — revealed by dwelling and scrolling,
 * never placed like an advertisement.
 */
export function QuietDiscovery({
  nodeRef,
  cue: cueProp,
  className,
}: QuietDiscoveryProps) {
  const { navigate } = useTerrainNavigation();
  const cue = useMemo(
    () => cueProp ?? pickDiscoveryCue(nodeRef),
    [cueProp, nodeRef],
  );

  const [visible, setVisible] = useState(false);
  const [activated, setActivated] = useState(false);
  const dwellRef = useRef(Date.now());
  const revealedRef = useRef(false);

  useEffect(() => {
    if (!cue || hasSeenDiscovery(nodeRef)) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const maybeReveal = () => {
      if (revealedRef.current) return;
      const scrollMax =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollMax > 0 ? window.scrollY / scrollMax : window.scrollY > 120 ? 1 : 0;
      const elapsed = Date.now() - dwellRef.current;

      if (
        progress >= DISCOVERY.minScroll &&
        (elapsed >= DISCOVERY.minDwellMs || reduced)
      ) {
        revealedRef.current = true;
        setVisible(true);
      }
    };

    if (reduced) {
      const timer = window.setTimeout(() => {
        revealedRef.current = true;
        setVisible(true);
      }, 1200);
      return () => window.clearTimeout(timer);
    }

    window.addEventListener("scroll", maybeReveal, { passive: true });
    const poll = window.setInterval(maybeReveal, 800);
    return () => {
      window.removeEventListener("scroll", maybeReveal);
      window.clearInterval(poll);
    };
  }, [cue, nodeRef]);

  const handleActivate = useCallback(() => {
    if (!cue || activated) return;
    setActivated(true);
    markDiscoverySeen(nodeRef);
    navigate(`/?focus=${cue.focusId}`);
  }, [activated, cue, navigate, nodeRef]);

  if (!cue) return null;

  return (
    <AnimatePresence>
      {visible && !activated && (
        <motion.aside
          key={nodeKey(nodeRef)}
          role="note"
          aria-label={cue.phrase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{
            duration: DISCOVERY.revealDuration / 1000,
            ease: NAVIGATION.ease,
          }}
          className={cn(
            "pointer-events-none fixed z-30",
            "bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-5 sm:left-8",
            "max-w-[11rem] sm:max-w-[12.5rem]",
            className,
          )}
        >
          <button
            type="button"
            onClick={handleActivate}
            className={cn(
              "pointer-events-auto text-left",
              "font-body text-[0.6875rem] leading-relaxed tracking-[0.02em]",
              "text-charcoal-faint/75 transition-[color,opacity] duration-[1.2s]",
              "hover:text-forest/80 focus-visible:text-forest/80 focus-visible:outline-none",
              "sm:text-[0.71875rem]",
            )}
          >
            <span className="italic">{cue.phrase}</span>
            {cue.whisper && (
              <span className="mt-1.5 block truncate text-[0.5625rem] not-italic opacity-55">
                {cue.whisper}
              </span>
            )}
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
