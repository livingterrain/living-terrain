"use client";

import { useMemo } from "react";
import { useThread } from "@/components/thread/ThreadProvider";
import { hasThreadPath } from "@/lib/relationships/thread-path";
import type { NodeRef } from "@/lib/relationships";
import { cn } from "@/lib/utils";

interface ThreadTraceProps {
  nodeRef: NodeRef;
  returnHref: string;
  returnLabel?: string;
  className?: string;
}

/**
 * Optional cinematic trace — invisible until sought.
 */
export function ThreadTrace({
  nodeRef,
  returnHref,
  returnLabel,
  className,
}: ThreadTraceProps) {
  const thread = useThread();
  const canTrace = useMemo(() => hasThreadPath(nodeRef), [nodeRef]);

  if (!canTrace) return null;

  return (
    <button
      type="button"
      onClick={() =>
        thread.open({
          origin: nodeRef,
          returnHref,
          returnLabel,
        })
      }
      className={cn(
        "mt-8 text-left text-[0.8125rem] text-charcoal-faint/80 transition-colors duration-700 hover:text-forest",
        className,
      )}
    >
      Trace this thread on the map →
    </button>
  );
}
