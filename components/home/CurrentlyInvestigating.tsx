import { TerrainLink } from "@/components/navigation";
import { threadHref, type ThreadId } from "@/lib/threads";

const INVESTIGATIONS = [
  {
    threadId: "boundary" as const satisfies ThreadId,
    question: "What happens when a boundary stops regulating exchange?",
    context: "Skin · immunity · microbial ecology · relationship",
  },
  {
    threadId: "intelligence" as const satisfies ThreadId,
    question: "If intelligence is no longer scarce, what actually becomes scarce?",
    context: "AI · coordination · judgment · meaning",
  },
  {
    threadId: "relationship" as const satisfies ThreadId,
    question: "Does relationship precede the things being related?",
    context: "Physics · biology · Logos · consciousness",
  },
] as const;

/**
 * Live research status on the threshold — open questions that open into threads.
 */
export function CurrentlyInvestigating() {
  return (
    <section
      className="lt-v2__investigating"
      aria-labelledby="currently-investigating-heading"
    >
      <header className="lt-v2__investigating-head">
        <h2
          id="currently-investigating-heading"
          className="lt-v2__investigating-title"
        >
          Currently Investigating
        </h2>
        <p className="lt-v2__investigating-status">
          <span className="lt-v2__investigating-live">Open</span>
        </p>
      </header>
      <ul className="lt-v2__investigating-list">
        {INVESTIGATIONS.map((item) => (
          <li key={item.threadId}>
            <TerrainLink
              href={threadHref(item.threadId)}
              className="lt-v2__investigating-entry"
            >
              <span className="lt-v2__investigating-q">{item.question}</span>
              <span className="lt-v2__investigating-ctx">{item.context}</span>
              <span className="lt-v2__investigating-follow">
                Follow this thread →
              </span>
            </TerrainLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
