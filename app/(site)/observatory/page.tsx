import type { Metadata } from "next";
import { ObservatoryCinematicExperience } from "@/components/observatory/cinematic";

export const metadata: Metadata = {
  title: "Observatory",
  description:
    "A scroll-driven passage through the Observatory — threshold to arrival.",
};

export default function ObservatoryPage() {
  return <ObservatoryCinematicExperience />;
}
