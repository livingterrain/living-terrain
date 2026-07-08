"use client";

import Link from "next/link";
import { ObservatoryEmergence } from "./ObservatoryEmergence";

export interface ObservationSlip {
  id: string;
  kind: "observation" | "field-note";
  title: string;
  excerpt: string;
  href: string;
  date: string;
  themes: string[];
  attribution?: string;
}

interface ObservatoryRecentObservationsProps {
  slips: ObservationSlip[];
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

/**
 * Zone 2 — Recent Observations.
 * Short things noticed before they harden into conclusions. Laid out as slips
 * on the surface of the table, not as a feed of articles.
 */
export function ObservatoryRecentObservations({
  slips,
}: ObservatoryRecentObservationsProps) {
  if (slips.length === 0) return null;

  return (
    <ObservatoryEmergence minHeight="min-h-[70vh] sm:min-h-[90vh]" delay={0.08}>
      <div className="obs-recent mx-auto w-full max-w-3xl">
        <div className="obs-fx obs-fx--table obs-recent-table mx-auto">
          <span className="obs-fx__legs" aria-hidden />
          <div className="obs-fx__plaque obs-recent-table__plaque">
            Recent observations
          </div>
          <p className="obs-recent-table__note">
            Slips left on the worktable — noticed and set down before anyone
            decided what they meant.
          </p>

          <ul className="obs-recent__slips">
            {slips.map((slip, i) => (
              <li
                key={slip.id}
                className="obs-slip-wrap"
                style={{ "--slip-tilt": `${(i % 2 === 0 ? -1 : 1) * (0.8 + (i % 3) * 0.7)}deg` } as React.CSSProperties}
              >
                <Link href={slip.href} className="obs-slip group block">
                  <span className="obs-slip__pin" aria-hidden />
                  <p className="obs-slip__excerpt">{slip.excerpt}</p>
                  <div className="obs-slip__meta">
                    <span className="obs-slip__kind">
                      {slip.kind === "observation" ? "Observation" : "Field note"}
                    </span>
                    {slip.date ? (
                      <span className="obs-slip__when">{formatWhen(slip.date)}</span>
                    ) : null}
                  </div>
                  {slip.themes.length > 0 || slip.attribution ? (
                    <p className="obs-slip__hand">
                      {slip.themes.slice(0, 2).join(" · ")}
                      {slip.themes.length > 0 && slip.attribution ? " — " : ""}
                      {slip.attribution}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ObservatoryEmergence>
  );
}
