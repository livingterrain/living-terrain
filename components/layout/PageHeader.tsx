import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { Tag } from "@/components/ui/Tag";

interface PageHeaderProps {
  label?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  label,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <section className="border-b border-border bg-cream-dark/20 py-16 sm:py-24">
      <Container narrow>
        <FadeIn>
          {label && <Tag>{label}</Tag>}
          <h1 className="mt-4 font-heading text-3xl text-balance text-ink sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-ink-muted sm:text-lg">
              {description}
            </p>
          )}
          {children}
        </FadeIn>
      </Container>
    </section>
  );
}
