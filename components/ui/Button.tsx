import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-6 py-2.5 font-body text-sm tracking-wide transition-all duration-300",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-ink text-cream hover:bg-ink-muted",
        variant === "secondary" &&
          "border border-border bg-transparent text-ink hover:border-ink-muted hover:bg-cream-dark",
        variant === "ghost" &&
          "text-ink-muted hover:text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
