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
import { FieldJournal } from "@/components/atlas/FieldJournal";
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
    <div className="space-y-24 sm:space-y-32">
      <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:gap-16 lg:text-left">
        <MapCover map={map} scale="threshold" priority className="shrink-0" />
        <div className="mt-12 max-w-xl lg:mt-4">
          <p className="type-folio text-[0.625rem] uppercase tracking-[0.18em] text-charcoal-faint">
            Charted territory
          </p>
          <h1 className="type-display mt-4 text-balance">{map.title}</h1>
          {map.subtitle && (
            <p className="type-lead mt-4 text-lg text-charcoal-muted">
              {map.subtitle}
            </p>
          )}
          <p className="type-body mt-8 text-[0.9375rem] sm:text-base">
            {map.description}
          </p>
          {territory && (
            <TextLink
              href={`/chambers/${territory.slug}`}
              className="mt-10 inline-block"
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

      {map.purchaseUrl && <FieldJournal url={map.purchaseUrl} />}

      <footer className="border-t border-rule/40 pt-10">
        <TextLink href="/atlas" muted className="text-sm">
          ← Back to The Atlas
        </TextLink>
        {territory && (
          <>
            <span className="mx-3 text-charcoal-faint" aria-hidden="true">
              ·
            </span>
            <Link
              href={`/chambers/${territory.slug}`}
              className="type-body text-sm text-charcoal-muted transition-colors hover:text-forest"
            >
              Enter the territory
            </Link>
          </>
        )}
      </footer>
    </div>
  );
}
