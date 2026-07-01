import Link from "next/link";
import { PathwayLink } from "@/components/design-system/threshold";
import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="world-edge mt-auto">
      <Container className="py-28 sm:py-32">
        <p className="mx-auto max-w-md text-center font-heading text-lg italic leading-[1.75] text-charcoal-muted/75">
          You are still walking. The place does not end here.
        </p>

        <nav
          className="mx-auto mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-4"
          aria-label="Horizons"
        >
          <PathwayLink href="/questions" className="min-h-11 justify-center py-2 text-sm">
            Where paths branch
          </PathwayLink>
          <PathwayLink href="/observatory" className="min-h-11 justify-center py-2 text-sm">
            Inward
          </PathwayLink>
          <PathwayLink href="/" className="min-h-11 justify-center py-2 text-sm">
            Outward
          </PathwayLink>
        </nav>

        <div className="threshold-carved threshold-carved--edge mx-auto mt-16 max-w-xs opacity-60" />

        <p className="mt-12 text-center type-meta text-charcoal-faint/80">
          © {new Date().getFullYear()} ·{" "}
          <Link
            href="/welcome"
            className="inline-flex min-h-11 items-center justify-center px-2 transition-colors duration-[2000ms] hover:text-charcoal-muted active:text-charcoal-muted"
          >
            The threshold
          </Link>
        </p>
      </Container>
    </footer>
  );
}
