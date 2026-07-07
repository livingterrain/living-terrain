"use client";

import { TerrainLink } from "@/components/navigation";
import { cn } from "@/lib/utils";

/** Fixed star field — deterministic, no runtime generation */
const STARS: ReadonlyArray<{ cx: number; cy: number; r: number; o: number }> = [
  { cx: 8, cy: 12, r: 0.12, o: 0.35 },
  { cx: 14, cy: 22, r: 0.08, o: 0.28 },
  { cx: 22, cy: 9, r: 0.1, o: 0.32 },
  { cx: 31, cy: 16, r: 0.14, o: 0.4 },
  { cx: 38, cy: 7, r: 0.08, o: 0.25 },
  { cx: 46, cy: 14, r: 0.1, o: 0.3 },
  { cx: 54, cy: 11, r: 0.12, o: 0.38 },
  { cx: 62, cy: 19, r: 0.08, o: 0.22 },
  { cx: 71, cy: 8, r: 0.1, o: 0.34 },
  { cx: 79, cy: 15, r: 0.14, o: 0.42 },
  { cx: 86, cy: 10, r: 0.08, o: 0.26 },
  { cx: 93, cy: 18, r: 0.1, o: 0.3 },
  { cx: 11, cy: 32, r: 0.08, o: 0.24 },
  { cx: 19, cy: 28, r: 0.1, o: 0.32 },
  { cx: 27, cy: 35, r: 0.12, o: 0.36 },
  { cx: 44, cy: 26, r: 0.08, o: 0.28 },
  { cx: 58, cy: 31, r: 0.1, o: 0.3 },
  { cx: 67, cy: 24, r: 0.08, o: 0.22 },
  { cx: 74, cy: 33, r: 0.12, o: 0.35 },
  { cx: 88, cy: 27, r: 0.08, o: 0.26 },
  { cx: 16, cy: 42, r: 0.1, o: 0.3 },
  { cx: 33, cy: 44, r: 0.08, o: 0.24 },
  { cx: 51, cy: 38, r: 0.12, o: 0.34 },
  { cx: 69, cy: 41, r: 0.08, o: 0.28 },
  { cx: 82, cy: 36, r: 0.1, o: 0.32 },
];

function ThresholdBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#06080c]" />

      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 120% 42% at 50% 100%, rgba(196, 160, 106, 0.09) 0%, transparent 58%)",
            "radial-gradient(ellipse 70% 28% at 50% 88%, rgba(136, 152, 168, 0.06) 0%, transparent 52%)",
            "radial-gradient(ellipse 55% 22% at 50% 92%, rgba(212, 184, 120, 0.04) 0%, transparent 48%)",
          ].join(", "),
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#c8d0dc"
            opacity={s.o}
          />
        ))}
      </svg>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 85% at 50% 45%, transparent 32%, rgba(4, 6, 8, 0.72) 100%)",
        }}
      />
    </div>
  );
}

interface ThresholdEntranceProps {
  crossing?: boolean;
  entering?: boolean;
  onEnter: () => void;
}

export function ThresholdEntrance({
  crossing = false,
  entering = false,
  onEnter,
}: ThresholdEntranceProps) {
  return (
    <div
      className={cn(
        "threshold-entrance absolute inset-0 z-30 flex flex-col overflow-y-auto overscroll-contain bg-[#06080c] text-ivory transition-opacity duration-500 ease-out",
        crossing && "pointer-events-none opacity-0",
      )}
      style={{
        paddingTop: "max(1.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <ThresholdBackdrop />

      <main
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 py-10 text-center sm:px-8"
        style={{
          paddingLeft: "max(1.25rem, env(safe-area-inset-left, 0px))",
          paddingRight: "max(1.25rem, env(safe-area-inset-right, 0px))",
        }}
      >
        <p className="type-chamber text-ivory/36">Threshold</p>

        <h1 className="mt-5 font-heading text-[1.75rem] leading-[1.12] text-ivory sm:mt-7 sm:text-3xl md:text-[2.25rem]">
          Living Terrain
        </h1>

        <div className="mx-auto mt-8 max-w-md space-y-5 text-left text-[0.9375rem] leading-[1.92] text-ivory/52 sm:mt-10 sm:max-w-lg sm:text-center sm:text-base sm:leading-[1.96]">
          <p className="font-heading text-lg italic leading-[1.65] text-ivory/60 sm:text-xl">
            Something vast and quiet lies ahead.
          </p>
          <p>You need not understand it yet.</p>
          <p className="text-ivory/44">Step forward when something pulls you.</p>
        </div>

        {!crossing && (
          <div className="mt-12 grid w-full gap-10 sm:mt-14 sm:grid-cols-2 sm:gap-x-16">
            <button
              type="button"
              onClick={onEnter}
              disabled={entering}
              className="group touch-manipulation border-t border-ivory/[0.07] py-7 text-left transition-[border-color,opacity] duration-500 disabled:pointer-events-none disabled:opacity-45 sm:hover:border-forest-light/22"
            >
              <p className="font-heading text-[1.0625rem] tracking-[0.012em] text-ivory/78 sm:text-lg">
                Step onto the terrain
              </p>
              <p className="mt-2.5 font-heading text-[0.8125rem] italic leading-relaxed text-ivory/38">
                The map is carved in stone beyond this ridge.
              </p>
            </button>

            <TerrainLink
              href="/observatory"
              className="group block touch-manipulation border-t border-ivory/[0.07] py-7 text-left transition-[border-color] duration-500 sm:hover:border-ivory/18"
            >
              <p className="font-heading text-[1.0625rem] tracking-[0.012em] text-ivory/78 sm:text-lg">
                Follow the amber light
              </p>
              <p className="mt-2.5 font-heading text-[0.8125rem] italic leading-relaxed text-ivory/38">
                Something is still forming in the dark.
              </p>
            </TerrainLink>
          </div>
        )}
      </main>
    </div>
  );
}
