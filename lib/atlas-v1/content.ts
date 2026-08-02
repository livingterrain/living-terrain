/**
 * Atlas — corpus-backed journey packs (public).
 * Essay bodies are authentic openings/excerpts from published Living Terrain writing.
 * Relationship “why” lines are derived from that writing, not generic UX copy.
 */

export type AtlasV1ConceptId =
  | "body"
  | "relationship"
  | "feedback"
  | "technology"
  | "adaptation"
  | "constraint"
  | "participation"
  | "time"
  | "meaning"
  | "reality";

export type AtlasV1EssayId =
  | "feel-it-in-body"
  | "maintenance-cost"
  | "cost-of-image"
  | "constraint-freedom"
  | "never-restriction"
  | "make-a-loop"
  | "looking-up"
  | "before-tragedy"
  | "second-birth"
  | "structure-beneath";

export type AtlasV1QuestionId =
  | "body-react"
  | "technology-change"
  | "relationships-difficult"
  | "inhabit-time"
  | "before-collapse"
  | "beneath-perception";

export type AtlasV1Concept = {
  id: AtlasV1ConceptId;
  name: string;
  /** One-line fragment — from atlas continents or published writing */
  fragment: string;
  essayId?: AtlasV1EssayId;
};

export type AtlasV1Essay = {
  id: AtlasV1EssayId;
  title: string;
  subtitle?: string;
  /** Authentic excerpt for Evidence — enough to think with */
  body: string[];
};

export type AtlasV1Relation = {
  to: AtlasV1ConceptId;
  why: string;
};

export type AtlasV1Question = {
  id: AtlasV1QuestionId;
  text: string;
  startConceptId: AtlasV1ConceptId;
  /** The one sentence the whole journey exists to leave behind */
  coreReframe: string;
  /** Quieter return of the opening question — not a conclusion */
  closingQuestion: string;
  relations: Partial<Record<AtlasV1ConceptId, AtlasV1Relation[]>>;
  /** Evidence that confirms this journey's reframe at each concept */
  evidence: Partial<Record<AtlasV1ConceptId, AtlasV1EssayId>>;
  unfinishedHint: { from: AtlasV1ConceptId; to: AtlasV1ConceptId; why: string };
};

export const ATLAS_V1_CONCEPTS: Record<AtlasV1ConceptId, AtlasV1Concept> = {
  body: {
    id: "body",
    name: "The Body",
    fragment: "If you feel it before you can explain it — start here.",
    essayId: "feel-it-in-body",
  },
  relationship: {
    id: "relationship",
    name: "Relationship",
    fragment: "We’re rich in attention and poor in relationship.",
    essayId: "before-tragedy",
  },
  feedback: {
    id: "feedback",
    name: "Feedback",
    fragment: "What is my body trying to do?",
    essayId: "maintenance-cost",
  },
  technology: {
    id: "technology",
    name: "Technology",
    fragment: "We’re all carrying cameras now.",
    essayId: "cost-of-image",
  },
  adaptation: {
    id: "adaptation",
    name: "Adaptation",
    fragment: "Nothing was broken — only adapted.",
    essayId: "second-birth",
  },
  constraint: {
    id: "constraint",
    name: "Constraint",
    fragment: "Maybe constraints are what make freedom possible.",
    essayId: "constraint-freedom",
  },
  participation: {
    id: "participation",
    name: "Participation",
    fragment: "The goal was never restriction — it was restoration.",
    essayId: "never-restriction",
  },
  time: {
    id: "time",
    name: "Time",
    fragment: "You have to go far enough to make a loop.",
    essayId: "looking-up",
  },
  meaning: {
    id: "meaning",
    name: "Meaning",
    fragment: "Existential questions wearing everyday clothes.",
    essayId: "make-a-loop",
  },
  reality: {
    id: "reality",
    name: "Reality",
    fragment: "What must already be in place for anything to appear as real?",
    essayId: "structure-beneath",
  },
};

export const ATLAS_V1_ESSAYS: Record<AtlasV1EssayId, AtlasV1Essay> = {
  "feel-it-in-body": {
    id: "feel-it-in-body",
    title: "If You Feel It in Your Body, Start Here",
    subtitle: "On who this work is for",
    body: [
      "If you feel things in your body before you can explain them… If you sense something is off in the modern world… If you’ve tried optimization, religion, medicine, or spirituality and still feel incomplete… you’re in the right place.",
      "I write for people who feel symptoms as signal — who know the body is not malfunctioning, it is responding. I don’t write quick fixes. I write maps.",
      "Breakdown is often transformation in disguise. The nervous system reorganizes identity — and what looks like collapse is sometimes the beginning of becoming.",
      "Not sure where to begin? Start with the one that makes your chest tighten slightly. The one that feels like it was written about you. That’s your entry point. The rest will unfold from there.",
    ],
  },
  "maintenance-cost": {
    id: "maintenance-cost",
    title: "Every Living System Pays a Maintenance Cost",
    subtitle:
      "The invisible work that determines whether living systems merely survive — or become.",
    body: [
      "Last week, my body stopped me.",
      "Not dramatically. Nothing was seriously wrong. But everything hurt. My joints ached. My skin flared. My muscles felt strangely empty. I couldn’t write. I couldn’t read. Nothing sounded enjoyable.",
      "It felt as though my entire body had quietly decided that surviving was more important than everything else.",
      "At first, I did what most of us do. I started looking for the thing to fix. Was I getting sick? Was it hormones? Inflammation? Stress? Food? A virus?",
      "The more I searched, the less interested I became in finding a single answer. Instead, I found myself asking a different question: What is my body trying to do?",
      "One observation keeps returning. My body reorganizes when there is enough energy to support the change. Not when I want it to. Not when I understand it intellectually. When it can afford to.",
      "Years ago, while working as a personal trainer, I became obsessed with muscle adaptation. People often think muscles grow in the gym. They don’t. Training creates the demand. Recovery creates the adaptation. The workout is not the transformation. It’s the invitation.",
      "Without enough food, without enough sleep, without enough time, the body simply spends more energy maintaining itself than rebuilding itself. The blueprint for becoming stronger already exists. The body still has to be able to afford it.",
      "Every living system pays a maintenance cost. Cells maintain themselves. The immune system constantly surveys the body. The heart never stops beating. The brain consumes extraordinary amounts of energy simply remaining awake. Life is expensive — not because something has gone wrong, but because remaining alive requires continuous work.",
      "Maintenance comes first. Whatever remains becomes available for growth.",
      "What if the future isn’t determined only by what a system can produce — but by what it can continually regenerate?",
    ],
  },
  "cost-of-image": {
    id: "cost-of-image",
    title: "There Is a Cost to Becoming an Image",
    subtitle:
      "On Britney Spears, social media, and the temptation to trade personhood for visibility",
    body: [
      "We often ask what happened to Britney Spears. The question lingers decades later because it never really felt answered.",
      "People offer explanations — fame, family, mental illness, exploitation, control, conspiracy. Maybe each contains a piece of the truth.",
      "But lately, I wonder if Britney Spears isn’t the story at all. Maybe she’s the magnifying glass. Maybe what unsettles us isn’t her life specifically. Maybe it’s the uncomfortable recognition that many of us are participating in the same forces in smaller, quieter ways.",
      "Human beings were never meant to become all at once. We were meant to unfold. To try on identities. To embarrass ourselves. To change our minds. To have awkward phases. To fail privately. To grieve. To disappear for a while and return different.",
      "Most of human history allowed for this. You became yourself in relative obscurity. There was room for contradiction. Room for evolution. Room to become.",
      "Then came the cameras. At first, they belonged to celebrities. We watched them from a distance. But celebrities were once anomalies. Now I wonder if they were prototypes.",
      "Because we’re all carrying cameras now. We’re all building versions of ourselves. We’re all learning which parts of ourselves receive approval and which parts are quietly punished.",
      "And little by little, something subtle begins to happen. The question shifts. Instead of asking: Who am I becoming? We begin asking: Who do they want me to be?",
      "Being known is one of the deepest human desires. There is nothing pathological about that. But being consumed is different. Consumption asks how entertaining you are, how useful, how productive — what value you provide.",
      "Because there is a cost to becoming an image. An image cannot evolve naturally. An image has expectations. An image belongs to an audience. An image must remain coherent long after the human being underneath has changed.",
      "We’re all navigating the tension between being known and being consumed. Image promises recognition without relationship. Worth without becoming. Visibility without vulnerability.",
    ],
  },
  "constraint-freedom": {
    id: "constraint-freedom",
    title: "Constraint Is Not the Opposite of Freedom",
    subtitle:
      "What the heart taught me about judgment, discernment, and the structure of life",
    body: [
      "The heart is fascinating.",
      "For most of my life, I assumed important things required a central authority issuing instructions. A boss. A leader. A brain. Something in charge.",
      "Then I learned that the heart does not wait for permission from the brain to beat. Embedded within the heart itself is a small cluster of cells called the sinoatrial node. These cells generate electrical impulses on their own, creating the rhythm that coordinates the rest of the heart.",
      "The more I learned about it, the stranger it seemed.",
      "The heartbeat does not emerge from complete freedom. It emerges from structure. From gradients. From specialized cells remaining distinct. From boundaries being maintained.",
      "Remove the distinctions and the rhythm disappears. Remove the gradients and the current stops flowing. Remove the structure and the system collapses.",
      "That realization forced me to confront something I had spent much of my life assuming: Maybe constraints are not the opposite of freedom. Maybe they are what make freedom possible.",
      "At first, that felt backwards. Most of us experience constraints as something imposed from the outside — something limiting, standing between us and what we want. Yet living systems seemed to be telling a different story. The boundaries were not merely restricting possibilities. They were creating them.",
      "Electricity only flows because gradients exist. A river requires banks. A language requires distinctions between words. Music requires differences between notes. An ecosystem requires specialization.",
      "Life does not emerge from the elimination of distinctions. Life emerges from distinctions entering into relationship.",
      "A song without structure is not freer. It is no longer music. A river without banks is not freer. It is no longer a river. A body without boundaries is not freer. It is no longer alive.",
      "Perhaps wisdom is not learning how to eliminate constraints. Perhaps wisdom is learning which constraints create the possibility for life, meaning, love, and flourishing.",
    ],
  },
  "never-restriction": {
    id: "never-restriction",
    title: "The Goal Was Never Restriction",
    subtitle:
      "Healing was supposed to help us participate in life — not become afraid of it.",
    body: [
      "I sat in my car tonight and ate Taco Bell.",
      "Not exactly the opening line most health coaches would choose. But it’s true. I had worked all day. I hadn’t eaten enough. My body was tired. My stomach was growling. And by the time I finally sat down, I was hungry enough that those tacos felt like a gift.",
      "As I ate, I noticed something. I wasn’t calculating. I wasn’t negotiating. I wasn’t afraid. I was grateful. And that realization hit me harder than the tacos did.",
      "Because lately I’ve been noticing something strange. I sit behind a salon chair and listen to people talk about health all day long. And more and more often, what I hear isn’t health. It’s fear.",
      "Fear of bread. Fear of carbs. Fear of fruit. Fear of eating enough. Fear of gaining weight. Fear of missing a workout. Fear disguised as discipline. Fear disguised as wellness. Fear disguised as optimization.",
      "I’ve restricted foods myself. At one point I eliminated gluten, dairy, and soy. It helped. My symptoms improved. My body calmed down. The restrictions served a purpose. But they were never the destination. They were a bridge.",
      "The goal was never restriction. The goal was restoration.",
      "Somewhere along the way, I think many people lost that distinction. A tool became an identity. A season became a lifestyle. A strategy became a belief system. And what started as healing became shrinking.",
      "I meet people who seem terrified of participating in their own lives. Every restaurant becomes stressful. Every invitation becomes complicated. Every meal becomes a math problem. Every bite becomes a risk assessment.",
      "And I find myself wondering: At what point does health stop serving life and start replacing it?",
      "Because the truth is that life requires participation. It requires energy. It requires nourishment. It requires enough fuel to laugh, love, work, create, play, build, grieve, heal, and show up.",
      "Am I healing so I can participate more fully in life? Or am I trying to control life so thoroughly that I stop participating in it altogether? Those are not the same thing. One expands life. The other shrinks it.",
    ],
  },
  "make-a-loop": {
    id: "make-a-loop",
    title: "You Have to Go Far Enough to Make a Loop",
    subtitle:
      "I used to think something was wrong with me for asking existential questions. Then I realized everyone was asking them — just in different languages.",
    body: [
      "I saw a video the other day that said: You gotta go far enough that you make a loop.",
      "I used to lie awake terrified by questions that everyone else seemed unaffected by. What is life? What happens when we die? If everything is temporary, is any of it real?",
      "So I chased the questions. I thought if I just went far enough, I’d eventually arrive at the answer that would make me stop asking.",
      "Instead, I made a loop. I came back to the same questions. But I wasn’t the same person asking them.",
      "I used to think the goal was to stop asking the questions — to finally find the answer that would quiet them. Now I think the point is to make the loop. To return to the same questions that once terrified you and realize they no longer require an escape plan. Only an honest response.",
      "Maybe the real transformation wasn’t finding answers. Maybe it was discovering that I could live inside the mystery without being consumed by it.",
    ],
  },
  "looking-up": {
    id: "looking-up",
    title: "The Ancient Purpose of Looking Up",
    subtitle:
      "Why have human beings returned to this moment in the sky for thousands of years?",
    body: [
      "Why did human beings keep looking up? Across cultures that never spoke to one another. Across continents. Across thousands of years. People kept assigning meaning to the sky.",
      "I don’t think they all looked up because they believed the heavens controlled them. I think they looked because the sky gave them a language for questions that never stopped being relevant.",
      "I don’t think the greatest gift of the sky has ever been prediction. I think its greatest gift has always been orientation.",
      "And perhaps attention is where everything begins. We cannot pay attention to everything. The moment we place our attention somewhere, we withdraw it from somewhere else. Attention becomes perception. Perception becomes interpretation. Interpretation becomes action. Action becomes habit. Habit becomes character. Character becomes the structures we build.",
      "Perhaps that has always been the purpose of looking up. Not to tell us what tomorrow will bring. But to interrupt yesterday long enough for us to ask a better question.",
    ],
  },
  "before-tragedy": {
    id: "before-tragedy",
    title: "What Happens Before the Tragedy?",
    subtitle: "On fragmentation, formation, and the patterns we fail to see",
    body: [
      "Sometimes a story becomes bigger than the story itself. That’s what happened to me with the Mackenzie Shirilla case.",
      "The details are tragic enough on their own. But what stayed with me wasn’t the crash. It was the question that followed: What produces this? Not one decision. Not one night. Not one person. What kind of environment produces this kind of fragmentation?",
      "Because the more I thought about it, the less it felt like an isolated tragedy and the more it felt like an extreme expression of something I’ve been noticing everywhere — behind the salon chair, in relationships, on social media, in the growing distance between comfort and responsibility, between attention and connection, between freedom and structure.",
      "The crash wasn’t the pattern. The crash was the magnifying glass.",
      "Human beings require formation. We require boundaries. Consequences. Responsibility. Reality. For most of human history, life provided those things whether we wanted them or not.",
      "Today, many young people are growing up with access to more power, more stimulation, more influence, and more freedom than any generation before them. Yet many are receiving less structure. Less guidance. Less initiation. Less friction.",
      "We have become increasingly comfortable giving people what they want while becoming increasingly uncomfortable giving them what they need.",
      "Most destructive patterns do not begin as destruction. They begin as legitimate human needs — love, belonging, significance, connection. Those needs are not the problem. The problem emerges when they become disconnected from reality.",
      "When connection becomes disconnected from truth, it becomes manipulation. When nurturing becomes disconnected from boundaries, it becomes enabling. When relationship becomes disconnected from reality, it becomes control.",
      "This is what fragmentation does. It separates things that were meant to remain connected: freedom from responsibility, power from wisdom, desire from discipline, connection from truth.",
      "We live in a time rich in stimulation but starving for formation — rich in access but poor in wisdom, rich in attention but poor in relationship. Every society must eventually decide whether it will prioritize comfort or formation. Validation or truth. Freedom alone, or the responsibility required to carry it.",
    ],
  },
  "second-birth": {
    id: "second-birth",
    title: "The Second Birth",
    subtitle: "Evidence, Embodiment, and Becoming",
    body: [
      "What does it mean to be born again — not spiritually, but physiologically?",
      "Nothing was broken — only adapted. The system is reorganizing around what it has survived.",
      "The body does not resist change. It resists change it has not yet been made safe for.",
      "Long before a belief changes, thresholds shift — what the system will tolerate, what it will notice, what it will allow to matter. Perception is downstream of capacity.",
      "Reconstruction begins as evidence, continues as embodiment, and only then becomes a self that can stay.",
      "Nothing was broken — only adapted. The work is not repair. It is reorganization.",
    ],
  },
  "structure-beneath": {
    id: "structure-beneath",
    title: "The Structure Beneath Reality",
    subtitle: "An inquiry into what holds the world together",
    body: [
      "Reality appears stable — yet everything within it changes. I’ve been asking what hidden structures allow that stability — the quiet architectures of perception, embodiment, relationship, and meaning that we rarely examine because they work too quietly to notice.",
      "Living Terrain began with a question that would not leave: what must already be in place for anything to appear as real?",
      "Your perception does not simply observe reality. It helps create the reality you experience.",
      "What are the hidden structures that allow reality to remain itself while everything within it changes?",
    ],
  },
};

export const ATLAS_V1_QUESTIONS: AtlasV1Question[] = [
  {
    id: "body-react",
    text: "Why does my body react this way?",
    startConceptId: "body",
    coreReframe:
      "The body is not malfunctioning. It is answering a question you have not finished asking.",
    closingQuestion: "What is my body still trying to finish asking?",
    relations: {
      body: [
        {
          to: "feedback",
          why: "The body is not malfunctioning. It is answering a question you have not finished asking.",
        },
      ],
      feedback: [
        {
          to: "adaptation",
          why: "My body reorganizes when there is enough energy to support the change. Not when I want it to.",
        },
      ],
      adaptation: [
        {
          to: "participation",
          why: "Nothing was broken — only adapted. The work is not repair. It is reorganization.",
        },
      ],
    },
    evidence: {
      body: "feel-it-in-body",
      feedback: "maintenance-cost",
      adaptation: "second-birth",
      participation: "second-birth",
    },
    unfinishedHint: {
      from: "body",
      to: "feedback",
      why: "The body is not malfunctioning. It is answering a question you have not finished asking.",
    },
  },
  {
    id: "technology-change",
    text: "Why does technology change us?",
    startConceptId: "technology",
    coreReframe:
      "Little by little the question shifts from “Who am I becoming?” to “Who do they want me to be?”",
    closingQuestion: "Who am I becoming when no one is watching?",
    relations: {
      technology: [
        {
          to: "relationship",
          why: "Little by little the question shifts from “Who am I becoming?” to “Who do they want me to be?”",
        },
      ],
      relationship: [
        {
          to: "time",
          why: "An image cannot evolve naturally. It must remain coherent long after the human being underneath has changed.",
        },
      ],
    },
    evidence: {
      technology: "cost-of-image",
      relationship: "cost-of-image",
      time: "cost-of-image",
    },
    unfinishedHint: {
      from: "technology",
      to: "relationship",
      why: "Little by little the question shifts from “Who am I becoming?” to “Who do they want me to be?”",
    },
  },
  {
    id: "relationships-difficult",
    text: "Why are relationships so difficult?",
    startConceptId: "relationship",
    coreReframe:
      "When relationship becomes disconnected from reality, it becomes control.",
    closingQuestion: "Where has this connection lost contact with truth?",
    relations: {
      relationship: [
        {
          to: "constraint",
          why: "When relationship becomes disconnected from reality, it becomes control.",
        },
      ],
      constraint: [
        {
          to: "reality",
          why: "When connection becomes disconnected from truth, it becomes manipulation.",
        },
      ],
    },
    evidence: {
      relationship: "before-tragedy",
      constraint: "before-tragedy",
      reality: "before-tragedy",
    },
    unfinishedHint: {
      from: "relationship",
      to: "constraint",
      why: "When relationship becomes disconnected from reality, it becomes control.",
    },
  },
  {
    id: "inhabit-time",
    text: "How do we inhabit time?",
    startConceptId: "time",
    coreReframe:
      "I came back to the same questions. But I wasn’t the same person asking them.",
    closingQuestion: "Which question am I ready to return to?",
    relations: {
      time: [
        {
          to: "meaning",
          why: "I came back to the same questions. But I wasn’t the same person asking them.",
        },
      ],
      meaning: [
        {
          to: "participation",
          why: "Maybe the real transformation wasn’t finding answers. Maybe it was discovering that I could live inside the mystery without being consumed by it.",
        },
      ],
    },
    evidence: {
      time: "make-a-loop",
      meaning: "make-a-loop",
      participation: "make-a-loop",
    },
    unfinishedHint: {
      from: "time",
      to: "meaning",
      why: "I came back to the same questions. But I wasn’t the same person asking them.",
    },
  },
  {
    id: "before-collapse",
    text: "What is forming before the collapse?",
    startConceptId: "relationship",
    coreReframe:
      "The crash wasn’t the pattern. The crash was the magnifying glass.",
    closingQuestion: "What is forming quietly while we still call it comfort?",
    relations: {
      relationship: [
        {
          to: "reality",
          why: "The crash wasn’t the pattern. The crash was the magnifying glass.",
        },
      ],
      reality: [
        {
          to: "constraint",
          why: "We’ve gotten comfortable giving people what they want — and uncomfortable giving them what they need.",
        },
      ],
      constraint: [
        {
          to: "adaptation",
          why: "Most destructive patterns do not begin as destruction. They begin as legitimate human needs — love, belonging, significance, connection — disconnected from reality.",
        },
      ],
    },
    evidence: {
      relationship: "before-tragedy",
      reality: "before-tragedy",
      constraint: "before-tragedy",
      adaptation: "before-tragedy",
    },
    unfinishedHint: {
      from: "relationship",
      to: "reality",
      why: "The crash wasn’t the pattern. The crash was the magnifying glass.",
    },
  },
  {
    id: "beneath-perception",
    text: "What lies beneath perception?",
    startConceptId: "reality",
    coreReframe:
      "Your perception does not simply observe reality. It helps create the reality you experience.",
    closingQuestion: "Where is my attention deciding what gets to be real?",
    relations: {
      reality: [
        {
          to: "constraint",
          why: "Your perception does not simply observe reality. It helps create the reality you experience.",
        },
      ],
      constraint: [
        {
          to: "meaning",
          why: "The moment we place our attention somewhere, we withdraw it from somewhere else.",
        },
      ],
    },
    evidence: {
      reality: "structure-beneath",
      constraint: "structure-beneath",
      meaning: "looking-up",
    },
    unfinishedHint: {
      from: "reality",
      to: "constraint",
      why: "Your perception does not simply observe reality. It helps create the reality you experience.",
    },
  },
];

export function getQuestion(id: AtlasV1QuestionId): AtlasV1Question {
  const question = ATLAS_V1_QUESTIONS.find((q) => q.id === id);
  if (!question) {
    throw new Error(`Unknown Atlas question: ${id}`);
  }
  return question;
}

export function getConcept(id: AtlasV1ConceptId): AtlasV1Concept {
  return ATLAS_V1_CONCEPTS[id];
}

export function getEssay(id: AtlasV1EssayId): AtlasV1Essay {
  const essay = ATLAS_V1_ESSAYS[id];
  if (!essay) {
    throw new Error(`Unknown Atlas essay: ${id}`);
  }
  return essay;
}

/** Essay shown by “This lives in the writing” for a concept on a journey. */
export function resolveEvidenceEssayId(
  question: AtlasV1Question,
  conceptId: AtlasV1ConceptId,
): AtlasV1EssayId | null {
  return question.evidence[conceptId] ?? ATLAS_V1_CONCEPTS[conceptId]?.essayId ?? null;
}

export function relationsFor(
  question: AtlasV1Question,
  conceptId: AtlasV1ConceptId,
): AtlasV1Relation[] {
  /** One relationship per scene — the grammar of Atlas */
  return (question.relations[conceptId] ?? []).slice(0, 1);
}

/**
 * The unfinished edge for pause / “Rest here”.
 * Valid only after the visitor has reached `from` and has not yet walked to `to`.
 * Must not treat corpus adjacency as “already followed” — only the trail does.
 */
export function resolveUnfinishedEdge(
  question: AtlasV1Question,
  trail: readonly AtlasV1ConceptId[],
): AtlasV1Question["unfinishedHint"] | null {
  const hint = question.unfinishedHint;
  if (!trail.includes(hint.from)) return null;
  if (trail.includes(hint.to)) return null;
  return hint;
}
