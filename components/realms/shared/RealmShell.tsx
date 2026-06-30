"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { ThemeHub } from "@/lib/realms/types";
import { getRealmMetaphor } from "@/lib/realms/metaphors";
import { TerrainLink } from "@/components/navigation";
import { Thread } from "@/components/thread";
import { refFromTheme } from "@/lib/relationships";
import { RealmAtmosphere } from "./RealmAtmosphere";
import { realmEntry } from "./motion";

interface RealmShellProps {
  hub: ThemeHub;
  children: ReactNode;
  atmosphereVariant?: "default" | "cathedral" | "network";
}

export function RealmShell({
  hub,
  children,
  atmosphereVariant = "default",
}: RealmShellProps) {
  const { config, theme, whisper } = hub;
  const metaphor = getRealmMetaphor(config.slug);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{ backgroundColor: config.palette.bg, color: config.palette.text }}
    >
      <RealmAtmosphere
        palette={config.palette}
        slug={config.slug}
        variant={atmosphereVariant}
      />

      <motion.header
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={realmEntry.header}
        className="relative z-20 flex shrink-0 px-5 py-4 sm:px-8"
      >
        <TerrainLink
          href="/"
          className="text-[0.6875rem] tracking-[0.08em] transition-opacity duration-700 hover:opacity-80"
          style={{ color: config.palette.textMuted }}
        >
          ← The map
        </TerrainLink>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={realmEntry.title}
        className="relative z-10 shrink-0 px-5 pb-8 pt-2 text-center sm:px-8 sm:pb-12"
      >
        <p
          className="font-heading text-sm italic sm:text-base"
          style={{ color: config.palette.textMuted }}
        >
          {whisper}
        </p>
        <h1 className="mt-4 font-heading text-3xl tracking-wide sm:text-4xl">
          {theme.title}
        </h1>
        {theme.description && (
          <p
            className="mx-auto mt-4 max-w-lg text-sm leading-relaxed sm:text-base"
            style={{ color: config.palette.textMuted }}
          >
            {theme.description}
          </p>
        )}
        <p
          className="mx-auto mt-5 max-w-md text-[0.8125rem] italic leading-relaxed"
          style={{ color: config.palette.textMuted, opacity: 0.75 }}
        >
          {metaphor.line}
        </p>
      </motion.div>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {children}
        <div className="px-5 pb-10 sm:px-8">
          <Thread
            nodeRef={refFromTheme(theme)}
            returnHref={`/themes/${theme.slug}`}
            className="max-w-lg mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
