import { Suspense } from "react";
import { ThresholdWorld } from "@/components/home";

function HomeFallback() {
  return <div className="fixed inset-0 bg-[#06080c]" aria-hidden />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <ThresholdWorld />
    </Suspense>
  );
}
