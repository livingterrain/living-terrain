"use client";

import { TextLink } from "@/components/design-system";
import type { Question } from "@/lib/content/types";
import { ArchiveDrawer } from "./ArchiveDrawer";
import { HomeRoom } from "./HomeRoom";

interface QuestionsSpineRoomProps {
  questions: Question[];
}

export function QuestionsSpineRoom({ questions }: QuestionsSpineRoomProps) {
  return (
    <HomeRoom
      id="inquiries"
      kind="pathways"
      whisper="Everything here returns to a question."
      ariaLabel="Questions"
      className="pb-28 sm:pb-36"
    >
      <div className="relative mx-auto max-w-5xl px-6 pb-8 pt-12 sm:px-10 sm:pt-16">
        {/* The spine — intellectual axis */}
        <div
          className="pointer-events-none absolute bottom-24 left-4 top-12 w-px bg-gradient-to-b from-transparent via-forest/20 to-transparent sm:left-1/2 sm:-translate-x-1/2"
          aria-hidden="true"
        />

        <div className="relative space-y-6 sm:space-y-2">
          {questions.map((question, index) => (
            <ArchiveDrawer
              key={question.id}
              question={question}
              index={index}
              total={questions.length}
            />
          ))}
        </div>

        <div className="mt-20 text-center sm:mt-24">
          <TextLink href="/questions" className="type-body text-sm">
            Follow the paths further
          </TextLink>
        </div>
      </div>
    </HomeRoom>
  );
}
