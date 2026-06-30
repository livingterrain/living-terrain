import { cn } from "@/lib/utils";

/** Topographic wave for section dividers only */
export function TopoMotif({ className }: { className?: string }) {
  return (
    <svg
      className={cn("text-rule", className)}
      viewBox="0 0 200 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        stroke="currentColor"
        strokeWidth="0.75"
        d="M0 8 C25 3, 50 13, 75 8 S125 3, 150 8 S175 13, 200 8"
      />
      <path
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.6"
        d="M0 11 C30 6, 60 14, 100 10 S160 6, 200 11"
      />
    </svg>
  );
}
