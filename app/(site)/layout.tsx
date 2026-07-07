import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThreadProvider } from "@/components/thread";
import { SoundNavigationBridge, SoundMuteControl } from "@/components/sound";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThreadProvider>
      <SoundNavigationBridge />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <SoundMuteControl
        className="text-charcoal-faint/70 hover:text-charcoal-muted max-md:!bottom-auto max-md:!top-[max(0.75rem,env(safe-area-inset-top))] max-md:!right-3"
        iconOnly
      />
    </ThreadProvider>
  );
}
