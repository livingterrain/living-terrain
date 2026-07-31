"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ATLAS_MAP_NODES,
  getFocusedGraph,
  type AtlasMapPoint,
  type FocusedAtlasGraph,
} from "@/lib/atlas-map/graph";
import {
  ATLAS_INQUIRIES,
  inquiryByCenterId,
  type AtlasInquiry,
} from "@/lib/atlas-map/inquiries";

/* ── Opening ── */

function Opening({ onBegin }: { onBegin: (inquiry: AtlasInquiry) => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-16 sm:px-10 sm:py-24">
        <p className="font-body text-[0.6875rem] uppercase tracking-[0.22em] text-[#1c1812]/4">
          Atlas
        </p>

        <h1 className="mt-5 font-heading text-[2rem] leading-[1.18] tracking-tight text-[#1c1812] sm:text-[2.5rem]">
          A living index of interconnected ideas.
        </h1>

        <div className="mt-8 max-w-md space-y-3 font-body text-[0.9375rem] leading-relaxed text-[#1c1812]/6">
          <p>This is not a library.</p>
          <p>It is a research tool.</p>
          <p className="pt-2 text-[#1c1812]/75">
            Choose a question to begin an investigation.
          </p>
        </div>

        <ul className="mt-16 space-y-1">
          {ATLAS_INQUIRIES.map((inquiry) => (
            <li key={inquiry.id}>
              <button
                type="button"
                onClick={() => onBegin(inquiry)}
                className="group w-full py-4 text-left transition-colors duration-500"
              >
                <span className="block font-heading text-[1.35rem] italic leading-snug tracking-tight text-[#1c1812] transition-colors duration-500 group-hover:text-[#3d3224] sm:text-[1.5rem]">
                  {inquiry.question}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <Link
          href="/atlas"
          className="mt-16 inline-block font-body text-[0.8125rem] text-[#1c1812]/4 underline decoration-[#1c1812]/15 underline-offset-4 transition-colors duration-500 hover:text-[#1c1812]/7"
        >
          Return to the archive
        </Link>
      </div>
    </div>
  );
}

/* ── Relationship diagram as evidence (secondary) ── */

function EvidenceDiagram({
  graph,
  onContinue,
}: {
  graph: FocusedAtlasGraph;
  onContinue: (nodeId: string) => void;
}) {
  const { nodes, edges, byId, center } = graph;
  const svgRef = useRef<SVGSVGElement>(null);
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 });
  const drag = useRef<{
    active: boolean;
    sx: number;
    sy: number;
    ox: number;
    oy: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const { width, height } = svg.getBoundingClientRect();
    setCamera({
      x: width / 2,
      y: height / 2,
      scale: width < 500 ? 0.68 : 0.8,
    });
  }, [center.id]);

  const onWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setCamera((prev) => {
      const next = Math.min(
        1.6,
        Math.max(0.45, prev.scale * Math.exp(-e.deltaY * 0.001)),
      );
      return {
        scale: next,
        x: mx - ((mx - prev.x) / prev.scale) * next,
        y: my - ((my - prev.y) / prev.scale) * next,
      };
    });
  }, []);

  return (
    <div className="relative h-[min(48vh,20rem)] w-full overflow-hidden bg-[#efe8da] sm:h-[22rem]">
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full touch-none cursor-grab active:cursor-grabbing"
        onWheel={onWheel}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          drag.current = {
            active: true,
            sx: e.clientX,
            sy: e.clientY,
            ox: camera.x,
            oy: camera.y,
            moved: false,
          };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d?.active) return;
          const dx = e.clientX - d.sx;
          const dy = e.clientY - d.sy;
          if (Math.hypot(dx, dy) > 3) d.moved = true;
          setCamera((p) => ({ ...p, x: d.ox + dx, y: d.oy + dy }));
        }}
        onPointerUp={() => {
          if (drag.current) drag.current.active = false;
        }}
        onPointerCancel={() => {
          if (drag.current) drag.current.active = false;
        }}
        aria-label="Evidence: how this inquiry connects"
      >
        <g
          transform={`translate(${camera.x} ${camera.y}) scale(${camera.scale})`}
        >
          {edges.map((edge) => {
            const a = byId.get(edge.from);
            const b = byId.get(edge.to);
            if (!a || !b) return null;
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            return (
              <g key={edge.id}>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#1c1812"
                  strokeOpacity={0.22}
                  strokeWidth={0.85}
                />
                <rect
                  x={mx - edge.relation.length * 2.3 - 3}
                  y={my - 5.5}
                  width={edge.relation.length * 4.6 + 6}
                  height={10}
                  fill="#efe8da"
                />
                <text
                  x={mx}
                  y={my + 2}
                  textAnchor="middle"
                  style={{
                    fontFamily: "var(--font-body), Georgia, serif",
                    fontSize: 7,
                    fontStyle: "italic",
                    fill: "#1c1812",
                    fillOpacity: 0.45,
                  }}
                >
                  {edge.relation}
                </text>
              </g>
            );
          })}
          {nodes.map((node) => {
            const isCenter = node.id === center.id;
            const r = node.r * 0.85;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x} ${node.y})`}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (drag.current?.moved) return;
                  if (node.kind === "concept" && !isCenter) {
                    onContinue(node.id);
                  }
                }}
              >
                {node.kind === "book" ? (
                  <rect
                    x={-r * 0.75}
                    y={-r}
                    width={r * 1.5}
                    height={r * 2}
                    fill="#1c1812"
                    fillOpacity={0.85}
                  />
                ) : node.kind === "concept" ? (
                  <circle r={r} fill="#1c1812" fillOpacity={isCenter ? 0.9 : 0.7} />
                ) : node.kind === "question" ? (
                  <rect
                    x={-r}
                    y={-r}
                    width={r * 2}
                    height={r * 2}
                    transform="rotate(45)"
                    fill="#efe8da"
                    stroke="#1c1812"
                    strokeOpacity={0.5}
                    strokeWidth={1}
                  />
                ) : (
                  <circle
                    r={r}
                    fill="#efe8da"
                    stroke="#1c1812"
                    strokeOpacity={0.5}
                    strokeWidth={1}
                  />
                )}
                {(isCenter || node.kind === "concept") && (
                  <text
                    y={r + 12}
                    textAnchor="middle"
                    style={{
                      fontFamily: "var(--font-heading), Georgia, serif",
                      fontSize: isCenter ? 9 : 7.5,
                      fill: "#1c1812",
                      fillOpacity: 0.7,
                    }}
                  >
                    {node.title.length > 20
                      ? `${node.title.slice(0, 18)}…`
                      : node.title}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

/* ── Continue investigation from any concept node ── */

function buildInquiryForConcept(centerId: string): AtlasInquiry {
  const known = inquiryByCenterId(centerId);
  if (known) return known;

  const node = ATLAS_MAP_NODES.find((n) => n.id === centerId);
  const title = node?.title ?? "this idea";
  return {
    id: centerId,
    question: `What is ${title.toLowerCase()}?`,
    premise:
      node?.description ??
      "Follow the thread. Each idea opens into another.",
    centerId,
  };
}

function ForceLink({
  node,
  relation,
  onContinue,
}: {
  node: AtlasMapPoint;
  relation?: string;
  onContinue: (id: string) => void;
}) {
  const canContinue = node.kind === "concept";

  return (
    <li className="py-5">
      {relation && (
        <p className="font-body text-[0.6875rem] italic tracking-wide text-[#1c1812]/4">
          {relation}
        </p>
      )}
      {canContinue ? (
        <button
          type="button"
          onClick={() => onContinue(node.id)}
          className="mt-1 text-left transition-colors duration-500 hover:text-[#3d3224]"
        >
          <span className="block font-heading text-xl tracking-tight text-[#1c1812] sm:text-[1.35rem]">
            {node.title}
          </span>
          <span className="mt-2 block max-w-md font-body text-[0.875rem] leading-relaxed text-[#1c1812]/55">
            {node.description}
          </span>
          <span className="mt-2 block font-body text-[0.75rem] text-[#1c1812]/4">
            Continue this investigation →
          </span>
        </button>
      ) : (
        <div className="mt-1">
          <p className="font-heading text-xl tracking-tight text-[#1c1812] sm:text-[1.35rem]">
            {node.title}
          </p>
          <p className="mt-2 max-w-md font-body text-[0.875rem] leading-relaxed text-[#1c1812]/55">
            {node.description}
          </p>
          {node.href && (
            <Link
              href={node.href}
              className="mt-2 inline-block font-body text-[0.75rem] text-[#1c1812]/45 underline decoration-[#1c1812]/2 underline-offset-4 hover:text-[#1c1812]/7"
            >
              Open in the terrain
            </Link>
          )}
        </div>
      )}
    </li>
  );
}

/* ── Investigation: sequence of discoveries ── */

function Investigation({
  inquiry,
  onClose,
  onContinue,
}: {
  inquiry: AtlasInquiry;
  onClose: () => void;
  onContinue: (centerId: string) => void;
}) {
  const graph = useMemo(
    () => getFocusedGraph(inquiry.centerId),
    [inquiry.centerId],
  );
  const [showEvidence, setShowEvidence] = useState(false);

  useEffect(() => {
    setShowEvidence(false);
    // Soft scroll to top when investigation changes
    const el = document.querySelector(".atlas-investigation-scroll");
    el?.scrollTo({ top: 0, behavior: "smooth" });
  }, [inquiry.centerId]);

  if (!graph) {
    return (
      <div className="p-10">
        <button type="button" onClick={onClose} className="underline">
          ← Begin again
        </button>
      </div>
    );
  }

  const { center, nodes, edges } = graph;

  const edgeFromCenter = (nodeId: string) =>
    edges.find(
      (e) =>
        (e.from === center.id && e.to === nodeId) ||
        (e.to === center.id && e.from === nodeId),
    );

  const relationLabel = (nodeId: string) => {
    const e = edgeFromCenter(nodeId);
    if (!e) return undefined;
    return e.from === center.id ? e.relation : e.relation;
  };

  const forces = nodes.filter(
    (n) => n.kind === "concept" && n.id !== center.id,
  );
  const books = nodes.filter((n) => n.kind === "book");
  const essays = nodes.filter((n) => n.kind === "essay");
  const questions = nodes.filter((n) => n.kind === "question");

  return (
    <div
      key={inquiry.centerId}
      className="atlas-investigation-scroll flex min-h-0 flex-1 flex-col overflow-auto animate-[atlas-invest-in_0.55s_ease-out]"
    >
      {/* 1 · Question */}
      <header className="px-6 pb-8 pt-10 sm:px-12 sm:pb-12 sm:pt-14">
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={onClose}
            className="font-body text-[0.75rem] text-[#1c1812]/4 underline decoration-[#1c1812]/15 underline-offset-4 hover:text-[#1c1812]/7"
          >
            ← Begin another investigation
          </button>

          <p className="mt-10 font-body text-[0.625rem] uppercase tracking-[0.22em] text-[#1c1812]/35">
            Investigation
          </p>
          <h1 className="mt-5 font-heading text-[2rem] italic leading-[1.2] tracking-tight text-[#1c1812] sm:text-[2.75rem] sm:leading-[1.15]">
            {inquiry.question}
          </h1>
        </div>
      </header>

      {/* 2 · Premise — large statement, unequal weight */}
      <section className="px-6 py-16 sm:px-12 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="font-heading text-[1.5rem] leading-[1.4] tracking-tight text-[#1c1812] sm:text-[1.85rem] sm:leading-[1.35]">
            {inquiry.premise}
          </p>
        </div>
      </section>

      {/* Breath */}
      <div className="flex justify-center py-6" aria-hidden>
        <span className="h-12 w-px bg-[#1c1812]/15" />
      </div>

      {/* 3 · Central concept */}
      <section className="px-6 py-12 sm:px-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <p className="font-body text-[0.625rem] uppercase tracking-[0.2em] text-[#1c1812]/35">
            The idea at the center
          </p>
          <h2 className="mt-4 font-heading text-3xl tracking-tight text-[#1c1812] sm:text-4xl">
            {center.title}
          </h2>
          <p className="mt-5 max-w-md font-body text-[1.0625rem] leading-relaxed text-[#1c1812]/6">
            {center.description}
          </p>
        </div>
      </section>

      {/* 4 · Major contributing forces */}
      {forces.length > 0 && (
        <section className="px-6 py-16 sm:px-12 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <p className="font-body text-[0.625rem] uppercase tracking-[0.2em] text-[#1c1812]/35">
              What presses on this idea
            </p>
            <p className="mt-4 max-w-sm font-heading text-lg italic leading-relaxed text-[#1c1812]/5 sm:text-xl">
              These forces shape {center.title.toLowerCase()}. Follow any one
              to continue the investigation.
            </p>
            <ul className="mt-10 divide-y divide-[#1c1812]/1 border-t border-[#1c1812]/1">
              {forces.map((node) => (
                <ForceLink
                  key={node.id}
                  node={node}
                  relation={relationLabel(node.id)}
                  onContinue={onContinue}
                />
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Quiet discoveries — books / essays / questions, lighter weight */}
      {(books.length > 0 || essays.length > 0 || questions.length > 0) && (
        <section className="px-6 py-12 sm:px-12 sm:py-16">
          <div className="mx-auto max-w-2xl space-y-12">
            {books.length > 0 && (
              <div>
                <p className="font-body text-[0.625rem] uppercase tracking-[0.2em] text-[#1c1812]/35">
                  Charted in
                </p>
                <ul className="mt-4 space-y-4">
                  {books.map((node) => (
                    <li key={node.id}>
                      <p className="font-heading text-lg text-[#1c1812]">
                        {node.title}
                      </p>
                      <p className="mt-1 font-body text-[0.8125rem] leading-relaxed text-[#1c1812]/5">
                        {node.description}
                      </p>
                      {node.href && (
                        <Link
                          href={node.href}
                          className="mt-1.5 inline-block font-body text-[0.75rem] text-[#1c1812]/4 underline decoration-[#1c1812]/15 underline-offset-4 hover:text-[#1c1812]/7"
                        >
                          Open the map
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {essays.length > 0 && (
              <div>
                <p className="font-body text-[0.625rem] uppercase tracking-[0.2em] text-[#1c1812]/35">
                  Traced in essays
                </p>
                <ul className="mt-4 space-y-4">
                  {essays.map((node) => (
                    <li key={node.id}>
                      <p className="font-heading text-lg text-[#1c1812]">
                        {node.title}
                      </p>
                      <p className="mt-1 font-body text-[0.8125rem] leading-relaxed text-[#1c1812]/5">
                        {node.description}
                      </p>
                      {node.href && (
                        <Link
                          href={node.href}
                          className="mt-1.5 inline-block font-body text-[0.75rem] text-[#1c1812]/4 underline decoration-[#1c1812]/15 underline-offset-4 hover:text-[#1c1812]/7"
                        >
                          Read
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {questions.length > 0 && (
              <div>
                <p className="font-body text-[0.625rem] uppercase tracking-[0.2em] text-[#1c1812]/35">
                  Still open
                </p>
                <ul className="mt-4 space-y-4">
                  {questions.map((node) => (
                    <li key={node.id}>
                      <p className="font-heading text-lg italic text-[#1c1812]">
                        {node.title}
                      </p>
                      {node.href && (
                        <Link
                          href={node.href}
                          className="mt-1.5 inline-block font-body text-[0.75rem] text-[#1c1812]/4 underline decoration-[#1c1812]/15 underline-offset-4 hover:text-[#1c1812]/7"
                        >
                          Sit with the question
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Breath before evidence */}
      <div className="flex justify-center py-10" aria-hidden>
        <span className="h-16 w-px bg-[#1c1812]/12" />
      </div>

      {/* 5 · Graph as evidence — last, not first */}
      <section className="px-6 pb-20 sm:px-12 sm:pb-28">
        <div className="mx-auto max-w-2xl">
          <p className="font-body text-[0.625rem] uppercase tracking-[0.2em] text-[#1c1812]/35">
            Evidence
          </p>
          <h3 className="mt-4 font-heading text-2xl tracking-tight text-[#1c1812] sm:text-[1.75rem]">
            How these ideas connect
          </h3>
          <p className="mt-3 max-w-md font-body text-[0.875rem] leading-relaxed text-[#1c1812]/5">
            The diagram is not the investigation. It is what the investigation
            has traced so far. Select a connected concept to continue.
          </p>

          {!showEvidence ? (
            <button
              type="button"
              onClick={() => setShowEvidence(true)}
              className="mt-8 font-body text-[0.875rem] text-[#1c1812]/55 underline decoration-[#1c1812]/2 underline-offset-4 hover:text-[#1c1812]"
            >
              Reveal the relationships
            </button>
          ) : (
            <div className="mt-8 border border-[#1c1812]/1">
              <EvidenceDiagram graph={graph} onContinue={onContinue} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/**
 * Atlas as investigation — sequence of discoveries, not documentation.
 */
export function ConceptualMap() {
  const [inquiry, setInquiry] = useState<AtlasInquiry | null>(null);

  const continueTo = useCallback((centerId: string) => {
    setInquiry(buildInquiryForConcept(centerId));
  }, []);

  return (
    <div className="atlas-map-shell relative flex h-[calc(100dvh-3.5rem)] w-full flex-col overflow-hidden bg-[#2a241c] text-[#1c1812] sm:h-[calc(100dvh-4rem)] md:h-[calc(100dvh-4.25rem)]">
      <div className="flex min-h-0 flex-1 flex-col p-2 sm:p-3 md:p-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-[#1c1812]/20 bg-[#e8e0d0] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_0_rgba(0,0,0,0.15)]">
          {!inquiry ? (
            <Opening onBegin={setInquiry} />
          ) : (
            <Investigation
              inquiry={inquiry}
              onClose={() => setInquiry(null)}
              onContinue={continueTo}
            />
          )}
        </div>
      </div>
    </div>
  );
}
