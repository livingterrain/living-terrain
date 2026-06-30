"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TextLink } from "@/components/design-system";
import { MediumPublicationLink } from "@/components/reading/MediumPublicationLink";
import type { Essay, FieldNote, Question, Project } from "@/lib/content/types";
import { AmbientEnvironment } from "./AmbientEnvironment";
import { CatalogEntry } from "./CatalogEntry";
import { Chamber } from "./Chamber";
import { FieldFragment } from "./FieldFragment";
import { ChamberSpineRoom, QuestionsSpineRoom } from "./home";

interface LivingArchiveProps {
  questions: Question[];
  essays: Essay[];
  fieldNotes: FieldNote[];
  project: Project;
}

export function LivingArchive({
  questions,
  essays,
  fieldNotes,
  project,
}: LivingArchiveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const thresholdRef = useRef<HTMLDivElement>(null);
  const thresholdInView = useInView(thresholdRef, { once: true });

  return (
    <div ref={containerRef} className="relative">
      <AmbientEnvironment scrollRef={containerRef} />

      {/* Threshold — the doorway */}
      <section className="relative flex min-h-[100svh] flex-col justify-center">
        <div
          ref={thresholdRef}
          className="relative z-10 mx-auto w-full max-w-3xl px-6 sm:px-10 lg:px-12"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={thresholdInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 2, ease: [0.45, 0.05, 0.55, 0.95] }}
          >
            <p className="type-folio">Threshold</p>
            <h1 className="type-display mt-10 max-w-2xl text-balance">
              Living Terrain
            </h1>
            <p className="type-lead mt-12 max-w-lg text-[1.125rem] leading-[1.8]">
              You are crossing into another layer — a living archive beneath
              ordinary life.
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={thresholdInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 2,
              delay: 0.8,
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
            className="type-meta animate-pulse-breath mt-24"
          >
            Descend to wander
          </motion.p>
        </div>
      </section>

      {/* Vestibule */}
      <Chamber name="Vestibule" tone="warm" className="py-32 sm:py-40">
        <div className="mx-auto max-w-2xl px-6 sm:px-10 lg:px-12">
          <p className="type-body text-center text-[1rem] leading-[1.9] sm:text-lg">
            This is not a blog. It is a corridor of rooms — a gallery of
            inquiries, a card catalog of essays, a field desk of observations,
            an observatory still being built. Move slowly. Let relationships
            surface.
          </p>
        </div>
      </Chamber>

      {/* Pathways — intellectual spine */}
      <QuestionsSpineRoom questions={questions} />

      {/* Central chamber */}
      <ChamberSpineRoom project={project} />

      {/* Card Catalog */}
      <Chamber
        id="catalog"
        name="Card Catalog"
        tone="warm"
        className="py-24 sm:py-32"
      >
        <div className="mx-auto max-w-4xl px-6 pt-16 sm:px-10 lg:px-12">
          <h2 className="type-room">Essay index</h2>
          <p className="type-body mt-4 max-w-lg">
            Essays published on Medium — traced here as they connect to questions
            across the terrain.
          </p>
          <MediumPublicationLink className="mt-6 inline-block" />
          {essays.length > 0 && (
            <ul className="mt-16 space-y-0">
              {essays.slice(0, 3).map((essay, i) => (
                <CatalogEntry key={essay.id} essay={essay} index={i} />
              ))}
            </ul>
          )}
        </div>
      </Chamber>

      {/* Field Desk */}
      <Chamber id="field-desk" name="Field Desk" className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 pt-16 sm:px-10 lg:px-12">
          <h2 className="type-room">Field notes</h2>
          <p className="type-body mt-4 max-w-md">
            Fragments left on the desk — observations recorded without hurry.
          </p>
          <TextLink href="/field-notes" className="mt-6 inline-block">
            Open the journal
          </TextLink>
          <div className="mt-16 space-y-6">
            {fieldNotes.map((note, i) => (
              <FieldFragment key={note.id} note={note} index={i} />
            ))}
          </div>
        </div>
      </Chamber>

      {/* Observatory Annex */}
      <Chamber id="observatory" name="Annex" tone="dim" className="py-32 sm:py-40">
        <div className="relative mx-auto max-w-xl px-6 sm:px-10 lg:px-12">
          <div className="absolute bottom-0 left-1/2 h-px w-32 -translate-x-1/2 bg-forest/40" />
          <p className="type-folio">Observatory</p>
          <h2 className="type-room mt-6">The Observatory</h2>
          <p className="type-body mt-6 leading-[1.9]">
            A field station for observations — where visitors add to a shared
            investigation rather than arguing on the internet.
          </p>
          <div className="mt-12">
            <TextLink href="/observatory">Enter the Observatory →</TextLink>
          </div>
        </div>
      </Chamber>
    </div>
  );
}
