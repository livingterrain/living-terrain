import { Suspense } from "react";
import { HomeV2 } from "@/components/home/HomeV2";

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
