import { ObservationCard } from "./ObservationCard";
import type { VisitorObservation } from "@/lib/observatory/types";

interface RecentObservationsProps {
  observations: VisitorObservation[];
}

export function RecentObservations({ observations }: RecentObservationsProps) {
  if (!observations.length) return null;

  return (
    <section aria-labelledby="recent-observations" className="mt-20">
      <h2 id="recent-observations" className="type-folio text-[var(--obs-brass-dim)]">
        Recent entries in the ledger
      </h2>
      <p className="type-body mt-3 max-w-xl text-[0.9375rem] text-[var(--obs-muted)]">
        What visitors have recorded — evidence added to the shared investigation,
        without hurry or debate.
      </p>
      <div className="mt-8">
        {observations.map((observation) => (
          <ObservationCard key={observation.id} observation={observation} compact />
        ))}
      </div>
    </section>
  );
}
