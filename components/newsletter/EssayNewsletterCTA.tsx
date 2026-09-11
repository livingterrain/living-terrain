import Link from "next/link";
import { NewsletterSignup } from "./NewsletterSignup";
export function EssayNewsletterCTA({ hasFullEssay = true }: { hasFullEssay?: boolean }) {
  return <div className="mt-16">
    <NewsletterSignup variant={hasFullEssay ? "essay" : "excerpt"} />
    <Link href="/atlas" className="lantern-link inline-flex min-h-11 items-center mt-6">Continue exploring →</Link>
  </div>;
}
