import Link from "next/link";
import { TextLink } from "@/components/design-system";
import {
  evidenceKindLabel,
  getEvidenceForInvestigation,
  getRelatedInvestigations,
  statusLabel,
  type ObservatoryInvestigation,
} from "@/lib/observatory/investigations";

/**
 * Single investigation — a quiet research file.
 */
export function InvestigationView({
  investigation,
}: {
  investigation: ObservatoryInvestigation;
}) {
  const related = getRelatedInvestigations(investigation);
  const evidence = getEvidenceForInvestigation(investigation.id);

  return (
    <article className="obs-studio obs-studio--file">
      <header className="obs-studio__file-head">
        <TextLink href="/observatory" className="text-sm text-charcoal-faint">
          ← Observatory
        </TextLink>
        <p className="type-meta mt-10 text-forest-faint">
          {statusLabel(investigation.status)}
          <span className="text-charcoal-faint"> · </span>
          Revised {investigation.revised}
        </p>
        <h1 className="mt-3 font-heading text-3xl tracking-tight text-charcoal sm:text-[2.5rem] sm:leading-[1.15]">
          {investigation.title}
        </h1>
        <p className="mt-6 max-w-2xl font-heading text-xl italic leading-[1.45] text-charcoal-muted sm:text-[1.65rem] sm:leading-[1.4]">
          {investigation.question}
        </p>
        <p className="type-body mt-6 max-w-xl text-[1.0625rem] leading-[1.75] text-charcoal-muted">
          {investigation.description}
        </p>
      </header>

      <section
        aria-labelledby="obs-observations"
        className="obs-studio__section"
      >
        <h2 id="obs-observations" className="type-folio text-charcoal-faint">
          Observations
        </h2>
        <ul className="obs-studio__file-obs mt-9">
          {investigation.observations.map((o) => (
            <li key={o.id}>
              <p className="font-heading text-lg leading-[1.55] text-charcoal sm:text-xl sm:leading-[1.5]">
                {o.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {evidence.length > 0 && (
        <section
          aria-labelledby="obs-evidence"
          className="obs-studio__section"
        >
          <h2 id="obs-evidence" className="type-folio text-charcoal-faint">
            In the terrain
          </h2>
          <ul className="obs-studio__evidence mt-7">
            {evidence.map((item) => (
              <li key={item.id}>
                <TextLink
                  href={item.href}
                  className="obs-studio__ev group inline-flex flex-col items-start gap-1 text-left no-underline"
                >
                  <span className="type-meta text-forest-faint">
                    {evidenceKindLabel(item.kind)}
                  </span>
                  <span className="font-heading text-[1.05rem] text-charcoal transition-colors duration-700 group-hover:text-forest">
                    {item.label}
                  </span>
                </TextLink>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="obs-related" className="obs-studio__section">
          <h2 id="obs-related" className="type-folio text-charcoal-faint">
            Nearby
          </h2>
          <ul className="threshold-carved-list mt-7">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/observatory/${r.slug}`}
                  className="terrain-list-link group"
                >
                  <p className="type-meta text-forest-faint">
                    {statusLabel(r.status)}
                    <span className="text-charcoal-faint"> · </span>
                    Revised {r.revised}
                  </p>
                  <h3 className="mt-2 font-heading text-xl text-charcoal transition-colors duration-700 group-hover:text-forest">
                    {r.title}
                  </h3>
                  <p className="mt-3 max-w-xl font-heading text-[1.05rem] italic leading-[1.5] text-charcoal-muted">
                    {r.question}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
