import { Container } from "@/components/layout/Container";
import { Hairline, SectionIntro, TextLink } from "@/components/design-system";

export function ObservatorySection() {
  return (
    <section className="border-t border-rule bg-ivory-deep/70 py-24 sm:py-32 lg:py-40">
      <Container narrow>
        <SectionIntro
          label="Annex — open"
          title="The Observatory"
          description="A field station for visitor observations and reflections — where careful readers add to a shared investigation."
        />

        <Hairline motif className="my-12" />

        <div className="max-w-md">
          <p className="type-folio mb-4">Record an observation</p>
          <p className="type-body mb-6 text-[0.875rem] text-charcoal-muted">
            Add what you noticed to the shared investigation.
          </p>
        </div>

        <TextLink href="/observatory" className="mt-6 inline-block">
          Enter the Observatory →
        </TextLink>
      </Container>
    </section>
  );
}
