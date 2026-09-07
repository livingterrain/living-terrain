import { ConnectionWeb } from "@/components/network";
import { PublicationLink } from "@/components/reading/PublicationLink";
import { TextLink } from "@/components/design-system";
import type { Essay } from "@/lib/content/types";

interface ChamberRelatedEssaysProps {
  essays: Essay[];
}

/**
 * Related essays stay inside Living Terrain by default.
 * Medium remains a quiet secondary publication link when present.
 */
export function ChamberRelatedEssays({ essays }: ChamberRelatedEssaysProps) {
  return (
    <section aria-labelledby="chamber-essays">
      <h2 id="chamber-essays" className="type-folio">
        Read related essays
      </h2>
      <p className="type-body mt-4 max-w-xl text-[0.9375rem]">
        Essays that orbit this inquiry.
      </p>

      {essays.length > 0 ? (
        <>
          <ConnectionWeb
            kind="continues"
            items={essays.map((essay) => ({
              href: `/essays/${essay.slug}`,
              title: essay.title,
              subtitle: essay.subtitle ?? essay.excerpt,
              external: false,
            }))}
            className="mt-10"
          />
          {essays.some((e) => e.externalUrl) && (
            <div className="mt-8 space-y-3">
              {essays
                .filter((e) => e.externalUrl)
                .map((essay) => (
                  <p
                    key={essay.id}
                    className="type-meta text-[0.8125rem] text-charcoal-faint"
                  >
                    Also on{" "}
                    <TextLink
                      href={essay.externalUrl!}
                      external
                      className="text-[0.8125rem]"
                    >
                      Medium
                    </TextLink>
                    {essays.length > 1 ? ` · ${essay.title}` : ""}
                  </p>
                ))}
            </div>
          )}
        </>
      ) : (
        <div className="mt-10 border border-rule/50 bg-ivory/40 px-8 py-10">
          <p className="type-body text-[0.9375rem]">
            Related essays will appear here as they are connected.
          </p>
          <PublicationLink prominent className="mt-6" />
        </div>
      )}
    </section>
  );
}
