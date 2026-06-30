import { cn } from "@/lib/utils";
import { SectionLabel } from "./SectionLabel";
import { TextLink } from "./TextLink";

interface SectionIntroProps {
  label: string;
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
  className?: string;
}

export function SectionIntro({
  label,
  title,
  description,
  href,
  linkText,
  className,
}: SectionIntroProps) {
  return (
    <header className={cn("max-w-2xl", className)}>
      <SectionLabel>{label}</SectionLabel>
      <h2 className="type-room mt-5 text-charcoal">{title}</h2>
      {description && (
        <p className="type-body mt-6 max-w-xl">{description}</p>
      )}
      {href && linkText && (
        <TextLink href={href} className="mt-8 inline-block">
          {linkText}
        </TextLink>
      )}
    </header>
  );
}
