"use client";

import { TerrainLink } from "@/components/navigation";
import { motion } from "framer-motion";
import { PATH_CHOICES } from "@/lib/concepts/constellation-discovery";

interface ChoosePathPanelProps {
  visible: boolean;
  onPathSelect: (conceptId: string) => void;
}

export function ChoosePathPanel({ visible, onPathSelect }: ChoosePathPanelProps) {
  if (!visible) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 2.4, delay: 0.6, ease: [0.45, 0.05, 0.55, 0.95] }}
      className="pointer-events-auto absolute bottom-[10.5rem] left-5 z-20 hidden max-w-[11rem] opacity-80 lg:block"
      aria-label="Six paths from the center"
    >
      <p className="type-chamber text-[0.5rem] text-ivory/18">
        Six paths radiate outward
      </p>
      <ul className="mt-4 space-y-2.5">
        {PATH_CHOICES.map((path) => (
          <li key={path.id}>
            <TerrainLink
              href={`/themes/${path.slug}`}
              onClick={() => onPathSelect(path.id)}
              className="font-heading text-[0.75rem] text-ivory/28 transition-colors duration-[1.4s] hover:text-ivory/52"
            >
              {path.title}
            </TerrainLink>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
}
