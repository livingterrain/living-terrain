import { SiteChrome } from "@/components/layout/SiteChrome";
import { ThreadProvider } from "@/components/thread";
import { SoundNavigationBridge } from "@/components/sound";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThreadProvider>
      <SoundNavigationBridge />
      <SiteChrome>{children}</SiteChrome>
    </ThreadProvider>
  );
}
