import { cn } from "@/lib/utils";

interface StructuralGridProps {
  className?: string;
}

/**
 * Quiet survey geometry — structural, not symbolic.
 * Faint margins and grid like a field map or archive plate.
 */
export function StructuralGrid({ className }: StructuralGridProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Vertical margin lines */}
        <line
          x1="12%"
          y1="0"
          x2="12%"
          y2="100%"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-rule/50"
        />
        <line
          x1="88%"
          y1="0"
          x2="88%"
          y2="100%"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-rule/50"
        />
        {/* Horizontal intervals — rhythm, not decoration */}
        <line
          x1="0"
          y1="38%"
          x2="100%"
          y2="38%"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-rule/35"
        />
        <line
          x1="0"
          y1="72%"
          x2="100%"
          y2="72%"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-rule/25"
        />
      </svg>
    </div>
  );
}
