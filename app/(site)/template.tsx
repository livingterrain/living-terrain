import { SiteTransition } from "@/components/atmosphere";

export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteTransition>{children}</SiteTransition>;
}
