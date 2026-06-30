"use client";

import { TextLink } from "@/components/design-system";
import type { Project } from "@/lib/content/types";
import { HomeRoom } from "./HomeRoom";

interface ChamberSpineRoomProps {
  project: Project;
}

export function ChamberSpineRoom({ project }: ChamberSpineRoomProps) {
  return (
    <HomeRoom
      id="chamber"
      kind="chamber"
      whisper="The deepest room."
      ariaLabel="The Structure Beneath Reality"
      className="pb-28 sm:pb-36"
    >
      <div className="relative mx-auto max-w-3xl px-6 pt-8 sm:px-10 sm:pt-12">
        <div className="relative border border-rule/70 bg-ivory/55 px-9 py-12 text-center sm:px-12 sm:py-16">
          {/* Cross-section lines */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full text-charcoal opacity-[0.04]"
            viewBox="0 0 400 300"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path d="M0 75 H400" stroke="currentColor" strokeWidth="0.5" />
            <path d="M0 150 H400" stroke="currentColor" strokeWidth="0.5" />
            <path d="M0 225 H400" stroke="currentColor" strokeWidth="0.5" />
            <path d="M200 0 V300" stroke="currentColor" strokeWidth="0.5" />
          </svg>

          <div className="relative">
            <h2 className="type-room text-balance">{project.title}</h2>
            {project.subtitle && (
              <p className="type-lead mx-auto mt-4 max-w-lg text-base">
                {project.subtitle}
              </p>
            )}
            <p className="type-body mx-auto mt-6 max-w-md text-[0.9375rem]">
              {project.centralQuestion}
            </p>
            <p className="type-folio mt-8">{project.status.label}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-10">
              <TextLink href="/structure-beneath-reality">
                Enter the chamber
              </TextLink>
              {project.purchaseUrl && (
                <TextLink href={project.purchaseUrl} external muted>
                  Purchase the book
                </TextLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </HomeRoom>
  );
}
