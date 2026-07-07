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

/** Extra pinpricks — mobile viewport only, static */
const MOBILE_STARS: ReadonlyArray<{ cx: number; cy: number; r: number; o: number }> = [
  { cx: 5, cy: 6, r: 0.1, o: 0.3 },
  { cx: 18, cy: 4, r: 0.08, o: 0.22 },
  { cx: 42, cy: 5, r: 0.09, o: 0.26 },
  { cx: 63, cy: 3, r: 0.07, o: 0.2 },
  { cx: 91, cy: 6, r: 0.1, o: 0.28 },
  { cx: 7, cy: 48, r: 0.08, o: 0.18 },
  { cx: 94, cy: 52, r: 0.09, o: 0.2 },
  { cx: 24, cy: 58, r: 0.07, o: 0.16 },
  { cx: 76, cy: 56, r: 0.08, o: 0.18 },
];

function ThresholdBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#06080c]" />

      <div className="threshold-entrance__horizon absolute inset-0" />

      <div className="threshold-entrance__title-glow absolute inset-0 sm:hidden" />

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

      <svg
        className="absolute inset-0 h-full w-full sm:hidden"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {MOBILE_STARS.map((s, i) => (
          <circle
            key={`m-${i}`}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#d8dce4"
            opacity={s.o}
          />
        ))}
      </svg>

      <div className="threshold-entrance__vignette absolute inset-0" />
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
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col",
          "max-sm:min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] max-sm:justify-between max-sm:px-[max(1.125rem,env(safe-area-inset-left))] max-sm:py-7",
          "sm:items-center sm:justify-center sm:px-8 sm:py-10 sm:text-center",
        )}
        style={{
          paddingLeft: undefined,
          paddingRight: undefined,
        }}
      >
        <header
          className={cn(
            "flex flex-col items-center text-center",
            "max-sm:flex-1 max-sm:justify-center max-sm:pt-4 max-sm:pb-6",
          )}
        >
          <p className="type-chamber text-ivory/36 max-sm:text-[0.625rem] max-sm:tracking-[0.24em] max-sm:text-ivory/32">
            Threshold
          </p>

          <h1
            className={cn(
              "mt-5 font-heading text-ivory",
              "max-sm:mt-4 max-sm:text-[1.5625rem] max-sm:leading-[1.14] max-sm:tracking-[-0.01em]",
              "sm:mt-7 sm:text-3xl sm:leading-[1.12] md:text-[2.25rem]",
            )}
          >
            Living Terrain
          </h1>

          <div
            className={cn(
              "mx-auto mt-8 space-y-5 text-ivory/52",
              "max-sm:mt-6 max-sm:max-w-[17rem] max-sm:space-y-3.5 max-sm:text-center max-sm:text-[0.8125rem] max-sm:leading-[1.78]",
              "sm:mt-10 sm:max-w-lg sm:text-left sm:text-base sm:leading-[1.96] sm:text-center",
            )}
          >
            <p
              className={cn(
                "font-heading italic leading-[1.65] text-ivory/60",
                "max-sm:text-[0.9375rem] max-sm:leading-[1.62] max-sm:text-ivory/58",
                "sm:text-lg sm:text-xl",
              )}
            >
              Something vast and quiet lies ahead.
            </p>
            <p className="max-sm:text-charcoal-muted">You need not understand it yet.</p>
            <p className="max-sm:text-ivory/40 sm:text-ivory/44">
              Step forward when something pulls you.
            </p>
          </div>
        </header>

        {!crossing && (
          <div
            className={cn(
              "w-full",
              "max-sm:space-y-3 max-sm:pb-[max(0.5rem,env(safe-area-inset-bottom))]",
              "sm:mt-14 sm:grid sm:grid-cols-2 sm:gap-x-16 sm:gap-y-0",
            )}
          >
            <button
              type="button"
              onClick={onEnter}
              disabled={entering}
              className={cn(
                "threshold-entrance__choice threshold-entrance__choice--primary",
                "group touch-manipulation text-left transition-[border-color,opacity,box-shadow] duration-500",
                "disabled:pointer-events-none disabled:opacity-45",
                "sm:border-t sm:border-ivory/[0.07] sm:py-7 sm:hover:border-gold/25",
              )}
            >
              <p
                className={cn(
                  "font-heading tracking-[0.012em] text-ivory/78",
                  "max-sm:text-[0.9375rem] max-sm:text-ivory/90",
                  "sm:text-lg",
                )}
              >
                Step onto the terrain
              </p>
              <p
                className={cn(
                  "mt-2.5 font-heading italic leading-relaxed text-ivory/38",
                  "max-sm:mt-1.5 max-sm:text-[0.75rem] max-sm:leading-[1.55] max-sm:text-charcoal-muted",
                  "sm:text-[0.8125rem]",
                )}
              >
                The map is carved in stone beyond this ridge.
              </p>
            </button>

            <TerrainLink
              href="/observatory"
              className={cn(
                "threshold-entrance__choice",
                "group block touch-manipulation text-left transition-[border-color,box-shadow] duration-500",
                "sm:border-t sm:border-ivory/[0.07] sm:py-7 sm:hover:border-ivory/18",
              )}
            >
              <p
                className={cn(
                  "font-heading tracking-[0.012em] text-ivory/78",
                  "max-sm:text-[0.9375rem] max-sm:text-ivory/88",
                  "sm:text-lg",
                )}
              >
                Follow the amber light
              </p>
              <p
                className={cn(
                  "mt-2.5 font-heading italic leading-relaxed text-ivory/38",
                  "max-sm:mt-1.5 max-sm:text-[0.75rem] max-sm:leading-[1.55] max-sm:text-charcoal-muted",
                  "sm:text-[0.8125rem]",
                )}
              >
                Something is still forming in the dark.
              </p>
            </TerrainLink>
          </div>
        )}
      </main>
    </div>
  );
}
