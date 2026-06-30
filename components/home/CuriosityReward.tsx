"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const REWARDS = [
  "You noticed something…",
  "A thread catches the light.",
  "The map remembers your attention.",
  "Something stirs at the edge of sight.",
  "Patience opens a quieter door.",
] as const;

interface CuriosityRewardProps {
  exploredCount: number;
  paused?: boolean;
}

/**
 * Fleeting rewards for slowing down — never modal, never demanding.
 */
export function CuriosityReward({
  exploredCount,
  paused = false,
}: CuriosityRewardProps) {
  const [message, setMessage] = useState<string | null>(null);
  const shownMilestones = useRef<Set<number>>(new Set());
  const rewardIndex = useRef(0);

  useEffect(() => {
    if (paused || exploredCount < 1) return;

    const milestones = [1, 3, 5, 8, 12];
    const hit = milestones.find(
      (m) => exploredCount >= m && !shownMilestones.current.has(m),
    );
    if (!hit) return;

    shownMilestones.current.add(hit);
    const text = REWARDS[rewardIndex.current % REWARDS.length];
    rewardIndex.current += 1;
    setMessage(text);

    const hide = window.setTimeout(() => setMessage(null), 5200);
    return () => window.clearTimeout(hide);
  }, [exploredCount, paused]);

  return (
    <AnimatePresence>
      {message && (
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 2.2, ease: [0.45, 0.05, 0.55, 0.95] }}
          className="pointer-events-none absolute bottom-32 left-1/2 z-[15] -translate-x-1/2 font-heading text-sm italic text-ivory/32 sm:bottom-36 sm:text-[0.9375rem]"
          aria-live="polite"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
