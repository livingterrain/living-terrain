import { TextLink } from "@/components/design-system";

interface ChamberPurchaseProps {
  url: string;
}

/** Quiet purchase link — not a storefront */
export function ChamberPurchase({ url }: ChamberPurchaseProps) {
  return (
    <section
      aria-label="Purchase the book"
      className="border-t border-rule/40 pt-16"
    >
      <p className="type-body max-w-xl text-[0.9375rem]">
        The full inquiry is available as a published volume. Living Terrain
        continues the investigation here — the book is a threshold, not an
        endpoint.
      </p>
      <TextLink href={url} external className="mt-8 inline-block text-sm">
        Purchase the book
      </TextLink>
    </section>
  );
}
