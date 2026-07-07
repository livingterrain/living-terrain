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
      ? "text-charcoal-muted decoration-charcoal-faint/40 underline hover:text-gold hover:decoration-gold/50"
      : "text-gold-muted decoration-gold/30 underline hover:text-gold hover:decoration-gold/55",
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
