import type { SpiralSourceRef, SpiralTrajectory } from "../types";

/**
 * Lodgepole pine regeneration after stand-replacing fire — Greater Yellowstone.
 * An empirical, branching trajectory. Steps are ecological conditions of a
 * stand, not Spiral stages; edges are domain topology, not comparisons.
 * No relationships exist for this trajectory.
 *
 * Every source below was verified in the Phase 2C research dossier.
 * Edge citations add only `supports`; bibliographic fields never vary.
 */

const TURNER_1997: SpiralSourceRef = {
  id: "turner-1997",
  title: "Effects of fire size and pattern on early succession in Yellowstone National Park",
  authors: "Turner MG, Romme WH, Gardner RH, Hargrove WW",
  year: 1997,
  publication: "Ecological Monographs 67(4): 411–433",
  doi: "10.1890/0012-9615(1997)067[0411:EOFSAP]2.0.CO;2",
};

const TURNER_ROMME_TINKER_2003: SpiralSourceRef = {
  id: "turner-romme-tinker-2003",
  title: "Surprises and lessons from the 1988 Yellowstone fires",
  authors: "Turner MG, Romme WH, Tinker DB",
  year: 2003,
  publication: "Frontiers in Ecology and the Environment 1(7): 351–358",
  doi: "10.1890/1540-9295(2003)001[0351:SALFTY]2.0.CO;2",
};

const TURNER_2003_ASPEN: SpiralSourceRef = {
  id: "turner-2003-aspen",
  title: "Post-fire aspen seedling recruitment across the Yellowstone (USA) landscape",
  authors: "Turner MG, Romme WH, Reed RA, Tuskan GA",
  year: 2003,
  publication: "Landscape Ecology 18: 127–140",
  doi: "10.1023/A:1024462501689",
};

const ROMME_2011: SpiralSourceRef = {
  id: "romme-2011",
  title: "Twenty years after the 1988 Yellowstone fires: lessons about disturbance and ecosystems",
  authors: "Romme WH, Boyce MS, Gresswell RE, Merrill EH, Minshall GW, Whitlock C, Turner MG",
  year: 2011,
  publication: "Ecosystems 14(7): 1196–1215",
  doi: "10.1007/s10021-011-9470-6",
};

const TURNER_2016: SpiralSourceRef = {
  id: "turner-2016",
  title:
    "Twenty-four years after the Yellowstone Fires: Are postfire lodgepole pine stands converging in structure and function?",
  authors: "Turner MG, Whitby TG, Tinker DB, Romme WH",
  year: 2016,
  publication: "Ecology 97(5): 1260–1273",
  doi: "10.1890/15-1585.1",
};

/** DOI not verified — cited by its verified JSTOR record. */
const KASHIAN_2005: SpiralSourceRef = {
  id: "kashian-2005",
  title: "Variability and convergence in stand structural development on a fire-dominated subalpine landscape",
  authors: "Kashian DM, Turner MG, Romme WH, Lorimer CG",
  year: 2005,
  publication: "Ecology 86(3): 643–654",
  url: "https://www.jstor.org/stable/3450659",
};

const SCHOENNAGEL_2003: SpiralSourceRef = {
  id: "schoennagel-2003",
  title: "The influence of fire interval and serotiny on postfire lodgepole pine density in Yellowstone National Park",
  authors: "Schoennagel T, Turner MG, Romme WH",
  year: 2003,
  publication: "Ecology 84(11): 2967–2978",
  doi: "10.1890/02-0277",
};

const TINKER_1994: SpiralSourceRef = {
  id: "tinker-1994",
  title: "Landscape-scale heterogeneity in lodgepole pine serotiny",
  authors: "Tinker DB, Romme WH, Hargrove WW, Gardner RH, Turner MG",
  year: 1994,
  publication: "Canadian Journal of Forest Research 24: 897–903",
  doi: "10.1139/x94-118",
};

const ROMME_1982: SpiralSourceRef = {
  id: "romme-1982",
  title: "Fire and landscape diversity in subalpine forests of Yellowstone National Park",
  authors: "Romme WH",
  year: 1982,
  publication: "Ecological Monographs 52(2): 199–221",
  doi: "10.2307/1942611",
};

const TURNER_2019: SpiralSourceRef = {
  id: "turner-2019",
  title: "Short-interval severe fire erodes the resilience of subalpine lodgepole pine forests",
  authors: "Turner MG, Braziunas KH, Hansen WD, Harvey BJ",
  year: 2019,
  publication: "Proceedings of the National Academy of Sciences 116(23): 11319–11328",
  doi: "10.1073/pnas.1902841116",
};

const BRAZIUNAS_2023: SpiralSourceRef = {
  id: "braziunas-2023",
  title:
    "Less fuel for the next fire? Short-interval fire delays forest recovery and interacting drivers amplify effects",
  authors: "Braziunas KH, Kiel NG, Turner MG",
  year: 2023,
  publication: "Ecology e4042",
  doi: "10.1002/ecy.4042",
};

const HARVEY_2016: SpiralSourceRef = {
  id: "harvey-2016",
  title:
    "High and dry: post-fire tree seedling establishment in subalpine forests decreases with post-fire drought and large stand-replacing burn patches",
  authors: "Harvey BJ, Donato DC, Turner MG",
  year: 2016,
  publication: "Global Ecology and Biogeography 25(6): 655–669",
  doi: "10.1111/geb.12443",
};

const HOECKER_2020: SpiralSourceRef = {
  id: "hoecker-2020",
  title:
    "Topographic position amplifies consequences of short-interval stand-replacing fires on postfire tree establishment in subalpine conifer forests",
  authors: "Hoecker TJ, Hansen WD, Turner MG",
  year: 2020,
  publication: "Forest Ecology and Management 478: 118523",
  doi: "10.1016/j.foreco.2020.118523",
};

const HANSEN_TURNER_2019: SpiralSourceRef = {
  id: "hansen-turner-2019",
  title: "Origins of abrupt change? Postfire subalpine conifer regeneration declines nonlinearly with warming and drying",
  authors: "Hansen WD, Turner MG",
  year: 2019,
  publication: "Ecological Monographs 89(1): e01340",
  doi: "10.1002/ecm.1340",
};

const HANSEN_2018: SpiralSourceRef = {
  id: "hansen-2018",
  title:
    "It takes a few to tango: changing climate and fire regimes can cause regeneration failure of two subalpine conifers",
  authors: "Hansen WD, Braziunas KH, Rammer W, Seidl R, Turner MG",
  year: 2018,
  publication: "Ecology 99(4): 966–977",
  doi: "10.1002/ecy.2181",
};

const TURNER_2022: SpiralSourceRef = {
  id: "turner-2022",
  title: "The magnitude, direction, and tempo of forest change in Greater Yellowstone in a warmer world with more fire",
  authors: "Turner MG, Braziunas KH, Hansen WD, Hoecker TJ, Rammer W, Ratajczak Z, Westerling AL, Seidl R",
  year: 2022,
  publication: "Ecological Monographs 92(1): e01485",
  doi: "10.1002/ecm.1485",
};

const WESTERLING_2011: SpiralSourceRef = {
  id: "westerling-2011",
  title: "Continued warming could transform Greater Yellowstone fire regimes by mid-21st century",
  authors: "Westerling AL, Turner MG, Smithwick EAH, Romme WH, Ryan MG",
  year: 2011,
  publication: "Proceedings of the National Academy of Sciences 108(32): 13165–13170",
  doi: "10.1073/pnas.1110199108",
};

const JOHNSTONE_2016: SpiralSourceRef = {
  id: "johnstone-2016",
  title: "Changing disturbance regimes, ecological memory, and forest resilience",
  authors:
    "Johnstone JF, Allen CD, Franklin JF, Frelich LE, Harvey BJ, Higuera PE, Mack MC, Meentemeyer RK, Metz MR, Perry GLW, Schoennagel T, Turner MG",
  year: 2016,
  publication: "Frontiers in Ecology and the Environment 14(7): 369–378",
  doi: "10.1002/fee.1311",
};

const SEIDL_TURNER_2022: SpiralSourceRef = {
  id: "seidl-turner-2022",
  title: "Post-disturbance reorganization of forest ecosystems in a changing world",
  authors: "Seidl R, Turner MG",
  year: 2022,
  publication: "Proceedings of the National Academy of Sciences 119(28): e2202190119",
  doi: "10.1073/pnas.2202190119",
};

const COOP_2020: SpiralSourceRef = {
  id: "coop-2020",
  title: "Wildfire-driven forest conversion in western North American landscapes",
  authors:
    "Coop JD, Parks SA, Stevens-Rumann CS, Crausbay SD, Higuera PE, Hurteau MD, Tepley A, Whitman E, Assal T, Collins BM, Davis KT, Dobrowski S, Falk DA, Fornwalt PJ, Fulé PZ, Harvey BJ, Kane VR, Littlefield CE, Margolis EQ, North M, Parisien M-A, Prichard S, Rodman KC",
  year: 2020,
  publication: "BioScience 70(8): 659–673",
  doi: "10.1093/biosci/biaa061",
};

const RATAJCZAK_2018: SpiralSourceRef = {
  id: "ratajczak-2018",
  title: "Abrupt change in ecological systems: inference and diagnosis",
  authors: "Ratajczak Z, Carpenter SR, Ives AR, Kucharik CJ, Ramiadantsoa T, Stegner MA, Williams JW, Zhang J, Turner MG",
  year: 2018,
  publication: "Trends in Ecology & Evolution 33(7): 513–526",
  doi: "10.1016/j.tree.2018.04.013",
};

const SCHEFFER_2001: SpiralSourceRef = {
  id: "scheffer-2001",
  title: "Catastrophic shifts in ecosystems",
  authors: "Scheffer M, Carpenter S, Foley JA, Folke C, Walker B",
  year: 2001,
  publication: "Nature 413: 591–596",
  doi: "10.1038/35098000",
};

const HOLLING_1973: SpiralSourceRef = {
  id: "holling-1973",
  title: "Resilience and stability of ecological systems",
  authors: "Holling CS",
  year: 1973,
  publication: "Annual Review of Ecology and Systematics 4: 1–23",
  doi: "10.1146/annurev.es.04.110173.000245",
};

/** The DOI identifies the edited volume, not the chapter. */
const HOLLING_1996: SpiralSourceRef = {
  id: "holling-1996",
  title: "Engineering resilience versus ecological resilience",
  authors: "Holling CS",
  year: 1996,
  publication:
    "In Schulze P (ed.), Engineering Within Ecological Constraints, pp. 31–44. National Academy Press",
  doi: "10.17226/4919",
};

const HODGSON_2015: SpiralSourceRef = {
  id: "hodgson-2015",
  title: "What do you mean, ‘resilient’?",
  authors: "Hodgson D, McDonald JL, Hosken DJ",
  year: 2015,
  publication: "Trends in Ecology & Evolution 30(9): 503–506",
  doi: "10.1016/j.tree.2015.06.010",
};

const cite = (source: SpiralSourceRef, supports: string): SpiralSourceRef => ({
  ...source,
  supports,
});

export const LODGEPOLE_FIRE_TRAJECTORY: SpiralTrajectory = {
  id: "lodgepole-fire-regeneration",
  lensId: "ecology",
  title: "Lodgepole pine regeneration after stand-replacing fire",
  shortTitle: "Lodgepole pine after fire",
  inPhrase: "lodgepole pine regeneration in Greater Yellowstone",
  description:
    "Fire replaces a stand of lodgepole pine. What grows back depends on what the fire leaves, and on how soon fire returns.",
  shape: "branching",
  evidenceStandard: "empirical",
  steps: [
    { id: "mature-stand", label: "Mature lodgepole pine stand" },
    { id: "crown-fire", label: "Stand-replacing fire" },
    { id: "burned-stand", label: "Burned stand with legacies" },
    { id: "establishment", label: "Seedling establishment window" },
    { id: "dense-cohort", label: "Dense lodgepole cohort" },
    { id: "sparse-cohort", label: "Sparse lodgepole cohort" },
    { id: "minimal-recruitment", label: "Little or no tree recruitment" },
    { id: "young-stand", label: "Young developing stand" },
    { id: "sparse-woodland", label: "Persistent sparse woodland" },
    { id: "reburn", label: "Short-interval reburn" },
  ],
  transitions: [
    {
      id: "mature-to-fire",
      from: "mature-stand",
      to: "crown-fire",
      conditions:
        "More likely as stands age. Historical intervals were about 135–185 years at lower and 280–310 years at higher plateau elevations, and roughly 300–400 years in one subalpine watershed.",
      epistemicKinds: ["empirical-observation"],
      sources: [
        cite(SCHOENNAGEL_2003, "Historical fire intervals by elevation on the Yellowstone plateau."),
        cite(ROMME_1982, "Fire history since 1600 in one watershed; crown-fire fuels develop over about 300–400 years."),
      ],
    },
    {
      id: "fire-to-burned",
      from: "crown-fire",
      to: "burned-stand",
      conditions:
        "Canopy trees are killed. Serotinous cones in the burned canopy open and release seed; some understory plants survive to resprout.",
      epistemicKinds: ["empirical-observation", "empirical-mechanism"],
      sources: [
        cite(TURNER_1997, "Biotic residuals — resprouting survivors and on-site seed — persisted after the 1988 fires."),
        cite(TINKER_1994, "Pre-fire density of serotinous trees was the best predictor of post-fire seedling density."),
      ],
    },
    {
      id: "burned-to-establishment",
      from: "burned-stand",
      to: "establishment",
      outcome: "continues",
      conditions:
        "In the first years, resprouting survivors supplied most plant cover; dispersal from unburned forest was unimportant early on.",
      epistemicKinds: ["empirical-observation"],
      sources: [
        cite(TURNER_1997, "Survivors dominated cover in the first three years; dispersal from unburned forest was unimportant."),
        cite(TURNER_ROMME_TINKER_2003, "Native species restored plant cover rapidly after the 1988 fires."),
      ],
    },
    {
      id: "establishment-to-dense",
      from: "establishment",
      to: "dense-cohort",
      conditions:
        "Favored by high pre-fire serotiny, which is more common at lower elevations and in stands old enough to bear many serotinous cones.",
      epistemicKinds: ["empirical-observation", "empirical-mechanism"],
      sources: [
        cite(SCHOENNAGEL_2003, "At low elevations, post-fire density tracks pre-fire serotiny, which rises with stand age."),
        cite(TINKER_1994, "Serotiny varies most at 1–10 km scales and predicts seedling density."),
        cite(TURNER_1997, "Geographic location, tied to serotiny, best explained post-fire vegetation."),
      ],
    },
    {
      id: "establishment-to-sparse",
      from: "establishment",
      to: "sparse-cohort",
      conditions:
        "More likely where pre-fire serotiny was low — at higher elevations, and in stands too young to bear many serotinous cones.",
      epistemicKinds: ["empirical-observation", "empirical-mechanism"],
      sources: [
        cite(SCHOENNAGEL_2003, "Serotiny is low at high elevations and in young stands, rising with tree age up to about 140 years."),
        cite(TURNER_2016, "Post-fire densities at 24 years ranged over several orders of magnitude, including sparse stands."),
      ],
    },
    {
      id: "establishment-to-minimal",
      from: "establishment",
      to: "minimal-recruitment",
      outcome: "failure",
      conditions:
        "Observed in some plots: stem density at 24 years ranged down to zero, and re-establishment was doubtful in old (>400-year), low-serotiny stands. Failure means little or no recruitment within the observed window.",
      epistemicKinds: ["empirical-observation"],
      sources: [
        cite(TURNER_1997, "Forest re-establishment was questionable in old, low-serotiny forests."),
        cite(TURNER_2016, "Stem density 24 years after fire ranged from 0 to 344,067 stems/ha."),
      ],
    },
    {
      id: "dense-to-young",
      from: "dense-cohort",
      to: "young-stand",
      outcome: "continues",
      conditions:
        "Very dense cohorts self-thin: between years 11 and 24, density fell where it had exceeded about 72,000 stems/ha.",
      epistemicKinds: ["empirical-observation"],
      sources: [
        cite(TURNER_2016, "Density declined between years 11 and 24 where it had exceeded about 72,000 stems/ha."),
        cite(KASHIAN_2005, "Self-thinning of dense stands narrows structural variability over time."),
      ],
    },
    {
      id: "sparse-to-young",
      from: "sparse-cohort",
      to: "young-stand",
      conditions:
        "Associated with continued recruitment (infilling) over decades without reburn; inferred from a chronosequence of stands that burned before 1988.",
      epistemicKinds: ["empirical-observation"],
      sources: [
        cite(KASHIAN_2005, "Initially sparse stands filled in over decades, narrowing structural variability."),
        cite(TURNER_2016, "Stem density increased between years 11 and 24 in most plots."),
      ],
    },
    {
      id: "sparse-to-woodland",
      from: "sparse-cohort",
      to: "sparse-woodland",
      outcome: "reorganization",
      conditions:
        "Where infilling has not occurred, sparse structure persists through the observed window (about 24–30 years). Persistence beyond that window is not observed.",
      epistemicKinds: ["empirical-observation", "conceptual-framework"],
      sources: [
        cite(TURNER_2016, "Sparse stands remained sparse 24 years after the 1988 fires; structure had not converged."),
        cite(BRAZIUNAS_2023, "Stands burned at short intervals remained sparse, with low biomass and fuels, nearly 30 years after fire."),
        cite(SEIDL_TURNER_2022, "Names this pathway restructuring: structure changes while species composition stays the same."),
      ],
    },
    {
      id: "young-to-mature",
      from: "young-stand",
      to: "mature-stand",
      outcome: "recovery",
      conditions:
        "Requires a fire-free interval long enough for structure to converge: density variability narrows by about 125 years and stabilizes beyond about 200. Function converges sooner than structure.",
      epistemicKinds: ["empirical-observation"],
      sources: [
        cite(KASHIAN_2005, "Coefficient of variation in density fell from 231% at 12 years to 37% at 200–250 years."),
        cite(TURNER_2016, "Function is expected to converge before structure."),
        cite(TURNER_1997, "Succession was moving toward communities like those that burned."),
      ],
    },
    {
      id: "young-to-reburn",
      from: "young-stand",
      to: "reburn",
      conditions:
        "A second stand-replacing fire within about 30 years, before young trees bear many serotinous cones; observed in 2016 reburns of forests regenerating after 1988 and 2000.",
      epistemicKinds: ["empirical-observation", "empirical-mechanism"],
      sources: [
        cite(TURNER_2019, "2016 fires reburned young forests that had regenerated after the 1988 and 2000 fires."),
        cite(SCHOENNAGEL_2003, "Young trees are rarely serotinous; serotiny rises with age."),
        cite(BRAZIUNAS_2023, "Paired plots across 27 short-interval reburns."),
      ],
    },
    {
      id: "reburn-to-sparse",
      from: "reburn",
      to: "sparse-cohort",
      conditions:
        "Seedling density far lower after reburn; dense stands became sparse. Effects were larger farther from live forest edges.",
      epistemicKinds: ["empirical-observation"],
      sources: [
        cite(TURNER_2019, "Seedling density sixfold lower after reburn; stands above 40,000 stems/ha became stands below 1,000."),
        cite(BRAZIUNAS_2023, "3,240 vs 28,741 stems/ha after short- vs long-interval fire, amplified with distance to live edge."),
      ],
    },
    {
      id: "reburn-to-minimal",
      from: "reburn",
      to: "minimal-recruitment",
      outcome: "failure",
      conditions:
        "More likely far from live forest edges and on warm, south-facing slopes, where hot soils are associated with very low establishment. Failure means little or no recruitment within the observed window.",
      epistemicKinds: ["empirical-observation", "empirical-mechanism"],
      sources: [
        cite(HOECKER_2020, "Under 1% of planted seed established on south aspects; short-interval burn soils ran about 2 °C warmer, often above 40 °C."),
        cite(BRAZIUNAS_2023, "Reburn effects on density were amplified with distance to live forest edge."),
        cite(TURNER_2019, "Reburns produced extreme burn severity and sparse regeneration."),
      ],
    },
  ],
  concepts: [
    {
      id: "lp-legacies",
      title: "Ecological memory: information and material legacies",
      summary:
        "What the past fire regime and the burned stand leave behind shapes what grows back.",
      epistemicKinds: ["conceptual-framework", "empirical-observation", "empirical-mechanism"],
      sections: [
        {
          id: "lp-legacies-framework",
          kind: "summary",
          title: "Two kinds of legacy",
          body: "Johnstone et al. (2016) distinguish information legacies — adaptations shaped by a past disturbance regime, such as serotiny — from material legacies — what one disturbance leaves on site: seeds, survivors, dead wood, nutrients, structures. This is a conceptual framework; the Yellowstone studies supply the evidence.",
        },
        {
          id: "lp-legacies-evidence",
          kind: "pattern",
          title: "In Greater Yellowstone",
          items: [
            "Pre-fire density of serotinous trees was the best predictor of post-fire seedling density; serotiny varies most at scales of 1–10 km (Tinker et al. 1994).",
            "Serotiny rises with tree age up to about 140 years and is low at high elevations (Schoennagel et al. 2003).",
            "Resprouting survivors and on-site seed, not dispersal from unburned forest, rebuilt early plant cover (Turner et al. 1997).",
            "Serotinous lodgepole establishment was not reduced by post-fire drought or distance to seed, unlike spruce and fir (Harvey et al. 2016).",
            "Distance to a live forest edge — a spatial legacy — amplified the effects of reburn (Braziunas et al. 2023).",
          ],
        },
        {
          id: "lp-legacies-depletion",
          kind: "mechanism",
          title: "When memory is depleted",
          body: "A reburn within about 30 years arrives before young trees bear many serotinous cones. Seedling density fell sharply, and coarse wood and carbon were greatly reduced (Turner et al. 2019). Johnstone et al. call capacity that is lost but only revealed by the next disturbance resilience debt.",
        },
      ],
      comparisonBreaks: {
        body: "Ecological memory names legacies — traits, seed, survivors, structures, spatial pattern. It is not recollection, intention, or a record of experience.",
      },
      sources: [
        cite(JOHNSTONE_2016, "Information vs material legacies; resilience debt. Conceptual framework."),
        cite(TINKER_1994, "Serotiny pattern and its prediction of seedling density."),
        cite(SCHOENNAGEL_2003, "Serotiny by tree age and elevation."),
        cite(TURNER_1997, "Survivors and on-site seed rebuilt early cover."),
        cite(HARVEY_2016, "Serotinous lodgepole establishment insensitive to drought and seed distance."),
        cite(TURNER_2019, "Reburn depletes seed, coarse wood and carbon."),
        cite(BRAZIUNAS_2023, "Distance to live edge amplifies reburn effects."),
      ],
    },
    {
      id: "lp-resistance-resilience",
      title: "Low resistance, high resilience",
      summary:
        "Stand-replacing fire kills canopy lodgepole pine, yet the forest has historically regenerated after it.",
      epistemicKinds: ["conceptual-framework", "empirical-observation"],
      sections: [
        {
          id: "lp-rr-terms",
          kind: "general",
          title: "Four separate ideas",
          items: [
            "Resistance — how much a system changes when disturbed (Hodgson et al. 2015). Low here: canopy trees die.",
            "Recovery rate — how fast a measured attribute returns (engineering resilience; Holling 1996). It differs by attribute: composition returns early, function sooner than structure, structure over about 125–200 years (Turner et al. 2016; Kashian et al. 2005).",
            "Ecological resilience — how much disturbance a system absorbs without changing regime (Holling 1973, 1996). Historically high: after the 1988 fires, succession moved toward communities like those that burned (Turner et al. 1997), and mean density 24 years later was about 21,700 stems/ha (Turner et al. 2016).",
            "Persistence — the forest type and its fire regime continue across the landscape while individual stands are replaced (Romme 1982).",
          ],
        },
        {
          id: "lp-rr-limits",
          kind: "epistemic-status",
          title: "Not a guarantee",
          body: "Historical resilience does not guarantee recovery under altered conditions. Short-interval reburn sharply reduced regeneration (Turner et al. 2019), and warmer, drier post-fire conditions reduced lodgepole establishment by 92% in field experiments (Hansen & Turner 2019).",
        },
      ],
      comparisonBreaks: {
        body: "Resistance and resilience are different properties. Neither is “bouncing back.”",
      },
      sources: [
        cite(HODGSON_2015, "Resistance and recovery as separate components of resilience."),
        cite(HOLLING_1996, "Engineering vs ecological resilience."),
        cite(HOLLING_1973, "Ecological resilience as absorption of disturbance."),
        cite(TURNER_1997, "Succession toward communities like those that burned."),
        cite(TURNER_2016, "Mean density at 24 years; function converges before structure."),
        cite(KASHIAN_2005, "Structural convergence over about 125–200 years."),
        cite(ROMME_1982, "A cyclic landscape mosaic maintained by stand-replacing fire."),
        cite(TURNER_2019, "Short-interval reburn erodes resilience."),
        cite(HANSEN_TURNER_2019, "Warmer, drier conditions reduced lodgepole establishment by 92%."),
      ],
    },
    {
      id: "lp-scale",
      title: "One fire, several scales",
      summary:
        "The same fire is death, release, replacement, reset, and heterogeneity — depending on the scale observed.",
      epistemicKinds: ["empirical-observation", "model-projection"],
      sections: [
        {
          id: "lp-scale-readings",
          kind: "general",
          title: "Different descriptions, not a hierarchy",
          body: "This trajectory follows the stand. Each line below is another true description of the same event; none ranks above another.",
          items: [
            "Tree: canopy trees die; serotinous cones release seed (Turner et al. 1997; Tinker et al. 1994).",
            "Population: lodgepole pine persists through the canopy seed bank (Schoennagel et al. 2003).",
            "Stand: structure is replaced; 24 years later densities ranged from zero to more than 300,000 stems/ha (Turner et al. 2016).",
            "Ecosystem: productivity tracks stem density and converges before structure (Turner et al. 2016); after reburn, simulated carbon recovery was delayed by more than 150 years (Turner et al. 2019, model).",
            "Landscape: fire creates heterogeneity; the landscape is a nonsteady-state, cyclic mosaic, not an equilibrium (Romme 1982; Turner, Romme & Tinker 2003).",
          ],
        },
      ],
      sources: [
        cite(TURNER_1997, "Tree- and stand-scale effects of the 1988 fires."),
        cite(TINKER_1994, "Serotinous seed release."),
        cite(SCHOENNAGEL_2003, "Population persistence through serotiny."),
        cite(TURNER_2016, "Stand density range and productivity at 24 years."),
        cite(TURNER_2019, "Simulated carbon recovery delay after reburn (model)."),
        cite(ROMME_1982, "Nonsteady-state, cyclic landscape mosaic."),
        cite(TURNER_ROMME_TINKER_2003, "Large fires as a source of landscape heterogeneity."),
      ],
    },
    {
      id: "lp-projections",
      title: "Projected futures are not drawn as topology",
      summary:
        "Models project more fire and sparser forest; none of that is observed, so none of it is a step or an edge.",
      epistemicKinds: ["model-projection", "empirical-observation"],
      sections: [
        {
          id: "lp-proj-models",
          kind: "general",
          title: "What models project",
          items: [
            "Fire rotation could fall below 30 years by mid-century, from 100–300 years historically (Westerling et al. 2011, model).",
            "Dense forests become sparse young woodlands; density, basal area and old forest decline in abrupt steps, before forest extent declines (Turner et al. 2022, model).",
            "Serotinous lodgepole failed to regenerate within 30 years only when fire intervals were 20 years or less and seed was about 1 km away (Hansen et al. 2018, model).",
          ],
        },
        {
          id: "lp-proj-observed",
          kind: "epistemic-status",
          title: "What has been observed",
          body: "Short-interval reburns did not transition to nonforest (Turner et al. 2019). Conversion of lodgepole forest to nonforest appears only in projections, so this trajectory has no nonforest branch.",
        },
      ],
      sources: [
        cite(WESTERLING_2011, "Projected fire rotation under continued warming (model)."),
        cite(TURNER_2022, "Projected forest change to 2100 in iLand simulations (model)."),
        cite(HANSEN_2018, "Simulated regeneration failure by fire interval and seed distance (model)."),
        cite(TURNER_2019, "Observed: reburns did not transition to nonforest."),
      ],
    },
    {
      id: "lp-terms",
      title: "Outcome terms on this trajectory",
      summary:
        "Failure, recovery and reorganization are used in narrow, measured senses — and some stronger terms are deliberately not used.",
      epistemicKinds: ["conceptual-framework"],
      sections: [
        {
          id: "lp-terms-used",
          kind: "general",
          title: "Used here",
          items: [
            "Failure: little or no tree recruitment within a stated observational window — not ecosystem death, permanent conversion, or a terminal state.",
            "Recovery: return of stand structure toward the pre-fire configuration over a long fire-free interval.",
            "Reorganization: sparse structure persisting through the observed window — “restructuring” in Seidl & Turner (2022).",
          ],
        },
        {
          id: "lp-terms-not-used",
          kind: "epistemic-status",
          title: "Not used here",
          items: [
            "Conversion: lacks a formal definition and requires change lasting longer than historical recovery times (Coop et al. 2020). Not observed in this system.",
            "Regime shift: Seidl & Turner use it for a trajectory toward nonforest; Scheffer et al. (2001) use it for a shift between alternative stable states. Neither is demonstrated here.",
            "Alternative stable states: require stabilizing feedbacks and hysteresis (Scheffer et al. 2001). Abrupt change has many causes, only some of which are transitions between alternative states (Ratajczak et al. 2018). Not claimed.",
          ],
        },
      ],
      sources: [
        cite(SEIDL_TURNER_2022, "Restructuring, reassembly, replacement; regime shift as a trajectory toward nonforest."),
        cite(COOP_2020, "Conversion lacks a formal definition; enduring means longer than historical recovery time."),
        cite(SCHEFFER_2001, "Alternative stable states, feedbacks and hysteresis. Framework only — not evidence for this system."),
        cite(RATAJCZAK_2018, "Only some abrupt changes are transitions between alternative states."),
      ],
    },
  ],
  framing:
    "An empirical trajectory from long-term research in Greater Yellowstone, much of it begun after the 1988 fires. It follows a stand — the ecological community on one patch of ground — through stand-replacing fire and what grows back.\n\nSteps are ecological conditions of a stand, not Spiral operations. Each edge carries its own conditions and sources. Conditions describe associations and likelihoods, not deterministic causes.\n\nEvery edge rests on field observation, field experiment, or chronosequence evidence from this system. Model projections of future fire and climate are kept in research, never drawn as steps or edges.\n\nThe graph ends at two steps — little or no tree recruitment, and persistent sparse woodland — because the authored evidence ends there. They are not terminal ecological states.",
  provenanceNote:
    "Greater Yellowstone research on subalpine lodgepole pine forests, reviewed in the Phase 2C research dossier. Lodgepole pine only; other forest types in the region are separate systems and are not part of this trajectory.",
  researchIssues: [
    {
      id: "lp-unknown-futures",
      question: "Why does the graph end at two steps?",
      body: "The graph ends here because the observed future remains uncertain. A sink marks where authored evidence stops, not a terminal ecological state.",
      items: [
        "Little or no tree recruitment: observed in some plots up to 24 years after the 1988 fires, and after short-interval reburns. Whether these stands later fill in, stay sparse, or lose tree cover has not been observed.",
        "Persistent sparse woodland: sparse structure observed up to about 30 years after fire. Chronosequence evidence shows sparse stands historically filled in over decades; whether today's sparse stands will, under a warmer climate and shorter fire intervals, is unknown.",
        "Neither step is connected onward, because no edge out of it is supported by observation in this system.",
      ],
    },
    {
      id: "lp-failure-window",
      question: "What does “failure” mean on these edges?",
      body: "Regeneration failure: little or no tree recruitment within a stated observational window — here, up to about 24–30 years after fire. It does not mean ecosystem death, permanent conversion to nonforest, or a terminal state. Modelling studies define failure operationally at 30 years (Hansen et al. 2018).",
    },
    {
      id: "lp-scale-followed",
      question: "Which scale does this trajectory follow?",
      body: "The stand — the ecological community. The same fire reads differently at the scale of the tree, the population, the ecosystem, and the landscape (see “One fire, several scales”). These are different descriptions, not levels of a hierarchy.",
    },
    {
      id: "lp-time-windows",
      question: "What timescales does the evidence cover?",
      body: "Evidence windows from specific studies — not universal stages:",
      items: [
        "0–3 years: resprouting survivors supply most plant cover; first seedlings (Turner et al. 1997).",
        "First years to about two decades: establishment. Seidl & Turner (2022) call the early post-disturbance window the “reorganization phase.”",
        "11–24 years: recruitment continued in most plots; self-thinning where density exceeded about 72,000 stems/ha (Turner et al. 2016).",
        "About 30 years: reburned stands still sparse with low fuels (Braziunas et al. 2023); simulations judge regeneration failure at 30 years (Hansen et al. 2018, model).",
        "About 125–200+ years: stand structure converges (Kashian et al. 2005, chronosequence).",
        "About 135–310 years across the plateau, and 300–400 years in one watershed: historical stand-replacing fire intervals (Schoennagel et al. 2003; Romme 1982).",
      ],
    },
    {
      id: "lp-composition",
      question: "Is composition changing after reburns?",
      body: "Aspen seedlings established after 1988 — a rare event — only in burned forest near adult clones (Turner et al. 2003). Aspen was more abundant after short-interval fire, but remained a minority (Braziunas et al. 2023). Whether this marks lasting compositional change is unknown, so it is not drawn as a branch.",
    },
  ],
  openQuestions: [
    "What remains continuous through stand-replacing fire?",
    "What makes this the same system after the stand is replaced?",
    "Does continuity live in composition, function, traits, place, or the fire regime?",
    "When does restructuring remain change of the same system?",
    "When would replacement be a better description?",
    "Can recurrence occur when the stand itself is replaced?",
    "Which scale should a comparison speak for?",
    "Does the loop back to a mature stand correspond to anything in the Spiral, or should it remain unmapped?",
    "How much resemblance may come from shared adaptive-cycle vocabulary rather than from the process itself?",
  ],
  comparisonBreaks: {
    title: "Cautions before any comparison",
    body: "Succession here is contingent — on serotiny, location, seed distance, fire interval and climate — not a fixed universal sequence (Turner et al. 1997; Romme et al. 2011).\n\nStand-replacing fire is historically part of this system's regime, not an interruption of it (Romme 1982; Turner, Romme & Tinker 2003).\n\nLow resistance coexists with high resilience: every canopy tree can die while the forest regenerates.\n\nRecovery depends on the attribute measured. Composition returns early, function sooner than structure, and structure over centuries.\n\nRecurrence does not restore the same stand. The loop returns a forest type, not the trees that burned.\n\nLocal replacement coexists with landscape persistence, and the landscape itself is not in equilibrium.\n\nEcological states are not healthy or damaged. Post-fire rehabilitation proved unnecessary and possibly counterproductive (Turner, Romme & Tinker 2003).\n\nSome ecological vocabulary comes from the adaptive cycle — the “reorganization phase,” a system that “renews itself” (Seidl & Turner 2022). Resemblance to the Spiral may reflect shared conceptual ancestry rather than independent correspondence.\n\nScale can reverse the interpretation: what is replacement for a stand is persistence for a landscape.",
  },
  sources: [
    TURNER_1997,
    TURNER_ROMME_TINKER_2003,
    ROMME_2011,
    TURNER_2016,
    KASHIAN_2005,
    SCHOENNAGEL_2003,
    TINKER_1994,
    ROMME_1982,
    TURNER_2019,
    BRAZIUNAS_2023,
    HARVEY_2016,
    HOECKER_2020,
    HANSEN_TURNER_2019,
    HANSEN_2018,
    TURNER_2022,
    WESTERLING_2011,
    TURNER_2003_ASPEN,
    JOHNSTONE_2016,
    SEIDL_TURNER_2022,
    COOP_2020,
    RATAJCZAK_2018,
    SCHEFFER_2001,
    HOLLING_1973,
    HOLLING_1996,
    HODGSON_2015,
  ],
};
