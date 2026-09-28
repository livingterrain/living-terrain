import Link from "next/link";
import { atlasBridgeForThread } from "@/lib/atlas/model";
import type { ThreadId } from "@/lib/threads";
import "./thread-shelf.css";

/**
 * Quiet Atlas connection on a Thread page — only for the five frozen Both mappings.
 * The link lands at the Atlas threshold; there is no deep link into a concept.
 */
export function ThreadAtlasBridge({ threadId }: { threadId: ThreadId }) {
  const bridge = atlasBridgeForThread(threadId);
  if (!bridge) return null;

  const territoryNames = bridge.territories.map((t) => t.label);
  const territoryPhrase =
    territoryNames.length === 1
      ? `the territory of ${territoryNames[0]}`
      : `the territories of ${territoryNames.slice(0, -1).join(", ")} and ${territoryNames.at(-1)}`;

  return (
    <section
      className="thread-atlas-bridge threshold-carved threshold-carved--edge"
      aria-labelledby="thread-atlas-bridge-heading"
    >
      <h2 id="thread-atlas-bridge-heading" className="type-chamber">
        In the Atlas
      </h2>
      <p className="thread-atlas-bridge__text lantern-meta">
        This pattern is also charted in the Atlas — through{" "}
        <em>{bridge.conceptName}</em>, within {territoryPhrase}.
      </p>
      <Link href="/atlas" className="thread-atlas-bridge__link">
        Enter the Atlas →
      </Link>
    </section>
  );
}
