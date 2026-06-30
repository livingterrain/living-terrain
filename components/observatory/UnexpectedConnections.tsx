import Link from "next/link";
import type { UnexpectedConnection } from "@/lib/observatory/types";

interface UnexpectedConnectionsProps {
  connections: UnexpectedConnection[];
}

export function UnexpectedConnections({ connections }: UnexpectedConnectionsProps) {
  if (!connections.length) return null;

  return (
    <section aria-labelledby="unexpected-connections" className="mt-20 border-t border-rule/35 pt-16">
      <h2 id="unexpected-connections" className="type-folio">
        Unexpected Connections
      </h2>
      <p className="type-body mt-3 max-w-xl text-[0.9375rem] text-charcoal-muted">
        Patterns that emerge when observations from different places in the
        terrain converge on the same concept.
      </p>
      <ul className="mt-10 space-y-8">
        {connections.map((connection) => (
          <li key={connection.id}>
            <p className="type-body text-[0.9375rem] italic text-charcoal-muted">
              {connection.phrase}
            </p>
            <div className="mt-4 space-y-2">
              <Link
                href={`/observatory/observations/${connection.observationA.slug}`}
                className="block font-heading text-base text-charcoal transition-colors duration-700 hover:text-forest"
              >
                {connection.observationA.title ??
                  connection.observationA.body.slice(0, 60)}
              </Link>
              <Link
                href={`/observatory/observations/${connection.observationB.slug}`}
                className="block font-heading text-base text-charcoal transition-colors duration-700 hover:text-forest"
              >
                {connection.observationB.title ??
                  connection.observationB.body.slice(0, 60)}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
