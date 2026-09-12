import { getThreadLabels } from "@/lib/threads";

interface EssayThreadBelongingProps {
  threadIds?: readonly string[];
}

/**
 * Quiet belonging mark on an essay — named threads, not destinations.
 */
export function EssayThreadBelonging({ threadIds }: EssayThreadBelongingProps) {
  const labels = getThreadLabels(threadIds);
  if (labels.length === 0) return null;

  return (
    <section
      className="essay-thread-belonging threshold-carved threshold-carved--edge"
      aria-labelledby="essay-thread-belonging-heading"
    >
      <h2 id="essay-thread-belonging-heading" className="type-chamber">
        This essay also belongs to
      </h2>
      <ul className="essay-thread-belonging__names lantern-meta">
        {labels.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </section>
  );
}
