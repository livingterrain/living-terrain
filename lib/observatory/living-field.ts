/**
 * Living Observatory — phenomena first.
 *
 * Homepage shows only independently observable phenomena.
 * Interpretation, questions, and competing explanations appear after entry.
 */

export interface Observation {
  id: string;
  /** Another observable notice — not an interpretation */
  notice: string;
  whence?: string;
  href?: string;
}

export interface WorkingExplanation {
  id: string;
  claim: string;
  weather: "holding" | "straining" | "gaining";
  leansOn: string[];
}

export interface LivingInquiry {
  id: string;
  slug: string;
  /**
   * Independently observable phenomenon.
   * Homepage doorway. Must pass: "Someone could independently observe this."
   */
  phenomenon: string;
  question: string;
  stillAlive: string;
  observations: Observation[];
  explanations: WorkingExplanation[];
  tensions: string[];
  opensInto: string[];
  /** Quiet notebook index */
  entry: number;
}

/** @deprecated — use phenomenon */
export type LivingInquiryAnomaly = string;

export function weatherWhisper(weather: WorkingExplanation["weather"]): string {
  switch (weather) {
    case "holding":
      return "Holding — for now";
    case "straining":
      return "Under strain";
    case "gaining":
      return "Gathering weight";
  }
}

export const LIVING_INQUIRIES: LivingInquiry[] = [
  {
    id: "lq-persist",
    slug: "what-persists-through-transformation",
    entry: 1,
    phenomenon:
      "Almost everything inside a living system can change, yet we still track it as the same organism.",
    question: "What persists when a living system transforms?",
    stillAlive:
      "Matter turns over. Cells replace. Physiology reorganizes. Continuity remains — and no agreed object fully explains it.",
    observations: [
      {
        id: "o-turnover",
        notice:
          "Most of the atoms in a human body are replaced over years, while the person is still treated as continuous.",
      },
      {
        id: "o-sleep-id",
        notice:
          "Sleep reorganizes nearly every physiological system overnight without breaking the sense of the same organism.",
      },
      {
        id: "o-cost",
        notice:
          "Keeping a living system going requires continuous energy expenditure — persistence is not free.",
        whence: "Every Living System Pays a Maintenance Cost",
        href: "/essays/every-living-system-pays-a-maintenance-cost",
      },
    ],
    explanations: [
      {
        id: "x-process",
        claim:
          "What persists is an ongoing process of maintenance, not a fixed substance inside the organism.",
        weather: "gaining",
        leansOn: ["o-cost", "o-turnover"],
      },
      {
        id: "x-cut",
        claim:
          "Nothing deep persists. 'Same organism' is a practical label we keep using through flux.",
        weather: "straining",
        leansOn: ["o-turnover"],
      },
    ],
    tensions: [
      "How much can change before continuity fails?",
      "Is what persists structure, process, boundary — or only a useful cut?",
    ],
    opensInto: ["lq-sleep", "lq-priorities", "lq-fever"],
  },
  {
    id: "lq-fever",
    slug: "fever-reorganizes-the-whole",
    entry: 2,
    phenomenon:
      "Fever changes appetite, sleep, movement, attention, metabolism, and social behavior at the same time.",
    question: "What kind of thing is a whole-body reorganization like fever?",
    stillAlive:
      "Fever is usually explained as temperature regulation. The simultaneous shift across appetite, behavior, sleep, and social contact suggests a broader coordinated change.",
    observations: [
      {
        id: "o-bundle",
        notice:
          "During fever, people often stop wanting food, seek stillness, sleep differently, and withdraw socially in the same period.",
      },
      {
        id: "o-cross-illness",
        notice:
          "People with different diseases often report remarkably similar whole-body experiences during acute illness.",
      },
      {
        id: "o-temp-only",
        notice:
          "Raising body temperature alone does not fully reproduce the full behavioral and motivational package of sickness.",
      },
    ],
    explanations: [
      {
        id: "x-program",
        claim:
          "Fever is one visible face of a coordinated defensive program that retunes multiple systems together.",
        weather: "gaining",
        leansOn: ["o-bundle", "o-cross-illness"],
      },
      {
        id: "x-side-effects",
        claim:
          "The wide changes are side effects of local inflammatory signals, not a single organized mode.",
        weather: "holding",
        leansOn: ["o-temp-only"],
      },
    ],
    tensions: [
      "Is the shared illness experience one state — or many overlapping mechanisms?",
      "What would count as evidence of coordination rather than coincidence?",
    ],
    opensInto: ["lq-similar", "lq-priorities", "lq-injury"],
  },
  {
    id: "lq-similar",
    slug: "similar-experience-different-disease",
    entry: 3,
    phenomenon:
      "People with different diseases often report remarkably similar whole-body experiences.",
    question:
      "Why can different diseases produce similar whole-organism patterns?",
    stillAlive:
      "Diagnoses divide by cause or organ. Lived patterns sometimes cluster across those divisions.",
    observations: [
      {
        id: "o-shared",
        notice:
          "Fatigue, brain fog, altered appetite, and social withdrawal appear across unrelated diagnoses.",
      },
      {
        id: "o-mismatch",
        notice:
          "Two people can share a diagnosis and inhabit very different bodily states — or hold different diagnoses and nearly the same state.",
      },
      {
        id: "o-fever-echo",
        notice:
          "Fever changes appetite, sleep, movement, attention, metabolism, and social behavior at the same time.",
      },
    ],
    explanations: [
      {
        id: "x-shared-mode",
        claim:
          "Different diseases can push the organism into a shared operating mode that outruns the original cause.",
        weather: "holding",
        leansOn: ["o-shared", "o-fever-echo"],
      },
      {
        id: "x-language",
        claim:
          "The similarity is mostly linguistic — people reuse the same limited vocabulary for different bodily events.",
        weather: "straining",
        leansOn: ["o-mismatch"],
      },
    ],
    tensions: [
      "How would we measure whole-body similarity independent of diagnosis labels?",
      "When does shared experience imply shared organization?",
    ],
    opensInto: ["lq-fever", "lq-persist", "lq-priorities"],
  },
  {
    id: "lq-sleep",
    slug: "sleep-reorganizes-without-breaking-identity",
    entry: 4,
    phenomenon:
      "Sleep reorganizes nearly every physiological system without changing the organism's identity.",
    question: "How can the body reorganize so deeply and remain the same organism?",
    stillAlive:
      "Sleep is a daily, radical physiological reorganization that does not reset who the organism is counted as.",
    observations: [
      {
        id: "o-systems",
        notice:
          "During sleep, autonomic tone, hormone release, immune activity, metabolism, and brain dynamics all shift together.",
      },
      {
        id: "o-same",
        notice:
          "Almost everything inside a living system can change, yet we still track it as the same organism.",
      },
      {
        id: "o-wake",
        notice:
          "Waking restores a different whole-body pattern — again without treating the sleeper as a new individual.",
      },
    ],
    explanations: [
      {
        id: "x-mode-switch",
        claim:
          "Sleep is a reversible organism-level mode switch inside a stable individual.",
        weather: "gaining",
        leansOn: ["o-systems", "o-wake"],
      },
      {
        id: "x-local",
        claim:
          "What looks global is only the sum of many local circadian mechanisms — no higher-order reorganization exists.",
        weather: "holding",
        leansOn: ["o-systems"],
      },
    ],
    tensions: [
      "What makes a reorganization 'organism-level' rather than a bundle of local clocks?",
      "What stays invariant enough across sleep for identity to hold?",
    ],
    opensInto: ["lq-persist", "lq-priorities", "lq-fever"],
  },
  {
    id: "lq-priorities",
    slug: "priorities-change-without-dna",
    entry: 5,
    phenomenon:
      "The body can dramatically change what it prioritizes without changing its DNA.",
    question: "What is being reorganized when the body's priorities change?",
    stillAlive:
      "Growth, defense, repair, reproduction, and conservation can be favored differently across time — with the same genome.",
    observations: [
      {
        id: "o-starvation",
        notice:
          "During prolonged fasting, the body shifts fuel use, reduces nonessential activity, and alters reproductive signaling.",
      },
      {
        id: "o-infection",
        notice:
          "During infection, resources move toward defense while appetite, activity, and social contact often fall.",
      },
      {
        id: "o-genome",
        notice:
          "These shifts occur without rewriting the organism's DNA sequence.",
      },
    ],
    explanations: [
      {
        id: "x-allocation",
        claim:
          "The organism reallocates limited resources among competing demands through regulatory control.",
        weather: "gaining",
        leansOn: ["o-starvation", "o-infection", "o-genome"],
      },
      {
        id: "x-epiphenomenon",
        claim:
          "'Priorities' are a story we tell after the fact about many independent pathways changing for local reasons.",
        weather: "holding",
        leansOn: ["o-genome"],
      },
    ],
    tensions: [
      "What remains constant while priorities change?",
      "How do we tell coordinated reallocation from coincidental co-change?",
    ],
    opensInto: ["lq-fever", "lq-injury", "lq-persist"],
  },
  {
    id: "lq-injury",
    slug: "undamaged-systems-still-change",
    entry: 6,
    phenomenon:
      "After injury, systems that were not damaged still change their behavior.",
    question: "Why do undamaged systems reorganize after a local injury?",
    stillAlive:
      "Healing is not only local repair. Motility, sleep, appetite, mood, and immune tone often shift far from the wound.",
    observations: [
      {
        id: "o-remote",
        notice:
          "After a localized injury, people often sleep differently, move differently, and eat differently even when those systems were not injured.",
      },
      {
        id: "o-fever2",
        notice:
          "Fever changes appetite, sleep, movement, attention, metabolism, and social behavior at the same time.",
      },
      {
        id: "o-local-heal",
        notice:
          "Tissue repair can proceed while whole-body behavior remains altered for days or longer.",
      },
    ],
    explanations: [
      {
        id: "x-organism-response",
        claim:
          "Injury recruits an organism-level response that retunes undamaged systems to support repair and protection.",
        weather: "gaining",
        leansOn: ["o-remote", "o-fever2"],
      },
      {
        id: "x-pain-only",
        claim:
          "Remote changes are mainly consequences of pain and stress signaling, not a coherent reorganization.",
        weather: "holding",
        leansOn: ["o-local-heal"],
      },
    ],
    tensions: [
      "Where does local repair end and organism-level reorganization begin?",
      "Can remote change persist after pain resolves?",
    ],
    opensInto: ["lq-fever", "lq-priorities", "lq-similar"],
  },
  {
    id: "lq-diagnosis-state",
    slug: "diagnosis-and-bodily-state-diverge",
    entry: 7,
    phenomenon:
      "Two people can share the same diagnosis and inhabit very different bodily states — or different diagnoses and nearly the same state.",
    question: "What is diagnosis cutting, if not the organism's current state?",
    stillAlive:
      "Clinical categories often track cause, organ, or lesion. Lived physiological organization sometimes cuts differently.",
    observations: [
      {
        id: "o-same-dx",
        notice:
          "Within one diagnosis, energy, sleep, appetite, and capacity can differ dramatically between people.",
      },
      {
        id: "o-cross-dx",
        notice:
          "People with different diseases often report remarkably similar whole-body experiences.",
      },
      {
        id: "o-labs",
        notice:
          "Lab markers can normalize while the person still reports a transformed whole-body state — or the reverse.",
      },
    ],
    explanations: [
      {
        id: "x-state-primary",
        claim:
          "Organism-level state is a real object that diagnoses only sometimes capture.",
        weather: "holding",
        leansOn: ["o-cross-dx", "o-same-dx"],
      },
      {
        id: "x-dx-enough",
        claim:
          "Diagnosis remains the right cut; apparent state similarity is noise around disease-specific mechanisms.",
        weather: "straining",
        leansOn: ["o-labs"],
      },
    ],
    tensions: [
      "What measurements would identify bodily state independent of diagnosis?",
      "When should state override diagnosis in explanation?",
    ],
    opensInto: ["lq-similar", "lq-fever", "lq-persist"],
  },
];

export function getLivingInquiries(): LivingInquiry[] {
  return [...LIVING_INQUIRIES].sort((a, b) => a.entry - b.entry);
}

export function getLivingInquiryBySlug(slug: string): LivingInquiry | undefined {
  return LIVING_INQUIRIES.find((q) => q.slug === slug);
}

export function getOpenedInquiries(inquiry: LivingInquiry): LivingInquiry[] {
  return inquiry.opensInto
    .map((id) => LIVING_INQUIRIES.find((q) => q.id === id))
    .filter((q): q is LivingInquiry => q !== undefined);
}

export function observationById(
  inquiry: LivingInquiry,
  id: string,
): Observation | undefined {
  return inquiry.observations.find((o) => o.id === id);
}

/** @deprecated */
export type LivingQuestion = LivingInquiry;
/** @deprecated */
export function getLivingQuestions() {
  return getLivingInquiries();
}
/** @deprecated */
export function getLivingQuestionBySlug(slug: string) {
  return getLivingInquiryBySlug(slug);
}
/** @deprecated */
export function getRelatedQuestions(q: LivingInquiry) {
  return getOpenedInquiries(q);
}
