"use client";

import { useId } from "react";
import { siteConfig } from "@/lib/content/data";
import "./newsletter.css";

const invitations = {
  home: { title: "Follow the thread.", body: "Essays and field notes exploring the relationships between intelligence, health, faith, technology, and what it means to be human.", action: "Join Living Terrain", note: "No noise. Just new writing and occasional field notes." },
  join: { title: "Stay in the field.", body: "Living Terrain is an ongoing investigation.", detail: "New essays, observations, and field notes delivered as the work develops.", action: "Enter the field", note: "Free to join. Unsubscribe anytime." },
  excerpt: { title: "The investigation continues.", body: "Follow the thread for new essays and field notes as the work develops.", action: "Join Living Terrain", note: "No noise. Just new writing and occasional field notes." },
  essay: { title: "The investigation continues.", body: "If this changed the way you see something, follow the thread.", action: "Join Living Terrain", note: "No noise. Just new writing and occasional field notes." },
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
        Signup opens in a new tab. Living Terrain will stay open here.
      </p>
      <p className="newsletter-small">{copy.note}</p>
    </section>
  );
}
