import localFont from "next/font/local";

/**
 * Self-hosted OFL fonts for build-time loading.
 * Avoids next/font/google crashes on extensionless Google Font URLs
 * (Next 15.5 / vercel/next.js#99114). CSS variable names preserved.
 */

export const sourceSerif = localFont({
  src: "./SourceSerif4-latin-variable.woff2",
  variable: "--font-source-serif",
  display: "swap",
  weight: "200 900",
});

export const inter = localFont({
  src: "./Inter-latin-variable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

/** Noto Serif — latin + greek for Observatory The Text */
export const notoSerifGreek = localFont({
  src: [
    {
      path: "./NotoSerif-latin-variable.woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "./NotoSerif-greek-variable.woff2",
      weight: "200 900",
      style: "normal",
    },
  ],
  variable: "--font-noto-serif-greek",
  display: "swap",
});

/** Noto Serif Hebrew — for Observatory The Text */
export const notoSerifHebrew = localFont({
  src: "./NotoSerifHebrew-hebrew-variable.woff2",
  variable: "--font-noto-serif-hebrew",
  display: "swap",
  weight: "100 900",
});
