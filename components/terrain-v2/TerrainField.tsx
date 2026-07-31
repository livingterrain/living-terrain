"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  TERRAIN_BONDS,
  TERRAIN_PRESENCES,
  bondsFor,
  otherEnd,
  presenceById,
  type TerrainBond,
  type TerrainPresence,
} from "@/lib/terrain-v2/content";
import { cn } from "@/lib/utils";

type Mode = "field" | "crossed" | "reading";

const LINGER_MS = 720;
const EASE = [0.45, 0.05, 0.55, 0.95] as const;

type Point = { x: number; y: number };

function layoutAround(
  centerId: string,
  base: Record<string, Point>,
): Record<string, Point> {
  const next: Record<string, Point> = { ...base };
  next[centerId] = { x: 50, y: 46 };

  const neighbors = bondsFor(centerId).map((b) => otherEnd(b, centerId));
  const unique = [...new Set(neighbors)];
  const radius = 26;
  unique.forEach((id, i) => {
    const angle = -Math.PI / 2 + (i / Math.max(unique.length, 1)) * Math.PI * 1.6;
    next[id] = {
      x: 50 + Math.cos(angle) * radius,
      y: 46 + Math.sin(angle) * radius * 0.72,
    };
  });

  for (const p of TERRAIN_PRESENCES) {
    if (p.id === centerId || unique.includes(p.id)) continue;
    const dx = base[p.id].x - 50;
    const dy = base[p.id].y - 46;
    next[p.id] = {
      x: 50 + dx * 1.35,
      y: 46 + dy * 1.35,
    };
  }
  return next;
}

export function TerrainField() {
  const reduced = useReducedMotion() ?? false;
  const fieldRef = useRef<HTMLDivElement>(null);
  const lingerRef = useRef<number | null>(null);

  const resting = useMemo(() => {
    const map: Record<string, Point> = {};
    for (const p of TERRAIN_PRESENCES) map[p.id] = { x: p.x, y: p.y };
    return map;
  }, []);

  const [positions, setPositions] = useState(resting);
  const [mode, setMode] = useState<Mode>("field");
  const [nearId, setNearId] = useState<string | null>(null);
  const [noticedId, setNoticedId] = useState<string | null>(null);
  const [tracedFrom, setTracedFrom] = useState<string | null>(null);
  const [visibleBonds, setVisibleBonds] = useState<TerrainBond[]>([]);
  const [approachId, setApproachId] = useState<string | null>(null);
  const [crossedId, setCrossedId] = useState<string | null>(null);
  const [warmIds, setWarmIds] = useState<Set<string>>(() => new Set());
  const [warmBonds, setWarmBonds] = useState<Set<string>>(() => new Set());
  const [traceBondId, setTraceBondId] = useState<string | null>(null);

  const clearLinger = useCallback(() => {
    if (lingerRef.current) {
      window.clearTimeout(lingerRef.current);
      lingerRef.current = null;
    }
  }, []);

  const pointerToPercent = useCallback((clientX: number, clientY: number) => {
    const el = fieldRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: ((clientX - r.left) / r.width) * 100,
      y: ((clientY - r.top) / r.height) * 100,
    };
  }, []);

  const nearestPresence = useCallback(
    (pt: Point, maxDist = 11) => {
      let best: { id: string; d: number } | null = null;
      for (const p of TERRAIN_PRESENCES) {
        const pos = positions[p.id];
        const d = Math.hypot(pos.x - pt.x, pos.y - pt.y);
        if (d < maxDist && (!best || d < best.d)) best = { id: p.id, d };
      }
      return best?.id ?? null;
    },
    [positions],
  );

  const onPointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (mode !== "field") return;
      const pt = pointerToPercent(clientX, clientY);
      if (!pt) return;

      const near = nearestPresence(pt);
      setNearId(near);

      if (near !== nearId) {
        clearLinger();
        if (near && near !== noticedId) {
          lingerRef.current = window.setTimeout(() => {
            setNoticedId(near);
            setTracedFrom(near);
            const bonds = bondsFor(near).slice(0, 2);
            setVisibleBonds(bonds);
          }, reduced ? 180 : LINGER_MS);
        }
      }

      if (tracedFrom && visibleBonds.length) {
        let closest: { id: string; bondId: string; d: number } | null = null;
        for (const bond of visibleBonds) {
          const other = otherEnd(bond, tracedFrom);
          const pos = positions[other];
          const d = Math.hypot(pos.x - pt.x, pos.y - pt.y);
          if (!closest || d < closest.d) {
            closest = { id: other, bondId: bond.id, d };
          }
        }
        if (closest && closest.d < 18) {
          setApproachId(closest.id);
          setTraceBondId(closest.bondId);
        } else {
          setApproachId(null);
        }
      }
    },
    [
      mode,
      pointerToPercent,
      nearestPresence,
      nearId,
      noticedId,
      clearLinger,
      reduced,
      tracedFrom,
      visibleBonds,
      positions,
    ],
  );

  useEffect(() => () => clearLinger(), [clearLinger]);

  const crossInto = useCallback(
    (id: string) => {
      clearLinger();
      const via = traceBondId;
      setWarmIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        if (tracedFrom) next.add(tracedFrom);
        return next;
      });
      if (via) {
        setWarmBonds((prev) => new Set(prev).add(via));
      }
      setCrossedId(id);
      setMode("crossed");
      setPositions(layoutAround(id, resting));
      setVisibleBonds(bondsFor(id).slice(0, 2));
      setNoticedId(id);
      setTracedFrom(id);
      setApproachId(null);
      setNearId(null);
    },
    [clearLinger, resting, traceBondId, tracedFrom],
  );

  const returnToField = useCallback(() => {
    setMode("field");
    setCrossedId(null);
    setPositions(resting);
    setApproachId(null);
    // Keep noticed/traced warmth; do not reset warmIds
  }, [resting]);

  const openReading = useCallback(() => {
    setMode("reading");
  }, []);

  const closeReading = useCallback(() => {
    setMode("crossed");
  }, []);

  const crossed = crossedId ? presenceById(crossedId) : null;

  return (
    <div className="terrain-v2-realm relative h-[100dvh] min-h-screen w-full overflow-hidden bg-[#06080c] text-ivory">
      <div className="terrain-v2-atmosphere pointer-events-none absolute inset-0" aria-hidden />

      <div
        ref={fieldRef}
        className="absolute inset-0 touch-none"
        onMouseMove={(e) => onPointerMove(e.clientX, e.clientY)}
        onTouchMove={(e) => {
          const t = e.touches[0];
          if (t) onPointerMove(t.clientX, t.clientY);
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          if (t) onPointerMove(t.clientX, t.clientY);
        }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {TERRAIN_BONDS.map((bond) => {
            const a = positions[bond.from];
            const b = positions[bond.to];
            const discovered =
              visibleBonds.some((v) => v.id === bond.id) || warmBonds.has(bond.id);
            const active = traceBondId === bond.id && mode === "field";
            const warm = warmBonds.has(bond.id);
            if (!discovered && mode === "field") return null;
            if (mode !== "field" && !discovered && !warm) return null;

            return (
              <motion.line
                key={bond.id}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={warm || active ? "#d4bc8a" : "#8490a4"}
                strokeWidth={active ? 0.18 : warm ? 0.12 : 0.08}
                strokeOpacity={active ? 0.45 : warm ? 0.28 : 0.16}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduced ? 0.01 : 1.4, ease: EASE }}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {TERRAIN_PRESENCES.map((p) => (
          <Presence
            key={p.id}
            presence={p}
            pos={positions[p.id]}
            near={nearId === p.id}
            noticed={noticedId === p.id}
            approaching={approachId === p.id}
            warm={warmIds.has(p.id)}
            focused={crossedId === p.id}
            recessed={
              mode !== "field" &&
              crossedId !== null &&
              crossedId !== p.id &&
              !bondsFor(crossedId).some((b) => otherEnd(b, crossedId) === p.id)
            }
            related={
              mode !== "field" &&
              crossedId !== null &&
              crossedId !== p.id &&
              bondsFor(crossedId).some((b) => otherEnd(b, crossedId) === p.id)
            }
            reduced={reduced}
            interactive={mode === "field" || mode === "crossed"}
            onSelect={() => {
              if (mode === "reading") return;
              crossInto(p.id);
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {mode === "crossed" && crossed && (
          <motion.aside
            key="crossed-panel"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: reduced ? 0.01 : 1.1, ease: EASE }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-8"
          >
            <div className="pointer-events-auto w-full max-w-md rounded-sm border border-rule/25 bg-[#06080c]/88 px-5 py-5 backdrop-blur-[6px] sm:px-6 sm:py-6">
              <p className="font-body text-[0.625rem] uppercase tracking-[0.22em] text-charcoal-faint">
                Crossed into
              </p>
              <h2 className="mt-3 font-heading text-xl text-ivory sm:text-2xl">
                {crossed.name}
              </h2>
              <p className="mt-4 font-body text-[0.9375rem] leading-relaxed text-charcoal-muted">
                {crossed.introduction}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <button
                  type="button"
                  onClick={openReading}
                  className="font-heading text-[0.9375rem] text-gold/90 transition-colors duration-700 hover:text-gold"
                >
                  Enter the writing
                </button>
                <button
                  type="button"
                  onClick={returnToField}
                  className="font-body text-[0.8125rem] text-charcoal-faint transition-colors duration-700 hover:text-ivory/70"
                >
                  Return to the field
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mode === "reading" && crossed && (
          <motion.div
            key="reading"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.9, ease: EASE }}
            className="absolute inset-0 z-30 flex items-end justify-center bg-[#06080c]/72 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-16 backdrop-blur-[2px] sm:items-center sm:p-8"
          >
            <motion.article
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: reduced ? 0.01 : 1, ease: EASE }}
              className="max-h-[min(78dvh,40rem)] w-full max-w-lg overflow-y-auto border border-rule/30 bg-[#0a0e16]/95 px-6 py-7 sm:px-8 sm:py-9"
            >
              <p className="font-body text-[0.625rem] uppercase tracking-[0.2em] text-charcoal-faint">
                Writing
              </p>
              <h2 className="mt-3 font-heading text-2xl leading-snug text-ivory">
                {crossed.essayTitle}
              </h2>
              <div className="mt-6 space-y-5">
                {crossed.essayBody.map((para) => (
                  <p
                    key={para.slice(0, 24)}
                    className="font-body text-[0.9375rem] leading-[1.88] text-charcoal-muted"
                  >
                    {para}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-rule/25 pt-6">
                <button
                  type="button"
                  onClick={closeReading}
                  className="font-heading text-[0.9375rem] text-gold/90 transition-colors duration-700 hover:text-gold"
                >
                  Leave the writing
                </button>
                {crossed.chamberHref && (
                  <Link
                    href={crossed.chamberHref}
                    className="font-body text-[0.8125rem] text-charcoal-faint underline decoration-rule/40 underline-offset-4 transition-colors duration-700 hover:text-ivory/70"
                  >
                    {crossed.chamberLabel ?? "Go deeper"}
                  </Link>
                )}
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      {mode === "field" && !noticedId && (
        <p className="pointer-events-none absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-10 w-[min(18rem,90vw)] -translate-x-1/2 text-center font-body text-[0.6875rem] leading-relaxed tracking-[0.04em] text-ivory/22">
          Move toward what draws you
        </p>
      )}
    </div>
  );
}

function Presence({
  presence,
  pos,
  near,
  noticed,
  approaching,
  warm,
  focused,
  recessed,
  related,
  reduced,
  interactive,
  onSelect,
}: {
  presence: TerrainPresence;
  pos: Point;
  near: boolean;
  noticed: boolean;
  approaching: boolean;
  warm: boolean;
  focused: boolean;
  recessed: boolean;
  related: boolean;
  reduced: boolean;
  interactive: boolean;
  onSelect: () => void;
}) {
  const mass =
    focused ? 1.35 : approaching || noticed ? 1.18 : near ? 1.1 : warm ? 1.06 : 1;
  const opacity = recessed ? 0.18 : related || focused ? 1 : warm ? 0.85 : 0.55;

  return (
    <motion.button
      type="button"
      aria-label={noticed || warm || focused ? presence.name : "Unnamed presence"}
      className={cn(
        "absolute z-10 -translate-x-1/2 -translate-y-1/2 touch-manipulation",
        interactive ? "cursor-pointer" : "pointer-events-none",
      )}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      animate={{
        scale: mass,
        opacity,
      }}
      transition={{
        type: "spring",
        stiffness: reduced ? 200 : 48,
        damping: reduced ? 28 : 18,
        mass: 1.1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (interactive) onSelect();
      }}
    >
      <span
        className={cn(
          "terrain-v2-presence block rounded-full",
          focused && "terrain-v2-presence--focus",
          (near || noticed || approaching) && "terrain-v2-presence--near",
          warm && !focused && "terrain-v2-presence--warm",
        )}
      />

      <AnimatePresence>
        {(noticed || focused || (warm && approaching)) && (
          <motion.span
            initial={reduced ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.9, ease: EASE }}
            className="pointer-events-none absolute left-1/2 top-[calc(100%+0.65rem)] w-44 -translate-x-1/2 text-center sm:w-52"
          >
            <span className="block font-heading text-[0.8125rem] tracking-wide text-ivory/88 sm:text-[0.875rem]">
              {presence.name}
            </span>
            {(noticed || focused) && (
              <>
                <span className="mt-1.5 block font-heading text-[0.75rem] italic leading-snug text-ivory/45">
                  {presence.fragment}
                </span>
                <span className="mt-2 block font-body text-[0.625rem] uppercase tracking-[0.16em] text-gold-faint/70">
                  {presence.bondWhisper}
                </span>
              </>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
