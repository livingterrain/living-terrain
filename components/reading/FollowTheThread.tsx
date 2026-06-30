"use client";

import { useMemo } from "react";
import { useThread } from "@/components/thread/ThreadProvider";
import { hasThreadPath } from "@/lib/relationships/thread-path";
import type { NodeRef } from "@/lib/relationships";
import { cn } from "@/lib/utils";

interface FollowTheThreadProps {
  nodeRef: NodeRef;
  returnHref: string;
  returnLabel?: string;
  className?: string;
}

/**
 * The defining invitation — trace relationships instead of hopping between pages.
 */
export function FollowTheThread({
  nodeRef,
  returnHref,
  returnLabel,
  className,
}: FollowTheThreadProps) {
  const thread = useThread();
  const canThread = useMemo(() => hasThreadPath(nodeRef), [nodeRef]);

  if (!canThread) return null;

  return (
    <aside
      className={cn("mt-12 border-t border-rule/40 pt-10", className)}
      aria-label="Follow the thread through the Living Terrain"
    >
      <button
        type="button"
        onClick={() =>
          thread.open({
            origin: nodeRef,
            returnHref,
            returnLabel,
          })
        }
        className="group text-left"
      >
        <span className="font-heading text-xl text-charcoal transition-colors duration-700 group-hover:text-forest sm:text-2xl">
          Follow the Thread →
        </span>
        <p className="type-body mt-3 max-w-md text-[0.9375rem] text-charcoal-faint/90">
          Watch how this idea connects — without leaving the page.
        </p>
      </button>
    </aside>
  );
}
