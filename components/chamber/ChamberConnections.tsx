import {
  ConnectionWeb,
  type ConnectionItem,
} from "@/components/network";

interface ChamberConnectionsProps {
  questions: ConnectionItem[];
  fieldNotes: ConnectionItem[];
  books: ConnectionItem[];
}

export function ChamberConnections({
  questions,
  fieldNotes,
  books,
}: ChamberConnectionsProps) {
  const hasContent =
    questions.length > 0 || fieldNotes.length > 0 || books.length > 0;

  if (!hasContent) return null;

  return (
    <section aria-labelledby="chamber-network">
      <h2 id="chamber-network" className="type-folio">
        The living network
      </h2>
      <p className="type-body mt-4 max-w-xl text-[0.9375rem]">
        Nothing here stands alone. Questions, notes, and neighboring regions
        gather around this inquiry.
      </p>

      <div className="mt-12 space-y-2">
        {questions.length > 0 && (
          <ConnectionWeb kind="connects" items={questions} />
        )}
        {fieldNotes.length > 0 && (
          <ConnectionWeb
            kind="explore"
            items={fieldNotes}
            className={questions.length > 0 ? "mt-2" : undefined}
          />
        )}
        {books.length > 0 && (
          <ConnectionWeb
            kind="thread"
            items={books}
            label="Neighboring regions"
            className={
              questions.length > 0 || fieldNotes.length > 0
                ? "mt-2"
                : undefined
            }
          />
        )}
      </div>
    </section>
  );
}
