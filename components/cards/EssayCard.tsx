import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { SiteLink } from "@/components/ui/SiteLink";
import type { Essay } from "@/lib/content/types";
import { getEssayReadUrl, getQuestionById } from "@/lib/content";
import { formatDate } from "@/lib/utils";

interface EssayCardProps {
  essay: Essay;
  showRelatedQuestions?: boolean;
}

export function EssayCard({
  essay,
  showRelatedQuestions = false,
}: EssayCardProps) {
  return (
    <article className="group">
      <div className="border border-transparent py-6 transition-all duration-300 group-hover:border-border group-hover:bg-cream-dark/50 group-hover:px-6">
        <Tag>Essay</Tag>
        <Link href={`/essays/${essay.slug}`} className="block">
          <h3 className="mt-3 font-heading text-xl leading-snug text-ink transition-colors duration-300 group-hover:text-accent sm:text-2xl">
            {essay.title}
          </h3>
          {essay.subtitle && (
            <p className="mt-1 font-heading text-base italic text-ink-muted">
              {essay.subtitle}
            </p>
          )}
        </Link>
        <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">
          {essay.excerpt}
        </p>

        {essay.topics.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Topics">
            {essay.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-border px-2.5 py-0.5 font-body text-xs text-ink-muted"
              >
                {topic}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 font-body text-xs text-ink-faint">
          {formatDate(essay.publishedAt)}
        </p>

        {showRelatedQuestions && essay.questionIds.length > 0 && (
          <div className="mt-6">
            <p className="type-folio">This idea connects to</p>
            <ul className="mt-3 space-y-2">
              {essay.questionIds.map((id) => {
                const question = getQuestionById(id);
                if (!question) return null;
                return (
                  <li key={question.id}>
                    <SiteLink
                      href={`/questions/${question.slug}`}
                      className="font-heading text-base"
                    >
                      {question.title}
                    </SiteLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <a
          href={getEssayReadUrl(essay)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2 font-body text-sm text-cream transition-colors duration-300 hover:bg-ink-muted"
        >
          Read on Medium
          <ExternalIcon />
        </a>
      </div>
    </article>
  );
}

function ExternalIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  );
}
