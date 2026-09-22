import Link from "next/link";
import type { CSSProperties } from "react";
import {
  getThreadForThemeSlug,
  threadHref,
} from "@/lib/threads";
import "./thread-shelf.css";

type Props = {
  themeSlug: string;
  /** When set, tints the whisper for immersive realm palettes. */
  palette?: {
    textMuted: string;
    text: string;
    accent: string;
  };
};

/**
 * Quiet Theme→Thread navigation for Phase 1 aliases only.
 * Returns null for Themes without an exact Thread counterpart.
 */
export function ThemeThreadContinuation({ themeSlug, palette }: Props) {
  const thread = getThreadForThemeSlug(themeSlug);
  if (!thread) return null;

  const style: CSSProperties | undefined = palette
    ? {
        ["--theme-thread-muted" as string]: palette.textMuted,
        ["--theme-thread-text" as string]: palette.text,
        ["--theme-thread-accent" as string]: palette.accent,
      }
    : undefined;

  return (
    <p
      className="theme-thread-continuation"
      style={style}
      role="group"
      aria-label={`Continue as the ${thread.label} Thread`}
    >
      <span className="theme-thread-continuation__cue">
        This pattern also continues as
      </span>{" "}
      <Link
        href={threadHref(thread.id)}
        className="theme-thread-continuation__link"
      >
        {thread.label}
      </Link>
    </p>
  );
}
