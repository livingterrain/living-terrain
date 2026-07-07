interface ChamberGatherProps {
  centralQuestion: string;
}

export function ChamberGather({ centralQuestion }: ChamberGatherProps) {
  return (
    <section aria-labelledby="chamber-gather">
      <h2 id="chamber-gather" className="type-folio">
        What gathers here
      </h2>
      <p className="type-body mt-4 max-w-2xl text-[0.9375rem] sm:text-base">
        This book gathers essays, questions, and Observatory themes around one
        inquiry:{" "}
        <span className="text-charcoal">{centralQuestion}</span>
      </p>
    </section>
  );
}
