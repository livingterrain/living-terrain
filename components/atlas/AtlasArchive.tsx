import Link from "next/link";
import { ATLAS_DOMAINS } from "@/lib/atlas/archive";
import { AtlasArrival } from "./AtlasArrival";
import { AtlasDomainSection } from "./AtlasDomainSection";

/**
 * Editorial archive landing for The Atlas —
 * finding aid · research index · conceptual map.
 */
export function AtlasArchive() {
  return (
    <article>
      <AtlasArrival />

      <nav
        aria-label="Domains of inquiry"
        className="px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16"
      >
        <div className="mx-auto max-w-3xl">
          <p className="type-chamber mb-6">Contents</p>
          <ol className="columns-1 gap-x-12 sm:columns-2">
            {ATLAS_DOMAINS.map((domain, i) => (
              <li key={domain.id} className="mb-2 break-inside-avoid">
                <a
                  href={`#domain-${domain.id}`}
                  className="group inline-flex items-baseline gap-3 type-meta transition-colors duration-[1.4s] hover:text-charcoal-muted"
                >
                  <span className="type-folio w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-[0.9375rem] italic text-charcoal-muted group-hover:text-charcoal">
                    {domain.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 pb-36 sm:px-10 sm:pb-48 lg:px-16">
        <div className="space-y-28 sm:space-y-36">
          {ATLAS_DOMAINS.map((domain, index) => (
            <AtlasDomainSection
              key={domain.id}
              domain={domain}
              index={index}
            />
          ))}
        </div>

        <footer className="mt-32 border-t border-rule/30 pt-12 sm:mt-40">
          <p className="type-chamber">Continuations</p>
          <p className="type-body mt-5 max-w-md text-[0.9375rem]">
            Return to{" "}
            <Link
              href="/atlas"
              className="text-charcoal-muted underline decoration-rule/40 underline-offset-4 transition-colors duration-[1.4s] hover:text-charcoal"
            >
              The Atlas
            </Link>{" "}
            to enter through a living question — or follow any plate into its
            chamber, essay, or theme.
          </p>
        </footer>
      </div>
    </article>
  );
}
