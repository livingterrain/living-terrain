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
 * Genesis 1:1–5 — Verified core content packet (second passage).
 * Scholarship status: verified core / research continues
 * Architecture: same hierarchy as Genesis 2:7. Do not treat as complete consensus.
 */
export const GENESIS_1_1_5: Passage = {
  id: "gen-1-1-5",
  slug: "genesis-1-1-5",
  reference: "Genesis 1:1–5",
  language: "hebrew",
  themes: ["beginning", "creation", "speech", "light"],
  status: "ready",
  scholarshipStatus: "verified-core",
  whisper: "Beginning, speech, and light — and what the Hebrew leaves open.",
  translationFraming:
    "English translations must choose among genuine syntactic and lexical decisions in these verses: how to open with bereshit, how to carry tohu va-vohu, and how to render ruach Elohim. The differences are interpretive judgments, not proof that one translator concealed a secret meaning.",
  translationAside:
    "JPS / NJPS 1985 is cited for phrase evidence such as a temporal opening (“When God began to create…”) where relevant — translation evidence, not Jewish doctrine; full copyrighted verse text is not reproduced here.",
  futureRelations: [],
  englishPrimary: {
    label: "ASV",
    attribution: "American Standard Version (1901), public domain",
    text: "In the beginning God created the heavens and the earth.\nAnd the earth was waste and void; and darkness was upon the face of the deep: and the Spirit of God moved upon the face of the waters.\nAnd God said, Let there be light: and there was light.\nAnd God saw the light, that it was good: and God divided the light from the darkness.\nAnd God called the light Day, and the darkness he called Night. And there was evening and there was morning, one day.",
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
      // 1:1 — focus words interactive; remainder plain for readability
      { type: "word", wordId: "bereshit" },
      { type: "text", value: " " },
      { type: "word", wordId: "bara" },
      { type: "text", value: " " },
      { type: "word", wordId: "elohim-1" },
      { type: "text", value: " אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃" },
      { type: "text", value: "\n" },
      // 1:2
      { type: "text", value: "וְהָאָרֶץ הָיְתָה " },
      { type: "word", wordId: "tohu" },
      { type: "text", value: " " },
      { type: "word", wordId: "vavohu" },
      { type: "text", value: " וְחֹשֶׁךְ עַל־פְּנֵי " },
      { type: "word", wordId: "tehom" },
      { type: "text", value: " וְ" },
      { type: "word", wordId: "ruach" },
      { type: "text", value: " " },
      { type: "word", wordId: "elohim-2" },
      { type: "text", value: " " },
      { type: "word", wordId: "merachefet" },
      { type: "text", value: " עַל־פְּנֵי הַמָּיִם׃" },
      { type: "text", value: "\n" },
      // 1:3
      { type: "text", value: "וַיֹּאמֶר אֱלֹהִים " },
      { type: "word", wordId: "yehi" },
      { type: "text", value: " " },
      { type: "word", wordId: "or" },
      { type: "text", value: " וַיְהִי־אוֹר׃" },
      { type: "text", value: "\n" },
      // 1:4
      {
        type: "text",
        value: "וַיַּרְא אֱלֹהִים אֶת־הָאוֹר כִּי־טוֹב ",
      },
      { type: "word", wordId: "vayavdel" },
      {
        type: "text",
        value: " אֱלֹהִים בֵּין הָאוֹר וּבֵין הַחֹשֶׁךְ׃",
      },
      { type: "text", value: "\n" },
      // 1:5
      { type: "word", wordId: "vayiqra" },
      {
        type: "text",
        value:
          " אֱלֹהִים לָאוֹר יוֹם וְלַחֹשֶׁךְ קָרָא לָיְלָה וַיְהִי־עֶרֶב וַיְהִי־בֹקֶר יוֹם אֶחָד׃",
      },
    ],
  },
  words: [
    word({
      id: "bereshit",
      surface: "בְּרֵאשִׁית",
      lemma: "רֵאשִׁית",
      transliteration: "bərēʾšît",
      form: "Preposition + feminine singular noun — traditionally “in beginning / beginning of”",
      formClaim: makeClaim({
        id: "w-bereshit-form",
        text: "Bereshit is traditionally rendered “In the beginning,” but the Hebrew permits debate over whether the phrase stands independently or functions as part of a temporal construction such as “When God began to create…”",
        category: "grammatical",
        confidence: "disputed",
        sourceIds: [
          "wlc",
          "gen-1-1-5",
          "rashi-gen-1-1",
          "ibn-ezra-gen-1-1",
          "radak-gen-1-1",
          "net-notes-gen-1-1-2",
        ],
        verificationStatus: "research-continues",
        visitorNote:
          "Grammar of bereshit is disputed; the existence of longstanding debate is directly attested in named Jewish readings.",
      }),
      translatedHere: "In the beginning",
      translationNote:
        "Traditional English opening. Competing temporal renderings are grammatically discussed — not merely stylistic variants.",
      translationClaim: makeClaim({
        id: "w-bereshit-tr",
        text: "Safe gloss: beginning / beginning of. Do not treat one English opening as unquestionably the original meaning.",
        category: "translation",
        confidence: "disputed",
        sourceIds: ["asv-1901", "ylt-1898", "jps-1985", "net-notes-gen-1-1-2"],
        verificationStatus: "research-continues",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "beginning / beginning of",
            confidence: "widely-attested",
            sourceIds: ["wlc", "oshb-morph"],
            verificationStatus: "verified",
          },
          {
            gloss: "temporal frame (“when … began” constructions)",
            confidence: "disputed",
            note: "Defended in construct-like analyses; not the only possible reading.",
            sourceIds: ["rashi-gen-1-1", "ibn-ezra-gen-1-1", "net-notes-gen-1-1-2"],
            verificationStatus: "research-continues",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph", "gen-1-1-5"],
      verificationStatus: "research-continues",
    }),
    word({
      id: "bara",
      surface: "בָּרָא",
      lemma: "בָּרָא",
      transliteration: "bārāʾ",
      form: "Qal perfect, 3ms",
      formClaim: makeClaim({
        id: "w-bara-form",
        text: "Qal perfect, third masculine singular — “created.”",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph"],
        verificationStatus: "verified",
      }),
      translatedHere: "created",
      translationClaim: makeClaim({
        id: "w-bara-tr",
        text: "Bara describes divine creative activity here. The verb itself does not settle the later philosophical question of whether creation occurred from absolute nothingness.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5", "net-notes-gen-1-1-2"],
        verificationStatus: "verified",
        visitorNote:
          "Lexical caution: do not define bara as “create from nothing,” and do not say Genesis rejects creatio ex nihilo.",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "created / performed divine creative activity",
            confidence: "widely-attested",
            sourceIds: ["wlc"],
            verificationStatus: "verified",
          },
          {
            gloss: "create from absolute nothing (philosophical creatio ex nihilo)",
            confidence: "disputed",
            note: "Later theological doctrine is not settled by the lexical meaning of bara alone.",
            sourceIds: ["gen-1-1-5"],
            verificationStatus: "research-continues",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph"],
      verificationStatus: "verified",
    }),
    word({
      id: "elohim-1",
      surface: "אֱלֹהִים",
      lemma: "אֱלֹהִים",
      transliteration: "ʾĕlōhîm",
      form: "Morphologically plural noun with singular verbal agreement here",
      formClaim: makeClaim({
        id: "w-elohim-1-form",
        text: "Elohim is plural in form but takes singular verbal agreement here, signaling a singular referent in this context.",
        category: "grammatical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph", "gen-1-1-5"],
        verificationStatus: "verified",
        visitorNote:
          "Plural morphology is not lexical proof of the Trinity; Trinitarian readings belong to attributed interpretation.",
      }),
      translatedHere: "God",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "God (singular referent with plural morphology)",
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
      id: "tohu",
      surface: "תֹהוּ",
      lemma: "תֹּהוּ",
      transliteration: "tōhû",
      form: "Common masculine singular noun (in the pair tohu va-vohu)",
      formClaim: makeClaim({
        id: "w-tohu-form",
        text: "Part of the Hebrew pair tohu va-vohu describing the earth’s unformed or desolate condition.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5"],
        verificationStatus: "verified",
      }),
      translatedHere: "waste / formless",
      translationNote:
        "English varies (formless, waste, unformed) because the pair is vivid and difficult to reproduce exactly.",
      translationClaim: makeClaim({
        id: "w-tohu-tr",
        text: "Tohu va-vohu describes the earth’s unformed or desolate condition. Precise English rendering is a translation choice.",
        category: "translation",
        confidence: "widely-attested",
        sourceIds: ["asv-1901", "ylt-1898", "gen-1-1-5"],
        verificationStatus: "verified",
        visitorNote:
          "Do not assign a single hidden mystical meaning, scientific nothingness, or later technical “primordial chaos” as the lexical definition.",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "formlessness / waste / lack of order or habitation (in this pair)",
            confidence: "widely-attested",
            sourceIds: ["wlc", "gen-1-1-5"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph"],
      verificationStatus: "verified",
    }),
    word({
      id: "vavohu",
      surface: "וָבֹהוּ",
      lemma: "בֹּהוּ",
      transliteration: "wāḇōhû",
      form: "Conjunction + common masculine singular noun (pair with tohu)",
      formClaim: makeClaim({
        id: "w-vohu-form",
        text: "Second member of tohu va-vohu — “void / emptiness” cluster in English attempts.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5"],
        verificationStatus: "verified",
      }),
      translatedHere: "void / empty",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "void / emptiness / lack of fullness (in this pair)",
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
      id: "tehom",
      surface: "תְהוֹם",
      lemma: "תְּהוֹם",
      transliteration: "təhôm",
      form: "Common feminine singular noun — the deep",
      formClaim: makeClaim({
        id: "w-tehom-form",
        text: "Tehom names the deep or watery abyss beneath the darkness.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5"],
        verificationStatus: "verified",
      }),
      translatedHere: "the deep",
      translationClaim: makeClaim({
        id: "w-tehom-tr",
        text: "Safe gloss: the deep / watery deep / abyss. Ancient Near Eastern comparisons with primordial-water imagery are relevant; direct borrowing from Babylonian Tiamat is not settled fact.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5", "net-notes-gen-1-1-2"],
        verificationStatus: "research-continues",
        visitorNote:
          "Similarity belongs to a broader Ancient Near Eastern world of primordial-water imagery. Similarity does not by itself establish direct borrowing.",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "the deep / watery abyss",
            confidence: "widely-attested",
            sourceIds: ["wlc"],
            verificationStatus: "verified",
          },
          {
            gloss: "direct linguistic borrowing from Tiamat",
            confidence: "disputed",
            note: "Comparative scholarship — not a textual fact of Genesis.",
            sourceIds: ["net-notes-gen-1-1-2"],
            verificationStatus: "research-continues",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph"],
      verificationStatus: "verified",
    }),
    word({
      id: "ruach",
      surface: "רוּחַ",
      lemma: "רוּחַ",
      transliteration: "rûaḥ",
      form: "Feminine singular noun in construct with Elohim",
      formClaim: makeClaim({
        id: "w-ruach-form",
        text: "Ruach can denote wind, breath, or spirit depending on context. In ruach Elohim, translators must also decide how Elohim relates to the noun.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5", "net-notes-gen-1-1-2"],
        verificationStatus: "research-continues",
        visitorNote:
          "Translation ambiguity is well attested. Do not say it definitely means Holy Spirit, definitely means ordinary wind, or that all meanings are simultaneously active.",
      }),
      translatedHere: "Spirit / wind",
      translationNote:
        "“Spirit of God” is traditional and grammatically possible; “wind from God” and related renderings are also defended.",
      translationClaim: makeClaim({
        id: "w-ruach-tr",
        text: "Safe translation range includes Spirit of God, wind from God, divine wind, and (in some interpretive traditions) mighty wind. Semantic range is not contextual equivalence.",
        category: "translation",
        confidence: "widely-attested",
        sourceIds: ["asv-1901", "ylt-1898", "net-notes-gen-1-1-2"],
        verificationStatus: "research-continues",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "spirit",
            confidence: "reasonable-reading",
            sourceIds: ["wlc", "rashi-gen-1-2"],
            verificationStatus: "research-continues",
          },
          {
            gloss: "wind / breath",
            confidence: "reasonable-reading",
            sourceIds: ["wlc", "net-notes-gen-1-1-2"],
            verificationStatus: "research-continues",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph"],
      verificationStatus: "research-continues",
    }),
    word({
      id: "elohim-2",
      surface: "אֱלֹהִים",
      lemma: "אֱלֹהִים",
      transliteration: "ʾĕlōhîm",
      form: "Morphologically plural noun — here in the phrase ruach Elohim",
      formClaim: makeClaim({
        id: "w-elohim-2-form",
        text: "In ruach Elohim, Elohim’s relation to ruach is part of the translation decision (of God / from God / divine).",
        category: "grammatical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5", "net-notes-gen-1-1-2"],
        verificationStatus: "research-continues",
      }),
      translatedHere: "God / of God",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "God (as in Spirit/wind of God)",
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
      id: "merachefet",
      surface: "מְרַחֶפֶת",
      lemma: "רחף",
      transliteration: "məraḥepet",
      form: "Piel participle, feminine singular",
      formClaim: makeClaim({
        id: "w-merachefet-form",
        text: "The participle depicts movement over the waters. Safe glosses include hovering / moving over / fluttering.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph", "deut-32-11"],
        verificationStatus: "verified",
      }),
      translatedHere: "moved / hovering",
      occurrenceNotes: [
        makeClaim({
          id: "w-merachefet-deut",
          text: "Deuteronomy 32:11 uses related imagery of a bird hovering/fluttering over its young.",
          category: "primary-text",
          confidence: "widely-attested",
          sourceIds: ["deut-32-11", "wlc"],
          verificationStatus: "verified",
          visitorNote:
            "Cross-reference is primary-text observation. Later bird-like developments belong to interpretation.",
        }),
      ],
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "hovering / fluttering / moving over",
            confidence: "widely-attested",
            sourceIds: ["wlc", "deut-32-11"],
            verificationStatus: "verified",
          },
        ],
      },
      followThisWord: [
        terrainNode({
          label: "bird imagery (exploratory)",
          kind: "concept",
          note: "Later interpreters develop the bird-like imagery in different ways — not a lexical requirement of every occurrence.",
        }),
      ],
      sourceIds: ["wlc", "oshb-morph", "deut-32-11"],
      verificationStatus: "verified",
    }),
    word({
      id: "yehi",
      surface: "יְהִי",
      lemma: "היה",
      transliteration: "yəhî",
      form: "Qal jussive, 3ms — “let there be”",
      formClaim: makeClaim({
        id: "w-yehi-form",
        text: "Jussive form opening the divine speech: “Let there be…”",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph"],
        verificationStatus: "verified",
      }),
      translatedHere: "Let there be",
      occurrenceNotes: [
        makeClaim({
          id: "w-yehi-or-seq",
          text: "God’s speech is immediately followed by the narrated appearance of what was spoken: “Let there be light” → “and there was light.”",
          category: "literary-context",
          confidence: "widely-attested",
          sourceIds: ["wlc", "gen-1-1-5"],
          verificationStatus: "verified",
          visitorNote: "Direct textual observation — not a forced cosmological theory.",
        }),
      ],
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "let there be / may there be",
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
      id: "or",
      surface: "אוֹר",
      lemma: "אוֹר",
      transliteration: "ʾôr",
      form: "Common masculine singular noun — light",
      formClaim: makeClaim({
        id: "w-or-form",
        text: "Light appears by divine speech in 1:3–5; the luminaries are introduced later (1:14–18).",
        category: "primary-text",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5", "gen-1-14-18"],
        verificationStatus: "verified",
        visitorNote:
          "The narrative does not identify this light simply as sunlight. What the light “really is” belongs to interpretation.",
      }),
      translatedHere: "light",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "light",
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
      id: "vayavdel",
      surface: "וַיַּבְדֵּל",
      lemma: "בדל",
      transliteration: "wayyaḇdēl",
      form: "Hiphil consecutive imperfect, 3ms — and he separated / distinguished",
      formClaim: makeClaim({
        id: "w-vayavdel-form",
        text: "God distinguishes light from darkness. The verb does not by itself decide whether the distinction is purely spatial, temporal, functional, or conceptual.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph", "gen-1-1-5"],
        verificationStatus: "verified",
      }),
      translatedHere: "divided / separated",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "separated / distinguished",
            confidence: "widely-attested",
            sourceIds: ["wlc"],
            verificationStatus: "verified",
          },
        ],
      },
      followThisWord: [
        terrainNode({
          label: "Ibn Ezra on naming",
          kind: "note",
          note: "Attributed readings may connect separation with naming as day and night — see Interpretation.",
        }),
      ],
      sourceIds: ["wlc", "oshb-morph"],
      verificationStatus: "verified",
    }),
    word({
      id: "vayiqra",
      surface: "וַיִּקְרָא",
      lemma: "קרא",
      transliteration: "wayyiqrāʾ",
      form: "Qal consecutive imperfect, 3ms — and he called / named",
      formClaim: makeClaim({
        id: "w-vayiqra-form",
        text: "God names the light “day” and the darkness “night.” Naming follows distinction in the narrative sequence.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5"],
        verificationStatus: "verified",
      }),
      translatedHere: "called / named",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "called / named",
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
      text: "In the beginning God created the heavens and the earth.\nAnd the earth was waste and void; and darkness was upon the face of the deep: and the Spirit of God moved upon the face of the waters.\nAnd God said, Let there be light: and there was light.\nAnd God saw the light, that it was good: and God divided the light from the darkness.\nAnd God called the light Day, and the darkness he called Night. And there was evening and there was morning, one day.",
      differenceNotes: [
        {
          phrase: "In the beginning",
          note: "Traditional independent opening. The difference from temporal openings is syntactic, not merely stylistic.",
          claim: makeClaim({
            id: "tr-bereshit-traditional",
            text: "Traditional reading treats verse 1 as an independent opening statement. Competing analyses treat verses 1–2 as temporal circumstances for the first divine command in verse 3.",
            category: "translation",
            confidence: "disputed",
            sourceIds: ["asv-1901", "gen-1-1-5", "net-notes-gen-1-1-2"],
            verificationStatus: "research-continues",
          }),
        },
        {
          phrase: "waste and void",
          note: "One English clustering around lack of form, order, habitation, or fullness. No single English phrase reproduces tohu va-vohu perfectly.",
          claim: makeClaim({
            id: "tr-tohu-waste-void",
            text: "Translations of tohu va-vohu cluster around lack of form, order, habitation, or fullness.",
            category: "translation",
            confidence: "widely-attested",
            sourceIds: ["asv-1901", "gen-1-1-5"],
            verificationStatus: "verified",
          }),
        },
        {
          phrase: "Spirit of God",
          note: "Traditional and grammatically possible. Wind from God / divine wind are also defended — a genuine interpretive translation decision.",
          claim: makeClaim({
            id: "tr-ruach-spirit",
            text: "Ruach Elohim does not mechanically collapse to one English expression without contextual judgment.",
            category: "translation",
            confidence: "widely-attested",
            sourceIds: ["asv-1901", "net-notes-gen-1-1-2"],
            verificationStatus: "research-continues",
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
      text: "In the beginning of God's preparing the heavens and the earth —\nthe earth hath existed waste and void, and darkness [is] on the face of the deep, and the Spirit of God fluttering on the face of the waters,\nand God saith, 'Let light be;' and light is.\nAnd God seeth the light that [it is] good, and God separateth between the light and the darkness,\nand God calleth to the light 'Day,' and to the darkness He hath called 'Night;' and there is an evening, and there is a morning — day one.",
      differenceNotes: [
        {
          phrase: "In the beginning of God's preparing",
          note: "Closer to a construct / temporal framing than the familiar independent “In the beginning God created…”. Do not declare one universally correct.",
          claim: makeClaim({
            id: "tr-bereshit-temporal-ylt",
            text: "YLT’s opening reflects a construct-like English strategy. The Hebrew debate remains open.",
            category: "translation",
            confidence: "disputed",
            sourceIds: ["ylt-1898", "ibn-ezra-gen-1-1", "net-notes-gen-1-1-2"],
            verificationStatus: "research-continues",
          }),
        },
        {
          phrase: "fluttering",
          note: "English choice for merachefet that makes bird-like motion especially audible; other versions use “moved.”",
          claim: makeClaim({
            id: "tr-merachefet-fluttering",
            text: "Fluttering / moved / hovering are translation choices for the participle’s motion over the waters.",
            category: "translation",
            confidence: "widely-attested",
            sourceIds: ["ylt-1898", "deut-32-11"],
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
        "JPS Tanakh / NJPS, 1985 — copyrighted; phrase evidence only",
      year: 1985,
      publicDomain: false,
      licenseNote: "Copyrighted — phrase evidence only.",
      sourceId: "jps-1985",
      visibleInCompare: false,
      text: "[Full NJPS verse text not reproduced.] Phrase evidence includes a temporal opening often summarized as “When God began to create…”",
      differenceNotes: [
        {
          phrase: "When God began to create",
          note: "A common modern temporal English strategy for bereshit — cited as translation evidence, not as Jewish doctrine.",
          claim: makeClaim({
            id: "tr-bereshit-jps-temporal",
            text: "NJPS-style temporal openings illustrate one syntactic option; they do not settle the Hebrew debate by themselves.",
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
        id: "lang-gen1-sequence",
        text: "Genesis 1:1–5 moves from an opening statement or temporal frame, through an unformed watery scene, into divine speech, the appearance of light, evaluation, separation, naming, and the first day.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5"],
        verificationStatus: "verified",
        visitorNote:
          "Primary-text / literary sequence. Do not use this sequence alone to force a single cosmological or theological interpretation.",
      }),
      makeLanguageNote({
        id: "lang-bereshit-syntax",
        text: "The opening Hebrew is grammatically less settled than the familiar English “In the beginning” suggests. Bereshit can be read within more than one syntactic construction.",
        category: "grammatical",
        confidence: "disputed",
        sourceIds: [
          "wlc",
          "gen-1-1-5",
          "rashi-gen-1-1",
          "ibn-ezra-gen-1-1",
          "radak-gen-1-1",
          "net-notes-gen-1-1-2",
        ],
        verificationStatus: "research-continues",
      }),
      makeLanguageNote({
        id: "lang-bara-caution",
        text: "Bara identifies God as the actor of creation, but the verb itself does not specify a complete philosophical theory of creation from nothing.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5", "net-notes-gen-1-1-2"],
        verificationStatus: "verified",
      }),
      makeLanguageNote({
        id: "lang-ruach-ambiguity",
        text: "Ruach Elohim preserves real translational ambiguity because ruach can denote wind, breath, or spirit and because the relationship between ruach and Elohim must be interpreted contextually.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5", "net-notes-gen-1-1-2"],
        verificationStatus: "research-continues",
      }),
      makeLanguageNote({
        id: "lang-speech-pattern",
        text: "The first creative act narrated after the opening state occurs through speech: God says, light appears, God evaluates it, distinguishes it from darkness, and names the resulting domains.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5"],
        verificationStatus: "verified",
      }),
    ],
    context: [
      {
        title: "Literary setting",
        body: "Genesis 1:1–2:3 is a highly structured creation account organized by repeated divine speech, fulfillment, evaluation, separation, naming, and numbered days.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5", "gen-2-1-3"],
        verificationStatus: "verified",
        researchFlag: "Do not call every repetition identical.",
      },
      {
        title: "Order / distinction",
        body: "Verses 3–5 establish a recurring pattern: divine speech brings a condition into being, God evaluates it, distinction is created, and domains are named.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5"],
        verificationStatus: "verified",
      },
      {
        title: "Light before luminaries",
        body: "Light appears on day one, while the sun, moon, and stars are introduced later in the account. The narrative therefore does not identify the light of verses 3–5 simply as sunlight.",
        category: "primary-text",
        confidence: "widely-attested",
        sourceIds: ["wlc", "gen-1-1-5", "gen-1-14-18"],
        verificationStatus: "verified",
        researchFlag:
          "Do not explain what the light “really is” here — that belongs to interpretation.",
      },
      {
        title: "Ancient Near Eastern context",
        body: "Genesis participates in an Ancient Near Eastern world where creation stories commonly involve primordial waters, cosmic ordering, and the establishment of a habitable world. Comparison does not equal derivation. Parallels can illuminate shared cultural questions without proving Genesis copied a specific story.",
        category: "historical-context",
        confidence: "reasonable-reading",
        sourceIds: ["gen-1-1-5", "net-notes-gen-1-1-2"],
        verificationStatus: "research-continues",
        researchFlag:
          "Enuma Elish / Tiamat comparisons belong to comparative scholarship, not textual fact. Direct borrowing from Tiamat is disputed.",
      },
    ],
    interpretation: [
      interpretationGroup({
        tradition: "jewish",
        label: "Jewish readings",
        readings: [
          namedInterpretation({
            id: "gen-1-rashi-1-1",
            interpreter: "Rashi",
            work: "Commentary on Genesis 1:1",
            body: "Rashi argues that the opening should not be read as a straightforward chronological list of what was created first. In his plain-sense treatment, he explains bereshit through a construct-like relationship and notes that the text has not yet described the creation of the waters already present in verse 2.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["rashi-gen-1-1"],
          }),
          namedInterpretation({
            id: "gen-1-rashi-1-2",
            interpreter: "Rashi",
            work: "Commentary on Genesis 1:2",
            body: "Rashi interprets ruach Elohim as the Spirit of God and develops the image of divine glory hovering over the waters, comparing the movement to a dove hovering over its nest. This is Rashi’s interpretation — not the lexical definition of ruach Elohim.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["rashi-gen-1-2"],
          }),
          namedInterpretation({
            id: "gen-1-ibn-ezra-1-1",
            interpreter: "Ibn Ezra",
            work: "Commentary on Genesis 1:1",
            body: "Ibn Ezra discusses bereshit as a construct construction and defends the grammatical possibility of a noun in construct relation to a following verbal clause.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["ibn-ezra-gen-1-1"],
          }),
          namedInterpretation({
            id: "gen-1-ibn-ezra-1-4-5",
            interpreter: "Ibn Ezra",
            work: "Commentary on Genesis 1:4–5",
            body: "Ibn Ezra interprets the separation of light and darkness through their naming as day and night rather than as a simple physical division.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["ibn-ezra-gen-1-4-5"],
          }),
          namedInterpretation({
            id: "gen-1-radak-1-1",
            interpreter: "Radak",
            work: "Commentary on Genesis 1:1",
            body: "Radak is among Jewish interpreters who defend an independent/absolute reading of bereshit, against construct-like analyses that treat the opening primarily as a temporal frame.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["radak-gen-1-1"],
          }),
          namedInterpretation({
            id: "gen-1-ramban-1-1",
            interpreter: "Ramban (Nachmanides)",
            work: "Commentary on Genesis 1:1",
            body: "Ramban engages both grammatical and theological readings of bereshit and develops a much richer metaphysical account of creation than lexical analysis alone provides.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["ramban-gen-1-1"],
            researchFlag:
              "Do not flatten Ramban into one simplistic proposition beyond what this packet safely supports.",
          }),
          namedInterpretation({
            id: "gen-1-ramban-1-3-4",
            interpreter: "Ramban (Nachmanides)",
            work: "Commentary on Genesis 1:3–4",
            body: "On light, Ramban preserves a distinction between plain meaning and aggadic/theological interpretation rather than collapsing both into a single lexical claim.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["ramban-gen-1-3-4"],
          }),
          namedInterpretation({
            id: "gen-1-bereshit-rabbah",
            interpreter: "Bereshit Rabbah",
            work: "Genesis Rabbah 1",
            body: "Early rabbinic discussion preserves disagreement about the order of heaven and earth rather than presenting one uncontested chronology.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["bereshit-rabbah-1"],
          }),
        ],
      }),
      interpretationGroup({
        tradition: "christian",
        label: "Christian readings",
        readings: [
          namedInterpretation({
            id: "gen-1-john-reception",
            interpreter: "Gospel of John",
            work: "John 1:1–5",
            body: "The Gospel of John deliberately reuses “In the beginning” and connects creation, the Logos, life, and light. This is later Christian theological reception of Genesis language, not an explanation of Hebrew grammar.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["john-1-1-5", "gen-1-1-5"],
            researchFlag:
              "Evidence relation (later reuse) is registered in relations.ts as reverse of John → Genesis textual echo. Interpretation here remains reception — not Hebrew lexical evidence.",
          }),
          namedInterpretation({
            id: "gen-1-ex-nihilo-framing",
            interpreter: "Later creation theology",
            work: "Creation from nothing (reception framing)",
            body: "Creation from nothing became a major doctrine in later Jewish and Christian theology. Genesis 1:1 has been central to that doctrine, but the doctrine should not be reduced to the lexical meaning of bara alone.",
            confidence: "tradition-noted",
            verificationStatus: "research-continues",
            sourceIds: ["gen-1-1-5"],
            researchFlag:
              "No named patristic/medieval thinker attached in this pass — do not invent one. Not a generic “Christianity says.”",
          }),
          namedInterpretation({
            id: "gen-1-ruach-trinitarian",
            interpreter: "Christian reception of ruach Elohim",
            work: "Holy Spirit readings (reception history)",
            body: "Christian interpreters have often read ruach Elohim in light of later theology of the Holy Spirit. This is reception history. The plural form Elohim and the phrase ruach Elohim do not function as grammatical proof of the Trinity.",
            confidence: "tradition-noted",
            verificationStatus: "research-continues",
            sourceIds: ["gen-1-1-5"],
            researchFlag:
              "No named patristic source verified in this pass — left as research-continues rather than inventing one.",
          }),
        ],
      }),
      interpretationGroup({
        tradition: "academic",
        label: "Academic / philological notes",
        readings: [
          namedInterpretation({
            id: "gen-1-acad-syntax",
            interpreter: "Philological note",
            work: "Syntax of Genesis 1:1",
            body: "Genesis 1:1 permits more than one syntactic analysis. The debate is longstanding and remains open.",
            confidence: "disputed",
            verificationStatus: "research-continues",
            sourceIds: ["net-notes-gen-1-1-2", "gen-1-1-5"],
          }),
          namedInterpretation({
            id: "gen-1-acad-bara",
            interpreter: "Philological note",
            work: "bara and creatio ex nihilo",
            body: "Bara does not lexically require creation ex nihilo. Later metaphysical doctrine is a separate question from the verb’s lexical contribution here.",
            confidence: "widely-attested",
            verificationStatus: "verified",
            sourceIds: ["gen-1-1-5", "net-notes-gen-1-1-2"],
          }),
          namedInterpretation({
            id: "gen-1-acad-tohu",
            interpreter: "Philological note",
            work: "tohu va-vohu",
            body: "Tohu va-vohu describes an unformed/desolate/uninhabitable condition, but precise English equivalents vary.",
            confidence: "widely-attested",
            verificationStatus: "verified",
            sourceIds: ["gen-1-1-5", "asv-1901", "ylt-1898"],
          }),
          namedInterpretation({
            id: "gen-1-acad-ruach",
            interpreter: "Philological note",
            work: "ruach Elohim",
            body: "Ruach Elohim has genuine translation ambiguity among spirit, wind, and related renderings.",
            confidence: "widely-attested",
            verificationStatus: "research-continues",
            sourceIds: ["gen-1-1-5", "net-notes-gen-1-1-2"],
          }),
          namedInterpretation({
            id: "gen-1-acad-tehom",
            interpreter: "Philological note",
            work: "tehom and ANE comparison",
            body: "Tehom belongs to the vocabulary of the watery deep. Ancient Near Eastern comparisons are relevant, but direct derivation from Tiamat should not be asserted as settled.",
            confidence: "disputed",
            verificationStatus: "research-continues",
            sourceIds: ["gen-1-1-5", "net-notes-gen-1-1-2"],
            researchFlag:
              "Comparison = well-supported as a scholarly conversation; direct borrowing = disputed. Avoid “Genesis copied Babylon.”",
          }),
          namedInterpretation({
            id: "gen-1-acad-order",
            interpreter: "Philological note",
            work: "Distinction and ordering",
            body: "Genesis 1 emphasizes distinction and ordering alongside acts of bringing entities into being.",
            confidence: "widely-attested",
            verificationStatus: "verified",
            sourceIds: ["wlc", "gen-1-1-5"],
          }),
        ],
      }),
    ],
    terrain: [
      terrainNode({
        label: "beginning",
        kind: "concept",
        note: "The passage opens by orienting the reader toward origin, but even the grammar leaves questions about how the beginning is framed.",
      }),
      terrainNode({
        label: "unformed",
        kind: "concept",
        note: "Creation begins from a scene not yet ordered for inhabitation.",
      }),
      terrainNode({
        label: "deep",
        kind: "concept",
        note: "The watery deep opens questions about chaos, potential, boundary, and habitable order.",
      }),
      terrainNode({
        label: "wind / breath / spirit",
        kind: "concept",
        note: "Ruach sits at a linguistic threshold where English must choose among meanings the Hebrew word can carry in different contexts.",
      }),
      terrainNode({
        label: "speech",
        kind: "concept",
        note: "Creation is narrated through divine utterance: what is spoken becomes narratively effective.",
      }),
      terrainNode({
        label: "light",
        kind: "concept",
        note: "Light appears before the later luminaries, opening questions about function, visibility, order, and symbolic reception.",
      }),
      terrainNode({
        label: "distinction",
        kind: "concept",
        note: "Light and darkness are not merely present; they are differentiated.",
      }),
      terrainNode({
        label: "naming",
        kind: "concept",
        note: "Distinction is followed by naming: day / night.",
      }),
      terrainNode({
        label: "order",
        kind: "concept",
        note: "The passage moves toward an increasingly differentiated world.",
      }),
    ],
    remainsOpen: [
      openQuestion({
        question:
          "What exactly is the grammatical relationship between Genesis 1:1, 1:2, and 1:3?",
        whyOpen:
          "Hebrew grammar permits competing analyses. The difference affects whether verse 1 reads as an independent opening statement or as part of a temporal frame.",
      }),
      openQuestion({
        question: "Does Genesis 1:1 teach creation from nothing?",
        whyOpen:
          "The verse has been foundational for later creation theology, but neither bereshit nor bara alone settles the full metaphysical question.",
      }),
      openQuestion({
        question: "What is ruach Elohim here?",
        whyOpen:
          "Spirit of God, divine wind, and related readings all have grammatical and contextual arguments. The Hebrew requires interpretation rather than providing an automatic English equivalent.",
      }),
      openQuestion({
        question:
          "What is the relationship between tehom and other Ancient Near Eastern creation traditions?",
        whyOpen:
          "Shared primordial-water imagery is real. Whether a specific literary or linguistic dependence should be claimed is a separate and more difficult question.",
      }),
      openQuestion({
        question: "What is the light created before the sun and moon?",
        whyOpen:
          "The narrative introduces light before the luminaries but does not explicitly explain its physical mechanism. Jewish and Christian interpreters later develop multiple readings.",
      }),
      openQuestion({
        question: "What does creation by speech mean within the narrative?",
        whyOpen:
          "The text presents divine speech as effective, but the philosophical and theological implications of that presentation belong to interpretation.",
      }),
    ],
  },
};
