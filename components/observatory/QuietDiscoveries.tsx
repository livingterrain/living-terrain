import Link from "next/link";
import type { QuietDiscovery } from "@/lib/observatory/types";

interface QuietDiscoveriesProps {
  discoveries: QuietDiscovery[];
}

export function QuietDiscoveries({ discoveries }: QuietDiscoveriesProps) {
  if (!discoveries.length) return null;

  return (
    <section aria-labelledby="quiet-discoveries" className="mt-20 border-t border-rule/35 pt-16">
      <h2 id="quiet-discoveries" className="type-folio">
        Quiet Discoveries
      </h2>
      <p className="type-body mt-3 max-w-xl text-[0.9375rem] text-charcoal-muted">
        Where a visitor&apos;s observation brushes against something already on
        the terrain — noticed, not recommended.
      </p>
      <ul className="mt-10 space-y-8">
        {discoveries.map((discovery) => (
          <li key={discovery.id}>
            <p className="type-body text-[0.875rem] leading-relaxed text-charcoal-faint">
              {discovery.phrase}
            </p>
            <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:gap-6">
              <Link
                href={`/observatory/observations/${discovery.observation.slug}`}
                className="text-[0.8125rem] text-charcoal transition-colors duration-700 hover:text-forest"
              >
                The observation →
              </Link>
              <Link
                href={discovery.connectedHref}
                className="text-[0.8125rem] text-charcoal transition-colors duration-700 hover:text-forest"
              >
                {discovery.connectedTitle} →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
