import { Container } from "@/components/layout/Container";
import { Room } from "@/components/environment";
import { ObservatoryRoomTone } from "@/components/observatory/ObservatoryRoomTone";
import { TheTextLanding } from "@/components/observatory/the-text";

export default function TheTextPage() {
  return (
    <Room kind="observatory">
      <ObservatoryRoomTone />
      <section className="obs-bench pb-28 pt-10 sm:pb-36 sm:pt-14">
        <Container className="max-w-[46rem]">
          <TheTextLanding />
        </Container>
      </section>
    </Room>
  );
}
