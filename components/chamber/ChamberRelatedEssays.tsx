import { ConnectionWeb } from "@/components/network";
import { MediumPublicationLink } from "@/components/reading/MediumPublicationLink";
import type { Essay } from "@/lib/content/types";
import { getEssayReadUrl } from "@/lib/content";

interface ChamberRelatedEssaysProps {
  essays: Essay[];
}

/** Grows automatically as essays are connected to the project */
export function ChamberRelatedEssays({ essays }: ChamberRelatedEssaysProps) {
  return (
    <section aria-labelledby="chamber-essays">
      <h2 id="chamber-essays" className="type-folio">
        Read related essays
      </h2>
      <p className="type-body mt-4 max-w-xl text-[0.9375rem]">
        Essays on Medium that orbit this inquiry — mapped here as the network
        grows.
      </p>

      {essays.length > 0 ? (
        <ConnectionWeb
          kind="continues"
          items={essays.map((essay) => ({
            href: getEssayReadUrl(essay),
            title: essay.title,
            subtitle: essay.subtitle ?? essay.excerpt,
            external: true,
          }))}
          className="mt-10"
        />
      ) : (
        <div className="mt-10 border border-rule/50 bg-ivory/40 px-8 py-10">
          <p className="type-body text-[0.9375rem]">
            Essays are being connected to this chamber as they are published on
            Medium. The map will grow over time.
          </p>
          <MediumPublicationLink prominent className="mt-6" />
        </div>
      )}
    </section>
  );
}
