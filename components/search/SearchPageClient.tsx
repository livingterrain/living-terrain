"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { searchContent } from "@/lib/content";
import type { SearchResult } from "@/lib/content/types";

const typeLabels: Record<SearchResult["type"], string> = {
  essay: "Essay",
  book: "Book",
  question: "Question",
  "field-note": "Field Note",
  theme: "Theme",
  quotation: "Quotation",
  observation: "Observation",
};

export function SearchPageClient() {
  const [query, setQuery] = useState("");
  const results = searchContent(query);

  return (
    <section className="py-16 sm:py-24">
      <Container narrow>
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search essays, books, questions, field notes…"
          autoFocus
          aria-label="Search"
        />

        <div className="mt-10">
          {query.trim() && results.length === 0 && (
            <p className="font-body text-sm text-ink-faint">No results found.</p>
          )}

          {!query.trim() && (
            <p className="font-body text-sm text-ink-faint">
              Begin typing to search. You can also press ⌘K from anywhere on the
              site.
            </p>
          )}

          <ul className="mt-6 divide-y divide-border">
            {results.map((result) => (
              <li key={result.id}>
                <Link
                  href={result.href}
                  className="block py-6 transition-colors duration-300 hover:bg-cream-dark/50 hover:px-4"
                >
                  <Tag>{typeLabels[result.type]}</Tag>
                  <p className="mt-2 font-heading text-lg text-ink">
                    {result.title}
                  </p>
                  <p className="mt-2 font-body text-sm text-ink-muted">
                    {result.excerpt}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
