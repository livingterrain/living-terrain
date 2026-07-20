import Image from "next/image";
import Link from "next/link";
import { Room } from "@/components/environment";
import type { Project } from "@/lib/content/types";
import { Reveal } from "./Reveal";

/**
 * Editorial chamber for The Biology of Becoming —
 * the prototype for all future chambers.
 *
 * Exhibition catalog · scientific journal · archival library.
 * Not a book page. Not a landing page.
 */

interface BecomingChamberProps {
  project: Project;
}

/* ── Archival plate — museum label, not a metadata table ── */

function ArchivePlate() {
  return (
    <dl className="w-full max-w-[13.5rem] space-y-5">
      <div>
        <dt className="type-chamber">Volume</dt>
        <dd className="mt-1.5 font-heading text-[0.9375rem] text-charcoal">I</dd>
      </div>
      <div>
        <dt className="type-chamber">Catalog</dt>
        <dd className="mt-1.5 type-folio text-charcoal-muted">001</dd>
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

/* ── Marginalia — one sentence, never louder than the text ── */

function MarginNote({
  label,
  children,
  href,
}: {
  label: string;
  children: string;
  href?: string;
}) {
  const body = href ? (
    <Link
      href={href}
      className="mt-2 block font-heading text-[0.875rem] italic leading-snug text-charcoal-muted transition-colors duration-[1.4s] hover:text-charcoal"
    >
      {children}
    </Link>
  ) : (
    <p className="mt-2 font-heading text-[0.875rem] italic leading-snug text-charcoal-muted">
      {children}
    </p>
  );

  return (
    <aside className="max-w-[14rem]">
      <p className="type-chamber">{label}</p>
      {body}
    </aside>
  );
}

/* ── Figure 01 — adaptation precedes perception ── */

const LOOP: ReadonlyArray<{ n: string; name: string; gloss: string }> = [
  { n: "01", name: "Signal", gloss: "The world arrives as sensation." },
  {
    n: "02",
    name: "Appraisal",
    gloss: "One question — is this survivable?",
  },
  {
    n: "03",
    name: "Adaptation",
    gloss: "State shifts first: chemistry, tone, threshold.",
  },
  {
    n: "04",
    name: "Perception",
    gloss: "The adapted state filters what can be seen.",
  },
  {
    n: "05",
    name: "Identity",
    gloss: "Repeated perception hardens into self.",
  },
];

function FigureAdaptation() {
  return (
    <figure aria-labelledby="fig-01-cap">
      <div className="flex items-baseline justify-between gap-6 border-b border-rule/25 pb-4">
        <p className="type-folio">Figure 01</p>
        <p className="font-heading text-[0.9375rem] italic text-charcoal-faint">
          Adaptation precedes perception.
        </p>
      </div>

      <ol className="mt-14 grid gap-0 sm:grid-cols-5">
        {LOOP.map((station, i) => (
          <li
            key={station.n}
            className="relative border-t border-rule/30 py-8 sm:border-t-0 sm:border-l sm:border-rule/30 sm:px-5 sm:py-2 first:sm:border-l-0 first:sm:pl-0"
          >
            <p className="type-folio">{station.n}</p>
            <p className="mt-4 font-body text-[0.6875rem] uppercase tracking-[0.22em] text-charcoal">
              {station.name}
            </p>
            <p className="type-meta mt-3 max-w-[11rem] leading-relaxed">
              {station.gloss}
            </p>
            {i < LOOP.length - 1 && (
              <span
                className="pointer-events-none absolute -right-2 top-3 hidden text-charcoal-faint/50 sm:block"
                aria-hidden="true"
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>

      <p className="type-meta mt-12 max-w-xl border-t border-rule/25 pt-5 leading-relaxed">
        Feedback · Identity quietly weights the next appraisal.
      </p>

      <figcaption id="fig-01-cap" className="sr-only">
        A five-stage adaptation loop: Signal, Appraisal, Adaptation, Perception,
        Identity — with feedback from identity back into appraisal.
      </figcaption>
    </figure>
  );
}

/* ── Figure 02 — when protection becomes self ── */

function FigureResidence() {
  const stages = [
    { name: "Protection", gloss: "a response" },
    { name: "Habit", gloss: "a pattern" },
    { name: "Identity", gloss: "a self" },
  ] as const;

  return (
    <figure aria-labelledby="fig-02-cap">
      <div className="flex items-baseline justify-between gap-6 border-b border-rule/25 pb-4">
        <p className="type-folio">Figure 02</p>
        <p className="font-heading text-[0.9375rem] italic text-charcoal-faint">
          Residence.
        </p>
      </div>

      <ol className="mt-16 flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        {stages.map((stage, i) => (
          <li key={stage.name} className="flex items-end gap-6 sm:block sm:flex-1">
            <div>
              <p className="font-heading text-2xl tracking-tight text-charcoal sm:text-[1.75rem]">
                {stage.name}
              </p>
              <p className="type-meta mt-2">{stage.gloss}</p>
            </div>
            {i < stages.length - 1 && (
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
        id="fig-02-cap"
        className="mt-14 max-w-md font-heading text-[0.9375rem] italic leading-relaxed text-charcoal-faint"
      >
        What begins as protection, repeated long enough, is filed as self.
      </figcaption>
    </figure>
  );
}

/* ── Field note — printed insert, not a card ── */

function FieldNote({ children }: { children: string }) {
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

/* ── Catalog slip — archive label for the bound journal ── */

function CatalogSlip({ href }: { href: string }) {
  return (
    <aside className="mx-auto max-w-md text-center">
      <p className="type-chamber">Catalog 001 · Bound record</p>
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

/* ── Continue the Investigation ── */

const REFERENCES: ReadonlyArray<{
  kind: string;
  invitation: string;
  title: string;
  href: string;
}> = [
  {
    kind: "Essay",
    invitation: "Read a connected essay",
    title: "If You Feel It in Your Body, Start Here",
    href: "/essays/if-you-feel-it-in-your-body-start-here",
  },
  {
    kind: "Atlas",
    invitation: "Explore this idea in the Atlas",
    title: "The Biology of Becoming — the charted map",
    href: "/atlas/the-biology-of-becoming",
  },
  {
    kind: "Constellation",
    invitation: "Open the systems map",
    title: "How everything here connects",
    href: "/",
  },
  {
    kind: "Observatory",
    invitation: "Return to the Observatory",
    title: "Where investigations are still forming",
    href: "/observatory",
  },
];

function ContinueInvestigation() {
  return (
    <section aria-labelledby="continue-heading">
      <h2 id="continue-heading" className="type-chamber">
        Continue the investigation
      </h2>

      <ul className="mt-14">
        {REFERENCES.map((ref) => (
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

/* ── The chamber ── */

export function BecomingChamber({ project }: BecomingChamberProps) {
  const introduction =
    "A guide to how the nervous system rewrites identity, behavior, perception, and reality — drawn from trauma physiology, somatic psychology, and the biology of adaptation.";

  return (
    <Room kind="chamber">
      <article>
        {/* ── Opened archival volume ── */}
        <header className="px-6 pb-24 pt-16 sm:px-10 sm:pb-32 sm:pt-24 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between sm:gap-12 lg:gap-24">
                {/* Physical object */}
                <div className="relative w-[10.5rem] shrink-0 sm:w-[12.75rem]">
                  <Image
                    src="/images/maps/the-biology-of-becoming.jpg"
                    alt={`Cover of ${project.title}`}
                    width={313}
                    height={500}
                    priority
                    className="block w-full"
                    style={{
                      boxShadow:
                        "0 1px 0 rgba(255,255,255,0.035) inset, 1px 0 0 rgba(255,255,255,0.04), 0 18px 40px -22px rgba(0,0,0,0.55), 0 4px 10px -6px rgba(0,0,0,0.35)",
                    }}
                  />
                  {/* Paper depth behind the cover */}
                  <span
                    className="absolute -right-[2px] top-[3px] bottom-[3px] w-[2px] bg-gradient-to-r from-ivory/[0.12] to-transparent"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute -right-[4px] top-[5px] bottom-[5px] w-[2px] bg-ivory/[0.04]"
                    aria-hidden="true"
                  />
                </div>

                <ArchivePlate />
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-24 max-w-2xl sm:mt-32">
                <h1 className="type-display text-balance">{project.title}</h1>

                {project.subtitle && (
                  <p className="type-lead mt-8 max-w-xl text-lg sm:text-xl">
                    {project.subtitle}
                  </p>
                )}

                <p className="type-body mt-14 max-w-[36rem]">{introduction}</p>
              </div>
            </Reveal>
          </div>
        </header>

        {/* ── Conceptual gravity ── */}
        <section
          aria-labelledby="central-question"
          className="flex min-h-[88vh] items-center px-6 py-36 sm:px-10 sm:py-48 lg:px-16"
        >
          <div className="mx-auto w-full max-w-3xl text-center">
            <Reveal>
              <p className="type-chamber">The single question</p>
              <p
                id="central-question"
                className="mx-auto mt-14 font-heading text-[1.85rem] leading-[1.28] tracking-tight text-charcoal sm:text-[2.65rem] sm:leading-[1.22]"
              >
                What must the nervous system become before identity,
                perception, or reality can change?
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Passage · ~620px ── */}
        <section className="px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
          <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,38.75rem)_1fr] lg:gap-x-28 lg:items-start">
            <Reveal>
              <p className="type-body text-[1.0625rem] sm:text-lg">
                This volume was written for readers in collapse — the season
                when identity shifts, the nervous system feels like it is
                unraveling, and life dissolves without explanation. Its claim
                is quiet but total: nothing in the body breaks arbitrarily.
                The system is reorganizing around what it has survived.
              </p>
            </Reveal>
            <Reveal delay={0.22} className="mt-14 lg:mt-2 lg:justify-self-end">
              <MarginNote
                label="Related inquiry"
                href="/essays/constraint-is-not-the-opposite-of-freedom"
              >
                Constraint Is Not the Opposite of Freedom
              </MarginNote>
            </Reveal>
          </div>
        </section>

        {/* ── Figure 01 · wide ── */}
        <section className="px-6 py-24 sm:px-10 sm:py-32 lg:px-12">
          <div className="mx-auto max-w-[64rem]">
            <Reveal>
              <FigureAdaptation />
            </Reveal>
          </div>
        </section>

        {/* ── Right-aligned quotation ── */}
        <section className="px-6 py-32 sm:px-10 sm:py-44 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <blockquote className="ml-auto max-w-xl text-right sm:max-w-2xl">
                <p className="font-heading text-[1.65rem] italic leading-[1.38] text-charcoal sm:text-[2.125rem]">
                  The body does not resist change. It resists change it has not
                  yet been made safe for.
                </p>
                <footer className="type-chamber mt-10">
                  From the field journal
                </footer>
              </blockquote>
            </Reveal>
          </div>
        </section>

        {/* ── Passage · offset with open question ── */}
        <section className="px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
          <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[1fr_minmax(0,38.75rem)] lg:gap-x-28 lg:items-start">
            <Reveal
              delay={0.2}
              className="order-2 mt-14 lg:order-1 lg:mt-1 lg:justify-self-start"
            >
              <MarginNote label="Open question">
                When does protection become identity?
              </MarginNote>
            </Reveal>
            <Reveal className="order-1 lg:order-2">
              <p className="type-body text-[1.0625rem] sm:text-lg">
                Trauma physiology suggests a quiet inversion: the body does not
                wait for the mind to decide. Long before a belief changes,
                thresholds shift — what the system will tolerate, what it will
                notice, what it will allow to matter. Perception is downstream
                of capacity.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Silence ── */}
        <section
          aria-label="A pause"
          className="flex min-h-[90vh] items-center px-6 py-36 sm:px-10 sm:py-48"
        >
          <Reveal className="mx-auto w-full max-w-3xl">
            <p className="text-center font-heading text-[2.35rem] leading-[1.2] tracking-tight text-charcoal sm:text-[3.5rem] sm:leading-[1.16]">
              Symptoms
              <br />
              are where
              <br />
              the body
              <br />
              begins speaking.
            </p>
          </Reveal>
        </section>

        {/* ── Figure 02 ── */}
        <section className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <FigureResidence />
            </Reveal>
          </div>
        </section>

        {/* ── Narrow research note + atlas marginalia ── */}
        <section className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
          <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,28rem)_1fr] lg:gap-x-32 lg:items-start">
            <Reveal className="lg:ml-[12%]">
              <p className="type-chamber">Method note</p>
              <p className="type-body mt-6 text-[0.9375rem]">
                The volume draws on trauma physiology, somatic psychology, and
                the biology of adaptation. It treats symptoms as data, not
                failure — each one the record of an adaptation that once worked.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-16 lg:mt-8 lg:justify-self-end">
              <MarginNote
                label="Atlas reference"
                href="/atlas/feedback-is-god"
              >
                Feedback
              </MarginNote>
            </Reveal>
          </div>
        </section>

        {/* ── Field note · nearly empty ── */}
        <section className="px-6 py-28 sm:px-10 sm:py-40 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <Reveal className="sm:ml-[18%] lg:ml-[28%]">
              <FieldNote>
                Safety is not the absence of threat. It is the presence of
                capacity.
              </FieldNote>
            </Reveal>
          </div>
        </section>

        {/* ── Second silence · quieter ── */}
        <section
          aria-label="Another pause"
          className="flex min-h-[55vh] items-center justify-center px-6 py-28 sm:py-36"
        >
          <Reveal>
            <p className="max-w-md text-center font-heading text-xl italic leading-relaxed text-charcoal-muted sm:text-2xl">
              The system reorganizes before the world appears different.
            </p>
          </Reveal>
        </section>

        {/* ── Catalog slip ── */}
        {project.purchaseUrl && (
          <section
            aria-label="The original field journal"
            className="px-6 py-28 sm:px-10 sm:py-36"
          >
            <Reveal>
              <CatalogSlip href={project.purchaseUrl} />
            </Reveal>
          </section>
        )}

        {/* ── Quiet transition ── */}
        <div
          className="flex justify-center py-20 sm:py-28"
          aria-hidden="true"
        >
          <span className="h-20 w-px bg-rule/30" />
        </div>

        {/* ── Continue the Investigation ── */}
        <section className="px-6 pb-36 sm:px-10 sm:pb-48 lg:px-16">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <ContinueInvestigation />
            </Reveal>
          </div>
        </section>
      </article>
    </Room>
  );
}
