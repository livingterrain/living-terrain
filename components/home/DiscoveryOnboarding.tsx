"use client";

import { AnimatePresence, motion } from "framer-motion";

const ease = [0.45, 0.05, 0.55, 0.95] as const;

interface DiscoveryOnboardingProps {
  visible: boolean;
}

export function DiscoveryOnboarding({ visible }: DiscoveryOnboardingProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
      <AnimatePresence>
        {visible && (
          <motion.p
            key="intro"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 2, ease }}
            className="max-w-md px-6 text-center font-heading text-lg leading-relaxed text-ivory/80 sm:px-8 sm:text-xl sm:text-ivory/75 md:text-2xl"
          >
            Every inquiry begins with a question.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
