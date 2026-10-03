/**
 * Transformation stage — deep exploration packet (M1C hierarchy).
 *
 * Concept titles follow the M1B-R research dossier as architecture proof only.
 * Bodies are placeholders — do not treat as researched claims.
 * One Biology concept reuses an already-authored Phase 1 seed summary.
 */

import type { SpiralStageExploration } from "../types";

const PH =
  "Placeholder structure for future research. Not an authored claim.";

const diveScaffold = (prefix: string) =>
  [
    {
      id: `${prefix}-summary`,
      kind: "summary" as const,
      title: "Summary",
      body: PH,
      placeholder: true,
    },
    {
      id: `${prefix}-pattern`,
      kind: "pattern" as const,
      title: "Pattern",
      body: PH,
      placeholder: true,
    },
    {
      id: `${prefix}-persists`,
      kind: "what-persists" as const,
      title: "What persists",
      body: PH,
      placeholder: true,
    },
    {
      id: `${prefix}-changes`,
      kind: "what-changes" as const,
      title: "What changes",
      body: PH,
      placeholder: true,
    },
    {
      id: `${prefix}-examples`,
      kind: "examples" as const,
      title: "Examples",
      body: PH,
      placeholder: true,
    },
  ] as const;

export const TRANSFORMATION_EXPLORATION: SpiralStageExploration = {
  stageId: "transformation",
  lenses: [
    {
      lensId: "systems",
      framing:
        "A structural reading of Transformation as reorganization under pressure — without assigning it to a single scientific domain.",
      concepts: [
        {
          id: "sys-thresholds-regime-shifts",
          title: "Thresholds & regime shifts",
          summary:
            "When ordinary fluctuation gives way to a change of attractor — scaffold only.",
          epistemicKind: "hypothesis",
          placeholder: true,
          sections: [...diveScaffold("sys-thresh")],
          sources: [
            {
              id: "sys-thresh-src-1",
              title: "Sources reserved",
              supports: "Citations to be attached only when authored.",
              placeholder: true,
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "A systems threshold is not automatically a biological, psychological, or theological event.",
            placeholder: true,
          },
          openQuestions: [
            "How sharp must a threshold be before the pattern earns this name?",
          ],
        },
        {
          id: "sys-hysteresis",
          title: "Hysteresis",
          summary:
            "History constrains return — reversing a driver may not restore the prior path.",
          epistemicKind: "hypothesis",
          placeholder: true,
          sections: [...diveScaffold("sys-hyst")],
          comparisonBreaks: {
            body: "Hysteresis is a dynamical property, not a moral or spiritual lesson.",
            placeholder: true,
          },
        },
        {
          id: "sys-adaptive-cycles",
          title: "Adaptive cycles",
          summary:
            "Release and reorganization as a heuristic — not a predictive clock.",
          epistemicKind: "hypothesis",
          placeholder: true,
          sections: [...diveScaffold("sys-adapt")],
          comparisonBreaks: {
            body: "The adaptive cycle is a useful metaphor with limits; it is not a universal law.",
            placeholder: true,
          },
        },
        {
          id: "sys-path-dependence",
          title: "Path dependence",
          summary:
            "What can emerge afterward is constrained by what came before.",
          epistemicKind: "hypothesis",
          placeholder: true,
          sections: [...diveScaffold("sys-path")],
          comparisonBreaks: {
            body: "Path dependence does not imply progress or destiny.",
            placeholder: true,
          },
        },
        {
          id: "sys-transformability",
          title: "Transformability",
          summary:
            "Capacity to become a different kind of system — distinct from resilience.",
          epistemicKind: "hypothesis",
          placeholder: true,
          sections: [...diveScaffold("sys-xform")],
          comparisonBreaks: {
            body: "Transformability is not improvement by definition.",
            placeholder: true,
          },
        },
      ],
      comparisonBreaks: {
        title: "Where the comparison breaks",
        body: "A systems pattern is not automatically a biological mechanism, a psychological process, or a theological claim.",
        placeholder: true,
      },
    },
    {
      lensId: "living-systems",
      framing:
        "Biological and organism-level readings. Distinct from symbolic or theological languages.",
      concepts: [
        {
          id: "bio-metamorphosis",
          title: "Metamorphosis",
          summary:
            "Programmed reorganization with lineage continuity — deep-dive scaffold.",
          epistemicKind: "empirical-mechanism",
          placeholder: true,
          sections: [
            {
              id: "bio-meta-summary",
              kind: "summary",
              title: "Summary",
              body: "Scaffold for holometabolous metamorphosis as continuity through structural change. Research notes not authored here.",
              placeholder: true,
            },
            {
              id: "bio-meta-mechanism",
              kind: "mechanism",
              title: "Mechanism",
              body: "Reserved for hormonal timing, tissue deletion/remodeling, and imaginal structures — only with sourced authorship.",
              placeholder: true,
            },
            {
              id: "bio-meta-persists",
              kind: "what-persists",
              title: "What persists",
              body: PH,
              placeholder: true,
            },
            {
              id: "bio-meta-changes",
              kind: "what-changes",
              title: "What changes",
              body: PH,
              placeholder: true,
            },
            {
              id: "bio-meta-examples",
              kind: "examples",
              title: "Examples",
              body: PH,
              placeholder: true,
            },
          ],
          sources: [
            {
              id: "bio-meta-src-1",
              title: "Sources reserved",
              placeholder: true,
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Biological metamorphosis is not evidence for theological resurrection or zodiac symbolism.",
            placeholder: true,
          },
          openQuestions: [
            "At which scale — cell, tissue, organism, lineage — is continuity best named?",
          ],
        },
        {
          id: "bio-autophagy",
          title: "Autophagy",
          summary:
            "Cellular renovation through selective self-digestion — scaffold.",
          epistemicKind: "empirical-mechanism",
          placeholder: true,
          sections: [...diveScaffold("bio-auto")],
          comparisonBreaks: {
            body: "Cellular recycling metaphors travel easily; mechanisms do not transfer to other lenses.",
            placeholder: true,
          },
        },
        {
          id: "bio-wound-remodeling",
          title: "Wound remodeling",
          summary:
            "Repair that may restore function without restoring identical prior tissue.",
          epistemicKind: "empirical-observation",
          placeholder: true,
          sections: [...diveScaffold("bio-wound")],
          comparisonBreaks: {
            body: "Healing is not guaranteed adaptation, and scarring is not failure of a spiral.",
            placeholder: true,
          },
        },
        {
          id: "bio-inheritance-variation",
          title: "Inheritance under variation",
          summary:
            "Populations persist by transmitting structure while admitting variation. Related to—but not replacing—the Adaptation Loop.",
          epistemicKind: "empirical-observation",
          sections: [
            {
              id: "bio-inh-summary",
              kind: "summary",
              title: "Summary",
              body: "Populations persist across generations by transmitting structure while admitting variation. Under sustained pressure, the means of staying organized can themselves shift. This is related to—but does not replace—the organism-level Adaptation Loop elsewhere in Living Terrain.",
            },
            {
              id: "bio-inh-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Inherited structure and lineage continuity — to be refined with sourced notes.",
              placeholder: true,
            },
            {
              id: "bio-inh-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Variation and, under pressure, the means of organization — scaffold.",
              placeholder: true,
            },
          ],
          comparisonBreaks: {
            body: "Population-level inheritance is a different scale from organismal metamorphosis or personal identity change.",
            placeholder: true,
          },
        },
      ],
      comparisonBreaks: {
        title: "Where the comparison breaks",
        body: "Biological process is not evidence for zodiac symbolism or theological narrative.",
        placeholder: true,
      },
    },
    {
      lensId: "psychology",
      framing:
        "Psychological and developmental readings — not interchangeable with biological mechanism.",
      concepts: [
        {
          id: "psy-reconsolidation",
          title: "Reconsolidation",
          summary:
            "Retrieval can open a memory to updating under specific conditions — scaffold.",
          epistemicKind: "empirical-mechanism",
          placeholder: true,
          sections: [
            {
              id: "psy-recon-summary",
              kind: "summary",
              title: "Summary",
              body: PH,
              placeholder: true,
            },
            {
              id: "psy-recon-mechanism",
              kind: "mechanism",
              title: "Mechanism",
              body: "Reserved for boundary-conditioned reconsolidation notes — not authored here.",
              placeholder: true,
            },
            {
              id: "psy-recon-persists",
              kind: "what-persists",
              title: "What persists",
              body: PH,
              placeholder: true,
            },
            {
              id: "psy-recon-changes",
              kind: "what-changes",
              title: "What changes",
              body: PH,
              placeholder: true,
            },
          ],
          comparisonBreaks: {
            body: "Memory updating is not erasure, and not a metaphor for ecological succession.",
            placeholder: true,
          },
        },
        {
          id: "psy-extinction",
          title: "Extinction learning",
          summary:
            "New inhibitory learning may suppress without destroying the original trace.",
          epistemicKind: "empirical-mechanism",
          placeholder: true,
          sections: [...diveScaffold("psy-ext")],
          comparisonBreaks: {
            body: "Apparent return of calm is not proof the prior association is gone.",
            placeholder: true,
          },
        },
        {
          id: "psy-belief-revision",
          title: "Model / belief revision",
          summary:
            "Internal models can reorganize while autobiography continues — scaffold.",
          epistemicKind: "hypothesis",
          placeholder: true,
          sections: [...diveScaffold("psy-belief")],
          comparisonBreaks: {
            body: "Revision is not necessarily growth.",
            placeholder: true,
          },
        },
        {
          id: "psy-grief-identity",
          title: "Grief & identity",
          summary:
            "Loss can reorganize belonging and self-narrative without promising improvement.",
          epistemicKind: "empirical-observation",
          placeholder: true,
          sections: [...diveScaffold("psy-grief")],
          comparisonBreaks: {
            body: "Grief is not an adaptive cycle by another name.",
            placeholder: true,
          },
        },
        {
          id: "psy-ptg-caution",
          title: "Post-traumatic growth — caution",
          summary:
            "A contested construct. Architecture holds space for critique, not inspirational claims.",
          epistemicKind: "hypothesis",
          placeholder: true,
          sections: [
            {
              id: "psy-ptg-summary",
              kind: "summary",
              title: "Summary",
              body: "Scaffold for treating post-traumatic growth as contested — perceived growth is not the same as measured change.",
              placeholder: true,
            },
            {
              id: "psy-ptg-breaks",
              kind: "comparison-breaks",
              title: "Where the comparison breaks",
              body: "Do not center Transformation on “trauma makes you stronger.”",
              placeholder: true,
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Self-reported growth after adversity is not established as reliable transformation.",
            placeholder: true,
          },
          openQuestions: [
            "What evidentiary bar should a psychological “transformation” claim meet here?",
          ],
        },
      ],
      comparisonBreaks: {
        title: "Where the comparison breaks",
        body: "A psychological transition is not proof of a biological law or a biblical typology.",
        placeholder: true,
      },
    },
    {
      lensId: "ecology",
      framing:
        "Ecological readings of disturbance and reorganization in communities and landscapes.",
      concepts: [
        {
          id: "eco-memory",
          title: "Ecological memory",
          summary:
            "Material and information legacies shape what can grow afterward.",
          epistemicKind: "empirical-observation",
          placeholder: true,
          sections: [...diveScaffold("eco-mem")],
          comparisonBreaks: {
            body: "Ecological memory is not psychological memory except by analogy.",
            placeholder: true,
          },
        },
        {
          id: "eco-disturbance-succession",
          title: "Disturbance & succession",
          summary:
            "After disruption, communities reassemble along historically constrained paths.",
          epistemicKind: "empirical-observation",
          placeholder: true,
          sections: [...diveScaffold("eco-succ")],
          comparisonBreaks: {
            body: "Succession is not spiritual ascent.",
            placeholder: true,
          },
        },
        {
          id: "eco-alt-stable-states",
          title: "Alternative stable states",
          summary:
            "More than one community configuration may be locally stable.",
          epistemicKind: "empirical-observation",
          placeholder: true,
          sections: [...diveScaffold("eco-alt")],
          comparisonBreaks: {
            body: "A new stable state may be degraded relative to the prior one.",
            placeholder: true,
          },
        },
        {
          id: "eco-recovery-reorg",
          title: "Recovery vs reorganization",
          summary:
            "Return toward a prior community is not the only post-disturbance outcome.",
          epistemicKind: "empirical-observation",
          placeholder: true,
          sections: [...diveScaffold("eco-rec")],
          comparisonBreaks: {
            body: "Recurrence is not identical repetition — and not always recovery.",
            placeholder: true,
          },
        },
        {
          id: "eco-legacy-effects",
          title: "Legacy effects",
          summary:
            "Prior conditions leave traces that bias future assembly — scaffold.",
          epistemicKind: "empirical-observation",
          placeholder: true,
          sections: [...diveScaffold("eco-leg")],
          comparisonBreaks: {
            body: "Legacy is constraint, not narrative destiny.",
            placeholder: true,
          },
        },
      ],
      comparisonBreaks: {
        title: "Where the comparison breaks",
        body: "Ecological succession is not a theological resurrection narrative, nor a zodiacal proof.",
        placeholder: true,
      },
    },
    {
      lensId: "biblical-textual",
      framing:
        "Textual and theological comparative reading. Not a scientific mechanism. Distinctions among text, interpretation, and theology must remain visible.",
      concepts: [
        {
          id: "bib-seed-death-life",
          title: "Seed / death / renewed life",
          summary:
            "Primary-text imagery (e.g. John 12:24; 1 Cor 15) — observation before interpretation.",
          epistemicKind: "textual-observation",
          placeholder: true,
          sections: [
            {
              id: "bib-seed-summary",
              kind: "summary",
              title: "Summary",
              body: "Scaffold for primary seed imagery. Textual observation first; interpretation labeled separately when authored.",
              placeholder: true,
            },
            {
              id: "bib-seed-pattern",
              kind: "pattern",
              title: "Pattern",
              body: PH,
              placeholder: true,
            },
            {
              id: "bib-seed-persists",
              kind: "what-persists",
              title: "What persists",
              body: PH,
              placeholder: true,
            },
            {
              id: "bib-seed-changes",
              kind: "what-changes",
              title: "What changes",
              body: PH,
              placeholder: true,
            },
          ],
          comparisonBreaks: {
            body: "A biblical metaphor is not a biological mechanism.",
            placeholder: true,
          },
        },
        {
          id: "bib-exodus-wilderness",
          title: "Exodus & wilderness",
          summary:
            "Liminal reorganization between orders — textual pattern scaffold.",
          epistemicKind: "textual-interpretation",
          placeholder: true,
          sections: [...diveScaffold("bib-ex")],
          comparisonBreaks: {
            body: "Wilderness is not guaranteed successful transformation.",
            placeholder: true,
          },
        },
        {
          id: "bib-exile-return",
          title: "Exile & return",
          summary:
            "Historical and prophetic patterns of displacement and partial restoration.",
          epistemicKind: "textual-interpretation",
          placeholder: true,
          sections: [...diveScaffold("bib-exile")],
          comparisonBreaks: {
            body: "Return is not always identical restoration.",
            placeholder: true,
          },
        },
        {
          id: "bib-jesus-death-resurrection",
          title: "Jesus: death / burial / resurrection",
          summary:
            "Narrative structure and theological claim held in tension — not reduced to cycle.",
          epistemicKind: "theological-interpretation",
          placeholder: true,
          sections: [
            {
              id: "bib-jr-summary",
              kind: "summary",
              title: "Summary",
              body: "Scaffold for the Gospel narrative shape and for the tension: useful structural comparison and resistance to reduction as mere recurrence within Christian theology.",
              placeholder: true,
            },
            {
              id: "bib-jr-pattern",
              kind: "pattern",
              title: "Pattern",
              body: PH,
              placeholder: true,
            },
            {
              id: "bib-jr-persists",
              kind: "what-persists",
              title: "What persists",
              body: PH,
              placeholder: true,
            },
            {
              id: "bib-jr-changes",
              kind: "what-changes",
              title: "What changes",
              body: PH,
              placeholder: true,
            },
            {
              id: "bib-jr-holds",
              kind: "analogy-holds",
              title: "Where the analogy holds",
              body: "Reserved for carefully bounded structural comparison — not authored as claim here.",
              placeholder: true,
            },
            {
              id: "bib-jr-breaks",
              kind: "comparison-breaks",
              title: "Where the comparison breaks",
              body: "Resurrection may be eschatological interruption / new creation rather than cyclical recurrence. The model must show this tension, not resolve it away.",
              placeholder: true,
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Theological interpretation is not empirical mechanism. Structural resemblance does not establish causation or doctrinal proof.",
            placeholder: true,
          },
          openQuestions: [
            "Can comparative structure serve curiosity without collapsing Christian particularity?",
          ],
        },
        {
          id: "bib-new-creation",
          title: "New creation",
          summary:
            "Renewal that is not mere restoration of a prior state — theological scaffold.",
          epistemicKind: "theological-interpretation",
          placeholder: true,
          sections: [...diveScaffold("bib-nc")],
          comparisonBreaks: {
            body: "New creation language is theological, not ecological succession.",
            placeholder: true,
          },
        },
        {
          id: "bib-counterexamples",
          title: "Counterexamples / limits",
          summary:
            "First-class space for narratives that resist the tidy schema.",
          epistemicKind: "textual-interpretation",
          placeholder: true,
          sections: [
            {
              id: "bib-ce-summary",
              kind: "summary",
              title: "Summary",
              body: "Scaffold for Job-like suffering, incomplete return, and other limits — disagreement belongs in the instrument.",
              placeholder: true,
            },
            {
              id: "bib-ce-breaks",
              kind: "comparison-breaks",
              title: "Where the comparison breaks",
              body: "Not every biblical disruption yields renewed order inside the text.",
              placeholder: true,
            },
          ],
          comparisonBreaks: {
            body: "Forcing every narrative into one sequence flattens the corpus.",
            placeholder: true,
          },
        },
      ],
      comparisonBreaks: {
        title: "Where the comparison breaks",
        body: "Theological interpretation is not empirical mechanism. Do not derive Christianity from astrology.",
        placeholder: true,
      },
    },
    {
      lensId: "symbolic-zodiac",
      framing:
        "Historical and symbolic associations. Explicitly not an empirical claim about celestial causation. Provenance labels are required.",
      concepts: [
        {
          id: "zod-ancient-scorpio",
          title: "Ancient Scorpio",
          summary:
            "Hellenistic associations — death, Mars, intensity — before modern rebirth language.",
          epistemicKind: "historical-observation",
          provenance: "ancient-hellenistic",
          placeholder: true,
          sections: [...diveScaffold("zod-anc")],
          comparisonBreaks: {
            body: "Ancient death associations are not modern “transformation” psychology.",
            placeholder: true,
          },
        },
        {
          id: "zod-mars-rulership",
          title: "Mars rulership",
          summary:
            "Classical domicile rulership and what Mars historically signified.",
          epistemicKind: "historical-observation",
          provenance: "ancient-hellenistic",
          placeholder: true,
          sections: [...diveScaffold("zod-mars")],
          comparisonBreaks: {
            body: "Mars rulership does not encode a systems theory of reorganization.",
            placeholder: true,
          },
        },
        {
          id: "zod-eighth-place",
          title: "Eighth-place death associations",
          summary:
            "Idle place, death, inheritance — traditional house significations.",
          epistemicKind: "historical-observation",
          provenance: ["ancient-hellenistic", "later-traditional"],
          placeholder: true,
          sections: [...diveScaffold("zod-8th")],
          comparisonBreaks: {
            body: "House death significations are not proof of a developmental spiral stage.",
            placeholder: true,
          },
        },
        {
          id: "zod-pluto-era",
          title: "Pluto-era Scorpio",
          summary:
            "Twentieth-century outer-planet rulership and transformation language.",
          epistemicKind: "symbolic-analogy",
          provenance: "modern-pluto-era",
          placeholder: true,
          sections: [...diveScaffold("zod-pluto")],
          comparisonBreaks: {
            body: "Do not read Pluto-era meanings back into Hellenistic practice.",
            placeholder: true,
          },
        },
        {
          id: "zod-psychological",
          title: "Psychological astrology",
          summary:
            "Modern developmental and psychological readings of Scorpio / crisis.",
          epistemicKind: "symbolic-analogy",
          provenance: "modern-psychological",
          placeholder: true,
          sections: [...diveScaffold("zod-psych")],
          comparisonBreaks: {
            body: "Psychological astrology is a modern interpretive layer, not ancient doctrine.",
            placeholder: true,
          },
        },
        {
          id: "zod-developmental",
          title: "Developmental zodiac",
          summary:
            "Sign-by-sign developmental glosses — largely modern, not a Hellenistic syllabus.",
          epistemicKind: "symbolic-analogy",
          provenance: ["modern-psychological", "our-systems-reading"],
          placeholder: true,
          sections: [...diveScaffold("zod-dev")],
          comparisonBreaks: {
            body: "Do not present the twelve-stage developmental gloss as ancient canonical doctrine.",
            placeholder: true,
          },
        },
        {
          id: "zod-our-reading",
          title: "Provenance of our systems reading",
          summary:
            "What Living Terrain proposes versus what tradition actually held — honesty scaffold.",
          epistemicKind: "hypothesis",
          provenance: "our-systems-reading",
          placeholder: true,
          sections: [
            {
              id: "zod-our-summary",
              kind: "summary",
              title: "Summary",
              body: "Scaffold for distinguishing ancient, later, modern, and our own comparative mapping.",
              placeholder: true,
            },
            {
              id: "zod-our-breaks",
              kind: "comparison-breaks",
              title: "Where the comparison breaks",
              body: "Our systems reading is a hypothesis about structural resemblance — not historical transmission.",
              placeholder: true,
            },
          ],
          comparisonBreaks: {
            body: "Celestial symbolism does not scientifically cause biological or psychological processes.",
            placeholder: true,
          },
          openQuestions: [
            "Which zodiac claims are strong enough to keep once provenance is labeled?",
          ],
        },
      ],
      comparisonBreaks: {
        title: "Where the comparison breaks",
        body: "Zodiac symbolism does not scientifically cause biological or psychological processes. Analogy is not mechanism.",
        placeholder: true,
      },
    },
  ],
  across: {
    title: "Across lenses",
    framing:
      "Structural resemblances offered for inquiry — not common causation, historical transmission, or equal evidence across languages.",
    placeholder: true,
    sections: [
      {
        id: "across-recurring",
        kind: "recurring-structures",
        title: "Recurring structures",
        body: "Candidate patterns appearing in more than one lens — provisional, not universal laws.",
        placeholder: true,
        items: [
          {
            id: "ar-1",
            title: "Established organization",
            body: "A prior attractor, order, or form of persistence.",
            placeholder: true,
          },
          {
            id: "ar-2",
            title: "Perturbation / pressure",
            body: "External or internal demand the current organization struggles to absorb.",
            placeholder: true,
          },
          {
            id: "ar-3",
            title: "Threshold or liminal phase",
            body: "A passage where ordinary fluctuation is no longer enough.",
            placeholder: true,
          },
          {
            id: "ar-4",
            title: "Loss / breakdown / release",
            body: "Prior organization loosens, fails, or is shed.",
            placeholder: true,
          },
          {
            id: "ar-5",
            title: "Retention of prior information or material",
            body: "Legacies, memory, genome, covenant residue — something carried forward.",
            placeholder: true,
          },
          {
            id: "ar-6",
            title: "Reorganization",
            body: "A different configuration of stability — or failure to find one.",
            placeholder: true,
          },
          {
            id: "ar-7",
            title: "History constraining future states",
            body: "Path dependence: the past limits what can emerge.",
            placeholder: true,
          },
          {
            id: "ar-8",
            title: "Renewed emergence ≠ identical repetition",
            body: "Return, if any, is not a photocopy of the prior state.",
            placeholder: true,
          },
        ],
      },
      {
        id: "across-resemblances",
        kind: "resemblances",
        title: "Resemblances",
        body: "Interesting structural parallels — still analogies until carefully argued.",
        placeholder: true,
        items: [
          {
            id: "res-1",
            title: "Legacy / memory across ecology and systems",
            body: "Scaffold for the strongest non-mystical continuity-through-change parallel.",
            placeholder: true,
          },
          {
            id: "res-2",
            title: "Seed imagery and biological continuity metaphors",
            body: "Shared analogical language — not shared causation.",
            placeholder: true,
          },
        ],
      },
      {
        id: "across-breaks",
        kind: "where-they-break",
        title: "Where they break",
        emphasis: "counter",
        body: "Anti-correspondences and category differences — first-class, not footnotes.",
        placeholder: true,
        items: [
          {
            id: "brk-1",
            title: "Metamorphosis ≠ resurrection",
            body: "Different claims; resemblance is metaphorical.",
            placeholder: true,
          },
          {
            id: "brk-2",
            title: "Zodiacal return ≠ hysteresis",
            body: "Cyclical symbolism is not path-dependent dynamical recurrence.",
            placeholder: true,
          },
          {
            id: "brk-3",
            title: "Equal vocabulary ≠ equal evidence",
            body: "Lenses do not share evidentiary status.",
            placeholder: true,
          },
        ],
      },
      {
        id: "across-counter",
        kind: "counterarguments",
        title: "Counterarguments",
        emphasis: "counter",
        body: "Arguments against the Spiral interpretation itself. The instrument must be able to disagree with itself.",
        placeholder: true,
        items: [
          {
            id: "ctr-1",
            title: "Selection bias",
            body: "We notice death/rebirth stories because the schema primes us.",
            placeholder: true,
          },
          {
            id: "ctr-2",
            title: "Progress implication",
            body: "Helix/ascent visuals can imply improvement; domains show collapse and injury.",
            placeholder: true,
          },
          {
            id: "ctr-3",
            title: "Success bias",
            body: "Not every disruption yields adaptive reorganization.",
            placeholder: true,
          },
          {
            id: "ctr-4",
            title: "Category-error risk",
            body: "Seed metaphors travel; mechanisms do not.",
            placeholder: true,
          },
          {
            id: "ctr-5",
            title: "Zodiac placement circularity",
            body: "Scorpio “fits” partly because modern astrology was already psychologized.",
            placeholder: true,
          },
          {
            id: "ctr-6",
            title: "Resurrection vs recurrence",
            body: "Christian theology may cast resurrection as interruption of cycle, not rediscovery of one.",
            placeholder: true,
          },
          {
            id: "ctr-7",
            title: "Triviality",
            body: "“Things change under pressure but something remains” may be too generic.",
            placeholder: true,
          },
          {
            id: "ctr-8",
            title: "Scale collapse",
            body: "Cell, psyche, ecosystem, and salvation-history are not one process.",
            placeholder: true,
          },
        ],
      },
      {
        id: "across-open",
        kind: "open-questions",
        title: "Open questions",
        body: "What the model has not resolved.",
        placeholder: true,
        items: [
          {
            id: "oq-1",
            title: "Minimum non-trivial definition",
            body: "What must Transformation mean to remain insightful?",
            placeholder: true,
          },
          {
            id: "oq-2",
            title: "Across as questions vs master pattern",
            body: "Should synthesis stay interrogative?",
            placeholder: true,
          },
        ],
      },
      {
        id: "across-synthesis",
        kind: "synthesis",
        title: "Synthesis",
        body: "Provisional: humans repeatedly need languages for continuity-through-change and for how the past limits the future after rupture. That justifies comparative inquiry — not a single deep cause across all six lenses.",
        placeholder: true,
      },
    ],
  },
};
