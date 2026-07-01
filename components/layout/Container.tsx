import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "main";
  narrow?: boolean;
}

export function Container({
  children,
  className,
  as: Tag = "div",
  narrow = false,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-full",
        "pl-[max(1.25rem,env(safe-area-inset-left,0px))]",
        "pr-[max(1.25rem,env(safe-area-inset-right,0px))]",
        "sm:pl-12 sm:pr-12 lg:pl-14 lg:pr-14",
        narrow ? "max-w-[40rem]" : "max-w-6xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
