"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { THRESHOLD_MOTION } from "@/lib/design-system/threshold";
import { placeForPath } from "@/lib/world/location-for-path";
import { cn } from "@/lib/utils";
import type { RoomKind } from "@/lib/rooms";
import { rooms } from "@/lib/rooms";

interface RoomThresholdProps {
  kind: RoomKind;
  title?: string;
  description?: string;
  whisper?: string;
  align?: "left" | "center";
  children?: ReactNode;
  className?: string;
}

/**
 * Arrival at a place — whisper first, title secondary, no page header chrome.
 */
export function RoomThreshold({
  kind,
  title,
  description,
  whisper,
  align = "left",
  children,
  className,
}: RoomThresholdProps) {
  const pathname = usePathname();
  const profile = rooms[kind];
  const cue = whisper ?? profile.whisper;
  const place = placeForPath(pathname);

  return (
    <header
      className={cn(
        "world-arrival py-16 sm:py-24 md:py-32",
        align === "center" && "text-center",
        className,
      )}
    >
      <Container narrow={align === "center"}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: THRESHOLD_MOTION.chamberRevealMs / 1000,
            ease: THRESHOLD_MOTION.ease,
          }}
          className="type-chamber text-charcoal-faint/90"
        >
          {place}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: THRESHOLD_MOTION.chamberRevealMs / 1000 + 0.3,
            delay: 0.15,
            ease: THRESHOLD_MOTION.ease,
          }}
          className={cn(
            "world-arrival__whisper mt-5 font-heading text-lg italic leading-[1.55] text-charcoal-muted sm:mt-6 sm:text-xl sm:leading-[1.55] md:text-2xl md:leading-[1.5]",
            align === "center" && "mx-auto max-w-xl",
          )}
        >
          {cue}
        </motion.p>

        {title && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: THRESHOLD_MOTION.chamberRevealMs / 1000,
              delay: 0.45,
              ease: THRESHOLD_MOTION.ease,
            }}
            className={cn(
              "type-room mt-10 text-balance text-charcoal/90",
              align === "center" && "mx-auto max-w-2xl",
            )}
          >
            {title}
          </motion.h1>
        )}

        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: THRESHOLD_MOTION.chamberRevealMs / 1000,
              delay: 0.6,
              ease: THRESHOLD_MOTION.ease,
            }}
            className={cn(
              "type-body mt-5 max-w-xl text-charcoal-muted/85",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: THRESHOLD_MOTION.chamberRevealMs / 1000,
              delay: 0.75,
              ease: THRESHOLD_MOTION.ease,
            }}
            className={align === "center" ? "mt-10" : "mt-8"}
          >
            {children}
          </motion.div>
        )}
      </Container>
    </header>
  );
}
