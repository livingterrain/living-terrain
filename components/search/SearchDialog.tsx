"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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

interface SearchDialogProps {
  /** Map sky — dark glass and bond-language, not catalog UI */
  variant?: "site" | "map";
}

export function SearchDialog({ variant = "site" }: SearchDialogProps) {
  const isMap = variant === "map";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchResult[] | null>(null);
  const { navigate } = useTerrainNavigation();

  useEffect(() => {
    if (!open || index !== null) return;
    setIndex(buildSearchIndex());
  }, [open, index]);

  const searchIndex = index ?? [];

  const results = useMemo(
    () =>
      query.trim()
        ? searchIndex.filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.excerpt.toLowerCase().includes(query.toLowerCase()),
          )
        : [],
    [query, searchIndex],
  );

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
        className={
          isMap
            ? "font-heading text-[0.75rem] tracking-[0.06em] text-ivory/42 transition-colors duration-700 hover:text-ivory/68 active:text-ivory/80"
            : "type-meta text-charcoal-muted transition-colors duration-500 hover:text-forest active:text-forest/80"
        }
        aria-label={
          isMap ? "Trace a thread through the terrain" : "Search the terrain"
        }
      >
        {isMap ? "Trace" : "Search"}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.45, 0.05, 0.55, 0.95] }}
              className={
                isMap
                  ? "fixed inset-0 z-50 bg-[#040608]/72 backdrop-blur-[2px]"
                  : "fixed inset-0 z-50 bg-charcoal/[0.06]"
              }
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.45, 0.05, 0.55, 0.95] }}
              className="fixed z-50 w-[calc(100%-2rem)] max-w-lg left-1/2 -translate-x-1/2"
              style={{
                top: "max(1.25rem, env(safe-area-inset-top))",
              }}
            >
              <div
                className={
                  isMap
                    ? "border border-ivory/12 bg-[color-mix(in_srgb,#06080c_94%,transparent)] shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-md"
                    : "border border-rule bg-ivory"
                }
              >
                <div
                  className={
                    isMap ? "border-b border-ivory/10 px-5" : "border-b border-rule px-5"
                  }
                >
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      isMap
                        ? "Name what you are looking for…"
                        : "Search the terrain"
                    }
                    className={
                      isMap
                        ? "w-full bg-transparent py-5 font-body text-sm text-ivory/78 placeholder:text-ivory/28 focus:outline-none"
                        : "w-full bg-transparent py-5 font-body text-sm text-charcoal placeholder:text-charcoal-faint focus:outline-none"
                    }
                  />
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {query.trim() && results.length === 0 && (
                    <p
                      className={
                        isMap
                          ? "px-5 py-8 text-sm italic text-ivory/36"
                          : "type-meta px-5 py-8"
                      }
                    >
                      {isMap
                        ? "No thread found — try a nearby word."
                        : "No entries found."}
                    </p>
                  )}
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => go(result.href)}
                      className={cn(
                        "w-full px-5 py-4 text-left touch-manipulation min-h-[3.25rem]",
                        isMap
                          ? "border-b border-ivory/8 transition-colors duration-500 hover:bg-ivory/[0.04] active:bg-ivory/[0.06]"
                          : "border-b border-rule/60 transition-colors duration-[600ms] hover:bg-ivory-deep/40 active:bg-ivory-deep/50",
                      )}
                    >
                      {!isMap && <p className="type-folio">{typeLabels[result.type]}</p>}
                      <p
                        className={cn(
                          "font-heading text-base",
                          isMap ? "text-ivory/76" : "mt-1.5 text-charcoal",
                        )}
                      >
                        {result.title}
                      </p>
                      <p
                        className={cn(
                          "mt-1.5 line-clamp-2 text-sm leading-relaxed",
                          isMap ? "italic text-ivory/36" : "type-meta",
                        )}
                      >
                        {result.excerpt}
                      </p>
                    </button>
                  ))}
                  {!query.trim() && (
                    <p
                      className={
                        isMap
                          ? "px-5 py-8 text-sm italic leading-relaxed text-ivory/32"
                          : "type-meta px-5 py-8"
                      }
                    >
                      {isMap
                        ? "Essays, volumes, questions, field notes — trace a bond."
                        : "Essays, books, questions, field notes."}
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
