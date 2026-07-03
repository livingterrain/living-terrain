"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  getAllFieldNotes,
  getAllQuestions,
  getObservatorySignals,
} from "@/lib/content";
import { cn } from "@/lib/utils";

/** Peripheral concept fragments — drift in the margins, not on the main ring */
const CONCEPT_FRAGMENTS = [
  { slug: "relationship", label: "Relationship", x: "7%", y: "28%", drift: 22 },
  { slug: "meaning", label: "Meaning", x: "91%", y: "24%", drift: 28 },
  { slug: "embodiment", label: "Embodiment", x: "6%", y: "68%", drift: 26 },
  { slug: "language", label: "Language", x: "92%", y: "62%", drift: 24 },
  { slug: "freedom", label: "Freedom", x: "50%", y: "8%", drift: 30 },
  { slug: "identity", label: "Identity", x: "18%", y: "88%", drift: 32 },
  { slug: "information", label: "Information", x: "78%", y: "86%", drift: 27 },
] as const;

interface ConstellationHabitatProps {
  active: boolean;
  /** Pause whispers while a node holds focus */
  quiet?: boolean;
}

export function ConstellationHabitat({
  active,
  quiet = false,
}: ConstellationHabitatProps) {
  const questions = useMemo(() => getAllQuestions(), []);
  const fieldNotes = useMemo(() => getAllFieldNotes(), []);
  const signals = useMemo(() => getObservatorySignals(6), []);

  const questionOfDay = useMemo(
    () => questions[Math.floor(Date.now() / 86_400_000) % Math.max(questions.length, 1)],
    [questions],
  );

  const latestSignal = signals[0] ?? null;

  const [fieldNoteIndex, setFieldNoteIndex] = useState(0);
  const [fieldNoteVisible, setFieldNoteVisible] = useState(false);

  useEffect(() => {
    if (!active || quiet || fieldNotes.length === 0) return;

    let hideTimer: ReturnType<typeof setTimeout>;
    let cycleTimer: ReturnType<typeof setTimeout>;

    const cycle = () => {
      setFieldNoteVisible(true);
      hideTimer = setTimeout(() => setFieldNoteVisible(false), 18000);
      cycleTimer = setTimeout(() => {
        setFieldNoteIndex((i) => (i + 1) % fieldNotes.length);
        cycle();
      }, 52000 + Math.random() * 36000);
    };

    const showTimer = setTimeout(cycle, 22000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(cycleTimer);
    };
  }, [active, quiet, fieldNotes.length]);

  if (!active) return null;

  const activeFieldNote = fieldNotes[fieldNoteIndex];
  const fieldSnippet = activeFieldNote
    ? (activeFieldNote.body.split("\n")[0] ?? activeFieldNote.body).slice(0, 120)
    : "";

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
      aria-hidden={quiet}
    >
      {/* Question of the day — quiet inquiry in open space */}
      {!quiet && questionOfDay && (
        <motion.div
          className="absolute left-[max(1.25rem,4%)] top-[18%] max-w-[14rem] sm:max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3.5, delay: 2, ease: [0.45, 0.05, 0.55, 0.95] }}
        >
          <p className="type-chamber text-[0.5625rem] text-ivory/14">
            An open question
          </p>
          <Link
            href={`/questions/${questionOfDay.slug}`}
            className="pointer-events-auto mt-2 block font-heading text-[0.75rem] leading-snug text-ivory/22 transition-colors duration-[1.4s] hover:text-ivory/45"
          >
            {questionOfDay.title}
          </Link>
        </motion.div>
      )}

      {/* Observatory log — newest signal, not a panel */}
      {!quiet && latestSignal && (
        <motion.div
          className="absolute right-[max(1.25rem,4%)] top-[14%] max-w-[13rem] text-right sm:max-w-[15rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3.2, delay: 3.5, ease: [0.45, 0.05, 0.55, 0.95] }}
        >
          <p className="type-chamber text-[0.5625rem] text-ivory/12">
            Recent signal
          </p>
          <Link
            href={latestSignal.href}
            className="pointer-events-auto mt-2 block text-[0.625rem] leading-relaxed text-ivory/20 transition-colors duration-[1.4s] hover:text-ivory/42"
          >
            <span className="text-ivory/14">
              {latestSignal.kind === "essay" ? "Essay · " : "Note · "}
            </span>
            {latestSignal.title}
          </Link>
        </motion.div>
      )}

      {/* Floating conceptual fragments — hidden; the map ring already carries these names */}

      {/* Handwritten field notes — occasional whispers at the periphery */}
      <AnimatePresence>
        {!quiet && fieldNoteVisible && activeFieldNote && (
          <motion.blockquote
            key={`${activeFieldNote.id}-${fieldNoteIndex}`}
            className="habitat-handwritten absolute bottom-[18%] right-[max(1.25rem,4%)] max-w-[10rem] text-right sm:max-w-[12rem]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.14, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 4.5, ease: [0.45, 0.05, 0.55, 0.95] }}
          >
            <Link
              href={`/field-notes/${activeFieldNote.slug}`}
              className="pointer-events-auto block text-[0.8125rem] italic leading-relaxed text-ivory/35 transition-colors duration-[1.4s] hover:text-ivory/55"
            >
              {fieldSnippet}
              {activeFieldNote.body.length > 120 ? "…" : ""}
            </Link>
          </motion.blockquote>
        )}
      </AnimatePresence>
    </div>
  );
}
