import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Hairline, SectionIntro } from "@/components/design-system";
import type { Question } from "@/lib/content/types";

interface FeaturedQuestionsSectionProps {
  questions: Question[];
}

export function FeaturedQuestionsSection({
  questions,
}: FeaturedQuestionsSectionProps) {
  return (
    <section className="section-surface py-24 sm:py-32 lg:py-36">
      <Container>
        <SectionIntro
          label="Catalog I — Questions"
          title="Inquiries"
          description="Not categories, but living questions. Each one gathers essays, books, and field notes that return to it."
          href="/questions"
          linkText="View the full catalog"
        />

        <Hairline motif className="my-16 sm:my-20" />

        <ol className="space-y-0">
          {questions.map((question, index) => (
            <li key={question.id}>
              <Link
                href={`/questions/${question.slug}`}
                className="group block border-l border-transparent py-10 pl-0 transition-[border-color,color] duration-500 hover:border-forest/30 hover:pl-4 sm:py-12"
              >
                <div className="grid gap-4 sm:grid-cols-12 sm:gap-8">
                  <div className="sm:col-span-1">
                    <span className="type-folio">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="sm:col-span-11">
                    <h3 className="type-entry text-charcoal transition-colors duration-500 group-hover:text-forest">
                      {question.title}
                    </h3>
                    {question.subtitle && (
                      <p className="type-lead mt-2 text-base sm:text-lg">
                        {question.subtitle}
                      </p>
                    )}
                    <p className="type-body mt-5 max-w-2xl text-[0.9375rem]">
                      {question.description}
                    </p>
                  </div>
                </div>
              </Link>
              {index < questions.length - 1 && <Hairline fade />}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
