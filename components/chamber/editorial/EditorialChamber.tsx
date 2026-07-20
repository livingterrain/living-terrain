import { Room } from "@/components/environment";
import type { Project } from "@/lib/content/types";
import { Reveal } from "./Reveal";
import {
  ArchivePlate,
  CatalogSlip,
  ContinueInvestigation,
  CoverObject,
  FieldNote,
  MarginNote,
  QuoteBlock,
  StageFigure,
} from "./primitives";
import type { EditorialChamberSpec } from "./types";

type Props = {
  project: Project;
  spec: EditorialChamberSpec;
};

/**
 * Reusable editorial chamber layout.
 * Shared visual language with Biology of Becoming — content and pacing vary per volume.
 */
export function EditorialChamber({ project, spec }: Props) {
  const introduction = spec.introduction ?? project.introduction;

  return (
    <Room kind="chamber">
      <article>
        {/* Hero */}
        <header className="px-6 pb-24 pt-16 sm:px-10 sm:pb-32 sm:pt-24 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between sm:gap-12 lg:gap-24">
                <CoverObject
                  src={spec.coverSrc}
                  alt={`Cover of ${project.title}`}
                  width={spec.coverWidth}
                  height={spec.coverHeight}
                  priority
                />
                <ArchivePlate volume={spec.volume} catalog={spec.catalog} />
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

        {/* Central inquiry */}
        <section
          aria-labelledby="central-question"
          className="flex min-h-[78vh] items-center px-6 py-32 sm:px-10 sm:py-44 lg:px-16"
        >
          <div className="mx-auto w-full max-w-3xl text-center">
            <Reveal>
              <p className="type-chamber">The single question</p>
              <p
                id="central-question"
                className="mx-auto mt-14 font-heading text-[1.85rem] leading-[1.28] tracking-tight text-charcoal sm:text-[2.65rem] sm:leading-[1.22]"
              >
                {spec.inquiry}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Passages */}
        {spec.passages.map((passage, index) => {
          const align = passage.align ?? (index % 2 === 0 ? "left" : "right");
          const textFirst = align === "left";

          return (
            <section
              key={index}
              className="px-6 py-20 sm:px-10 sm:py-28 lg:px-16"
            >
              <div
                className={
                  textFirst
                    ? "mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,38.75rem)_1fr] lg:items-start lg:gap-x-28"
                    : "mx-auto max-w-6xl lg:grid lg:grid-cols-[1fr_minmax(0,38.75rem)] lg:items-start lg:gap-x-28"
                }
              >
                {textFirst ? (
                  <>
                    <Reveal>
                      <p className="type-body text-[1.0625rem] sm:text-lg">
                        {passage.body}
                      </p>
                    </Reveal>
                    {passage.margin && (
                      <Reveal
                        delay={0.22}
                        className="mt-14 lg:mt-2 lg:justify-self-end"
                      >
                        <MarginNote {...passage.margin} />
                      </Reveal>
                    )}
                  </>
                ) : (
                  <>
                    {passage.margin && (
                      <Reveal
                        delay={0.2}
                        className="order-2 mt-14 lg:order-1 lg:mt-1 lg:justify-self-start"
                      >
                        <MarginNote {...passage.margin} />
                      </Reveal>
                    )}
                    <Reveal className="order-1 lg:order-2">
                      <p className="type-body text-[1.0625rem] sm:text-lg">
                        {passage.body}
                      </p>
                    </Reveal>
                  </>
                )}
              </div>
            </section>
          );
        })}

        {/* Optional figure */}
        {spec.figure && (
          <section className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <StageFigure figure={spec.figure} />
              </Reveal>
            </div>
          </section>
        )}

        {/* Optional quote */}
        {spec.quote && (
          <section className="px-6 py-28 sm:px-10 sm:py-40 lg:px-16">
            <div className="mx-auto max-w-6xl">
              <Reveal>
                <QuoteBlock quote={spec.quote} />
              </Reveal>
            </div>
          </section>
        )}

        {/* Optional silence */}
        {spec.silence && spec.silence.length > 0 && (
          <section
            aria-label="A pause"
            className="flex min-h-[70vh] items-center px-6 py-32 sm:px-10 sm:py-40"
          >
            <Reveal className="mx-auto w-full max-w-3xl">
              <p className="text-center font-heading text-[2.15rem] leading-[1.22] tracking-tight text-charcoal sm:text-[3.15rem] sm:leading-[1.16]">
                {spec.silence.map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            </Reveal>
          </section>
        )}

        {/* Method note */}
        {spec.methodNote && (
          <section className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
            <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,28rem)_1fr] lg:items-start lg:gap-x-32">
              <Reveal className="lg:ml-[12%]">
                <p className="type-chamber">
                  {spec.methodNote.label ?? "Method note"}
                </p>
                <p className="type-body mt-6 text-[0.9375rem]">
                  {spec.methodNote.body}
                </p>
              </Reveal>
              {spec.methodMargin && (
                <Reveal
                  delay={0.2}
                  className="mt-16 lg:mt-8 lg:justify-self-end"
                >
                  <MarginNote {...spec.methodMargin} />
                </Reveal>
              )}
            </div>
          </section>
        )}

        {/* Field note */}
        {spec.fieldNote && (
          <section className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
            <div className="mx-auto max-w-6xl">
              <Reveal className="sm:ml-[18%] lg:ml-[28%]">
                <FieldNote>{spec.fieldNote}</FieldNote>
              </Reveal>
            </div>
          </section>
        )}

        {/* Quiet pause */}
        {spec.pause && (
          <section
            aria-label="Another pause"
            className="flex min-h-[45vh] items-center justify-center px-6 py-24 sm:py-32"
          >
            <Reveal>
              <p className="max-w-md text-center font-heading text-xl italic leading-relaxed text-charcoal-muted sm:text-2xl">
                {spec.pause}
              </p>
            </Reveal>
          </section>
        )}

        {/* Catalog slip */}
        {project.purchaseUrl && (
          <section
            aria-label="The original field journal"
            className="px-6 py-28 sm:px-10 sm:py-36"
          >
            <Reveal>
              <CatalogSlip
                href={project.purchaseUrl}
                label={
                  spec.catalogSlipLabel ??
                  `Catalog ${spec.catalog} · Bound record`
                }
              />
            </Reveal>
          </section>
        )}

        <div
          className="flex justify-center py-20 sm:py-28"
          aria-hidden="true"
        >
          <span className="h-20 w-px bg-rule/30" />
        </div>

        <section className="px-6 pb-36 sm:px-10 sm:pb-48 lg:px-16">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <ContinueInvestigation references={spec.references} />
            </Reveal>
          </div>
        </section>
      </article>
    </Room>
  );
}
