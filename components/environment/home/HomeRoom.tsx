"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { RoomKind } from "@/lib/rooms";
import { rooms } from "@/lib/rooms";
import { RoomAtmosphere } from "../RoomAtmosphere";

interface HomeRoomProps {
  id?: string;
  kind: RoomKind;
  whisper?: string;
  children: ReactNode;
  className?: string;
  /** Screen-reader section title */
  ariaLabel: string;
}

export function HomeRoom({
  id,
  kind,
  whisper,
  children,
  className,
  ariaLabel,
}: HomeRoomProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const profile = rooms[kind];
  const cue = whisper ?? profile.whisper;

  return (
    <section
      id={id}
      ref={ref}
      aria-label={ariaLabel}
      className={cn(
        "relative border-b border-rule/40",
        profile.surface,
        className,
      )}
    >
      <div className="absolute inset-0 opacity-[0.42]">
        <RoomAtmosphere kind={kind} />
      </div>
      <div className={cn("relative z-10", profile.vignette)}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.45, 0.05, 0.55, 0.95] }}
          className="type-lead px-6 pt-20 text-center text-base sm:px-10 sm:pt-24 sm:text-lg"
        >
          {cue}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 1.8,
            delay: 0.2,
            ease: [0.45, 0.05, 0.55, 0.95],
          }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
