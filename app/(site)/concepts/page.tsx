import type { Metadata } from "next";
import Link from "next/link";
import { TextLink } from "@/components/design-system";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { concepts } from "@/lib/concepts";

export const metadata: Metadata = {
  title: "Instrument Wing",
  description:
    "Prototypes and lenses in the observatory — ways of seeing the same intellectual sky.",
};

export default function ConceptsPage() {
  return (
    <Room kind="observatory">
      <RoomThreshold kind="observatory" align="center" />

      <section className="pb-24 pt-4 sm:pb-32">
        <Container narrow>
          <p className="type-body text-center text-[0.9375rem]">
            The constellation concept is the live map at{" "}
            <TextLink href="/">The Threshold</TextLink>.
            The other four remain prototypes to revisit.
          </p>

          <ol className="threshold-carved-list mt-16">
            {concepts.map((concept, index) => (
              <li key={concept.slug}>
                <Link href={`/concepts/${concept.slug}`} className="group block">
                  <p className="type-folio">
                    Instrument {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="type-entry mt-3 text-charcoal transition-colors duration-[1200ms] group-hover:text-forest">
                    {concept.title}
                  </h2>
                  <p className="type-lead mt-2 text-base">{concept.tagline}</p>
                  <p className="type-body mt-5 text-[0.9375rem]">{concept.philosophy}</p>
                  <p className="mt-4 text-[0.8125rem] text-forest-faint">
                    {concept.interaction}
                  </p>
                  <span className="mt-6 inline-block text-[0.6875rem] uppercase tracking-[0.15em] text-charcoal-faint transition-colors duration-[1200ms] group-hover:text-forest">
                    Enter the prototype →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </Room>
  );
}
