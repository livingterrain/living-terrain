"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TerrainOrientation } from "@/components/layout/TerrainOrientation";
import { SoundMuteControl } from "@/components/sound";

/**
 * Site chrome — Header/Footer ordinarily wrap the world.
 * Atlas stays full-bleed; TerrainOrientation (Living Terrain + Menu) remains
 * so the room is never trapped behind cryptic ··· chrome.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const atlasJourney = pathname === "/atlas" || pathname === "/atlas/";
  const homeField = pathname === "/" || pathname === "";
  const bare = atlasJourney;
  const hideFooter = bare || homeField;

  return (
    <>
      <div className="relative z-10 flex min-h-screen flex-col">
        {!bare && <Header />}
        <main className="flex-1">{children}</main>
        {!hideFooter && <Footer />}
      </div>
      {bare && <TerrainOrientation bare />}
      <SoundMuteControl
        className="text-charcoal-faint/70 hover:text-charcoal-muted max-md:!bottom-auto max-md:!top-[max(0.75rem,env(safe-area-inset-top))] max-md:!right-3"
        iconOnly
        hideOnHome
      />
    </>
  );
}
