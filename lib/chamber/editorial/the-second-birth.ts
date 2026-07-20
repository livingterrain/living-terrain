import type { EditorialChamberSpec } from "@/components/chamber/editorial/types";

/**
 * Editorial content for The Second Birth.
 * Drawn from catalog copy; distinct pacing from Biology of Becoming.
 */
export const SECOND_BIRTH_SPEC: EditorialChamberSpec = {
  volume: "II",
  catalog: "002",
  coverSrc: "/images/maps/the-second-birth.jpg",
  inquiry:
    "What does it mean to be born again — not spiritually, but physiologically?",
  introduction:
    "An embodied investigation into how identity, perception, and reality are rewritten through the nervous system — for those rebuilding after collapse.",
  passages: [
    {
      align: "left",
      body: "For readers who have crossed through breakdown and are reconstructing consciously. Nothing was broken — only adapted. This volume moves from awareness into embodiment.",
      margin: {
        label: "Related inquiry",
        text: "If You Feel It in Your Body, Start Here",
        href: "/essays/if-you-feel-it-in-your-body-start-here",
      },
    },
    {
      align: "right",
      body: "A second birth is not a metaphor layered onto the body. It is the physiological work of reorganization — evidence gathering in sensation, identity loosening its grip, and a new pattern of capacity taking shape.",
      margin: {
        label: "Open question",
        text: "What remains after the old self can no longer hold?",
      },
    },
  ],
  figure: {
    number: "01",
    title: "Reconstruction.",
    stages: [
      { name: "Evidence", gloss: "what the body records" },
      { name: "Embodiment", gloss: "what capacity allows" },
      { name: "Becoming", gloss: "what identity can hold" },
    ],
    caption:
      "Reconstruction begins as evidence, continues as embodiment, and only then becomes a self that can stay.",
  },
  quote: {
    text: "Nothing was broken — only adapted. The work is not repair. It is reorganization.",
    attribution: "From the field journal",
  },
  silence: ["The second birth", "is not arrival.", "It is capacity", "taking form."],
  methodNote: {
    body: "This volume gathers evidence from lived reorganization — the physiology of rebuilding after collapse, where embodiment is the method and becoming is the consequence.",
  },
  methodMargin: {
    label: "Atlas reference",
    text: "The Biology of Becoming",
    href: "/atlas/the-biology-of-becoming",
  },
  fieldNote:
    "Awareness opens the door. Embodiment is what lets you walk through it.",
  pause: "Reconstruction is slower than insight — and more durable.",
  catalogSlipLabel: "Catalog 002 · Bound record",
  references: [
    {
      kind: "Essay",
      invitation: "Read a connected essay",
      title: "If You Feel It in Your Body, Start Here",
      href: "/essays/if-you-feel-it-in-your-body-start-here",
    },
    {
      kind: "Atlas",
      invitation: "Explore this idea in the Atlas",
      title: "The Second Birth — the charted map",
      href: "/atlas/the-second-birth",
    },
    {
      kind: "Volume",
      invitation: "Enter a connected chamber",
      title: "The Biology of Becoming",
      href: "/chambers/the-biology-of-becoming",
    },
    {
      kind: "Observatory",
      invitation: "Return to the Observatory",
      title: "Where investigations are still forming",
      href: "/observatory",
    },
  ],
};
