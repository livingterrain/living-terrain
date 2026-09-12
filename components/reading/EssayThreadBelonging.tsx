import Link from "next/link";
import { getThreadRefs, threadHref } from "@/lib/threads";

interface EssayThreadBelongingProps {
  threadIds?: readonly string[];
}

/**
 * Quiet belonging mark on an essay — named threads, now destinations.
 */
export function EssayThreadBelonging({ threadIds }: EssayThreadBelongingProps) {
  const threads = getThreadRefs(threadIds);
  if (threads.length === 0) return null;

  return (
    <section
      className="essay-thread-belonging threshold-carved threshold-carved--edge"
      aria-labelledby="essay-thread-belonging-heading"
    >
      <h2 id="essay-thread-belonging-heading" className="type-chamber">
        This essay also belongs to
      </h2>
      <ul className="essay-thread-belonging__names lantern-meta">
        {threads.map((thread) => (
          <li key={thread.id}>
            <Link href={threadHref(thread.id)} className="essay-thread-belonging__link">
              {thread.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
