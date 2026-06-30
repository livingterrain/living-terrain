import Link from "next/link";
import { cn } from "@/lib/utils";

export type ConnectionKind = "connects" | "continues" | "explore" | "thread";

export interface ConnectionItem {
  href: string;
  title: string;
  subtitle?: string;
  external?: boolean;
}

interface ConnectionWebProps {
  kind: ConnectionKind;
  items: ConnectionItem[];
  className?: string;
  /** Override the default relational phrase */
  label?: string;
}

const kindLabels: Record<ConnectionKind, string> = {
  connects: "This idea connects to",
  continues: "This path continues through",
  explore: "You may also want to explore",
  thread: "Follow this thread",
};

export function ConnectionWeb({
  kind,
  items,
  className,
  label,
}: ConnectionWebProps) {
  if (items.length === 0) return null;

  const phrase = label ?? kindLabels[kind];

  return (
    <nav
      className={cn("border-t border-rule/50 pt-10", className)}
      aria-label={phrase}
    >
      <p className="type-folio">{phrase}…</p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <ConnectionLink item={item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ConnectionLink({ item }: { item: ConnectionItem }) {
  const classes =
    "group block py-1 transition-colors duration-700 hover:text-forest";

  const content = (
    <>
      <span className="font-heading text-lg text-charcoal transition-colors duration-700 group-hover:text-forest">
        {item.title}
      </span>
      {item.subtitle && (
        <span className="type-body mt-1 block text-[0.875rem] text-charcoal-faint">
          {item.subtitle}
        </span>
      )}
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={classes}>
      {content}
    </Link>
  );
}
