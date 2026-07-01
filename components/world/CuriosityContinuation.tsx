"use client";

import { usePathname } from "next/navigation";
import { PathwayLink } from "@/components/design-system/threshold";
import { continuationForPath } from "@/lib/world/continuations";

/**
 * A single horizon line — not navigation, but the feeling that the world continues.
 */
export function CuriosityContinuation() {
  const pathname = usePathname();
  const next = continuationForPath(pathname);

  if (!next) return null;

  return (
    <aside
      className="world-continuation pointer-events-auto mx-auto max-w-md px-5 pb-[max(5rem,env(safe-area-inset-bottom,0px))] pt-16 text-center sm:px-12 sm:pb-28 sm:pt-20"
      aria-label="The world continues"
    >
      <p className="font-heading text-base italic leading-relaxed text-charcoal-muted/80 sm:text-lg">
        {next.whisper}
      </p>
      <PathwayLink href={next.href} className="mt-6 text-sm">
        {next.label}
      </PathwayLink>
    </aside>
  );
}
