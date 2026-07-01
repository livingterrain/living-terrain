import type { Metadata } from "next";
import { Suspense } from "react";
import { WelcomePage } from "@/components/welcome/WelcomePage";

export const metadata: Metadata = {
  title: "Welcome",
  description:
    "A quiet threshold into Living Terrain — an observatory for ideas, relationships, and the hidden structures beneath reality.",
};

function WelcomeFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#040506]">
      <p className="font-body text-[0.6875rem] uppercase tracking-[0.2em] text-ivory/25">
        Welcome
      </p>
    </div>
  );
}

export default function WelcomeRoute() {
  return (
    <Suspense fallback={<WelcomeFallback />}>
      <WelcomePage />
    </Suspense>
  );
}
