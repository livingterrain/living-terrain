import type { Metadata } from "next";
import { ConceptualMap } from "@/components/atlas-map/ConceptualMap";

export const metadata: Metadata = {
  title: "Atlas · Begin an Investigation",
  description:
    "A living index of interconnected ideas — a research tool for inquiry, not a library.",
  robots: { index: false, follow: false },
};

/**
 * Atlas prototype: investigation first.
 * Graph is a research tool inside an inquiry — never the opening screen.
 */
export default function AtlasMapPrototypePage() {
  return (
    <div className="atlas-map-realm">
      <ConceptualMap />
    </div>
  );
}
