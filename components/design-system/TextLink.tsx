import Link from "next/link";
import { cn } from "@/lib/utils";

interface TextLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  muted?: boolean;
}

export function TextLink({
  href,
  children,
  className,
  external,
  muted,
}: TextLinkProps) {
  const classes = cn(
    "font-body text-sm underline-offset-[5px]",
    "transition-[color,text-decoration-color] duration-500",
    muted
      ? "text-charcoal-muted decoration-charcoal/15 underline hover:text-forest hover:decoration-forest/40"
      : "text-forest decoration-forest/25 underline hover:text-forest-muted hover:decoration-forest/50",
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
