import Link from "next/link";
import {
  ChamberConnections,
  ChamberGather,
  ChamberRelatedEssays,
  ChamberThemes,
} from "@/components/chamber";
import { TextLink } from "@/components/design-system";
import { Thread } from "@/components/thread";
import { MapCover } from "@/components/atlas/MapCover";
import type { Book } from "@/lib/content/types";
import type { Project } from "@/lib/content/types";
import {
  getProjectBooks,
  getProjectEssays,
  getProjectFieldNotes,
  getProjectQuestions,
} from "@/lib/content";
import { refFromBook } from "@/lib/relationships";

interface TerritoryThresholdProps {
  map: Book;
  territory?: Project;
}

export function TerritoryThreshold({ map, territory }: TerritoryThresholdProps) {
  const relatedEssays = territory ? getProjectEssays(territory) : [];
  const questions = territory ? getProjectQuestions(territory) : [];
  const fieldNotes = territory ? getProjectFieldNotes(territory) : [];
  const neighboringMaps = territory
    ? getProjectBooks(territory).filter((b) => b.id !== territory.bookId)
    : [];

  return (
    <div className="space-y-28 sm:space-y-36">
      <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:gap-20 lg:text-left">
        <div className="shrink-0 lg:pt-2">
          <MapCover
            map={map}
            journalUrl={map.purchaseUrl}
            scale="threshold"
            priority
          />
        </div>
        <div className="mt-14 max-w-xl lg:mt-2">
          <p className="type-folio text-[0.5625rem] uppercase tracking-[0.22em] text-charcoal-faint/90">
            Charted territory
          </p>
          <h1 className="type-display mt-5 text-balance">{map.title}</h1>
          {map.subtitle && (
            <p className="type-lead mt-5 text-lg italic leading-relaxed text-charcoal-muted/90">
              {map.subtitle}
            </p>
          )}
          <div className="map-artifact__plaque mt-10 border-t border-[#c4a06a]/12 pt-8">
            <p className="type-body text-[0.9375rem] leading-[1.8] text-charcoal-muted/90 sm:text-base">
              {map.description}
            </p>
          </div>
          {territory && (
            <TextLink
              href={`/chambers/${territory.slug}`}
              className="mt-12 inline-block"
            >
              Enter the territory →
            </TextLink>
          )}
        </div>
      </div>

      {territory && (
        <>
          <ChamberGather centralQuestion={territory.centralQuestion} />
          <ChamberThemes themes={territory.themes} />
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
              subtitle:
                fn.body.slice(0, 100) + (fn.body.length > 100 ? "…" : ""),
            }))}
            books={neighboringMaps.map((b) => ({
              href: `/atlas/${b.slug}`,
              title: b.title,
              subtitle: b.subtitle ?? b.description,
            }))}
          />
        </>
      )}

      <Thread
        nodeRef={refFromBook(map)}
        returnHref={`/atlas/${map.slug}`}
        returnLabel="Return to this map"
      />

      <footer className="border-t border-rule/30 pt-12">
        <TextLink href="/atlas" muted className="text-sm">
          ← Back to The Atlas
        </TextLink>
        {territory && (
          <>
            <span className="mx-3 text-charcoal-faint/60" aria-hidden="true">
              ·
            </span>
            <Link
              href={`/chambers/${territory.slug}`}
              className="type-body text-sm text-charcoal-muted transition-colors duration-[1.2s] hover:text-charcoal"
            >
              Enter the territory
            </Link>
          </>
        )}
      </footer>
    </div>
  );
}
