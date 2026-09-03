"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { TerrainOrientation } from "@/components/layout/TerrainOrientation";
import { SoundMuteControl } from "@/components/sound";

/**
 * Site chrome — TerrainOrientation (Living Terrain + Menu) is the global shell.
 * Legacy Footer / pathway horizons are not rendered.
 * Atlas stays full-bleed with bare orientation.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const atlasJourney = pathname === "/atlas" || pathname === "/atlas/";
  const bare = atlasJourney;

  return (
    <>
      <div className="relative z-10 flex min-h-screen flex-col">
        {!bare && <Header />}
        <main className="flex-1">{children}</main>
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
