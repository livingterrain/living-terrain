import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <section className="py-32 sm:py-40">
      <Container narrow className="text-center">
        <p className="type-chamber">404</p>
        <h1 className="mt-4 type-display text-charcoal">Page not found</h1>
        <p className="type-body mt-4 text-[0.9375rem]">
          This path leads nowhere — yet.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block type-body text-sm text-forest hover:text-forest-light"
        >
          Return to the threshold →
        </Link>
      </Container>
    </section>
  );
}
