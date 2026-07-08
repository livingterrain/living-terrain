"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo } from "react";
import { useBreakpoint } from "@/lib/atmosphere/use-breakpoint";

/**
 * The Observatory interior — a centuries-old glasshouse observatory carved in
 * stone and aged copper, its ribbed glass vault open to the sky, a living tree
 * rooted through the floor, vines reclaiming the arches, and still water
 * mirroring the light. Built to feel entered rather than viewed.
 *
 * Everything is modeled SVG: stone carries real light-and-shadow mass through
 * gradients, joints and flutes are incised with a two-line engraving (a dark
 * groove beside a lit highlight), voussoir arches close on carved keystones,
 * and the engraved floor medallion lies flat under the shaft of light. Parallax
 * gives the room depth; reduced motion and mobile collapse it to one quiet
 * composition.
 */
export function ObservatoryConservatory() {
  const reduced = useReducedMotion() ?? false;
  const { isMobile } = useBreakpoint();
  const { scrollYProgress } = useScroll();

  const mx = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 12, damping: 40, mass: 1.8 });

  const parallax = isMobile ? 0.5 : 1;
  const vaultY = useTransform(scrollYProgress, [0, 1], [0, -64 * parallax]);
  const arcadeY = useTransform(scrollYProgress, [0, 1], [0, -118 * parallax]);
  const archY = useTransform(scrollYProgress, [0, 1], [0, -128 * parallax]);
  const nearY = useTransform(scrollYProgress, [0, 1], [0, -182 * parallax]);
  const foliageY = useTransform(scrollYProgress, [0, 1], [0, -46 * parallax]);
  const floorY = useTransform(scrollYProgress, [0, 1], [0, -22 * parallax]);
  const dustY = useTransform(scrollYProgress, [0, 1], [0, -230 * parallax]);

  const vaultX = useTransform(px, (v) => v * 6);
  const arcadeX = useTransform(px, (v) => v * 16);
  const archX = useTransform(px, (v) => v * 9);
  const nearX = useTransform(px, (v) => v * 26);

  const dust = useMemo(
    () =>
      Array.from({ length: isMobile ? 9 : 22 }, (_, i) => ({
        id: i,
        x: ((i * 61.7) % 1000) / 10,
        y: 8 + ((i * 47.3) % 800) / 10,
        size: i % 7 === 0 ? 2.3 : i % 3 === 0 ? 1.4 : 0.9,
        delay: (i % 9) * 2.2,
        dur: 24 + (i % 8) * 6,
      })),
    [isMobile],
  );

  useEffect(() => {
    if (reduced || isMobile) return;
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, reduced, isMobile]);

  return (
    <div
      className="obs-conservatory pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <MaterialDefs />

      <div className="obs-cons__sky absolute inset-0" />
      <div className="obs-cons__daylight absolute inset-0" />
      {/* Aerial perspective — distance dissolves into warm haze */}
      <div className="obs-cons__depth absolute inset-0" />

      {/* Cathedral-scale glazed vault, open to the sky at the oculus */}
      <motion.div
        className="obs-cons__vault absolute inset-x-0 top-0"
        style={reduced ? undefined : { y: vaultY, x: vaultX }}
      >
        <VaultCeiling />
      </motion.div>
      <div className="obs-cons__panes absolute inset-x-0 top-0" />

      {/* Hanging vines from the ironwork */}
      <motion.div
        className="obs-cons__tendrils absolute inset-x-0 top-0"
        style={reduced ? undefined : { y: vaultY, x: vaultX }}
      >
        <HangingVine className="obs-cons__tendril obs-cons__tendril--a" />
        <HangingVine className="obs-cons__tendril obs-cons__tendril--b" />
        <HangingVine className="obs-cons__tendril obs-cons__tendril--c" />
      </motion.div>

      {/* Shafts of light falling from the oculus */}
      <div className="obs-cons__rays absolute inset-0" />

      {/* Carved colonnade receding into the distance */}
      {!isMobile && (
        <motion.div
          className="obs-cons__arcade absolute inset-0"
          style={reduced ? undefined : { y: arcadeY, x: arcadeX }}
        >
          <Arcade side="l" />
          <Arcade side="r" />
        </motion.div>
      )}

      {/* The great central arch opening onto a misty garden, with the living
          tree rooted through the floor and vines reclaiming the stone */}
      <motion.div
        className="obs-cons__stage absolute inset-x-0 bottom-0"
        style={reduced ? undefined : { y: archY, x: archX }}
      >
        <div className="obs-cons__garden" />
        <div className="obs-cons__canopy" />
        <Tree />
        <GreatArch />
        <ArchIvy />
      </motion.div>

      {/* Perspective stone floor with an engraved medallion */}
      <motion.div
        className="obs-cons__floor absolute inset-x-0 bottom-0"
        style={reduced ? undefined : { y: floorY }}
      >
        <FloorPlane />
      </motion.div>
      <motion.div
        className="obs-cons__medallion absolute inset-x-0"
        style={reduced ? undefined : { y: floorY }}
      >
        <FloorMedallion />
      </motion.div>

      {/* Warm pool of light where the shaft lands on the stone */}
      <div className="obs-cons__lightpool absolute inset-0" />

      {/* Still water mirroring the room */}
      <motion.div
        className="obs-cons__water absolute inset-x-0 bottom-0"
        style={reduced ? undefined : { y: floorY }}
      >
        <div className="obs-cons__water-glow" />
        <div className="obs-cons__reflect">
          <div className="obs-cons__reflect-inner">
            <div className="obs-cons__reflect-garden" />
            <Tree />
          </div>
        </div>
        <div className="obs-cons__water-sheen" />
        <Reeds />
        <div className="obs-cons__waterline" />
      </motion.div>

      {/* Brass instruments left standing on the floor */}
      {!isMobile && (
        <motion.div
          className="obs-cons__instruments absolute inset-0"
          style={reduced ? undefined : { y: nearY, x: nearX }}
        >
          <Armillary className="obs-cons__armillary" />
          <Telescope className="obs-cons__telescope" />
        </motion.div>
      )}

      {/* Ferns reclaiming the corners */}
      <motion.div
        className="obs-cons__foliage absolute inset-0"
        style={reduced ? undefined : { y: foliageY }}
      >
        <FernCorner className="obs-cons__foliage--tl" />
        <FernCorner className="obs-cons__foliage--tr" />
      </motion.div>

      {/* Subtle life — dust in the light, a leaf drifting down */}
      <motion.div
        className="obs-cons__dust absolute inset-0"
        style={reduced ? undefined : { y: dustY }}
      >
        {dust.map((d) => (
          <span
            key={d.id}
            className="obs-cons__mote absolute rounded-full"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: `${d.size}px`,
              height: `${d.size}px`,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.dur}s`,
            }}
          />
        ))}
      </motion.div>
      {!reduced && !isMobile && <DriftingLeaf />}

      <div className="obs-cons__fog absolute inset-0" />
      <div className="obs-cons__grain absolute inset-0" />
      <div className="obs-cons__vignette absolute inset-0" />
    </div>
  );
}

/* ── Shared material system ────────────────────────────────────────────
   One hidden SVG of gradients every other <svg> references by id, plus a
   two-line engraving primitive: a dark incision beside a lit highlight, so
   grooves read as carved rather than drawn. */
function MaterialDefs() {
  return (
    <svg className="obs-cons__defs" width="0" height="0" aria-hidden focusable="false">
      <defs>
        <linearGradient id="consStone" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#5a4632" />
          <stop offset="42%" stopColor="#352819" />
          <stop offset="100%" stopColor="#160f09" />
        </linearGradient>
        <linearGradient id="consStoneV" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#160f09" />
          <stop offset="34%" stopColor="#3a2c1c" />
          <stop offset="58%" stopColor="#5a4632" />
          <stop offset="100%" stopColor="#120c07" />
        </linearGradient>
        <linearGradient id="consKey" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6f5636" />
          <stop offset="60%" stopColor="#43331f" />
          <stop offset="100%" stopColor="#1c130b" />
        </linearGradient>
        <linearGradient id="consCopper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d8ab63" />
          <stop offset="46%" stopColor="#8f6a3a" />
          <stop offset="100%" stopColor="#4a3820" />
        </linearGradient>
        <linearGradient id="consVerd" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#79ad99" />
          <stop offset="55%" stopColor="#3f6f60" />
          <stop offset="100%" stopColor="#24413a" />
        </linearGradient>
        <radialGradient id="consGlass" cx="50%" cy="14%" r="80%">
          <stop offset="0%" stopColor="#f2e6c4" stopOpacity="0.9" />
          <stop offset="34%" stopColor="#c8b489" stopOpacity="0.32" />
          <stop offset="72%" stopColor="#3a2e20" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#160f09" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/** Incised groove: a dark cut with a lit highlight riding just below it. */
function Groove({ d }: { d: string }) {
  return (
    <>
      <path className="obs-eng-dark" d={d} />
      <path className="obs-eng-lite" d={d} transform="translate(0.8 0.9)" />
    </>
  );
}

/* ── Voussoir geometry — wedge stones closing on a keystone ─────────── */
interface Voussoir {
  d: string;
  joint: string;
  key: boolean;
}

function buildArch(
  cx: number,
  cy: number,
  rInner: number,
  thickness: number,
  count: number,
): Voussoir[] {
  const start = Math.PI;
  const step = Math.PI / count;
  const rOuter = rInner + thickness;
  const keyIndex = Math.floor(count / 2);
  const pt = (r: number, a: number): [number, number] => [
    cx + r * Math.cos(a),
    cy + r * Math.sin(a),
  ];
  const stones: Voussoir[] = [];
  for (let i = 0; i < count; i += 1) {
    const a0 = start + i * step;
    const a1 = start + (i + 1) * step;
    const [ix0, iy0] = pt(rInner, a0);
    const [ix1, iy1] = pt(rInner, a1);
    const [ox1, oy1] = pt(rOuter, a1);
    const [ox0, oy0] = pt(rOuter, a0);
    stones.push({
      d: `M${ix0.toFixed(1)} ${iy0.toFixed(1)} A${rInner} ${rInner} 0 0 1 ${ix1.toFixed(1)} ${iy1.toFixed(1)} L${ox1.toFixed(1)} ${oy1.toFixed(1)} A${rOuter} ${rOuter} 0 0 0 ${ox0.toFixed(1)} ${oy0.toFixed(1)} Z`,
      joint: `M${ix0.toFixed(1)} ${iy0.toFixed(1)} L${ox0.toFixed(1)} ${oy0.toFixed(1)}`,
      key: i === keyIndex,
    });
  }
  return stones;
}

/* ── Cathedral-scale glazed vault ──────────────────────────────────── */
function VaultCeiling() {
  const cx = 720;
  const oc = 96;
  const ribs = [40, 170, 320, 490, 720, 950, 1120, 1270, 1400];
  const arcs = [180, 300, 440, 600];
  const rings = [22, 40, 60];
  return (
    <svg
      viewBox="0 0 1440 620"
      preserveAspectRatio="xMidYMin slice"
      className="obs-cons__vault-svg"
    >
      <path d="M0 620 Q720 -220 1440 620 Z" fill="url(#consGlass)" />
      {/* transverse arcs of the vault */}
      {arcs.map((r, i) => (
        <path
          key={`a-${i}`}
          className="obs-cons__vault-rib"
          opacity={0.5 - i * 0.07}
          d={`M${cx - r * 2.2} 620 A${r * 2.2} ${r + 150} 0 0 1 ${cx + r * 2.2} 620`}
        />
      ))}
      {/* longitudinal ribs fanning from the oculus */}
      {ribs.map((x) => (
        <path
          key={`r-${x}`}
          className={
            x === 720 ? "obs-cons__vault-rib obs-cons__vault-rib--heavy" : "obs-cons__vault-rib"
          }
          d={`M${cx} ${oc + 30} Q${(x + cx) / 2} ${(oc + 620) / 2.4} ${x} 620`}
        />
      ))}
      {/* verdigris streaks weeping from the iron */}
      {[300, 720, 1140].map((x, i) => (
        <path
          key={`v-${i}`}
          className="obs-cons__vault-verd"
          d={`M${cx} ${oc + 30} Q${(x + cx) / 2} ${(oc + 620) / 2.4} ${x} 620`}
        />
      ))}
      {/* the oculus */}
      {rings.map((r, i) => (
        <circle
          key={`o-${i}`}
          className="obs-cons__oculus-ring"
          cx={cx}
          cy={oc}
          r={r}
          opacity={0.7 - i * 0.18}
        />
      ))}
      <circle className="obs-cons__oculus-core" cx={cx} cy={oc} r={16} />
      {/* botanical shadows pressing on the glass */}
      <g className="obs-cons__glass-leaf">
        {[
          [150, 210],
          [1290, 230],
          [360, 150],
          [1080, 160],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${(i * 57) % 360})`}>
            {[0, 1, 2, 3, 4].map((k) => (
              <ellipse
                key={k}
                cx={Math.cos((k / 5) * 6.28) * 22}
                cy={Math.sin((k / 5) * 6.28) * 22}
                rx={16}
                ry={7}
                transform={`rotate(${k * 72} ${Math.cos((k / 5) * 6.28) * 22} ${Math.sin((k / 5) * 6.28) * 22})`}
              />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ── The great central arch ────────────────────────────────────────── */
function GreatArch() {
  const cx = 310;
  const cy = 300;
  const rInner = 150;
  const thickness = 50;
  const stones = buildArch(cx, cy, rInner, thickness, 13);
  const leftPier = cx - rInner - thickness; // 110
  const rightPier = cx + rInner; // 460
  return (
    <svg
      viewBox="0 0 620 720"
      preserveAspectRatio="xMidYMax meet"
      className="obs-cons__ga-svg"
    >
      {/* backlit opening from the garden beyond */}
      <path
        className="obs-cons__ga-rim"
        d={`M${cx - rInner} 720 L${cx - rInner} ${cy} A${rInner} ${rInner} 0 0 1 ${cx + rInner} ${cy} L${cx + rInner} 720`}
      />

      {/* piers */}
      <FlutedPier x={leftPier} top={cy} width={thickness} />
      <FlutedPier x={rightPier} top={cy} width={thickness} />

      {/* carved capitals */}
      <Capital x={leftPier} y={cy} width={thickness} />
      <Capital x={rightPier} y={cy} width={thickness} />

      {/* voussoirs */}
      {stones.map((s, i) => (
        <g key={i}>
          <path
            className="obs-cons__voussoir"
            fill={s.key ? "url(#consKey)" : "url(#consStone)"}
            d={s.d}
          />
          <Groove d={s.joint} />
        </g>
      ))}
      {/* carved keystone emblem — a small sun */}
      <g className="obs-cons__ga-emblem" transform={`translate(${cx} ${cy - rInner - thickness / 2})`}>
        <circle r={9} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={Math.cos(a) * 12}
              y1={Math.sin(a) * 12}
              x2={Math.cos(a) * 17}
              y2={Math.sin(a) * 17}
            />
          );
        })}
      </g>

      {/* plinths + tree roots crossing the stone base */}
      <rect className="obs-cons__plinth" x={leftPier - 8} y={700} width={thickness + 16} height={20} fill="url(#consStone)" />
      <rect className="obs-cons__plinth" x={rightPier - 8} y={700} width={thickness + 16} height={20} fill="url(#consStone)" />
      <g className="obs-cons__moss">
        {[0, 1, 2, 3].map((k) => (
          <ellipse key={`ml-${k}`} cx={leftPier + 6 + k * 12} cy={700 - (k % 2) * 6} rx={6} ry={3} />
        ))}
        {[0, 1, 2, 3].map((k) => (
          <ellipse key={`mr-${k}`} cx={rightPier + 6 + k * 12} cy={700 - (k % 2) * 6} rx={6} ry={3} />
        ))}
      </g>
    </svg>
  );
}

function FlutedPier({
  x,
  top,
  width,
}: {
  x: number;
  top: number;
  width: number;
}) {
  const flutes = [0.26, 0.5, 0.74];
  return (
    <g>
      <rect fill="url(#consStoneV)" x={x} y={top} width={width} height={720 - top} />
      {flutes.map((f) => (
        <Groove key={f} d={`M${x + width * f} ${top + 6} L${x + width * f} 700`} />
      ))}
      {/* worn horizontal courses */}
      {[0.34, 0.62, 0.86].map((c) => (
        <Groove key={`c-${c}`} d={`M${x} ${top + (720 - top) * c} L${x + width} ${top + (720 - top) * c}`} />
      ))}
    </g>
  );
}

function Capital({ x, y, width }: { x: number; y: number; width: number }) {
  const o = 9;
  return (
    <g>
      <rect className="obs-cons__cap" x={x - o} y={y - 20} width={width + o * 2} height={20} fill="url(#consStone)" />
      <rect className="obs-cons__cap" x={x - o - 4} y={y - 28} width={width + o * 2 + 8} height={9} fill="url(#consKey)" />
      {/* a carved volute scroll on each side of the capital */}
      <path
        className="obs-cons__cap-scroll"
        d={`M${x - o} ${y - 6} q -6 -6 0 -12 q 6 -4 8 2`}
      />
      <path
        className="obs-cons__cap-scroll"
        d={`M${x + width + o} ${y - 6} q 6 -6 0 -12 q -6 -4 -8 2`}
      />
    </g>
  );
}

/* ── Central living tree, roots over stone ─────────────────────────── */
function Tree() {
  return (
    <svg
      viewBox="0 0 460 760"
      preserveAspectRatio="xMidYMax meet"
      className="obs-cons__tree-svg"
    >
      {/* roots spilling over the stone base */}
      <g className="obs-cons__roots">
        <path d="M230 700 C200 716 168 724 120 728" />
        <path d="M234 700 C264 718 300 726 348 730" />
        <path d="M228 704 C210 724 190 736 160 744" />
        <path d="M236 704 C256 726 280 738 312 746" />
      </g>
      <path
        className="obs-cons__bark"
        d="M214 720 C210 560 206 470 214 400 C218 360 236 340 230 300 L248 300 C244 344 258 366 260 404 C266 480 258 566 252 720 Z"
      />
      <g className="obs-cons__branch">
        <path d="M234 360 C200 320 170 300 138 270 C120 252 108 226 96 196" />
        <path d="M240 356 C276 316 306 300 340 268 C360 248 372 222 386 192" />
        <path d="M236 300 C214 262 196 238 190 200 C186 172 190 146 196 118" />
        <path d="M240 300 C262 264 284 240 292 202 C298 172 296 146 288 116" />
        <path d="M238 250 C236 214 236 184 240 150 C242 128 244 106 242 84" />
        <path d="M138 270 C120 262 104 258 84 258" />
        <path d="M340 268 C360 260 376 256 396 256" />
        <path d="M190 200 C172 194 158 190 142 184" />
        <path d="M292 202 C310 196 326 192 342 186" />
        <path d="M240 150 C224 142 214 136 202 124" />
        <path d="M240 150 C258 142 268 136 280 124" />
      </g>
      <g className="obs-cons__leaves">
        {[
          [92, 194],
          [388, 190],
          [196, 116],
          [288, 114],
          [242, 82],
          [84, 258],
          [396, 256],
          [150, 232],
          [332, 230],
          [240, 168],
          [128, 150],
          [352, 150],
        ].map(([cx, cy], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={30} ry={20} />
        ))}
      </g>
    </svg>
  );
}

/* ── Ivy reclaiming the arch ───────────────────────────────────────── */
function ArchIvy() {
  return (
    <svg
      viewBox="0 0 620 720"
      preserveAspectRatio="xMidYMax meet"
      className="obs-cons__ivy-svg"
    >
      <g className="obs-cons__ivy">
        <path d="M96 720 C 90 560 92 430 120 340 C 150 250 220 176 310 168 C 400 176 470 250 500 340 C 528 430 530 560 524 720" />
        <path d="M310 168 C 306 210 298 240 310 286" />
        <path d="M186 250 C 206 276 212 300 202 332" />
        <path d="M434 250 C 414 276 408 300 418 332" />
        <path d="M120 480 C 150 500 168 520 166 560" />
        <path d="M500 480 C 470 500 452 520 454 560" />
      </g>
      <g className="obs-cons__ivy-leaf">
        {[
          [104, 640],
          [98, 560],
          [110, 470],
          [136, 386],
          [186, 300],
          [250, 220],
          [310, 186],
          [370, 220],
          [434, 300],
          [484, 386],
          [510, 470],
          [522, 560],
          [516, 640],
          [310, 250],
          [202, 322],
          [418, 322],
          [166, 540],
          [454, 540],
        ].map(([cx, cy], i) => (
          <path
            key={i}
            transform={`translate(${cx} ${cy}) rotate(${(i * 47) % 360})`}
            d="M0 0 C -8 -6 -8 -15 0 -18 C 8 -15 8 -6 0 0 Z"
          />
        ))}
      </g>
    </svg>
  );
}

/* ── Receding carved arcade ────────────────────────────────────────── */
interface Bay {
  x: number;
  w: number;
  top: number;
}

function buildBays(): Bay[] {
  return Array.from({ length: 4 }, (_, i) => ({
    x: 24 + i * 168,
    w: Math.max(16, 54 - i * 9),
    top: 250 + i * 104,
  }));
}

function SpecimenJar({
  x,
  y,
  small,
}: {
  x: number;
  y: number;
  small?: boolean;
}) {
  const h = small ? 26 : 36;
  const w = small ? 12 : 15;
  return (
    <g className="obs-cons__jar">
      <path
        d={`M${x - w} ${y} L${x - w} ${y - h + 8} Q${x - w} ${y - h} ${x - w + 5} ${
          y - h
        } L${x + w - 5} ${y - h} Q${x + w} ${y - h} ${x + w} ${y - h + 8} L${
          x + w
        } ${y} Z`}
      />
      <path
        className="obs-cons__jar-life"
        d={`M${x} ${y - 4} C${x - 6} ${y - 12} ${x - 4} ${y - h + 10} ${x} ${
          y - h + 8
        } C${x + 4} ${y - h + 10} ${x + 6} ${y - 12} ${x} ${y - 4} Z`}
      />
    </g>
  );
}

function Arcade({ side }: { side: "l" | "r" }) {
  const bays = buildBays();
  return (
    <svg
      viewBox="0 0 720 900"
      preserveAspectRatio={side === "l" ? "xMinYMax meet" : "xMaxYMax meet"}
      className={`obs-cons__col-svg obs-cons__col-svg--${side}`}
    >
      {/* arches spanning the bays, each on carved springers */}
      {bays.slice(0, -1).map((b, i) => {
        const n = bays[i + 1];
        const cxA = (b.x + b.w + n.x) / 2;
        const rIn = Math.max(28, (n.x - (b.x + b.w)) / 2);
        const cyA = Math.min(b.top, n.top);
        const stones = buildArch(cxA, cyA, rIn, Math.max(10, 26 - i * 5), 9);
        return (
          <g key={`arch-${i}`} opacity={0.62 - i * 0.13}>
            {stones.map((s, k) => (
              <path key={k} fill="url(#consStone)" d={s.d} />
            ))}
          </g>
        );
      })}

      {/* fluted columns */}
      {bays.map((b, i) => (
        <g key={`col-${i}`} opacity={0.92 - i * 0.16}>
          <rect fill="url(#consStoneV)" x={b.x} y={b.top} width={b.w} height={900 - b.top} />
          <rect fill="url(#consKey)" x={b.x - 4} y={b.top - 9} width={b.w + 8} height={9} />
          {i < 3 &&
            [0.3, 0.5, 0.7].map((f) => (
              <Groove key={f} d={`M${b.x + b.w * f} ${b.top} L${b.x + b.w * f} 900`} />
            ))}
          {i < 2 && (
            <g className="obs-cons__moss" opacity={0.6 - i * 0.2}>
              {[0, 1, 2, 3, 4].map((k) => (
                <ellipse
                  key={k}
                  cx={b.x + 2 + (k * b.w) / 5}
                  cy={900 - 6 - (k % 2) * 10}
                  rx={5}
                  ry={3}
                />
              ))}
            </g>
          )}
        </g>
      ))}

      {/* Nearest bay: engraved shelf volumes + specimen jars + pinned diagram */}
      <g className="obs-cons__near-bay" opacity={0.85}>
        <path
          className="obs-cons__stone-edge"
          d={`M${bays[0].x + bays[0].w} 690 L${bays[1].x} 712`}
        />
        {Array.from({ length: 6 }, (_, k) => {
          const bx = bays[0].x + bays[0].w + 26 + k * 16;
          const by = 712 - k * 2.6;
          return <path key={k} className="obs-cons__book" d={`M${bx} ${by} L${bx} ${by - 56}`} />;
        })}
        <SpecimenJar x={bays[0].x + bays[0].w + 130} y={686} />
        <SpecimenJar x={bays[0].x + bays[0].w + 158} y={690} small />

        <rect
          className="obs-cons__frame"
          x={bays[0].x + 14}
          y={410}
          width={Math.max(14, bays[0].w - 22)}
          height={110}
        />
        <path
          className="obs-cons__frame-mark"
          d={`M${bays[0].x + 18} 515 L${bays[0].x + bays[0].w / 2} 466 L${bays[0].x + bays[0].w - 16} 503`}
        />
        <circle
          className="obs-cons__frame-mark"
          cx={bays[0].x + bays[0].w / 2}
          cy={468}
          r={3}
        />
      </g>
    </svg>
  );
}

/* ── Perspective stone floor (flagstones) ──────────────────────────── */
function FloorPlane() {
  const vpX = 720;
  const seams = [30, 78, 140, 220, 322, 452];
  const uprights = [60, 260, 480, 720, 960, 1180, 1380];
  return (
    <svg
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMax slice"
      className="obs-cons__floor-svg"
    >
      {uprights.map((x, i) => (
        <path key={`u-${i}`} className="obs-cons__floor-line" d={`M${x} 600 L${vpX} 0`} />
      ))}
      {seams.map((y, i) => (
        <path
          key={`s-${i}`}
          className="obs-cons__floor-line"
          d={`M0 ${y} L1440 ${y}`}
          opacity={0.16 + i * 0.05}
        />
      ))}
    </svg>
  );
}

/* ── Engraved floor medallion, lying flat under the light ──────────── */
function FloorMedallion() {
  const cx = 300;
  const cy = 300;
  const rings = [70, 130, 200, 268];
  return (
    <svg
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid meet"
      className="obs-cons__med-svg"
    >
      <circle className="obs-cons__med-glow" cx={cx} cy={cy} r={280} />
      {rings.map((r) => (
        <circle key={r} className="obs-cons__med-line" cx={cx} cy={cy} r={r} />
      ))}
      {/* radial spokes / compass rose */}
      {Array.from({ length: 32 }, (_, i) => {
        const a = (i / 32) * Math.PI * 2;
        const long = i % 8 === 0;
        const r0 = long ? 70 : 200;
        const r1 = 268;
        return (
          <line
            key={i}
            className={long ? "obs-cons__med-line" : "obs-cons__med-tick"}
            x1={cx + Math.cos(a) * r0}
            y1={cy + Math.sin(a) * r0}
            x2={cx + Math.cos(a) * r1}
            y2={cy + Math.sin(a) * r1}
          />
        );
      })}
      {/* cardinal star */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
        return (
          <path
            key={`p-${i}`}
            className="obs-cons__med-line"
            d={`M${cx} ${cy} L${cx + Math.cos(a - 0.09) * 130} ${cy + Math.sin(a - 0.09) * 130} L${cx + Math.cos(a) * 200} ${cy + Math.sin(a) * 200} L${cx + Math.cos(a + 0.09) * 130} ${cy + Math.sin(a + 0.09) * 130} Z`}
          />
        );
      })}
      <circle className="obs-cons__med-core" cx={cx} cy={cy} r={10} />
    </svg>
  );
}

/* ── Reeds and lily pads at the water's edge ───────────────────────── */
function Reeds() {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="xMidYMin slice"
      className="obs-cons__reeds-svg"
    >
      <g className="obs-cons__lily">
        <ellipse cx="250" cy="46" rx="34" ry="9" />
        <ellipse cx="1150" cy="54" rx="40" ry="10" />
        <ellipse cx="980" cy="40" rx="26" ry="7" />
      </g>
      <g className="obs-cons__reed">
        {[
          [120, 92],
          [138, 84],
          [156, 96],
          [1300, 96],
          [1318, 82],
          [1336, 94],
          [70, 100],
          [1390, 100],
        ].map(([x, top], i) => (
          <path
            key={i}
            d={`M${x} 120 C ${x - 4} ${top + 20} ${x + 4} ${top + 10} ${x + (i % 2 ? 6 : -6)} ${top}`}
          />
        ))}
      </g>
    </svg>
  );
}

/* ── Brass instruments, aged to verdigris ──────────────────────────── */
function Armillary({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 240" preserveAspectRatio="xMidYMax meet" className={className}>
      {/* carved plinth */}
      <rect className="obs-cons__plinth" x={58} y={222} width={44} height={16} fill="url(#consStone)" />
      <g className="obs-cons__brass">
        <path d="M80 132 L80 210" />
        <path className="obs-cons__verd-line" d="M60 210 L100 210" />
        <path d="M80 210 L62 222 M80 210 L98 222" />
        <circle cx="80" cy="86" r="46" />
        <ellipse cx="80" cy="86" rx="46" ry="17" />
        <ellipse cx="80" cy="86" rx="17" ry="46" />
        <ellipse cx="80" cy="86" rx="42" ry="24" transform="rotate(-23 80 86)" />
        <path className="obs-cons__verd-line" d="M34 86 L126 86" />
        <circle cx="80" cy="86" r="4" className="obs-cons__brass-core" />
      </g>
    </svg>
  );
}

function Telescope({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 220" preserveAspectRatio="xMidYMax meet" className={className}>
      <g className="obs-cons__brass">
        <path d="M90 120 L58 208" />
        <path d="M90 120 L122 208" />
        <path d="M90 120 L92 202" />
        <path className="obs-cons__verd-line" d="M58 208 L122 208" />
        <path d="M56 132 L132 58" className="obs-cons__brass-barrel" />
        <circle cx="132" cy="58" r="11" />
        <circle cx="56" cy="132" r="7" />
        <path d="M90 120 L94 96" />
      </g>
    </svg>
  );
}

/* ── Ferns reclaiming the corners ──────────────────────────────────── */
function FernCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 260"
      preserveAspectRatio="xMidYMid meet"
      className={`obs-cons__frond ${className ?? ""}`}
    >
      <g className="obs-cons__frond-stem">
        <path d="M6 6 C 60 40 92 92 108 168 C 114 198 116 226 112 252" />
        <path d="M6 6 C 70 20 120 44 158 92" />
        <path d="M6 6 C 40 60 54 120 52 190" />
      </g>
      <g className="obs-cons__frond-leaf">
        {[
          [38, 44],
          [64, 80],
          [86, 122],
          [100, 166],
          [108, 208],
          [96, 56],
          [128, 74],
          [150, 96],
          [40, 96],
          [50, 150],
        ].map(([cx, cy], i) => (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={22}
            ry={8}
            transform={`rotate(${-40 + i * 9} ${cx} ${cy})`}
          />
        ))}
      </g>
    </svg>
  );
}

/* ── Vines hanging from the vault ironwork ─────────────────────────── */
function HangingVine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 220" className={className} aria-hidden>
      <g className="obs-cons__tendril-stem">
        <path d="M30 0 C 26 44 34 88 30 140 C 28 168 32 190 30 216" />
      </g>
      <g className="obs-cons__tendril-leaf">
        {[
          [30, 40],
          [30, 78],
          [30, 116],
          [30, 152],
          [30, 184],
          [30, 206],
        ].map(([cx, cy], i) => (
          <path
            key={i}
            transform={`translate(${cx} ${cy}) rotate(${i % 2 ? 42 : -42})`}
            d="M0 0 C -9 -5 -10 -14 0 -18 C 10 -14 9 -5 0 0 Z"
          />
        ))}
      </g>
    </svg>
  );
}

/* ── A single leaf drifting down through the light ─────────────────── */
function DriftingLeaf() {
  return (
    <div className="obs-cons__leaf-fall" aria-hidden>
      <svg viewBox="0 0 40 56" className="obs-cons__leaf-svg">
        <path
          className="obs-cons__leaf-shape"
          d="M20 54 C 8 46 4 32 8 20 C 11 11 15 6 20 2 C 25 6 29 11 32 20 C 36 32 32 46 20 54 Z"
        />
        <path className="obs-cons__leaf-vein" d="M20 52 L20 6" />
      </svg>
    </div>
  );
}
