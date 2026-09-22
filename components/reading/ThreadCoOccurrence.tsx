import Link from "next/link";
import {
  getThreadCoOccurrenceLinks,
  threadHref,
  type ThreadId,
} from "@/lib/threads";
import "./thread-shelf.css";

type Props = {
  threadId: ThreadId;
};

/**
 * Quiet co-membership whispers on a Thread page — ranked from essay-threads.json.
 * Shared essay identities stay in the data layer; not listed in visitor UI yet.
 */
export function ThreadCoOccurrence({ threadId }: Props) {
  const neighbors = getThreadCoOccurrenceLinks(threadId);
  if (neighbors.length === 0) return null;

  return (
    <section
      className="thread-co-occurrence threshold-carved threshold-carved--edge"
      aria-labelledby="thread-co-occurrence-heading"
    >
      <h2 id="thread-co-occurrence-heading" className="type-chamber">
        This pattern also touches…
      </h2>
      <ul className="thread-co-occurrence__list">
        {neighbors.map((neighbor) => (
          <li key={neighbor.threadId}>
            <Link
              href={threadHref(neighbor.threadId)}
              className="thread-co-occurrence__link"
            >
              {neighbor.thread.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
