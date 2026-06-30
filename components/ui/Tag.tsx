import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block font-body text-xs tracking-widest uppercase text-ink-faint",
        className,
      )}
    >
      {children}
    </span>
  );
}
