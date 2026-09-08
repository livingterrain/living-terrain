"use client";

/**
 * Shared passage speech controller for Instrument 01.
 * One active utterance/source at a time — starting a new READ cancels prior speech.
 * “Read from here” speaks section chunks in page order (queue), not DOM scrape.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  buildPassageSpeechPlan,
  PASSAGE_SPEECH_SECTION_ORDER,
  textForSectionOnly,
  type PassageSpeechPlan,
  type PassageSpeechSectionId,
} from "@/lib/observatory/the-text/build-passage-speech";
import {
  normalizePassageSpeechText,
  pickEnglishVoice,
  speechSynthesisSupported,
  type PassageSpeechStatus,
} from "@/lib/observatory/the-text/passage-speech";
import type { Passage } from "@/lib/observatory/the-text";

export type PassageSpeechSourceKind =
  | "full"
  | "translation"
  | "section"
  | "from-section";

export type PassageSpeechActive = {
  sourceId: string;
  kind: PassageSpeechSourceKind;
  label: string;
} | null;

type PassageSpeechContextValue = {
  plan: PassageSpeechPlan;
  status: PassageSpeechStatus;
  active: PassageSpeechActive;
  speechReady: boolean;
  /** Sections currently available on the page (e.g. after Hebrew reveal). */
  unlockedSections: readonly PassageSpeechSectionId[];
  setUnlockedSections: (ids: readonly PassageSpeechSectionId[]) => void;
  speakText: (
    text: string,
    meta: { sourceId: string; kind: PassageSpeechSourceKind; label: string },
  ) => void;
  speakFullPassage: () => void;
  speakTranslation: (translationId: string) => void;
  speakSection: (sectionId: PassageSpeechSectionId) => void;
  speakFromSection: (sectionId: PassageSpeechSectionId) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  isActiveSource: (sourceId: string) => boolean;
};

const PassageSpeechContext = createContext<PassageSpeechContextValue | null>(
  null,
);

function translationAriaName(attribution: string, label: string): string {
  if (/american standard/i.test(attribution)) {
    return "American Standard Version";
  }
  if (/young/i.test(attribution)) {
    return "Young’s Literal Translation";
  }
  return label;
}

export function PassageSpeechProvider({
  passage,
  children,
}: {
  passage: Passage;
  children: ReactNode;
}) {
  const plan = useMemo(() => buildPassageSpeechPlan(passage), [passage]);
  const [status, setStatus] = useState<PassageSpeechStatus>("idle");
  const [active, setActive] = useState<PassageSpeechActive>(null);
  const [speechReady, setSpeechReady] = useState(false);
  const [unlockedSections, setUnlockedSections] = useState<
    readonly PassageSpeechSectionId[]
  >(PASSAGE_SPEECH_SECTION_ORDER);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueRef = useRef<string[]>([]);
  const metaRef = useRef<PassageSpeechActive>(null);
  const passageIdRef = useRef(passage.id);
  const generationRef = useRef(0);

  useEffect(() => {
    if (!speechSynthesisSupported()) {
      setSpeechReady(false);
      setStatus("unsupported");
      return;
    }
    setSpeechReady(true);
    const load = () => {
      void window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
    };
  }, []);

  const cancel = useCallback(() => {
    generationRef.current += 1;
    queueRef.current = [];
    metaRef.current = null;
    if (!speechSynthesisSupported()) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setActive(null);
    setStatus((s) => (s === "unsupported" ? s : "idle"));
  }, []);

  // Stop speech on passage change / unmount (navigation).
  useEffect(() => {
    if (passageIdRef.current !== passage.id) {
      cancel();
      passageIdRef.current = passage.id;
    }
  }, [passage.id, cancel]);

  useEffect(() => () => cancel(), [cancel]);

  const speakChunk = useCallback((text: string, generation: number) => {
    if (generation !== generationRef.current) return;
    if (!speechSynthesisSupported()) {
      setStatus("unsupported");
      return;
    }
    const cleaned = normalizePassageSpeechText(text);
    if (!cleaned) {
      const next = queueRef.current.shift();
      if (next) speakChunk(next, generation);
      else {
        utteranceRef.current = null;
        metaRef.current = null;
        setActive(null);
        setStatus("idle");
      }
      return;
    }

    const utter = new SpeechSynthesisUtterance(cleaned);
    utter.rate = 0.92;
    utter.pitch = 1;
    utter.volume = 1;
    const voice = pickEnglishVoice(window.speechSynthesis.getVoices());
    if (voice) utter.voice = voice;
    utter.lang = voice?.lang ?? "en-US";

    utter.onstart = () => {
      if (generation !== generationRef.current) return;
      setStatus("speaking");
    };
    utter.onend = () => {
      if (generation !== generationRef.current) return;
      const next = queueRef.current.shift();
      if (next) {
        speakChunk(next, generation);
        return;
      }
      utteranceRef.current = null;
      metaRef.current = null;
      setActive(null);
      setStatus("idle");
    };
    utter.onerror = () => {
      if (generation !== generationRef.current) return;
      queueRef.current = [];
      utteranceRef.current = null;
      metaRef.current = null;
      setActive(null);
      setStatus("idle");
    };
    utter.onpause = () => {
      if (generation !== generationRef.current) return;
      setStatus("paused");
    };
    utter.onresume = () => {
      if (generation !== generationRef.current) return;
      setStatus("speaking");
    };

    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, []);

  const speakText = useCallback(
    (
      text: string,
      meta: { sourceId: string; kind: PassageSpeechSourceKind; label: string },
    ) => {
      if (!speechSynthesisSupported()) {
        setStatus("unsupported");
        return;
      }
      const cleaned = normalizePassageSpeechText(text);
      if (!cleaned) return;

      generationRef.current += 1;
      const generation = generationRef.current;
      window.speechSynthesis.cancel();
      queueRef.current = [];
      metaRef.current = meta;
      setActive(meta);
      setStatus("speaking");
      speakChunk(cleaned, generation);
    },
    [speakChunk],
  );

  const speakChunks = useCallback(
    (
      chunks: string[],
      meta: { sourceId: string; kind: PassageSpeechSourceKind; label: string },
    ) => {
      if (!speechSynthesisSupported()) {
        setStatus("unsupported");
        return;
      }
      const cleaned = chunks
        .map((c) => normalizePassageSpeechText(c))
        .filter(Boolean);
      if (cleaned.length === 0) return;

      generationRef.current += 1;
      const generation = generationRef.current;
      window.speechSynthesis.cancel();
      queueRef.current = cleaned.slice(1);
      metaRef.current = meta;
      setActive(meta);
      setStatus("speaking");
      speakChunk(cleaned[0]!, generation);
    },
    [speakChunk],
  );

  const speakFullPassage = useCallback(() => {
    speakText(plan.fullPassage.text, {
      sourceId: `full:${plan.passageId}`,
      kind: "full",
      label: `Read ${plan.reference}`,
    });
  }, [plan, speakText]);

  const speakTranslation = useCallback(
    (translationId: string) => {
      const t = plan.translations.find((x) => x.id === translationId);
      if (!t) return;
      const name = translationAriaName(t.attribution, t.label);
      speakText(t.text, {
        sourceId: `translation:${t.id}`,
        kind: "translation",
        label: `Read ${name}`,
      });
    },
    [plan.translations, speakText],
  );

  const speakSection = useCallback(
    (sectionId: PassageSpeechSectionId) => {
      const section = plan.sections.find((s) => s.id === sectionId);
      if (!section) return;
      speakText(textForSectionOnly(plan, sectionId), {
        sourceId: `section:${sectionId}`,
        kind: "section",
        label: `Read ${section.title} section`,
      });
    },
    [plan, speakText],
  );

  const speakFromSection = useCallback(
    (sectionId: PassageSpeechSectionId) => {
      const section = plan.sections.find((s) => s.id === sectionId);
      if (!section) return;
      const start = PASSAGE_SPEECH_SECTION_ORDER.indexOf(sectionId);
      if (start < 0) return;
      const unlocked = new Set(unlockedSections);
      const wanted = PASSAGE_SPEECH_SECTION_ORDER.slice(start).filter((id) =>
        unlocked.has(id),
      );
      const wantedSet = new Set(wanted);
      const chunks = plan.sections
        .filter((s) => wantedSet.has(s.id))
        .map((s) => s.text)
        .filter(Boolean);
      speakChunks(chunks, {
        sourceId: `from:${sectionId}`,
        kind: "from-section",
        label: `Read from ${section.title} section`,
      });
    },
    [plan, speakChunks, unlockedSections],
  );

  const pause = useCallback(() => {
    if (!speechSynthesisSupported()) return;
    if (status !== "speaking") return;
    try {
      window.speechSynthesis.pause();
      window.setTimeout(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          cancel();
        } else {
          setStatus("paused");
        }
      }, 40);
    } catch {
      cancel();
    }
  }, [status, cancel]);

  const resume = useCallback(() => {
    if (!speechSynthesisSupported()) return;
    if (status !== "paused") return;
    try {
      window.speechSynthesis.resume();
      setStatus("speaking");
    } catch {
      /* ignore */
    }
  }, [status]);

  const value = useMemo<PassageSpeechContextValue>(
    () => ({
      plan,
      status,
      active,
      speechReady,
      unlockedSections,
      setUnlockedSections,
      speakText,
      speakFullPassage,
      speakTranslation,
      speakSection,
      speakFromSection,
      pause,
      resume,
      cancel,
      isActiveSource: (sourceId: string) => active?.sourceId === sourceId,
    }),
    [
      plan,
      status,
      active,
      speechReady,
      unlockedSections,
      speakText,
      speakFullPassage,
      speakTranslation,
      speakSection,
      speakFromSection,
      pause,
      resume,
      cancel,
    ],
  );

  return (
    <PassageSpeechContext.Provider value={value}>
      {children}
    </PassageSpeechContext.Provider>
  );
}

export function usePassageSpeech(): PassageSpeechContextValue {
  const ctx = useContext(PassageSpeechContext);
  if (!ctx) {
    throw new Error(
      "usePassageSpeech must be used within PassageSpeechProvider",
    );
  }
  return ctx;
}

export function usePassageSpeechOptional(): PassageSpeechContextValue | null {
  return useContext(PassageSpeechContext);
}

/** Sync which passage strata are currently on-page (e.g. after Hebrew reveal). */
export function PassageSpeechUnlock({
  unlocked,
}: {
  unlocked: readonly PassageSpeechSectionId[];
}) {
  const speech = usePassageSpeechOptional();
  useEffect(() => {
    speech?.setUnlockedSections(unlocked);
  }, [speech, unlocked]);
  return null;
}
