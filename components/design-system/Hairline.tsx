import { cn } from "@/lib/utils";
import { TopoMotif } from "./TopoMotif";

interface HairlineProps {
  className?: string;
  fade?: boolean;
  /** Centered topographic motif between rules */
  motif?: boolean;
}

export function Hairline({ className, fade, motif }: HairlineProps) {
  if (motif) {
    return (
      <div
        className={cn("relative flex items-center justify-center py-2", className)}
        aria-hidden="true"
      >
        <div className={cn("absolute inset-x-0 top-1/2 -translate-y-1/2", fade ? "hairline-fade" : "hairline")} />
        <TopoMotif className="relative h-4 w-40 sm:w-52" />
      </div>
    );
  }

  return (
    <div className={cn(fade ? "hairline-fade" : "hairline", className)} />
  );
}
