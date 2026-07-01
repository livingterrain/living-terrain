"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TerrainLink } from "@/components/navigation";
import type { GraphNode } from "@/lib/concepts/graph";
import {
  DEFERRED_CONCEPT_IDS,
  NODE_WHISPERS,
  PATH_CHOICES,
  whisperForNode,
} from "@/lib/concepts/constellation-discovery";
import { cn } from "@/lib/utils";
import { TerrainPulse } from "./TerrainPulse";

interface MobileTerrainGuideProps {
  nodes: GraphNode[];
  discoveryAwake: boolean;
  onPathSelect: (id: string) => void;
  reducedMotion?: boolean;
}

export function MobileTerrainGuide({
  nodes,
  discoveryAwake,
  onPathSelect,
  reducedMotion = false,
}: MobileTerrainGuideProps) {
  const [showMore, setShowMore] = useState(false);

  const chamber = nodes.find((n) => n.kind === "chamber");
  const conceptById = new Map(
    nodes.filter((n) => n.kind === "concept").map((n) => [n.id, n]),
  );

  const primaryPaths = PATH_CHOICES.map((choice) => ({
    choice,
    node: conceptById.get(choice.id),
  }));

  const deferredRealms = DEFERRED_CONCEPT_IDS.map((id) => conceptById.get(id)).filter(
    (n): n is GraphNode => !!n,
  );

  const motionProps = reducedMotion
    ? { initial: false as const, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: [0.45, 0.05, 0.55, 0.95] as const },
      };

  return (
    <div
      className="absolute inset-0 z-10 overflow-x-hidden overflow-y-auto overscroll-contain"
      style={{
        paddingTop: "max(0.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(6.5rem, calc(env(safe-area-inset-bottom) + 5rem))",
      }}
      aria-label="Guided paths across the terrain"
    >
      <div
        className="mx-auto w-full max-w-lg pb-6 pt-2"
        style={{
          paddingLeft: "max(1.25rem, env(safe-area-inset-left, 0px))",
          paddingRight: "max(1.25rem, env(safe-area-inset-right, 0px))",
        }}
      >
        <motion.p
          {...motionProps}
          className="type-chamber text-center text-[0.625rem] text-ivory/40"
        >
          Begin at the center — or choose a realm
        </motion.p>

        {chamber && discoveryAwake && (
          <motion.div {...motionProps} className="mt-6">
            <TerrainLink
              href={chamber.href}
              onClick={() => onPathSelect(chamber.id)}
              className={cn(
                "flex min-h-[5.5rem] w-full flex-col justify-center rounded-sm border border-forest-light/30",
                "bg-[#0c1018]/55 px-5 py-5 text-left touch-manipulation transition-[border-color,background-color] duration-500",
                "active:border-forest-light/45 active:bg-[#101620]/70",
              )}
            >
              <p className="type-chamber text-[0.625rem] text-forest-light/70">
                Begin here
              </p>
              <p className="mt-2 font-heading text-[1.125rem] leading-snug text-ivory/92">
                {chamber.label}
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ivory/48">
                {whisperForNode(chamber) ?? chamber.sublabel}
              </p>
            </TerrainLink>
          </motion.div>
        )}

        <ul className="mt-5 space-y-3">
          {primaryPaths.map(({ choice, node }, index) => (
            <motion.li
              key={choice.id}
              {...(reducedMotion
                ? { initial: false as const, animate: { opacity: 1, y: 0 } }
                : {
                    initial: { opacity: 0, y: 8 },
                    animate: { opacity: discoveryAwake ? 1 : 0.55, y: 0 },
                    transition: {
                      duration: 0.45,
                      delay: 0.04 * index,
                      ease: [0.45, 0.05, 0.55, 0.95] as const,
                    },
                  })}
            >
              <RealmCard
                title={choice.title}
                whisper={
                  (node && whisperForNode(node)) ??
                  NODE_WHISPERS[choice.id] ??
                  choice.title
                }
                href={`/themes/${choice.slug}`}
                disabled={!discoveryAwake}
                onSelect={() => onPathSelect(choice.id)}
              />
            </motion.li>
          ))}
        </ul>

        {deferredRealms.length > 0 && (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className="flex min-h-11 w-full items-center justify-center rounded-sm border border-ivory/14 px-4 py-3 text-[0.8125rem] tracking-[0.04em] text-ivory/50 transition-colors duration-500 active:bg-ivory/5"
            >
              {showMore ? "Fewer realms" : "More realms on the terrain"}
            </button>

            {showMore && (
              <ul className="mt-3 space-y-3">
                {deferredRealms.map((node) => (
                  <li key={node.id}>
                    <RealmCard
                      title={node.label}
                      whisper={whisperForNode(node) ?? node.sublabel}
                      href={node.href}
                      disabled={!discoveryAwake}
                      onSelect={() => onPathSelect(node.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <p className="mt-10 text-center text-[0.8125rem] leading-relaxed text-ivory/32">
          On a larger screen, the full constellation opens — draggable, quiet,
          alive with connections.
        </p>

        <div className="mx-auto mt-10 max-w-xs border-t border-ivory/[0.04]">
          <TerrainPulse variant="threshold" className="!mt-7" />
        </div>
      </div>
    </div>
  );
}

function RealmCard({
  title,
  whisper,
  href,
  disabled,
  onSelect,
}: {
  title: string;
  whisper?: string;
  href: string;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <TerrainLink
      href={href}
      onClick={onSelect}
      className={cn(
        "group flex min-h-[5.5rem] w-full flex-col justify-center rounded-sm border px-5 py-4 text-left touch-manipulation",
        "transition-[border-color,background-color] duration-500",
        disabled
          ? "pointer-events-none border-ivory/10 bg-[#0a0c10]/30 opacity-60"
          : "border-ivory/14 bg-[#0a0c10]/45 active:border-forest-light/30 active:bg-[#0c1018]/60",
      )}
      aria-disabled={disabled}
    >
      <p className="font-heading text-[1.0625rem] leading-snug text-ivory/88">
        {title}
      </p>
      {whisper && (
        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ivory/45">
          {whisper}
        </p>
      )}
      <p className="mt-3 text-[0.6875rem] tracking-[0.08em] text-forest-light/55 transition-colors duration-500 group-active:text-forest-light/80">
        Enter realm →
      </p>
    </TerrainLink>
  );
}
