import type { Metadata } from "next";
import { withCanonical } from "@/lib/seo";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
export const metadata: Metadata = withCanonical("/join", { title: "Follow Living Terrain on Substack", description: "Essays are published first on Substack. Subscribe there for new essays and field notes as the work develops." });
export default function JoinPage() {
  return <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28"><h1 className="sr-only">Follow Living Terrain on Substack</h1><NewsletterSignup variant="join" /></div>;
}
