"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
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

export function RoomThreshold({
  kind,
  title,
  description,
  whisper,
  align = "left",
  children,
  className,
}: RoomThresholdProps) {
  const profile = rooms[kind];
  const cue = whisper ?? profile.whisper;

  return (
    <header
      className={cn(
        "border-b border-rule/40 py-20 sm:py-28",
        align === "center" && "text-center",
        className,
      )}
    >
      <Container narrow={align === "center"}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.45, 0.05, 0.55, 0.95] }}
          className={cn(
            "type-lead text-base sm:text-lg",
            align === "center" && "mx-auto max-w-md",
          )}
        >
          {cue}
        </motion.p>

        {title && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.8,
              delay: 0.15,
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
            className={cn(
              "type-room mt-8 text-balance",
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
              duration: 1.6,
              delay: 0.3,
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
            className={cn(
              "type-body mt-6 max-w-2xl",
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
              duration: 1.6,
              delay: 0.45,
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
            className={align === "center" ? "mt-8" : "mt-6"}
          >
            {children}
          </motion.div>
        )}
      </Container>
    </header>
  );
}
