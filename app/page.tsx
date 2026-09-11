import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeV2 } from "@/components/home/HomeV2";
import { siteConfig } from "@/lib/content/data";
import { withCanonical } from "@/lib/seo";

export const metadata: Metadata = withCanonical("/", {
  title: siteConfig.title,
  description: siteConfig.description,
});

function HomeFallback() {
  return <div className="fixed inset-0 bg-[#030405]" aria-hidden />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeV2 />
    </Suspense>
  );
}
