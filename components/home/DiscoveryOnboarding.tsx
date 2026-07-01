"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NAVIGATION } from "@/lib/atmosphere/tempo";

interface DiscoveryOnboardingProps {
  visible: boolean;
}

export function DiscoveryOnboarding({ visible }: DiscoveryOnboardingProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6">
      <AnimatePresence>
        {visible && (
          <motion.div
            key="intro"
            initial={reducedMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{
              duration: reducedMotion ? 0.01 : 2.6,
              ease: NAVIGATION.ease,
            }}
            className="max-w-md text-center"
          >
            <p className="font-heading text-lg leading-relaxed text-ivory/78 sm:text-xl">
              Begin at the radiant center — or choose a realm.
            </p>
            <p className="mt-5 text-[0.8125rem] leading-relaxed text-ivory/38 sm:text-sm">
              Large bodies hold the architecture. Smaller stars await closer
              wandering.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
