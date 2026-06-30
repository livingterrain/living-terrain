import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Hairline } from "@/components/design-system";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-rule bg-ivory-deep/50">
      <Container className="py-20 sm:py-24">
        <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-heading text-lg text-charcoal">Living Terrain</p>
            <p className="type-body mt-4 max-w-sm text-[0.9375rem]">
              A place for inquiry — between museum, library, field notebook, and
              reading room.
            </p>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <p className="type-folio">Explore</p>
            <nav className="mt-5 flex flex-col gap-3">
              <FooterLink href="/questions">Questions</FooterLink>
              <FooterLink href="/essays">Essays</FooterLink>
              <FooterLink href="/library">Library</FooterLink>
              <FooterLink href="/field-notes">Field Notes</FooterLink>
            </nav>
          </div>

          <div className="lg:col-span-3">
            <p className="type-folio">Further</p>
            <nav className="mt-5 flex flex-col gap-3">
              <FooterLink href="/structure-beneath-reality">
                The Structure Beneath Reality
              </FooterLink>
              <FooterLink href="/observatory">Observatory</FooterLink>
              <FooterLink href="/about">About</FooterLink>
            </nav>
          </div>
        </div>

        <Hairline fade className="my-16" />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="type-meta">
            © {new Date().getFullYear()} Living Terrain
          </p>
          <p className="type-meta">livingterrain.com</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-body text-sm text-charcoal-muted transition-colors duration-500 hover:text-charcoal"
    >
      {children}
    </Link>
  );
}
