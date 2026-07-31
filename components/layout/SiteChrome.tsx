"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SoundMuteControl } from "@/components/sound";

/**
 * Site chrome — hidden on the Atlas journey so the corpus experience is full-bleed.
 * Mute remains available even on bare Atlas.
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
        {!bare && <Footer />}
      </div>
      <SoundMuteControl
        className="text-charcoal-faint/70 hover:text-charcoal-muted max-md:!bottom-auto max-md:!top-[max(0.75rem,env(safe-area-inset-top))] max-md:!right-3"
        iconOnly
        hideOnHome
      />
    </>
  );
}
