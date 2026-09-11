import type { Metadata } from "next";
import { withCanonical } from "@/lib/seo";
import { SearchPageClient } from "@/components/search/SearchPageClient";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = withCanonical("/search", {
  robots: { index: false, follow: false },
  title: "Search",
  description: "Search essays, books, questions, and field notes across Living Terrain.",
});

export default function SearchPage() {
  return (
    <>
      <PageHeader
        label="Discover"
        title="Search"
        description="Search across all writing — essays, books, questions, and field notes."
      />
      <SearchPageClient />
    </>
  );
}
