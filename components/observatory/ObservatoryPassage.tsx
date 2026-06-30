"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { REFLECTION, NAVIGATION } from "@/lib/atmosphere/tempo";
import {
  composeReflection,
  loadJourney,
  markReflectionShown,
  subscribeJourney,
  type ObservatoryReflection,
} from "@/lib/observatory";

/**
 * When the visitor reaches the Observatory after wandering,
 * the room itself offers a quiet observation — not a dashboard.
 */
export function ObservatoryPassage() {
  const [reflection, setReflection] = useState<ObservatoryReflection | null>(null);

  useEffect(() => {
    const refresh = () => {
      const journey = loadJourney();
      const composed = composeReflection(journey, "/observatory");
      setReflection(composed);
    };

    refresh();
    return subscribeJourney(refresh);
  }, []);

  if (!reflection) return null;

  const handleInvite = () => {
    markReflectionShown(reflection.id);
  };

  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: REFLECTION.revealDuration / 1000, ease: NAVIGATION.ease }}
      className="mb-16 border-b border-rule/35 pb-12"
      aria-label="Observatory reflection"
    >
      <p className="type-folio text-charcoal-faint">A pattern noticed</p>
      <p className="type-body mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-charcoal-muted">
        {reflection.observation}
      </p>
      <Link
        href={reflection.invitation.href}
        onClick={handleInvite}
        className="type-body mt-5 inline-block text-[0.8125rem] italic text-forest/75 transition-colors duration-700 hover:text-forest"
      >
        {reflection.invitation.text}
      </Link>
    </motion.aside>
  );
}
