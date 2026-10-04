import type { SpiralLensExploration } from "../types";
import { ZODIAC_CYCLE_STEPS } from "../trajectories/zodiac";

/**
 * Zodiac lens — lens-level research packet (moved from the Transformation
 * packet; authored M1D-6 copy unchanged). Owns the history and structure of
 * the zodiac as a whole: the cycle, Ptolemy's classification, signs vs
 * houses, ancient vs Pluto-era layers, Rudhyar's developmental reading, and
 * circle vs spiral. Transformation keeps only its own intersection.
 */
export const ZODIAC_LENS_RESEARCH: SpiralLensExploration = {
  lensId: "symbolic-zodiac",
  title: "The zodiac as a historical and symbolic structure",
  conceptsCue: "Zodiac historiography — layers, provenance, and structure",
  cycleContext: {
    title: "The cycle and its glosses",
    provenanceNote:
      "Glosses combine historical and modern developmental readings with Living Terrain synthesis. They are not ancient doctrine, and no sign is matched to a Spiral operation.",
    structureNote: {
      title: "A recurring structural pattern (our concise reading of Ptolemy)",
      body: "Ptolemy classifies the signs as equinoctial/solstitial (turning), solid, and bicorporeal/transitional.\n\nTurning: Aries, Cancer, Libra, Capricorn.\nSolid: Taurus, Leo, Scorpio, Aquarius.\nBicorporeal: Gemini, Virgo, Sagittarius, Pisces.\n\nFor modern readers, Living Terrain may describe that inherited classification concisely as a recurring Turn → Establish → Transition pattern, four times around the zodiac.\n\nThis is our concise description of his classification.\n\nIt is not a scientific systems model, and Ptolemy did not use our terminology.",
      provenance: "our-systems-reading",
    },
    stops: ZODIAC_CYCLE_STEPS,
    circleAndSpiral: {
      title: "Circle and Spiral",
      body: "The zodiac returns symbolically:\n\nPisces → Aries again\n\nThe Evolutionary Spiral represents:\n\nEmergence¹ → … → Emergence again\n\nLiving Terrain's comparison:\n\nA symbolic position can recur.\n\nA historical system does not necessarily return to its former state.\n\nThe Spiral therefore adds a vertical question to circular recurrence:\n\nWhat changes when a cycle remembers?\n\n“Recurrence with accumulated history” is our systems reading. It is not attributed to ancient astrology, and it does not claim that Rudhyar and Living Terrain propose identical models.\n\nAries again marks recurrence of symbolic position in this comparison view — not a claim that traditional astrology contains a second Aries.",
      provenance: "our-systems-reading",
    },
  },
  concepts: [
    {
      id: "zod-scorpio-before-transformation",
      title: "Scorpio before “transformation”",
      summary: "What was actually inherited?",
      epistemicKind: "historical-observation",
      epistemicKinds: ["historical-observation", "symbolic-comparative"],
      provenance: "ancient-hellenistic",
      whisper:
        "The symbol is old. Not every meaning attached to it is.",
      sections: [
        {
          id: "zod-before-body",
          kind: "general",
          title: "",
          body: "In older astrological tradition, Scorpio was the domicile of Mars and belonged to what would later be called the fixed signs.\n\nThat gives us an ancient Scorpio.\n\nBut it does not yet give us the complete modern archetype of psychological death, rebirth, and transformation.\n\nThe distinction matters because symbols have histories. Meanings that now appear inseparable may have entered the tradition centuries apart.",
        },
        {
          id: "zod-before-persists",
          kind: "what-persists",
          title: "What persists",
          items: [
            "Scorpio's place in the zodiac",
            "Mars rulership",
            "its relationship to the seasonal cycle",
          ],
        },
        {
          id: "zod-before-changes",
          kind: "what-changes",
          title: "What changes",
          items: [
            "the language used to interpret it",
            "psychological meanings attached to it",
            "later planetary associations",
          ],
        },
      ],
      comparisonBreaks: {
        title: "Where the comparison breaks",
        body: "Traditional astrological categories are symbolic classifications. Mars rulership or zodiacal position does not provide an empirical mechanism for biological, psychological, ecological, or systems transformation.",
      },
      openQuestions: [
        "Which parts of a symbol belong to its earliest surviving form—and which become invisible additions because they have been repeated long enough?",
      ],
      sources: [
        {
          id: "zod-before-ptolemy-tetrabiblos",
          title: "Tetrabiblos",
          authors: "Claudius Ptolemy",
          publication: "Book I — planetary domiciles / rulership structure",
          supports:
            "Hellenistic structural placement of Scorpio within the zodiac and Mars domicile associations relevant to an older Scorpio baseline.",
        },
      ],
    },
    {
      id: "zod-eighth-sign-not-house",
      title: "The eighth sign is not the eighth house",
      summary: "When did separate structures begin to look like one?",
      epistemicKind: "historical-observation",
      epistemicKinds: ["historical-observation", "symbolic-comparative"],
      provenance: ["ancient-hellenistic", "later-traditional"],
      whisper: "Symbols accumulate history too.",
      sections: [
        {
          id: "zod-8th-body",
          kind: "general",
          title: "",
          body: "Traditional astrology associated the eighth place with subjects including death and inheritance.\n\nScorpio is the eighth sign of the zodiac.\n\nThose are not historically interchangeable structures.\n\nA zodiacal sign describes a position within the zodiacal cycle. A house/place describes a different astrological framework organized from the horizon and other chart angles.\n\nModern astrology often combines Scorpio, the eighth house, death symbolism, Pluto, and transformation into a single interpretive package.\n\nThat package should not be projected backward unchanged into antiquity.",
        },
      ],
      comparisonBreaks: {
        title: "Where the comparison breaks",
        body: "Untangling the historical development of signs and houses tells us how an interpretive tradition changed. It does not establish that either describes an objective developmental mechanism.",
      },
      openQuestions: [
        "How often do inherited symbolic systems appear timeless because we no longer remember when their layers were added?",
      ],
      sources: [
        {
          id: "zod-8th-rudhyar-1950",
          title: "Astrological Houses and Zodiacal Signs",
          authors: "Dane Rudhyar",
          year: 1950,
          supports:
            "Distinction between zodiacal signs and astrological houses/places as different frameworks — used here against collapsing the eighth sign into the eighth house.",
        },
      ],
    },
    {
      id: "zod-pluto-transformation-archetype",
      title: "Pluto and the transformation archetype",
      summary: "What happens when a new symbol enters an old system?",
      epistemicKind: "historical-observation",
      epistemicKinds: ["historical-observation", "symbolic-comparative"],
      provenance: "modern-pluto-era",
      whisper:
        "An inherited system can remain recognizable while acquiring meanings its earlier forms never contained.",
      sections: [
        {
          id: "zod-pluto-body",
          kind: "general",
          title: "",
          body: "Pluto entered astrology only after its twentieth-century astronomical discovery.\n\nAstrologers subsequently associated Pluto strongly with Scorpio and developed a vocabulary involving underworld imagery, destruction, elimination, hidden power, regeneration, and profound transformation.\n\nMars did not disappear as Scorpio's traditional ruler.\n\nInstead, the inherited sign accumulated another symbolic layer.\n\nThe modern Scorpio archetype is therefore not simply an ancient meaning preserved unchanged.\n\nIt has a history.",
        },
      ],
      comparisonBreaks: {
        title: "Where the comparison breaks",
        body: "The historical incorporation of Pluto into modern astrology is observable.\n\nA claim that Pluto produces psychological or developmental transformation is a different kind of claim and is not established by that history.",
      },
      openQuestions: [
        "At what point does adding new meaning preserve a tradition—and at what point does it create a new one?",
      ],
      sources: [
        {
          id: "zod-pluto-era-note",
          title: "Modern Pluto-era Scorpio associations",
          supports:
            "Historical observation that Pluto entered astrology after twentieth-century discovery and that modern Scorpio transformation vocabulary developed afterward. Exact primary monograph for every later keyword is not forced where the dossier does not pin one.",
        },
      ],
    },
    {
      id: "zod-developmental-process",
      title: "The zodiac as developmental process",
      summary: "What if the signs are phases rather than personalities?",
      epistemicKind: "historical-observation",
      epistemicKinds: [
        "historical-observation",
        "conceptual-framework",
        "symbolic-comparative",
      ],
      provenance: "modern-psychological",
      whisper:
        "A phase changes meaning when it is placed back inside the cycle.",
      sections: [
        {
          id: "zod-dev-body",
          kind: "general",
          title: "",
          body: "Dane Rudhyar explicitly interpreted the zodiac as a dynamic process and presented its twelve signs as phases of human experience.\n\nWithin this framework, a sign does not stand alone.\n\nIts meaning emerges partly from what precedes it, what follows it, and its position within a recurring cycle.\n\nScorpio can therefore be read less as a personality label and more as a phase inside an unfolding symbolic sequence.\n\nThis developmental reading is modern.\n\nIt should not be presented as though every earlier astrologer understood the zodiac this way.",
        },
      ],
      comparisonBreaks: {
        title: "Where the comparison breaks",
        body: "A developmental interpretation of the zodiac is an interpretive framework.\n\nIts structural resemblance to developmental or systems models does not demonstrate that the zodiac measures those processes.",
      },
      openQuestions: [
        "When humans arrange experience into cycles, what makes some sequences feel developmental rather than merely repetitive?",
      ],
      sources: [
        {
          id: "zod-dev-rudhyar-pulse-1943",
          title: "The Pulse of Life",
          authors: "Dane Rudhyar",
          year: 1943,
          publication:
            "Especially: The Zodiac as a Dynamic Process; Twelve Phases of Human Experience; Aries; Scorpio; neighboring signs; Pisces",
          supports:
            "Modern developmental reading of the zodiac as a dynamic process and twelve phases of human experience.",
        },
      ],
    },
  ],
  openQuestions: [
    "Is boundary formation (as Gemini → Cancer may suggest) an independent operation, or does it emerge from embodiment, differentiation, relationship, and organization?",
  ],
};
