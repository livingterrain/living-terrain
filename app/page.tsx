import { Suspense } from "react";
import { ThresholdWorld } from "@/components/home";

function HomeFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#06080c]">
      <p className="type-chamber text-ivory/25">Threshold</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <ThresholdWorld />
    </Suspense>
  );
}
