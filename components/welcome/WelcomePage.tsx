"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { TerrainLink } from "@/components/navigation";
import { NAVIGATION } from "@/lib/atmosphere/tempo";
import { cn } from "@/lib/utils";

const ease = NAVIGATION.ease;

const STARS = Array.from({ length: 48 }, (_, i) => ({
  x: ((i * 127.1) % 1000) / 10,
  y: ((i * 311.7) % 1000) / 10,
  o: 0.1 + (i % 7) * 0.04,
  r: i % 11 === 0 ? 1 : 0.6,
}));

function WelcomeAtmosphere() {
  const stars = useMemo(
    () =>
      STARS.map((s) => (
        <circle
          key={`${s.x}-${s.y}`}
          cx={s.x}
          cy={s.y}
          r={s.r * 0.12}
          fill="currentColor"
          opacity={s.o}
        />
      )),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#040506]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 38%, #1a1510 0%, transparent 68%)",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full text-[#d8dce4]/80"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {stars}
      </svg>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 100%, #c4a06a 0%, transparent 55%)",
        }}
      />
    </div>
  );
}

interface PassageProps {
  label: string;
  children: React.ReactNode;
  delay: number;
  reduced: boolean;
}

function Passage({ label, children, delay, reduced }: PassageProps) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.01 : 1.9, delay: reduced ? 0 : delay, ease }}
    >
      <p className="font-body text-[0.625rem] uppercase tracking-[0.2em] text-ivory/28">
        {label}
      </p>
      <div className="mt-4 text-[0.9375rem] leading-[1.88] text-ivory/50 sm:text-base sm:leading-[1.92]">
        {children}
      </div>
    </motion.div>
  );
}

interface EntryProps {
  href: string;
  title: string;
  hint: string;
  delay: number;
  reduced: boolean;
}

function Entry({ href, title, hint, delay, reduced }: EntryProps) {
  const classes = cn(
    "group block touch-manipulation border-t border-ivory/[0.07] py-7 transition-[border-color] duration-[900ms] sm:pt-8",
    "hover:border-forest-light/22 sm:hover:border-ivory/16",
  );

  const inner = (
    <>
      <p className="font-heading text-[1.0625rem] tracking-[0.012em] text-ivory/88 transition-colors duration-[900ms] sm:text-lg sm:group-hover:text-ivory">
        {title}
      </p>
      <p className="mt-2 text-[0.8125rem] leading-relaxed text-ivory/38 transition-colors duration-[900ms] sm:group-hover:text-ivory/48">
        {hint}
      </p>
    </>
  );

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.01 : 1.85, delay: reduced ? 0 : delay, ease }}
    >
      <TerrainLink href={href} className={classes}>
        {inner}
      </TerrainLink>
    </motion.div>
  );
}

export function WelcomePage() {
  const reduced = useReducedMotion() ?? false;

  return (
    <div className="fixed inset-0 overflow-x-hidden overflow-y-auto text-ivory supports-[height:100dvh]:min-h-[100dvh] min-h-screen">
      <WelcomeAtmosphere />

      <div
        className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col px-[max(1.25rem,env(safe-area-inset-left,0px))] py-16 sm:px-10 sm:py-24"
        style={{
          paddingRight: "max(1.25rem, env(safe-area-inset-right, 0px))",
          paddingTop: "max(3.5rem, env(safe-area-inset-top))",
          paddingBottom: "max(3.5rem, env(safe-area-inset-bottom))",
        }}
      >
        <motion.header
          className="text-center"
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.01 : 2, delay: reduced ? 0 : 0.15, ease }}
        >
          <p className="font-body text-[0.6875rem] uppercase tracking-[0.22em] text-ivory/30">
            Welcome
          </p>
          <h1 className="mt-5 font-heading text-[1.875rem] leading-[1.12] text-ivory sm:text-[2.25rem]">
            Living Terrain
          </h1>
          <p className="mx-auto mt-8 max-w-md font-heading text-lg italic leading-[1.75] text-ivory/45 sm:text-xl">
            You have stepped into unfamiliar ground — quiet, wide, and waiting
            to be walked in your own time.
          </p>
        </motion.header>

        <div className="mt-16 space-y-14 sm:mt-20 sm:space-y-16">
          <Passage label="What is Living Terrain?" delay={0.35} reduced={reduced}>
            <p>
              An observatory for ideas, relationships, and the hidden structures
              beneath reality — part map, part library, neither finished.
            </p>
            <p className="mt-4 text-ivory/42">
              It is a place to think slowly, where questions matter more than
              categories and connections matter more than conclusions.
            </p>
          </Passage>

          <Passage label="How should it be explored?" delay={0.5} reduced={reduced}>
            <p>Not in order. Not to completion.</p>
            <p className="mt-4">
              Follow curiosity. Follow a relationship between two ideas. Follow a
              single thread until it opens into something you did not expect.
            </p>
            <p className="mt-4 font-heading italic text-ivory/40">
              There is no correct path — only attention, returned again and again.
            </p>
          </Passage>

          <Passage label="Where might I begin?" delay={0.65} reduced={reduced}>
            <p>Anywhere that draws you.</p>
            <p className="mt-4">
              The radiant center of the map, a realm that names something you have
              been wondering about, or a field note that feels like it was
              written for this hour.
            </p>
            <p className="mt-4 text-ivory/42">
              The terrain rewards slow movement. You need not see it all today.
            </p>
          </Passage>
        </div>

        <motion.div
          className="mt-20 grid gap-10 sm:mt-24 sm:grid-cols-3 sm:gap-8"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0.01 : 1.6, delay: reduced ? 0 : 0.85, ease }}
        >
          <Entry
            href="/"
            title="Explore the Terrain"
            hint="Wander the constellation of ideas"
            delay={0.9}
            reduced={reduced}
          />
          <Entry
            href="/observatory"
            title="Visit the Observatory"
            hint="Essays, field notes, and threads"
            delay={1.02}
            reduced={reduced}
          />
          <Entry
            href="/about"
            title="Meet Chelsea"
            hint="The guide, not the subject"
            delay={1.14}
            reduced={reduced}
          />
        </motion.div>

        <motion.footer
          className="mt-auto pt-20 text-center"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0.01 : 1.4, delay: reduced ? 0 : 1.3, ease }}
        >
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center px-3 text-[0.75rem] tracking-[0.06em] text-ivory/28 transition-colors duration-700 hover:text-ivory/45 active:text-ivory/55"
          >
            Enter without ceremony →
          </Link>
        </motion.footer>
      </div>
    </div>
  );
}
