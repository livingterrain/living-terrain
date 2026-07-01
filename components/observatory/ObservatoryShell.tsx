import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ObservatoryShellProps {
  children: ReactNode;
  className?: string;
}

/** Dark amber observatory atmosphere — wraps all Observatory routes */
export function ObservatoryShell({ children, className }: ObservatoryShellProps) {
  return (
    <div className={cn("observatory-realm relative min-h-[calc(100dvh-4.5rem)] sm:min-h-[calc(100dvh-5rem)]", className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #c4a06a 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface ObservatoryThresholdProps {
  title?: string;
  description?: string;
}

export function ObservatoryThreshold({
  title = "Observatory",
  description = "A quiet place where ideas are collected, connected, and allowed to mature.",
}: ObservatoryThresholdProps) {
  return (
    <header className="border-b border-[var(--obs-border)] px-7 py-20 text-center sm:px-12 sm:py-28 lg:px-14">
      <p className="font-body text-[0.6875rem] uppercase tracking-[0.22em] text-[var(--obs-amber-dim)]">
        Living Terrain
      </p>
      <h1 className="mt-5 font-heading text-3xl tracking-tight text-[var(--obs-ivory)] sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h1>
      <p className="mx-auto mt-6 max-w-md text-[0.9375rem] leading-[1.85] text-[var(--obs-muted)] sm:text-base">
        {description}
      </p>
    </header>
  );
}

export function ObservatoryCollectionDivider({ label }: { label: string }) {
  return (
    <div className="observatory-divider" role="presentation">
      <span>{label}</span>
    </div>
  );
}
