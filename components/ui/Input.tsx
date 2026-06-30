import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full border border-border bg-cream px-4 py-3 font-body text-sm text-ink",
        "placeholder:text-ink-faint",
        "transition-colors duration-300",
        "focus:border-ink-muted focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
