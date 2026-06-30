"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ConceptShell } from "./ConceptShell";
import { getAllFieldNotes, getAllEssays, getFeaturedQuestions } from "@/lib/content";

interface Waypoint {
  id: string;
  x: number;
  y: number;
  title: string;
  body: string;
  href: string;
  kind: "note" | "essay" | "question";
}

export function FieldConcept() {
  const notes = getAllFieldNotes();
  const essays = getAllEssays();
  const questions = getFeaturedQuestions();
  const [selected, setSelected] = useState<Waypoint | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null,
  );

  const waypoints: Waypoint[] = [
    ...questions.map((q, i) => ({
      id: q.id,
      x: 20 + i * 22,
      y: 25 + (i % 2) * 30,
      title: q.title,
      body: q.description,
      href: `/questions/${q.slug}`,
      kind: "question" as const,
    })),
    ...essays.map((e, i) => ({
      id: e.id,
      x: 35 + i * 28,
      y: 55 + i * 12,
      title: e.title,
      body: e.excerpt,
      href: `/essays/${e.slug}`,
      kind: "essay" as const,
    })),
    ...notes.slice(0, 4).map((fn, i) => ({
      id: fn.id,
      x: 15 + i * 20,
      y: 70 + (i % 3) * 8,
      title: fn.title ?? "Field observation",
      body: fn.body,
      href: `/field-notes/${fn.slug}`,
      kind: "note" as const,
    })),
  ];

  function onPointerDown(e: React.PointerEvent) {
    dragRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    setPan({
      x: dragRef.current.px + (e.clientX - dragRef.current.x) * 0.4,
      y: dragRef.current.py + (e.clientY - dragRef.current.y) * 0.4,
    });
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  const kindPin: Record<Waypoint["kind"], string> = {
    question: "#c4a574",
    essay: "#8fa88a",
    note: "#7a9eae",
  };

  return (
    <ConceptShell
      title="Concept 05 — The Field Journal"
      hint="Drag to walk · click a waypoint"
    >
      <div className="relative h-full overflow-hidden bg-[#e8e2d6]">
        {/* Compass */}
        <div className="absolute right-4 top-4 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-[#8a8070]/40 bg-[#f4f0e8]/80 text-[0.5625rem] uppercase tracking-wider text-[#6a6050]">
          N
        </div>

        <p className="absolute left-4 top-4 z-20 max-w-[12rem] text-[0.6875rem] leading-relaxed text-[#6a6050]">
          You are at the threshold. Walk anywhere.
        </p>

        <div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <motion.div
            style={{ x: pan.x, y: pan.y }}
            className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2"
          >
            <svg
              className="h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Contour lines */}
              {[12, 22, 32, 42, 52, 62, 72].map((y) => (
                <path
                  key={y}
                  d={`M0 ${y} Q25 ${y - 4} 50 ${y} T100 ${y + 2}`}
                  fill="none"
                  stroke="#b8b0a0"
                  strokeWidth="0.15"
                  opacity="0.5"
                />
              ))}
              {[18, 38, 58, 78].map((y) => (
                <path
                  key={`b-${y}`}
                  d={`M0 ${y} Q30 ${y + 3} 60 ${y - 1} T100 ${y}`}
                  fill="none"
                  stroke="#a8a090"
                  strokeWidth="0.1"
                  opacity="0.35"
                />
              ))}
            </svg>

            {waypoints.map((wp) => (
              <button
                key={wp.id}
                type="button"
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${wp.x}%`, top: `${wp.y}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(wp);
                }}
              >
                <motion.span
                  whileHover={{ scale: 1.2 }}
                  className="relative flex h-4 w-4 items-center justify-center"
                >
                  <span
                    className="absolute h-8 w-8 rounded-full opacity-30"
                    style={{ backgroundColor: kindPin[wp.kind] }}
                  />
                  <span
                    className="relative h-2.5 w-2.5 rounded-full border-2 border-[#f4f0e8]"
                    style={{ backgroundColor: kindPin[wp.kind] }}
                  />
                </motion.span>
              </button>
            ))}
          </motion.div>
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="absolute bottom-4 left-4 right-4 z-30 mx-auto max-w-md border border-[#c8c0b0] bg-[#faf8f4] p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[0.625rem] uppercase tracking-[0.2em] text-[#9a9080]">
                {selected.kind} · found on the walk
              </p>
              <h3 className="mt-2 font-heading text-xl text-[#2a2824]">
                {selected.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5a5448] line-clamp-4">
                {selected.body}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <Link
                  href={selected.href}
                  className="text-sm text-[#4a6a5a] underline-offset-4 hover:underline"
                >
                  Open →
                </Link>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-[0.6875rem] text-[#9a9080]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ConceptShell>
  );
}
