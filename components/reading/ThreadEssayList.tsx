import Link from "next/link";
import type { Essay } from "@/lib/content/types";
import { displayEssayTitle } from "@/lib/content/essay-display";
import { formatDate } from "@/lib/utils";

interface ThreadEssayListProps {
  essays: Essay[];
}

export function ThreadEssayList({ essays }: ThreadEssayListProps) {
  if (essays.length === 0) {
    return (
      <p className="lantern-meta mt-8">No essays have been gathered on this thread yet.</p>
    );
  }

  return (
    <ol className="thread-essay-list">
      {essays.map((essay) => (
        <li key={essay.id}>
          <Link href={`/essays/${essay.slug}`} className="thread-essay-list__link">
            <p className="type-meta lantern-meta">{formatDate(essay.publishedAt)}</p>
            <h2 className="thread-essay-list__title">{displayEssayTitle(essay.title)}</h2>
            {essay.subtitle && (
              <p className="thread-essay-list__subtitle">{essay.subtitle}</p>
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
}
