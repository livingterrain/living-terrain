import Link from "next/link";
import type { AtlasArchiveEntry } from "@/lib/atlas/archive";

type Props = {
  entry: AtlasArchiveEntry;
};

/**
 * One finding-aid row — archival metadata, not a UI badge or card.
 */
export function AtlasEntryRow({ entry }: Props) {
  return (
    <li className="border-t border-rule/25 py-7 first:border-t-0 first:pt-0 last:pb-0">
      <Link
        href={entry.href}
        className="group block"
        data-atlas-kind={entry.kind}
        data-atlas-status={entry.status}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="font-heading text-lg leading-snug text-charcoal transition-colors duration-[1.4s] group-hover:text-gold-muted sm:text-xl">
            {entry.title}
          </h3>
          <p className="type-chamber shrink-0 text-charcoal-faint">
            {entry.status}
          </p>
        </div>
        <p className="type-body mt-2 max-w-xl text-[0.9375rem] text-charcoal-muted">
          {entry.description}
        </p>
      </Link>
    </li>
  );
}
