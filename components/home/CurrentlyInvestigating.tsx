const INVESTIGATIONS = [
  {
    question: "What happens when a boundary stops regulating exchange?",
    context: "Skin · immunity · microbial ecology · relationship",
  },
  {
    question: "If intelligence is no longer scarce, what actually becomes scarce?",
    context: "AI · coordination · judgment · meaning",
  },
  {
    question: "Does relationship precede the things being related?",
    context: "Physics · biology · Logos · consciousness",
  },
] as const;

/**
 * Live research status on the threshold — open questions, not destinations.
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
          <li key={item.question}>
            <p className="lt-v2__investigating-q">{item.question}</p>
            <p className="lt-v2__investigating-ctx">{item.context}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
