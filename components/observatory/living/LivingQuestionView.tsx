"use client";

import { useEffect, useState } from "react";
import { TerrainLink } from "@/components/navigation";
import {
  getOpenedInquiries,
  type LivingInquiry,
} from "@/lib/observatory/living-field";
import { cn } from "@/lib/utils";

type Beat = "alone" | "available" | "related" | "named" | "contested";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Lens — hold two observations together before anything is named.
 * The visitor relates. Explanation arrives late.
 */
export function LivingQuestionView({
  question: inquiry,
}: {
  question: LivingInquiry;
}) {
  const [beat, setBeat] = useState<Beat>("alone");
  const further = getOpenedInquiries(inquiry);
  const primary = inquiry.observations[0];
  const secondary = inquiry.observations[1];
  const remainder = inquiry.observations.slice(2);
  const [exA, exB] = inquiry.explanations;

  useEffect(() => {
    const ms = prefersReducedMotion() ? 350 : 2600;
    const t = window.setTimeout(() => setBeat("available"), ms);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (beat !== "related") return;
    const ms = prefersReducedMotion() ? 700 : 5200;
    const t = window.setTimeout(() => setBeat("named"), ms);
    return () => window.clearTimeout(t);
  }, [beat]);

  useEffect(() => {
    if (beat !== "named") return;
    const ms = prefersReducedMotion() ? 900 : 6000;
    const t = window.setTimeout(() => setBeat("contested"), ms);
    return () => window.clearTimeout(t);
  }, [beat]);

  function relate() {
    if (beat !== "available") return;
    setBeat("related");
  }

  if (!primary || !secondary) return null;

  const near = beat === "related" || beat === "named" || beat === "contested";
  const showQuestion = beat === "named" || beat === "contested";
  const showContest = beat === "contested";

  return (
    <div className={cn("obs-lens", `obs-lens--${beat}`)}>
      <div className="obs-lens__glass" aria-hidden>
        <div className="obs-lens__rim" />
        <div className="obs-lens__fog" />
      </div>

      <TerrainLink href="/observatory" className="obs-lens__leave">
        Field
      </TerrainLink>

      <div className="obs-lens__stage">
        <div className={cn("obs-lens__pair", near && "obs-lens__pair--near")}>
          <p className="obs-lens__obs obs-lens__obs--a">{primary.notice}</p>

          {(beat === "available" || near) && (
            <button
              type="button"
              className={cn(
                "obs-lens__obs obs-lens__obs--b",
                near ? "obs-lens__obs--near" : "obs-lens__obs--far",
              )}
              onClick={relate}
              disabled={near}
              aria-label={
                near
                  ? "Second observation, held with the first"
                  : "Bring this observation into view with the first"
              }
            >
              {secondary.notice}
            </button>
          )}
        </div>

        {near && !showQuestion && (
          <div className="obs-lens__hold" aria-hidden />
        )}

        {showQuestion && (
          <h1 className="obs-lens__question">{inquiry.question}</h1>
        )}

        {showContest && exA && exB && (
          <div className="obs-lens__poles">
            <p className="obs-lens__pole">{exA.claim}</p>
            <span className="obs-lens__versus" aria-hidden />
            <p className="obs-lens__pole">{exB.claim}</p>
          </div>
        )}

        {showContest && remainder.length > 0 && (
          <div className="obs-lens__more">
            {remainder.map((o) => (
              <p key={o.id} className="obs-lens__more-obs">
                {o.notice}
              </p>
            ))}
          </div>
        )}

        {showContest && inquiry.tensions[0] && (
          <p className="obs-lens__unresolved">{inquiry.tensions[0]}</p>
        )}

        {showContest && further.length > 0 && (
          <nav className="obs-lens__drift" aria-label="Related inquiries">
            {further.map((q) => (
              <TerrainLink
                key={q.id}
                href={`/observatory/q/${q.slug}`}
                className="obs-lens__drift-link"
              >
                {q.question}
              </TerrainLink>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
