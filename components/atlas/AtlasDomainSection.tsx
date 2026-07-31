import type { AtlasDomainDef } from "@/lib/atlas/archive";
import { AtlasEntryRow } from "./AtlasEntryRow";

type Props = {
  domain: AtlasDomainDef;
  index: number;
};

/**
 * One archive domain — a section of the expanding research index.
 */
export function AtlasDomainSection({ domain, index }: Props) {
  const folio = String(index + 1).padStart(2, "0");

  return (
    <section
      id={`domain-${domain.id}`}
      aria-labelledby={`domain-title-${domain.id}`}
      className="scroll-mt-28"
      data-atlas-domain={domain.id}
    >
      <header className="mb-10 sm:mb-12">
        <p className="type-folio">{folio}</p>
        <h2
          id={`domain-title-${domain.id}`}
          className="mt-4 font-heading text-2xl tracking-tight text-charcoal sm:text-3xl"
        >
          {domain.title}
        </h2>
        <p className="type-lead mt-4 max-w-md text-base sm:text-lg">
          {domain.whisper}
        </p>
      </header>

      <ul className="border-t border-rule/30">
        {domain.entries.map((entry) => (
          <AtlasEntryRow key={entry.id} entry={entry} />
        ))}
      </ul>
    </section>
  );
}
