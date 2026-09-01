"use client";

/**
 * Atlas-only Living Thread — attention leaves a quiet path.
 * Visitor path ≠ canonical structure. Never invents relations.
 */

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import type { AtlasCanonicalView } from "@/lib/canonical/atlas-view";
import {
  LIVING_THREAD_EVENT,
  canonicalEdgesAmong,
  labelForThreadPoint,
  loadLivingThread,
  type ThreadPoint,
} from "@/lib/atlas-v1/living-thread";
import { cn } from "@/lib/utils";
import "./living-thread.css";

type Props = {
  canonical: AtlasCanonicalView;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function layoutPoints(count: number): Array<{ x: number; y: number }> {
  if (count <= 0) return [];
  if (count === 1) return [{ x: 50, y: 48 }];
  const out: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const y = 16 + t * 68;
    // Soft serpentine — cartographic, not force-directed
    const x = 50 + Math.sin(t * Math.PI * 1.15) * 22 + (i % 2 === 0 ? -4 : 4);
    out.push({ x, y });
  }
  return out;
}

export function LivingThread({ canonical }: Props) {
  const [points, setPoints] = useState<ThreadPoint[]>([]);
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const titleId = useId();

  const refresh = useCallback(() => {
    setPoints(loadLivingThread().points);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(LIVING_THREAD_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(LIVING_THREAD_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const count = points.length;
  if (count === 0) return null;

  return (
    <>
      <button
        type="button"
        className="atlas-thread-cue"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Your thread · {count}
      </button>

      {open && (
        <LivingThreadField
          titleId={titleId}
          points={points}
          threadRelations={canonical.threadRelations}
          reduced={reduced}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function LivingThreadField({
  titleId,
  points,
  threadRelations,
  reduced,
  onClose,
}: {
  titleId: string;
  points: ThreadPoint[];
  threadRelations: AtlasCanonicalView["threadRelations"];
  reduced: boolean;
  onClose: () => void;
}) {
  const positions = useMemo(() => layoutPoints(points.length), [points.length]);
  const byId = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    points.forEach((p, i) => {
      // First occurrence anchors the node; revisits reuse that position
      if (!map.has(p.id)) {
        map.set(p.id, positions[i]);
      }
    });
    return map;
  }, [points, positions]);

  const canon = canonicalEdgesAmong(points, threadRelations);

  return (
    <div
      className={cn(
        "atlas-thread-field",
        !reduced && "atlas-thread-field--enter",
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="atlas-thread-field__veil"
        aria-label="Close thread"
        onClick={onClose}
      />

      <div className="atlas-thread-field__stage">
        <header className="atlas-thread-field__head">
          <h2 id={titleId} className="atlas-thread-field__title">
            The thread you followed
          </h2>
          <p className="atlas-thread-field__lede">
            Your path through this Atlas session. Fainter lines are structure
            that was already here.
          </p>
        </header>

        <svg
          className="atlas-thread-field__svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {/* Canonical structure — second layer, restrained */}
          <g className="atlas-thread-field__canon">
            {canon.map((edge) => {
              const a = byId.get(edge.from);
              const b = byId.get(edge.to);
              if (!a || !b) return null;
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2 - 4;
              return (
                <path
                  key={`${edge.from}-${edge.to}-${edge.type}`}
                  d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                  fill="none"
                />
              );
            })}
          </g>

          {/* Visitor path — attention order */}
          <g className="atlas-thread-field__path">
            {points.slice(0, -1).map((_, i) => {
              const a = positions[i];
              const b = positions[i + 1];
              if (!a || !b) return null;
              return (
                <line
                  key={`path-${i}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                />
              );
            })}
          </g>

          <g className="atlas-thread-field__nodes">
            {points.map((point, i) => {
              const pos = positions[i];
              if (!pos) return null;
              return (
                <circle
                  key={`node-${i}-${point.id}`}
                  cx={pos.x}
                  cy={pos.y}
                  r={0.55}
                />
              );
            })}
          </g>
        </svg>

        <ol className="atlas-thread-field__legend">
          {points.map((point, i) => (
            <li key={`leg-${i}-${point.kind}-${point.id}`}>
              <span className="atlas-thread-field__step">{i + 1}</span>
              <span className="atlas-thread-field__kind">{point.kind}</span>
              <span className="atlas-thread-field__name">
                {labelForThreadPoint(point)}
              </span>
            </li>
          ))}
        </ol>

        <button
          type="button"
          className="atlas-thread-field__close"
          onClick={onClose}
        >
          Return
        </button>
      </div>
    </div>
  );
}
