import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import {
  ChamberBegin,
  ChamberPurchase,
  ChamberQuestion,
  ChamberRelatedEssays,
  ChamberStrata,
  ChamberThemes,
  ChamberWhy,
} from "@/components/chamber";
import { Room } from "@/components/environment";
import { Thread } from "@/components/thread";
import { getFlagshipProject, getProjectEssays } from "@/lib/content";
import { refFromProject } from "@/lib/relationships";

export const metadata: Metadata = {
  title: "The Structure Beneath Reality",
  description:
    "The central chamber of Living Terrain — an ongoing inquiry into the invisible architectures that shape how we encounter what is real.",
};

export default function StructureBeneathRealityPage() {
  const project = getFlagshipProject();
  const relatedEssays = getProjectEssays(project);

  return (
    <Room kind="chamber">
      <header className="relative border-b border-rule/40 px-6 py-24 sm:px-10 sm:py-32 lg:py-40">
        <Container narrow>
          <p className="type-lead text-base sm:text-lg">The deepest room.</p>

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
            <ChamberQuestion question={project.centralQuestion} />
            <ChamberWhy text={project.whyExists} />
            <ChamberThemes themes={project.themes} />
            <ChamberRelatedEssays essays={relatedEssays} />

            <Thread
              nodeRef={refFromProject(project)}
              returnHref="/structure-beneath-reality"
            />

            <ChamberStrata timeline={project.timeline} />
            <ChamberBegin entries={project.whereToBegin} />

            {project.purchaseUrl && (
              <ChamberPurchase url={project.purchaseUrl} />
            )}
          </div>
        </Container>
      </div>
    </Room>
  );
}
