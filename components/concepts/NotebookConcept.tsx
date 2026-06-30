"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ConceptShell } from "./ConceptShell";
import { getObservatorySignals } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function NotebookConcept() {
  const signals = getObservatorySignals(6);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(signals[0]?.id ?? "");

  const current = signals.find((s) => s.id === selected) ?? signals[0];
  const related = signals.filter(
    (s) => s.id !== current?.id && current?.peerIds.some((p) => s.peerIds.includes(p)),
  );

  return (
    <ConceptShell
      title="Concept 03 — The Observatory Log"
      hint="Tap a signal · read the marginalia"
    >
      <div className="flex h-full items-center justify-center bg-[#0f1418] p-4 sm:p-8">
        <div className="relative w-full max-w-4xl">
          {/* Desk shadow */}
          <div className="absolute -inset-4 rounded-sm bg-black/40 blur-2xl" />

          <motion.div
            layout
            className="relative grid min-h-[28rem] border border-[#2a3540] bg-[#f4f0e6] shadow-2xl sm:grid-cols-[1fr_1.1fr]"
          >
            {/* Left — signal index */}
            <div className="border-b border-[#d8d0c0] p-6 sm:border-b-0 sm:border-r">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-[#8a8070]">
                Observatory · live log
              </p>
              <p className="mt-4 font-heading text-xl text-[#2a2824]">
                Current signals
              </p>
              <ul className="mt-6 space-y-1">
                {signals.map((sig) => (
                  <li key={sig.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(sig.id)}
                      className={`w-full px-3 py-2.5 text-left text-sm transition-colors ${
                        selected === sig.id
                          ? "bg-[#e8e0d0] text-[#1a1814]"
                          : "text-[#5a5448] hover:bg-[#ece6da]"
                      }`}
                    >
                      <span className="font-mono text-[0.625rem] text-[#9a9080]">
                        {formatDate(sig.date)}
                      </span>
                      <p className="mt-0.5 line-clamp-2 font-heading text-[0.9375rem]">
                        {sig.title}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex gap-2">
                {[0, 1].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`h-8 flex-1 border text-[0.625rem] uppercase tracking-wider ${
                      page === p
                        ? "border-[#4a6a5a] bg-[#4a6a5a]/10 text-[#3a5a4a]"
                        : "border-[#d0c8b8] text-[#9a9080]"
                    }`}
                  >
                    {p === 0 ? "Signals" : "Strata"}
                  </button>
                ))}
              </div>
            </div>

            {/* Right — open page */}
            <div className="relative p-6 sm:p-8">
              <div
                className="pointer-events-none absolute right-4 top-0 h-full w-8 bg-gradient-to-l from-[#e8e0d0]/50 to-transparent"
                aria-hidden
              />

              <AnimatePresence mode="wait">
                {page === 0 && current && (
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-[#9a9080]">
                      {current.kind.replace("-", " ")}
                    </p>
                    <h2 className="mt-3 font-heading text-2xl text-[#1a1814]">
                      {current.title}
                    </h2>
                    <p className="mt-5 text-[0.9375rem] leading-relaxed text-[#4a4438]">
                      {current.excerpt}
                    </p>
                    <Link
                      href={current.href}
                      className="mt-8 inline-block border-b border-[#4a6a5a] pb-0.5 text-sm text-[#3a5a4a]"
                    >
                      Follow this thread →
                    </Link>
                  </motion.div>
                )}
                {page === 1 && (
                  <motion.div
                    key="strata"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[0.9375rem] leading-relaxed text-[#4a4438]"
                  >
                    <p className="font-heading text-xl text-[#1a1814]">
                      Ideas accumulate in layers
                    </p>
                    <p className="mt-4">
                      The notebook is never finished. Each signal is a layer
                      pressed into the next — essays, field observations, the
                      central chamber still pulsing beneath.
                    </p>
                    <Link
                      href="/observatory"
                      className="mt-8 inline-block text-sm text-[#3a5a4a]"
                    >
                      Enter the Observatory room →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Marginalia */}
              {page === 0 && related.length > 0 && (
                <aside className="absolute -right-2 top-1/4 hidden w-36 lg:block">
                  <p className="rotate-3 font-mono text-[0.5625rem] uppercase tracking-wider text-[#b8a890]">
                    connects to →
                  </p>
                  {related.slice(0, 2).map((r) => (
                    <Link
                      key={r.id}
                      href={r.href}
                      className="mt-2 block -rotate-2 border-l border-[#c4a880] pl-2 text-[0.6875rem] italic text-[#8a7060] hover:text-[#5a4a3a]"
                    >
                      {r.title.slice(0, 40)}…
                    </Link>
                  ))}
                </aside>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </ConceptShell>
  );
}
