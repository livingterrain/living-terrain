import { TerrainLink } from "@/components/navigation";
import { countConnectedIdeas } from "@/lib/relationships/connection-count";
import type { NodeRef } from "@/lib/relationships";
import { cn } from "@/lib/utils";

interface TerrainConnectionInviteProps {
  nodeRef: NodeRef;
  className?: string;
}

/**
 * Minimal footer note — the map is always available, never required.
 * Scroll-revealed {@link QuietDiscovery} handles earned moments on detail pages.
 */
export function TerrainConnectionInvite({
  nodeRef,
  className,
}: TerrainConnectionInviteProps) {
  const count = countConnectedIdeas(nodeRef);
  if (count < 1) return null;

  return (
    <p
      className={cn(
        "type-body text-[0.8125rem] text-charcoal-faint/70",
        className,
      )}
    >
      <TerrainLink
        href={`/?focus=${nodeRef.id}`}
        className="border-b border-transparent pb-px transition-[color,border-color] duration-[1.2s] hover:border-rule/50 hover:text-charcoal-muted"
      >
        On the map
      </TerrainLink>
    </p>
  );
}
