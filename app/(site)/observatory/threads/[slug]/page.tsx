import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ObservatoryCollectionDivider,
  ObservatoryShell,
} from "@/components/observatory/ObservatoryShell";
import {
  getObservatoryThreadBySlug,
  getObservatoryThreads,
} from "@/lib/observatory/threads-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getObservatoryThreads().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const thread = getObservatoryThreadBySlug(slug);
  if (!thread) return { title: "Thread Not Found" };
  return {
    title: thread.title,
    description: thread.premise,
  };
}

export default async function ThreadPage({ params }: PageProps) {
  const { slug } = await params;
  const thread = getObservatoryThreadBySlug(slug);
  if (!thread) notFound();

  return (
    <ObservatoryShell>
      <article className="mx-auto max-w-[36rem] px-7 py-16 sm:px-12 sm:py-24 lg:px-14">
        <header className="text-center">
          <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--obs-amber-dim)]">
            Thread
          </p>
          <h1 className="mt-5 font-heading text-2xl text-[var(--obs-ivory)] sm:text-3xl">
            {thread.title}
          </h1>
          <p className="mx-auto mt-6 max-w-md text-[0.9375rem] leading-[1.85] text-[var(--obs-muted)]">
            {thread.premise}
          </p>
        </header>

        <div className="mt-16">
          <ObservatoryCollectionDivider label="The pathway" />
        </div>

        <ol className="mx-auto mt-12 max-w-sm space-y-0">
          {thread.steps.map((step, index) => (
            <li key={step.slug} className="observatory-path-step py-2">
              <Link
                href={step.href}
                className="group block transition-colors duration-700"
              >
                <p className="text-[0.5625rem] uppercase tracking-[0.14em] text-[var(--obs-faint)]">
                  {index + 1} · {step.kind.replace("-", " ")}
                </p>
                <p className="mt-1 font-heading text-lg text-[var(--obs-ivory)] transition-colors duration-700 group-hover:text-[var(--obs-amber)]">
                  {step.title}
                </p>
              </Link>
            </li>
          ))}
        </ol>

        <nav className="mt-20 space-y-4 border-t border-[var(--obs-border)] pt-10">
          <Link
            href="/observatory"
            className="block text-[0.875rem] text-[var(--obs-muted)] transition-colors duration-700 hover:text-[var(--obs-amber)]"
          >
            ← All threads
          </Link>
          <Link
            href="/"
            className="block text-[0.875rem] text-[var(--obs-faint)] transition-colors duration-700 hover:text-[var(--obs-muted)]"
          >
            ← Return to the terrain
          </Link>
        </nav>
      </article>
    </ObservatoryShell>
  );
}
