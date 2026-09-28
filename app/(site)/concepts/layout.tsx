import type { Metadata } from "next";
import type { ReactNode } from "react";

/** Prototype instruments — kept for development, never indexed. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Concepts use full-viewport overlays — suppress default page chrome feel */
export default function ConceptsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
