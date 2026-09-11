import type { Metadata } from "next";
import { withCanonical } from "@/lib/seo";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
export const metadata: Metadata = withCanonical("/join", { title: "Join Living Terrain", description: "New essays, observations, and field notes delivered as the work develops." });
export default function JoinPage() {
  return <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28"><h1 className="sr-only">Join Living Terrain</h1><NewsletterSignup variant="join" /></div>;
}
