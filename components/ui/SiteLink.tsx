import Link from "next/link";
import { cn } from "@/lib/utils";

interface SiteLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
}

export function SiteLink({ href, children, className, muted }: SiteLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "underline-offset-4 transition-colors duration-300 hover:underline",
        muted
          ? "text-ink-muted hover:text-ink"
          : "text-accent hover:text-accent-light",
        className,
      )}
    >
      {children}
    </Link>
  );
}
