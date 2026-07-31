"use client";

import { TerrainLink } from "@/components/navigation";
import { getLivingInquiries } from "@/lib/observatory/living-field";

/**
 * Notebook field — phenomena only.
 * No aphorisms. No worldview. Observations that could be independently checked.
 */
export function LivingObservatory() {
  const inquiries = getLivingInquiries();

  return (
    <div className="obs-notebook">
      <div className="obs-notebook__desk" aria-hidden>
        <div className="obs-notebook__shade" />
      </div>

      <TerrainLink href="/" className="obs-notebook__leave">
        Living Terrain
      </TerrainLink>

      <div className="obs-notebook__page">
        <header className="obs-notebook__head">
          <p className="obs-notebook__label">Observatory</p>
          <p className="obs-notebook__sub">Field notes — phenomena</p>
        </header>

        <ol className="obs-notebook__entries">
          {inquiries.map((inquiry) => (
            <li key={inquiry.id} className="obs-notebook__entry">
              <TerrainLink
                href={`/observatory/q/${inquiry.slug}`}
                className="obs-notebook__phenomenon"
              >
                <span className="obs-notebook__num" aria-hidden>
                  {String(inquiry.entry).padStart(2, "0")}
                </span>
                <span className="obs-notebook__text">{inquiry.phenomenon}</span>
              </TerrainLink>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
