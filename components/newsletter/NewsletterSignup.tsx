"use client";

import { useId } from "react";
import { siteConfig } from "@/lib/content/data";
import "./newsletter.css";

const invitations = {
  home: { title: "Follow Living Terrain on Substack.", body: "New essays and field notes as the work develops — exploring intelligence, health, faith, technology, and what it means to be human.", action: "Subscribe on Substack", note: "No noise. Just new writing and occasional field notes." },
  join: { title: "Follow Living Terrain on Substack.", body: "Essays are published first on Substack. Subscribing there brings new essays and field notes as the work develops.", detail: "This site holds the work in relationship — the Atlas, The Shelves, and the Observatory.", action: "Subscribe on Substack", note: "Free on Substack. Unsubscribe anytime." },
  excerpt: { title: "The investigation continues on Substack.", body: "Follow Living Terrain on Substack for new essays and field notes as the work develops.", action: "Subscribe on Substack", note: "No noise. Just new writing and occasional field notes." },
  essay: { title: "The investigation continues on Substack.", body: "If this changed the way you see something, follow Living Terrain on Substack.", action: "Subscribe on Substack", note: "No noise. Just new writing and occasional field notes." },
};
export function NewsletterSignup({ variant = "home" }: { variant?: keyof typeof invitations }) {
  const id = useId();
  const copy = invitations[variant];

  return (
    <section className={`newsletter-invitation newsletter-invitation--${variant}`} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{copy.title}</h2>
      <p>{copy.body}</p>
      {"detail" in copy && <p>{copy.detail}</p>}
      <a
        className="newsletter-action"
        href={siteConfig.substackSubscribeUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby={`${id}-disclosure`}
      >
        {copy.action} →
      </a>
      <p id={`${id}-disclosure`} className="newsletter-small">
        Opens Substack in a new tab. Living Terrain will stay open here.
      </p>
      <p className="newsletter-small">{copy.note}</p>
    </section>
  );
}
