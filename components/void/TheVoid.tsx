"use client";

/**
 * Atlas entry field — root territories + living questions.
 * Phase A: territory inspect (ATTENTION = REVEAL).
 * OPEN: one territory expands into concepts, questions, charted works.
 * Does not start journeys from landmarks.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { AtlasV1QuestionId } from "@/lib/atlas-v1/content";
import {
  ROOT_TERRITORIES,
  placementsForTerritory,
  voidQuestionText,
  type QuestionPlacement,
  type RootTerritoryId,
} from "@/lib/atlas/architecture";
import {
  getTerritoryMatrix,
  type TerritoryConceptTrace,
  type TerritoryWorkTrace,
} from "@/lib/atlas/territory-landmarks";
import { TerritoryField } from "@/components/atlas-v1/TerritoryField";
import { cn } from "@/lib/utils";
import "@/components/atlas-v1/atlas-field.css";

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

export type VoidSurface = "threshold" | "questions" | "rest";

type Props = {
  onChoose: (id: AtlasV1QuestionId) => void;
  surface?: VoidSurface;
};

function QuestionLine({
  placement,
  onChoose,
}: {
  placement: QuestionPlacement;
  onChoose: (id: AtlasV1QuestionId) => void;
}) {
  const text = voidQuestionText(placement.questionId);
  const open = placement.journeyOpen;

  if (!open) {
    return (
      <li className="atlas-territory__question atlas-territory__question--forming">
        <span className="atlas-territory__q-text">{text}</span>
        <span className="atlas-territory__q-state">Forming</span>
      </li>
    );
  }

  return (
    <li className="atlas-territory__question">
      <button
        type="button"
        className="atlas-territory__q-btn"
        onClick={(e) => {
          e.stopPropagation();
          onChoose(placement.questionId);
        }}
      >
        <span className="atlas-territory__q-text">{text}</span>
        {placement.disposition === "forming" && (
          <span className="atlas-territory__q-state">Forming</span>
        )}
        {placement.disposition === "primary" && (
          <span className="atlas-territory__q-state atlas-territory__q-state--alive">
            Open
          </span>
        )}
      </button>
    </li>
  );
}

function ConceptTrace({ concept }: { concept: TerritoryConceptTrace }) {
  return (
    <li className="atlas-territory__trace atlas-territory__trace--quiet">
      <span className="atlas-territory__trace-mark" aria-hidden />
      <span className="atlas-territory__trace-title">{concept.title}</span>
    </li>
  );
}

function WorkTrace({ work }: { work: TerritoryWorkTrace }) {
  return (
    <li className="atlas-territory__trace">
      <span className="atlas-territory__trace-mark" aria-hidden />
      <Link
        href={work.href}
        className="atlas-territory__trace-link"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="atlas-territory__trace-title">{work.title}</span>
      </Link>
    </li>
  );
}

function TerritoryOpenInterior({
  territoryId,
  placements,
  onChoose,
}: {
  territoryId: RootTerritoryId;
  placements: readonly QuestionPlacement[];
  onChoose: (id: AtlasV1QuestionId) => void;
}) {
  const matrix = getTerritoryMatrix(territoryId);
  const hasConcepts = matrix.concepts.length > 0;
  const hasWorks = matrix.works.length > 0;

  return (
    <div className="atlas-territory__open">
      <div className="atlas-territory__open-block">
        <p className="atlas-territory__traces-eyebrow">Alive here</p>
        {placements.length > 0 ? (
          <ul className="atlas-territory__questions">
            {placements.map((p) => (
              <QuestionLine
                key={p.questionId}
                placement={p}
                onChoose={onChoose}
              />
            ))}
          </ul>
        ) : (
          <p className="atlas-territory__empty">
            No living question journey here yet — the territory remains.
          </p>
        )}
      </div>

      {hasConcepts && (
        <div className="atlas-territory__trace-group">
          <p className="atlas-territory__traces-eyebrow">Held here</p>
          <ul className="atlas-territory__trace-list">
            {matrix.concepts.map((concept) => (
              <ConceptTrace key={concept.id} concept={concept} />
            ))}
          </ul>
        </div>
      )}

      {hasWorks && (
        <div className="atlas-territory__trace-group">
          <p className="atlas-territory__traces-eyebrow">Charted here</p>
          <ul className="atlas-territory__trace-list">
            {matrix.works.map((work) => (
              <WorkTrace key={work.id} work={work} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TerritorySection({
  territoryId,
  depth,
  label,
  whisper,
  placements,
  onChoose,
  inspected,
  attended,
  receded,
  onAttend,
  onLeave,
  onToggleInspect,
}: {
  territoryId: RootTerritoryId;
  depth: string;
  label: string;
  whisper: string;
  placements: readonly QuestionPlacement[];
  onChoose: (id: AtlasV1QuestionId) => void;
  inspected: boolean;
  attended: boolean;
  receded: boolean;
  onAttend: () => void;
  onLeave: () => void;
  onToggleInspect: () => void;
}) {
  const lit = inspected || attended;
  const openQuestionCount = placements.filter((p) => p.journeyOpen).length;
  const formingCount = placements.length - openQuestionCount;

  return (
    <section
      className={cn("atlas-territory", `atlas-territory--${depth}`)}
      role="listitem"
      aria-labelledby={`territory-${territoryId}`}
      data-territory={territoryId}
      data-inspected={inspected ? "true" : undefined}
      data-attended={attended ? "true" : undefined}
      data-receded={receded ? "true" : undefined}
      data-lit={lit ? "true" : undefined}
      onMouseEnter={onAttend}
      onMouseLeave={onLeave}
      onFocusCapture={onAttend}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          onLeave();
        }
      }}
    >
      <TerritoryField territoryId={territoryId} />
      <div className="atlas-territory__mark" aria-hidden />
      <div className="atlas-territory__body">
        <button
          type="button"
          className="atlas-territory__inspect"
          aria-pressed={inspected}
          aria-label={
            inspected
              ? `${label}, open. Activate again to return to the full field.`
              : `Open ${label}`
          }
          onClick={(e) => {
            e.stopPropagation();
            onToggleInspect();
          }}
          onPointerDown={(e) => {
            // Keep document clear-handler from racing this toggle
            e.stopPropagation();
          }}
        >
          <h2 id={`territory-${territoryId}`} className="atlas-territory__name">
            {label}
          </h2>
          <p className="atlas-territory__whisper">{whisper}</p>
          {!inspected && placements.length > 0 && (
            <p className="atlas-territory__rest-cue" aria-hidden>
              {openQuestionCount > 0
                ? openQuestionCount === 1
                  ? "One living question"
                  : `${openQuestionCount} living questions`
                : formingCount === 1
                  ? "One question forming"
                  : `${formingCount} questions forming`}
            </p>
          )}
          {!inspected && placements.length === 0 && (
            <p className="atlas-territory__rest-cue" aria-hidden>
              Still gathering
            </p>
          )}
        </button>

        {inspected && (
          <TerritoryOpenInterior
            territoryId={territoryId}
            placements={placements}
            onChoose={onChoose}
          />
        )}
      </div>
    </section>
  );
}

export function TheVoid({ onChoose, surface = "threshold" }: Props) {
  const reduced = usePrefersReducedMotion();
  const isRest = surface === "rest";
  const showLanguage = !isRest;
  const ambient = !reduced && !isRest;
  /** Persistent inspect — one territory at a time */
  const [inspectedId, setInspectedId] = useState<RootTerritoryId | null>(null);
  /** Transient desktop attention (hover / focus) */
  const [attentionId, setAttentionId] = useState<RootTerritoryId | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const activeId = inspectedId ?? attentionId;

  useEffect(() => {
    if (!inspectedId) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      if (target.closest(".atlas-territory")) return;
      if (target.closest(".terrain-menu")) return;
      if (target.closest(".atlas-thread-cue")) return;
      if (target.closest(".atlas-thread-field")) return;
      setInspectedId(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [inspectedId]);

  return (
    <div
      className={cn(
        "the-void",
        isRest && "the-void--rest",
        showLanguage && "the-void--choosing",
        ambient && "the-void--alive",
      )}
      role="presentation"
      aria-hidden={isRest || undefined}
    >
      <div className="the-void-climate" aria-hidden>
        <div
          className={cn("the-void-fog", ambient && "the-void-fog--drift")}
          style={{ opacity: isRest ? 0.85 : 0.5 }}
        />
        <div
          className={cn(
            "the-void-vignette",
            ambient && "the-void-vignette--shift",
          )}
        />
        {ambient && <div className="the-void-dust" />}
        <div
          className={cn("the-void-light", isRest && "the-void-light--rest")}
          style={{
            opacity: isRest ? 0.38 : 0.62,
            transform: `scale(${isRest ? 1 : 1.02})`,
          }}
        />
      </div>

      {showLanguage && (
        <div
          className={cn(
            "the-void-language the-void-language--territories",
            !reduced && "the-void-language--enter",
          )}
        >
          <header className="atlas-map-head">
            <p className="atlas-map-head__eyebrow">Atlas</p>
            <h1 className="atlas-map-head__title">Root territories</h1>
            <p className="atlas-map-head__lede">
              Permanent regions of inquiry. Beneath them, questions forming now.
            </p>
          </header>

          <div
            ref={fieldRef}
            className="atlas-territories"
            role="list"
            data-field-active={activeId ? "true" : undefined}
            data-field-open={inspectedId ? "true" : undefined}
          >
            {ROOT_TERRITORIES.map((territory) => {
              const inspected = inspectedId === territory.id;
              const attended =
                !inspectedId && attentionId === territory.id;
              const lit = inspected || attended;
              return (
                <TerritorySection
                  key={territory.id}
                  territoryId={territory.id}
                  depth={territory.depth}
                  label={territory.label}
                  whisper={territory.whisper}
                  placements={placementsForTerritory(territory.id)}
                  onChoose={onChoose}
                  inspected={inspected}
                  attended={attended}
                  receded={Boolean(inspectedId) && !inspected}
                  onAttend={() => {
                    if (inspectedId) return;
                    setAttentionId(territory.id);
                  }}
                  onLeave={() => {
                    setAttentionId((id) =>
                      id === territory.id ? null : id,
                    );
                  }}
                  onToggleInspect={() => {
                    setAttentionId(null);
                    setInspectedId((id) =>
                      id === territory.id ? null : territory.id,
                    );
                  }}
                />
              );
            })}
          </div>

          <p className="the-void-charts">
            <Link href="/atlas/charts">Mapped investigations</Link>
          </p>
        </div>
      )}
    </div>
  );
}
