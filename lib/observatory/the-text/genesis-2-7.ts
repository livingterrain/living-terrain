import { makeClaim, makeLanguageNote } from "./provenance";
import {
  interpretationGroup,
  namedInterpretation,
  openQuestion,
  terrainNode,
  type Passage,
  type PassageWord,
} from "./types";

const SEMANTIC_CAUTION =
  "A word’s semantic range shows meanings it can carry across contexts. It does not mean every meaning is present every time the word appears.";

function word(partial: PassageWord): PassageWord {
  return partial;
}

/**
 * Genesis 2:7 — Verified core content packet (Phase 2).
 * Scholarship status: verified core / research continues
 * (premium modern lexica BDB/HALOT/DCH not treated as consulted).
 */
export const GENESIS_2_7: Passage = {
  id: "gen-2-7",
  slug: "genesis-2-7",
  reference: "Genesis 2:7",
  language: "hebrew",
  themes: ["dust", "breath", "life", "nephesh"],
  status: "ready",
  scholarshipStatus: "verified-core",
  whisper: "Dust, breath, and what a human becomes.",
  englishPrimary: {
    label: "ASV",
    attribution: "American Standard Version (1901), public domain",
    text: "And Jehovah God formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul.",
    sourceId: "asv-1901",
  },
  semanticRangeNote: SEMANTIC_CAUTION,
  original: {
    scriptLabel: "Hebrew",
    dir: "rtl",
    lang: "he",
    source: "Westminster Leningrad Codex",
    sourceId: "wlc",
    tokens: [
      { type: "word", wordId: "wayyitzer" },
      { type: "text", value: " " },
      { type: "word", wordId: "yhwh" },
      { type: "text", value: " " },
      { type: "word", wordId: "elohim" },
      { type: "text", value: " " },
      { type: "text", value: "אֶת־" },
      { type: "word", wordId: "haadam" },
      { type: "text", value: " " },
      { type: "word", wordId: "afar" },
      { type: "text", value: " " },
      { type: "text", value: "מִן־" },
      { type: "word", wordId: "haadamah" },
      { type: "text", value: " " },
      { type: "word", wordId: "wayyippach" },
      { type: "text", value: " " },
      { type: "word", wordId: "beappav" },
      { type: "text", value: " " },
      { type: "word", wordId: "nishmat" },
      { type: "text", value: " " },
      { type: "word", wordId: "chayyim" },
      { type: "text", value: " " },
      { type: "word", wordId: "wayehi" },
      { type: "text", value: " " },
      { type: "word", wordId: "haadam-2" },
      { type: "text", value: " " },
      { type: "text", value: "לְ" },
      { type: "word", wordId: "nephesh" },
      { type: "text", value: " " },
      { type: "word", wordId: "chayyah" },
      { type: "text", value: "׃" },
    ],
  },
  words: [
    word({
      id: "wayyitzer",
      surface: "וַיִּיצֶר",
      lemma: "יָצַר",
      transliteration: "wayyîṣer",
      form: "Qal consecutive imperfect, 3ms",
      formClaim: makeClaim({
        id: "w-wayyitzer-form",
        text: "Qal consecutive imperfect, 3ms — forms / fashions.",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph"],
        verificationStatus: "research-continues",
        visitorNote: "Morphology from WLC-aligned parsing aids; premium lexica not treated as consulted.",
      }),
      translatedHere: "formed",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "to form / fashion",
            confidence: "widely-attested",
            sourceIds: ["oshb-morph"],
            verificationStatus: "research-continues",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph"],
      verificationStatus: "research-continues",
    }),
    word({
      id: "yhwh",
      surface: "יְהוָה",
      lemma: "יהוה",
      transliteration: "YHWH",
      form: "Proper name — the Tetragrammaton",
      translatedHere: "Jehovah",
      translationNote:
        "ASV’s “Jehovah” is a traditional English vocalization; consonants are textual.",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "the personal name of Israel’s God",
            confidence: "widely-attested",
            sourceIds: ["wlc"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["wlc"],
      verificationStatus: "verified",
    }),
    word({
      id: "elohim",
      surface: "אֱלֹהִים",
      lemma: "אֱלֹהִים",
      transliteration: "ʾĕlōhîm",
      form: "Noun, masculine plural form (here with YHWH)",
      translatedHere: "God",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "God (context of YHWH God)",
            confidence: "widely-attested",
            sourceIds: ["wlc"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["wlc"],
      verificationStatus: "verified",
    }),
    word({
      id: "haadam",
      surface: "הָאָדָם",
      lemma: "אָדָם",
      transliteration: "hāʾādām",
      form: "Definite article + common masculine singular noun",
      formClaim: makeClaim({
        id: "w-haadam-form",
        text: "Definite article + common masculine singular noun.",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph"],
        verificationStatus: "verified",
      }),
      gloss: "the human / the man / humankind (depending on context)",
      translatedHere: "man",
      translationNote:
        "In Genesis 2:7 the definite article favors reading hāʾādām as “the human / the man,” not yet necessarily the proper name Adam.",
      translationClaim: makeClaim({
        id: "w-haadam-tr",
        text: "The definite article favors “the human / the man,” not yet necessarily the proper name Adam.",
        category: "translation",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-2-7"],
        verificationStatus: "verified",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "the human / the man",
            confidence: "widely-attested",
            sourceIds: ["wlc", "gen-2-7"],
            verificationStatus: "verified",
          },
          {
            gloss: "humankind (elsewhere / broader usage)",
            confidence: "reasonable-reading",
            sourceIds: ["wlc"],
            verificationStatus: "research-continues",
          },
        ],
      },
      followThisWord: [
        terrainNode({
          label: "Relation to ʾădāmāh (ground)",
          kind: "note",
          note: "Literary/audible association with haʾădāmāh — not a claim that ʾādām literally “means ground.”",
        }),
      ],
      sourceIds: ["wlc", "oshb-morph", "gen-2-7"],
      verificationStatus: "verified",
    }),
    word({
      id: "afar",
      surface: "עָפָר",
      lemma: "עָפָר",
      transliteration: "ʿāp̄ār",
      form: "Common masculine singular noun",
      formClaim: makeClaim({
        id: "w-afar-form",
        text: "Common masculine singular noun.",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph"],
        verificationStatus: "verified",
      }),
      gloss: "dust / dry earth / loose earth",
      translatedHere: "dust",
      translationNote:
        "The material from which the human is formed. Do not gloss as “clay” without qualification.",
      translationClaim: makeClaim({
        id: "w-afar-site",
        text: "The material from which the human is formed (dust / dry earth / loose earth — not “clay” without qualification).",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-2-7", "net-notes-gen-2-7"],
        verificationStatus: "verified",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "dust / dry earth / loose earth",
            confidence: "widely-attested",
            sourceIds: ["wlc", "net-notes-gen-2-7"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph", "gen-2-7"],
      verificationStatus: "verified",
    }),
    word({
      id: "haadamah",
      surface: "הָאֲדָמָה",
      lemma: "אֲדָמָה",
      transliteration: "hāʾădāmāh",
      form: "Definite article + common feminine singular noun",
      formClaim: makeClaim({
        id: "w-haadamah-form",
        text: "Definite article + common feminine singular noun.",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph"],
        verificationStatus: "verified",
      }),
      gloss: "the ground / soil / earth",
      translatedHere: "the ground",
      translationNote: "The ground from which the human’s dust is taken.",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "the ground / soil / earth",
            confidence: "widely-attested",
            sourceIds: ["wlc", "gen-2-7"],
            verificationStatus: "verified",
          },
        ],
      },
      occurrenceNotes: [
        makeClaim({
          id: "w-adam-adamah-wordplay",
          text: "hāʾādām and hāʾădāmāh create an audible/literary word relationship in the Hebrew narrative. Describe as wordplay or literary association — do not claim that ʾādām literally “means ground.”",
          category: "literary-context",
          confidence: "widely-attested",
          sourceIds: ["wlc", "gen-2-7"],
          verificationStatus: "verified",
          visitorNote: "Literary observation from the Hebrew wording of the verse.",
        }),
      ],
      sourceIds: ["wlc", "oshb-morph", "gen-2-7"],
      verificationStatus: "verified",
    }),
    word({
      id: "wayyippach",
      surface: "וַיִּפַּח",
      lemma: "נָפַח",
      transliteration: "wayyippaḥ",
      form: "Qal consecutive imperfect, 3ms",
      translatedHere: "breathed",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "to breathe / blow",
            confidence: "widely-attested",
            sourceIds: ["wlc", "oshb-morph"],
            verificationStatus: "research-continues",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph"],
      verificationStatus: "research-continues",
    }),
    word({
      id: "beappav",
      surface: "בְּאַפָּיו",
      lemma: "אַף",
      transliteration: "bəʾappāw",
      form: "Preposition + noun with 3ms suffix — “into his nostrils”",
      translatedHere: "into his nostrils",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "nostril / nose",
            confidence: "widely-attested",
            sourceIds: ["wlc", "oshb-morph"],
            verificationStatus: "research-continues",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph"],
      verificationStatus: "research-continues",
    }),
    word({
      id: "nishmat",
      surface: "נִשְׁמַת",
      lemma: "נְשָׁמָה",
      transliteration: "nišmat",
      form: "Noun feminine singular construct — “breath of …”",
      formClaim: makeClaim({
        id: "w-nishmat-form",
        text: "Noun feminine singular construct (forms the construct chain nišmat ḥayyîm).",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph"],
        verificationStatus: "verified",
      }),
      gloss: "breath (of …)",
      translatedHere: "the breath",
      translationNote:
        "With ḥayyîm: “breath of life” — the life-imparting breath breathed by God into the human’s nostrils. Do not tell the reader that nĕšāmāh “really means spirit.”",
      translationClaim: makeClaim({
        id: "w-nishmat-gloss",
        text: "Safe gloss for the construct chain: breath of life. Larger claims that nĕšāmāh “really means spirit,” or that this verse alone establishes a uniquely human spiritual faculty, remain disputed / interpretive.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-2-7", "net-notes-gen-2-7", "job-32-8", "job-34-14-15", "gen-7-22"],
        verificationStatus: "verified",
        visitorNote:
          "Form/gloss widely attested; larger theological meaning of nĕšāmāh here remains open.",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "breath / vital breath",
            confidence: "widely-attested",
            sourceIds: ["wlc", "net-notes-gen-2-7"],
            verificationStatus: "verified",
          },
          {
            gloss: "spirit (later / theological extensions)",
            confidence: "disputed",
            note: "Biblical usage can overlap with breath and life; later traditions develop stronger meanings. Uniquely human spiritual faculty is not settled by this verse alone.",
            sourceIds: ["net-notes-gen-2-7", "job-32-8", "gen-7-22"],
            verificationStatus: "research-continues",
          },
        ],
      },
      followThisWord: [
        terrainNode({
          label: "nishmat ḥayyîm as a phrase",
          kind: "note",
          note: "Read as a construct chain (“breath of life”) before separating the words in isolation.",
        }),
      ],
      sourceIds: ["wlc", "oshb-morph", "gen-2-7"],
      verificationStatus: "verified",
    }),
    word({
      id: "chayyim",
      surface: "חַיִּים",
      lemma: "חַיִּים",
      transliteration: "ḥayyîm",
      form: "Plural-form noun — “life”",
      translatedHere: "of life",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "life",
            confidence: "widely-attested",
            sourceIds: ["wlc"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph"],
      verificationStatus: "verified",
    }),
    word({
      id: "wayehi",
      surface: "וַיְהִי",
      lemma: "הָיָה",
      transliteration: "wayhî",
      form: "Qal consecutive imperfect, 3ms — “and … became”",
      translatedHere: "became",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "to be / become",
            confidence: "widely-attested",
            sourceIds: ["wlc", "oshb-morph"],
            verificationStatus: "research-continues",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph"],
      verificationStatus: "research-continues",
    }),
    word({
      id: "haadam-2",
      surface: "הָאָדָם",
      lemma: "אָדָם",
      transliteration: "hāʾādām",
      form: "Definite article + noun ms — second occurrence",
      translatedHere: "man",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "the human / the man",
            confidence: "widely-attested",
            sourceIds: ["wlc"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["wlc"],
      verificationStatus: "verified",
    }),
    word({
      id: "nephesh",
      surface: "נֶפֶשׁ",
      lemma: "נֶפֶשׁ",
      transliteration: "nepeš",
      form: "Noun singular (here after לְ — “as / into a …”)",
      formClaim: makeClaim({
        id: "w-nephesh-form",
        text: "Noun singular in the phrase nepeš ḥayyāh after לְ.",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph"],
        verificationStatus: "verified",
      }),
      gloss: "living being / living creature (in nepeš ḥayyāh)",
      translatedHere: "soul",
      translationNote:
        "ASV “living soul” vs. “living being / creature.” Older English “soul” can suggest more metaphysics to a modern reader than the Hebrew phrase itself requires here.",
      translationClaim: makeClaim({
        id: "w-nephesh-tr",
        text: "Safe gloss for nepeš ḥayyāh: living being / living creature. “Living soul” is historically important English but may mislead modern readers if “soul” is assumed to mean a separable immortal entity.",
        category: "translation",
        confidence: "widely-attested",
        sourceIds: ["asv-1901", "ylt-1898", "jps-1985", "net-notes-gen-2-7"],
        verificationStatus: "verified",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "living being / living creature (in this phrase)",
            confidence: "widely-attested",
            sourceIds: ["wlc", "gen-1-20", "gen-1-24", "gen-2-7", "net-notes-gen-2-7"],
            verificationStatus: "verified",
          },
          {
            gloss: "life / person / self / desire (broader biblical range)",
            confidence: "widely-attested",
            note: "Semantic range across the Hebrew Bible — not all senses are active in Genesis 2:7.",
            sourceIds: ["net-notes-gen-2-7"],
            verificationStatus: "research-continues",
          },
        ],
      },
      occurrenceNotes: [
        makeClaim({
          id: "w-nephesh-hayyah-animals",
          text: "The same expression nepeš ḥayyāh is used for nonhuman living creatures in Genesis 1:20 and Genesis 1:24. The phrase is therefore not, by itself, terminology reserved exclusively for humans.",
          category: "primary-text",
          confidence: "widely-attested",
          sourceIds: ["gen-1-20", "gen-1-24", "wlc", "net-notes-gen-2-7"],
          verificationStatus: "verified",
          visitorNote:
            "This does not claim that nepeš means only “body,” never “soul,” or that Genesis 2:7 disproves later soul theology.",
        }),
      ],
      followThisWord: [
        terrainNode({
          label: "Shared phrase with other creatures",
          kind: "scripture",
          note: "Exploratory reminder of Gen 1 usage — not a full anthropological system.",
        }),
      ],
      sourceIds: ["wlc", "oshb-morph", "gen-2-7"],
      verificationStatus: "verified",
    }),
    word({
      id: "chayyah",
      surface: "חַיָּה",
      lemma: "חַי",
      transliteration: "ḥayyāh",
      form: "Feminine singular adjective — “living”",
      formClaim: makeClaim({
        id: "w-chayyah-form",
        text: "Feminine singular adjective — “living.”",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph"],
        verificationStatus: "verified",
      }),
      translatedHere: "living",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "living / alive",
            confidence: "widely-attested",
            sourceIds: ["wlc"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph"],
      verificationStatus: "verified",
    }),
  ],
  translations: [
    {
      id: "asv",
      label: "ASV",
      shortName: "ASV",
      attribution: "American Standard Version, 1901",
      year: 1901,
      publicDomain: true,
      sourceId: "asv-1901",
      visibleInCompare: true,
      text: "And Jehovah God formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul.",
      differenceNotes: [
        {
          phrase: "living soul",
          note: "Historically important English rendering. Accurate within older English usage, but potentially misleading to modern readers if “soul” is assumed to mean a separable immortal entity.",
          claim: makeClaim({
            id: "tr-living-soul",
            text: "“Living soul” is a historically important English rendering of nepeš ḥayyāh — not automatically a modern metaphysical “immortal soul.”",
            category: "translation",
            confidence: "widely-attested",
            sourceIds: ["asv-1901", "gen-2-7"],
            verificationStatus: "verified",
          }),
        },
      ],
    },
    {
      id: "ylt",
      label: "YLT",
      shortName: "YLT",
      attribution: "Young’s Literal Translation, 1898 — public domain",
      year: 1898,
      publicDomain: true,
      sourceId: "ylt-1898",
      visibleInCompare: true,
      text: "And Jehovah God formeth the man — dust from the ground, and breatheth into his nostrils breath of life, and the man becometh a living creature.",
      differenceNotes: [
        {
          phrase: "living creature",
          note: "Makes the connection with the same phrase used of animals especially visible, but may sound less natural for a human subject.",
          claim: makeClaim({
            id: "tr-living-creature",
            text: "“Living creature” highlights continuity with nepeš ḥayyāh used of animals — a translation choice, not a claim that “soul” is a mistranslation.",
            category: "translation",
            confidence: "widely-attested",
            sourceIds: ["ylt-1898", "gen-1-20", "gen-1-24"],
            verificationStatus: "verified",
          }),
        },
      ],
    },
    {
      id: "jps1985-note",
      label: "JPS 1985",
      shortName: "NJPS",
      attribution:
        "JPS Tanakh / NJPS, 1985 — copyrighted; rendering noted, full verse not reproduced",
      year: 1985,
      publicDomain: false,
      licenseNote: "Copyrighted — phrase evidence only.",
      sourceId: "jps-1985",
      visibleInCompare: false,
      text: "[Full NJPS verse text not reproduced.] Rendering of the closing phrase: “living being.”",
      differenceNotes: [
        {
          phrase: "living being",
          note: "A common modern solution that preserves animation/personhood while avoiding some later philosophical baggage. Cited as translation evidence, not as Jewish doctrine.",
          claim: makeClaim({
            id: "tr-living-being-jps",
            text: "JPS / NJPS 1985 renders the closing phrase as “living being” — translation evidence, not a statement of Jewish doctrine.",
            category: "translation",
            confidence: "directly-attested",
            sourceIds: ["jps-1985"],
            verificationStatus: "verified",
          }),
        },
      ],
    },
  ],
  sections: {
    languageNotes: [
      makeLanguageNote({
        id: "lang-three-motions",
        text: "The verse moves through formation, inbreathing, and becoming: the human is formed from dust from the ground, receives the breath of life, and becomes a nephesh hayyah — a living being.",
        category: "grammatical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-2-7"],
        verificationStatus: "verified",
        visitorNote:
          "Primary-text sequence. This sequence alone is not proof of a particular body/soul metaphysics.",
      }),
      makeLanguageNote({
        id: "lang-adam-adamah",
        text: "Hebrew places haʾadam, “the human,” beside haʾadamah, “the ground.” The resemblance is literary and audible: the human is narrated in relation to the ground from which the human is formed.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-2-7"],
        verificationStatus: "verified",
        visitorNote: "Literary association — not a claim that ʾādām literally means ground.",
      }),
      makeLanguageNote({
        id: "lang-nephesh-shared",
        text: "Nephesh hayyah does not identify a category unique to humanity. Genesis uses the same expression for other living creatures. The verse may still participate in larger accounts of human distinctiveness, but that distinctiveness cannot be established from this phrase alone.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-20", "gen-1-24", "gen-2-7", "net-notes-gen-2-7"],
        verificationStatus: "verified",
      }),
    ],
    context: [
      {
        title: "Literary setting",
        body: "Genesis 2:7 belongs to the garden narrative beginning in Genesis 2:4. The human is introduced in relation to the ground: before the human exists there is no one to work the ground, the human is formed from it, and later the narrative says the human will return to dust.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-2-4", "gen-2-7", "gen-3-19"],
        verificationStatus: "verified",
      },
      {
        title: "Cross-narrative relationship",
        body: "Genesis 1 and Genesis 2 present human origins with different imagery and literary organization. Genesis 1 emphasizes creation by divine speech and humanity in the image of God; Genesis 2 depicts YHWH God forming the human from earthly material and breathing life directly into the human.",
        category: "literary-context",
        confidence: "reasonable-reading",
        sourceIds: ["wlc", "gen-2-7"],
        verificationStatus: "verified",
        researchFlag:
          "Do not label Genesis 2 simply “a retelling” of Genesis 1 unless attributed; no final source-critical dating claim in this prototype.",
      },
      {
        title: "Dust / return",
        body: "Genesis 3:19 later returns the human to dust, creating a literary closure with the dust formation of Genesis 2:7: formed from dust → return to dust.",
        category: "primary-text",
        confidence: "widely-attested",
        sourceIds: ["gen-2-7", "gen-3-19", "wlc"],
        verificationStatus: "verified",
      },
    ],
    interpretation: [
      interpretationGroup({
        tradition: "jewish",
        label: "Jewish readings",
        readings: [
          namedInterpretation({
            id: "gen-2-7-rashi",
            interpreter: "Rashi",
            work: "Commentary on Genesis 2:7",
            body: "Rashi explicitly observes that animals are also called nephesh hayyah. He nevertheless distinguishes the human nephesh by the addition of understanding and speech. This is Rashi’s interpretation of human distinctiveness — not the lexical definition of nephesh hayyah.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["rashi-gen-2-7"],
          }),
          namedInterpretation({
            id: "gen-2-7-ramban",
            interpreter: "Ramban (Nachmanides)",
            work: "Commentary on Genesis 2:7",
            body: "Ramban treats God’s breathing of nishmat hayyim as significant for the elevated origin and nature of the human soul. His reading goes beyond the lexical minimum of the verse and develops a theological anthropology from the act of divine inbreathing — Ramban’s theological interpretation, not “what Hebrew means.”",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["ramban-gen-2-7"],
          }),
          namedInterpretation({
            id: "gen-2-7-onkelos",
            interpreter: "Targum Onkelos",
            work: "Genesis 2:7",
            body: "Onkelos renders the human’s resulting state with language traditionally understood as a “speaking spirit.” This became important in later Jewish interpretation connecting human distinctiveness with speech. Onkelos is an ancient interpretive translation into Aramaic, not a Hebrew lexicon.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["onkelos-gen-2-7"],
          }),
        ],
      }),
      interpretationGroup({
        tradition: "christian",
        label: "Christian readings",
        readings: [
          namedInterpretation({
            id: "gen-2-7-paul",
            interpreter: "Paul",
            work: "1 Corinthians 15:45",
            body: "Paul quotes the “living being/soul” language of Genesis 2:7 in his contrast between the first Adam and Christ, whom he calls the last Adam and a life-giving spirit. This is a New Testament theological reuse of Genesis 2:7 — not evidence for the lexical meaning of nephesh in the Hebrew verse.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["1cor-15-45", "gen-2-7"],
          }),
          namedInterpretation({
            id: "gen-2-7-augustine",
            interpreter: "Augustine of Hippo",
            work: "City of God, Book XIII, chapter 24",
            body: "Augustine reads Genesis 2:7 within a developed Christian anthropology of soul and spirit and explicitly asks how God’s breathing into Adam should be understood. This belongs to Christian theological reception — not a reproduction of the Hebrew lexical meaning.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["augustine-civ-13-24"],
          }),
          namedInterpretation({
            id: "gen-2-7-calvin",
            interpreter: "John Calvin",
            work: "Commentary on Genesis 2:7 (cf. 1 Corinthians 15:45)",
            body: "Calvin interprets Genesis 2:7 primarily as describing the animation of the human into life. He acknowledges that “living soul” language is also used of beasts while maintaining a larger Christian doctrine of the distinct human soul. Christian reception itself is not monolithic.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["calvin-gen-2-7", "1cor-15-45"],
          }),
        ],
      }),
      interpretationGroup({
        tradition: "academic",
        label: "Academic / philological notes",
        readings: [
          namedInterpretation({
            id: "gen-2-7-acad-range",
            interpreter: "Philological note",
            work: "Semantic range of nephesh",
            body: "Nephesh has a broad semantic range across the Hebrew Bible, including life, person/self, living creature, appetite/desire, and other context-dependent senses. Semantic range does not mean all senses are active in Genesis 2:7.",
            confidence: "widely-attested",
            verificationStatus: "research-continues",
            sourceIds: ["net-notes-gen-2-7"],
            researchFlag:
              "Core claim is publishable; premium lexicon entries (BDB/HALOT/DCH) are registered as future consultation only — not attached as consulted sources on this claim.",
          }),
          namedInterpretation({
            id: "gen-2-7-acad-phrase",
            interpreter: "Philological note",
            work: "nephesh hayyah in Gen 2:7",
            body: "In the phrase nephesh hayyah in Genesis 2:7, “living being/creature” is a contextually strong rendering because the same expression applies to nonhuman creatures.",
            confidence: "widely-attested",
            verificationStatus: "verified",
            sourceIds: ["gen-1-20", "gen-1-24", "gen-2-7", "net-notes-gen-2-7"],
          }),
          namedInterpretation({
            id: "gen-2-7-acad-neshamah",
            interpreter: "Philological note",
            work: "neshamah in Gen 2:7",
            body: "The exact theological implications of neshamah in Genesis 2:7 remain debated. Some treatments take the divine breath as an indicator of distinctive human life or cognition; other biblical occurrences complicate attempts to make neshamah strictly human-only terminology. Disagreement remains visible.",
            confidence: "disputed",
            verificationStatus: "research-continues",
            sourceIds: ["gen-2-7", "gen-7-22", "job-32-8", "job-34-14-15", "net-notes-gen-2-7"],
          }),
        ],
      }),
    ],
    terrain: [
      terrainNode({
        label: "dust",
        kind: "concept",
        note: "Material origin; opens questions of embodiment, dependence, and mortality.",
      }),
      terrainNode({
        label: "ground / earth",
        kind: "concept",
        note: "The human is linguistically and narratively tethered to adamah, without making the terms identical.",
      }),
      terrainNode({
        label: "breath",
        kind: "concept",
        note: "Life is depicted as received rather than self-originating.",
      }),
      terrainNode({
        label: "life",
        kind: "concept",
        note: "The verse moves from formed material to living existence.",
      }),
      terrainNode({
        label: "nephesh",
        kind: "concept",
        note: "A word whose English translation history opens questions about personhood, selfhood, embodiment, and later ideas of soul.",
      }),
      terrainNode({
        label: "living being",
        kind: "concept",
        note: "Humanity shares the phrase nephesh hayyah with other creatures, opening questions about continuity and distinction between human and nonhuman life.",
      }),
      terrainNode({
        label: "mortality",
        kind: "question",
        note: "Genesis 3:19 later returns the human to dust, creating a narrative arc from material origin to material return.",
      }),
    ],
    remainsOpen: [
      openQuestion({
        question:
          "What, if anything, does the direct divine inbreathing distinguish about the human?",
        whyOpen:
          "The grammar narrates direct divine breathing, but the theological scope of that act is not settled by morphology alone.",
      }),
      openQuestion({
        question:
          "What does nephesh hayyah tell us — and what does it not tell us — about “soul”?",
        whyOpen:
          "The phrase denotes a living being and is shared with other creatures. Later Jewish and Christian traditions construct richer accounts of soul that cannot simply be read back into the phrase as its lexical definition.",
      }),
      openQuestion({
        question: "How should neshamah relate to later language of spirit?",
        whyOpen:
          "Biblical breath/spirit vocabulary overlaps in places but is not interchangeable by default. The relationship deserves contextual study rather than a one-word equation.",
      }),
      openQuestion({
        question: "What kind of human distinctiveness does Genesis 2 actually claim?",
        whyOpen:
          "The narrative may develop human distinctiveness through divine address, vocation, relationship, moral command, naming, and other features—not necessarily through nephesh hayyah itself.",
      }),
    ],
  },
};
