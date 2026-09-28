import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { Essay } from "@/lib/content/types";
import {
  getEssayContext,
  hasEssayContext,
  type EssayAtlasEvidence,
} from "@/lib/reading/essay-context";
import { threadHref } from "@/lib/threads";
import "./thread-shelf.css";

interface EssayWhereThisSitsProps {
  essay: Pick<Essay, "id" | "slug" | "threadIds">;
}

function joinWords(items: ReactNode[]): ReactNode {
  return items.map((item, i) => (
    <Fragment key={i}>
      {i > 0 && (i === items.length - 1 ? " and " : ", ")}
      {item}
    </Fragment>
  ));
}

function evidenceSentence(evidence: EssayAtlasEvidence): ReactNode {
  const lead =
    evidence.role === "further-reading"
      ? "Offered in the Atlas as a wider reading in"
      : "Charted in the Atlas as evidence in";
  return (
    <>
      {lead} <em>{evidence.questionText}</em> — at {joinWords(evidence.stops)}.
    </>
  );
}

/**
 * Authored relationships for an essay record, strongest first.
 * Renders nothing when none have been authored.
 */
export function EssayWhereThisSits({ essay }: EssayWhereThisSitsProps) {
  const context = getEssayContext(essay);
  if (!hasEssayContext(context)) return null;
  const { atlasEvidence, chambers, threads } = context;

  return (
    <section
      className="essay-where threshold-carved threshold-carved--edge"
      aria-labelledby="essay-where-heading"
    >
      <h2 id="essay-where-heading" className="type-chamber">
        Where this sits
      </h2>

      {atlasEvidence.length > 0 && (
        <div className="essay-where__atlas lantern-meta">
          {atlasEvidence.map((evidence) => (
            <p key={`${evidence.questionId}-${evidence.role}`}>
              {evidenceSentence(evidence)}
            </p>
          ))}
          <Link href="/atlas" className="essay-where__link">
            Enter the Atlas →
          </Link>
        </div>
      )}

      {chambers.length > 0 && (
        <p className="essay-where__chamber lantern-meta">
          Held within the {chambers.length === 1 ? "chamber" : "chambers"} of{" "}
          {joinWords(
            chambers.map((chamber) => (
              <Link
                key={chamber.slug}
                href={chamber.href}
                className="essay-where__inline-link"
              >
                {chamber.title}
              </Link>
            )),
          )}
          .
        </p>
      )}

      {threads.length > 0 && (
        <div className="essay-where__threads">
          <p className="essay-where__threads-cue lantern-meta">Also belongs to</p>
          <ul className="essay-thread-belonging__names lantern-meta">
            {threads.map((thread) => (
              <li key={thread.id}>
                <Link
                  href={threadHref(thread.id)}
                  className="essay-thread-belonging__link"
                >
                  {thread.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
