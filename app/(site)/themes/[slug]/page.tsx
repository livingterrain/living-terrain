import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { Thread } from "@/components/thread";
import { RealmExperience } from "@/components/realms";
import { TextLink } from "@/components/design-system";
import { FadeIn } from "@/components/motion/FadeIn";
import { getAllThemes, getThemeBySlug } from "@/lib/content";
import { getThemeHub, isImmersiveRealm } from "@/lib/realms";
import { NODE_WHISPERS } from "@/lib/concepts/constellation-discovery";
import { refFromTheme } from "@/lib/relationships";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllThemes().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const theme = getThemeBySlug(slug);
  if (!theme) return { title: "Theme Not Found" };

  return {
    title: theme.title,
    description: theme.description,
  };
}

export default async function ThemePage({ params }: PageProps) {
  const { slug } = await params;
  const theme = getThemeBySlug(slug);
  if (!theme) notFound();

  if (isImmersiveRealm(slug)) {
    const hub = getThemeHub(slug);
    if (hub) {
      return <RealmExperience hub={hub} />;
    }
  }

  const whisper =
    NODE_WHISPERS[theme.id] ?? "A thread through the terrain";

  return (
    <Room kind="reading">
      <RoomThreshold kind="reading" title={theme.title} whisper={whisper}>
        {theme.description && (
          <p className="type-lead mt-4 text-base sm:text-lg">{theme.description}</p>
        )}
      </RoomThreshold>

      <section className="pb-32 pt-10 sm:pb-40">
        <Container narrow>
          <FadeIn>
            <Thread
              nodeRef={refFromTheme(theme)}
              returnHref={`/themes/${theme.slug}`}
            />
          </FadeIn>

          <div className="mt-16 border-t border-rule/50 pt-8">
            <TextLink href="/" className="type-body text-sm">
              ← Back to the map
            </TextLink>
          </div>
        </Container>
      </section>
    </Room>
  );
}
