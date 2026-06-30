import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { TextLink } from "@/components/design-system";
import { MediumPublicationLink } from "@/components/reading/MediumPublicationLink";
import { FadeIn } from "@/components/motion/FadeIn";
import { siteConfig } from "@/lib/content/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Chelsea M. Thacker — guide to Living Terrain, an ongoing investigation into the hidden architectures that shape perception, embodiment, relationship, meaning, and reality.",
};

export default function AboutPage() {
  return (
    <Room kind="reading">
      <RoomThreshold
        kind="reading"
        title={siteConfig.author}
        whisper="A guide, not the subject."
        description="Living Terrain is an ongoing investigation — not a portfolio, not a brand, but a place to think slowly about what holds the world together."
      />

      <section className="pb-24 pt-8 sm:pb-32">
        <Container narrow>
          <FadeIn>
            <div className="space-y-8 type-body sm:text-lg">
              <p>
                I am less interested in being an author than in being a careful
                observer. Living Terrain is where I map what I notice — the
                hidden architectures that shape perception, embodiment,
                relationship, meaning, and reality.
              </p>
              <p>
                This is not a biography. It is an invitation. The work is
                organized around questions rather than categories, because
                questions remain alive while categories harden. Essays on{" "}
                <TextLink href={siteConfig.mediumUrl} external>
                  Medium
                </TextLink>
                , a published book, field notes, and an archive still being
                built — all of it exists in relationship, not isolation.
              </p>
              <p>
                The central chamber is{" "}
                <TextLink href="/structure-beneath-reality">
                  The Structure Beneath Reality
                </TextLink>
                — an inquiry into what allows reality to remain itself while
                everything within it changes. Everything else orbits that
                question, or branches from it.
              </p>
              <p>
                If you are new here, follow a{" "}
                <TextLink href="/questions">question</TextLink>, read an{" "}
                <MediumPublicationLink /> essay, or simply wander until
                something catches your attention. The terrain rewards slow
                movement.
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>
    </Room>
  );
}
