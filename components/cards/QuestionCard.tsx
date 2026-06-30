import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import type { Question } from "@/lib/content/types";

interface QuestionCardProps {
  question: Question;
  index?: number;
}

export function QuestionCard({ question, index }: QuestionCardProps) {
  return (
    <article className="group">
      <Link href={`/questions/${question.slug}`} className="block">
        <div className="border border-transparent py-8 transition-all duration-300 group-hover:border-border group-hover:bg-cream-dark/50 group-hover:px-6">
          {index !== undefined && (
            <span className="font-heading text-sm text-ink-faint">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <Tag className={index !== undefined ? "mt-2" : ""}>Question</Tag>
          <h3 className="mt-3 font-heading text-xl leading-snug text-ink transition-colors duration-300 group-hover:text-accent sm:text-2xl">
            {question.title}
          </h3>
          {question.subtitle && (
            <p className="mt-1 font-heading text-base italic text-ink-muted">
              {question.subtitle}
            </p>
          )}
          <p className="mt-4 font-body text-sm leading-relaxed text-ink-muted">
            {question.description}
          </p>
        </div>
      </Link>
    </article>
  );
}
