import { getThreadDefinition, isThreadId, type ThreadDefinition, type ThreadId } from "./vocabulary";

/**
 * Phase 1 Theme↔Thread aliases — exact slug overlap only.
 * Navigation compatibility (contextual links), not redirects.
 */
export const THEME_THREAD_ALIASES = {
  relationship: "relationship",
  consciousness: "consciousness",
} as const satisfies Record<string, ThreadId>;

export type ThemeThreadAliasSlug = keyof typeof THEME_THREAD_ALIASES;

export function getThreadIdForThemeSlug(slug: string): ThreadId | undefined {
  const mapped = THEME_THREAD_ALIASES[slug as ThemeThreadAliasSlug];
  return mapped && isThreadId(mapped) ? mapped : undefined;
}

export function getThreadForThemeSlug(slug: string): ThreadDefinition | undefined {
  const id = getThreadIdForThemeSlug(slug);
  return id ? getThreadDefinition(id) : undefined;
}
