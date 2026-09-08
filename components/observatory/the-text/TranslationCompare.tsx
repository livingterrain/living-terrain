"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import type { TranslationVariant } from "@/lib/observatory/the-text";

export function TranslationCompare({
  translations,
  primaryId,
  preferredRightId,
}: {
  translations: TranslationVariant[];
  primaryId: string;
  preferredRightId?: string;
}) {
  const groupId = useId();
  const [leftId, setLeftId] = useState(primaryId);
  const [rightId, setRightId] = useState(() => {
    if (
      preferredRightId &&
      translations.some((t) => t.id === preferredRightId) &&
      preferredRightId !== primaryId
    ) {
      return preferredRightId;
    }
    return translations.find((t) => t.id !== primaryId)?.id ?? primaryId;
  });

  const left = translations.find((t) => t.id === leftId) ?? translations[0];
  const right = translations.find((t) => t.id === rightId) ?? translations[1];

  const highlightSet = useMemo(() => {
    const phrases = new Set<string>();
    for (const note of [
      ...(left?.differenceNotes ?? []),
      ...(right?.differenceNotes ?? []),
    ]) {
      phrases.add(note.phrase.toLowerCase());
    }
    return phrases;
  }, [left, right]);

  if (!left || !right) return null;

  const pairedNotes = [
    ...(left.differenceNotes ?? []),
    ...(right.differenceNotes ?? []),
  ].filter(
    (n, i, arr) =>
      arr.findIndex((x) => x.phrase === n.phrase && x.note === n.note) === i,
  );

  return (
    <div className="obs-text-compare">
      <div className="obs-text-compare__controls">
        <label className="obs-text-compare__label" htmlFor={`${groupId}-left`}>
          Left
          <select
            id={`${groupId}-left`}
            value={leftId}
            onChange={(e) => setLeftId(e.target.value)}
            className="obs-text-compare__select"
          >
            {translations.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="obs-text-compare__label" htmlFor={`${groupId}-right`}>
          Right
          <select
            id={`${groupId}-right`}
            value={rightId}
            onChange={(e) => setRightId(e.target.value)}
            className="obs-text-compare__select"
          >
            {translations.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="obs-text-compare__columns">
        <TranslationColumn translation={left} highlightSet={highlightSet} />
        <TranslationColumn translation={right} highlightSet={highlightSet} />
      </div>

      <ul className="obs-text-compare__notes" role="list">
        {pairedNotes.map((n) => (
          <li key={`${n.phrase}-${n.note}`}>
            <span className="obs-text-compare__phrase">{n.phrase}</span>
            <span className="obs-text-compare__note">{n.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TranslationColumn({
  translation,
  highlightSet,
}: {
  translation: TranslationVariant;
  highlightSet: Set<string>;
}) {
  return (
    <figure className="obs-text-compare__col">
      <figcaption>
        <span className="obs-text-compare__label-name">{translation.label}</span>
        <span className="obs-text-compare__attr">{translation.attribution}</span>
      </figcaption>
      <blockquote className="obs-text-compare__text">
        {renderHighlighted(translation.text, highlightSet)}
      </blockquote>
    </figure>
  );
}

function renderHighlighted(text: string, highlightSet: Set<string>) {
  if (highlightSet.size === 0) return text;

  const patterns = [...highlightSet].sort((a, b) => b.length - a.length);
  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let earliest = -1;
    let matched = "";
    const lower = remaining.toLowerCase();
    for (const p of patterns) {
      const idx = lower.indexOf(p);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        matched = remaining.slice(idx, idx + p.length);
      }
    }
    if (earliest === -1) {
      parts.push(remaining);
      break;
    }
    if (earliest > 0) parts.push(remaining.slice(0, earliest));
    parts.push(
      <mark key={key++} className="obs-text-compare__mark">
        {matched}
      </mark>,
    );
    remaining = remaining.slice(earliest + matched.length);
  }

  return parts;
}
