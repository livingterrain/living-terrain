"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTerrainSoundOptional } from "@/components/sound";
import type { RealmPalette } from "@/lib/realms/types";
import { realmFade } from "./motion";

interface RealmWhisperProps {
  palette: RealmPalette;
  label: string;
  whisper?: string;
  href?: string;
  active?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
  className?: string;
}

export function RealmWhisper({
  palette,
  label,
  whisper,
  href,
  active,
  onHover,
  onLeave,
  className,
}: RealmWhisperProps) {
  const sound = useTerrainSoundOptional();

  const inner = (
    <motion.div
      onMouseEnter={() => {
        onHover?.();
        sound?.playHover(label);
      }}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.8, ease: realmFade.ease }}
      className={className}
      style={{
        borderColor: active ? palette.accent : `${palette.line}`,
        backgroundColor: active ? palette.accentSoft : "transparent",
      }}
    >
      <p
        className="font-heading text-base sm:text-lg"
        style={{ color: active ? palette.text : palette.textMuted }}
      >
        {label}
      </p>
      {whisper && (
        <p
          className="mt-2 text-sm italic leading-relaxed"
          style={{
            color: palette.textMuted,
            opacity: active ? 1 : 0.65,
          }}
        >
          {whisper}
        </p>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-sm border px-5 py-4 transition-colors duration-[1.2s]"
        style={{ borderColor: palette.line }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className="rounded-sm border px-5 py-4"
      style={{ borderColor: palette.line }}
    >
      {inner}
    </div>
  );
}

interface RealmThreadLineProps {
  palette: RealmPalette;
  title: string;
  subtitle?: string;
  href: string;
  year?: string;
}

export function RealmThreadLine({
  palette,
  title,
  subtitle,
  href,
  year,
}: RealmThreadLineProps) {
  return (
    <Link
      href={href}
      className="group block border-b py-5 transition-colors duration-[1.2s]"
      style={{ borderColor: palette.line }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3
          className="font-heading text-lg transition-colors duration-700 group-hover:opacity-100"
          style={{ color: palette.text, opacity: 0.88 }}
        >
          {title}
        </h3>
        {year && (
          <span
            className="shrink-0 text-[0.6875rem] tracking-[0.06em]"
            style={{ color: palette.textMuted }}
          >
            {year}
          </span>
        )}
      </div>
      {subtitle && (
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: palette.textMuted }}
        >
          {subtitle}
        </p>
      )}
    </Link>
  );
}
