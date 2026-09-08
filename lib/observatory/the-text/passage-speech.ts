/**
 * Passage speech (READ) — English first.
 * Browser SpeechSynthesis is opt-in architecture; quality varies by OS/browser.
 * Hebrew TTS is intentionally not used until a labeled pronunciation tradition exists.
 */

export type PassageSpeechStatus =
  | "idle"
  | "speaking"
  | "paused"
  | "unsupported";

export type OriginalLanguageRecording = {
  /** Future hosted recording URL — not used until supplied. */
  url: string;
  /** Visitor-facing label, e.g. "Hebrew · Masoretic cantillation". */
  label: string;
  tradition?: string;
};

export type PassageReadingSource = {
  id: string;
  reference: string;
  /** Currently displayed English translation text. */
  englishText: string;
  englishLabel?: string;
  /** Architecture slot for a future original-language recording. */
  originalRecording?: OriginalLanguageRecording;
};

export function speechSynthesisSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    typeof window.speechSynthesis !== "undefined" &&
    typeof window.SpeechSynthesisUtterance !== "undefined"
  );
}

/** Soften browser voice quirks: prefer en voices when available. */
export function pickEnglishVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  const en = voices.filter((v) => /^en([-_]|$)/i.test(v.lang));
  const local = en.find((v) => v.localService) ?? en[0];
  return local ?? null;
}

export function normalizePassageSpeechText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\S\n]+/g, " ")
    .trim();
}
