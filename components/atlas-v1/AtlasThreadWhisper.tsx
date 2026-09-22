/**
 * Quiet authored Thread whisper at an Atlas journey stop.
 * Only for frozen Both mappings — never for Territory-only concepts.
 * Does not teach ontology; offers a pattern that continues elsewhere.
 */

import Link from "next/link";
import type { AtlasV1ConceptId } from "@/lib/atlas-v1/content";
import {
  authoredThreadHrefForConcept,
  authoredThreadWhisperForConcept,
} from "@/lib/atlas/model";
import { cn } from "@/lib/utils";
import "./atlas-thread-whisper.css";

type Props = {
  conceptId: AtlasV1ConceptId;
  className?: string;
  /** Fired when the visitor activates the Thread link (save journey-return snapshot). */
  onLeaveToThread?: (threadId: string) => void;
};

export function AtlasThreadWhisper({
  conceptId,
  className,
  onLeaveToThread,
}: Props) {
  const thread = authoredThreadWhisperForConcept(conceptId);
  const href = authoredThreadHrefForConcept(conceptId);
  if (!thread || !href) return null;

  return (
    <p className={cn("atlas-thread-whisper", className)}>
      <Link
        href={href}
        className="atlas-thread-whisper__link"
        aria-label={`This pattern continues as ${thread.label}`}
        onClick={() => onLeaveToThread?.(thread.id)}
      >
        <span className="atlas-thread-whisper__cue">This pattern continues</span>
        <span className="atlas-thread-whisper__sep" aria-hidden>
          ·
        </span>
        <span className="atlas-thread-whisper__name">{thread.label}</span>
      </Link>
    </p>
  );
}
