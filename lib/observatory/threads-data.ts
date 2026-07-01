import { resolveAtlasRoute } from "@/lib/atlas/routes";

export interface ThreadStep {
  kind: "theme" | "essay" | "field-note" | "question";
  slug: string;
  title: string;
  href: string;
}

export interface ObservatoryThread {
  id: string;
  slug: string;
  title: string;
  premise: string;
  steps: ThreadStep[];
}

function themeStep(slug: string, title: string): ThreadStep {
  return {
    kind: "theme",
    slug,
    title,
    href: resolveAtlasRoute("major-concept", slug),
  };
}

function essayStep(slug: string, title: string): ThreadStep {
  return {
    kind: "essay",
    slug,
    title,
    href: resolveAtlasRoute("essay", slug),
  };
}

function fieldNoteStep(slug: string, title: string): ThreadStep {
  return {
    kind: "field-note",
    slug,
    title,
    href: resolveAtlasRoute("field-note", slug),
  };
}

export const OBSERVATORY_THREADS: ObservatoryThread[] = [
  {
    id: "thread-identity-meaning",
    slug: "identity-embodiment-relationship-meaning",
    title: "From Identity to Meaning",
    premise:
      "An investigation that moves through the self, the body, relation, and what finally coheres.",
    steps: [
      themeStep("identity", "Identity"),
      themeStep("embodiment", "Embodiment"),
      themeStep("relationship", "Relationship"),
      themeStep("meaning", "Meaning"),
    ],
  },
  {
    id: "thread-perception",
    slug: "reality-perception-consciousness",
    title: "What Organizes Seeing",
    premise:
      "Before interpretation — what must already be in place for anything to appear as real?",
    steps: [
      themeStep("reality", "Reality"),
      themeStep("consciousness", "Consciousness"),
      essayStep(
        "constraint-is-not-the-opposite-of-freedom",
        "Constraint Is Not the Opposite of Freedom",
      ),
      fieldNoteStep("threshold", "Threshold"),
    ],
  },
  {
    id: "thread-time-return",
    slug: "time-meaning-return",
    title: "The Orbit of Return",
    premise:
      "Not repetition — returning to the same question through different doors.",
    steps: [
      themeStep("time", "Time"),
      themeStep("meaning", "Meaning"),
      essayStep(
        "you-have-to-go-far-enough-to-make-a-loop",
        "You Have to Go Far Enough to Make a Loop",
      ),
      fieldNoteStep("waiting-room", "Waiting Room"),
    ],
  },
];

export function getObservatoryThreads(): ObservatoryThread[] {
  return OBSERVATORY_THREADS;
}

export function getObservatoryThreadBySlug(
  slug: string,
): ObservatoryThread | undefined {
  return OBSERVATORY_THREADS.find((t) => t.slug === slug);
}
