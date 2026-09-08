"use client";

/**
 * Quiet section-level READ control — instrument action, not media chrome.
 */

import { usePassageSpeechOptional } from "./PassageSpeechProvider";
import type { PassageSpeechSectionId } from "@/lib/observatory/the-text/build-passage-speech";

export function SectionReadControl({
  sectionId,
  /** Prefer continuing from this section through the rest of the plan. */
  mode = "from",
}: {
  sectionId: PassageSpeechSectionId;
  mode?: "from" | "section";
}) {
  const speech = usePassageSpeechOptional();
  if (!speech || !speech.speechReady || speech.status === "unsupported") {
    return null;
  }

  const section = speech.plan.sections.find((s) => s.id === sectionId);
  if (!section?.text) return null;

  const sourceId =
    mode === "from" ? `from:${sectionId}` : `section:${sectionId}`;
  const active =
    speech.isActiveSource(sourceId) &&
    (speech.status === "speaking" || speech.status === "paused");

  const label =
    mode === "from"
      ? `Read from ${section.title} section`
      : `Read ${section.title} section`;

  const onClick = () => {
    if (active && speech.status === "speaking") {
      speech.pause();
      return;
    }
    if (active && speech.status === "paused") {
      speech.resume();
      return;
    }
    if (mode === "from") speech.speakFromSection(sectionId);
    else speech.speakSection(sectionId);
  };

  const visible =
    active && speech.status === "paused"
      ? "Resume"
      : active && speech.status === "speaking"
        ? "Pause"
        : mode === "from"
          ? "Read from here"
          : "Read this section";

  return (
    <button
      type="button"
      className="obs-text-read"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      data-speech-active={active ? "true" : undefined}
    >
      {visible}
    </button>
  );
}
