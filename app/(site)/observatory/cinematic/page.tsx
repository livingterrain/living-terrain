import type { Metadata } from "next";
import { ObservatoryCinematicExperience } from "@/components/observatory/cinematic";

export const metadata: Metadata = {
  title: "Observatory — Cinematic Preview",
  description:
    "A scroll-driven passage through the Observatory — threshold to arrival.",
  robots: { index: false, follow: false },
};

export default function ObservatoryCinematicPage() {
  return <ObservatoryCinematicExperience />;
}
