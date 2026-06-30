"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface BreathProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

/** Opacity-only entrance — breathing, not sliding */
export function Breath({
  children,
  className,
  delay = 0,
  ...props
}: BreathProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1.4,
        delay,
        ease: [0.45, 0.05, 0.55, 0.95],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** @deprecated Use Breath — scroll reveals removed from design language */
export function FadeIn(props: BreathProps) {
  return <Breath {...props} />;
}

export function StaggerChildren({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
