/**
 * Transformation stage — deep exploration packet (M1C hierarchy).
 *
 * Systems lens: authored M1D-1 content (approved copy).
 * Biology lens: authored M1D-2 content (approved copy).
 * Other lenses remain placeholder scaffolding — do not treat as researched claims.
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
      title: "When does change become transformation?",
      framing:
        "A system can absorb enormous variation without becoming a different system. Temperatures fluctuate. Populations rise and fall. Beliefs are challenged. Forests burn and regrow.\n\nBut sometimes change crosses a threshold. The relationships that maintained the previous organization no longer restore it. Feedbacks shift. Old conditions may disappear while pieces of the previous system remain. What emerges next is shaped by what came before, but it is not necessarily a return to it.\n\nSystems science gives us several ways to investigate this boundary between continuity and transformation.\n\nTransformation here does not mean improvement. A system can reorganize into something more adaptive, more brittle, less functional—or fail to reorganize at all.",
      concepts: [
        {
          id: "sys-thresholds-regime-shifts",
          title: "Thresholds & regime shifts",
          summary: "Most change does not transform a system.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "empirical-mechanism"],
          sections: [
            {
              id: "sys-thresh-body",
              kind: "general",
              title: "",
              body: "Living and ecological systems are constantly being perturbed. Within limits, their feedbacks absorb those disturbances and pull organization back toward a familiar range.\n\nBut those limits are not infinite.\n\nAs resilience erodes, a system can approach a threshold where relatively small additional pressure produces disproportionately large change. Feedbacks that once stabilized one state may weaken, disappear, or be replaced by feedbacks that stabilize another.\n\nThe important transition is not simply that something changed. It is that the relationships responsible for restoring the previous organization no longer do so in the same way.",
            },
            {
              id: "sys-thresh-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Matter, organisms, stored information, environmental conditions, and remnants of prior organization may persist through the transition.",
            },
            {
              id: "sys-thresh-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Dominant feedbacks, relationships, composition, stability—and sometimes what we would recognize as the system's identity.",
            },
            {
              id: "sys-thresh-example",
              kind: "examples",
              title: "Example",
              body: "Shallow lakes can shift from a clear-water state to a turbid state as nutrient loading and feedbacks reorganize. Once the turbid regime is established, the relationships that once maintained clear water may no longer restore it under the same conditions.",
            },
          ],
          sources: [
            {
              id: "sys-thresh-scheffer-2001",
              title: "Catastrophic shifts in ecosystems",
              authors: "Scheffer et al.",
              year: 2001,
              publication: "Nature 413: 591–596",
              doi: "10.1038/35098000",
              supports:
                "Regime shifts, alternative stable states, and hysteresis in ecosystems.",
            },
            {
              id: "sys-thresh-scheffer-2009",
              title: "Early-warning signals for critical transitions",
              authors: "Scheffer et al.",
              year: 2009,
              publication: "Nature 461: 53–59",
              doi: "10.1038/nature08227",
              supports:
                "Critical slowing down and related indicators near thresholds.",
            },
            {
              id: "sys-thresh-dakos-2015",
              title: "Resilience indicators…",
              authors: "Dakos et al.",
              year: 2015,
              publication:
                "Philosophical Transactions of the Royal Society B 370",
              url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4247400/",
              supports:
                "Prospects and limits of resilience / early-warning indicators for regime shifts.",
            },
          ],
        },
        {
          id: "sys-hysteresis",
          title: "Hysteresis",
          summary: "The way back may not be the way you came.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "empirical-mechanism"],
          whisper:
            "A return to familiar conditions does not guarantee a return to the former system.",
          sections: [
            {
              id: "sys-hyst-body",
              kind: "general",
              title: "",
              body: "If a system has crossed into a different stable regime, simply reversing the pressure that pushed it there may not restore the previous state.\n\nThis is hysteresis: the present behavior of a system depends partly on its history.\n\nThe threshold for leaving one state can differ from the threshold required to return to it. In some cases, return may become extraordinarily difficult or impossible under the conditions that remain.\n\nThe system therefore carries its past—not necessarily as memory in the psychological sense, but in its altered structure, relationships, feedbacks, and constraints.",
            },
            {
              id: "sys-hyst-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Residual structure, constraints, material conditions, altered feedbacks, and the consequences of the path already taken.",
            },
            {
              id: "sys-hyst-changes",
              kind: "what-changes",
              title: "What changes",
              body: "The system's response landscape: conditions that once maintained one state may no longer be sufficient to recreate it.",
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Do not describe hysteresis as literal psychological memory.\n\nIts relevance to other lenses is structural unless a domain-specific mechanism independently supports the comparison.",
          },
          sources: [
            {
              id: "sys-hyst-scheffer-2001",
              title: "Catastrophic shifts in ecosystems",
              authors: "Scheffer et al.",
              year: 2001,
              publication: "Nature 413: 591–596",
              doi: "10.1038/35098000",
              supports:
                "Hysteresis and path-dependent return in ecosystem regime shifts.",
            },
          ],
        },
        {
          id: "sys-transformability",
          title: "Resilience & transformability",
          summary:
            "Sometimes survival means remaining recognizable. Sometimes it means becoming different.",
          epistemicKind: "conceptual-framework",
          epistemicKinds: ["conceptual-framework", "empirical-observation"],
          sections: [
            {
              id: "sys-xform-body",
              kind: "general",
              title: "",
              body: "Resilience describes a system's capacity to absorb disturbance while retaining its essential organization and function.\n\nTransformability asks a different question: what happens when maintaining the existing organization is no longer viable?\n\nAt that point, preserving every feature of the old system may work against persistence at a larger scale. Some structures may have to disappear. Relationships may reorganize. Functions may move. Identity itself may become difficult to define.\n\nThis creates one of the central tensions of the Evolutionary Spiral:\n\nHow much can change while continuity remains?\n\nHow much can remain before continuity becomes rigidity?",
            },
            {
              id: "sys-xform-persists",
              kind: "what-persists",
              title: "What persists",
              body: "This depends on scale.\n\nA larger system may persist even while components, relationships, or organizational forms change.",
            },
            {
              id: "sys-xform-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Structures, relationships, functions, and potentially the identity used to describe the system.",
            },
          ],
          sources: [
            {
              id: "sys-xform-walker-2004",
              title:
                "Resilience, adaptability and transformability in social–ecological systems",
              authors: "Walker et al.",
              year: 2004,
              publication: "Ecology & Society 9(2):5",
              url: "https://www.ecologyandsociety.org/vol9/iss2/art5/main.html",
              supports:
                "Distinguishes resilience (absorb while remaining) from transformability (become different).",
            },
          ],
        },
        {
          id: "sys-adaptive-cycles",
          title: "Adaptive cycles",
          summary: "The adaptive cycle is not a universal clock.",
          epistemicKind: "conceptual-framework",
          epistemicKinds: ["conceptual-framework", "hypothesis"],
          sections: [
            {
              id: "sys-adapt-body",
              kind: "general",
              title: "",
              body: "Some systems researchers have described recurring dynamics through an adaptive cycle: periods of growth and accumulation, increasing connectedness, release, and reorganization.\n\nThe model is useful because it refuses to treat breakdown as the end of the story. Release can free material, information, and possibilities that become available during reorganization.\n\nBut the adaptive cycle is not a universal clock.\n\nSystems do not have to complete it. Reorganization does not guarantee recovery. The next configuration may resemble the previous one, diverge from it, or fail entirely.\n\nThe value of the model is therefore not that everything follows the same cycle. It is that it gives us a language for asking what becomes possible after an existing organization loosens or breaks apart.",
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Do not present the adaptive cycle as:\n\na universal law\n\na guaranteed developmental sequence\n\ninevitable improvement\n\nproof that collapse creates growth",
          },
          sources: [
            {
              id: "sys-adapt-gunderson-holling-2002",
              title: "Panarchy",
              authors: "Gunderson & Holling",
              year: 2002,
              publication: "Island Press",
              supports:
                "Adaptive cycle and panarchy as a heuristic for release and reorganization.",
            },
            {
              id: "sys-adapt-holling-2001",
              title:
                "Understanding the Complexity of Economic, Ecological, and Social Systems",
              authors: "Holling",
              year: 2001,
              publication: "Ecosystems 4: 390–405",
              supports:
                "Nested adaptive cycles; release, reorganization, remember, and revolt.",
            },
          ],
        },
        {
          id: "sys-path-dependence",
          title: "Path dependence",
          summary: "Transformation does not begin from zero.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "systems-principle"],
          sections: [
            {
              id: "sys-path-body",
              kind: "general",
              title: "",
              body: "What becomes possible after disruption depends partly on what existed before it.\n\nStructures remain. Resources remain. Constraints remain. Some relationships survive while others disappear. Previous changes alter the landscape on which the next change occurs.\n\nSystems are therefore not merely moving through a sequence of interchangeable states. They are accumulating history.\n\nTwo systems exposed to the same disturbance may respond differently because they did not arrive there by the same path.\n\nThis is one reason recurrence does not require repetition.\n\nA system can encounter a recognizable problem again while meeting it from a different state.",
            },
            {
              id: "sys-path-persists",
              kind: "what-persists",
              title: "What persists",
              body: "History persists through constraints, structure, resources, legacies, and altered possibilities.",
            },
            {
              id: "sys-path-changes",
              kind: "what-changes",
              title: "What changes",
              body: "The range of futures available to the system.",
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Do not overstate path dependence as deterministic.\n\nHistory constrains future possibilities; it does not necessarily dictate one inevitable outcome.",
          },
          sources: [
            {
              id: "sys-path-scheffer-2001",
              title: "Catastrophic shifts in ecosystems",
              authors: "Scheffer et al.",
              year: 2001,
              publication: "Nature 413: 591–596",
              doi: "10.1038/35098000",
              supports:
                "History-dependent return thresholds (hysteresis) constrain what can follow a regime shift.",
            },
          ],
        },
      ],
      comparisonBreaks: {
        title: "Where systems language breaks",
        body: "Systems language travels easily—and that is also its danger.\n\nWords such as feedback, threshold, resilience, transformation, and emergence can describe patterns at many scales. Their usefulness does not mean the mechanisms operating at those scales are the same.\n\nA regime shift in a lake is not a grief process. Metamorphosis is not resurrection. A symbolic cycle is not hysteresis.\n\nStructural resemblance gives us a reason to compare.\n\nIt does not give us permission to collapse the things being compared.",
      },
      openQuestions: [
        "If a system cannot remain exactly what it was, what must be carried forward for us to say that something continued at all?",
      ],
    },
    {
      lensId: "living-systems",
      title:
        "How can a living system remain continuous while radically changing its organization?",
      framing:
        "Living systems survive through both preservation and change.\n\nCells are dismantled and replaced. Tissues are remodeled. Organisms pass through developmental states that can look almost nothing alike. Damage can be repaired without recreating the exact structure that existed before it.\n\nBiology therefore complicates the idea that continuity requires sameness.\n\nSometimes continuity is carried by what remains materially intact. Sometimes it is carried through lineage, information, developmental constraints, surviving structures, or the regulated reuse of existing material.\n\nBut biological transformation has limits. Breakdown can enable reorganization when it is regulated within a viable system. Uncontrolled damage can just as easily produce dysfunction, degeneration, or death.\n\nThe question is not whether destruction creates growth.\n\nIt is what allows a living system to change its organization without losing continuity altogether?",
      concepts: [
        {
          id: "bio-metamorphosis",
          title: "Metamorphosis",
          summary: "The organism continues. Its organization does not remain the same.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "empirical-mechanism"],
          sections: [
            {
              id: "bio-meta-body",
              kind: "general",
              title: "",
              body: "Holometabolous insects provide one of biology's clearest examples of continuity through radical reorganization.\n\nDuring metamorphosis, hormonal signals coordinate extensive changes in tissue organization. Some larval tissues are eliminated or remodeled, while adult structures develop from populations of cells established earlier in development.\n\nThe adult is neither an entirely new organism nor simply the larva made larger.\n\nDevelopment continues across the transition, but the organization through which that continuity is expressed changes dramatically.",
            },
            {
              id: "bio-meta-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Organismal lineage, genome, developmental history, and some cellular and material continuity.",
            },
            {
              id: "bio-meta-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Body plan, tissue organization, physiology, behavior, ecological role, and the structures through which the organism interacts with its environment.",
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Metamorphosis is a regulated developmental program. It should not be treated as evidence that arbitrary destruction produces beneficial transformation.\n\nNor does biological metamorphosis establish religious claims about death and resurrection. The comparison becomes analogical when it leaves the biological mechanism.",
          },
          sources: [
            {
              id: "bio-meta-tettamanti-2019",
              title: "Cell death during complete metamorphosis",
              authors: "Tettamanti et al.",
              year: 2019,
              publication: "Philosophical Transactions of the Royal Society B 374",
              doi: "10.1098/rstb.2019.0065",
              url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6711292/",
              supports:
                "Programmed cell death and tissue remodeling in holometabolous metamorphosis.",
            },
            {
              id: "bio-meta-truman-riddiford-2019",
              title: "The evolution of insect metamorphosis…",
              authors: "Truman & Riddiford",
              year: 2019,
              publication: "Philosophical Transactions of the Royal Society B 374",
              doi: "10.1098/rstb.2019.0070",
              supports:
                "Developmental and endocrine framing of complete metamorphosis.",
            },
          ],
        },
        {
          id: "bio-autophagy",
          title: "Autophagy",
          summary: "Maintenance sometimes requires dismantling.",
          epistemicKind: "empirical-mechanism",
          sections: [
            {
              id: "bio-auto-body",
              kind: "general",
              title: "",
              body: "Cells do not preserve themselves by keeping every component indefinitely.\n\nThrough autophagy, cellular material can be enclosed, delivered to lysosomes, broken down, and recycled. The process contributes to cellular quality control, adaptation to changing nutrient conditions, differentiation, and the removal of damaged components.\n\nThis creates an interesting systems problem: some local structures must cease to persist for the larger living organization to continue functioning.\n\nBreakdown, in this case, is not the opposite of maintenance. Regulated breakdown is one of maintenance's tools.\n\nBut the word regulated matters. Autophagy operates within biological control systems. It is not evidence that more breakdown is inherently better or that injury automatically produces renewal.",
            },
            {
              id: "bio-auto-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Cell or system continuity, reusable molecular material, and regulatory organization.",
            },
            {
              id: "bio-auto-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Specific proteins, organelles, molecular arrangements, and resource allocation.",
            },
          ],
          openQuestions: [
            "At what scale are we deciding what “continuity” means?",
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Do not generalize cellular autophagy into a universal principle that destruction produces renewal.\n\nDo not describe psychological, social, theological, or symbolic processes as autophagy unless explicitly presented as metaphor or analogy.",
          },
          sources: [
            {
              id: "bio-auto-mizushima-komatsu-2011",
              title: "Autophagy: renovation of cells and tissues",
              authors: "Mizushima & Komatsu",
              year: 2011,
              publication: "Cell 147: 728–741",
              supports:
                "Autophagy as a recycling system for cellular renovation and homeostasis.",
            },
            {
              id: "bio-auto-mizushima-levine-2020",
              title: "Autophagy in Human Diseases",
              authors: "Mizushima & Levine",
              year: 2020,
              publication: "New England Journal of Medicine 383: 1564–1576",
              doi: "10.1056/NEJMra2022774",
              supports:
                "Physiological scope of autophagy in health and disease.",
            },
          ],
        },
        {
          id: "bio-wound-remodeling",
          title: "Wound healing & remodeling",
          summary: "Repair is not always restoration.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "empirical-mechanism"],
          whisper:
            "Healing may produce a viable future without reproducing the exact past.",
          sections: [
            {
              id: "bio-wound-body",
              kind: "general",
              title: "",
              body: "Wound healing is often described through overlapping inflammatory, proliferative, and remodeling phases.\n\nThe immediate problem is survival: control damage, restore a barrier, rebuild enough structure for the tissue to function.\n\nBut repaired tissue does not necessarily become identical to the tissue that existed before injury. Extracellular matrix is reorganized. Collagen architecture changes. Scar tissue may preserve closure and mechanical integrity while differing structurally and functionally from uninjured tissue.\n\nThe system can therefore regain continuity without reversing history.",
            },
            {
              id: "bio-wound-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Living tissue continuity, surviving cells and structures, biological information, and enough organization to restore or preserve function.",
            },
            {
              id: "bio-wound-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Tissue architecture, extracellular matrix organization, material properties, and sometimes function.",
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Wound healing should not be generalized into the claim that injury is necessary for growth.\n\nRepair consumes resources, can fail, and may leave lasting impairment.\n\nDo not turn this concept into:\n\n“what doesn't kill you makes you stronger”\n\ntrauma-growth language\n\nevidence that suffering is biologically necessary\n\nproof that all damaged systems heal",
          },
          sources: [
            {
              id: "bio-wound-ren-2022",
              title: "Autophagy and skin wound healing",
              authors: "Ren et al.",
              year: 2022,
              publication: "Burns & Trauma",
              url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8847901/",
              supports:
                "Stage-dependent roles of cellular processes across inflammatory, proliferative, and remodeling phases of wound healing.",
            },
          ],
        },
        {
          id: "bio-inheritance-variation",
          title: "Inheritance under variation",
          summary: "Continuity in biology has never required perfect copying.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "systems-principle"],
          whisper:
            "Continuation with variation is not failed repetition. It is one of life's ordinary conditions.",
          sections: [
            {
              id: "bio-inh-body",
              kind: "general",
              title: "",
              body: "Biological inheritance preserves enough information and organization for lineages to continue, while variation ensures that descendants are not exact repetitions of what came before.\n\nAt evolutionary scales, continuity and difference are therefore not competing processes. Both are built into the persistence of living lineages.\n\nSelection, developmental constraints, mutation, recombination, and environmental conditions shape what variation survives and what forms become possible.\n\nWhat continues is not an unchanged organism moving through time. It is a lineage capable of producing related but non-identical forms.\n\nThis gives the Spiral another way to understand recurrence:",
            },
            {
              id: "bio-inh-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Lineage, inherited biological information, developmental constraints, and patterns of descent.",
            },
            {
              id: "bio-inh-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Individual organisms, combinations of inherited variation, traits, environmental relationships, and—across longer evolutionary timescales—lineage characteristics.",
            },
            {
              id: "bio-inh-scale",
              kind: "general",
              title: "Scale",
              body: "This concept deliberately changes scale.\n\nMetamorphosis, autophagy, and wound remodeling primarily examine continuity within an organism or living subsystem.\n\nInheritance under variation examines continuity across generations and evolutionary lineages.\n\nThe reason this concept belongs here is comparative:\n\nIt tests whether biological continuity itself requires exact repetition.",
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Do not present evolution as:\n\nan inevitable upward progression\n\nmovement toward perfection\n\na predetermined spiral\n\nevidence that every system improves through variation\n\nDo not imply that natural selection “wants” transformation or has foresight.",
          },
          // Seed ex-transformation-inheritance-variation has no authored source metadata.
        },
      ],
      comparisonBreaks: {
        title: "Where biological analogy breaks",
        body: "Biology gives us mechanisms for remodeling, recycling, development, repair, inheritance, and adaptation.\n\nThose mechanisms belong to living systems.\n\nThey do not demonstrate that psychological suffering is necessary for growth, that societies must collapse to renew themselves, that symbolic cycles describe biological laws, or that religious resurrection is another name for regeneration.\n\nSimilar shapes can invite comparison.\n\nMechanisms still have to be established within the domain where the claim is being made.",
      },
      openQuestions: [
        "If living continuity does not require material sameness, where does biological identity actually reside?",
      ],
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
