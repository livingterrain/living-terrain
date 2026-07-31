/**
 * Investigation invitations — begin with a question, not a category.
 */

export type AtlasInquiry = {
  id: string;
  question: string;
  /** One short, thought-provoking premise */
  premise: string;
  centerId: string;
};

export const ATLAS_INQUIRIES: ReadonlyArray<AtlasInquiry> = [
  {
    id: "adaptation",
    question: "What is adaptation?",
    premise:
      "Nothing in a living system breaks arbitrarily. It reorganizes around what it has had to survive.",
    centerId: "adaptation",
  },
  {
    id: "systems",
    question: "How do systems organize themselves?",
    premise:
      "Wholes do not assemble from parts alone. They organize through feedback, constraint, and relationship.",
    centerId: "systems",
  },
  {
    id: "identity",
    question: "Where does identity come from?",
    premise:
      "The self is not a fixed object. It is a pattern the body and language keep rewriting.",
    centerId: "identity",
  },
  {
    id: "feedback",
    question: "What is feedback?",
    premise:
      "Control fails where conversation succeeds. Consequence is how a system learns.",
    centerId: "feedback",
  },
  {
    id: "language",
    question: "How does language shape perception?",
    premise:
      "What we can name, we can notice. What we cannot say often still organizes what we see.",
    centerId: "language",
  },
];

export function inquiryByCenterId(centerId: string): AtlasInquiry | undefined {
  return ATLAS_INQUIRIES.find((i) => i.centerId === centerId);
}
