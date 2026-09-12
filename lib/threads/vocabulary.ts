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
}

export const THREADS: readonly ThreadDefinition[] = [
  { id: "boundary", label: "Boundary" },
  { id: "intelligence", label: "Intelligence" },
  { id: "relationship", label: "Relationship" },
  { id: "logos", label: "Logos" },
  { id: "participation", label: "Participation" },
  { id: "constraint", label: "Constraint" },
  { id: "consciousness", label: "Consciousness" },
  { id: "translation", label: "Translation" },
  { id: "feedback", label: "Feedback" },
  { id: "technology", label: "Technology" },
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

/** Display names for curated thread IDs, in registry order. Unknown IDs are ignored. */
export function getThreadLabels(ids: readonly string[] | undefined): string[] {
  if (!ids?.length) return [];
  return ids.filter(isThreadId).map((id) => getThreadDefinition(id).label);
}
