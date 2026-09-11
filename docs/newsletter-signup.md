# Living Terrain email invitations

The homepage, `/join`, and every `/essays/[slug]` page share `NewsletterSignup`.
Full essays and excerpt-only pages use distinct invitation copy.

The CTA is a normal link to the existing publication's official subscribe page:
https://livingterrain.substack.com/subscribe

It uses `target="_blank"` and `rel="noopener noreferrer"`. A visible disclosure,
also connected through `aria-describedby`, explains that signup opens in a new
tab while Living Terrain stays open in the original tab. The URL comes from the existing site configuration.

Substack handles email collection, validation, subscription, errors, and any
confirmation or onboarding. No iframe, private API, second list, local email
storage, success callback, or inferred subscription status is used. The original
Living Terrain page stays open. Returning is manual; independent exploration links
remain available regardless of whether someone subscribes.

There is no local completion or welcome state. Opening or returning from Substack
never implies that a subscription succeeded. The legacy waitlist placeholder is
not used by this flow.

Official guidance:
https://support.substack.com/hc/en-us/articles/360037830631-How-do-readers-subscribe-to-my-Substack-publication

Validation does not submit a real email address or claim delivery was tested.
