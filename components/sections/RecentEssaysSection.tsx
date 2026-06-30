import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Hairline, SectionIntro, TextLink } from "@/components/design-system";
import type { Essay } from "@/lib/content/types";
import { getEssayReadUrl } from "@/lib/content";
import { formatDate } from "@/lib/utils";

interface RecentEssaysSectionProps {
  essays: Essay[];
}

export function RecentEssaysSection({ essays }: RecentEssaysSectionProps) {
  return (
    <section className="section-surface py-24 sm:py-32 lg:py-36">
      <Container>
        <SectionIntro
          label="Catalog II — Essays"
          title="Essay index"
          description="A curated map of writing published on Medium. The full text lives there; this site traces how each piece relates to the whole."
          href="/essays"
          linkText="View all essays"
        />

        <Hairline motif className="my-16 sm:my-20" />

        <ul className="space-y-0">
          {essays.slice(0, 3).map((essay, index) => (
            <li key={essay.id}>
              <article className="py-10 sm:py-12">
                <div className="grid gap-6 sm:grid-cols-12 sm:gap-8">
                  <div className="sm:col-span-8">
                    <Link
                      href={`/essays/${essay.slug}`}
                      className="group block"
                    >
                      <h3 className="type-entry text-charcoal transition-colors duration-500 group-hover:text-forest">
                        {essay.title}
                      </h3>
                      {essay.subtitle && (
                        <p className="type-lead mt-2 text-base">
                          {essay.subtitle}
                        </p>
                      )}
                      <p className="type-body mt-4 max-w-xl text-[0.9375rem]">
                        {essay.excerpt}
                      </p>
                    </Link>
                  </div>

                  <div className="flex flex-col justify-between sm:col-span-4 sm:items-end sm:text-right">
                    <p className="type-meta">{formatDate(essay.publishedAt)}</p>
                    {essay.topics.length > 0 && (
                      <p className="type-meta mt-4 text-forest-faint sm:mt-0">
                        {essay.topics.join(" · ")}
                      </p>
                    )}
                    <TextLink
                      href={getEssayReadUrl(essay)}
                      external
                      className="mt-6 sm:mt-0"
                    >
                      Read on Medium
                    </TextLink>
                  </div>
                </div>
              </article>
              {index < Math.min(essays.length, 3) - 1 && <Hairline fade />}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
