"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface WaitlistFormProps {
  source?: "observatory" | "newsletter";
  className?: string;
}

export function WaitlistForm({
  source = "observatory",
  className,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className={cn("type-body text-sm text-forest", className)}>
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-4 border-b border-rule pb-4 sm:flex-row sm:items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading"}
          aria-label="Email address"
          className="flex-1 bg-transparent font-body text-sm text-charcoal placeholder:text-charcoal-faint focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="type-meta shrink-0 text-charcoal transition-colors duration-500 hover:text-forest disabled:opacity-50"
        >
          {status === "loading" ? "Sending…" : "Join waitlist"}
        </button>
      </div>
      {status === "error" && (
        <p className="type-meta text-charcoal-muted">{message}</p>
      )}
    </form>
  );
}
