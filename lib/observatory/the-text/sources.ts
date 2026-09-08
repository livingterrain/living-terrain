import type { SourceType } from "./epistemic";

/**
 * Source registry for Instrument 01.
 * Do not invent bibliographic metadata. Prefer incomplete honesty over fake completeness.
 */

export interface TextSource {
  id: string;
  type: SourceType;
  shortCitation: string;
  fullCitation: string;
  author?: string;
  editor?: string;
  year?: number | string;
  url?: string;
  publicDomain?: boolean;
  licenseNote?: string;
  /** Authoring / scope note — filtered from visitor UI when flagged as editorial. */
  note?: string;
  /** Optional visitor-safe note about how this source is used. */
  visitorNote?: string;
}

export const TEXT_SOURCES: Record<string, TextSource> = {
  wlc: {
    id: "wlc",
    type: "primary-text-edition",
    shortCitation: "WLC / Leningrad B19A",
    fullCitation:
      "Westminster Leningrad Codex (diplomatic edition of Leningrad Codex B19A).",
    publicDomain: true,
    licenseNote: "Public-domain textual tradition / open transcriptions commonly used.",
    visitorNote: "Hebrew textual base for this instrument.",
  },
  "oshb-morph": {
    id: "oshb-morph",
    type: "grammar",
    shortCitation: "OSHB morphology",
    fullCitation:
      "Open Scriptures Hebrew Bible morphology (parsing aid aligned to the Westminster Leningrad Codex tradition).",
    publicDomain: true,
    visitorNote: "Used as a morphological parsing aid, not as a critical lexicon.",
    note: "Not a substitute for BDB/HALOT/DCH.",
  },
  "gen-1-20": {
    id: "gen-1-20",
    type: "primary-text-edition",
    shortCitation: "Gen 1:20",
    fullCitation:
      "Genesis 1:20 (WLC) — nepeš ḥayyāh with living creatures of the waters.",
  },
  "gen-1-24": {
    id: "gen-1-24",
    type: "primary-text-edition",
    shortCitation: "Gen 1:24",
    fullCitation:
      "Genesis 1:24 (WLC) — nepeš ḥayyāh with living creatures of the land.",
  },
  "gen-2-7": {
    id: "gen-2-7",
    type: "primary-text-edition",
    shortCitation: "Gen 2:7",
    fullCitation: "Genesis 2:7 (WLC / Leningrad B19A tradition).",
  },
  "gen-1-1-5": {
    id: "gen-1-1-5",
    type: "primary-text-edition",
    shortCitation: "Gen 1:1–5",
    fullCitation: "Genesis 1:1–5 (WLC / Leningrad B19A tradition).",
  },
  "gen-1-14-18": {
    id: "gen-1-14-18",
    type: "primary-text-edition",
    shortCitation: "Gen 1:14–18",
    fullCitation:
      "Genesis 1:14–18 (WLC) — luminaries introduced later than the light of Gen 1:3–5.",
  },
  "gen-2-1-3": {
    id: "gen-2-1-3",
    type: "primary-text-edition",
    shortCitation: "Gen 2:1–3",
    fullCitation:
      "Genesis 2:1–3 (WLC) — closing of the structured creation account begun in Gen 1:1.",
  },
  "deut-32-11": {
    id: "deut-32-11",
    type: "primary-text-edition",
    shortCitation: "Deut 32:11",
    fullCitation:
      "Deuteronomy 32:11 (WLC) — related רחף imagery of a bird hovering/fluttering over its young.",
  },
  "john-1-1-5": {
    id: "john-1-1-5",
    type: "primary-text-edition",
    shortCitation: "John 1:1–5",
    fullCitation:
      "John 1:1–5 — later Christian reuse of beginning / creation / life / light language (reception, not Hebrew lexical evidence).",
  },
  "gen-2-4": {
    id: "gen-2-4",
    type: "primary-text-edition",
    shortCitation: "Gen 2:4",
    fullCitation: "Genesis 2:4 (WLC) — opening of the garden narrative unit.",
  },
  "gen-3-19": {
    id: "gen-3-19",
    type: "primary-text-edition",
    shortCitation: "Gen 3:19",
    fullCitation:
      "Genesis 3:19 (WLC) — return to dust; literary closure with Gen 2:7’s dust formation.",
  },
  "gen-7-22": {
    id: "gen-7-22",
    type: "primary-text-edition",
    shortCitation: "Gen 7:22",
    fullCitation:
      "Genesis 7:22 (WLC) — relevant for breath-of-life vocabulary beyond Genesis 2:7.",
  },
  "job-32-8": {
    id: "job-32-8",
    type: "primary-text-edition",
    shortCitation: "Job 32:8",
    fullCitation:
      "Job 32:8 (WLC) — nĕšāmāh language in a non-Genesis context (complicates simple equations).",
  },
  "job-34-14-15": {
    id: "job-34-14-15",
    type: "primary-text-edition",
    shortCitation: "Job 34:14–15",
    fullCitation:
      "Job 34:14–15 (WLC) — breath / spirit / dust vocabulary in relation to life and return to dust.",
  },
  "1cor-15-45": {
    id: "1cor-15-45",
    type: "primary-text-edition",
    shortCitation: "1 Cor 15:45",
    fullCitation:
      "1 Corinthians 15:45 — Pauline reuse of Genesis 2:7 “living being/soul” language in contrast with Christ as life-giving spirit.",
  },
  "asv-1901": {
    id: "asv-1901",
    type: "translation",
    shortCitation: "ASV 1901",
    fullCitation: "American Standard Version. 1901.",
    year: 1901,
    publicDomain: true,
  },
  "ylt-1898": {
    id: "ylt-1898",
    type: "translation",
    shortCitation: "YLT 1898",
    fullCitation: "Young, Robert. Young’s Literal Translation. 1898.",
    author: "Robert Young",
    year: 1898,
    publicDomain: true,
  },
  "jps-1985": {
    id: "jps-1985",
    type: "translation",
    shortCitation: "JPS / NJPS 1985",
    fullCitation:
      "Tanakh: A New Translation of the Holy Scriptures According to the Traditional Hebrew Text. Jewish Publication Society, 1985 (NJPS).",
    year: 1985,
    publicDomain: false,
    licenseNote:
      "Copyrighted. Registered here as translation evidence for the rendering “living being” — full verse text is not reproduced in this instrument.",
    visitorNote:
      "Cited for the English choice “living being,” not as a statement of Jewish doctrine.",
  },
  "kjv-1611": {
    id: "kjv-1611",
    type: "translation",
    shortCitation: "KJV",
    fullCitation: "King James Version. 1611 (public-domain English Bible).",
    year: 1611,
    publicDomain: true,
  },
  "jps-1917": {
    id: "jps-1917",
    type: "translation",
    shortCitation: "JPS 1917",
    fullCitation:
      "The Holy Scriptures According to the Masoretic Text. Jewish Publication Society, 1917.",
    year: 1917,
    publicDomain: true,
  },
  "web": {
    id: "web",
    type: "translation",
    shortCitation: "WEB",
    fullCitation: "World English Bible (public-domain English translation).",
    publicDomain: true,
  },
  "rashi-gen-2-7": {
    id: "rashi-gen-2-7",
    type: "jewish-interpretive",
    shortCitation: "Rashi on Gen 2:7",
    fullCitation:
      "Rashi (Rabbi Shlomo Yitzchaki). Commentary on Genesis 2:7.",
    author: "Rashi",
    visitorNote:
      "Named medieval Jewish commentary — an interpretive reading, not a lexical definition.",
  },
  "ramban-gen-2-7": {
    id: "ramban-gen-2-7",
    type: "jewish-interpretive",
    shortCitation: "Ramban on Gen 2:7",
    fullCitation:
      "Ramban / Nachmanides (Rabbi Moses ben Nachman). Commentary on Genesis 2:7.",
    author: "Ramban (Nachmanides)",
    visitorNote:
      "Named medieval Jewish theological commentary — develops anthropology beyond the lexical minimum.",
  },
  "onkelos-gen-2-7": {
    id: "onkelos-gen-2-7",
    type: "jewish-interpretive",
    shortCitation: "Targum Onkelos Gen 2:7",
    fullCitation:
      "Targum Onkelos on Genesis 2:7 (ancient Aramaic interpretive translation).",
    visitorNote:
      "An interpretive Aramaic translation, not a Hebrew lexicon entry.",
  },
  "augustine-civ-13-24": {
    id: "augustine-civ-13-24",
    type: "christian-interpretive",
    shortCitation: "Augustine, City of God XIII.24",
    fullCitation:
      "Augustine of Hippo. The City of God, Book XIII, chapter 24.",
    author: "Augustine of Hippo",
    visitorNote:
      "Christian theological reception of Genesis 2:7 — not a Hebrew lexical claim.",
  },
  "calvin-gen-2-7": {
    id: "calvin-gen-2-7",
    type: "christian-interpretive",
    shortCitation: "Calvin on Gen 2:7",
    fullCitation:
      "Calvin, John. Commentary on Genesis (at Genesis 2:7); cf. related discussion in connection with 1 Corinthians 15:45.",
    author: "John Calvin",
    visitorNote:
      "Reformation Christian reception — acknowledges shared “living soul” language with beasts while maintaining a larger doctrine of the human soul.",
  },
  "net-notes-gen-2-7": {
    id: "net-notes-gen-2-7",
    type: "other-scholarly",
    shortCitation: "NET Bible notes (Gen 2:7)",
    fullCitation:
      "New English Translation (NET) Bible notes on Genesis 2:7 — secondary translation/philological aid.",
    visitorNote:
      "Secondary aid for translation/grammar discussion; not treated as final scholarly authority.",
    note: "Useful for nephesh hayyah across humans/animals, neshamah uncertainty, and dust/from-the-ground observations.",
  },
  "net-notes-gen-1-1-2": {
    id: "net-notes-gen-1-1-2",
    type: "other-scholarly",
    shortCitation: "NET Bible notes (Gen 1:1–2)",
    fullCitation:
      "New English Translation (NET) Bible notes on Genesis 1:1–2 — secondary aid for syntactic/translation observations (bereshit; ruach Elohim).",
    visitorNote:
      "Secondary aid for grammar/translation discussion; not treated as final scholarly authority.",
  },
  "rashi-gen-1-1": {
    id: "rashi-gen-1-1",
    type: "jewish-interpretive",
    shortCitation: "Rashi on Gen 1:1",
    fullCitation: "Rashi (Rabbi Shlomo Yitzchaki). Commentary on Genesis 1:1.",
    author: "Rashi",
    visitorNote:
      "Named medieval Jewish commentary — grammatical-exegetical reading, not a lexicon entry.",
  },
  "rashi-gen-1-2": {
    id: "rashi-gen-1-2",
    type: "jewish-interpretive",
    shortCitation: "Rashi on Gen 1:2",
    fullCitation: "Rashi (Rabbi Shlomo Yitzchaki). Commentary on Genesis 1:2.",
    author: "Rashi",
    visitorNote:
      "Named medieval Jewish commentary on ruach Elohim — interpretive, not the lexical definition.",
  },
  "ibn-ezra-gen-1-1": {
    id: "ibn-ezra-gen-1-1",
    type: "jewish-interpretive",
    shortCitation: "Ibn Ezra on Gen 1:1",
    fullCitation:
      "Ibn Ezra (Abraham ibn Ezra). Commentary on Genesis 1:1.",
    author: "Ibn Ezra",
    visitorNote: "Named medieval Jewish grammatical interpretation of bereshit.",
  },
  "ibn-ezra-gen-1-4-5": {
    id: "ibn-ezra-gen-1-4-5",
    type: "jewish-interpretive",
    shortCitation: "Ibn Ezra on Gen 1:4–5",
    fullCitation:
      "Ibn Ezra (Abraham ibn Ezra). Commentary on Genesis 1:4–5.",
    author: "Ibn Ezra",
    visitorNote:
      "Named medieval Jewish reading connecting separation of light/darkness with naming.",
  },
  "ramban-gen-1-1": {
    id: "ramban-gen-1-1",
    type: "jewish-interpretive",
    shortCitation: "Ramban on Gen 1:1",
    fullCitation:
      "Ramban / Nachmanides (Rabbi Moses ben Nachman). Commentary on Genesis 1:1.",
    author: "Ramban (Nachmanides)",
    visitorNote:
      "Named medieval Jewish commentary engaging grammatical and theological readings of bereshit.",
  },
  "ramban-gen-1-3-4": {
    id: "ramban-gen-1-3-4",
    type: "jewish-interpretive",
    shortCitation: "Ramban on Gen 1:3–4",
    fullCitation:
      "Ramban / Nachmanides (Rabbi Moses ben Nachman). Commentary on Genesis 1:3–4.",
    author: "Ramban (Nachmanides)",
    visitorNote:
      "Named medieval Jewish commentary distinguishing plain meaning and aggadic/theological readings of light.",
  },
  "radak-gen-1-1": {
    id: "radak-gen-1-1",
    type: "jewish-interpretive",
    shortCitation: "Radak on Gen 1:1",
    fullCitation:
      "Radak (Rabbi David Kimhi). Commentary on Genesis 1:1 — among Jewish interpreters defending an independent/absolute reading of bereshit.",
    author: "Radak",
    visitorNote:
      "Named medieval Jewish grammatical defense of an absolute reading of bereshit.",
  },
  "bereshit-rabbah-1": {
    id: "bereshit-rabbah-1",
    type: "jewish-interpretive",
    shortCitation: "Bereshit Rabbah 1",
    fullCitation:
      "Bereshit Rabbah (Genesis Rabbah), section 1 — early rabbinic midrashic reception of Genesis 1.",
    visitorNote:
      "Early Jewish reception; preserves disagreement rather than one uncontested chronology.",
  },
  "future-bdb": {
    id: "future-bdb",
    type: "lexicon",
    shortCitation: "BDB — future",
    fullCitation:
      "Brown, Francis; Driver, S. R.; Briggs, Charles A. A Hebrew and English Lexicon of the Old Testament. (Future consultation — not cited as consulted for this pass.)",
    note: "FLAG: not consulted in this verified-core pass. Do not imply BDB entries were read.",
  },
  "future-halot": {
    id: "future-halot",
    type: "lexicon",
    shortCitation: "HALOT — future",
    fullCitation:
      "Koehler, Ludwig; Baumgartner, Walter; et al. The Hebrew and Aramaic Lexicon of the Old Testament. (Future consultation — not cited as consulted for this pass.)",
    note: "FLAG: not consulted in this verified-core pass.",
  },
  "future-dch": {
    id: "future-dch",
    type: "lexicon",
    shortCitation: "DCH — future",
    fullCitation:
      "Clines, David J. A., ed. The Dictionary of Classical Hebrew. (Future consultation — not cited as consulted for this pass.)",
    note: "FLAG: not consulted in this verified-core pass.",
  },
  /** Retained only for legacy links during migration; prefer oshb-morph. */
  "strongs-summary": {
    id: "strongs-summary",
    type: "lexicon",
    shortCitation: "Strong’s (aid)",
    fullCitation:
      "Strong, James. Strong’s Exhaustive Concordance — Hebrew/Greek dictionaries (concordance aid).",
    author: "James Strong",
    year: 1890,
    publicDomain: true,
    note: "Concordance aid only — not a critical lexicon.",
  },
  "openbible-morph": {
    id: "openbible-morph",
    type: "grammar",
    shortCitation: "OpenBible morphology",
    fullCitation:
      "Public morphology / parsing tables commonly mirrored in open Bible tools.",
    note: "Prefer OSHB morphology where aligned to WLC.",
  },
  "exod-3-13-15": {
    id: "exod-3-13-15",
    type: "primary-text-edition",
    shortCitation: "Exod 3:13–15",
    fullCitation: "Exodus 3:13–15 (WLC / Leningrad B19A tradition).",
  },
  "exod-3-12": {
    id: "exod-3-12",
    type: "primary-text-edition",
    shortCitation: "Exod 3:12",
    fullCitation:
      "Exodus 3:12 (WLC) — same ehyeh form in the promise commonly rendered “I will be with you.”",
  },
  "exod-6-2-3": {
    id: "exod-6-2-3",
    type: "primary-text-edition",
    shortCitation: "Exod 6:2–3",
    fullCitation:
      "Exodus 6:2–3 (WLC) — later Exodus discussion of divine-name disclosure relative to the ancestors.",
  },
  "rashi-exod-3-14": {
    id: "rashi-exod-3-14",
    type: "jewish-interpretive",
    shortCitation: "Rashi on Exod 3:14",
    fullCitation: "Rashi (Rabbi Shlomo Yitzchaki). Commentary on Exodus 3:14.",
    author: "Rashi",
    visitorNote:
      "Named medieval Jewish commentary — interpretive reading of ehyeh asher ehyeh through presence in distress, not a lexical definition.",
  },
  "berakhot-9b": {
    id: "berakhot-9b",
    type: "jewish-interpretive",
    shortCitation: "Berakhot 9b",
    fullCitation:
      "Babylonian Talmud, Berakhot 9b — traditional source cited in Rashi’s reading of Exodus 3:14.",
    visitorNote:
      "Rabbinic interpretive source underlying the presence-in-distress reading preserved by Rashi.",
  },
  "rashbam-exod-3-14": {
    id: "rashbam-exod-3-14",
    type: "jewish-interpretive",
    shortCitation: "Rashbam on Exod 3:14",
    fullCitation:
      "Rashbam (Rabbi Samuel ben Meir). Commentary on Exodus 3:14.",
    author: "Rashbam",
    visitorNote:
      "Named medieval Jewish commentary — registered for attributed reading; exact proposition remains research-continues in this pass.",
    note: "FLAG: exact in-source proposition not fully verified in this pass.",
  },
  "ramban-exod-3-13-15": {
    id: "ramban-exod-3-13-15",
    type: "jewish-interpretive",
    shortCitation: "Ramban on Exod 3:13–15",
    fullCitation:
      "Ramban / Nachmanides (Rabbi Moses ben Nachman). Commentary on Exodus 3:13–15.",
    author: "Ramban (Nachmanides)",
    visitorNote:
      "Named medieval Jewish theological commentary engaging divine name / being — not flattened to a single lexical gloss in this pass.",
    note: "FLAG: fuller citation remains research-continues.",
  },
  "net-notes-exod-3-12-15": {
    id: "net-notes-exod-3-12-15",
    type: "other-scholarly",
    shortCitation: "NET Bible notes (Exod 3:12–15)",
    fullCitation:
      "New English Translation (NET) Bible notes on Exodus 3:12–15 — secondary translation/philological aid.",
    visitorNote:
      "Secondary aid for translation/grammar discussion; not treated as final scholarly authority.",
    note: "Useful for ehyeh morphology, presence context, and name/translation observations — not a substitute for BDB/HALOT/DCH.",
  },
  "lxx-exod-3-14-reception": {
    id: "lxx-exod-3-14-reception",
    type: "translation",
    shortCitation: "LXX Exod 3:14 (reception)",
    fullCitation:
      "Greek (Septuagint) tradition of Exodus 3:14 — famously associated with ἐγώ εἰμι ὁ ὤν (“I am the one who is” / “I am the Being One”). Registered here as translation-history / reception evidence.",
    visitorNote:
      "Translation history / reception — not equivalence to Hebrew grammar. Exact edition-level verification continues.",
    note: "FLAG: famous rendering noted; edition-level bibliographic verification remains research-continues.",
  },
};

export function getSourceById(id: string): TextSource | undefined {
  return TEXT_SOURCES[id];
}

export function getSourcesByIds(ids: string[]): TextSource[] {
  return ids
    .map((id) => TEXT_SOURCES[id])
    .filter((s): s is TextSource => s !== undefined);
}
