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
 * John 1:1–5 — Verified core content packet (fourth passage; first Greek).
 * Scholarship status: verified core / research continues
 * Greek base: Nestle 1904 (public domain).
 * Do not claim John reveals what Genesis secretly meant.
 */
export const JOHN_1_1_5: Passage = {
  id: "john-1-1-5",
  slug: "john-1-1-5",
  reference: "John 1:1–5",
  language: "greek",
  themes: ["beginning", "Logos", "life", "light"],
  status: "ready",
  scholarshipStatus: "verified-core",
  whisper:
    "Beginning, Logos, life, and light — and where grammar ends before later doctrine.",
  translationFraming:
    "English translations must choose how to carry θεὸς ἦν ὁ λόγος, how to render ἐγένετο, and how to hear κατέλαβεν. The decisions are interpretive judgments constrained by Greek grammar — not proof that one translator concealed a secret meaning.",
  translationAside:
    "ASV’s “apprehended” and YLT’s “perceive” illustrate two English strategies for κατέλαβεν. Neither crowns a single meaning for the Greek verb.",
  futureRelations: [],
  englishPrimary: {
    label: "ASV",
    attribution: "American Standard Version (1901), public domain",
    text: "In the beginning was the Word, and the Word was with God, and the Word was God.\nThe same was in the beginning with God.\nAll things were made through him; and without him was not anything made that hath been made.\nIn him was life; and the life was the light of men.\nAnd the light shineth in the darkness; and the darkness apprehended it not.",
    sourceId: "asv-1901",
  },
  semanticRangeNote: SEMANTIC_CAUTION,
  original: {
    scriptLabel: "Greek",
    dir: "ltr",
    lang: "el",
    source: "Nestle 1904 Greek New Testament",
    sourceId: "nestle-1904",
    tokens: [
      // 1:1
      { type: "text", value: "Ἐν " },
      { type: "word", wordId: "arche" },
      { type: "text", value: " " },
      { type: "word", wordId: "en-1" },
      { type: "text", value: " ὁ " },
      { type: "word", wordId: "logos-1" },
      { type: "text", value: ", καὶ ὁ " },
      { type: "word", wordId: "logos-2" },
      { type: "text", value: " ἦν " },
      { type: "word", wordId: "pros" },
      { type: "text", value: " τὸν " },
      { type: "word", wordId: "theon" },
      { type: "text", value: ", καὶ " },
      { type: "word", wordId: "theos" },
      { type: "text", value: " ἦν ὁ " },
      { type: "word", wordId: "logos-3" },
      { type: "text", value: "." },
      { type: "text", value: "\n" },
      // 1:2
      {
        type: "text",
        value: "Οὗτος ἦν ἐν ἀρχῇ πρὸς τὸν Θεόν.",
      },
      { type: "text", value: "\n" },
      // 1:3 — Nestle 1904 attaches ὃ γέγονεν with v. 3
      { type: "text", value: "πάντα δι’ αὐτοῦ " },
      { type: "word", wordId: "egeneto" },
      {
        type: "text",
        value: ", καὶ χωρὶς αὐτοῦ ἐγένετο οὐδὲ ἕν ὃ γέγονεν.",
      },
      { type: "text", value: "\n" },
      // 1:4
      { type: "text", value: "ἐν αὐτῷ " },
      { type: "word", wordId: "zoe" },
      { type: "text", value: " ἦν, καὶ ἡ ζωὴ ἦν τὸ " },
      { type: "word", wordId: "phos" },
      { type: "text", value: " τῶν ἀνθρώπων." },
      { type: "text", value: "\n" },
      // 1:5
      {
        type: "text",
        value: "καὶ τὸ φῶς ἐν τῇ ",
      },
      { type: "word", wordId: "skotia" },
      { type: "text", value: " φαίνει, καὶ ἡ σκοτία αὐτὸ οὐ " },
      { type: "word", wordId: "katelaben" },
      { type: "text", value: "." },
    ],
  },
  words: [
    word({
      id: "arche",
      surface: "ἀρχῇ",
      lemma: "ἀρχή",
      transliteration: "archē",
      form: "Dative singular of archē — in “Ἐν ἀρχῇ”",
      formClaim: makeClaim({
        id: "w-arche-form",
        text: "En archē means “in the beginning.” The phrase strongly evokes Genesis 1:1 in the scriptural/literary environment of the Greek Bible, without making Genesis and John identical texts.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5", "gen-1-1-5", "asv-1901"],
        verificationStatus: "verified",
      }),
      translatedHere: "beginning",
      translationNote:
        "Safe range: beginning / origin / commencement. Do not claim the echo makes John a secret decoding of Genesis.",
      translationClaim: makeClaim({
        id: "w-arche-tr",
        text: "Safe gloss: beginning. Literary relation to Genesis 1 is real; identity of the two openings is not.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5", "gen-1-1-5"],
        verificationStatus: "verified",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "beginning / commencement",
            confidence: "widely-attested",
            sourceIds: ["nestle-1904", "john-1-1-5"],
            verificationStatus: "verified",
          },
          {
            gloss: "origin / first point (contextual extension)",
            confidence: "reasonable-reading",
            sourceIds: ["john-1-1-5"],
            verificationStatus: "research-continues",
          },
        ],
      },
      followThisWord: [
        terrainNode({
          label: "Genesis beginning (textual relation)",
          kind: "scripture",
          note: "See the live textual relation to Genesis 1:1–5 — exploratory follow is not additional lexical proof.",
        }),
      ],
      sourceIds: ["nestle-1904", "john-1-1-5"],
      verificationStatus: "verified",
    }),
    word({
      id: "en-1",
      surface: "ἦν",
      lemma: "εἰμί",
      transliteration: "ēn",
      form: "Imperfect indicative, 3rd singular of eimi — “was”",
      formClaim: makeClaim({
        id: "w-en-form",
        text: "Ēn is imperfect “was.” John repeatedly uses ἦν for the Logos in vv. 1–2. Do not turn verbal aspect alone into metaphysical proof.",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5"],
        verificationStatus: "verified",
      }),
      translatedHere: "was",
      translationNote:
        "The imperfect appears repeatedly for the Logos. Later contrast with ἐγένετο (“came into being”) is a strong textual observation — not by itself Nicene metaphysics.",
      translationClaim: makeClaim({
        id: "w-en-tr",
        text: "Safe gloss: was. Literary contrast with egeneto belongs to grammar/literature; later doctrinal elaborations are interpretation.",
        category: "grammatical",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5"],
        verificationStatus: "verified",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "was / existed (imperfect of eimi)",
            confidence: "widely-attested",
            sourceIds: ["nestle-1904"],
            verificationStatus: "verified",
          },
        ],
      },
      occurrenceNotes: [
        makeClaim({
          id: "w-en-repetition",
          text: "The imperfect ἦν recurs for the Logos in vv. 1–2, while created things in v. 3 are narrated with ἐγένετο.",
          category: "literary-context",
          confidence: "widely-attested",
          sourceIds: ["nestle-1904", "john-1-1-5"],
          verificationStatus: "verified",
        }),
      ],
      sourceIds: ["nestle-1904", "john-1-1-5"],
      verificationStatus: "verified",
    }),
    word({
      id: "logos-1",
      surface: "Λόγος",
      lemma: "λόγος",
      transliteration: "logos",
      form: "Nominative singular — with article ὁ",
      formClaim: makeClaim({
        id: "w-logos-1-form",
        text: "Logos may mean word, speech, statement, account, message, or (in some contexts) reason/discourse. Semantic range does not mean all senses are active here. Within the prologue, Logos functions as a contextual/theological designation whose identity develops across the prologue — especially by John 1:14.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5", "john-1-14"],
        verificationStatus: "verified",
        visitorNote:
          "Do not say Logos “really means” logic, frequency, vibration, consciousness, or that the lexicon alone means Jesus.",
      }),
      translatedHere: "Word",
      translationNote:
        "ASV/YLT both use “Word.” Keep lexical evidence separate from later theological identification of the Logos.",
      translationClaim: makeClaim({
        id: "w-logos-1-tr",
        text: "Safe English tradition here: Word. Broader Greek senses exist; context controls which matter in the prologue.",
        category: "translation",
        confidence: "widely-attested",
        sourceIds: ["asv-1901", "ylt-1898", "nestle-1904"],
        verificationStatus: "verified",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "word / speech / statement",
            confidence: "widely-attested",
            sourceIds: ["nestle-1904", "john-1-1-5"],
            verificationStatus: "verified",
          },
          {
            gloss: "account / message",
            confidence: "reasonable-reading",
            sourceIds: ["john-1-1-5"],
            verificationStatus: "research-continues",
          },
          {
            gloss: "reason / discourse (in appropriate Greek contexts)",
            confidence: "reasonable-reading",
            note: "Possible elsewhere in Greek literature; not automatically activated by John 1:1 alone.",
            sourceIds: ["john-1-1-5"],
            verificationStatus: "research-continues",
          },
        ],
      },
      occurrenceNotes: [
        makeClaim({
          id: "w-logos-1-14",
          text: "John 1:14 (“the Word became flesh”) is crucial for how the prologue develops the Logos’s identity — contextual evidence beyond vv. 1–5, not a separate passage in this instrument yet.",
          category: "primary-text",
          confidence: "widely-attested",
          sourceIds: ["john-1-14", "nestle-1904"],
          verificationStatus: "verified",
        }),
      ],
      sourceIds: ["nestle-1904", "john-1-1-5"],
      verificationStatus: "research-continues",
    }),
    word({
      id: "logos-2",
      surface: "Λόγος",
      lemma: "λόγος",
      transliteration: "logos",
      form: "Nominative singular — second articular Logos in v. 1",
      formClaim: makeClaim({
        id: "w-logos-2-form",
        text: "Second articular Logos in the verse, now related πρός τὸν Θεόν.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5"],
        verificationStatus: "verified",
      }),
      translatedHere: "Word",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "word / speech (same lemma)",
            confidence: "widely-attested",
            sourceIds: ["nestle-1904"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["nestle-1904", "john-1-1-5"],
      verificationStatus: "verified",
    }),
    word({
      id: "pros",
      surface: "πρὸς",
      lemma: "πρός",
      transliteration: "pros",
      form: "Preposition with accusative — πρὸς τὸν Θεόν",
      formClaim: makeClaim({
        id: "w-pros-form",
        text: "Pros ton theon is conventionally rendered “with God.” The construction conveys relationship/orientation/presence. The preposition by itself does not prove a later doctrine of divine persons.",
        category: "grammatical",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5", "asv-1901"],
        verificationStatus: "verified",
      }),
      translatedHere: "with",
      translationNote:
        "Toward / to / with / in relation to are possible depending on construction. Here English tradition commonly uses “with.”",
      translationClaim: makeClaim({
        id: "w-pros-tr",
        text: "Safe conventional rendering in this clause: with. Relational force is real; full Trinitarian doctrine is not settled by the preposition alone.",
        category: "translation",
        confidence: "widely-attested",
        sourceIds: ["asv-1901", "ylt-1898", "nestle-1904"],
        verificationStatus: "verified",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "toward / to / with (construction-dependent)",
            confidence: "widely-attested",
            sourceIds: ["nestle-1904", "john-1-1-5"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["nestle-1904", "john-1-1-5"],
      verificationStatus: "verified",
    }),
    word({
      id: "theon",
      surface: "Θεόν",
      lemma: "θεός",
      transliteration: "theon",
      form: "Accusative singular — articular τὸν Θεόν",
      formClaim: makeClaim({
        id: "w-theon-form",
        text: "Articular τὸν Θεόν in πρὸς τὸν Θεόν. Keep this articular form in view when reading the following anarthrous Θεός.",
        category: "grammatical",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5"],
        verificationStatus: "verified",
      }),
      translatedHere: "God",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "God (articular accusative)",
            confidence: "widely-attested",
            sourceIds: ["nestle-1904"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["nestle-1904", "john-1-1-5"],
      verificationStatus: "verified",
    }),
    word({
      id: "theos",
      surface: "Θεὸς",
      lemma: "θεός",
      transliteration: "theos",
      form: "Nominative singular — anarthrous predicate with ἦν; ὁ Λόγος is the subject",
      formClaim: makeClaim({
        id: "w-theos-form",
        text: "In καὶ Θεὸς ἦν ὁ Λόγος, Θεός is anarthrous while λόγος is articular and functions as subject; Θεός is predicative. Absence of the article does not mechanically mean English “a god,” and does not automatically prove one later Trinitarian formulation. Greek articles do not map one-to-one onto English “the/a.” A qualitative understanding of anarthrous Θεός in predicate position is an important scholarly grammatical reading — distinguish grammar from theological interpretation.",
        category: "grammatical",
        confidence: "disputed",
        sourceIds: [
          "nestle-1904",
          "john-1-1-5",
          "origen-john-book-2",
          "net-notes-john-1-1-5",
        ],
        verificationStatus: "research-continues",
        visitorNote:
          "Grammar observation first. Do not convert article presence/absence into an automatic English “the/a” rule or a finished doctrinal proof.",
      }),
      translatedHere: "God",
      translationNote:
        "ASV/YLT: “and the Word was God.” English cannot display the Greek article contrast mechanically.",
      translationClaim: makeClaim({
        id: "w-theos-tr",
        text: "Traditional English “the Word was God” is one rendering strategy. It does not erase the Greek article contrast, and “a god” is not an automatic consequence of anarthrous Θεός.",
        category: "translation",
        confidence: "disputed",
        sourceIds: ["asv-1901", "ylt-1898", "nestle-1904", "net-notes-john-1-1-5"],
        verificationStatus: "research-continues",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "God (predicative; qualitative readings discussed)",
            confidence: "widely-attested",
            sourceIds: ["nestle-1904", "john-1-1-5"],
            verificationStatus: "verified",
          },
          {
            gloss: "“a god” as automatic English (rejected as mechanical rule)",
            confidence: "disputed",
            note: "Article absence ≠ automatic indefinite English article.",
            sourceIds: ["nestle-1904", "net-notes-john-1-1-5"],
            verificationStatus: "research-continues",
          },
        ],
      },
      sourceIds: ["nestle-1904", "john-1-1-5"],
      verificationStatus: "research-continues",
    }),
    word({
      id: "logos-3",
      surface: "Λόγος",
      lemma: "λόγος",
      transliteration: "logos",
      form: "Nominative singular — articular subject of Θεὸς ἦν ὁ Λόγος",
      formClaim: makeClaim({
        id: "w-logos-3-form",
        text: "Articular ὁ Λόγος marks the subject of the final clause; Θεός is predicative.",
        category: "grammatical",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5", "net-notes-john-1-1-5"],
        verificationStatus: "verified",
      }),
      translatedHere: "Word",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "word / Word (subject of the predicate clause)",
            confidence: "widely-attested",
            sourceIds: ["nestle-1904"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["nestle-1904", "john-1-1-5"],
      verificationStatus: "verified",
    }),
    word({
      id: "egeneto",
      surface: "ἐγένετο",
      lemma: "γίνομαι",
      transliteration: "egeneto",
      form: "Aorist of ginomai — came into being / became",
      formClaim: makeClaim({
        id: "w-egeneto-form",
        text: "Egeneto narrates what came into being. John uses ἦν for the Logos and ἐγένετο for created things — a strong textual contrast. Do not claim the contrast alone establishes eternal generation, Trinity, or Nicene metaphysics.",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5"],
        verificationStatus: "verified",
      }),
      translatedHere: "were made / came into being",
      translationNote:
        "ASV: “were made.” YLT: “did happen” / “happened.” Each foregrounds a slightly different aspect of ginomai.",
      translationClaim: makeClaim({
        id: "w-egeneto-tr",
        text: "Safe range: came to be / came into being / became (context-dependent). “Made” is an English tradition that can foreground agency; “happen/come into being” can foreground emergence.",
        category: "translation",
        confidence: "widely-attested",
        sourceIds: ["asv-1901", "ylt-1898", "nestle-1904"],
        verificationStatus: "verified",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "came into being / became",
            confidence: "widely-attested",
            sourceIds: ["nestle-1904"],
            verificationStatus: "verified",
          },
          {
            gloss: "was made (English agency-forward rendering)",
            confidence: "reasonable-reading",
            sourceIds: ["asv-1901"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["nestle-1904", "john-1-1-5"],
      verificationStatus: "verified",
    }),
    word({
      id: "zoe",
      surface: "ζωὴ",
      lemma: "ζωή",
      transliteration: "zōē",
      form: "Nominative singular — life",
      formClaim: makeClaim({
        id: "w-zoe-form",
        text: "Zōē means life. Keep the immediate claim narrow: “In him was life, and the life was the light of men.” Do not import the Gospel’s entire theology of eternal life into the lexical definition.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5", "asv-1901"],
        verificationStatus: "verified",
      }),
      translatedHere: "life",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "life",
            confidence: "widely-attested",
            sourceIds: ["nestle-1904"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["nestle-1904", "john-1-1-5"],
      verificationStatus: "verified",
    }),
    word({
      id: "phos",
      surface: "φῶς",
      lemma: "φῶς",
      transliteration: "phōs",
      form: "Nominative/accusative singular — light",
      formClaim: makeClaim({
        id: "w-phos-form",
        text: "Phōs means light. John links life and light. Genesis 1 is a relevant literary relation because light appears prominently there — without claiming John’s light is simply identical to Genesis’s cosmic light.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5", "gen-1-1-5"],
        verificationStatus: "verified",
      }),
      translatedHere: "light",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "light",
            confidence: "widely-attested",
            sourceIds: ["nestle-1904"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["nestle-1904", "john-1-1-5"],
      verificationStatus: "verified",
    }),
    word({
      id: "skotia",
      surface: "σκοτίᾳ",
      lemma: "σκοτία",
      transliteration: "skotia",
      form: "Dative singular — darkness",
      formClaim: makeClaim({
        id: "w-skotia-form",
        text: "Skotia means darkness. Preserve the literary opposition light/darkness. Do not prematurely convert darkness into a single theological category.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5"],
        verificationStatus: "verified",
      }),
      translatedHere: "darkness",
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "darkness",
            confidence: "widely-attested",
            sourceIds: ["nestle-1904"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["nestle-1904", "john-1-1-5"],
      verificationStatus: "verified",
    }),
    word({
      id: "katelaben",
      surface: "κατέλαβεν",
      lemma: "καταλαμβάνω",
      transliteration: "katelaben",
      form: "Aorist of katalambanō",
      formClaim: makeClaim({
        id: "w-katelaben-form",
        text: "Katalambanō may mean grasp, seize, overtake, master/overcome, or comprehend/understand depending on context. English translations therefore diverge. Do not decide that it “really means” only comprehend or only overcome.",
        category: "lexical",
        confidence: "disputed",
        sourceIds: [
          "nestle-1904",
          "john-1-1-5",
          "asv-1901",
          "ylt-1898",
          "net-notes-john-1-1-5",
        ],
        verificationStatus: "research-continues",
        visitorNote: "REASONABLE ALTERNATIVES / DISPUTED NUANCE.",
      }),
      translatedHere: "apprehended / perceive",
      translationNote:
        "ASV: “apprehended.” YLT: “perceive.” Related English traditions include comprehend / overcome. The Greek permits more than one plausible construal.",
      translationClaim: makeClaim({
        id: "w-katelaben-tr",
        text: "Mark as disputed nuance. ASV “apprehended” and YLT “perceive” are translation strategies, not crowns for a single meaning.",
        category: "translation",
        confidence: "disputed",
        sourceIds: ["asv-1901", "ylt-1898", "nestle-1904", "net-notes-john-1-1-5"],
        verificationStatus: "research-continues",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "grasp / seize / overtake",
            confidence: "reasonable-reading",
            sourceIds: ["nestle-1904", "net-notes-john-1-1-5"],
            verificationStatus: "research-continues",
          },
          {
            gloss: "master / overcome",
            confidence: "reasonable-reading",
            sourceIds: ["nestle-1904", "net-notes-john-1-1-5"],
            verificationStatus: "research-continues",
          },
          {
            gloss: "comprehend / understand / perceive",
            confidence: "reasonable-reading",
            sourceIds: ["asv-1901", "ylt-1898", "net-notes-john-1-1-5"],
            verificationStatus: "research-continues",
          },
        ],
      },
      sourceIds: ["nestle-1904", "john-1-1-5"],
      verificationStatus: "research-continues",
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
      text: "In the beginning was the Word, and the Word was with God, and the Word was God.\nThe same was in the beginning with God.\nAll things were made through him; and without him was not anything made that hath been made.\nIn him was life; and the life was the light of men.\nAnd the light shineth in the darkness; and the darkness apprehended it not.",
      differenceNotes: [
        {
          phrase: "the Word was God",
          note: "English cannot display the Greek article contrast mechanically. “Was God” is a traditional rendering of Θεὸς ἦν ὁ Λόγος — not an automatic map from article rules.",
          claim: makeClaim({
            id: "tr-asv-theos",
            text: "ASV “the Word was God” is a historically important English strategy for John 1:1c. Grammar of anarthrous Θεός remains a separate discussion.",
            category: "translation",
            confidence: "widely-attested",
            sourceIds: ["asv-1901", "nestle-1904"],
            verificationStatus: "verified",
          }),
        },
        {
          phrase: "were made",
          note: "Foregrounds agency/making for ἐγένετο. Compare YLT’s “did happen / happened.”",
          claim: makeClaim({
            id: "tr-asv-egeneto",
            text: "ASV “made” is one English foregrounding of egeneto — not proof that “came into being” is wrong.",
            category: "translation",
            confidence: "widely-attested",
            sourceIds: ["asv-1901", "nestle-1904"],
            verificationStatus: "verified",
          }),
        },
        {
          phrase: "apprehended",
          note: "One English strategy for κατέλαβεν. Does not settle whether grasp, overcome, or comprehend is primary.",
          claim: makeClaim({
            id: "tr-asv-katelaben",
            text: "ASV “apprehended” illustrates one construal of katelaben — disputed nuance remains.",
            category: "translation",
            confidence: "disputed",
            sourceIds: ["asv-1901", "nestle-1904"],
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
      text: "In the beginning was the Word, and the Word was with God, and the Word was God;\nthis one was in the beginning with God;\nall things through him did happen, and without him happened not even one thing that hath happened.\nIn him was life, and the life was the light of men,\nand the light in the darkness did shine, and the darkness did not perceive it.",
      differenceNotes: [
        {
          phrase: "did happen / happened",
          note: "Foregrounds coming-into-being for ἐγένετο more directly than “made.”",
          claim: makeClaim({
            id: "tr-ylt-egeneto",
            text: "YLT’s “happen” language keeps ginomai’s becoming/coming-into-being visible.",
            category: "translation",
            confidence: "widely-attested",
            sourceIds: ["ylt-1898", "nestle-1904"],
            verificationStatus: "verified",
          }),
        },
        {
          phrase: "perceive",
          note: "Comprehension-forward English for κατέλαβεν — another plausible strategy beside ASV “apprehended.”",
          claim: makeClaim({
            id: "tr-ylt-katelaben",
            text: "YLT “perceive” illustrates a comprehension-oriented hearing of katelaben without crowning it as the only sense.",
            category: "translation",
            confidence: "disputed",
            sourceIds: ["ylt-1898", "nestle-1904"],
            verificationStatus: "research-continues",
          }),
        },
      ],
    },
  ],
  sections: {
    languageNotes: [
      makeLanguageNote({
        id: "lang-john-genesis-echo",
        text: "John’s ἐν ἀρχῇ strongly evokes the scriptural language of Genesis 1 — beginning, coming into being, life, light, and darkness — without equating the two texts.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5", "gen-1-1-5"],
        verificationStatus: "verified",
      }),
      makeLanguageNote({
        id: "lang-logos-range",
        text: "Logos has a broad Greek semantic range, but context controls which senses matter in this prologue. Lexical range is not simultaneous activation of every sense.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5", "john-1-14"],
        verificationStatus: "verified",
      }),
      makeLanguageNote({
        id: "lang-pros-relation",
        text: "Pros ton theon expresses relationship/orientation; the preposition itself does not establish a complete doctrine of divine persons.",
        category: "grammatical",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5"],
        verificationStatus: "verified",
      }),
      makeLanguageNote({
        id: "lang-theos-syntax",
        text: "The syntax of Θεὸς ἦν ὁ Λόγος matters and cannot be reduced to English article rules. Anarthrous Θεός does not mechanically mean “a god.” A qualitative reading of predicative Θεός is grammatically significant in scholarly discussion.",
        category: "grammatical",
        confidence: "disputed",
        sourceIds: [
          "nestle-1904",
          "john-1-1-5",
          "origen-john-book-2",
          "net-notes-john-1-1-5",
        ],
        verificationStatus: "research-continues",
      }),
      makeLanguageNote({
        id: "lang-en-egeneto",
        text: "John repeatedly uses ἦν for the Logos and ἐγένετο for things that come into being. The contrast is textual; later metaphysics is interpretation.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5"],
        verificationStatus: "verified",
      }),
      makeLanguageNote({
        id: "lang-katelaben",
        text: "Katelaben creates a genuine translation decision in v. 5 among grasp/seize, overcome/master, and comprehend/understand hearings.",
        category: "lexical",
        confidence: "disputed",
        sourceIds: ["nestle-1904", "asv-1901", "ylt-1898", "net-notes-john-1-1-5"],
        verificationStatus: "research-continues",
      }),
      makeLanguageNote({
        id: "lang-punct-3-4",
        text: "The punctuation/division of ὃ γέγονεν across vv. 3–4 has an editorial and interpretive history. Nestle 1904 attaches the relative clause with v. 3; some modern editions place a stop before ὃ γέγονεν and begin v. 4 with it. Ancient manuscripts did not carry modern punctuation in the same way.",
        category: "literary-context",
        confidence: "disputed",
        sourceIds: ["nestle-1904", "john-1-1-5", "net-notes-john-1-1-5"],
        verificationStatus: "research-continues",
        visitorNote:
          "TEXTUAL / PUNCTUATION / EDITORIAL HISTORY — do not exaggerate into major textual corruption.",
      }),
    ],
    context: [
      {
        title: "Prologue opening",
        body: "John 1:1–5 opens the Gospel’s prologue. The prologue continues beyond v. 5; John 1:14 (“the Word became flesh”) is particularly relevant for how John develops the Logos’s identity, even though this passage ends at v. 5.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5", "john-1-14"],
        verificationStatus: "verified",
      },
      {
        title: "Genesis echo",
        body: "John reuses / evokes / develops scriptural creation language: beginning, coming into being, light, and darkness. Do not say John simply translates Genesis, secretly decodes Genesis, or that Genesis originally meant Jesus.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["nestle-1904", "john-1-1-5", "gen-1-1-5"],
        verificationStatus: "verified",
      },
      {
        title: "Creation through speech (Genesis)",
        body: "Genesis 1 narrates creation through divine speech (“And God said…”). That is a textual relation to consider beside John’s Logos language — without automatically equating God’s speech in Genesis with John’s Logos.",
        category: "primary-text",
        confidence: "widely-attested",
        sourceIds: ["gen-1-1-5", "john-1-1-5"],
        verificationStatus: "verified",
      },
      {
        title: "Jewish Wisdom background",
        body: "Jewish Wisdom traditions (including Proverbs 8 and, where relevant, Sirach 24 and Wisdom of Solomon 7–9) develop themes of preexistence, creation, divine presence, wisdom, life, and light. These may inform the conceptual world around John’s Logos. Do not say “Logos is simply Wisdom” or “John renamed Sophia Logos.”",
        category: "historical-context",
        confidence: "reasonable-reading",
        sourceIds: [
          "prov-8",
          "sirach-24",
          "wisdom-7-9",
          "john-1-1-5",
        ],
        verificationStatus: "research-continues",
        researchFlag:
          "Background registered; detailed verse-by-verse equation of Wisdom and Logos not claimed.",
      },
      {
        title: "Philo and Hellenistic Logos language",
        body: "Philo of Alexandria uses λόγος extensively in discourse about God and creation within a Jewish-Hellenistic environment. Treat this as conceptual comparison / environment. Do not say “John copied Philo” or “John got the Logos from Philo” without demonstrated literary dependence.",
        category: "historical-context",
        confidence: "tradition-noted",
        sourceIds: ["philo-logos-background", "john-1-1-5"],
        verificationStatus: "research-continues",
        researchFlag:
          "RESEARCH CONTINUES — no specific Philo treatise passage verified line-by-line in this pass.",
      },
    ],
    interpretation: [
      interpretationGroup({
        tradition: "christian",
        label: "Christian reception",
        readings: [
          namedInterpretation({
            id: "john-1-origen-theos",
            interpreter: "Origen",
            work: "Commentary on John, Book II",
            body: "In Commentary on John, Book II, Origen distinguishes articular ὁ θεός (“the God” / Very God, Autotheos) associated with the Father from anarthrous θεός applied to the Logos as God by participation in the Father’s divinity. He frames the article contrast theologically to address fear of proclaiming two Gods. This is Christian reception — not a neutral modern grammar rule, and not by itself a finished Nicene summary.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["origen-john-book-2"],
          }),
          namedInterpretation({
            id: "john-1-irenaeus-framing",
            interpreter: "Irenaeus",
            work: "Against Heresies (reception framing)",
            body: "Irenaeus is often cited for reading John 1 in relation to creation through the Word and against cosmologies that separated the creator from the highest God. Exact locus verification for this instrument remains incomplete; the reading is noted as Christian reception, not lexical evidence.",
            confidence: "tradition-noted",
            verificationStatus: "research-continues",
            sourceIds: ["irenaeus-john-1-reception"],
            researchFlag:
              "RESEARCH CONTINUES — named tradition noted; do not invent a precise citation beyond verification.",
          }),
          namedInterpretation({
            id: "john-1-augustine-framing",
            interpreter: "Augustine",
            work: "Eternal Word readings (reception framing)",
            body: "Augustine develops the eternal divine Word in contrast with transient human spoken words in later Christian reception. Exact work/locus for this pass remains research-continues rather than inventing a citation from memory.",
            confidence: "tradition-noted",
            verificationStatus: "research-continues",
            sourceIds: ["augustine-john-1-reception"],
            researchFlag: "RESEARCH CONTINUES — no exact locus verified in this pass.",
          }),
        ],
      }),
      interpretationGroup({
        tradition: "academic",
        label: "Academic / philological notes",
        readings: [
          namedInterpretation({
            id: "john-1-acad-genesis",
            interpreter: "Philological note",
            work: "Genesis 1 echo",
            body: "The opening strongly evokes Genesis 1 through beginning, creation/coming into being, life, light, and darkness. Literary echo ≠ identity of meaning.",
            confidence: "widely-attested",
            verificationStatus: "verified",
            sourceIds: ["nestle-1904", "john-1-1-5", "gen-1-1-5"],
          }),
          namedInterpretation({
            id: "john-1-acad-1c",
            interpreter: "Philological note",
            work: "Syntax of John 1:1c",
            body: "Predicate-nominative / article discussion: articular Logos as subject; anarthrous Θεός as predicate. Qualitative force is discussed in scholarship. Do not convert descriptive grammatical tendencies into automatic rules without sources.",
            confidence: "disputed",
            verificationStatus: "research-continues",
            sourceIds: ["nestle-1904", "net-notes-john-1-1-5", "origen-john-book-2"],
          }),
          namedInterpretation({
            id: "john-1-acad-katelaben",
            interpreter: "Philological note",
            work: "Katelaben ambiguity",
            body: "Katalambanō remains a genuine translation decision among seize/overtake, overcome, and comprehend hearings.",
            confidence: "disputed",
            verificationStatus: "research-continues",
            sourceIds: ["nestle-1904", "asv-1901", "ylt-1898", "net-notes-john-1-1-5"],
          }),
          namedInterpretation({
            id: "john-1-acad-punct",
            interpreter: "Philological note",
            work: "Punctuation of John 1:3–4",
            body: "Editorial punctuation of ὃ γέγονεν varies across editions. Nestle 1904’s attachment with v. 3 is one historical editorial choice among others. Label as punctuation/editorial history, not major corruption.",
            confidence: "disputed",
            verificationStatus: "research-continues",
            sourceIds: ["nestle-1904", "net-notes-john-1-1-5"],
          }),
          namedInterpretation({
            id: "john-1-acad-wisdom-philo",
            interpreter: "Philological note",
            work: "Wisdom and Hellenistic background",
            body: "Jewish Wisdom traditions and broader Hellenistic/Philo Logos language may supply conceptual environment. Dependence claims require demonstration; this pass registers background without asserting copying.",
            confidence: "reasonable-reading",
            verificationStatus: "research-continues",
            sourceIds: ["prov-8", "sirach-24", "wisdom-7-9", "philo-logos-background"],
          }),
        ],
      }),
    ],
    terrain: [
      terrainNode({
        label: "beginning",
        kind: "concept",
        note: "Opened by en archē and the Genesis echo.",
      }),
      terrainNode({
        label: "word",
        kind: "concept",
        note: "Logos as designation — exploratory beyond lexical floor.",
      }),
      terrainNode({
        label: "speech",
        kind: "concept",
        note: "Relation to Genesis’s “And God said…” without equation.",
      }),
      terrainNode({
        label: "relation",
        kind: "concept",
        note: "Pros ton theon — orientation/presence as terrain.",
      }),
      terrainNode({
        label: "creation",
        kind: "concept",
        note: "All things came into being through him/it.",
      }),
      terrainNode({
        label: "life",
        kind: "concept",
        note: "Zōē in the Logos — Johannine theme as terrain.",
      }),
      terrainNode({
        label: "light",
        kind: "concept",
        note: "Phōs linked with life; Genesis light as literary neighbor.",
      }),
      terrainNode({
        label: "darkness",
        kind: "concept",
        note: "Skotia opposed to light — not a finished taxonomy.",
      }),
      terrainNode({
        label: "recognition",
        kind: "concept",
        note: "Opened by whether darkness grasps/comprehends the light.",
      }),
      terrainNode({
        label: "resistance",
        kind: "concept",
        note: "Opened by whether darkness overcomes/seizes the light.",
      }),
      terrainNode({
        label: "meaning",
        kind: "concept",
        note: "Where grammar ends and later interpretation begins.",
      }),
    ],
    remainsOpen: [
      openQuestion({
        question:
          "What range of meaning does logos carry in this specific prologue?",
        whyOpen:
          "Greek semantic range is broad; John develops identity across the prologue. Lexicon alone does not finish the question.",
      }),
      openQuestion({
        question:
          "How strongly should Genesis 1 control our reading of John 1?",
        whyOpen:
          "The echo is strong. Control can become over-determination if Genesis is treated as a secret code John merely unlocks.",
      }),
      openQuestion({
        question:
          "How should Jewish Wisdom traditions inform the Logos without simply equating Wisdom and Logos?",
        whyOpen:
          "Parallels of preexistence, creation, life, and light are real. Equation is a further claim.",
      }),
      openQuestion({
        question:
          "What role, if any, should Philo and broader Hellenistic philosophy play in interpreting John’s Logos?",
        whyOpen:
          "Conceptual environment is plausible; literary dependence is a separate, harder claim.",
      }),
      openQuestion({
        question: "What nuance does anarthrous Θεός contribute in John 1:1c?",
        whyOpen:
          "Grammar and qualitative readings are discussed; English article habits and later doctrine must not be collapsed into the Greek observation.",
      }),
      openQuestion({
        question: "How should pros ton theon be understood relationally?",
        whyOpen:
          "Relational/orientational force is clear; full person-doctrine is not settled by the preposition alone.",
      }),
      openQuestion({
        question:
          "Does katelaben foreground comprehension, overcoming/seizing, or intentionally permit more than one resonance?",
        whyOpen:
          "English traditions diverge because the Greek verb permits more than one plausible construal.",
      }),
      openQuestion({
        question: "How should the punctuation/division of John 1:3–4 be handled?",
        whyOpen:
          "Editorial history differs; Nestle 1904’s choice is one among others. Do not confuse punctuation history with corruption.",
      }),
      openQuestion({
        question:
          "Where does grammatical observation end and later Trinitarian interpretation begin?",
        whyOpen:
          "Keeping epistemic layers distinct is the whole point of this instrument’s hierarchy.",
      }),
    ],
  },
};
