import type { ReactNode } from "react";

/** Concepts use full-viewport overlays — suppress default page chrome feel */
export default function ConceptsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
