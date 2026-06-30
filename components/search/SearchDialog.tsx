"use client";

import { useEffect, useState, useCallback } from "react";
import { useTerrainNavigation } from "@/components/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { buildSearchIndex } from "@/lib/content";
import type { SearchResult } from "@/lib/content/types";
import { cn } from "@/lib/utils";

const typeLabels: Record<SearchResult["type"], string> = {
  essay: "Essay",
  book: "Book",
  question: "Question",
  "field-note": "Field Note",
  theme: "Theme",
  quotation: "Quotation",
  observation: "Observation",
};

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { navigate } = useTerrainNavigation();
  const index = buildSearchIndex();

  const results = query.trim()
    ? index.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    navigate(href);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="type-meta text-charcoal-muted transition-colors duration-500 hover:text-forest"
        aria-label="Search catalog"
      >
        Search
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.45, 0.05, 0.55, 0.95] }}
              className="fixed inset-0 z-50 bg-charcoal/[0.06]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.45, 0.05, 0.55, 0.95] }}
              className="fixed top-[12%] left-1/2 z-50 w-[calc(100%-3rem)] max-w-lg -translate-x-1/2"
            >
              <div className="border border-rule bg-ivory">
                <div className="border-b border-rule px-5">
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search the catalog"
                    className="w-full bg-transparent py-5 font-body text-sm text-charcoal placeholder:text-charcoal-faint focus:outline-none"
                  />
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {query.trim() && results.length === 0 && (
                    <p className="type-meta px-5 py-8">No entries found.</p>
                  )}
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => go(result.href)}
                      className={cn(
                        "w-full border-b border-rule/60 px-5 py-5 text-left",
                        "transition-colors duration-[600ms] hover:bg-ivory-deep/40",
                      )}
                    >
                      <p className="type-folio">{typeLabels[result.type]}</p>
                      <p className="mt-1.5 font-heading text-base text-charcoal">
                        {result.title}
                      </p>
                      <p className="type-meta mt-1.5 line-clamp-2 leading-relaxed">
                        {result.excerpt}
                      </p>
                    </button>
                  ))}
                  {!query.trim() && (
                    <p className="type-meta px-5 py-8">
                      Essays, books, questions, field notes.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
