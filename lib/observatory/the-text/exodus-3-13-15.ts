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
 * Exodus 3:13–15 — Verified core content packet (third passage).
 * Scholarship status: verified core / research continues
 * Architecture: same hierarchy as Genesis 1:1–5 and Genesis 2:7.
 * Do not reduce the passage to a single metaphysical statement.
 */
export const EXODUS_3_13_15: Passage = {
  id: "exod-3-13-15",
  slug: "exodus-3-13-15",
  reference: "Exodus 3:13–15",
  language: "hebrew",
  themes: ["name", "being", "ehyeh"],
  status: "ready",
  scholarshipStatus: "verified-core",
  whisper:
    "Name, presence, and sending — and what ehyeh asher ehyeh leaves open.",
  translationFraming:
    "English translations must choose how to carry ehyeh asher ehyeh and how to present the divine name YHWH. Renderings such as “I AM THAT I AM,” “I AM WHO I AM,” and “I WILL BE WHAT I WILL BE” each foreground a slightly different aspect of the Hebrew grammar. The differences are interpretive judgments, not proof that one translator concealed a secret meaning.",
  translationAside:
    "ASV’s “Jehovah” is a historical English rendering convention for the tetragrammaton — not proof of the ancient pronunciation. Scholarly transliteration often uses YHWH; many English Bibles use LORD. Exact vocalization remains outside the scope of this pass.",
  futureRelations: [
    {
      targetSlug: "john-8-58",
      reason:
        "UNFINISHED EDGE — later Christian “I am” reception (John 8:58) belongs to reception history and is not built as a Text passage. Do not collapse it into Exodus 3:14 Hebrew grammar. Do not promote as a ready evidence relation. John 1:1–5 has no ἐγώ εἰμι and is intentionally not linked here.",
    },
  ],
  englishPrimary: {
    label: "ASV",
    attribution: "American Standard Version (1901), public domain",
    text: "And Moses said unto God, Behold, when I come unto the children of Israel, and shall say unto them, The God of your fathers hath sent me unto you; and they shall say to me, What is his name? What shall I say unto them?\nAnd God said unto Moses, I AM THAT I AM: and he said, Thus shalt thou say unto the children of Israel, I AM hath sent me unto you.\nAnd God said moreover unto Moses, Thus shalt thou say unto the children of Israel, Jehovah, the God of your fathers, the God of Abraham, the God of Isaac, and the God of Jacob, hath sent me unto you: this is my name forever, and this is my memorial unto all generations.",
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
      // 3:13 — focus: shemo
      {
        type: "text",
        value:
          "וַיֹּאמֶר מֹשֶׁה אֶל־הָאֱלֹהִים הִנֵּה אָנֹכִי בָא אֶל־בְּנֵי יִשְׂרָאֵל וְאָמַרְתִּי לָהֶם אֱלֹהֵי אֲבוֹתֵיכֶם שְׁלָחַנִי אֲלֵיכֶם וְאָמְרוּ־לִי מַה־",
      },
      { type: "word", wordId: "shemo" },
      { type: "text", value: " מָה אֹמַר אֲלֵהֶם׃" },
      { type: "text", value: "\n" },
      // 3:14 — focus: ehyeh asher ehyeh + ehyeh sent
      { type: "text", value: "וַיֹּאמֶר אֱלֹהִים אֶל־מֹשֶׁה " },
      { type: "word", wordId: "ehyeh-1" },
      { type: "text", value: " " },
      { type: "word", wordId: "asher" },
      { type: "text", value: " " },
      { type: "word", wordId: "ehyeh-2" },
      {
        type: "text",
        value: " וַיֹּאמֶר כֹּה תֹאמַר לִבְנֵי יִשְׂרָאֵל ",
      },
      { type: "word", wordId: "ehyeh-3" },
      { type: "text", value: " שְׁלָחַנִי אֲלֵיכֶם׃" },
      { type: "text", value: "\n" },
      // 3:15 — focus: YHWH, shemi, zikhri
      {
        type: "text",
        value:
          "וַיֹּאמֶר עוֹד אֱלֹהִים אֶל־מֹשֶׁה כֹּה־תֹאמַר אֶל־בְּנֵי יִשְׂרָאֵל ",
      },
      { type: "word", wordId: "yhwh" },
      {
        type: "text",
        value:
          " אֱלֹהֵי אֲבֹתֵיכֶם אֱלֹהֵי אַבְרָהָם אֱלֹהֵי יִצְחָק וֵאלֹהֵי יַעֲקֹב שְׁלָחַנִי אֲלֵיכֶם זֶה־",
      },
      { type: "word", wordId: "shemi" },
      { type: "text", value: " לְעֹלָם וְזֶה " },
      { type: "word", wordId: "zikhri" },
      { type: "text", value: " לְדֹר דֹּר׃" },
    ],
  },
  words: [
    word({
      id: "shemo",
      surface: "שְּׁמוֹ",
      lemma: "שֵׁם",
      transliteration: "šəmô",
      form: "Noun + 3ms suffix — “his name”",
      formClaim: makeClaim({
        id: "w-shemo-form",
        text: "Shemo is “his name” — Moses anticipates that Israel will ask for the name/designation of the God who sent him.",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph", "exod-3-13-15"],
        verificationStatus: "verified",
      }),
      translatedHere: "his name",
      translationNote:
        "Do not treat “name” merely as a modern personal label. Context may involve identity, designation, recognition, or reputation — distinguish lexical floor from interpretation.",
      translationClaim: makeClaim({
        id: "w-shemo-tr",
        text: "Safe gloss: name / designation. The question “What is his name?” belongs to the narrative of sending and recognition — not to abstract metaphysics alone.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "exod-3-13-15", "asv-1901"],
        verificationStatus: "verified",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "name / designation",
            confidence: "widely-attested",
            sourceIds: ["wlc", "oshb-morph"],
            verificationStatus: "verified",
          },
          {
            gloss: "reputation / that by which one is known (contextual extension)",
            confidence: "reasonable-reading",
            note: "Possible in broader biblical usage; not automatically the only sense here.",
            sourceIds: ["exod-3-13-15"],
            verificationStatus: "research-continues",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph", "exod-3-13-15"],
      verificationStatus: "verified",
    }),
    word({
      id: "ehyeh-1",
      surface: "אֶהְיֶה",
      lemma: "הָיָה",
      transliteration: "ʾehyeh",
      form: "Qal imperfect, 1cs — from hayah (“be / become / come to be”)",
      formClaim: makeClaim({
        id: "w-ehyeh-1-form",
        text: "Ehyeh is a Qal imperfect first-person singular form of hayah. English tense mapping is not mechanically one-to-one; the form can support present, future, or imperfective readings depending on context.",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph", "exod-3-13-15", "exod-3-12"],
        verificationStatus: "verified",
        visitorNote:
          "Do not say ehyeh simply means “I am,” secretly means “becoming,” or that only one English tense is correct.",
      }),
      translatedHere: "I AM / I will be (opening of the phrase)",
      translationNote:
        "First ehyeh in ehyeh asher ehyeh. The Hebrew form leaves more grammatical openness than the traditional English formula alone may suggest.",
      translationClaim: makeClaim({
        id: "w-ehyeh-1-tr",
        text: "Safe morphological claim: first-person imperfect of hayah. Translation into English “I am,” “I will be,” or related imperfective constructions is context-sensitive and disputed at the level of phrasing.",
        category: "translation",
        confidence: "disputed",
        sourceIds: [
          "wlc",
          "oshb-morph",
          "asv-1901",
          "ylt-1898",
          "exod-3-12",
          "net-notes-exod-3-12-15",
        ],
        verificationStatus: "research-continues",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "be / I am / I will be (context-sensitive)",
            confidence: "widely-attested",
            sourceIds: ["wlc", "oshb-morph", "exod-3-12"],
            verificationStatus: "verified",
          },
          {
            gloss: "become / come to be / happen (depending on context)",
            confidence: "reasonable-reading",
            note: "Possible senses of hayah across contexts — not a secret key that replaces every other reading here.",
            sourceIds: ["wlc", "oshb-morph"],
            verificationStatus: "research-continues",
          },
        ],
      },
      occurrenceNotes: [
        makeClaim({
          id: "w-ehyeh-exod-3-12",
          text: "The same form appears in Exodus 3:12 in God’s statement commonly rendered “I will be with you” — immediate contextual evidence for a presence-oriented / future-capable use of ehyeh.",
          category: "primary-text",
          confidence: "widely-attested",
          sourceIds: ["wlc", "exod-3-12", "asv-1901"],
          verificationStatus: "verified",
        }),
      ],
      followThisWord: [
        terrainNode({
          label: "presence with Moses (exploratory)",
          kind: "concept",
          note: "Exodus 3:12’s presence promise opens terrain — not a finished lexical definition of ehyeh in 3:14.",
        }),
      ],
      sourceIds: ["wlc", "oshb-morph", "exod-3-13-15", "exod-3-12"],
      verificationStatus: "research-continues",
    }),
    word({
      id: "asher",
      surface: "אֲשֶׁר",
      lemma: "אֲשֶׁר",
      transliteration: "ʾăšer",
      form: "Relative particle",
      formClaim: makeClaim({
        id: "w-asher-form",
        text: "Asher is a relative particle. Depending on construction, English may use who, that, which, or what. Do not assign one hidden or mystical meaning.",
        category: "grammatical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph", "exod-3-13-15"],
        verificationStatus: "verified",
      }),
      translatedHere: "that / who / what (relational link)",
      translationNote:
        "The flexibility of asher contributes to the range of possible English renderings of ehyeh asher ehyeh.",
      translationClaim: makeClaim({
        id: "w-asher-tr",
        text: "Asher allows more than one natural English relational construction. Choosing “that,” “who,” or “what” is a translation decision, not a decoding of a secret.",
        category: "translation",
        confidence: "widely-attested",
        sourceIds: ["wlc", "asv-1901", "ylt-1898", "exod-3-13-15"],
        verificationStatus: "verified",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "who / that / which / what (relative)",
            confidence: "widely-attested",
            sourceIds: ["wlc", "oshb-morph"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph", "exod-3-13-15"],
      verificationStatus: "verified",
    }),
    word({
      id: "ehyeh-2",
      surface: "אֶהְיֶה",
      lemma: "הָיָה",
      transliteration: "ʾehyeh",
      form: "Qal imperfect, 1cs — second ehyeh in the phrase",
      formClaim: makeClaim({
        id: "w-ehyeh-2-form",
        text: "Second ehyeh in ehyeh asher ehyeh — same morphological form as the first. The doubled construction is a translation problem for the phrase as a whole, not a second independent lexical entry.",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph", "exod-3-13-15"],
        verificationStatus: "verified",
      }),
      translatedHere: "I AM / I will be (closing of the phrase)",
      translationNote:
        "Treat ehyeh asher ehyeh as a phrase-level translation problem. Possible traditions include “I AM THAT I AM,” “I AM WHO I AM,” “I WILL BE WHAT I WILL BE,” and closely related renderings.",
      translationClaim: makeClaim({
        id: "w-ehyeh-2-tr",
        text: "The phrase remains disputed / research continues. Do not crown one English formula as definitively correct.",
        category: "translation",
        confidence: "disputed",
        sourceIds: [
          "wlc",
          "asv-1901",
          "ylt-1898",
          "exod-3-13-15",
          "net-notes-exod-3-12-15",
        ],
        verificationStatus: "research-continues",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "be / I am / I will be (same form as first ehyeh)",
            confidence: "widely-attested",
            sourceIds: ["wlc", "oshb-morph"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph", "exod-3-13-15"],
      verificationStatus: "research-continues",
    }),
    word({
      id: "ehyeh-3",
      surface: "אֶהְיֶה",
      lemma: "הָיָה",
      transliteration: "ʾehyeh",
      form: "Qal imperfect, 1cs — used as the sending designation",
      formClaim: makeClaim({
        id: "w-ehyeh-3-form",
        text: "After the full phrase, God tells Moses to say that ehyeh has sent him. The same form now functions as the designation of the sender for Israel.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "exod-3-13-15"],
        verificationStatus: "verified",
      }),
      translatedHere: "I AM (hath sent me)",
      translationNote:
        "ASV/YLT both carry this as “I AM hath sent me.” The narrative then continues in v15 by identifying the sender as YHWH, God of the ancestors.",
      translationClaim: makeClaim({
        id: "w-ehyeh-3-tr",
        text: "Verse 14’s abbreviated ehyeh and verse 15’s YHWH stand in deliberate literary relationship. Literary association is not the same as proving historical etymology.",
        category: "translation",
        confidence: "widely-attested",
        sourceIds: ["wlc", "exod-3-13-15", "asv-1901"],
        verificationStatus: "verified",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "I am / I will be — as sending designation",
            confidence: "widely-attested",
            sourceIds: ["wlc", "exod-3-13-15"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph", "exod-3-13-15"],
      verificationStatus: "verified",
    }),
    word({
      id: "yhwh",
      surface: "יְהוָה",
      lemma: "יהוה",
      transliteration: "YHWH",
      form: "Tetragrammaton — the divine name",
      formClaim: makeClaim({
        id: "w-yhwh-form",
        text: "YHWH is the tetragrammaton / divine name. Exodus 3 places ehyeh in literary relationship with YHWH. Whether this preserves the historical etymology of the name is a separate and disputed question.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "exod-3-13-15"],
        verificationStatus: "verified",
        visitorNote:
          "Do not say “YHWH literally means I AM.” Do not present a reconstructed pronunciation as certain. No Hebrew TTS for this name.",
      }),
      translatedHere: "Jehovah (ASV convention) / YHWH",
      translationNote:
        "ASV uses “Jehovah” — a historical English rendering convention, not proof of ancient vocalization. Scholarly writing often uses YHWH; many Bibles use LORD.",
      translationClaim: makeClaim({
        id: "w-yhwh-tr",
        text: "Translation conventions for the tetragrammaton vary. “Jehovah,” “YHWH,” and “LORD” are presentation choices; none settles pronunciation or etymology by itself.",
        category: "translation",
        confidence: "widely-attested",
        sourceIds: ["asv-1901", "ylt-1898", "exod-3-13-15"],
        verificationStatus: "verified",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "the divine name (tetragrammaton)",
            confidence: "widely-attested",
            sourceIds: ["wlc", "exod-3-13-15"],
            verificationStatus: "verified",
          },
          {
            gloss: "etymological derivation from hayah (disputed)",
            confidence: "disputed",
            note: "Literary wordplay with ehyeh in Exodus 3 does not by itself settle historical etymology.",
            sourceIds: ["exod-3-13-15", "net-notes-exod-3-12-15"],
            verificationStatus: "research-continues",
          },
        ],
      },
      sourceIds: ["wlc", "exod-3-13-15"],
      verificationStatus: "research-continues",
    }),
    word({
      id: "shemi",
      surface: "שְּׁמִי",
      lemma: "שֵׁם",
      transliteration: "šəmî",
      form: "Noun + 1cs suffix — “my name”",
      formClaim: makeClaim({
        id: "w-shemi-form",
        text: "Shemi (“my name”) is paired in v15 with zikhri (“my remembrance / memorial”). The verse closes by tying the divine name to remembrance across generations.",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph", "exod-3-13-15"],
        verificationStatus: "verified",
      }),
      translatedHere: "my name",
      translationNote:
        "Lexical floor: name. Do not immediately convert this into mystical “name power” or frequency language.",
      translationClaim: makeClaim({
        id: "w-shemi-tr",
        text: "“This is my name forever” pairs with “this is my memorial / remembrance unto all generations.” Keep lexical restraint.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "exod-3-13-15", "asv-1901"],
        verificationStatus: "verified",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "name / my name",
            confidence: "widely-attested",
            sourceIds: ["wlc", "oshb-morph"],
            verificationStatus: "verified",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph", "exod-3-13-15"],
      verificationStatus: "verified",
    }),
    word({
      id: "zikhri",
      surface: "זִכְרִי",
      lemma: "זֵכֶר",
      transliteration: "zikrî",
      form: "Noun + 1cs suffix — “my remembrance / memorial”",
      formClaim: makeClaim({
        id: "w-zikhri-form",
        text: "Zikhri belongs to the zekher / remembrance-memorial family. In v15 it is paired with shemi as that by which God is remembered or invoked across generations.",
        category: "lexical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph", "exod-3-13-15"],
        verificationStatus: "verified",
      }),
      translatedHere: "my memorial / remembrance",
      translationNote:
        "ASV: “memorial.” YLT: “memorial.” Be restrained — connect textually to the name/remembrance pairing; do not leap into mystical frequency language.",
      translationClaim: makeClaim({
        id: "w-zikhri-tr",
        text: "Safe range: remembrance / memorial / that by which one is remembered or invoked. Exact theological elaboration belongs to interpretation.",
        category: "translation",
        confidence: "widely-attested",
        sourceIds: ["wlc", "asv-1901", "ylt-1898", "exod-3-13-15"],
        verificationStatus: "verified",
      }),
      semanticRange: {
        caution: SEMANTIC_CAUTION,
        senses: [
          {
            gloss: "remembrance / memorial",
            confidence: "widely-attested",
            sourceIds: ["wlc", "oshb-morph"],
            verificationStatus: "verified",
          },
          {
            gloss: "that by which one is remembered / invoked",
            confidence: "reasonable-reading",
            sourceIds: ["exod-3-13-15"],
            verificationStatus: "research-continues",
          },
        ],
      },
      sourceIds: ["wlc", "oshb-morph", "exod-3-13-15"],
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
      text: "And Moses said unto God, Behold, when I come unto the children of Israel, and shall say unto them, The God of your fathers hath sent me unto you; and they shall say to me, What is his name? What shall I say unto them?\nAnd God said unto Moses, I AM THAT I AM: and he said, Thus shalt thou say unto the children of Israel, I AM hath sent me unto you.\nAnd God said moreover unto Moses, Thus shalt thou say unto the children of Israel, Jehovah, the God of your fathers, the God of Abraham, the God of Isaac, and the God of Jacob, hath sent me unto you: this is my name forever, and this is my memorial unto all generations.",
      differenceNotes: [
        {
          phrase: "I AM THAT I AM",
          note: "Traditional English formula for ehyeh asher ehyeh. Foregrounds a present/absolute English cadence; does not exhaust Hebrew grammatical openness.",
          claim: makeClaim({
            id: "tr-asv-ehyeh-phrase",
            text: "“I AM THAT I AM” is a historically important English rendering — one among several defensible strategies, not a proof that other renderings are simply wrong.",
            category: "translation",
            confidence: "widely-attested",
            sourceIds: ["asv-1901", "exod-3-13-15"],
            verificationStatus: "verified",
          }),
        },
        {
          phrase: "Jehovah",
          note: "Historical English convention for the tetragrammaton in the ASV tradition — not identical to proving ancient pronunciation.",
          claim: makeClaim({
            id: "tr-asv-jehovah",
            text: "ASV “Jehovah” is a translation/presentation convention. Do not treat it as recovered ancient vocalization.",
            category: "translation",
            confidence: "widely-attested",
            sourceIds: ["asv-1901", "exod-3-13-15"],
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
      text: "And Moses saith unto God, Lo, I am coming unto the sons of Israel, and have said to them, The God of your fathers hath sent me unto you, and they have said to me, What is His name? what do I say unto them?\nAnd God saith unto Moses, I AM THAT WHICH I AM; He saith also, Thus dost thou say to the sons of Israel, I AM hath sent me unto you.\nAnd God saith again unto Moses, Thus dost thou say unto the sons of Israel, Jehovah, God of your fathers, God of Abraham, God of Isaac, and God of Jacob, hath sent me unto you; this is My name — to the age, and this My memorial, to generation — generation.",
      differenceNotes: [
        {
          phrase: "I AM THAT WHICH I AM",
          note: "YLT’s relational “which” makes asher’s relative function especially visible while retaining the traditional “I AM” cadence.",
          claim: makeClaim({
            id: "tr-ylt-ehyeh-phrase",
            text: "YLT “I AM THAT WHICH I AM” illustrates how asher can be carried with “which” — a translation choice within the same disputed phrase family.",
            category: "translation",
            confidence: "widely-attested",
            sourceIds: ["ylt-1898", "exod-3-13-15"],
            verificationStatus: "verified",
          }),
        },
        {
          phrase: "memorial, to generation — generation",
          note: "YLT’s wording keeps the generational memorial/remembrance close to the Hebrew pairing with “my name.”",
          claim: makeClaim({
            id: "tr-ylt-memorial",
            text: "YLT’s memorial / generation phrasing tracks the shemi–zikhri pairing without resolving later theological elaborations.",
            category: "translation",
            confidence: "widely-attested",
            sourceIds: ["ylt-1898", "exod-3-13-15"],
            verificationStatus: "verified",
          }),
        },
      ],
    },
  ],
  sections: {
    languageNotes: [
      makeLanguageNote({
        id: "lang-exod3-sequence",
        text: "The passage moves from Moses’ question about what name to give Israel, through God’s response ehyeh asher ehyeh, to the abbreviated claim that ehyeh has sent Moses, then to YHWH identified as God of Abraham, Isaac, and Jacob, and finally to “my name” and “my remembrance/memorial” across generations.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "exod-3-13-15"],
        verificationStatus: "verified",
        visitorNote:
          "Primary-text / literary sequence. Do not flatten the movement into a single metaphysical slogan.",
      }),
      makeLanguageNote({
        id: "lang-ehyeh-openness",
        text: "Ehyeh is grammatically more open than English “I AM” alone suggests. As a first-person imperfect of hayah, it can support present, future, or imperfective readings depending on context.",
        category: "morphology",
        confidence: "widely-attested",
        sourceIds: [
          "wlc",
          "oshb-morph",
          "exod-3-13-15",
          "exod-3-12",
          "net-notes-exod-3-12-15",
        ],
        verificationStatus: "verified",
      }),
      makeLanguageNote({
        id: "lang-exod-3-12",
        text: "Exodus 3:12 matters because the same form appears in the promise of divine presence with Moses, commonly rendered “I will be with you.”",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "exod-3-12", "asv-1901"],
        verificationStatus: "verified",
      }),
      makeLanguageNote({
        id: "lang-asher-flexibility",
        text: "Asher allows more than one natural English relational construction (who / that / which / what). Its flexibility contributes to the range of possible renderings of the phrase.",
        category: "grammatical",
        confidence: "widely-attested",
        sourceIds: ["wlc", "oshb-morph", "exod-3-13-15"],
        verificationStatus: "verified",
      }),
      makeLanguageNote({
        id: "lang-ehyeh-yhwh-juxtaposition",
        text: "Verses 14 and 15 deliberately juxtapose ehyeh and YHWH. Literary association is real in the narrative; historical etymology of YHWH remains a separate and disputed question.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "exod-3-13-15"],
        verificationStatus: "verified",
        visitorNote:
          "Do not say “YHWH literally means I AM,” and do not claim Exodus 3 settles the name’s historical origin.",
      }),
      makeLanguageNote({
        id: "lang-name-remembrance",
        text: "In verse 15, “name” and “remembrance/memorial” are paired: this is my name forever, and this is my remembrance/memorial unto generations.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "exod-3-13-15", "asv-1901"],
        verificationStatus: "verified",
      }),
    ],
    context: [
      {
        title: "Mission and recognition",
        body: "Moses is not asking an abstract philosophical question in isolation. He is asking what he should tell the Israelites when they ask the identity/name of the God who sent him.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "exod-3-13-15"],
        verificationStatus: "verified",
      },
      {
        title: "Presence before naming",
        body: "Exodus 3:12’s promise (“I will be with you”) precedes the name exchange of 3:13–15. Name, presence, sending, and ancestral identity are already linked in the surrounding narrative.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "exod-3-12", "exod-3-13-15", "asv-1901"],
        verificationStatus: "verified",
      },
      {
        title: "Ancestral identification",
        body: "The answer culminates not only in YHWH but in God of Abraham, God of Isaac, and God of Jacob. The passage therefore links divine identity with name, presence, promise, ancestral relationship, and mission/sending — without claiming to exhaust the meaning of the text.",
        category: "literary-context",
        confidence: "widely-attested",
        sourceIds: ["wlc", "exod-3-13-15"],
        verificationStatus: "verified",
      },
      {
        title: "Exodus 6:2–3 (optional cross-context)",
        body: "Later in Exodus, divine-name disclosure to the ancestors is discussed again (Exodus 6:2–3). That passage can illuminate reception of the name within Exodus, but it should not be collapsed into a single simple equation with 3:14–15 without further work.",
        category: "primary-text",
        confidence: "reasonable-reading",
        sourceIds: ["exod-6-2-3", "exod-3-13-15"],
        verificationStatus: "research-continues",
        researchFlag:
          "Cross-reference registered for context; do not force a finished harmonization in this pass.",
      },
    ],
    interpretation: [
      interpretationGroup({
        tradition: "jewish",
        label: "Jewish readings",
        readings: [
          namedInterpretation({
            id: "exod-3-rashi-3-14",
            interpreter: "Rashi",
            work: "Commentary on Exodus 3:14",
            body: "Rashi interprets ehyeh asher ehyeh through divine presence with Israel in suffering: “I will be with them in this distress as I will be with them in later distress.” The traditional reading continues that Moses objects to mentioning future distress, and God tells him to say simply that Ehyeh sent him. This is Rashi’s interpretive reading — not the lexical meaning of ehyeh.",
            confidence: "directly-attested",
            verificationStatus: "verified",
            sourceIds: ["rashi-exod-3-14", "berakhot-9b"],
          }),
          namedInterpretation({
            id: "exod-3-rashbam-3-14",
            interpreter: "Rashbam",
            work: "Commentary on Exodus 3:14",
            body: "Rashbam is among medieval Jewish commentators who connect Ehyeh with God’s enduring presence and capacity to fulfill what God promises. Exact propositional wording for this instrument remains under verification; the reading is attributed cautiously rather than sharpened beyond what this pass safely supports.",
            confidence: "tradition-noted",
            verificationStatus: "research-continues",
            sourceIds: ["rashbam-exod-3-14"],
            researchFlag:
              "RESEARCH CONTINUES — do not invent a sharper Rashbam proposition until the commentary wording is verified in-source.",
          }),
          namedInterpretation({
            id: "exod-3-ramban-3-13-15",
            interpreter: "Ramban (Nachmanides)",
            work: "Commentary on Exodus 3:13–15",
            body: "Ramban develops a richer theological account around divine being, the divine name, and attributes, engaging earlier interpretations rather than reducing ehyeh to a single lexical gloss. Do not flatten Ramban into “Ramban says ehyeh means X.”",
            confidence: "tradition-noted",
            verificationStatus: "research-continues",
            sourceIds: ["ramban-exod-3-13-15"],
            researchFlag:
              "INTERPRETIVE / RESEARCH CONTINUES — fuller citation of Ramban’s exact argument belongs to a later verification pass.",
          }),
        ],
      }),
      interpretationGroup({
        tradition: "christian",
        label: "Christian / later reception",
        readings: [
          namedInterpretation({
            id: "exod-3-christian-reception-framing",
            interpreter: "Later Christian reception",
            work: "Greek translation, metaphysics, and “I AM” traditions",
            body: "Later Christian theology often reads Exodus 3 through Greek translation, metaphysics, and later “I AM” traditions. Hebrew grammar does not prove the Trinity; Exodus 3:14 does not directly prove a Christological reading; and John 8:58 should not be treated as simply a translation of Exodus 3:14. Named patristic or scholastic claims are not attached in this pass.",
            confidence: "tradition-noted",
            verificationStatus: "research-continues",
            sourceIds: ["exod-3-13-15", "lxx-exod-3-14-reception"],
            researchFlag:
              "RESEARCH CONTINUES — no named Augustine / Aquinas / patristic citation verified in this pass. Do not invent one.",
          }),
        ],
      }),
      interpretationGroup({
        tradition: "academic",
        label: "Academic / philological notes",
        readings: [
          namedInterpretation({
            id: "exod-3-acad-ehyeh-morph",
            interpreter: "Philological note",
            work: "Morphology of ehyeh",
            body: "Ehyeh is first-person imperfect of hayah. Its English rendering is context-sensitive. Exodus 3:12 provides immediate contextual evidence for a future/presence-oriented use of the same form.",
            confidence: "widely-attested",
            verificationStatus: "verified",
            sourceIds: [
              "wlc",
              "oshb-morph",
              "exod-3-12",
              "exod-3-13-15",
              "net-notes-exod-3-12-15",
            ],
          }),
          namedInterpretation({
            id: "exod-3-acad-phrase",
            interpreter: "Philological note",
            work: "Ehyeh asher ehyeh as translation problem",
            body: "Ehyeh asher ehyeh has multiple defensible translation strategies. Treat the phrase as a translation problem, not as a closed lexical entry with one crowned English formula.",
            confidence: "disputed",
            verificationStatus: "research-continues",
            sourceIds: [
              "wlc",
              "asv-1901",
              "ylt-1898",
              "exod-3-13-15",
              "net-notes-exod-3-12-15",
            ],
          }),
          namedInterpretation({
            id: "exod-3-acad-yhwh-etymology",
            interpreter: "Philological note",
            work: "Literary association vs. historical etymology",
            body: "Verses 14–15 associate ehyeh with YHWH. That literary association does not settle the historical etymology of YHWH. The exact origin/etymology of the divine name remains disputed.",
            confidence: "disputed",
            verificationStatus: "research-continues",
            sourceIds: ["wlc", "exod-3-13-15", "net-notes-exod-3-12-15"],
          }),
          namedInterpretation({
            id: "exod-3-acad-lxx",
            interpreter: "Translation history / reception",
            work: "Greek rendering associated with ἐγώ εἰμι ὁ ὤν",
            body: "The Greek tradition famously renders Exodus 3:14 in a way associated with ἐγώ εἰμι ὁ ὤν — roughly “I am the one who is” / “I am the Being One.” This is translation history / reception, not equivalence to the Hebrew grammar. The Greek rendering influenced later philosophical and Christian readings of divine being. Exact edition-level bibliographic verification continues.",
            confidence: "tradition-noted",
            verificationStatus: "research-continues",
            sourceIds: ["lxx-exod-3-14-reception", "exod-3-13-15"],
            researchFlag:
              "RESEARCH CONTINUES — famous rendering noted; do not overstate edition-level verification in this pass.",
          }),
          namedInterpretation({
            id: "exod-3-acad-source-critical",
            interpreter: "Literary-critical note",
            work: "Possible differentiation of v14 and v15",
            body: "Source-critical scholarship may treat verses 14 and 15 differently. If so, that judgment is literary-critical interpretation rather than a textual fact established by morphology alone.",
            confidence: "disputed",
            verificationStatus: "research-continues",
            sourceIds: ["exod-3-13-15"],
            researchFlag:
              "Label clearly as literary-critical interpretation — not primary-text fact.",
          }),
        ],
      }),
    ],
    terrain: [
      terrainNode({
        label: "name",
        kind: "concept",
        note: "Designation, recognition, and identity opened by the question “What is his name?”",
      }),
      terrainNode({
        label: "presence",
        kind: "concept",
        note: "Opened by Exodus 3:12’s “I will be with you” and by Rashi’s presence-in-distress reading — exploratory, not lexical proof.",
      }),
      terrainNode({
        label: "being",
        kind: "concept",
        note: "Later metaphysical terrain opened by translation and reception — not a forced Hebrew ontology.",
      }),
      terrainNode({
        label: "becoming",
        kind: "concept",
        note: "Possible imperfective/future-facing hearing of ehyeh — exploratory, not the one correct translation.",
      }),
      terrainNode({
        label: "promise",
        kind: "concept",
        note: "Sending and ancestral covenant language open promise as terrain.",
      }),
      terrainNode({
        label: "identity",
        kind: "concept",
        note: "Who sends Moses — and how that sender is named.",
      }),
      terrainNode({
        label: "relationship",
        kind: "concept",
        note: "God of Abraham, Isaac, and Jacob — ancestral relationship as identification.",
      }),
      terrainNode({
        label: "memory",
        kind: "concept",
        note: "Zekher / remembrance-memorial paired with name.",
      }),
      terrainNode({
        label: "generations",
        kind: "concept",
        note: "“Unto all generations” / “to generation — generation.”",
      }),
      terrainNode({
        label: "speech",
        kind: "concept",
        note: "What Moses is to say — speech as mission medium.",
      }),
      terrainNode({
        label: "sending",
        kind: "concept",
        note: "“Hath sent me unto you” threads through the exchange.",
      }),
    ],
    remainsOpen: [
      openQuestion({
        question:
          "Should ehyeh be heard primarily as present, future, or deliberately open?",
        whyOpen:
          "Morphology permits more than one English tense strategy. Exodus 3:12 supports presence/future capability without forcing a single formula for 3:14.",
      }),
      openQuestion({
        question: "What grammatical work is asher doing in the phrase?",
        whyOpen:
          "Relative constructions can be carried several ways in English. The particle’s flexibility is real; a mystical single meaning is not required.",
      }),
      openQuestion({
        question:
          "Is ehyeh asher ehyeh functioning as a name, an explanation, a promise of presence, an evasion, or some combination?",
        whyOpen:
          "The narrative supports more than one hearing. Jewish interpreters such as Rashi emphasize presence-in-distress; other traditions emphasize being, faithfulness, or refusal of a simple label.",
      }),
      openQuestion({
        question: "What exactly is the relationship between ehyeh and YHWH?",
        whyOpen:
          "Literary juxtaposition in vv. 14–15 is clear. Historical etymology and metaphysical identity claims are separate questions.",
      }),
      openQuestion({
        question:
          "Does Exodus 3 preserve the historical etymology of YHWH, or literary/theological wordplay?",
        whyOpen:
          "The text places ehyeh beside YHWH. Whether that preserves etymology or crafts theological wordplay remains disputed.",
      }),
      openQuestion({
        question:
          "How did the Greek translation change the later history of interpretation?",
        whyOpen:
          "Renderings associated with ἐγώ εἰμι ὁ ὤν shaped philosophical and Christian readings of divine being. Exact mapping from Hebrew grammar to Greek metaphysics should not be assumed.",
      }),
      openQuestion({
        question:
          "How much later “God as Being” theology comes from the Hebrew itself versus translation and later philosophy?",
        whyOpen:
          "Reception history and Hebrew grammar must be kept distinct. Overclaiming either direction distorts the evidence.",
      }),
      openQuestion({
        question:
          "How should later Christian “I AM” reception relate to Exodus without collapsing reception into Hebrew grammar?",
        whyOpen:
          "Later “I AM” traditions (including New Testament reception) belong to interpretation history. They are not automatic translations of Exodus 3:14’s Hebrew.",
      }),
    ],
  },
};
