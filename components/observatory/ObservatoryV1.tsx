import Link from "next/link";
import { TextLink } from "@/components/design-system";
import {
  evidenceKindLabel,
  getEvidenceLinks,
  getFieldObservations,
  getInvestigationById,
  getInvestigations,
  statusLabel,
  type EvidenceLink,
  type FieldObservation,
  type ObservatoryInvestigation,
} from "@/lib/observatory/investigations";

/**
 * Observatory V1 — working research studio.
 * Editorial refinement: quieter, more inevitable.
 */
export function ObservatoryHub() {
  const investigations = getInvestigations();
  const observations = getFieldObservations();
  const evidence = getEvidenceLinks();

  return (
    <div className="obs-studio">
      <section aria-labelledby="obs-investigations">
        <h2 id="obs-investigations" className="type-folio text-charcoal-faint">
          Investigations
        </h2>
        <ul className="threshold-carved-list mt-9 sm:mt-11">
          {investigations.map((inv) => (
            <li key={inv.id}>
              <InvestigationRow investigation={inv} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="obs-field" className="obs-studio__section">
        <h2 id="obs-field" className="type-folio text-charcoal-faint">
          Field observations
        </h2>
        <ul className="obs-studio__pins mt-9 sm:mt-11" role="list">
          {observations.map((o) => (
            <li key={o.id}>
              <FieldPin observation={o} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="obs-evidence" className="obs-studio__section">
        <h2 id="obs-evidence" className="type-folio text-charcoal-faint">
          Evidence
        </h2>
        <p className="type-body mt-3 max-w-md text-[0.8125rem] text-charcoal-faint">
          Echoes already present in the terrain.
        </p>
        <ul className="obs-studio__evidence mt-8">
          {evidence.map((item) => (
            <li key={item.id}>
              <EvidenceRow item={item} />
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="obs-emerging"
        className="obs-studio__section obs-studio__emerging"
      >
        <h2 id="obs-emerging" className="type-folio text-charcoal-faint">
          Emerging connections
        </h2>
        <p className="type-body mt-5 max-w-md text-[0.9375rem] leading-[1.7] text-charcoal-muted">
          Patterns across investigations are beginning to surface. This wall
          will fill as the work continues.
        </p>
      </section>

      <footer className="obs-studio__foot">
        <p className="type-body text-sm text-charcoal-muted">
          Settled work finds{" "}
          <TextLink href="/atlas" className="text-sm">
            The Atlas
          </TextLink>
          {" · "}
          published writing finds{" "}
          <TextLink href="/inquiry" className="text-sm">
            The Shelves
          </TextLink>
        </p>
      </footer>
    </div>
  );
}

function InvestigationRow({
  investigation,
}: {
  investigation: ObservatoryInvestigation;
}) {
  const evidenceCount = getEvidenceLinks().filter(
    (e) => e.investigationId === investigation.id,
  ).length;

  return (
    <Link
      href={`/observatory/${investigation.slug}`}
      className="terrain-list-link group obs-studio__inv"
    >
      <p className="type-meta text-forest-faint">
        {statusLabel(investigation.status)}
        <span className="text-charcoal-faint"> · </span>
        Revised {investigation.revised}
        {evidenceCount > 0 && (
          <>
            <span className="text-charcoal-faint"> · </span>
            {evidenceCount} in the terrain
          </>
        )}
      </p>
      <h3 className="obs-studio__inv-title mt-2.5 font-heading text-xl text-charcoal transition-colors duration-700 group-hover:text-forest sm:text-[1.65rem] sm:leading-snug">
        {investigation.title}
      </h3>
      <p className="obs-studio__inv-q mt-3 max-w-xl font-heading text-[1.05rem] italic leading-[1.5] text-charcoal-muted">
        {investigation.question}
      </p>
      <p className="type-body mt-3.5 max-w-xl text-[0.9375rem] leading-[1.7] text-charcoal-muted/90">
        {investigation.description}
      </p>
    </Link>
  );
}

function FieldPin({ observation }: { observation: FieldObservation }) {
  const tether = observation.investigationId
    ? getInvestigationById(observation.investigationId)
    : undefined;

  return (
    <figure className="obs-studio__pin">
      <blockquote className="obs-studio__pin-text font-heading text-[1.05rem] leading-[1.55] text-charcoal sm:text-[1.125rem] sm:leading-[1.5]">
        {observation.text}
      </blockquote>
      {tether && (
        <figcaption className="type-meta mt-3 text-charcoal-faint">
          {tether.title}
        </figcaption>
      )}
    </figure>
  );
}

function EvidenceRow({ item }: { item: EvidenceLink }) {
  return (
    <TextLink
      href={item.href}
      className="obs-studio__ev group inline-flex w-full flex-col items-start gap-1 text-left no-underline"
    >
      <span className="type-meta text-forest-faint">
        {evidenceKindLabel(item.kind)}
        {item.relation ? (
          <>
            <span className="text-charcoal-faint"> · </span>
            <span className="text-charcoal-faint">{item.relation}</span>
          </>
        ) : null}
      </span>
      <span className="font-heading text-[1.05rem] text-charcoal transition-colors duration-700 group-hover:text-forest sm:text-lg">
        {item.label}
      </span>
    </TextLink>
  );
}
