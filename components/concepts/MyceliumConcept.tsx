"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ConceptShell } from "./ConceptShell";
import { buildTerrainGraph } from "@/lib/concepts/graph";
import { UNIVERSE_SIZE } from "@/lib/concepts/universe-viewport";

const toPreview = (v: number) => (v / UNIVERSE_SIZE) * 100;

export function MyceliumConcept() {
  const { nodes, edges } = useMemo(() => buildTerrainGraph(), []);
  const [active, setActive] = useState<string | null>(null);

  const litIds = useMemo(() => {
    if (!active) return null;
    const node = nodes.find((n) => n.id === active);
    return new Set(node?.peerIds ?? [active]);
  }, [active, nodes]);

  const activeNode = nodes.find((n) => n.id === active);

  return (
    <ConceptShell
      title="Concept 04 — The Living Network"
      hint="Touch any node — the organism responds"
    >
      <div className="relative h-full overflow-hidden bg-[#0a120e]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a2e22_0%,#0a120e_70%)]" />

        {/* Breathing pulse at center */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4a7a5a]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {edges.map((edge) => {
            const from = nodes.find((n) => n.id === edge.from);
            const to = nodes.find((n) => n.id === edge.to);
            if (!from || !to) return null;
            const lit =
              litIds?.has(edge.from) && litIds?.has(edge.to);
            const dim = litIds && !lit;

            return (
              <motion.line
                key={`${edge.from}-${edge.to}`}
                x1={toPreview(from.x)}
                y1={toPreview(from.y)}
                x2={toPreview(to.x)}
                y2={toPreview(to.y)}
                stroke={lit ? "#6a9a7a" : "#3a5a48"}
                strokeWidth={lit ? 0.2 : 0.06}
                animate={{
                  opacity: dim ? 0.08 : lit ? 0.9 : 0.35,
                }}
                transition={{ duration: 0.6 }}
              />
            );
          })}

          {nodes.map((node) => {
            const lit = !litIds || litIds.has(node.id);
            const isCenter = node.kind === "chamber";
            const isActive = active === node.id;

            return (
              <g
                key={node.id}
                onMouseEnter={() => setActive(node.id)}
                onMouseLeave={() => setActive(null)}
                style={{ cursor: "pointer" }}
              >
                {isActive && (
                  <motion.circle
                    cx={toPreview(node.x)}
                    cy={toPreview(node.y)}
                    r={node.size * 4}
                    fill="#6a9a7a"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                  />
                )}
                <motion.circle
                  cx={toPreview(node.x)}
                  cy={toPreview(node.y)}
                  r={node.size * (isCenter ? 2.2 : 1.6)}
                  fill={isCenter ? "#e8f0e8" : "#8ab89a"}
                  animate={{
                    opacity: lit ? (isActive ? 1 : 0.75) : 0.15,
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={{ duration: 0.5 }}
                />
                {(isActive || isCenter) && (
                  <text
                    x={toPreview(node.x)}
                    y={toPreview(node.y) + node.size * 5}
                    textAnchor="middle"
                    fill="#c8e0c8"
                    fontSize="2.2"
                    opacity={0.9}
                  >
                    {node.label.slice(0, 28)}
                    {node.label.length > 28 ? "…" : ""}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-6 left-4 right-4 sm:left-8 sm:right-auto sm:max-w-sm">
          {activeNode ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-[#3a5a48]/50 bg-[#0a120e]/90 p-5 backdrop-blur"
            >
              <p className="text-[0.625rem] uppercase tracking-[0.2em] text-[#6a9a7a]">
                {activeNode.kind} · {activeNode.peerIds.length} connections
              </p>
              <p className="mt-2 font-heading text-lg text-[#e8f0e8]">
                {activeNode.label}
              </p>
              <Link
                href={activeNode.href}
                className="mt-3 inline-block text-sm text-[#8ab89a] hover:text-[#c8e0c8]"
              >
                Enter this node →
              </Link>
            </motion.div>
          ) : (
            <p className="text-sm text-[#4a6a5a]">
              Hover any node. The network breathes with you.
            </p>
          )}
        </div>
      </div>
    </ConceptShell>
  );
}
