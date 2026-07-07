import { Container } from "@/components/layout/Container";
import { Hairline, SectionIntro, TextLink } from "@/components/design-system";
import type { Book } from "@/lib/content/types";

interface FlagshipSectionProps {
  book: Book;
}

export function FlagshipSection({ book }: FlagshipSectionProps) {
  return (
    <section className="border-y border-rule bg-ivory-shadow/30 py-24 sm:py-32 lg:py-36">
      <Container narrow>
        <SectionIntro
          label="Special collection"
          title={book.title}
          description={book.description}
        />

        {book.subtitle && (
          <p className="type-lead -mt-2 text-base sm:text-lg">{book.subtitle}</p>
        )}

        <Hairline motif className="my-12" />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-10">
          <TextLink href={`/chambers/${book.slug}`}>
            Enter the chamber
          </TextLink>
          <TextLink href={`/atlas/${book.slug}`} muted>
            View the map
          </TextLink>
        </div>

        {book.chapters.length > 0 && (
          <p className="type-meta mt-16">
            {book.chapters.length} sections ·{" "}
            {book.status === "in-progress" ? "In progress" : "Published"}
          </p>
        )}
      </Container>
    </section>
  );
}
