import { TextLink } from "@/components/design-system";
import { siteConfig } from "@/lib/content/data";
import { cn } from "@/lib/utils";

interface PublicationLinkProps {
  className?: string;
  prominent?: boolean;
}

export function PublicationLink({
  className,
  prominent,
}: PublicationLinkProps) {
  if (prominent) {
    return (
      <a
        href={siteConfig.substackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-block border border-rule/50 bg-[color-mix(in_srgb,#0c101a_78%,transparent)] px-8 py-4 font-body text-sm text-ivory/88 transition-[border-color,background-color,color] duration-700 hover:border-gold/35 hover:bg-[color-mix(in_srgb,#101620_88%,transparent)] hover:text-gold",
          className,
        )}
      >
        Read Essays on Substack
      </a>
    );
  }

  return (
    <TextLink href={siteConfig.substackUrl} external className={className}>
      Read Essays on Substack
    </TextLink>
  );
}
