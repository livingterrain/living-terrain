import type { Metadata } from "next";
import Link from "next/link";
import { concepts } from "@/lib/concepts";

export const metadata: Metadata = {
  title: "Homepage Concepts",
  description:
    "Five radical prototypes for Living Terrain — explorations of curiosity, discovery, and relationship.",
};

const conceptColors: Record<string, string> = {
  constellation: "from-[#1a2332] to-[#08090c]",
  drawers: "from-[#2a2218] to-[#1a1510]",
  notebook: "from-[#f4f0e6] to-[#e8e0d0]",
  mycelium: "from-[#1a2e22] to-[#0a120e]",
  field: "from-[#e8e2d6] to-[#d4ccc0]",
};

const conceptText: Record<string, string> = {
  constellation: "text-ivory",
  drawers: "text-[#e8dcc8]",
  notebook: "text-[#2a2824]",
  mycelium: "text-[#e8f0e8]",
  field: "text-[#2a2824]",
};

export default function ConceptsPage() {
  return (
    <div className="min-h-screen bg-[#08090c] text-ivory">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="text-[0.6875rem] uppercase tracking-[0.2em] text-ivory/40 hover:text-ivory/70"
        >
          ← Current homepage (unchanged)
        </Link>

        <h1 className="mt-10 font-heading text-4xl sm:text-5xl">
          Five doors into Living Terrain
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ivory/55">
          Not refinements — radical prototypes. Each one tries to answer: how does
          a visitor know, in the first three seconds, that they have entered a
          living intellectual world?
        </p>
        <p className="mt-4 text-sm text-ivory/35">
          The constellation concept is now the live homepage at{" "}
          <Link href="/" className="text-forest-light hover:underline">
            /
          </Link>
          . The other four remain prototypes to revisit later.
        </p>

        <ol className="mt-16 space-y-8">
          {concepts.map((concept, index) => (
            <li key={concept.slug}>
              <Link
                href={`/concepts/${concept.slug}`}
                className="group block overflow-hidden border border-white/10 transition-colors hover:border-white/25"
              >
                <div
                  className={`bg-gradient-to-br ${conceptColors[concept.slug]} p-8 sm:p-10`}
                >
                  <p
                    className={`text-[0.625rem] uppercase tracking-[0.25em] opacity-50 ${conceptText[concept.slug]}`}
                  >
                    Concept {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2
                    className={`mt-3 font-heading text-2xl sm:text-3xl ${conceptText[concept.slug]}`}
                  >
                    {concept.title}
                  </h2>
                  <p
                    className={`mt-2 text-lg opacity-80 ${conceptText[concept.slug]}`}
                  >
                    {concept.tagline}
                  </p>
                </div>
                <div className="border-t border-white/10 bg-[#0d1014] p-6 sm:p-8">
                  <p className="text-sm text-ivory/50">{concept.philosophy}</p>
                  <p className="mt-3 text-[0.8125rem] text-forest-light">
                    {concept.interaction}
                  </p>
                  <span className="mt-6 inline-block text-[0.6875rem] uppercase tracking-[0.15em] text-ivory/40 group-hover:text-ivory/70">
                    Enter prototype →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
