import type { SpiralSourceRef, SpiralTrajectory } from "../types";

/**
 * Memory updating under prediction error — the first Psychology trajectory.
 * An empirical, branching trajectory. It follows one memory representation
 * within one person, read through later retrieval; steps are states of that
 * memory, not Spiral stages, and edges are domain topology, not comparisons.
 * Relationships are authored separately (`comparisons/psychology.ts`); the
 * `psy-cmp-*` concepts below carry their research.
 *
 * Sources were reviewed in the Phase 3A authoring report. DOIs are given only
 * where verified. Edge citations add only `supports`; bibliographic fields
 * never vary.
 */

const LEWIS_1979: SpiralSourceRef = {
  id: "lewis-1979",
  title: "Psychobiology of active and inactive memory",
  authors: "Lewis DJ",
  year: 1979,
  publication: "Psychological Bulletin 86(5): 1054–1083",
};

const RESCORLA_WAGNER_1972: SpiralSourceRef = {
  id: "rescorla-wagner-1972",
  title:
    "A theory of Pavlovian conditioning: Variations in the effectiveness of reinforcement and nonreinforcement",
  authors: "Rescorla RA, Wagner AR",
  year: 1972,
  publication: "In Black AH, Prokasy WF (eds), Classical Conditioning II: Current Research and Theory",
};

const NADER_2000: SpiralSourceRef = {
  id: "nader-2000",
  title: "Fear memories require protein synthesis in the amygdala for reconsolidation after retrieval",
  authors: "Nader K, Schafe GE, LeDoux JE",
  year: 2000,
  publication: "Nature 406: 722–726",
};

const MILEKIC_ALBERINI_2002: SpiralSourceRef = {
  id: "milekic-alberini-2002",
  title: "Temporally graded requirement for protein synthesis following memory reactivation",
  authors: "Milekic MH, Alberini CM",
  year: 2002,
  publication: "Neuron 36(3): 521–525",
};

const EISENBERG_2003: SpiralSourceRef = {
  id: "eisenberg-2003",
  title: "Stability of retrieved memory: Inverse correlation with trace dominance",
  authors: "Eisenberg M, Kobilo T, Berman DE, Dudai Y",
  year: 2003,
  publication: "Science 301: 1102–1104",
};

const PEDREIRA_2004: SpiralSourceRef = {
  id: "pedreira-2004",
  title: "Mismatch between what is expected and what actually occurs triggers memory reconsolidation or extinction",
  authors: "Pedreira ME, Pérez-Cuesta LM, Maldonado H",
  year: 2004,
  publication: "Learning & Memory 11(5): 579–585",
};

const SUZUKI_2004: SpiralSourceRef = {
  id: "suzuki-2004",
  title: "Memory reconsolidation and extinction have distinct temporal and biochemical signatures",
  authors: "Suzuki A, Josselyn SA, Frankland PW, Masushige S, Silva AJ, Kida S",
  year: 2004,
  publication: "Journal of Neuroscience 24(20): 4787–4795",
};

const BOUTON_2004: SpiralSourceRef = {
  id: "bouton-2004",
  title: "Context and behavioral processes in extinction",
  authors: "Bouton ME",
  year: 2004,
  publication: "Learning & Memory 11(5): 485–494",
};

const HUPBACH_2007: SpiralSourceRef = {
  id: "hupbach-2007",
  title: "Reconsolidation of episodic memories: A subtle reminder triggers integration of new information",
  authors: "Hupbach A, Gomez R, Hardt O, Nadel L",
  year: 2007,
  publication: "Learning & Memory 14(1–2): 47–53",
  doi: "10.1101/lm.365707",
};

const TSE_2007: SpiralSourceRef = {
  id: "tse-2007",
  title: "Schemas and memory consolidation",
  authors: "Tse D, Langston RF, Kakeyama M, Bethus I, Spooner PA, Wood ER, Witter MP, Morris RGM",
  year: 2007,
  publication: "Science 316: 76–82",
};

const KINDT_2009: SpiralSourceRef = {
  id: "kindt-2009",
  title: "Beyond extinction: Erasing human fear responses and preventing the return of fear",
  authors: "Kindt M, Soeter M, Vervliet B",
  year: 2009,
  publication: "Nature Neuroscience 12(3): 256–258",
  doi: "10.1038/nn.2271",
};

const LEE_2009: SpiralSourceRef = {
  id: "lee-2009",
  title: "Reconsolidation: Maintaining memory relevance",
  authors: "Lee JLC",
  year: 2009,
  publication: "Trends in Neurosciences 32(8): 413–420",
};

const NADER_HARDT_2009: SpiralSourceRef = {
  id: "nader-hardt-2009",
  title: "A single standard for memory: The case for reconsolidation",
  authors: "Nader K, Hardt O",
  year: 2009,
  publication: "Nature Reviews Neuroscience 10(3): 224–234",
};

const HUPBACH_2009: SpiralSourceRef = {
  id: "hupbach-2009",
  title: "Episodic memory reconsolidation: Updating or source confusion?",
  authors: "Hupbach A, Gomez R, Nadel L",
  year: 2009,
  publication: "Memory 17(5): 502–510",
  doi: "10.1080/09658210902882399",
};

const SEDERBERG_2011: SpiralSourceRef = {
  id: "sederberg-2011",
  title: "Human memory reconsolidation can be explained using the temporal context model",
  authors: "Sederberg PB, Gershman SJ, Polyn SM, Norman KA",
  year: 2011,
  publication: "Psychonomic Bulletin & Review 18(3): 455–468",
  doi: "10.3758/s13423-011-0086-9",
};

const WINOCUR_MOSCOVITCH_2011: SpiralSourceRef = {
  id: "winocur-moscovitch-2011",
  title: "Memory transformation and systems consolidation",
  authors: "Winocur G, Moscovitch M",
  year: 2011,
  publication: "Journal of the International Neuropsychological Society 17(5): 766–780",
};

const GISQUET_VERRIER_RICCIO_2012: SpiralSourceRef = {
  id: "gisquet-verrier-riccio-2012",
  title: "Memory reactivation effects independent of reconsolidation",
  authors: "Gisquet-Verrier P, Riccio DC",
  year: 2012,
  publication: "Learning & Memory 19(9): 401–409",
  doi: "10.1101/lm.026054.112",
};

const KUMARAN_MCCLELLAND_2012: SpiralSourceRef = {
  id: "kumaran-mcclelland-2012",
  title:
    "Generalization through the recurrent interaction of episodic memories: A model of the hippocampal system",
  authors: "Kumaran D, McClelland JL",
  year: 2012,
  publication: "Psychological Review 119(3): 573–616",
};

const VAN_KESTEREN_2012: SpiralSourceRef = {
  id: "van-kesteren-2012",
  title: "How schema and novelty augment memory formation",
  authors: "van Kesteren MTR, Ruiter DJ, Fernández G, Henson RN",
  year: 2012,
  publication: "Trends in Neurosciences 35(4): 211–219",
};

const SEVENSTER_2013: SpiralSourceRef = {
  id: "sevenster-2013",
  title: "Prediction error governs pharmacologically induced amnesia for learned fear",
  authors: "Sevenster D, Beckers T, Kindt M",
  year: 2013,
  publication: "Science 339: 830–833",
};

const KINDT_SOETER_2013: SpiralSourceRef = {
  id: "kindt-soeter-2013",
  title: "Reconsolidation in a human fear conditioning study: A test of extinction as updating mechanism",
  authors: "Kindt M, Soeter M",
  year: 2013,
  publication: "Biological Psychology 92(1): 43–50",
  doi: "10.1016/j.biopsycho.2011.09.016",
};

const SEVENSTER_2014: SpiralSourceRef = {
  id: "sevenster-2014",
  title: "Prediction error demarcates the transition from retrieval, to reconsolidation, to new learning",
  authors: "Sevenster D, Beckers T, Kindt M",
  year: 2014,
  publication: "Learning & Memory 21(11): 580–584",
  doi: "10.1101/lm.035493.114",
};

const MERLO_2014: SpiralSourceRef = {
  id: "merlo-2014",
  title:
    "Reconsolidation and extinction are dissociable and mutually exclusive processes: Behavioral and molecular evidence",
  authors: "Merlo E, Milton AL, Goozée ZY, Theobald DE, Everitt BJ",
  year: 2014,
  publication: "Journal of Neuroscience 34(7): 2422–2431",
  doi: "10.1523/JNEUROSCI.4001-13.2014",
};

const SCHLICHTING_2015: SpiralSourceRef = {
  id: "schlichting-2015",
  title:
    "Learning-related representational changes reveal dissociable integration and separation signatures in the hippocampus and prefrontal cortex",
  authors: "Schlichting ML, Mumford JA, Preston AR",
  year: 2015,
  publication: "Nature Communications 6: 8151",
  doi: "10.1038/ncomms9151",
};

const FERNANDEZ_2016: SpiralSourceRef = {
  id: "fernandez-2016",
  title: "The fate of memory: Reconsolidation and the case of prediction error",
  authors: "Fernández RS, Boccia MM, Pedreira ME",
  year: 2016,
  publication: "Neuroscience & Biobehavioral Reviews 68: 423–441",
};

const HARDWICKE_2016: SpiralSourceRef = {
  id: "hardwicke-2016",
  title: "Postretrieval new learning does not reliably induce human memory updating via reconsolidation",
  authors: "Hardwicke TE, Taqi M, Shanks DR",
  year: 2016,
  publication: "Proceedings of the National Academy of Sciences 113(19): 5206–5211",
  doi: "10.1073/pnas.1601440113",
};

const GERSHMAN_2017: SpiralSourceRef = {
  id: "gershman-2017",
  title: "The computational nature of memory modification",
  authors: "Gershman SJ, Monfils MH, Norman KA, Niv Y",
  year: 2017,
  publication: "eLife 6: e23763",
};

const SCHROYENS_2017: SpiralSourceRef = {
  id: "schroyens-2017",
  title: "In search for boundary conditions of reconsolidation: A failure of fear memory interference",
  authors: "Schroyens N, Beckers T, Kindt M",
  year: 2017,
  publication: "Frontiers in Behavioral Neuroscience 11: 65",
  doi: "10.3389/fnbeh.2017.00065",
};

const SCULLY_2017: SpiralSourceRef = {
  id: "scully-2017",
  title: "Does reactivation trigger episodic memory change? A meta-analysis",
  authors: "Scully ID, Napper LE, Hupbach A",
  year: 2017,
  publication: "Neurobiology of Learning and Memory 142: 99–107",
  doi: "10.1016/j.nlm.2016.12.012",
};

const ELSEY_2018: SpiralSourceRef = {
  id: "elsey-2018",
  title: "Human memory reconsolidation: A guiding framework and critical review of the evidence",
  authors: "Elsey JWB, Van Ast VA, Kindt M",
  year: 2018,
  publication: "Psychological Bulletin 144(8): 797–848",
};

const SINCLAIR_BARENSE_2019: SpiralSourceRef = {
  id: "sinclair-barense-2019",
  title: "Prediction error and memory reactivation: How incomplete reminders drive reconsolidation",
  authors: "Sinclair AH, Barense MD",
  year: 2019,
  publication: "Trends in Neurosciences 42(10): 727–739",
};

const CHALKIA_2020: SpiralSourceRef = {
  id: "chalkia-2020",
  title:
    "No persistent attenuation of fear memories in humans: A registered replication of the reactivation-extinction effect",
  authors:
    "Chalkia A, Schroyens N, Leng L, Vanhasbroeck N, Zenses AK, Van Oudenhove L, Beckers T",
  year: 2020,
  publication: "Cortex",
  url: "https://pubmed.ncbi.nlm.nih.gov/32580869",
};

const SINCLAIR_2021: SpiralSourceRef = {
  id: "sinclair-2021",
  title: "Prediction errors disrupt hippocampal representations and update episodic memories",
  authors: "Sinclair AH, Manalili GM, Brunec IK, Adcock RA, Barense MD",
  year: 2021,
  publication: "Proceedings of the National Academy of Sciences 118(51): e2117625118",
  doi: "10.1073/pnas.2117625118",
};

const cite = (source: SpiralSourceRef, supports: string): SpiralSourceRef => ({
  ...source,
  supports,
});

export const MEMORY_UPDATING_TRAJECTORY: SpiralTrajectory = {
  id: "memory-updating-prediction-error",
  lensId: "psychology",
  title: "Memory updating under prediction error",
  shortTitle: "Memory updating",
  inPhrase: "memory updating",
  description:
    "A reactivated memory meets what actually happens. Whether it stays as it was, changes, or is joined by a separate memory depends on the mismatch and on the memory itself.",
  shape: "branching",
  evidenceStandard: "empirical",
  steps: [
    { id: "established", label: "Established memory" },
    { id: "reactivation", label: "Reminder reactivates the memory" },
    { id: "encounter", label: "Expectation meets current experience" },
    { id: "assessment", label: "Expected and actual compared" },
    { id: "stable", label: "Memory remains comparatively stable" },
    { id: "prediction-error", label: "Prediction error" },
    { id: "destabilized", label: "Memory destabilized" },
    { id: "new-information", label: "New information during lability" },
    { id: "modified", label: "Original memory modified" },
    { id: "restabilized", label: "Memory restabilized" },
    { id: "later-expression", label: "Later retrieval and expression" },
    { id: "separate", label: "Separate or competing memory" },
  ],
  transitions: [
    {
      id: "t-reactivate",
      from: "established",
      to: "reactivation",
      conditions:
        "A cue — often partial, or the context of the original learning — brings the memory from an inactive to an active state. Reactivation can occur without overt recall.",
      epistemicKinds: ["empirical-observation"],
      sources: [
        cite(LEWIS_1979, "Active and inactive memory states; a cue returns a memory to an active state."),
        cite(GISQUET_VERRIER_RICCIO_2012, "Cue-induced reactivation as a process in its own right, possible without behavioral output."),
        cite(SINCLAIR_BARENSE_2019, "Incomplete reminders as the typical route to reactivation."),
      ],
    },
    {
      id: "t-expect",
      from: "reactivation",
      to: "encounter",
      conditions:
        "The active memory supplies an expectation about what will happen next.",
      epistemicKinds: ["conceptual-framework", "empirical-observation"],
      sources: [
        cite(SINCLAIR_BARENSE_2019, "Reactivated memories generate predictions about what follows."),
        cite(FERNANDEZ_2016, "Retrieval places an expectation against current events."),
      ],
    },
    {
      id: "t-compare",
      from: "encounter",
      to: "assessment",
      conditions:
        "What happens is compared with what was expected. Prediction error names the difference between them.",
      epistemicKinds: ["conceptual-framework", "empirical-observation"],
      sources: [
        cite(RESCORLA_WAGNER_1972, "Prediction error as the discrepancy between expected and obtained outcomes. Framework."),
        cite(SEVENSTER_2013, "Retrieval-induced change in outcome expectancy used as a behavioral index of prediction error in humans."),
      ],
    },
    {
      id: "t-match",
      from: "assessment",
      to: "stable",
      outcome: "continues",
      conditions:
        "Events match the expectation. The memory is retrieved but, in these studies, does not become susceptible to change.",
      epistemicKinds: ["empirical-observation"],
      sources: [
        cite(SEVENSTER_2013, "Without prediction error at retrieval, post-retrieval propranolol left fear memory intact."),
        cite(SEVENSTER_2014, "A reminder producing no prediction error did not open the memory to change."),
        cite(PEDREIRA_2004, "Cross-species (crab): reconsolidation followed only a mismatch between expected and actual events."),
      ],
    },
    {
      id: "t-mismatch",
      from: "assessment",
      to: "prediction-error",
      conditions:
        "Events depart from the expectation — an expected outcome is omitted or added, or a familiar episode is interrupted before its expected end.",
      epistemicKinds: ["empirical-observation"],
      sources: [
        cite(SEVENSTER_2013, "An omitted expected outcome during retrieval produced prediction error."),
        cite(SINCLAIR_2021, "Interrupting familiar narratives before expected endings produced mnemonic prediction errors."),
        cite(PEDREIRA_2004, "Cross-species (crab): mismatch between expected and actual events."),
      ],
    },
    {
      id: "t-resist",
      from: "prediction-error",
      to: "stable",
      outcome: "continues",
      conditions:
        "A mismatch is present, yet the memory does not become labile. Reported conditions include strong, old, or dominant memories and intermediate amounts of exposure; some expected destabilizations have simply not appeared.",
      epistemicKinds: ["empirical-observation", "contested-interpretation"],
      sources: [
        cite(EISENBERG_2003, "Cross-species (rat, medaka): dominant memories resisted change after retrieval."),
        cite(MILEKIC_ALBERINI_2002, "Cross-species (rat): older memories became less sensitive to post-reactivation interference."),
        cite(MERLO_2014, "Cross-species (rat): intermediate cue exposure left the memory in a “limbo” state, neither reconsolidating nor extinguishing."),
        cite(SCHROYENS_2017, "Human fear memory was not impaired by post-reactivation propranolol under conditions expected to destabilize it."),
      ],
    },
    {
      id: "t-destabilize",
      from: "prediction-error",
      to: "destabilized",
      conditions:
        "A limited mismatch, within boundary conditions such as memory strength and age, is followed by a period in which the memory is susceptible to change. In humans this lability is inferred from the effect of later interventions, not observed directly.",
      epistemicKinds: ["empirical-observation", "empirical-mechanism", "contested-interpretation"],
      sources: [
        cite(SEVENSTER_2013, "Post-retrieval propranolol reduced fear expression only when retrieval included prediction error."),
        cite(SEVENSTER_2014, "A single prediction error enabled change; prediction error was necessary but not sufficient."),
        cite(SINCLAIR_2021, "Circuit scale: prediction errors disrupted sustained hippocampal patterns, and the disruption predicted later updating."),
        cite(NADER_2000, "Cross-species (rat), synaptic scale: a retrieved fear memory required amygdala protein synthesis to persist."),
      ],
    },
    {
      id: "t-separate",
      from: "prediction-error",
      to: "separate",
      conditions:
        "A larger or repeated mismatch, or one that signals a different situation, leads to a new memory — extinction, for example — that coexists and competes with the original rather than changing it.",
      epistemicKinds: ["empirical-observation", "empirical-mechanism", "contested-interpretation"],
      sources: [
        cite(SEVENSTER_2014, "Multiple prediction errors at retrieval initiated new learning instead of reconsolidation."),
        cite(SUZUKI_2004, "Cross-species (mouse): longer re-exposure engaged extinction rather than reconsolidation."),
        cite(MERLO_2014, "Cross-species (rat): reconsolidation and extinction were mutually exclusive outcomes of retrieval."),
        cite(BOUTON_2004, "Extinction as new, context-dependent learning that leaves the original association in place."),
        cite(GERSHMAN_2017, "Model: mismatch may be attributed to a new latent cause, producing a new memory rather than modifying the old one."),
      ],
    },
    {
      id: "t-window",
      from: "destabilized",
      to: "new-information",
      conditions:
        "New information arrives while the memory is labile — a window reported as minutes to hours after reactivation.",
      epistemicKinds: ["empirical-observation"],
      sources: [
        cite(HUPBACH_2007, "New learning shortly after a reminder entered the original episodic memory."),
        cite(NADER_HARDT_2009, "Review of the post-retrieval window of lability."),
        cite(LEE_2009, "Review: lability allows retrieved memories to take in new information."),
      ],
    },
    {
      id: "t-restabilize-unchanged",
      from: "destabilized",
      to: "restabilized",
      outcome: "recovery",
      conditions:
        "Nothing is incorporated. Without an intervention or new information, the memory returns to stable storage without measurable change.",
      epistemicKinds: ["empirical-observation"],
      sources: [
        cite(KINDT_2009, "Placebo after reactivation left the fear memory intact."),
        cite(SEVENSTER_2013, "Reactivation with placebo left fear expression unchanged."),
      ],
    },
    {
      id: "t-incorporate",
      from: "new-information",
      to: "modified",
      conditions:
        "New content appears within the original memory at later recall. Whether it has joined that memory or is retrieved alongside it is disputed.",
      epistemicKinds: ["empirical-observation", "contested-interpretation"],
      sources: [
        cite(HUPBACH_2007, "After a reminder, new items intruded asymmetrically into recall of the original list."),
        cite(SCULLY_2017, "Meta-analysis: new learning after reactivation reliably increased intrusions into the original memory."),
        cite(HARDWICKE_2016, "Post-retrieval new learning did not reliably update human memory."),
        cite(SEDERBERG_2011, "Alternative account: contextual reinstatement explains the intrusions without a reconsolidation process."),
      ],
    },
    {
      id: "t-coexist",
      from: "new-information",
      to: "separate",
      conditions:
        "New content is kept as a separate memory. The original persists and its response can return later.",
      epistemicKinds: ["empirical-observation", "contested-interpretation"],
      sources: [
        cite(KINDT_SOETER_2013, "Extinction within the reconsolidation window did not prevent the return of fear."),
        cite(CHALKIA_2020, "Registered replication: reactivation before extinction did not prevent the return of fear."),
        cite(HARDWICKE_2016, "New learning after retrieval did not reliably modify the original memory."),
        cite(BOUTON_2004, "The original association survives extinction and can return."),
      ],
    },
    {
      id: "t-restabilize",
      from: "modified",
      to: "restabilized",
      conditions:
        "The modified memory returns to stable storage. Whether a distinct restabilization process is required is disputed.",
      epistemicKinds: ["empirical-mechanism", "contested-interpretation"],
      sources: [
        cite(NADER_2000, "Cross-species (rat), synaptic scale: persistence after retrieval required new protein synthesis."),
        cite(HUPBACH_2007, "Intrusions were present at a test 48 hours later."),
        cite(GISQUET_VERRIER_RICCIO_2012, "Counter-view: updating may occur during reactivation itself, without restabilization."),
      ],
    },
    {
      id: "t-express",
      from: "restabilized",
      to: "later-expression",
      conditions:
        "What the memory later expresses depends on the delay, the context of the test, and the measure used.",
      epistemicKinds: ["empirical-observation"],
      sources: [
        cite(KINDT_2009, "Startle responses changed while outcome expectancy did not."),
        cite(ELSEY_2018, "Review: outcomes of human reconsolidation studies vary with measure and protocol."),
      ],
    },
  ],
  concepts: [
    {
      id: "psy-cmp-destabilization",
      title: "Destabilization, not surprise itself",
      summary:
        "Prediction error is a condition. What may resemble Disruption is the memory becoming labile — and only at the scale of one memory.",
      epistemicKinds: ["empirical-observation", "empirical-mechanism", "contested-interpretation"],
      sections: [
        {
          id: "psy-cmp-ds-compared",
          kind: "summary",
          title: "What is compared",
          items: [
            "Variable: whether the original memory becomes susceptible to change after reactivation, inferred from later expression against a no-reactivation control.",
            "Reference: Disruption — stress, novelty, failure, or intrusion that the existing organization cannot assimilate unchanged.",
            "Window: the minutes to hours after a reminder.",
            "Scale: one memory representation within one person.",
          ],
        },
        {
          id: "psy-cmp-ds-condition",
          kind: "general",
          title: "Condition and operation",
          items: [
            "Prediction error is the mismatch between what the memory leads one to expect and what happens. It is a condition, and it carries no comparison here.",
            "Destabilization is the memory losing its stable state. That is where the resemblance to Disruption is read.",
            "Many prediction errors destabilize nothing: the memory may stay stable, or a separate memory may form instead.",
          ],
        },
        {
          id: "psy-cmp-ds-evidence",
          kind: "pattern",
          title: "Evidence",
          items: [
            "Post-retrieval propranolol reduced human fear expression only when retrieval included a prediction error (Sevenster et al. 2013).",
            "One prediction error opened the memory to change; several led to new learning instead (Sevenster et al. 2014).",
            "Circuit scale: prediction errors disrupted sustained hippocampal patterns, and the degree of disruption predicted later updating (Sinclair et al. 2021).",
            "Cross-species (rat), synaptic scale: a retrieved fear memory needed amygdala protein synthesis to persist (Nader et al. 2000). Not observed in adult human memory.",
          ],
        },
        {
          id: "psy-cmp-ds-why",
          kind: "what-changes",
          title: "Why it may resemble Disruption",
          body: "Disruption names pressure that an existing organization cannot take in unchanged. When a mismatch is followed by destabilization, the memory has not absorbed it as it was; for a time it can be altered. The resemblance is to the destabilization, not to the surprise that preceded it.",
        },
        {
          id: "psy-cmp-ds-limits",
          kind: "epistemic-status",
          title: "Limits",
          items: [
            "Scale: for the broader memory system, destabilization may be an ordinary, regulated way of keeping memories relevant (Lee 2009). At that scale it would not be Disruption. This comparison is read for one memory representation only.",
            "In humans, destabilization is inferred from the effect of an intervention given afterward; it is not observed directly.",
            "Null results are hard to read: no effect may mean no destabilization, or an intervention that failed (Elsey et al. 2018; Schroyens et al. 2017).",
            "Labile is not damaged. Destabilization opens a memory to change; it does not by itself harm it.",
            "This comparison stands on its own evidence and does not trace the Spiral's sequence.",
          ],
        },
      ],
      comparisonBreaks: {
        title: "What would weaken it",
        body: "If destabilization in humans proved to be a measurement artefact of intervention studies, or if prediction error routinely changed memories without any period of lability, the resemblance would weaken.",
      },
      sources: [
        cite(SEVENSTER_2013, "Prediction error governs post-retrieval amnesia for human fear."),
        cite(SEVENSTER_2014, "Prediction error necessary but not sufficient; multiple errors lead to new learning."),
        cite(SINCLAIR_2021, "Hippocampal pattern disruption after prediction error predicted updating."),
        cite(NADER_2000, "Cross-species (rat): protein-synthesis dependence after retrieval."),
        cite(LEE_2009, "Reconsolidation as maintenance of memory relevance."),
        cite(ELSEY_2018, "Critical review of human reconsolidation evidence."),
        cite(SCHROYENS_2017, "An expected destabilization that did not appear."),
      ],
    },
    {
      id: "psy-cmp-incorporation",
      title: "Joined, or retrieved together?",
      summary:
        "Later recall can look as though new information was incorporated into the original memory. Separate but linked memories can produce the same result, so the reading is held open.",
      epistemicKinds: ["empirical-observation", "contested-interpretation"],
      sections: [
        {
          id: "psy-cmp-in-compared",
          kind: "summary",
          title: "What is compared",
          items: [
            "Variable: what recall of the original memory contains after new information is learned during lability.",
            "Reference: Integration — reorganized elements becoming coherent enough to function together again, not as a temporary patch.",
            "Window: tests from about a day to 48 hours after the new learning.",
            "Scale: one memory representation within one person.",
          ],
        },
        {
          id: "psy-cmp-in-evidence",
          kind: "pattern",
          title: "Evidence for incorporation",
          items: [
            "After a reminder, newly learned items intruded into recall of the original list, but not the reverse (Hupbach et al. 2007).",
            "Across studies, new learning after reactivation reliably increased intrusions into the original memory (Scully et al. 2017, meta-analysis).",
            "Circuit scale, in a different task: some brain regions integrate related memories while others keep them separate, and integration is likelier when the earlier memory is established (Schlichting et al. 2015).",
          ],
        },
        {
          id: "psy-cmp-in-alternatives",
          kind: "comparison-breaks",
          title: "Why the reading stays open",
          items: [
            "Reinstating the original context can bind new items to it, producing the same asymmetric intrusions without any change to the original memory (Sederberg et al. 2011).",
            "Separate memories that interact at retrieval can yield behavior that looks integrated (Kumaran & McClelland 2012, model).",
            "Source confusion was proposed and tested as an explanation (Hupbach et al. 2009).",
            "Post-retrieval new learning did not reliably update memory in a set of preregistered human experiments (Hardwicke et al. 2016).",
          ],
        },
        {
          id: "psy-cmp-in-why",
          kind: "what-changes",
          title: "Why it may resemble Integration",
          body: "If new content has joined the original memory, the destabilized memory and the new content now function as one representation at later recall — a re-coherence, not a patch. If they are instead two memories retrieved together, nothing has been incorporated. The evidence does not yet decide between these readings, so the comparison is drawn as ambiguous.",
        },
        {
          id: "psy-cmp-in-limits",
          kind: "epistemic-status",
          title: "Limits",
          items: [
            "Incorporation is one possibility on this trajectory, not its goal. Persistence, restabilization without change, and separate memories are equally real outcomes.",
            "Incorporation can also happen without prediction-error-driven destabilization: information consistent with an existing schema can be assimilated directly (Tse et al. 2007; van Kesteren et al. 2012). Integration is read here, not required here.",
            "A test that would help: if the original memory is disrupted, does the incorporated content go with it?",
          ],
        },
      ],
      sources: [
        cite(HUPBACH_2007, "Asymmetric intrusions after a reminder."),
        cite(SCULLY_2017, "Meta-analysis of reactivation-induced episodic change."),
        cite(SCHLICHTING_2015, "Integration and separation signatures in different regions."),
        cite(SEDERBERG_2011, "Temporal context model explains intrusions without reconsolidation."),
        cite(KUMARAN_MCCLELLAND_2012, "Model: integrated-looking behavior from interacting separate memories."),
        cite(HUPBACH_2009, "Updating or source confusion."),
        cite(HARDWICKE_2016, "Updating not reliably induced."),
        cite(TSE_2007, "Cross-species (rat): schema-consistent information assimilated rapidly."),
        cite(VAN_KESTEREN_2012, "Schema congruence and novelty shape how new information is encoded."),
      ],
    },
    {
      id: "psy-cmp-restabilization",
      title: "Restabilization is not Renewal",
      summary:
        "A labile memory returning to stable storage shows persistence. It happens whether or not the memory changed.",
      epistemicKinds: ["empirical-mechanism", "conceptual-framework"],
      sections: [
        {
          id: "psy-cmp-rs-compared",
          kind: "summary",
          title: "What is compared",
          items: [
            "Variable: whether the memory is again stable — no longer susceptible to change.",
            "Reference: Renewal — a reorganized system stabilizing enough to continue forward with altered capacity.",
            "Scale: one memory representation within one person.",
          ],
        },
        {
          id: "psy-cmp-rs-why",
          kind: "what-persists",
          title: "Why the comparison breaks",
          items: [
            "Restabilization happens whether or not the memory changed: modified and unmodified memories both restabilize.",
            "It restores stable storage — persistence — not an altered capacity.",
            "Any modification happened before restabilization, at the point where new content was or was not incorporated.",
          ],
        },
        {
          id: "psy-cmp-rs-terms",
          kind: "epistemic-status",
          title: "Two meanings of “renewal”",
          items: [
            "In extinction research, the “renewal effect” is the return of an extinguished response when the context changes (Bouton 2004). It is unrelated to the Spiral's Renewal.",
            "Whether a distinct restabilization process exists at all is disputed (Gisquet-Verrier & Riccio 2012).",
          ],
        },
      ],
      sources: [
        cite(NADER_2000, "Cross-species (rat): persistence after retrieval required protein synthesis."),
        cite(GISQUET_VERRIER_RICCIO_2012, "Updating without restabilization."),
        cite(BOUTON_2004, "The renewal effect in extinction research."),
      ],
    },
    {
      id: "psy-boundary-conditions",
      title: "When a reminder changes nothing",
      summary:
        "Retrieval, destabilization and new learning each have conditions. A mismatch is necessary for destabilization, but not sufficient.",
      epistemicKinds: ["empirical-observation", "empirical-mechanism"],
      sections: [
        {
          id: "psy-bc-items",
          kind: "pattern",
          title: "Reported boundary conditions",
          items: [
            "No mismatch: the memory is retrieved and stays stable (Sevenster et al. 2013).",
            "Too much mismatch: new learning, such as extinction, begins instead (Sevenster et al. 2014; Suzuki et al. 2004, cross-species).",
            "In between: a state in which neither reconsolidation nor extinction is engaged (Merlo et al. 2014, cross-species).",
            "Strong, old, or dominant memories resist change (Eisenberg et al. 2003; Milekic & Alberini 2002, cross-species).",
            "Contextual novelty and learning history interact with all of these, and some expected effects have not appeared (Schroyens et al. 2017).",
          ],
        },
      ],
      sources: [
        cite(SEVENSTER_2013, "No prediction error, no change."),
        cite(SEVENSTER_2014, "Multiple prediction errors lead to new learning."),
        cite(SUZUKI_2004, "Cross-species (mouse): exposure length separates reconsolidation from extinction."),
        cite(MERLO_2014, "Cross-species (rat): limbo state between reconsolidation and extinction."),
        cite(EISENBERG_2003, "Cross-species: trace dominance."),
        cite(MILEKIC_ALBERINI_2002, "Cross-species (rat): memory age."),
        cite(SCHROYENS_2017, "Boundary conditions that did not behave as expected."),
      ],
    },
    {
      id: "psy-inference-limits",
      title: "What the evidence can and cannot show",
      summary:
        "Human destabilization is inferred, replications have failed, measures disagree, and other accounts explain some results.",
      epistemicKinds: ["empirical-observation", "contested-interpretation"],
      sections: [
        {
          id: "psy-il-inference",
          kind: "epistemic-status",
          title: "Inferred, not observed",
          body: "In human studies a memory is judged to have been destabilized when an intervention given after reactivation changes what it later expresses. A null result can mean the memory never destabilized, or that the intervention failed (Elsey et al. 2018).",
        },
        {
          id: "psy-il-replication",
          kind: "epistemic-status",
          title: "Replication",
          items: [
            "A preregistered, high-powered replication found no lasting benefit of reactivation before extinction (Chalkia et al. 2020). The authors also report misreporting in the original study.",
            "Extinction within the reconsolidation window did not prevent the return of fear on several measures (Kindt & Soeter 2013).",
            "Post-retrieval new learning did not reliably update human memory (Hardwicke et al. 2016).",
          ],
        },
        {
          id: "psy-il-measures",
          kind: "epistemic-status",
          title: "Measures disagree",
          body: "Startle, skin conductance and outcome expectancy can move independently: one study found startle changed while expectancy did not (Kindt et al. 2009).",
        },
        {
          id: "psy-il-alternatives",
          kind: "epistemic-status",
          title: "Other accounts",
          items: [
            "Contextual reinstatement explains episodic intrusions without reconsolidation (Sederberg et al. 2011).",
            "Updating may occur during reactivation itself, without restabilization (Gisquet-Verrier & Riccio 2012).",
            "Whether a mismatch modifies an old memory or creates a new one may depend on how it is attributed (Gershman et al. 2017, model).",
          ],
        },
      ],
      sources: [
        cite(ELSEY_2018, "How human reconsolidation is inferred, and its pitfalls."),
        cite(CHALKIA_2020, "Registered replication failure."),
        cite(KINDT_SOETER_2013, "Failure to prevent return of fear."),
        cite(HARDWICKE_2016, "Updating not reliably induced."),
        cite(KINDT_2009, "Dissociation between measures."),
        cite(SEDERBERG_2011, "Alternative account of intrusions."),
        cite(GISQUET_VERRIER_RICCIO_2012, "Reactivation effects independent of reconsolidation."),
        cite(GERSHMAN_2017, "Latent-cause model of memory modification."),
      ],
    },
    {
      id: "psy-scale",
      title: "Which scale this follows",
      summary:
        "One memory representation within one person, read through later retrieval. Evidence from other scales is labelled.",
      epistemicKinds: ["conceptual-framework"],
      sections: [
        {
          id: "psy-scale-readings",
          kind: "general",
          title: "Different descriptions, not a hierarchy",
          body: "This trajectory follows one memory, observed through what it later expresses. Other scales appear in the evidence:",
          items: [
            "Synaptic and cellular: mechanisms of lability and persistence, almost entirely from animal studies (cross-species).",
            "Neural circuit: hippocampal and prefrontal correlates of prediction error, integration and separation, measured with brain imaging.",
            "Behavior: the measure — recall, expectancy, startle — not the system itself.",
            "Subjective experience: not tracked here.",
            "Whole-person identity: outside this trajectory. Nothing here makes a claim about who a person is.",
          ],
        },
      ],
      sources: [
        cite(NADER_2000, "Cross-species synaptic evidence."),
        cite(SINCLAIR_2021, "Circuit-scale evidence."),
        cite(SCHLICHTING_2015, "Circuit-scale integration and separation."),
      ],
    },
    {
      id: "psy-terms",
      title: "Terms on this trajectory",
      summary:
        "Modification, persistence and separate memory are used in narrow senses. Some tempting terms are deliberately not used.",
      epistemicKinds: ["conceptual-framework"],
      sections: [
        {
          id: "psy-terms-used",
          kind: "general",
          title: "Used here",
          items: [
            "Destabilized: susceptible to change after reactivation, as inferred from later expression.",
            "Modified: what the original memory later expresses differs, in content or expectancy, from before.",
            "Separate memory: a new memory, such as extinction, that coexists and competes with the original.",
            "Restabilized: no longer susceptible to change.",
          ],
        },
        {
          id: "psy-terms-not-used",
          kind: "epistemic-status",
          title: "Not used here",
          items: [
            "Erased, corrected, successful or failed: these imply a goal the memory does not have.",
            "Renewal effect: in extinction research, the return of a response in a new context (Bouton 2004). Not the Spiral's Renewal.",
            "Memory transformation: in systems-consolidation research, episodic memory becoming more gist-like over time (Winocur & Moscovitch 2011). Not the Spiral's Transformation.",
            "Transformation: no comparison is drawn. Changed content or behavior does not show that the processes keeping memories organized have themselves changed. That is not a finding that Transformation is absent.",
          ],
        },
      ],
      sources: [
        cite(BOUTON_2004, "The renewal effect."),
        cite(WINOCUR_MOSCOVITCH_2011, "Memory transformation in systems consolidation."),
      ],
    },
    {
      id: "psy-history",
      title: "History shapes what counts as surprise",
      summary:
        "Because prediction error is measured against expectation, each stored outcome changes what the next encounter can be.",
      epistemicKinds: ["conceptual-framework"],
      sections: [
        {
          id: "psy-history-note",
          kind: "general",
          title: "A research note",
          body: "Prior organization shapes a prediction; an encounter meets it; congruence or discrepancy leads to persistence, separation or modification; the stored result shapes the next prediction. The outputs of one state can become conditions for subsequent states. History changes how the system receives what comes next.",
          items: [
            "Prediction error is defined against expectation, so a changed memory changes what will count as a mismatch.",
            "A memory's strength, age and dominance — products of its history — are themselves conditions on whether it can change (Eisenberg et al. 2003; Milekic & Alberini 2002, cross-species).",
            "Prior knowledge shapes how new information is encoded (van Kesteren et al. 2012; Tse et al. 2007, cross-species).",
          ],
        },
        {
          id: "psy-history-limits",
          kind: "epistemic-status",
          title: "What this note does not claim",
          items: [
            "It is not drawn as a loop. The trajectory does not return to its start.",
            "It is not a Spiral operation.",
            "It says nothing about creation as a mechanism through which reality unfolds. The memory literature does not address that question.",
          ],
        },
      ],
      sources: [
        cite(VAN_KESTEREN_2012, "Schema and novelty shape encoding."),
        cite(TSE_2007, "Cross-species (rat): schemas speed assimilation."),
        cite(EISENBERG_2003, "Cross-species: trace dominance."),
      ],
    },
  ],
  framing:
    "An empirical trajectory from human and animal research on memory reconsolidation, prediction error and extinction. It follows one memory representation within one person, read through what that memory later expresses.\n\nSteps are states of that memory, not Spiral operations. Each edge carries its own conditions and sources. Conditions describe what studies report, not guaranteed causes.\n\nIn humans, destabilization is inferred from the effect of interventions given after reactivation; it is not observed directly. Animal and synaptic evidence is labelled cross-species wherever it appears.\n\nThe graph ends at three open steps — a memory that stays comparatively stable, a separate or competing memory, and later retrieval — because the authored evidence ends there. None of them is a goal.",
  provenanceNote:
    "Reviewed in the Phase 3A authoring report. Human fear-conditioning and episodic-memory studies carry the trajectory; animal studies supply mechanism and are labelled cross-species.",
  researchIssues: [
    {
      id: "psy-open-ends",
      question: "Why does the graph end at three steps?",
      body: "Each marks where authored evidence stops, not a final state.",
      items: [
        "Memory remains comparatively stable: it can be reactivated again later.",
        "Separate or competing memory: later behavior depends on which memory is retrieved, and the original response can return.",
        "Later retrieval and expression: what is expressed depends on delay, context and measure.",
      ],
    },
    {
      id: "psy-not-a-sequence",
      question: "Is this the sequence every memory follows?",
      body: "No. Retrieval does not automatically destabilize a memory, destabilization does not guarantee modification, and modification does not guarantee incorporation. Changed behavior can have other explanations than reconsolidation.",
    },
  ],
  openQuestions: [
    "When a memory changes, what makes it the same memory?",
    "Can behavior distinguish one modified memory from two memories retrieved together?",
    "Is destabilization a disruption of a memory, or the ordinary way a memory system keeps itself current?",
    "Which scale should a comparison speak for: one memory, or the system that maintains many?",
  ],
  comparisonBreaks: {
    title: "Cautions before any comparison",
    body: "Retrieval is not reconsolidation. Most reminders change nothing.\n\nPrediction error is a condition, not an outcome, and not by itself a Spiral operation.\n\nNew learning does not necessarily replace the original memory. Extinction leaves it in place.\n\nIncorporation is one possibility among several, not the trajectory's goal.\n\nHuman destabilization is inferred, replications have failed, and other accounts explain some results.\n\nThe same event reads differently at the scale of one memory and of the memory system.",
  },
  sources: [
    LEWIS_1979,
    RESCORLA_WAGNER_1972,
    NADER_2000,
    MILEKIC_ALBERINI_2002,
    EISENBERG_2003,
    PEDREIRA_2004,
    SUZUKI_2004,
    BOUTON_2004,
    HUPBACH_2007,
    TSE_2007,
    KINDT_2009,
    LEE_2009,
    NADER_HARDT_2009,
    HUPBACH_2009,
    SEDERBERG_2011,
    WINOCUR_MOSCOVITCH_2011,
    GISQUET_VERRIER_RICCIO_2012,
    KUMARAN_MCCLELLAND_2012,
    VAN_KESTEREN_2012,
    SEVENSTER_2013,
    KINDT_SOETER_2013,
    SEVENSTER_2014,
    MERLO_2014,
    SCHLICHTING_2015,
    FERNANDEZ_2016,
    HARDWICKE_2016,
    GERSHMAN_2017,
    SCHROYENS_2017,
    SCULLY_2017,
    ELSEY_2018,
    SINCLAIR_BARENSE_2019,
    CHALKIA_2020,
    SINCLAIR_2021,
  ],
};
