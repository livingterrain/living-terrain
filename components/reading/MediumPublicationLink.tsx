import { TextLink } from "@/components/design-system";
import { siteConfig } from "@/lib/content/data";
import { cn } from "@/lib/utils";

interface MediumPublicationLinkProps {
  className?: string;
  prominent?: boolean;
}

export function MediumPublicationLink({
  className,
  prominent,
}: MediumPublicationLinkProps) {
  if (prominent) {
    return (
      <a
        href={siteConfig.mediumUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-block border border-rule/50 bg-[color-mix(in_srgb,#0c101a_78%,transparent)] px-8 py-4 font-body text-sm text-ivory/88 transition-[border-color,background-color,color] duration-700 hover:border-gold/35 hover:bg-[color-mix(in_srgb,#101620_88%,transparent)] hover:text-gold",
          className,
        )}
      >
        Read Essays on Medium
      </a>
    );
  }

  return (
    <TextLink href={siteConfig.mediumUrl} external className={className}>
      Read Essays on Medium
    </TextLink>
  );
}
