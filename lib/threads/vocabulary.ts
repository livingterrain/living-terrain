export const THREAD_IDS = [
  "boundary",
  "intelligence",
  "relationship",
  "logos",
  "participation",
  "constraint",
  "consciousness",
  "translation",
  "feedback",
  "technology",
] as const;

export type ThreadId = (typeof THREAD_IDS)[number];

export interface ThreadDefinition {
  id: ThreadId;
  label: string;
  description: string;
}

export const THREADS: readonly ThreadDefinition[] = [
  {
    id: "boundary",
    label: "Boundary",
    description:
      "Living systems endure by regulating exchange — what may enter, what must remain outside, and what happens when that edge fails.",
  },
  {
    id: "intelligence",
    label: "Intelligence",
    description:
      "When knowing is no longer scarce, the question becomes what still requires judgment, care, and a living mind.",
  },
  {
    id: "relationship",
    label: "Relationship",
    description:
      "Relation is not a later connection between finished things. It is the condition through which things become.",
  },
  {
    id: "logos",
    label: "Logos",
    description:
      "The pattern that can be spoken: order that reality already holds, and that language, law, and living form try to hear.",
  },
  {
    id: "participation",
    label: "Participation",
    description:
      "Understanding is not observation from outside. To know a field is to stand inside it and be changed.",
  },
  {
    id: "constraint",
    label: "Constraint",
    description:
      "Limits are not the opposite of life. They are the architecture that gives a system shape, cost, and the capacity to continue.",
  },
  {
    id: "consciousness",
    label: "Consciousness",
    description:
      "The interior of a living process as it becomes aware of itself — and of the world it cannot stand apart from.",
  },
  {
    id: "translation",
    label: "Translation",
    description:
      "Meaning moving from one map into another: body into word, science into symbol, one language into a form that can be lived.",
  },
  {
    id: "feedback",
    label: "Feedback",
    description:
      "What returns after an action: the loop through which a system learns, stabilizes, or begins to come apart.",
  },
  {
    id: "technology",
    label: "Technology",
    description:
      "Artifice as a participant in living terrain — tools that extend a process, and rearrange the world they touch.",
  },
] as const;

const THREAD_ID_SET = new Set<string>(THREAD_IDS);

export function isThreadId(value: string): value is ThreadId {
  return THREAD_ID_SET.has(value);
}

export function getThreadDefinition(id: ThreadId): ThreadDefinition {
  const thread = THREADS.find((item) => item.id === id);
  if (!thread) {
    throw new Error(`Unknown thread id: ${id}`);
  }
  return thread;
}

export function getThreadByParam(value: string): ThreadDefinition | undefined {
  return isThreadId(value) ? getThreadDefinition(value) : undefined;
}

export function threadHref(id: ThreadId): string {
  return `/threads/${id}`;
}

export function getThreadRefs(ids: readonly string[] | undefined): ThreadDefinition[] {
  if (!ids?.length) return [];
  return ids.filter(isThreadId).map((id) => getThreadDefinition(id));
}

/** Display names for curated thread IDs, in registry order. Unknown IDs are ignored. */
export function getThreadLabels(ids: readonly string[] | undefined): string[] {
  return getThreadRefs(ids).map((thread) => thread.label);
}

export function threadEssayCountLabel(count: number): string {
  return count === 1 ? "1 essay in this thread" : `${count} essays in this thread`;
}
