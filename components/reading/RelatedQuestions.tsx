import { ConnectionWeb, questionsToConnections } from "@/components/network";

interface ExploresQuestionsProps {
  questionIds: string[];
}

/** @deprecated Use ConnectionWeb directly */
export function RelatedQuestions({ questionIds }: ExploresQuestionsProps) {
  return (
    <ConnectionWeb
      kind="connects"
      items={questionsToConnections(questionIds)}
      className="mt-12"
    />
  );
}
