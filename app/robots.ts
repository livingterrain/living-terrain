import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * Public discovery policy for Living Terrain.
 * Allow the public world; keep redirects, prototypes-adjacent utilities,
 * APIs, and experimental surfaces out of crawler focus.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/search",
          "/welcome",
          "/terrain-v2",
          "/atlas-map",
          "/atlas-v1",
          "/library",
          "/library/",
          "/observatory/cinematic",
          "/observatory/legacy",
          "/observatory/proto",
          "/observatory/threads",
          "/observatory/q/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
