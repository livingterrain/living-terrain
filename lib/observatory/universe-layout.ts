import type { EssayCluster } from "@/lib/content/terrain";
import type { Essay, FieldNote } from "@/lib/content/types";
import type { GrowingIdea } from "@/lib/observatory/growing-ideas-data";
import type { ObservatoryThread } from "@/lib/observatory/threads-data";

/** Deterministic pseudo-random — stable star positions across builds */
function seeded(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export interface UniverseStar {
  id: string;
  x: number;
  y: number;
  size: number;
  depth: number;
  delay: number;
  decorative?: boolean;
}

export interface ConstellationStar {
  essay: Essay;
  x: number;
  y: number;
  brightness: number;
}

export interface ConstellationLayout {
  id: string;
  label: string;
  whisper: string;
  stars: ConstellationStar[];
  lines: [number, number][];
}

export interface PathwayNode {
  stepIndex: number;
  threadIndex: number;
  x: number;
  y: number;
  title: string;
  href: string;
}

export interface FieldSpark {
  note: FieldNote;
  x: number;
  y: number;
  depth: number;
}

export interface GrowingLight {
  idea: GrowingIdea;
  x: number;
  y: number;
  intensity: number;
}

/** Background star field — hundreds of decorative points */
export function generateStarField(count: number): UniverseStar[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `star-${i}`,
    x: seeded(i * 1.7) * 100,
    y: seeded(i * 2.3) * 100,
    size: seeded(i * 3.1) > 0.92 ? 1.4 : seeded(i * 4.2) > 0.85 ? 0.9 : 0.45,
    depth: seeded(i * 5.5),
    delay: seeded(i * 6.7) * 12,
    decorative: true,
  }));
}

export function layoutConstellations(clusters: EssayCluster[]): ConstellationLayout[] {
  return clusters.map((cluster, ci) => {
    const essays = cluster.essays;
    const stars: ConstellationStar[] = essays.map((essay, ei) => {
      const angle = (ei / Math.max(essays.length, 1)) * Math.PI * 1.6 - Math.PI * 0.3;
      const radius = 18 + seeded(ci * 10 + ei) * 14;
      return {
        essay,
        x: 50 + Math.cos(angle) * radius + (seeded(ci + ei) - 0.5) * 8,
        y: 48 + Math.sin(angle) * radius * 0.65 + (seeded(ei * 2) - 0.5) * 6,
        brightness: 0.55 + seeded(ei * 7) * 0.45,
      };
    });

    const lines: [number, number][] = [];
    for (let i = 0; i < stars.length - 1; i++) {
      lines.push([i, i + 1]);
    }
    if (stars.length > 2) {
      lines.push([stars.length - 1, 0]);
    }

    return {
      id: cluster.question?.id ?? `cluster-${ci}`,
      label: cluster.question?.title ?? "Drifting light",
      whisper:
        cluster.question?.subtitle ??
        cluster.question?.description ??
        "Essays gathered by gravity, not chronology.",
      stars,
      lines,
    };
  });
}

export function layoutPathwayNodes(threads: ObservatoryThread[]): PathwayNode[] {
  const nodes: PathwayNode[] = [];
  threads.forEach((thread, ti) => {
    thread.steps.forEach((step, si) => {
      const t = si / Math.max(thread.steps.length - 1, 1);
      nodes.push({
        stepIndex: si,
        threadIndex: ti,
        x: 12 + ti * 28 + t * 18 + (seeded(ti * 20 + si) - 0.5) * 6,
        y: 18 + ti * 22 + t * 52 + (seeded(si * 11) - 0.5) * 4,
        title: step.title,
        href: step.href,
      });
    });
  });
  return nodes;
}

export function layoutFieldSparks(notes: FieldNote[]): FieldSpark[] {
  return notes.map((note, i) => ({
    note,
    x: 8 + seeded(i * 3.7) * 84,
    y: 12 + seeded(i * 5.1) * 76,
    depth: seeded(i * 2.9),
  }));
}

export function layoutGrowingLights(ideas: GrowingIdea[]): GrowingLight[] {
  const intensityMap = { seed: 0.35, sprout: 0.62, blooming: 0.88 } as const;
  return ideas.map((idea, i) => ({
    idea,
    x: 15 + seeded(i * 4.3) * 70,
    y: 20 + seeded(i * 6.2) * 60,
    intensity: intensityMap[idea.maturity],
  }));
}

/** SVG path through pathway nodes for one thread */
export function threadPathD(
  thread: ObservatoryThread,
  threadIndex: number,
  width: number,
  height: number,
): string {
  if (thread.steps.length === 0) return "";

  const points = thread.steps.map((_, si) => {
    const t = si / Math.max(thread.steps.length - 1, 1);
    const x = (12 + threadIndex * 28 + t * 18) / 100;
    const y = (18 + threadIndex * 22 + t * 52) / 100;
    return { x: x * width, y: y * height };
  });

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2 + (seeded(threadIndex * 30 + i) - 0.5) * 40;
    const cpy = (prev.y + curr.y) / 2;
    d += ` Q ${cpx} ${cpy} ${curr.x} ${curr.y}`;
  }
  return d;
}
