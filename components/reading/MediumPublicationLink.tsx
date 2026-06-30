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
          "inline-block border border-rule/70 bg-ivory/50 px-8 py-4 font-body text-sm text-charcoal transition-[border-color,background-color,color] duration-700 hover:border-forest/30 hover:bg-ivory/80 hover:text-forest",
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
