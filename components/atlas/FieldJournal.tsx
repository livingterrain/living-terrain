import { TextLink } from "@/components/design-system";

interface FieldJournalProps {
  url: string;
  className?: string;
}

/**
 * Physical field journal — historical evidence of the investigation, not commerce.
 */
export function FieldJournal({ url, className }: FieldJournalProps) {
  return (
    <section
      aria-label="Field journal"
      className={className ?? "border-t border-rule/40 pt-16"}
    >
      <p className="type-folio text-[0.625rem] uppercase tracking-[0.16em] text-charcoal-faint">
        Field journal
      </p>
      <p className="type-body mt-4 max-w-xl text-[0.9375rem]">
        The full record of this investigation exists as a bound field journal — the
        survey from which this map emerged. Living Terrain holds the cartography;
        the journal is evidence you may hold in your hands.
      </p>
      <TextLink href={url} external muted className="mt-6 inline-block text-sm">
        View the field journal
      </TextLink>
    </section>
  );
}
