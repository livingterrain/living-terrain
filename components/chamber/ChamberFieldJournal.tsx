interface ChamberFieldJournalProps {
  url: string;
  className?: string;
}

/**
 * Museum-label reference to the bound field journal — not commerce.
 * The whole label gently opens the official record in a new tab.
 */
export function ChamberFieldJournal({ url, className }: ChamberFieldJournalProps) {
  return (
    <aside className={className} aria-label="Original field journal">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="field-journal-artifact group block max-w-md border border-rule/50 bg-gradient-to-br from-ivory/55 to-ivory/25 px-7 py-6 transition-[border-color,background-color] duration-[1.2s] hover:border-[#c4a06a]/20 hover:from-ivory/65 hover:to-ivory/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest/35 sm:px-8 sm:py-7"
      >
        <p className="type-folio text-[0.625rem] uppercase tracking-[0.16em] text-charcoal-faint">
          The original field journal
        </p>
        <p className="type-body mt-3 max-w-sm text-[0.875rem] leading-relaxed text-charcoal-muted">
          This completed investigation also exists as a bound record.
        </p>
        <span className="type-body mt-5 inline-block text-[0.8125rem] text-charcoal-faint transition-colors duration-[1.2s] group-hover:text-charcoal-muted">
          View the original field journal →
        </span>
      </a>
    </aside>
  );
}
