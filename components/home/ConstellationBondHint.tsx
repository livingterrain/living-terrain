import type { GraphNode } from "@/lib/concepts/graph";

export function ConstellationBondHint({
  neighbors,
  className,
}: {
  neighbors: GraphNode[];
  className?: string;
}) {
  if (neighbors.length === 0) return null;

  return (
    <p className={className}>
      <span className="type-chamber text-[0.5rem] tracking-[0.14em] text-ivory/22">
        Near
      </span>
      <span className="mt-1.5 block font-heading text-[0.75rem] leading-relaxed text-ivory/38">
        {neighbors.map((n) => n.label).join(" · ")}
      </span>
    </p>
  );
}
