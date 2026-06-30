import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { Prose, renderBody } from "@/components/reading/Prose";
import { ReadingProgress } from "@/components/reading/ReadingProgress";
import { Thread } from "@/components/thread";
import { TextLink } from "@/components/design-system";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  getFlagshipProject,
  getStructureSectionBySlug,
  getStructureSections,
} from "@/lib/content";
import { refFromProject } from "@/lib/relationships";

interface PageProps {
  params: Promise<{ section: string }>;
}

export async function generateStaticParams() {
  return getStructureSections().map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section: slug } = await params;
  const section = getStructureSectionBySlug(slug);
  if (!section) return { title: "Section Not Found" };

  return {
    title: `${section.title} · The Structure Beneath Reality`,
    description: section.excerpt,
  };
}

export default async function StructureSectionPage({ params }: PageProps) {
  const { section: slug } = await params;
  const section = getStructureSectionBySlug(slug);
  if (!section) notFound();

  const allSections = getStructureSections();
  const currentIndex = allSections.findIndex((s) => s.slug === slug);
  const prev = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const next =
    currentIndex < allSections.length - 1
      ? allSections[currentIndex + 1]
      : null;

  const project = getFlagshipProject();
  const continueItems = [
    prev && {
      href: `/structure-beneath-reality/${prev.slug}`,
      title: prev.title,
      subtitle: "Earlier in the chamber",
    },
    next && {
      href: `/structure-beneath-reality/${next.slug}`,
      title: next.title,
      subtitle: "Further in",
    },
  ].filter(Boolean) as { href: string; title: string; subtitle?: string }[];

  return (
    <Room kind="chamber">
      <ReadingProgress />
      <RoomThreshold
        kind="chamber"
        title={section.title}
        whisper={`Section ${String(section.order).padStart(2, "0")}`}
        description={section.excerpt}
      />

      <section className="pb-24 pt-8 sm:pb-32">
        <Container narrow>
          <FadeIn>
            <Prose>{renderBody(section.body)}</Prose>
          </FadeIn>

          {continueItems.length > 0 && (
            <nav
              className="mt-16 border-t border-rule/40 pt-10"
              aria-label="Continue through the chamber"
            >
              <p className="type-folio">Further in the chamber</p>
              <ul className="mt-6 space-y-4">
                {continueItems.map((item) => (
                  <li key={item.href}>
                    <TextLink href={item.href} className="group block">
                      <span className="type-body text-charcoal transition-colors duration-700 group-hover:text-forest">
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className="type-meta mt-1 block text-forest-faint">
                          {item.subtitle}
                        </span>
                      )}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <Thread
            nodeRef={refFromProject(project)}
            returnHref={`/structure-beneath-reality/${section.slug}`}
            className="mt-12"
          />
        </Container>
      </section>

      <nav className="border-t border-rule/50 py-12">
        <Container narrow>
          <TextLink
            href="/structure-beneath-reality"
            className="mt-8 inline-block type-body text-sm"
          >
            ← Back to the chamber
          </TextLink>
        </Container>
      </nav>
    </Room>
  );
}
