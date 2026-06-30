import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import type { Book } from "@/lib/content/types";

const statusLabels: Record<Book["status"], string> = {
  published: "Published",
  "in-progress": "In Progress",
  forthcoming: "Forthcoming",
};

interface BookCardProps {
  book: Book;
  featured?: boolean;
}

export function BookCard({ book, featured }: BookCardProps) {
  return (
    <article className="group">
      <Link href={`/library/${book.slug}`} className="block">
        <div
          className={`border border-transparent transition-all duration-300 group-hover:border-border group-hover:bg-cream-dark/50 ${
            featured ? "p-8 sm:p-10" : "py-6 group-hover:px-6"
          }`}
        >
          <div className="flex items-center gap-3">
            <Tag>Book</Tag>
            <span className="font-body text-xs text-ink-faint">
              {statusLabels[book.status]}
            </span>
          </div>
          <h3
            className={`mt-3 font-heading leading-snug text-ink transition-colors duration-300 group-hover:text-accent ${
              featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            }`}
          >
            {book.title}
          </h3>
          {book.subtitle && (
            <p className="mt-1 font-heading text-base italic text-ink-muted">
              {book.subtitle}
            </p>
          )}
          <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">
            {book.description}
          </p>
          {book.publishedYear && (
            <p className="mt-4 font-body text-xs text-ink-faint">
              {book.publishedYear}
              {book.publisher ? ` · ${book.publisher}` : ""}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
