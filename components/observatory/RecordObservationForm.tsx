"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Theme } from "@/lib/content/types";
import { cn } from "@/lib/utils";

interface RecordObservationFormProps {
  concepts: Theme[];
  className?: string;
}

export function RecordObservationForm({
  concepts,
  className,
}: RecordObservationFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [themeIds, setThemeIds] = useState<string[]>([]);
  const [terrainLocation, setTerrainLocation] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [contributorName, setContributorName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  function toggleConcept(id: string) {
    setThemeIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/observatory/observations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || null,
          body,
          themeIds,
          terrainLocation: terrainLocation.trim() || null,
          anonymous,
          contributorName: anonymous ? null : contributorName.trim() || null,
        }),
      });
      const data = await res.json();

      if (data.success && data.observation) {
        setStatus("success");
        setMessage(data.message);
        router.refresh();
        window.setTimeout(() => {
          router.push(`/observatory/observations/${data.observation.slug}`);
        }, 1200);
      } else {
        setStatus("error");
        setMessage(data.message ?? "The observation could not be recorded.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className={cn("type-body text-[0.9375rem] text-forest", className)}>
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-8", className)}>
      <div>
        <label htmlFor="obs-title" className="type-folio text-charcoal-faint">
          Title <span className="font-normal opacity-60">(optional)</span>
        </label>
        <input
          id="obs-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          disabled={status === "loading"}
          className="mt-3 w-full border-b border-rule/50 bg-transparent py-2 font-heading text-lg text-charcoal placeholder:text-charcoal-faint/40 focus:border-forest/40 focus:outline-none"
          placeholder="A few words, if any"
        />
      </div>

      <div>
        <label htmlFor="obs-body" className="type-folio text-charcoal-faint">
          Observation
        </label>
        <textarea
          id="obs-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          minLength={20}
          maxLength={2400}
          rows={6}
          disabled={status === "loading"}
          className="mt-3 w-full resize-y border-b border-rule/50 bg-transparent py-2 font-body text-[0.9375rem] leading-relaxed text-charcoal placeholder:text-charcoal-faint/40 focus:border-forest/40 focus:outline-none"
          placeholder="What did you notice? Record it without hurry."
        />
      </div>

      <fieldset>
        <legend className="type-folio text-charcoal-faint">
          Concepts connected
        </legend>
        <p className="type-body mt-2 text-[0.8125rem] text-charcoal-muted">
          Which ideas on the terrain does this touch?
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {concepts.map((concept) => {
            const active = themeIds.includes(concept.id);
            return (
              <button
                key={concept.id}
                type="button"
                onClick={() => toggleConcept(concept.id)}
                disabled={status === "loading"}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[0.75rem] tracking-wide transition-colors duration-700",
                  active
                    ? "border-forest/50 bg-forest/5 text-forest"
                    : "border-rule/50 text-charcoal-faint hover:border-forest/30 hover:text-charcoal-muted",
                )}
              >
                {concept.title}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="obs-location" className="type-folio text-charcoal-faint">
          Location in the terrain{" "}
          <span className="font-normal opacity-60">(optional)</span>
        </label>
        <input
          id="obs-location"
          type="text"
          value={terrainLocation}
          onChange={(e) => setTerrainLocation(e.target.value)}
          maxLength={120}
          disabled={status === "loading"}
          className="mt-3 w-full border-b border-rule/50 bg-transparent py-2 font-body text-[0.9375rem] text-charcoal placeholder:text-charcoal-faint/40 focus:border-forest/40 focus:outline-none"
          placeholder="A realm, inquiry, or path where this arose"
        />
      </div>

      <div className="space-y-4 border-t border-rule/30 pt-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            disabled={status === "loading"}
            className="mt-1 accent-forest"
          />
          <span className="type-body text-[0.875rem] text-charcoal-muted">
            Record anonymously — your observation joins the inquiry without a
            name attached.
          </span>
        </label>

        {!anonymous && (
          <div>
            <label
              htmlFor="obs-name"
              className="type-folio text-charcoal-faint"
            >
              Name <span className="font-normal opacity-60">(optional)</span>
            </label>
            <input
              id="obs-name"
              type="text"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              maxLength={60}
              disabled={status === "loading"}
              className="mt-3 w-full border-b border-rule/50 bg-transparent py-2 font-body text-[0.875rem] text-charcoal focus:border-forest/40 focus:outline-none"
              placeholder="How you wish to be credited, if at all"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading" || body.trim().length < 20 || !themeIds.length}
        className="type-body text-[0.875rem] text-charcoal transition-colors duration-700 hover:text-forest disabled:opacity-40"
      >
        {status === "loading" ? "Recording…" : "Add to the Observatory"}
      </button>

      {status === "error" && (
        <p className="type-meta text-charcoal-muted">{message}</p>
      )}
    </form>
  );
}
