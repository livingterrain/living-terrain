import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

/** Catalog mark — folio reference, not a UI badge */
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p className={cn("type-folio", className)}>
      {children}
    </p>
  );
}
