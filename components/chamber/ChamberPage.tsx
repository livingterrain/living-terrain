import { Container } from "@/components/layout/Container";
import {
  ChamberBegin,
  ChamberConnections,
  ChamberFieldJournal,
  ChamberGather,
  ChamberQuestion,
  ChamberRelatedEssays,
  ChamberStrata,
  ChamberThemes,
  ChamberWhy,
} from "@/components/chamber";
import { Room } from "@/components/environment";
import { Thread } from "@/components/thread";
import {
  getProjectBooks,
  getProjectEssays,
  getProjectFieldNotes,
  getProjectQuestions,
} from "@/lib/content";
import type { Project } from "@/lib/content/types";
import { refFromProject } from "@/lib/relationships";

interface ChamberPageProps {
  project: Project;
  /** Lead line under the room header */
  lead?: string;
}

export function ChamberPage({ project, lead = "A volume chamber." }: ChamberPageProps) {
  const relatedEssays = getProjectEssays(project);
  const questions = getProjectQuestions(project);
  const fieldNotes = getProjectFieldNotes(project);
  const relatedBooks = getProjectBooks(project).filter(
    (b) => b.id !== project.bookId,
  );
  const chamberRoute = `/chambers/${project.slug}`;

  return (
    <Room kind="chamber">
      <header className="relative border-b border-rule/40 px-6 py-24 sm:px-10 sm:py-32 lg:py-40">
        <Container narrow>
          <p className="type-lead text-base sm:text-lg">{lead}</p>

          <h1 className="type-display mt-10 max-w-3xl text-balance">
            {project.title}
          </h1>

          {project.subtitle && (
            <p className="type-lead mt-6 max-w-2xl text-lg sm:text-xl">
              {project.subtitle}
            </p>
          )}

          <section aria-labelledby="chamber-intro" className="mt-10">
            <h2 id="chamber-intro" className="type-folio">
              Introduction
            </h2>
            <p className="type-body mt-6 max-w-2xl sm:text-lg">
              {project.introduction}
            </p>
          </section>

          <div className="mt-12 max-w-md border border-rule/60 bg-ivory/50 px-7 py-6 sm:px-8">
            <p className="type-folio">{project.status.label}</p>
            <p className="type-body mt-3 text-[0.9375rem]">
              {project.status.description}
            </p>
          </div>

          <div className="mt-14 space-y-8">
            {project.purchaseUrl && (
              <ChamberFieldJournal url={project.purchaseUrl} />
            )}
            <p className="type-body text-[0.875rem] text-charcoal-muted">
              <a
                href={`/atlas/${project.slug}`}
                className="transition-colors duration-[1.2s] hover:text-charcoal"
              >
                ← Return to the map
              </a>
              <span className="mx-2 text-charcoal-faint/60" aria-hidden="true">
                ·
              </span>
              <span>Continue exploring below</span>
            </p>
          </div>
        </Container>

        <svg
          className="pointer-events-none absolute bottom-0 right-0 hidden h-48 w-48 text-charcoal opacity-[0.04] lg:block"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden="true"
        >
          <path d="M20 180 H180" stroke="currentColor" strokeWidth="0.5" />
          <path d="M20 140 H160" stroke="currentColor" strokeWidth="0.5" />
          <path d="M20 100 H140" stroke="currentColor" strokeWidth="0.5" />
          <path d="M20 60 H120" stroke="currentColor" strokeWidth="0.5" />
          <path d="M100 20 V180" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </header>

      <div className="px-6 py-20 sm:px-10 sm:py-28">
        <Container narrow>
          <div className="space-y-24 sm:space-y-32">
            <ChamberGather centralQuestion={project.centralQuestion} />
            <ChamberQuestion question={project.centralQuestion} />
            <ChamberWhy text={project.whyExists} />
            <ChamberThemes themes={project.themes} />
            <ChamberRelatedEssays essays={relatedEssays} />
            <ChamberConnections
              questions={questions.map((q) => ({
                href: `/questions/${q.slug}`,
                title: q.title,
                subtitle: q.description,
              }))}
              fieldNotes={fieldNotes.map((fn) => ({
                href: `/field-notes/${fn.slug}`,
                title: fn.title ?? "Field observation",
                subtitle: fn.body.slice(0, 100) + (fn.body.length > 100 ? "…" : ""),
              }))}
              books={relatedBooks.map((b) => ({
                href: `/atlas/${b.slug}`,
                title: b.title,
                subtitle: b.subtitle ?? b.description,
              }))}
            />

            <Thread nodeRef={refFromProject(project)} returnHref={chamberRoute} />

            <ChamberStrata timeline={project.timeline} />
            <ChamberBegin entries={project.whereToBegin} />
          </div>
        </Container>
      </div>
    </Room>
  );
}
