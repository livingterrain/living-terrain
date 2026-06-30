import Link from "next/link";
import type { ReactNode } from "react";

interface ConceptShellProps {
  children: ReactNode;
  title: string;
  hint?: string;
}

/** Full-viewport prototype chrome — does not touch the main homepage */
export function ConceptShell({ children, title, hint }: ConceptShellProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#08090c] text-ivory">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate font-heading text-sm text-ivory/90 sm:text-base">
            {title}
          </p>
          {hint && (
            <p className="truncate text-[0.6875rem] tracking-wide text-ivory/45">
              {hint}
            </p>
          )}
        </div>
        <nav className="flex shrink-0 items-center gap-4 text-[0.6875rem] uppercase tracking-[0.15em]">
          <Link
            href="/concepts"
            className="text-ivory/50 transition-colors hover:text-ivory"
          >
            All concepts
          </Link>
          <Link
            href="/"
            className="text-forest-light transition-colors hover:text-ivory"
          >
            Current home
          </Link>
        </nav>
      </header>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
