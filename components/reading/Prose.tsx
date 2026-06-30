import { cn } from "@/lib/utils";

interface ProseProps {
  children: React.ReactNode;
  className?: string;
}

export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn(
        "prose-content font-body text-base leading-[1.8] text-ink sm:text-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ProseParagraphProps {
  children: React.ReactNode;
}

export function ProseParagraph({ children }: ProseParagraphProps) {
  return <p className="mb-6 last:mb-0">{children}</p>;
}

export function renderBody(body: string) {
  return body.split("\n\n").map((paragraph, index) => (
    <ProseParagraph key={index}>{paragraph}</ProseParagraph>
  ));
}
