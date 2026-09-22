/**
 * Thread ↔ Thread co-occurrence from essay-threads.json only.
 * Visitor UI shows quiet neighbors; sharedEssaySlugs stay available for later surfaces.
 */

import { loadEssayThreadRegistry } from "./registry";
import {
  THREAD_IDS,
  getThreadDefinition,
  isThreadId,
  type ThreadDefinition,
  type ThreadId,
} from "./vocabulary";

const DEFAULT_LIMIT = 3;

export type ThreadCoOccurrenceNeighbor = {
  threadId: ThreadId;
  /** Essays whose assignments include both Threads — retained for later exposure. */
  sharedEssaySlugs: readonly string[];
  sharedCount: number;
};

export type ThreadCoOccurrenceLink = ThreadCoOccurrenceNeighbor & {
  thread: ThreadDefinition;
};

function threadOrder(id: ThreadId): number {
  return THREAD_IDS.indexOf(id);
}

/**
 * Essays that carry both Threads in the committed registry.
 */
export function sharedEssaySlugsBetween(
  a: ThreadId,
  b: ThreadId,
): string[] {
  if (a === b) return [];
  const { assignments } = loadEssayThreadRegistry();
  return assignments
    .filter(
      (assignment) =>
        assignment.threadIds.includes(a) && assignment.threadIds.includes(b),
    )
    .map((assignment) => assignment.slug);
}

/**
 * Related Threads ranked by shared essay count (desc), then THREAD_IDS order.
 * Caps at `limit` (default 3). Empty when no co-membership exists.
 */
export function getThreadCoOccurrence(
  threadId: ThreadId,
  limit: number = DEFAULT_LIMIT,
): ThreadCoOccurrenceNeighbor[] {
  if (!isThreadId(threadId) || limit <= 0) return [];

  const shared = new Map<ThreadId, string[]>();
  const { assignments } = loadEssayThreadRegistry();

  for (const assignment of assignments) {
    if (!assignment.threadIds.includes(threadId)) continue;
    for (const other of assignment.threadIds) {
      if (other === threadId) continue;
      const slugs = shared.get(other);
      if (slugs) {
        if (!slugs.includes(assignment.slug)) slugs.push(assignment.slug);
      } else {
        shared.set(other, [assignment.slug]);
      }
    }
  }

  return [...shared.entries()]
    .map(([otherId, sharedEssaySlugs]) => ({
      threadId: otherId,
      sharedEssaySlugs,
      sharedCount: sharedEssaySlugs.length,
    }))
    .sort((left, right) => {
      if (right.sharedCount !== left.sharedCount) {
        return right.sharedCount - left.sharedCount;
      }
      return threadOrder(left.threadId) - threadOrder(right.threadId);
    })
    .slice(0, limit);
}

/** Visitor-ready links; omits empty results. */
export function getThreadCoOccurrenceLinks(
  threadId: ThreadId,
  limit: number = DEFAULT_LIMIT,
): ThreadCoOccurrenceLink[] {
  return getThreadCoOccurrence(threadId, limit).map((neighbor) => ({
    ...neighbor,
    thread: getThreadDefinition(neighbor.threadId),
  }));
}
