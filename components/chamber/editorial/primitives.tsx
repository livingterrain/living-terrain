import Image from "next/image";
import Link from "next/link";
import type {
  EditorialFigure,
  EditorialMargin,
  EditorialQuote,
  EditorialReference,
} from "./types";

/** Museum-label archival metadata for the hero. */
export function ArchivePlate({
  volume,
  catalog,
}: {
  volume: string;
  catalog: string;
}) {
  return (
    <dl className="w-full max-w-[13.5rem] space-y-5">
      <div>
        <dt className="type-chamber">Volume</dt>
        <dd className="mt-1.5 font-heading text-[0.9375rem] text-charcoal">
          {volume}
        </dd>
      </div>
      <div>
        <dt className="type-chamber">Catalog</dt>
        <dd className="mt-1.5 type-folio text-charcoal-muted">{catalog}</dd>
      </div>
      <div>
        <dt className="sr-only">Class</dt>
        <dd className="font-heading text-[0.9375rem] italic text-charcoal-muted">
          Collected Inquiry
        </dd>
      </div>
      <div>
        <dt className="type-chamber">Published</dt>
        <dd className="mt-1.5 type-folio text-charcoal-muted">2025</dd>
      </div>
      <div>
        <dt className="type-chamber">Status</dt>
        <dd className="mt-1.5 font-heading text-[0.9375rem] italic text-gold-muted">
          Inquiry continues
        </dd>
      </div>
    </dl>
  );
}

/** Cover treated as a physical object. */
export function CoverObject({
  src,
  alt,
  width = 313,
  height = 500,
  priority = false,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  return (
    <div className="relative w-[10.5rem] shrink-0 sm:w-[12.75rem]">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="block w-full"
        style={{
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.035) inset, 1px 0 0 rgba(255,255,255,0.04), 0 18px 40px -22px rgba(0,0,0,0.55), 0 4px 10px -6px rgba(0,0,0,0.35)",
        }}
      />
      <span
        className="absolute -right-[2px] top-[3px] bottom-[3px] w-[2px] bg-gradient-to-r from-ivory/[0.12] to-transparent"
        aria-hidden="true"
      />
      <span
        className="absolute -right-[4px] top-[5px] bottom-[5px] w-[2px] bg-ivory/[0.04]"
        aria-hidden="true"
      />
    </div>
  );
}

/** One-sentence marginal annotation. */
export function MarginNote({ label, text, href }: EditorialMargin) {
  const body = href ? (
    <Link
      href={href}
      className="mt-2 block font-heading text-[0.875rem] italic leading-snug text-charcoal-muted transition-colors duration-[1.4s] hover:text-charcoal"
    >
      {text}
    </Link>
  ) : (
    <p className="mt-2 font-heading text-[0.875rem] italic leading-snug text-charcoal-muted">
      {text}
    </p>
  );

  return (
    <aside className="max-w-[14rem]">
      <p className="type-chamber">{label}</p>
      {body}
    </aside>
  );
}

/** Simple stage figure for launch chambers. */
export function StageFigure({ figure }: { figure: EditorialFigure }) {
  const captionId = `fig-${figure.number.replace(/\s+/g, "-")}-cap`;

  return (
    <figure aria-labelledby={captionId}>
      <div className="flex items-baseline justify-between gap-6 border-b border-rule/25 pb-4">
        <p className="type-folio">Figure {figure.number}</p>
        <p className="font-heading text-[0.9375rem] italic text-charcoal-faint">
          {figure.title}
        </p>
      </div>

      <ol className="mt-16 flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        {figure.stages.map((stage, i) => (
          <li
            key={stage.name}
            className="flex items-end gap-6 sm:block sm:flex-1"
          >
            <div>
              <p className="font-heading text-2xl tracking-tight text-charcoal sm:text-[1.75rem]">
                {stage.name}
              </p>
              <p className="type-meta mt-2">{stage.gloss}</p>
            </div>
            {i < figure.stages.length - 1 && (
              <span
                className="mb-2 font-body text-charcoal-faint sm:mb-0 sm:mt-6 sm:block sm:text-center"
                aria-hidden="true"
              >
                ⟶
              </span>
            )}
          </li>
        ))}
      </ol>

      <figcaption
        id={captionId}
        className="mt-14 max-w-md font-heading text-[0.9375rem] italic leading-relaxed text-charcoal-faint"
      >
        {figure.caption}
      </figcaption>
    </figure>
  );
}

export function QuoteBlock({ quote }: { quote: EditorialQuote }) {
  return (
    <blockquote className="ml-auto max-w-xl text-right sm:max-w-2xl">
      <p className="font-heading text-[1.65rem] italic leading-[1.38] text-charcoal sm:text-[2.125rem]">
        {quote.text}
      </p>
      {quote.attribution && (
        <footer className="type-chamber mt-10">{quote.attribution}</footer>
      )}
    </blockquote>
  );
}

export function FieldNote({ children }: { children: string }) {
  return (
    <aside className="relative max-w-sm pl-5">
      <span
        className="absolute bottom-1 left-0 top-1 w-px bg-gold-faint/40"
        aria-hidden="true"
      />
      <p className="type-chamber">Field note</p>
      <p className="mt-4 font-heading text-[1.0625rem] italic leading-[1.65] text-charcoal-muted">
        {children}
      </p>
    </aside>
  );
}

export function CatalogSlip({
  href,
  label = "Bound record",
}: {
  href: string;
  label?: string;
}) {
  return (
    <aside className="mx-auto max-w-md text-center">
      <p className="type-chamber">{label}</p>
      <div className="mx-auto mt-8 h-px w-16 bg-rule/40" />
      <p className="mt-8 font-heading text-[1.0625rem] italic leading-relaxed text-charcoal-muted">
        This investigation also exists as a bound field journal — the physical
        record of the survey.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="type-meta mt-8 inline-block tracking-[0.04em] transition-colors duration-[1.4s] hover:text-charcoal-muted"
      >
        Request the original record
      </a>
      <div className="mx-auto mt-10 h-px w-16 bg-rule/40" />
    </aside>
  );
}

export function ContinueInvestigation({
  references,
}: {
  references: ReadonlyArray<EditorialReference>;
}) {
  return (
    <section aria-labelledby="continue-heading">
      <h2 id="continue-heading" className="type-chamber">
        Continue the investigation
      </h2>

      <ul className="mt-14">
        {references.map((ref) => (
          <li key={ref.href} className="border-t border-rule/25 last:border-b">
            <Link
              href={ref.href}
              className="group grid gap-1 py-7 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-baseline sm:gap-10"
            >
              <span className="type-chamber transition-colors duration-[1.4s] group-hover:text-charcoal-muted">
                {ref.kind}
              </span>
              <span>
                <span className="block font-heading text-lg leading-snug text-charcoal transition-colors duration-[1.4s] group-hover:text-gold-muted sm:text-xl">
                  {ref.title}
                </span>
                <span className="type-meta mt-1.5 block">{ref.invitation}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
