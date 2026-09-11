import type { Metadata } from "next";
import { withCanonical } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Room } from "@/components/environment";
import {
  InstrumentListen,
  TheTextLanding,
} from "@/components/observatory/the-text";

export const metadata: Metadata = withCanonical("/observatory/the-text", {
  title: "The Text",
  description:
    "What survives translation? Look beneath the English at words, grammar, and interpretive choices.",
});

export default function TheTextPage() {
  return (
    <Room kind="observatory">
      <InstrumentListen />
      <section className="obs-bench pb-28 pt-10 sm:pb-36 sm:pt-14">
        <Container className="max-w-[46rem]">
          <TheTextLanding />
        </Container>
      </section>
    </Room>
  );
}
