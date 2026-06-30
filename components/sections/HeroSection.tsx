import { Container } from "@/components/layout/Container";
import { HeroAtmosphere, TextLink } from "@/components/design-system";

export function HeroSection() {
  return (
    <section className="relative min-h-[88vh] border-b border-rule sm:min-h-[92vh]">
      <HeroAtmosphere />

      <Container
        narrow
        className="relative z-10 flex min-h-[88vh] flex-col justify-center py-24 sm:min-h-[92vh] sm:py-32 lg:py-36"
      >
        <div className="animate-threshold max-w-2xl">
          <p className="type-folio">Entrance</p>

          <h1 className="type-display animate-threshold-delay-1 mt-10 text-balance text-charcoal lg:text-[4rem] lg:leading-[1.08]">
            Living Terrain
          </h1>

          <p className="type-lead animate-threshold-delay-2 mt-12 max-w-xl text-[1.125rem] leading-[1.75] sm:text-xl">
            Beneath the ordinary surface of things, another geography waits —
            mapped not by coordinates, but by questions.
          </p>

          <p className="type-body animate-threshold-delay-3 mt-8 max-w-md text-[0.9375rem] leading-[1.85]">
            A library of inquiries. A field journal of observations. An
            observatory still being built. Step slowly — nothing here requires
            haste.
          </p>

          <nav
            className="animate-threshold-delay-3 mt-16 flex flex-col gap-5 sm:flex-row sm:gap-12"
            aria-label="Begin exploring"
          >
            <TextLink href="/questions">Begin with a question</TextLink>
            <TextLink href="/essays" muted>
              Browse the essay catalog
            </TextLink>
          </nav>
        </div>

        <p className="type-meta animate-threshold-delay-3 mt-20 sm:mt-28">
          Scroll to enter
        </p>
      </Container>
    </section>
  );
}
