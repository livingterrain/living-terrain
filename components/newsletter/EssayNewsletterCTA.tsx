import { NewsletterSignup } from "./NewsletterSignup";
export function EssayNewsletterCTA({ hasFullEssay = true }: { hasFullEssay?: boolean }) {
  return <div className="mt-16">
    <NewsletterSignup variant={hasFullEssay ? "essay" : "excerpt"} />
  </div>;
}
