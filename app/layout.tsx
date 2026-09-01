import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { TerrainSoundProvider } from "@/components/sound";
import { TerrainNavigationProvider } from "@/components/navigation";
import { ObservatoryProvider } from "@/components/observatory";
import { CircadianRoot } from "@/components/atmosphere/CircadianRoot";
import { PersistentTerrainAtmosphere } from "@/components/atmosphere/PersistentTerrainAtmosphere";
import { TerrainContentShell } from "@/components/atmosphere/TerrainContentShell";
import { siteConfig } from "@/lib/content/data";
import "./globals.css";
/* Revertible spectral/life layer — delete this import + app/v2-life.css to roll back */
import "./v2-life.css";
/* Architecture pass: Menu + location whisper + Atlas root territories */
import "./orientation.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${inter.variable}`}>
      <body
        className="min-h-screen bg-[#030405] antialiased text-ivory"
        style={{ backgroundColor: "#030405", color: "#ebe6dc" }}
      >
        <TerrainSoundProvider>
          <TerrainNavigationProvider>
            <ObservatoryProvider>
              <CircadianRoot />
              <PersistentTerrainAtmosphere />
              <TerrainContentShell>{children}</TerrainContentShell>
            </ObservatoryProvider>
          </TerrainNavigationProvider>
        </TerrainSoundProvider>
      </body>
    </html>
  );
}
