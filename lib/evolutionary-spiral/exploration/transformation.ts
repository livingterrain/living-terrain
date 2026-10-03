/**
 * Transformation stage — deep exploration packet (M1C hierarchy).
 *
 * Systems lens: authored M1D-1 content (approved copy).
 * Biology lens: authored M1D-2 content (approved copy).
 * Psychology lens: authored M1D-3 content (approved copy).
 * Ecology lens: authored M1D-4 content (approved copy).
 * Biblical / Jesus lens: authored M1D-5 content (approved copy).
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
      title:
        "How can experience change the internal models through which a person interprets the world without erasing continuity of self?",
      framing:
        "Human beings do not encounter each moment without a history.\n\nMemory, expectation, learned associations, beliefs, and models of self and world shape how new experience is interpreted.\n\nMuch of that organization can absorb contradiction without changing very much. New experiences are incorporated into what is already known.\n\nBut sometimes existing expectations no longer explain what is happening. Old associations may be updated. New learning may compete with earlier learning. Assumptions may have to be revised. Loss may alter the story through which a person understands a life that nevertheless remains their own.\n\nPsychological transformation therefore raises a problem similar to—but not mechanistically identical with—the one we encountered in systems and biology:\n\nWhat changes when the past remains, but its present organization changes?\n\nTransformation here does not mean improvement.\n\nExperience can produce learning, adaptation, confusion, impairment, integration, fragmentation, or no lasting reorganization at all.",
      concepts: [
        {
          id: "psy-reconsolidation",
          title: "Memory reconsolidation",
          summary: "Remembering is not always passive retrieval.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "empirical-mechanism"],
          sections: [
            {
              id: "psy-recon-body",
              kind: "general",
              title: "",
              body: "A consolidated memory can sometimes become susceptible to updating when it is reactivated under particular conditions.\n\nResearch on reconsolidation suggests that retrieval can, under specific circumstances, destabilize aspects of an established memory before it is stabilized again.\n\nThat does not mean every act of remembering rewrites a memory.\n\nNor does updating mean that the original event disappears.\n\nWhat happened remains part of the person's history. What may change is how aspects of that memory are presently represented, associated, or expressed.\n\nThe past is therefore not altered in the literal sense.\n\nThe living system that carries it can change.",
            },
            {
              id: "psy-recon-persists",
              kind: "what-persists",
              title: "What persists",
              body: "The historical event, autobiographical continuity, existing memory traces or components, and the fact that prior learning occurred.",
            },
            {
              id: "psy-recon-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Under appropriate conditions, aspects of the memory's current representation, associations, emotional significance, or behavioral expression may be updated.",
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Do not present reconsolidation as:\n\nautomatic whenever a memory is recalled\n\nliteral deletion of the past\n\nguaranteed therapeutic rewriting\n\nproof that identity can be freely reconstructed\n\na psychological equivalent of biological metamorphosis\n\nMemory reconsolidation has boundary conditions.\n\nPreserve that uncertainty.",
          },
          sources: [
            {
              id: "psy-recon-nader-2000",
              // Article title absent from M1B-R dossier — omit title rather than invent or
              // present a citation line as if it were the publication title.
              authors: "Nader et al.",
              year: 2000,
              publication: "Nature 406: 722–726",
              supports: "Post-retrieval lability of fear memory.",
            },
            {
              id: "psy-recon-pmc7550798",
              // Dossier recorded PMC7550798 without a verified author/title.
              // Uncertain "Astute et al." author string omitted.
              url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7550798/",
              supports: "Distinct mnemonic routes of reconsolidation and extinction.",
            },
          ],
        },
        {
          id: "psy-extinction",
          title: "Extinction & new learning",
          summary: "A response can weaken without the old learning disappearing.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "empirical-mechanism"],
          whisper:
            "The old learning can remain even when it no longer organizes behavior in the same way.",
          sections: [
            {
              id: "psy-ext-body",
              kind: "general",
              title: "",
              body: "In learning research, extinction does not necessarily mean that an earlier association has been erased.\n\nInstead, new learning can develop that competes with or inhibits the expression of the older response.\n\nThis matters because the earlier learning may still remain available under some conditions.\n\nResponses that appeared to be extinguished can sometimes return.\n\nThe transformed state may therefore contain more than one history at once:\n\nthe earlier association and the newer learning that changes when or how it is expressed.\n\nChange, in this case, does not require a clean reset.",
            },
            {
              id: "psy-ext-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Prior learning and the history through which the original association was acquired.",
            },
            {
              id: "psy-ext-changes",
              kind: "what-changes",
              title: "What changes",
              body: "New learning alters the conditions under which the older response is expressed.",
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Do not equate extinction learning with:\n\nerasure\n\nforgetting\n\nhysteresis\n\nbiological recycling\n\nspiritual renewal\n\nAny resemblance to other lenses is structural unless an independent psychological mechanism supports the comparison.",
          },
          sources: [
            {
              id: "psy-ext-treanor-2017",
              title: "Can Memories… Be Erased…?",
              authors: "Treanor et al.",
              year: 2017,
              publication: "Perspect. Psychol. Sci. 12",
              supports:
                "Boundary conditions and limited clinical translation for memory-updating claims.",
            },
            {
              id: "psy-ext-pmc7550798",
              // Dossier recorded PMC7550798 without a verified author/title.
              // Uncertain "Astute et al." author string omitted.
              url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7550798/",
              supports: "Distinct mnemonic routes of reconsolidation and extinction.",
            },
          ],
        },
        {
          id: "psy-belief-revision",
          title: "Internal model revision",
          summary:
            "When experience no longer fits the model, either experience must be reinterpreted—or the model must change.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "conceptual-framework"],
          sections: [
            {
              id: "psy-belief-body",
              kind: "general",
              title: "",
              body: "People organize experience through learned expectations, beliefs, schemas, assumptions, and narratives about self and world.\n\nThese structures help make new experience intelligible.\n\nMany contradictions can be absorbed without substantially changing them. An unexpected event can be dismissed, reinterpreted, or incorporated into an existing model.\n\nBut some experiences create enough contradiction that existing assumptions become difficult to maintain.\n\nRevision may then become possible or necessary.\n\nThe important transformation is not that reality itself has changed.\n\nIt is that the structure through which reality is interpreted no longer organizes experience in exactly the same way.",
            },
            {
              id: "psy-belief-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Personal history, prior learning, autobiographical continuity, and portions of the existing model that remain useful or credible.",
            },
            {
              id: "psy-belief-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Expectations, assumptions, interpretations, predictions, narratives, or relationships among previously held beliefs.",
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Psychological schemas and internal models are not literally ecological attractors or physical regime states.\n\nSystems language can help formulate questions about stability, contradiction, and reorganization.\n\nIt does not establish identical mechanisms across domains.",
          },
          // M1B-R dossier: no bibliographic row for schema / assumptive-world sources.
        },
        {
          id: "psy-grief-identity",
          title: "Grief & identity integration",
          summary:
            "Continuing does not require returning to the person who existed before the loss.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "conceptual-framework"],
          whisper: "Integration is not the same thing as reversal.",
          sections: [
            {
              id: "psy-grief-body",
              kind: "general",
              title: "",
              body: "Loss can alter more than emotion.\n\nIt can disrupt expectations about relationship, identity, future, safety, meaning, and the shape a life was expected to take.\n\nIntegration does not require forgetting what was lost or restoring the world that existed before the loss.\n\nInstead, psychological continuity may involve incorporating an irreversible absence into an ongoing understanding of self and life.\n\nThe person continues.\n\nThe world through which that person understands themselves may not remain the same.\n\nThis does not require a narrative of improvement.\n\nSomeone can integrate a loss without becoming grateful for it, stronger because of it, or better than they were before it occurred.",
            },
            {
              id: "psy-grief-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Personal history, relationship history, memory, identity continuity, and the significance of what was lost.",
            },
            {
              id: "psy-grief-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Expectations, roles, future models, relationships, identity narratives, and the place the loss occupies within ongoing life.",
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Do not describe grief as:\n\na required adaptive cycle\n\na predictable sequence toward growth\n\na regime shift\n\npsychological metamorphosis\n\nevidence that loss exists in order to transform someone\n\nThere is no required endpoint in which grief produces an improved person.",
          },
          // M1B-R dossier: grief/identity mentioned without authored bibliographic metadata.
        },
        {
          id: "psy-ptg-caution",
          title: "Growth after adversity?",
          summary:
            "Transformation is possible after adversity. Adversity does not guarantee transformation.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "contested-interpretation"],
          whisper:
            "A person does not need to become better for their survival to count.",
          sections: [
            {
              id: "psy-ptg-body",
              kind: "general",
              title: "",
              body: "Some people report positive psychological changes following highly difficult experiences.\n\nResearch on post-traumatic growth has examined reported changes in areas such as relationships, priorities, personal strength, meaning, and appreciation of life.\n\nBut the interpretation of those reports is not simple.\n\nPerceived growth and demonstrable change are not necessarily the same thing. Retrospective reports can be shaped by memory, coping, meaning-making, and the difficulty of knowing what a person would have been like had the adversity never occurred.\n\nAdversity can also produce lasting injury without growth.\n\nSome people experience both distress and perceived growth.\n\nSome experience neither.\n\nThe existence of possible growth after adversity therefore does not justify treating adversity as beneficial, necessary, or developmentally purposeful.",
            },
            {
              id: "psy-ptg-persists",
              kind: "what-persists",
              title: "What persists",
              body: "The fact of the adversity, personal history, and whatever consequences remain.",
            },
            {
              id: "psy-ptg-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Potentially beliefs, relationships, priorities, identity narratives, perceived capacities, or meaning.\n\nBut these changes vary substantially and must not be presumed.",
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Do not present post-traumatic growth as:\n\ninevitable\n\nuniversal\n\nproof that trauma is beneficial\n\nevidence that suffering is required for development\n\nthe psychological version of an adaptive cycle\n\nempirical proof of the Evolutionary Spiral\n\nThis concept exists partly to test and constrain one of the Spiral's most seductive interpretations.",
          },
          sources: [
            {
              id: "psy-ptg-frazier-2009",
              title:
                "Does Self-Reported PTG Reflect Genuine Positive Change?",
              authors: "Frazier et al.",
              year: 2009,
              publication: "Psychol. Sci.",
              supports: "Perceived growth is not necessarily actual growth.",
            },
            {
              id: "psy-ptg-jayawickreme-2021",
              title: "PTG as Positive Personality Change…",
              authors: "Jayawickreme et al.",
              year: 2021,
              publication: "Eur. J. Pers.",
              url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8062071/",
              supports:
                "Methodological bar for claiming personality transformation after adversity.",
            },
            {
              id: "psy-ptg-boals-2023",
              title: "Illusory PTG common…",
              authors: "Boals",
              year: 2023,
              publication: "Eur. J. Pers.",
              supports: "Genuine enduring post-traumatic growth is likely rare.",
            },
          ],
        },
      ],
      comparisonBreaks: {
        title: "Where psychological analogy breaks",
        body: "Psychological change is not a regime shift merely because both can be described as reorganization.\n\nMemory reconsolidation is not metamorphosis. Extinction learning is not hysteresis. Grief is not an adaptive cycle. Trauma is not a necessary perturbation designed to produce growth.\n\nSystems language may help us formulate questions about continuity, history, and change.\n\nThe psychological mechanisms still have to be established psychologically.",
      },
      openQuestions: [
        "If the past cannot be changed, what exactly changes when its meaning, prediction, or place within the self changes?",
      ],
    },
    {
      lensId: "ecology",
      title:
        "When an ecosystem is disrupted, what determines whether it returns, reorganizes, or becomes something else?",
      framing:
        "Ecological systems are shaped by both disturbance and inheritance.\n\nFire, storms, drought, flooding, species loss, land-use change, and other disruptions can alter an established ecological organization.\n\nWhat follows does not begin from zero.\n\nSurviving organisms, soils, nutrients, seed banks, physical structures, altered feedbacks, and the absence of what was lost can all influence what becomes possible next.\n\nSometimes a recognizable ecological configuration returns.\n\nSometimes recovery is partial.\n\nSometimes a different assemblage forms.\n\nSometimes feedbacks stabilize an alternative state.\n\nSometimes the conditions required for recovery have been lost.\n\nEcology therefore gives the Spiral one of its clearest empirical examples of recurrence with history:\n\nWhat emerges after disruption does not emerge from nothing.\n\nBut recurrence is not guaranteed, and neither is renewal.",
      concepts: [
        {
          id: "eco-disturbance-succession",
          title: "Disturbance & succession",
          summary:
            "Disturbance changes what is present. Succession describes what happens next.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "conceptual-framework"],
          whisper:
            "What comes after disturbance depends partly on what the disturbance leaves behind.",
          sections: [
            {
              id: "eco-succ-body",
              kind: "general",
              title: "",
              body: "Ecological communities are not static.\n\nDisturbances can remove organisms, alter resources, change physical conditions, open space, or reorganize relationships among species.\n\nThe ecological processes that follow are often described through succession.\n\nSuccession does not mean that an ecosystem simply rebuilds itself according to a fixed script.\n\nThe trajectory depends on what survived, what can arrive, the conditions left behind, interactions among organisms, subsequent disturbances, and the larger environmental context.\n\nA disturbed ecosystem may develop toward a configuration resembling what existed before.\n\nIt may also develop differently.",
            },
            {
              id: "eco-succ-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Depending on the disturbance:",
              items: [
                "surviving organisms",
                "soil",
                "nutrients",
                "seeds or propagules",
                "physical structures",
                "species interactions",
                "environmental constraints",
                "remnants of prior organization",
              ],
            },
            {
              id: "eco-succ-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Potentially:",
              items: [
                "species composition",
                "abundance",
                "spatial structure",
                "resource availability",
                "competitive relationships",
                "trophic relationships",
                "ecosystem processes",
              ],
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Succession is not a universal sequence of destruction followed by improvement.\n\nDo not imply:\n\nevery disturbance initiates renewal\n\necosystems move toward a predetermined ideal state\n\nsuccession is always progressive\n\ndisturbance exists in order to create ecological growth\n\necological succession proves a universal transformation cycle",
          },
          // M1B-R dossier: no dedicated disturbance/succession bibliographic row.
        },
        {
          id: "eco-memory",
          title: "Ecological memory & legacies",
          summary: "An ecosystem can carry its history forward materially.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "empirical-mechanism"],
          whisper:
            "The next system inherits a landscape that already has a history.",
          sections: [
            {
              id: "eco-mem-body",
              kind: "general",
              title: "",
              body: "After disturbance, the previous ecological system may remain present in fragments.\n\nSurviving organisms, seed banks, roots, soils, nutrients, dead wood, habitat structures, microbial communities, and other biological or material legacies can influence what develops afterward.\n\nThese remnants are part of what researchers describe as ecological memory.\n\nThey can preserve information, organisms, resources, or structures that affect recovery and reorganization.\n\nThe future system therefore does not encounter an empty landscape.\n\nIts possibilities are partly shaped by what persisted through the disturbance.\n\nThis gives ecological systems a concrete form of continuity without requiring the previous organization to remain intact.",
            },
            {
              id: "eco-mem-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Potentially:",
              items: [
                "organisms",
                "propagules",
                "genetic material",
                "soil properties",
                "nutrients",
                "habitat structures",
                "biological interactions",
                "material remnants",
                "spatial patterns",
              ],
            },
            {
              id: "eco-mem-changes",
              kind: "what-changes",
              title: "What changes",
              body: "The larger organization in which those remnants participate:",
              items: [
                "community composition",
                "population structure",
                "spatial relationships",
                "ecological interactions",
                "ecosystem processes",
                "dominant feedbacks",
              ],
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Ecological memory is not memory in the psychological sense.\n\nDo not imply that ecosystems:\n\nremember consciously\n\nencode autobiographical experience\n\npossess psychological memory\n\npreserve every important feature of the previous state\n\n“Memory” here refers to persistent biological, material, spatial, or organizational legacies that influence later ecological dynamics.",
          },
          sources: [
            {
              id: "eco-mem-johnstone-2016",
              title: "Changing disturbance regimes, ecological memory…",
              authors: "Johnstone et al.",
              year: 2016,
              publication: "Front. Ecol. Environ. 14: 369–378",
              doi: "10.1002/fee.1311",
              supports:
                "Information vs material legacies; ecological memory and resilience debt.",
            },
          ],
        },
        {
          id: "eco-resilience-recovery",
          title: "Resilience & recovery",
          summary:
            "Recovery can mean return. It can also mean continued function under changed organization.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "conceptual-framework"],
          whisper:
            "A system can remain viable without becoming identical to its former state.",
          sections: [
            {
              id: "eco-res-body",
              kind: "general",
              title: "",
              body: "Ecological resilience concerns how systems respond to disturbance while retaining or reorganizing ecological structure and function.\n\nSome disturbances are absorbed without producing a lasting change in the broader ecological regime.\n\nOther disturbances push systems beyond conditions from which the previous organization readily returns.\n\nRecovery is therefore not a single outcome.\n\nAn ecosystem may regain much of its former composition or function.\n\nIt may recover some functions while remaining compositionally different.\n\nIt may reorganize around different relationships.\n\nOr it may fail to recover important structures and processes at all.\n\nThe word recovery can hide these differences unless we ask:\n\nRecovery of what?",
            },
            {
              id: "eco-res-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Depending on the system:",
              items: [
                "ecological functions",
                "species or functional groups",
                "material legacies",
                "habitat structures",
                "feedback relationships",
                "portions of community organization",
              ],
            },
            {
              id: "eco-res-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Potentially:",
              items: [
                "species composition",
                "dominance relationships",
                "spatial structure",
                "rates of ecological processes",
                "interaction networks",
                "feedback strength",
                "system function",
              ],
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Do not use resilience as a synonym for:\n\ngoodness\n\nhealth\n\nimprovement\n\nstrength\n\nsuccessful transformation\n\nAn ecologically resilient state can preserve undesirable conditions from a human perspective.\n\nLikewise, loss of a previous state does not guarantee that what follows will be more diverse, functional, or adaptive.",
          },
          sources: [
            {
              id: "eco-res-walker-2004",
              title:
                "Resilience, adaptability and transformability in social–ecological systems",
              authors: "Walker et al.",
              year: 2004,
              publication: "Ecology & Society 9(2):5",
              url: "https://www.ecologyandsociety.org/vol9/iss2/art5/main.html",
              supports:
                "Distinguishes resilience (absorb while remaining) from transformability (become different).",
            },
            // Gunderson/Holling present in dossier/Systems as adaptive-cycle heuristic;
            // not attached here to avoid broadening Resilience & recovery beyond Walker’s claim.
          ],
        },
        {
          id: "eco-alt-stable-states",
          title: "Alternative stable states",
          summary:
            "The same place can support more than one persistent ecological organization.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "empirical-mechanism"],
          whisper:
            "Returning the conditions does not always return the system.",
          sections: [
            {
              id: "eco-alt-body",
              kind: "general",
              title: "",
              body: "Some ecological systems can persist in substantially different configurations under overlapping external conditions.\n\nFeedbacks within each configuration can help maintain that state.\n\nA sufficiently large disturbance or gradual change in conditions may push the system across a threshold into another regime.\n\nOnce that shift occurs, simply reversing the original pressure may not immediately restore the former ecological state.\n\nThe relationships maintaining the new configuration can now matter.\n\nThis is one reason ecological recovery cannot always be understood as retracing the path of disturbance backward.",
            },
            {
              id: "eco-alt-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Potentially:",
              items: [
                "geographic place",
                "portions of the species pool",
                "soils or physical substrate",
                "environmental drivers",
                "material legacies",
                "some ecosystem processes",
              ],
            },
            {
              id: "eco-alt-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Potentially:",
              items: [
                "dominant species",
                "community composition",
                "feedback relationships",
                "resource dynamics",
                "trophic structure",
                "ecosystem function",
                "stability conditions",
              ],
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Do not present every ecological change as an alternative stable state.\n\nDo not treat “regime shift” as a dramatic synonym for ordinary ecological variation.\n\nEvidence for alternative stable states requires more than observing that an ecosystem changed.\n\nAnd do not equate ecological alternative states with:\n\npsychological identity states\n\ntheological death and resurrection\n\nbiological metamorphosis\n\nsymbolic zodiac transitions",
          },
          sources: [
            {
              id: "eco-alt-scheffer-2001",
              title: "Catastrophic shifts in ecosystems",
              authors: "Scheffer et al.",
              year: 2001,
              publication: "Nature 413: 591–596",
              doi: "10.1038/35098000",
              supports:
                "Regime shifts, alternative stable states, and hysteresis in ecosystems.",
            },
            {
              id: "eco-alt-walker-2004",
              title:
                "Resilience, adaptability and transformability in social–ecological systems",
              authors: "Walker et al.",
              year: 2004,
              publication: "Ecology & Society 9(2):5",
              url: "https://www.ecologyandsociety.org/vol9/iss2/art5/main.html",
              supports:
                "Distinguishes remaining within a regime from becoming differently organized.",
            },
          ],
        },
        {
          id: "eco-reorganization-collapse",
          title: "Reorganization after collapse",
          summary:
            "What follows breakdown depends on what remains capable of participating in what comes next.",
          epistemicKind: "empirical-observation",
          epistemicKinds: ["empirical-observation", "conceptual-framework"],
          whisper:
            "Collapse creates a new set of constraints. It does not guarantee a new beginning.",
          sections: [
            {
              id: "eco-reorg-body",
              kind: "general",
              title: "",
              body: "Severe ecological disruption can dismantle relationships that previously maintained a system.\n\nPopulations may disappear.\n\nHabitat structures may be lost.\n\nFeedbacks may weaken or reverse.\n\nMaterial and biological legacies may remain—or they may be severely reduced.\n\nWhat follows depends partly on those remnants, on incoming organisms, on environmental conditions, and on whether the processes required for reorganization are still possible.\n\nA recognizable ecosystem may re-form.\n\nA different ecological configuration may develop.\n\nThe system may remain degraded.\n\nSome losses may not be reversible on meaningful human timescales.\n\nReorganization is therefore a possibility after collapse.\n\nIt is not a promise.",
            },
            {
              id: "eco-reorg-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Only what actually survives or remains available:",
              items: [
                "organisms",
                "propagules",
                "soil",
                "nutrients",
                "physical structures",
                "regional species pools",
                "ecological interactions",
                "material legacies",
              ],
            },
            {
              id: "eco-reorg-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Potentially almost every aspect of ecological organization:",
              items: [
                "community composition",
                "interaction networks",
                "spatial structure",
                "ecosystem processes",
                "feedbacks",
                "functions",
                "future trajectories",
              ],
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Do not imply:\n\ncollapse is required for renewal\n\necological destruction is beneficial because succession may follow\n\nnature always heals itself\n\nevery system contains enough memory to recover\n\nreorganization restores what was lost\n\na post-collapse system is necessarily more adaptive than the one before it\n\nThis concept must leave room for irreversible loss.",
          },
          // Source gap: Gunderson/Holling, Walker, and Johnstone appear in the dossier as
          // topical neighbors, but none cleanly source this irreversible-loss framing without
          // broadening adaptive-cycle or memory citations beyond their authored claims.
        },
      ],
      comparisonBreaks: {
        title: "Where ecological analogy breaks",
        body: "Ecological succession is not evidence that everything destroyed will renew.\n\nDisturbance can create conditions for reorganization, but it can also eliminate the organisms, structures, or processes required for recovery.\n\nEcological memory can persist, be altered, or be lost.\n\nA forest after fire is not a person after grief. An ecosystem crossing a threshold is not resurrection. Succession is not proof that collapse is necessary for renewal.\n\nEcology gives us mechanisms for legacy, constraint, feedback, recovery, and reorganization within ecological systems.\n\nComparisons beyond that domain remain comparisons.",
      },
      openQuestions: [
        "How much of a system's past has to survive for what comes next to count as recovery rather than replacement?",
      ],
    },
    {
      lensId: "biblical-textual",
      title:
        "How do biblical texts describe continuity through rupture, death, return, and renewal?",
      framing:
        "Biblical texts repeatedly ask what can remain continuous when an established world is disrupted.\n\nCovenants are broken and renewed. People leave and return. Israel experiences exile and restoration. Jesus moves through ministry, confrontation, suffering, death, burial, and resurrection. New Testament writers use images of seeds, bodies, and new creation to speak about continuity through radical change.\n\nThese are not scientific descriptions of transformation.\n\nThey are narrative, theological, and symbolic ways of making claims about identity, faithfulness, death, renewal, and what it means for something to be made new.\n\nThat distinction matters.\n\nThe question here is not whether biblical texts secretly contain modern systems theory.\n\nIt is whether their language gives us another historically important way humans have described the problem we have been following throughout the Spiral:\n\nWhat remains continuous when the form of continuation is no longer simple preservation?",
      concepts: [
        {
          id: "bib-jesus-death-resurrection",
          title: "Death, burial & raised life",
          summary:
            "The resurrection narrative does not describe Jesus simply resuming the life that preceded death.",
          epistemicKind: "textual-observation",
          epistemicKinds: ["textual-observation", "theological-interpretation"],
          sections: [
            {
              id: "bib-jr-body",
              kind: "general",
              title: "",
              body: "The New Testament places death, burial, and resurrection at the center of the Jesus narrative.\n\nThe sequence matters:\n\nJesus is crucified.\n\nHe dies.\n\nHe is buried.\n\nHe is proclaimed raised.\n\nWithin Christian interpretation, resurrection is not normally understood as the reversal of death into an unchanged continuation of ordinary mortal life.\n\nThe claim is continuity and discontinuity together:\n\nthe one who was crucified is the one proclaimed raised, while resurrection is understood as a transformed mode of life.\n\nFor the Spiral, this creates a question about identity through radical discontinuity.\n\nBut the comparison must stop there.\n\nThe biblical claim is theological.\n\nIt is not a biological account of regeneration or an empirical mechanism of recurrence.",
            },
            {
              id: "bib-jr-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Within the narrative and theological claim:",
              items: [
                "the identity of Jesus",
                "continuity between the crucified and risen Jesus",
                "the history that preceded death",
                "relationships and recognition",
                "the significance of what occurred before resurrection",
              ],
            },
            {
              id: "bib-jr-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Within Christian resurrection language:",
              items: [
                "the condition of death",
                "embodiment as interpreted in resurrection theology",
                "the relation between mortality and raised life",
                "the narrative situation after resurrection",
              ],
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Resurrection is not biological metamorphosis.\n\nIt is not ecological succession.\n\nIt is not psychological recovery.\n\nIt is not a systems regime shift.\n\nWithin Christian theology, resurrection is presented as an act of God and as something that exceeds ordinary biological processes.\n\nDo not reduce resurrection to “nature's cycle of death and rebirth.”\n\nDo not claim that resurrection empirically demonstrates the Evolutionary Spiral.",
          },
          sources: [
            {
              id: "bib-jr-gospel-narratives",
              // Dossier records Gospel plot shape without a verse inventory.
              title: "Gospel death, burial, and resurrection narratives",
              supports:
                "Primary-text narrative sequence of crucifixion, death, burial, and proclamation of resurrection.",
            },
            {
              id: "bib-jr-1cor-15",
              title: "1 Corinthians 15",
              supports:
                "Primary-text theological argument placing death, burial, and raised life in continuity and discontinuity.",
            },
            {
              id: "bib-jr-wright-2003",
              title: "The Resurrection of the Son of God",
              authors: "N.T. Wright",
              year: 2003,
              publication: "Fortress",
              supports:
                "Theological/historical reading of early Christian resurrection as transformed bodily life, not mere resuscitation.",
            },
          ],
        },
        {
          id: "bib-seed-death-life",
          title: "The seed that dies",
          summary:
            "The text itself uses biological imagery to speak about death and fruitfulness.",
          epistemicKind: "textual-observation",
          epistemicKinds: ["textual-observation", "textual-interpretation"],
          whisper:
            "The metaphor depends on continuity without sameness of form.",
          sections: [
            {
              id: "bib-seed-body",
              kind: "general",
              title: "",
              body: "In John 12:24, Jesus uses the image of a grain of wheat falling into the earth and dying before bearing much fruit.\n\nThe image places loss and generativity beside one another.\n\nA seed does not remain visibly what it was while becoming what follows from it.\n\nBut the Gospel's use of seed imagery is not a scientific theory of transformation.\n\nIt is a metaphor within a particular narrative and theological context.\n\nFor this lens, its importance lies in the structure of the image:\n\ncontinuity does not require preservation of the original visible form.\n\nThat resemblance gives us something to compare.\n\nIt does not establish a shared mechanism with biological development, ecological succession, or the Evolutionary Spiral.",
            },
            {
              id: "bib-seed-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Within the metaphor:",
              items: [
                "continuity between seed and what develops from it",
                "the history of what was planted",
                "the relation between what precedes and what follows",
              ],
            },
            {
              id: "bib-seed-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Within the metaphor:",
              items: [
                "visible form",
                "organization",
                "condition",
                "relation to what comes after",
              ],
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "A seed germinating is not literally resurrecting.\n\nThe Gospel's metaphor should not be converted into a biological proof of Christian theology.\n\nLikewise, its use in a theological text does not establish a universal scientific law that death produces renewal.\n\nThe comparison is textual and structural.",
          },
          sources: [
            {
              id: "bib-seed-john-12-24",
              title: "John 12:24",
              supports:
                "Primary-text seed/death/fruit imagery. Paraphrased in the concept body; not presented as a full quotation from a named translation.",
            },
          ],
        },
        {
          id: "bib-sown-raised",
          title: "Sown & raised",
          summary: "Paul describes resurrection through continuity and difference.",
          epistemicKind: "textual-observation",
          epistemicKinds: ["textual-observation", "theological-interpretation"],
          whisper:
            "Continuity and transformation are held together rather than treated as opposites.",
          sections: [
            {
              id: "bib-sown-body",
              kind: "general",
              title: "",
              body: "In 1 Corinthians 15, Paul uses sowing imagery while discussing resurrection.\n\nThe body that is sown and the body that is raised are described in relation to one another, but not as identical conditions.\n\nThe passage therefore holds continuity and transformation together.\n\nSomething is not discarded from the story merely because its condition changes radically.\n\nWithin Christian theology, this language participates in a claim about resurrection.\n\nWithin the Spiral, we can observe a structural question:\n\nHow can identity continue when the form or condition of continuation changes?\n\nThat is a comparison we are making.\n\nIt should not be presented as Paul's systems model.",
            },
            {
              id: "bib-sown-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Within the theological argument:",
              items: [
                "continuity of the person",
                "continuity between what is sown and what is raised",
                "the history of embodied existence",
              ],
            },
            {
              id: "bib-sown-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Within Paul's resurrection language:",
              items: [
                "condition",
                "qualities attributed to embodiment",
                "mortality / imperishability",
                "the form in which continuity is described",
              ],
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Paul is making a theological argument about resurrection.\n\nHe is not describing:\n\nbiological metamorphosis\n\nevolutionary inheritance\n\necological recovery\n\npsychological integration\n\nsystems hysteresis\n\nDo not translate theological language into empirical mechanism.",
          },
          sources: [
            {
              id: "bib-sown-1cor-15-36-44",
              title: "1 Corinthians 15:36–44",
              supports:
                "Primary-text sowing/raised-body imagery; continuity and discontinuity. Paraphrased in the concept body; not presented as a full quotation from a named translation.",
            },
            {
              id: "bib-sown-wright-2003",
              title: "The Resurrection of the Son of God",
              authors: "N.T. Wright",
              year: 2003,
              publication: "Fortress",
              supports:
                "Theological interpretation of early Christian resurrection language, including transformed bodily life.",
            },
          ],
        },
        {
          id: "bib-exile-return",
          title: "Exile, return & covenant renewal",
          summary: "Return does not erase the history of exile.",
          epistemicKind: "textual-observation",
          epistemicKinds: ["textual-observation", "textual-interpretation"],
          whisper: "Return is not the same thing as going backward in time.",
          sections: [
            {
              id: "bib-exile-body",
              kind: "general",
              title: "",
              body: "Across the Hebrew Bible, covenant, displacement, exile, return, and renewal create recurring structures of rupture and continuity.\n\nExile represents more than movement from one location to another.\n\nIt can involve the disruption of land, political order, communal identity, worship, expectation, and inherited understandings of covenant.\n\nTexts of return and restoration do not simply make that history disappear.\n\nThe people who return carry the history of displacement with them.\n\nThis makes exile and return relevant to the Spiral's question of recurrence with history.\n\nBut “exile → return” should not be treated as a single formula governing the entire biblical canon.\n\nDifferent texts interpret exile, covenant, judgment, restoration, and renewal differently.",
            },
            {
              id: "bib-exile-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Across these textual traditions, potentially:",
              items: [
                "communal identity",
                "covenant memory",
                "inherited texts and practices",
                "relationship to land",
                "relationship to God",
                "collective history",
              ],
            },
            {
              id: "bib-exile-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Potentially:",
              items: [
                "political organization",
                "geography",
                "institutions",
                "communal expectations",
                "theological interpretation",
                "practices",
                "understandings of restoration",
              ],
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "Do not turn biblical exile into:\n\necological disturbance\n\npsychological trauma\n\nsystems collapse\n\na universal stage every society must experience\n\nDo not imply that all biblical authors describe exile and restoration identically.\n\nDo not claim that rupture was valuable merely because later renewal language exists.",
          },
          sources: [
            {
              id: "bib-exile-brueggemann-delivered-2021",
              title: "Delivered into Covenant",
              authors: "Walter Brueggemann",
              year: 2021,
              publication: "WJK",
              supports:
                "Textual interpretation of wilderness/liminal reorganization and related covenant disruption patterns.",
            },
            {
              id: "bib-exile-brueggemann-wilderness-2021",
              title: "A Wilderness Zone",
              authors: "Walter Brueggemann",
              year: 2021,
              supports:
                "Textual interpretation of wilderness as liminal zone; exile as wilderness reprise.",
            },
            {
              id: "bib-exile-saet-exodus-motif",
              // Dossier title ellipsis; authors/year/URL absent from dossier.
              title: "The Exodus Motif…",
              publication: "St Andrews Encyclopaedia of Theology",
              supports:
                "Observation that Exodus themes are reused across the Christian biblical canon.",
            },
          ],
        },
        {
          id: "bib-new-creation",
          title: "New creation",
          summary:
            "Biblical renewal can be described as more than restoration of an earlier condition.",
          epistemicKind: "textual-observation",
          epistemicKinds: ["textual-observation", "theological-interpretation"],
          whisper: "Made new is not necessarily the same as made again.",
          sections: [
            {
              id: "bib-nc-body",
              kind: "general",
              title: "",
              body: "New Testament language of new creation introduces a form of renewal that is not simply return to a previous state.\n\nThe language points toward continuity with creation and history while also describing something genuinely new.\n\nWithin Christian theology, new creation can therefore hold preservation and transformation together:\n\ncreation is not treated as though it never existed, yet renewal is not merely a reset to an untouched beginning.\n\nThis makes new creation especially relevant to the Spiral's distinction between recurrence and repetition.\n\nBut the similarity remains interpretive.\n\nChristian eschatology is not a theory of cyclic systems behavior.",
            },
            {
              id: "bib-nc-persists",
              kind: "what-persists",
              title: "What persists",
              body: "Within the theological frame:",
              items: [
                "creation",
                "history",
                "identity",
                "relationship",
                "the significance of what came before",
              ],
            },
            {
              id: "bib-nc-changes",
              kind: "what-changes",
              title: "What changes",
              body: "Within new-creation language:",
              items: [
                "the condition of creation",
                "mortality and corruption as interpreted theologically",
                "the relationship between present and renewed creation",
                "expectations about the future",
              ],
            },
          ],
          comparisonBreaks: {
            title: "Where the comparison breaks",
            body: "New creation is not:\n\necological succession\n\nanother turn of a natural cycle\n\nbiological regeneration\n\nevidence that history endlessly repeats\n\nproof of the Evolutionary Spiral\n\nChristian eschatological language can be linear, culminative, and future-oriented in ways that resist a simple cyclical reading.\n\nPreserve that tension.",
          },
          sources: [
            {
              id: "bib-nc-wright-2003",
              title: "The Resurrection of the Son of God",
              authors: "N.T. Wright",
              year: 2003,
              publication: "Fortress",
              supports:
                "Theological interpretation linking early Christian resurrection language with new creation.",
            },
            // Primary-verse gap: M1B-R names new creation thematically without an authored
            // verse inventory for this concept.
          ],
        },
      ],
      comparisonBreaks: {
        title: "Where the biblical comparison breaks",
        body: "Biblical texts are not describing ecological succession, psychological reconsolidation, biological metamorphosis, or systems hysteresis.\n\nResurrection in Christian theology is not ordinary recurrence after disruption. It is presented as an act of God and, particularly in the New Testament, as something that exceeds ordinary biological processes.\n\nLikewise, exile and return, seed imagery, resurrection, and new creation do not form a single scientific transformation mechanism simply because their narratives can be compared.\n\nStructural resemblance gives us a reason to ask questions across domains.\n\nIt does not establish a shared mechanism, common historical origin, or equal evidentiary status.\n\nThe biblical material should be allowed to remain theological where it is theological, textual where it is textual, and historically particular where it is historically particular.",
      },
      openQuestions: [
        "When a tradition speaks of something being made new, what does it understand as continuous with what came before?",
      ],
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
