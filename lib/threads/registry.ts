import committedRegistry from "../../data/publications/essay-threads.json";
import { isThreadId, type ThreadId } from "./vocabulary";

export interface EssayThreadAssignment {
  slug: string;
  threadIds: ThreadId[];
}

export interface EssayThreadRegistry {
  version: 1;
  assignments: EssayThreadAssignment[];
}

export type ThreadRegistryIssueCode =
  | "invalid-version"
  | "invalid-shape"
  | "missing-slug"
  | "duplicate-assignment"
  | "empty-thread-ids"
  | "unknown-thread-id"
  | "duplicate-thread-id"
  | "unknown-essay-slug";

export interface ThreadRegistryIssue {
  level: "error";
  code: ThreadRegistryIssueCode;
  message: string;
  slug?: string;
}

function issue(
  code: ThreadRegistryIssueCode,
  message: string,
  slug?: string,
): ThreadRegistryIssue {
  return { level: "error", code, message, slug };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseEssayThreadRegistry(data: unknown): {
  registry: EssayThreadRegistry | null;
  issues: ThreadRegistryIssue[];
} {
  if (!isRecord(data)) {
    return {
      registry: null,
      issues: [issue("invalid-shape", "Essay thread registry must be an object.")],
    };
  }

  const issues: ThreadRegistryIssue[] = [];

  if (data.version !== 1) {
    issues.push(issue("invalid-version", "Essay thread registry version must be 1."));
  }

  if (!Array.isArray(data.assignments)) {
    issues.push(issue("invalid-shape", "Essay thread registry assignments must be an array."));
    return { registry: null, issues };
  }

  const assignments: EssayThreadAssignment[] = [];
  const seenSlugs = new Set<string>();

  for (const [index, raw] of data.assignments.entries()) {
    if (!isRecord(raw)) {
      issues.push(
        issue("invalid-shape", `Assignment ${index} must be an object.`),
      );
      continue;
    }

    const slug = typeof raw.slug === "string" ? raw.slug.trim() : "";
    if (!slug) {
      issues.push(issue("missing-slug", `Assignment ${index} is missing a public essay slug.`));
      continue;
    }

    if (seenSlugs.has(slug)) {
      issues.push(
        issue("duplicate-assignment", `Duplicate thread assignment for slug "${slug}".`, slug),
      );
      continue;
    }
    seenSlugs.add(slug);

    if (!Array.isArray(raw.threadIds)) {
      issues.push(
        issue("invalid-shape", `Assignment "${slug}" threadIds must be an array.`, slug),
      );
      continue;
    }

    if (raw.threadIds.length === 0) {
      issues.push(
        issue("empty-thread-ids", `Assignment "${slug}" must include at least one thread.`, slug),
      );
      continue;
    }

    const threadIds: ThreadId[] = [];
    const seenThreads = new Set<string>();
    let assignmentFailed = false;

    for (const value of raw.threadIds) {
      if (typeof value !== "string" || !isThreadId(value)) {
        issues.push(
          issue(
            "unknown-thread-id",
            `Assignment "${slug}" has unknown thread id "${String(value)}".`,
            slug,
          ),
        );
        assignmentFailed = true;
        continue;
      }
      if (seenThreads.has(value)) {
        issues.push(
          issue(
            "duplicate-thread-id",
            `Assignment "${slug}" repeats thread id "${value}".`,
            slug,
          ),
        );
        assignmentFailed = true;
        continue;
      }
      seenThreads.add(value);
      threadIds.push(value);
    }

    if (assignmentFailed) continue;
    assignments.push({ slug, threadIds });
  }

  if (issues.length > 0) {
    return { registry: null, issues };
  }

  return {
    registry: { version: 1, assignments },
    issues,
  };
}

export function findUnknownEssayThreadSlugs(
  registry: EssayThreadRegistry,
  knownSlugs: Iterable<string>,
): ThreadRegistryIssue[] {
  const known = new Set(knownSlugs);
  return registry.assignments.flatMap((assignment) =>
    known.has(assignment.slug)
      ? []
      : [
          issue(
            "unknown-essay-slug",
            `Thread assignment slug "${assignment.slug}" does not match a public essay.`,
            assignment.slug,
          ),
        ],
  );
}

export function essayThreadMapFromRegistry(
  registry: EssayThreadRegistry,
): Map<string, ThreadId[]> {
  return new Map(registry.assignments.map((assignment) => [assignment.slug, assignment.threadIds]));
}

export function applyEssayThreads<T extends { slug: string }>(
  essays: T[],
  assignments: ReadonlyMap<string, readonly ThreadId[]>,
): Array<T & { threadIds: ThreadId[] }> {
  return essays.map((essay) => ({
    ...essay,
    threadIds: [...(assignments.get(essay.slug) ?? [])],
  }));
}

let cachedRegistry: EssayThreadRegistry | null = null;
let cachedMap: Map<string, ThreadId[]> | null = null;

export function loadEssayThreadRegistry(): EssayThreadRegistry {
  if (cachedRegistry) return cachedRegistry;
  const { registry, issues } = parseEssayThreadRegistry(committedRegistry);
  if (!registry) {
    throw new Error(
      ["Essay thread registry is invalid:", ...issues.map((item) => item.message)].join("\n"),
    );
  }
  cachedRegistry = registry;
  return registry;
}

export function getEssayThreadMap(): Map<string, ThreadId[]> {
  if (cachedMap) return cachedMap;
  cachedMap = essayThreadMapFromRegistry(loadEssayThreadRegistry());
  return cachedMap;
}

export function getThreadIdsForEssaySlug(slug: string): ThreadId[] {
  return [...(getEssayThreadMap().get(slug) ?? [])];
}
