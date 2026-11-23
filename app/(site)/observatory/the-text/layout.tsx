import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notoSerifGreek, notoSerifHebrew } from "@/app/fonts/load";

export const metadata: Metadata = {
  title: "The Text",
  description:
    "What survives translation? Look beneath the English at words, grammar, and interpretive choices.",
};

export default function TheTextLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`obs-text-root ${notoSerifHebrew.variable} ${notoSerifGreek.variable}`}
    >
      {children}
    </div>
  );
}
