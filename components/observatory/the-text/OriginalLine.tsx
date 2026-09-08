"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { Passage, PassageWord } from "@/lib/observatory/the-text";
import { WordPanel } from "./WordPanel";

export function OriginalLine({
  passage,
  selectedId,
  onSelect,
}: {
  passage: Passage;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const wordsById = Object.fromEntries(
    passage.words.map((w) => [w.id, w]),
  ) as Record<string, PassageWord>;
  const panelId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const selectedWord = selectedId ? wordsById[selectedId] : undefined;

  const interactiveIds = passage.words.map((w) => w.id);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, wordId: string) => {
      const index = interactiveIds.indexOf(wordId);
      if (index < 0) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onSelect(null);
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const delta = event.key === "ArrowRight" ? 1 : -1;
        const next = interactiveIds[index + delta];
        if (next) {
          onSelect(next);
          const btn = listRef.current?.querySelector<HTMLButtonElement>(
            `[data-word-id="${next}"]`,
          );
          btn?.focus();
        }
      }
    },
    [interactiveIds, onSelect],
  );

  return (
    <div
      className={
        selectedWord
          ? "obs-text-original is-examining"
          : "obs-text-original"
      }
    >
      <p className="obs-text-original__meta">
        <span>{passage.original.scriptLabel}</span>
        <span className="obs-studio__status-sep" aria-hidden>
          ·
        </span>
        <span>{passage.original.source}</span>
      </p>
      <div
        ref={listRef}
        className="obs-text-original__line"
        dir={passage.original.dir}
        lang={passage.original.lang}
        role="group"
        aria-label={`${passage.original.scriptLabel} text of ${passage.reference}. Activate a word to examine it.`}
      >
        {passage.original.tokens.map((token, i) => {
          if (token.type === "text") {
            return (
              <span key={`t-${i}`} className="obs-text-original__plain">
                {token.value}
              </span>
            );
          }
          const word = wordsById[token.wordId];
          if (!word) return null;
          const selected = selectedId === word.id;
          return (
            <button
              key={word.id + String(i)}
              type="button"
              data-word-id={word.id}
              className={
                selected
                  ? "obs-text-original__word is-selected"
                  : "obs-text-original__word"
              }
              aria-expanded={selected}
              aria-controls={selected ? panelId : undefined}
              onClick={() => onSelect(selected ? null : word.id)}
              onKeyDown={(e) => onKeyDown(e, word.id)}
            >
              {word.surface}
            </button>
          );
        })}
      </div>
      {!selectedWord && (
        <p className="obs-text-original__hint">
          Tap or focus a word to examine it. Escape clears the selection.
        </p>
      )}
      {selectedWord && (
        <>
          <div className="obs-text-original__bridge" aria-hidden="true">
            <span className="obs-text-original__bridge-rule" />
            <span className="obs-text-original__bridge-mark" />
          </div>
          <WordPanel
            id={panelId}
            word={selectedWord}
            semanticRangeNote={passage.semanticRangeNote}
            onClose={() => onSelect(null)}
          />
        </>
      )}
    </div>
  );
}

export function useSelectedWord(initial: string | null = null) {
  const [selectedId, setSelectedId] = useState<string | null>(initial);

  useEffect(() => {
    function onDocKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") setSelectedId(null);
    }
    document.addEventListener("keydown", onDocKey);
    return () => document.removeEventListener("keydown", onDocKey);
  }, []);

  return [selectedId, setSelectedId] as const;
}
