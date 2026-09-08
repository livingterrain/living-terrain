import type { Metadata } from "next";
import { Noto_Serif, Noto_Serif_Hebrew } from "next/font/google";
import type { ReactNode } from "react";

const notoSerifHebrew = Noto_Serif_Hebrew({
  subsets: ["hebrew"],
  variable: "--font-noto-serif-hebrew",
  display: "swap",
  weight: ["400", "500", "600"],
});

const notoSerifGreek = Noto_Serif({
  subsets: ["greek", "latin"],
  variable: "--font-noto-serif-greek",
  display: "swap",
  weight: ["400", "500", "600"],
});

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
